import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

// ─── Types ────────────────────────────────────────────────────────────────────
type Dir = 'N' | 'E' | 'S' | 'W'
type TileType = 'E' | 'W' | 'S'
type TileColor = 'N' | 'R' | 'G' | 'B' | 'Y'

type CmdType =
  | 'FWD' | 'LEFT' | 'RIGHT'
  | 'F1' | 'F2'
  | 'PAINT_R' | 'PAINT_G' | 'PAINT_B' | 'PAINT_Y'

type Cond =
  | 'ANY'
  | 'ON_R' | 'ON_G' | 'ON_B' | 'ON_Y'
  | 'NOT_R' | 'NOT_G' | 'NOT_B' | 'NOT_Y'
  | 'WALL' | 'FREE'
  | 'FWD_R' | 'FWD_G' | 'FWD_B' | 'FWD_Y'

type GameStatus = 'idle' | 'running' | 'won' | 'failed'
type Fn = 'main' | 'f1' | 'f2'

interface Tile { t: TileType; c: TileColor }
interface Cmd { type: CmdType; cond: Cond }
interface Program { main: (Cmd | null)[]; f1: (Cmd | null)[]; f2: (Cmd | null)[] }

interface Level {
  id: number
  name: string
  desc: string
  size: number
  layout: Tile[][]
  start: { x: number; y: number }
  startDir: Dir
  cmds: CmdType[]
  mSlots: number
  f1Slots: number
  f2Slots: number
  stars: number
  hint: string
}

interface Frame {
  pos: { x: number; y: number }
  dir: Dir
  grid: Tile[][]
  collected: string[]
  fn: Fn
  pc: number
  status: 'running' | 'won' | 'failed'
  msg: string
}

// ─── Tile Factories ───────────────────────────────────────────────────────────
const e = (c: TileColor = 'N'): Tile => ({ t: 'E', c })
const w = (): Tile => ({ t: 'W', c: 'N' })
const s = (c: TileColor = 'N'): Tile => ({ t: 'S', c })
const _ = e()
const W = w()

// ─── Level Definitions ────────────────────────────────────────────────────────
const LEVELS: Level[] = [
  {
    id: 1, name: 'Straight Line', size: 5,
    desc: 'Guide the robot (▲) to the star (★). Select a command, place it in a slot, then press Run.',
    layout: [
      [_,_,_,_,_],
      [_,_,_,_,_],
      [_,_,s(),_,_],
      [_,_,_,_,_],
      [_,_,_,_,_],
    ],
    start: { x: 2, y: 4 }, startDir: 'N',
    cmds: ['FWD'], mSlots: 4, f1Slots: 0, f2Slots: 0, stars: 1,
    hint: 'Add Move Forward to the first two slots, then press Run. The star is 2 steps north.',
  },
  {
    id: 2, name: 'First Turn', size: 5,
    desc: 'Two stars wait around the corner. Learn to turn right and collect both.',
    layout: [
      [_,_,_,s(),s()],
      [_,_,_,_,_],
      [_,_,_,_,_],
      [_,_,_,_,_],
      [_,_,_,_,_],
    ],
    start: { x: 2, y: 3 }, startDir: 'N',
    cmds: ['FWD', 'RIGHT'], mSlots: 6, f1Slots: 0, f2Slots: 0, stars: 2,
    hint: 'Move Forward 3 times to reach row 0, then Turn Right, then Move Forward 2 more times.',
  },
  {
    id: 3, name: 'Loop Harder', size: 6,
    desc: 'Five stars in a row. Your program has only 1 main slot — use F1 to repeat!',
    layout: [
      [_,_,_,_,_,_],
      [_,s(),s(),s(),s(),s()],
      [_,_,_,_,_,_],
      [_,_,_,_,_,_],
      [_,_,_,_,_,_],
      [_,_,_,_,_,_],
    ],
    start: { x: 0, y: 1 }, startDir: 'E',
    cmds: ['FWD', 'RIGHT', 'F1'], mSlots: 1, f1Slots: 2, f2Slots: 0, stars: 5,
    hint: 'Main: [Call F1]. F1: [Move Forward, Call F1]. F1 calls itself to loop, collecting each star.',
  },
  {
    id: 4, name: 'Blue Means Turn', size: 5,
    desc: 'Blue tiles mark the corners. Use conditional logic: turn right only when on a blue tile.',
    layout: [
      [_,_,_,_,_],
      [_,s('B'),s(),s('B'),_],
      [_,s(),_,s(),_],
      [_,s('B'),s(),s('B'),_],
      [_,_,_,_,_],
    ],
    start: { x: 1, y: 1 }, startDir: 'E',
    cmds: ['FWD', 'RIGHT', 'F1'], mSlots: 1, f1Slots: 4, f2Slots: 0, stars: 8,
    hint: 'Main: [Call F1]. F1: [Move Forward, Turn Right (if On Blue), Call F1]. Loop the perimeter turning at corners.',
  },
  {
    id: 5, name: 'Zig Zag', size: 6,
    desc: 'Red tiles and star tiles form a diagonal. Turn based on the tile color beneath you.',
    layout: [
      [_,_,_,_,s('R'),_],
      [_,_,_,s('R'),e('R'),_],
      [_,_,s('R'),e('R'),_,_],
      [_,s('R'),e('R'),_,_,_],
      [_,e('R'),_,_,_,_],
      [_,_,_,_,_,_],
    ],
    start: { x: 0, y: 4 }, startDir: 'E',
    cmds: ['FWD', 'RIGHT', 'LEFT', 'F1'], mSlots: 1, f1Slots: 5, f2Slots: 0, stars: 4,
    hint: 'F1: [Move Forward, Turn Right (if On Green... wait, try: Turn Left if On Red, Call F1 if No Wall Ahead]. The red path shows where to go diagonally.',
  },
  {
    id: 6, name: 'Walls Introduced', size: 7,
    desc: 'Walls block direct paths. Use wall detection: turn right whenever a wall is directly ahead.',
    layout: [
      [W,W,W,W,W,W,W],
      [W,s(),_,_,_,s(),W],
      [W,_,W,W,W,_,W],
      [W,_,W,s(),_,_,W],
      [W,_,W,W,W,W,W],
      [W,s(),_,_,_,_,W],
      [W,W,W,W,W,W,W],
    ],
    start: { x: 5, y: 5 }, startDir: 'W',
    cmds: ['FWD', 'RIGHT', 'F1'], mSlots: 1, f1Slots: 4, f2Slots: 0, stars: 4,
    hint: 'Main: [Call F1]. F1: [Turn Right (if Wall Ahead), Move Forward, Call F1]. The robot hugs the inner wall, turning right when blocked.',
  },
  {
    id: 7, name: 'Ring Collector', size: 5,
    desc: 'Eight stars form a ring around an empty center. Navigate the perimeter to collect them all.',
    layout: [
      [W,W,W,W,W],
      [W,s(),s(),s(),W],
      [W,s(),_,s(),W],
      [W,s(),s(),s(),W],
      [W,W,W,W,W],
    ],
    start: { x: 2, y: 2 }, startDir: 'N',
    cmds: ['FWD', 'RIGHT', 'LEFT', 'F1'], mSlots: 1, f1Slots: 3, f2Slots: 0, stars: 8,
    hint: 'F1: [Move Forward, Turn Right (if Wall Ahead), Call F1]. The robot spirals the ring by turning right whenever it would hit a wall.',
  },
  {
    id: 8, name: 'Paint Trail', size: 6,
    desc: 'Paint tiles red as you go to mark visited spots. Avoid revisiting — use red to navigate!',
    layout: [
      [W,W,W,W,W,W],
      [W,_,s(),s(),s(),W],
      [W,s(),s(),s(),s(),W],
      [W,s(),s(),s(),s(),W],
      [W,s(),s(),s(),s(),W],
      [W,W,W,W,W,W],
    ],
    start: { x: 1, y: 1 }, startDir: 'E',
    cmds: ['FWD', 'RIGHT', 'LEFT', 'PAINT_R', 'F1'], mSlots: 1, f1Slots: 5, f2Slots: 0, stars: 15,
    hint: 'F1: [Paint Red, Turn Right (if Red Ahead), Turn Right (if Wall Ahead), Move Forward, Call F1]. Paint behind, avoid red-painted and walls.',
  },
  {
    id: 9, name: 'Color Navigator', size: 5,
    desc: 'Blue and green corners change direction. Use color conditions to branch your path.',
    layout: [
      [s('B'),s(),s(),s(),s('B')],
      [s(),_,_,_,s()],
      [s(),_,_,_,_],
      [s('B'),s(),s(),s(),s('G')],
      [_,_,_,_,_],
    ],
    start: { x: 4, y: 4 }, startDir: 'N',
    cmds: ['FWD', 'RIGHT', 'LEFT', 'F1'], mSlots: 2, f1Slots: 4, f2Slots: 0, stars: 13,
    hint: 'Start with Turn Left, then Call F1. F1: [Move Forward, Turn Left (if On Green), Turn Right (if On Blue), Call F1]. Navigate the grid using corner colors.',
  },
  {
    id: 10, name: 'Spiral Inward', size: 7,
    desc: 'Blue tiles form an outer ring. A star waits at the center. Follow the blue path inward.',
    layout: [
      [_,_,_,_,_,_,_],
      [_,e('B'),e('B'),e('B'),e('B'),e('B'),_],
      [_,e('B'),_,_,_,e('B'),_],
      [_,e('B'),_,s(),_,e('B'),_],
      [_,e('B'),_,_,_,e('B'),_],
      [_,e('B'),e('B'),e('B'),e('B'),e('B'),_],
      [_,_,_,_,_,_,_],
    ],
    start: { x: 1, y: 1 }, startDir: 'E',
    cmds: ['FWD', 'RIGHT', 'F1'], mSlots: 1, f1Slots: 4, f2Slots: 0, stars: 1,
    hint: 'F1: [Move Forward, Turn Right (if Blue Ahead), Call F1]. The robot turns right when it sees blue ahead, spiraling to the center.',
  },
  {
    id: 11, name: 'Maze Walker', size: 8,
    desc: 'A winding maze with two stars. Use the wall-follower algorithm to navigate through.',
    layout: [
      [W,W,W,W,W,W,W,W],
      [W,s(),_,_,_,_,_,W],
      [W,W,W,W,W,W,_,W],
      [W,_,_,_,_,_,_,W],
      [W,_,W,W,W,W,W,W],
      [W,_,_,_,_,_,s(),W],
      [W,W,W,W,W,W,W,W],
      [W,W,W,W,W,W,W,W],
    ],
    start: { x: 6, y: 3 }, startDir: 'W',
    cmds: ['FWD', 'RIGHT', 'LEFT', 'F1'], mSlots: 1, f1Slots: 5, f2Slots: 0, stars: 2,
    hint: 'F1: [Turn Right (if Wall Ahead), Turn Left (if Free), Move Forward, Call F1]. Navigate by always trying to keep a wall on your left.',
  },
  {
    id: 12, name: 'Double Spiral', size: 8,
    desc: 'Two nested rings: blue outer, green inner. Use F1 for the outer loop and F2 for the inner.',
    layout: [
      [W,W,W,W,W,W,W,W],
      [W,e('B'),e('B'),e('B'),e('B'),e('B'),e('B'),W],
      [W,e('B'),e('G'),e('G'),e('G'),e('G'),e('B'),W],
      [W,e('B'),e('G'),s(),s(),e('G'),e('B'),W],
      [W,e('B'),e('G'),s(),s(),e('G'),e('B'),W],
      [W,e('B'),e('G'),e('G'),e('G'),e('G'),e('B'),W],
      [W,e('B'),e('B'),e('B'),e('B'),e('B'),e('B'),W],
      [W,W,W,W,W,W,W,W],
    ],
    start: { x: 1, y: 1 }, startDir: 'E',
    cmds: ['FWD', 'RIGHT', 'LEFT', 'F1', 'F2'], mSlots: 1, f1Slots: 4, f2Slots: 4, stars: 4,
    hint: 'Main: [F1]. F1: [Move Forward, Turn Right (if Blue Ahead), Call F2 (if Green Ahead), Call F1 (not on green)]. F2: [Move Forward, Turn Right (if Green Ahead), Call F2].',
  },
  {
    id: 13, name: 'Paint to Escape', size: 7,
    desc: 'A square maze. Paint tiles blue to mark visited paths and avoid infinite loops.',
    layout: [
      [W,W,W,W,W,W,W],
      [W,_,_,_,_,_,W],
      [W,_,W,W,W,_,W],
      [W,_,W,s(),W,_,W],
      [W,_,W,W,W,_,W],
      [W,_,_,_,_,_,W],
      [W,W,W,W,W,W,W],
    ],
    start: { x: 3, y: 3 }, startDir: 'N',
    cmds: ['FWD', 'RIGHT', 'PAINT_B', 'F1'], mSlots: 1, f1Slots: 5, f2Slots: 0, stars: 1,
    hint: 'F1: [Paint Blue, Turn Right (if Blue Ahead), Move Forward, Call F1]. Paint where you\'ve been, turn right to avoid revisited tiles.',
  },
  {
    id: 14, name: 'Binary Split', size: 8,
    desc: 'Two colored zones branch the path. Use mutual recursion: F1 handles red, F2 handles blue.',
    layout: [
      [W,W,W,W,W,W,W,W],
      [W,_,_,e('R'),e('R'),e('R'),_,W],
      [W,_,_,e('R'),s(),e('R'),_,W],
      [W,s(),_,_,_,_,_,W],
      [W,_,_,e('B'),s(),e('B'),_,W],
      [W,_,_,e('B'),e('B'),e('B'),_,W],
      [W,_,_,_,_,_,_,W],
      [W,W,W,W,W,W,W,W],
    ],
    start: { x: 4, y: 6 }, startDir: 'N',
    cmds: ['FWD', 'RIGHT', 'LEFT', 'F1', 'F2'], mSlots: 1, f1Slots: 4, f2Slots: 4, stars: 3,
    hint: 'Main: [F1]. F1: [Move Forward, Turn Right (if On Red), Call F2]. F2: [Move Forward, Turn Left (if On Blue), Call F1]. The two functions alternate based on zone color.',
  },
  {
    id: 15, name: 'Box Fill', size: 8,
    desc: 'Fill the entire interior with paint by following a spiral path. 36 stars to collect!',
    layout: [
      [W,W,W,W,W,W,W,W],
      [W,s(),s(),s(),s(),s(),s(),W],
      [W,s(),s(),s(),s(),s(),s(),W],
      [W,s(),s(),s(),s(),s(),s(),W],
      [W,s(),s(),s(),s(),s(),s(),W],
      [W,s(),s(),s(),s(),s(),s(),W],
      [W,s(),s(),s(),s(),s(),s(),W],
      [W,W,W,W,W,W,W,W],
    ],
    start: { x: 2, y: 2 }, startDir: 'E',
    cmds: ['FWD', 'RIGHT', 'PAINT_R', 'F1'], mSlots: 1, f1Slots: 6, f2Slots: 0, stars: 36,
    hint: 'F1: [Paint Red, Turn Right (if Red Ahead), Turn Right (if Wall Ahead), Move Forward, Call F1]. Paint and spiral: avoid painted and walls.',
  },
  {
    id: 16, name: 'Algorithm Master', size: 10,
    desc: 'Three concentric rings: blue, red, and green. Navigate all zones to collect the 4 inner stars.',
    layout: [
      [W,W,W,W,W,W,W,W,W,W],
      [W,e('B'),e('B'),e('B'),e('B'),e('B'),e('B'),e('B'),e('B'),W],
      [W,e('B'),e('R'),e('R'),e('R'),e('R'),e('R'),e('R'),e('B'),W],
      [W,e('B'),e('R'),e('G'),e('G'),e('G'),e('G'),e('R'),e('B'),W],
      [W,e('B'),e('R'),e('G'),s(),s(),e('G'),e('R'),e('B'),W],
      [W,e('B'),e('R'),e('G'),s(),s(),e('G'),e('R'),e('B'),W],
      [W,e('B'),e('R'),e('G'),e('G'),e('G'),e('G'),e('R'),e('B'),W],
      [W,e('B'),e('R'),e('R'),e('R'),e('R'),e('R'),e('R'),e('B'),W],
      [W,e('B'),e('B'),e('B'),e('B'),e('B'),e('B'),e('B'),e('B'),W],
      [W,W,W,W,W,W,W,W,W,W],
    ],
    start: { x: 1, y: 1 }, startDir: 'E',
    cmds: ['FWD', 'RIGHT', 'LEFT', 'F1', 'F2', 'PAINT_G'], mSlots: 1, f1Slots: 6, f2Slots: 6, stars: 4,
    hint: 'Main: [F1]. F1: [Move Forward, Turn Right (if On Blue), Call F2]. F2: [Move Forward, Turn Right (if On Red), Call F1]. Navigate the rings by switching functions at color boundaries.',
  },
]

// ─── UI Constants ─────────────────────────────────────────────────────────────
const ARROW: Record<Dir, string> = { N: '▲', E: '▶', S: '▼', W: '◀' }

const CMD_LABEL: Record<CmdType, string> = {
  FWD: '▲ Forward', LEFT: '↺ Left', RIGHT: '↻ Right',
  F1: '⟳ Call F1', F2: '⟳ Call F2',
  PAINT_R: '🎨 Paint Red', PAINT_G: '🎨 Paint Green',
  PAINT_B: '🎨 Paint Blue', PAINT_Y: '🎨 Paint Yellow',
}
const CMD_SHORT: Record<CmdType, string> = {
  FWD: '▲ Fwd', LEFT: '↺ Left', RIGHT: '↻ Right',
  F1: '⟳ F1', F2: '⟳ F2',
  PAINT_R: '🎨 Red', PAINT_G: '🎨 Green',
  PAINT_B: '🎨 Blue', PAINT_Y: '🎨 Yellow',
}
const CMD_PALETTE_CLS: Record<CmdType, string> = {
  FWD:     'bg-sky-500 border-sky-400 text-white',
  LEFT:    'bg-violet-500 border-violet-400 text-white',
  RIGHT:   'bg-orange-500 border-orange-400 text-white',
  F1:      'bg-purple-600 border-purple-500 text-white',
  F2:      'bg-pink-600 border-pink-500 text-white',
  PAINT_R: 'bg-red-500 border-red-400 text-white',
  PAINT_G: 'bg-green-500 border-green-400 text-white',
  PAINT_B: 'bg-blue-500 border-blue-400 text-white',
  PAINT_Y: 'bg-yellow-500 border-yellow-400 text-white',
}
const CMD_SLOT_CLS: Record<CmdType, string> = {
  FWD:     'bg-sky-50 border-sky-300 text-sky-700',
  LEFT:    'bg-violet-50 border-violet-300 text-violet-700',
  RIGHT:   'bg-orange-50 border-orange-300 text-orange-700',
  F1:      'bg-purple-50 border-purple-300 text-purple-700',
  F2:      'bg-pink-50 border-pink-300 text-pink-700',
  PAINT_R: 'bg-red-50 border-red-300 text-red-700',
  PAINT_G: 'bg-green-50 border-green-300 text-green-700',
  PAINT_B: 'bg-blue-50 border-blue-300 text-blue-700',
  PAINT_Y: 'bg-yellow-50 border-yellow-300 text-yellow-700',
}

const TILE_BG: Record<TileColor, string> = {
  N: 'bg-pampas-warm border-muted/25',
  R: 'bg-red-100 border-red-300',
  G: 'bg-green-100 border-green-300',
  B: 'bg-blue-100 border-blue-300',
  Y: 'bg-yellow-100 border-yellow-300',
}

const COND_LABEL: Record<Cond, string> = {
  ANY: 'Always', ON_R: 'On Red', ON_G: 'On Green', ON_B: 'On Blue', ON_Y: 'On Yellow',
  NOT_R: 'Not Red', NOT_G: 'Not Green', NOT_B: 'Not Blue', NOT_Y: 'Not Yellow',
  WALL: 'Wall Ahead', FREE: 'No Wall', FWD_R: 'Red Ahead', FWD_G: 'Green Ahead',
  FWD_B: 'Blue Ahead', FWD_Y: 'Yellow Ahead',
}
const COND_SHORT: Record<Cond, string> = {
  ANY: '', ON_R: 'OnR', ON_G: 'OnG', ON_B: 'OnB', ON_Y: 'OnY',
  NOT_R: '!R', NOT_G: '!G', NOT_B: '!B', NOT_Y: '!Y',
  WALL: 'Wall', FREE: 'Free', FWD_R: 'R→', FWD_G: 'G→', FWD_B: 'B→', FWD_Y: 'Y→',
}
const COND_CLS: Record<Cond, string> = {
  ANY: 'bg-muted/20 text-foreground/60',
  ON_R: 'bg-red-400 text-white', ON_G: 'bg-green-500 text-white',
  ON_B: 'bg-blue-500 text-white', ON_Y: 'bg-yellow-400 text-yellow-900',
  NOT_R: 'bg-red-200 text-red-700', NOT_G: 'bg-green-200 text-green-700',
  NOT_B: 'bg-blue-200 text-blue-700', NOT_Y: 'bg-yellow-200 text-yellow-800',
  WALL: 'bg-charcoal text-white', FREE: 'bg-sage text-white',
  FWD_R: 'bg-red-400 text-white', FWD_G: 'bg-green-500 text-white',
  FWD_B: 'bg-blue-500 text-white', FWD_Y: 'bg-yellow-400 text-yellow-900',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function nextPos(pos: { x: number; y: number }, dir: Dir) {
  const d = ({ N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] } as const)[dir]
  return { x: pos.x + d[0], y: pos.y + d[1] }
}
function turnRight(d: Dir): Dir { return ({ N: 'E', E: 'S', S: 'W', W: 'N' } as const)[d] }
function turnLeft(d: Dir): Dir  { return ({ N: 'W', W: 'S', S: 'E', E: 'N' } as const)[d] }
function isOOB(pos: { x: number; y: number }, size: number) {
  return pos.x < 0 || pos.x >= size || pos.y < 0 || pos.y >= size
}
function deepGrid(g: Tile[][]): Tile[][] {
  return g.map(row => row.map(t => ({ ...t })))
}

function checkCond(cond: Cond, pos: { x: number; y: number }, dir: Dir, grid: Tile[][], size: number): boolean {
  if (cond === 'ANY') return true
  const tile = grid[pos.y][pos.x]
  if (cond === 'ON_R') return tile.c === 'R'
  if (cond === 'ON_G') return tile.c === 'G'
  if (cond === 'ON_B') return tile.c === 'B'
  if (cond === 'ON_Y') return tile.c === 'Y'
  if (cond === 'NOT_R') return tile.c !== 'R'
  if (cond === 'NOT_G') return tile.c !== 'G'
  if (cond === 'NOT_B') return tile.c !== 'B'
  if (cond === 'NOT_Y') return tile.c !== 'Y'
  const fwd = nextPos(pos, dir)
  const oob = isOOB(fwd, size)
  if (cond === 'WALL') return !oob && grid[fwd.y][fwd.x].t === 'W'
  if (cond === 'FREE') return oob || grid[fwd.y][fwd.x].t !== 'W'
  if (cond === 'FWD_R') return !oob && grid[fwd.y][fwd.x].c === 'R'
  if (cond === 'FWD_G') return !oob && grid[fwd.y][fwd.x].c === 'G'
  if (cond === 'FWD_B') return !oob && grid[fwd.y][fwd.x].c === 'B'
  if (cond === 'FWD_Y') return !oob && grid[fwd.y][fwd.x].c === 'Y'
  return true
}

// Compute available conditions for a level based on its tiles and commands
function getLevelConditions(level: Level): Cond[] {
  const colors = new Set<TileColor>()
  let hasWalls = false
  for (const row of level.layout)
    for (const tile of row) {
      if (tile.c !== 'N') colors.add(tile.c)
      if (tile.t === 'W') hasWalls = true
    }
  if (level.cmds.includes('PAINT_R')) colors.add('R')
  if (level.cmds.includes('PAINT_G')) colors.add('G')
  if (level.cmds.includes('PAINT_B')) colors.add('B')
  if (level.cmds.includes('PAINT_Y')) colors.add('Y')

  const conds: Cond[] = ['ANY']
  for (const c of ['R','G','B','Y'] as TileColor[]) {
    if (colors.has(c)) {
      conds.push(`ON_${c}` as Cond)
      conds.push(`NOT_${c}` as Cond)
      conds.push(`FWD_${c}` as Cond)
    }
  }
  if (hasWalls || level.cmds.includes('FWD')) {
    conds.push('WALL')
    conds.push('FREE')
  }
  return conds
}

// ─── Simulation Engine ────────────────────────────────────────────────────────
const MAX_STEPS = 1200
const MAX_STACK = 60

function computeTrace(program: Program, level: Level): Frame[] {
  const frames: Frame[] = []
  let pos = { ...level.start }
  let dir = level.startDir
  let grid = deepGrid(level.layout)
  let collected: string[] = []
  let stack: { func: Fn; pc: number }[] = []
  let curFn: Fn = 'main'
  let pc = 0

  const pushFrame = (status: Frame['status'] = 'running', msg = '') => {
    frames.push({ pos: { ...pos }, dir, grid: deepGrid(grid), collected: [...collected], fn: curFn, pc, status, msg })
  }

  for (let step = 0; step < MAX_STEPS; step++) {
    const cmds = program[curFn]

    // Function return
    if (pc >= cmds.length) {
      if (stack.length === 0) {
        const status = collected.length >= level.stars ? 'won' : 'failed'
        const msg = status === 'failed' ? `Collected ${collected.length} / ${level.stars} stars. Try again!` : ''
        pushFrame(status, msg)
        return frames
      }
      const ret = stack[stack.length - 1]
      stack = stack.slice(0, -1)
      curFn = ret.func
      pc = ret.pc
      continue
    }

    const cmd = cmds[pc]

    // Empty slot — skip silently
    if (!cmd) { pc++; continue }

    // Check condition
    if (!checkCond(cmd.cond, pos, dir, grid, level.size)) {
      pushFrame('running') // show skip highlight
      pc++
      continue
    }

    // Show pre-execution highlight
    pushFrame('running')

    // Execute
    if (cmd.type === 'FWD') {
      const np = nextPos(pos, dir)
      if (isOOB(np, level.size) || grid[np.y][np.x].t === 'W') {
        pushFrame('failed', 'Robot hit a wall or boundary!')
        return frames
      }
      pos = np
      const key = `${pos.x},${pos.y}`
      if (grid[pos.y][pos.x].t === 'S' && !collected.includes(key)) {
        collected = [...collected, key]
        if (collected.length >= level.stars) {
          pushFrame('won')
          return frames
        }
      }
      pc++
    } else if (cmd.type === 'LEFT') {
      dir = turnLeft(dir)
      pc++
    } else if (cmd.type === 'RIGHT') {
      dir = turnRight(dir)
      pc++
    } else if (cmd.type === 'F1') {
      if (stack.length >= MAX_STACK) { pushFrame('failed', 'Stack overflow! Infinite recursion detected.'); return frames }
      stack = [...stack, { func: curFn, pc: pc + 1 }]
      curFn = 'f1'
      pc = 0
    } else if (cmd.type === 'F2') {
      if (stack.length >= MAX_STACK) { pushFrame('failed', 'Stack overflow! Infinite recursion detected.'); return frames }
      stack = [...stack, { func: curFn, pc: pc + 1 }]
      curFn = 'f2'
      pc = 0
    } else if (cmd.type.startsWith('PAINT_')) {
      const colorMap: Record<string, TileColor> = { PAINT_R: 'R', PAINT_G: 'G', PAINT_B: 'B', PAINT_Y: 'Y' }
      const col = colorMap[cmd.type]
      grid = grid.map((row, gy) => gy === pos.y
        ? row.map((t, gx) => gx === pos.x ? { ...t, c: col } : t)
        : row
      )
      pc++
    }
  }

  pushFrame('failed', 'Too many steps! Check for infinite loops.')
  return frames
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function LogicGame() {
  const [completedLevels, setCompletedLevels] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem('cbc-logic-completed-v2')
      return saved ? new Set(JSON.parse(saved) as number[]) : new Set<number>()
    } catch { return new Set<number>() }
  })

  const [currentIdx, setCurrentIdx] = useState(0)
  const level = LEVELS[currentIdx]

  const makeEmptyProgram = (lvl: Level): Program => ({
    main: Array(lvl.mSlots).fill(null),
    f1:   Array(lvl.f1Slots).fill(null),
    f2:   Array(lvl.f2Slots).fill(null),
  })

  const [program, setProgram] = useState<Program>(() => makeEmptyProgram(LEVELS[0]))
  const [robotPos, setRobotPos] = useState(LEVELS[0].start)
  const [robotDir, setRobotDir] = useState<Dir>(LEVELS[0].startDir)
  const [gridState, setGridState] = useState<Tile[][]>(() => deepGrid(LEVELS[0].layout))
  const [collected, setCollected] = useState<string[]>([])
  const [activeSlotFn, setActiveSlotFn] = useState<Fn>('main')
  const [activeSlotPc, setActiveSlotPc] = useState(-1)
  const [status, setStatus] = useState<GameStatus>('idle')
  const [message, setMessage] = useState('')
  const [activeCmd, setActiveCmd] = useState<CmdType | null>(null)
  const [activeCond, setActiveCond] = useState<Cond>('ANY')
  const [showHint, setShowHint] = useState(false)

  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = [] }
  useEffect(() => () => clearTimers(), [])

  const isUnlocked = (idx: number) => idx === 0 || completedLevels.has(idx)

  const loadLevel = (idx: number) => {
    if (!isUnlocked(idx)) return
    clearTimers()
    const lvl = LEVELS[idx]
    setCurrentIdx(idx)
    setProgram(makeEmptyProgram(lvl))
    setRobotPos(lvl.start)
    setRobotDir(lvl.startDir)
    setGridState(deepGrid(lvl.layout))
    setCollected([])
    setActiveSlotFn('main')
    setActiveSlotPc(-1)
    setStatus('idle')
    setMessage('')
    setActiveCmd(null)
    setActiveCond('ANY')
    setShowHint(false)
  }

  const resetGame = () => {
    clearTimers()
    setProgram(makeEmptyProgram(level))
    setRobotPos(level.start)
    setRobotDir(level.startDir)
    setGridState(deepGrid(level.layout))
    setCollected([])
    setActiveSlotFn('main')
    setActiveSlotPc(-1)
    setStatus('idle')
    setMessage('')
    setActiveCmd(null)
    setActiveCond('ANY')
  }

  const handleSlotClick = (fn: Fn, idx: number) => {
    if (status !== 'idle') return
    if (activeCmd) {
      setProgram(prev => ({
        ...prev,
        [fn]: prev[fn].map((c, i) => i === idx ? { type: activeCmd, cond: activeCond } : c)
      }))
    } else {
      // cycle through commands if no active cmd
      const cmdsForFn = level.cmds
      setProgram(prev => ({
        ...prev,
        [fn]: prev[fn].map((c, i) => {
          if (i !== idx) return c
          if (!c) return { type: cmdsForFn[0], cond: 'ANY' }
          const ci = cmdsForFn.indexOf(c.type)
          return ci < cmdsForFn.length - 1
            ? { type: cmdsForFn[ci + 1], cond: c.cond }
            : null
        })
      }))
    }
  }

  const clearSlot = (fn: Fn, idx: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (status !== 'idle') return
    setProgram(prev => ({ ...prev, [fn]: prev[fn].map((c, i) => i === idx ? null : c) }))
  }

  const runGame = () => {
    if (status !== 'idle') return
    clearTimers()
    const frames = computeTrace(program, level)
    setStatus('running')
    setMessage('')
    frames.forEach((frame, i) => {
      const t = setTimeout(() => {
        setRobotPos(frame.pos)
        setRobotDir(frame.dir)
        setGridState(frame.grid)
        setCollected(frame.collected)
        setActiveSlotFn(frame.fn)
        setActiveSlotPc(frame.pc)
        setStatus(frame.status as GameStatus)
        setMessage(frame.msg)
        if (frame.status === 'won') {
          const next = new Set([...completedLevels, currentIdx + 1]) // unlock next
          setCompletedLevels(next)
          try { localStorage.setItem('cbc-logic-completed-v2', JSON.stringify([...next])) } catch { /* noop */ }
        }
      }, (i + 1) * 380)
      timers.current.push(t)
    })
  }

  const stopGame = () => {
    clearTimers()
    setStatus('idle')
    setRobotPos(level.start)
    setRobotDir(level.startDir)
    setGridState(deepGrid(level.layout))
    setCollected([])
    setActiveSlotFn('main')
    setActiveSlotPc(-1)
    setMessage('')
  }

  const availableConditions = getLevelConditions(level)
  const hasFunctions = level.f1Slots > 0 || level.f2Slots > 0

  // Cell size based on grid size
  const cellSize = Math.max(28, Math.min(52, Math.floor(260 / level.size)))

  return (
    <div className="min-h-screen bg-pampas">

      {/* ── Page header ── */}
      <div className="border-b border-muted/20 bg-cream">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-muted transition-colors hover:text-foreground">
              ← Home
            </Link>
            <span className="text-muted/30">|</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary">
              🧠 Logic Challenge
            </span>
          </div>
          <p className="hidden text-sm text-muted sm:block">
            {completedLevels.size} / {LEVELS.length} levels completed
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8">

        {/* ── Intro ── */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Logic Challenge</h1>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-foreground/60">
            Program the robot by placing commands into slots. Advanced levels unlock <strong>functions</strong> (F1, F2)
            — reusable subroutines that can even call themselves recursively. Collect all stars to advance!
          </p>
        </div>

        {/* ── Level selector ── */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-muted/20 bg-cream shadow-sm">
          <div className="p-4 sm:p-5">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-muted">Select Level</p>
            <div className="flex flex-wrap gap-2">
              {LEVELS.map((lvl, idx) => {
                const done = completedLevels.has(idx + 1)
                const unlocked = isUnlocked(idx)
                const active = currentIdx === idx
                return (
                  <button
                    key={idx}
                    onClick={() => loadLevel(idx)}
                    disabled={!unlocked}
                    title={unlocked ? lvl.name : 'Complete the previous level first'}
                    className={[
                      'flex h-9 min-w-[2.5rem] items-center justify-center rounded-xl px-3 text-xs font-bold transition-all',
                      active
                        ? 'bg-primary text-white shadow-md'
                        : done
                          ? 'border border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                          : unlocked
                            ? 'border border-muted/20 bg-pampas-warm text-foreground hover:border-primary/30 hover:bg-primary/5'
                            : 'cursor-not-allowed border border-muted/10 text-muted/30',
                    ].join(' ')}
                  >
                    {done ? '✓' : !unlocked ? '🔒' : idx + 1}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Game area ── */}
        <div className="overflow-hidden rounded-2xl border border-muted/20 bg-cream shadow-sm">
          <div className="flex flex-col xl:flex-row">

            {/* ── Grid panel ── */}
            <div className="flex flex-col items-center justify-center gap-4 p-6 sm:p-10 xl:flex-1">

              {/* Grid */}
              <div className="flex flex-col" style={{ gap: '4px' }}>
                {gridState.map((row, y) => (
                  <div key={y} className="flex" style={{ gap: '4px' }}>
                    {row.map((tile, x) => {
                      const isRobot = robotPos.x === x && robotPos.y === y
                      const isStar = tile.t === 'S'
                      const isCollected = collected.includes(`${x},${y}`)
                      const isWall = tile.t === 'W'
                      return (
                        <div
                          key={x}
                          style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
                          className={[
                            'relative flex items-center justify-center rounded-lg font-bold transition-all duration-300',
                            isWall
                              ? 'bg-charcoal shadow-inner'
                              : `border ${TILE_BG[tile.c]}`,
                            isRobot
                              ? 'ring-2 ring-primary ring-offset-1 ring-offset-cream'
                              : '',
                          ].filter(Boolean).join(' ')}
                        >
                          {isRobot && (
                            <span
                              className="text-primary drop-shadow transition-all duration-300"
                              style={{ fontSize: `${Math.max(12, cellSize * 0.45)}px` }}
                            >
                              {ARROW[robotDir]}
                            </span>
                          )}
                          {!isRobot && isStar && !isCollected && (
                            <span style={{ fontSize: `${Math.max(10, cellSize * 0.4)}px` }} className="text-yellow-400 drop-shadow-sm">★</span>
                          )}
                          {!isRobot && isStar && isCollected && (
                            <span style={{ fontSize: `${Math.max(10, cellSize * 0.4)}px` }} className="text-green-500">✓</span>
                          )}
                          {isWall && (
                            <span style={{ fontSize: `${Math.max(8, cellSize * 0.3)}px` }} className="text-charcoal/30">▪</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>

              {/* Star counter + status */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex items-center gap-2">
                  {Array.from({ length: level.stars }).map((_, i) => (
                    <span key={i} className={`text-base transition-all ${i < collected.length ? 'text-yellow-400' : 'text-muted/30'}`}>★</span>
                  ))}
                </div>
                <div className="h-5 text-center text-sm">
                  {status === 'won' && <p className="font-semibold text-green-600">🎉 Level Complete!</p>}
                  {status === 'failed' && <p className="font-medium text-red-500">{message || 'Try again!'}</p>}
                  {status === 'running' && <p className="animate-pulse text-muted text-xs">Running…</p>}
                  {status === 'idle' && <p className="text-xs text-muted">{collected.length} / {level.stars} stars</p>}
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] text-muted/70">
                <span className="flex items-center gap-1"><span className="text-primary">▲</span> Robot</span>
                <span className="flex items-center gap-1"><span className="text-yellow-400">★</span> Star</span>
                <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded bg-charcoal"></span> Wall</span>
                <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded bg-red-200 border border-red-300"></span> Red</span>
                <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded bg-blue-200 border border-blue-300"></span> Blue</span>
                <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded bg-green-200 border border-green-300"></span> Green</span>
              </div>
            </div>

            {/* ── Divider ── */}
            <div className="h-px w-full bg-muted/20 xl:h-auto xl:w-px" />

            {/* ── Controls panel ── */}
            <div className="flex flex-col gap-4 overflow-y-auto p-5 sm:p-7 xl:w-96">

              {/* Level info */}
              <div className="border-b border-muted/20 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                    Level {level.id} / {LEVELS.length}
                  </span>
                  {completedLevels.has(currentIdx + 1) && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-[9px] font-bold text-green-700">✓ DONE</span>
                  )}
                </div>
                <h2 className="mt-1 text-base font-bold text-foreground">{level.name}</h2>
                <p className="mt-1 text-xs leading-relaxed text-foreground/55">{level.desc}</p>
                {hasFunctions && (
                  <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 text-[10px] font-semibold text-purple-700">
                    ⟳ Functions unlocked
                  </div>
                )}
              </div>

              {/* Command palette */}
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted">Commands</p>
                <div className="flex flex-wrap gap-1.5">
                  {level.cmds.map(cmd => (
                    <button
                      key={cmd}
                      onClick={() => {
                        if (activeCmd === cmd) { setActiveCmd(null); setActiveCond('ANY') }
                        else { setActiveCmd(cmd); setActiveCond('ANY') }
                      }}
                      className={[
                        'inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold shadow-sm transition-all',
                        CMD_PALETTE_CLS[cmd],
                        activeCmd === cmd ? 'ring-2 ring-offset-1 ring-offset-cream scale-105 shadow-md' : 'opacity-85 hover:opacity-100',
                      ].join(' ')}
                    >
                      {CMD_LABEL[cmd]}
                    </button>
                  ))}
                </div>

                {/* Condition selector (shows when a command is active) */}
                {activeCmd && (
                  <div className="mt-3 rounded-xl border border-muted/20 bg-pampas-warm p-3">
                    <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-muted">
                      Condition for {CMD_SHORT[activeCmd]}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {availableConditions.map(cond => (
                        <button
                          key={cond}
                          onClick={() => setActiveCond(cond)}
                          className={[
                            'rounded-md px-2 py-1 text-[10px] font-semibold transition-all',
                            activeCond === cond
                              ? `${COND_CLS[cond]} ring-2 ring-offset-1 ring-offset-pampas-warm scale-105`
                              : 'bg-muted/10 text-foreground/60 hover:bg-muted/20',
                          ].join(' ')}
                        >
                          {COND_LABEL[cond]}
                        </button>
                      ))}
                    </div>
                    <p className="mt-2 text-[10px] text-muted/60">
                      Now click a slot below to place <strong>{CMD_SHORT[activeCmd]}</strong>
                      {activeCond !== 'ANY' && <> if <strong>{COND_LABEL[activeCond]}</strong></>}.
                    </p>
                  </div>
                )}
                {!activeCmd && (
                  <p className="mt-1.5 text-[10px] text-muted/60">
                    Click a command to select it, then click a program slot to place it.
                  </p>
                )}
              </div>

              {/* Program slots */}
              <div className="flex flex-col gap-3 flex-1">

                {/* Main program */}
                <ProgramPanel
                  label="Main"
                  fn="main"
                  slots={program.main}
                  activeFn={activeSlotFn}
                  activePc={activeSlotPc}
                  status={status}
                  onSlotClick={handleSlotClick}
                  onClearSlot={clearSlot}
                />

                {/* F1 function */}
                {level.f1Slots > 0 && (
                  <ProgramPanel
                    label="Function F1"
                    fn="f1"
                    slots={program.f1}
                    activeFn={activeSlotFn}
                    activePc={activeSlotPc}
                    status={status}
                    onSlotClick={handleSlotClick}
                    onClearSlot={clearSlot}
                    accent="purple"
                  />
                )}

                {/* F2 function */}
                {level.f2Slots > 0 && (
                  <ProgramPanel
                    label="Function F2"
                    fn="f2"
                    slots={program.f2}
                    activeFn={activeSlotFn}
                    activePc={activeSlotPc}
                    status={status}
                    onSlotClick={handleSlotClick}
                    onClearSlot={clearSlot}
                    accent="pink"
                  />
                )}
              </div>

              {/* Hint */}
              {showHint && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
                  <p className="text-[11px] leading-relaxed text-amber-800">
                    💡 {level.hint}
                  </p>
                </div>
              )}

              {/* Next level / completion */}
              {status === 'won' && currentIdx < LEVELS.length - 1 && (
                <button
                  onClick={() => loadLevel(currentIdx + 1)}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-700 active:scale-95"
                >
                  Next Level →
                </button>
              )}
              {status === 'won' && currentIdx === LEVELS.length - 1 && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-center">
                  <p className="text-sm font-bold text-green-700">🏆 All 16 levels complete!</p>
                  <p className="mt-0.5 text-[11px] text-green-600">You've mastered the Logic Challenge!</p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={status === 'idle' ? runGame : stopGame}
                  className={[
                    'flex flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all active:scale-95',
                    status === 'running'
                      ? 'bg-amber-500 hover:bg-amber-600'
                      : 'bg-primary hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50',
                  ].join(' ')}
                  disabled={status === 'won' || status === 'failed'}
                >
                  {status === 'running' ? '■ Stop' : '▶ Run'}
                </button>
                <button
                  onClick={resetGame}
                  title="Reset program and grid"
                  className="rounded-xl border border-muted/30 px-3.5 py-2.5 text-sm text-foreground/60 transition-all hover:bg-pampas-warm hover:text-foreground active:scale-95"
                >
                  ↺
                </button>
                <button
                  onClick={() => setShowHint(h => !h)}
                  title="Show hint"
                  className={[
                    'rounded-xl border px-3.5 py-2.5 text-sm transition-all active:scale-95',
                    showHint
                      ? 'border-amber-300 bg-amber-50 text-amber-700'
                      : 'border-muted/30 text-foreground/60 hover:bg-pampas-warm hover:text-foreground',
                  ].join(' ')}
                >
                  ?
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* ── How to play ── */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { icon: '1', title: 'Select a Command', body: 'Click a command button in the palette to select it. Optionally choose a condition — the command will only execute when that condition is true.' },
            { icon: '2', title: 'Fill the Slots', body: 'Click any slot in Main, F1, or F2 to place the selected command. Right-click or press × to remove. Order matters — slots execute top to bottom.' },
            { icon: '3', title: 'Run & Collect', body: 'Press Run to animate your program. If the robot hits a wall or runs out of steps, tweak your program and try again. Collect all stars to unlock the next level.' },
          ].map(({ icon, title, body }) => (
            <div key={icon} className="rounded-2xl border border-muted/20 bg-cream p-5 shadow-sm">
              <div className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{icon}</div>
              <h3 className="text-sm font-bold text-foreground">{title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-foreground/55">{body}</p>
            </div>
          ))}
        </div>

        {/* ── Footer note ── */}
        <p className="mt-8 text-center text-xs text-muted/60">
          Built by members of{' '}
          <Link to="/about" className="underline transition-colors hover:text-primary">
            Claude Builder Club
          </Link>
          {' '}· University of Rwanda · Inspired by LightBot &amp; Robozzle
        </p>

      </div>
    </div>
  )
}

// ─── Program Panel Sub-component ──────────────────────────────────────────────
interface ProgramPanelProps {
  label: string
  fn: Fn
  slots: (Cmd | null)[]
  activeFn: Fn
  activePc: number
  status: GameStatus
  onSlotClick: (fn: Fn, idx: number) => void
  onClearSlot: (fn: Fn, idx: number, e: React.MouseEvent) => void
  accent?: 'purple' | 'pink'
}

function ProgramPanel({ label, fn, slots, activeFn, activePc, status, onSlotClick, onClearSlot, accent }: ProgramPanelProps) {
  const headerCls = accent === 'purple'
    ? 'text-purple-700 bg-purple-50 border-purple-200'
    : accent === 'pink'
      ? 'text-pink-700 bg-pink-50 border-pink-200'
      : 'text-primary bg-primary/5 border-primary/20'

  return (
    <div className="rounded-xl border border-muted/20 overflow-hidden">
      <div className={`border-b px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest ${headerCls}`}>
        {label}
      </div>
      <div className="flex flex-col gap-1 p-2">
        {slots.map((slot, i) => {
          const isActive = activeFn === fn && activePc === i && status === 'running'
          return (
            <button
              key={i}
              onClick={() => onSlotClick(fn, i)}
              disabled={status !== 'idle'}
              className={[
                'flex h-8 w-full items-center justify-between rounded-lg border px-2.5 text-[11px] font-medium transition-all',
                isActive
                  ? 'border-amber-400 bg-amber-50 text-amber-800 shadow-sm scale-[1.02]'
                  : slot
                    ? CMD_SLOT_CLS[slot.type]
                    : 'border-dashed border-muted/40 text-muted/60 hover:border-primary/30 hover:bg-primary/5 hover:text-primary/70',
                'disabled:cursor-not-allowed',
              ].join(' ')}
            >
              <span className="font-mono text-[9px] text-foreground/25 w-4">{i + 1}</span>
              <span className="flex flex-1 items-center justify-center gap-1">
                {slot ? CMD_SHORT[slot.type] : '+ place here'}
                {slot && slot.cond !== 'ANY' && (
                  <span className={`ml-1 rounded px-1 py-0.5 text-[8px] font-bold ${COND_CLS[slot.cond]}`}>
                    {COND_SHORT[slot.cond]}
                  </span>
                )}
              </span>
              {slot && status === 'idle' && (
                <span
                  role="button"
                  onClick={e => onClearSlot(fn, i, e)}
                  className="cursor-pointer text-[10px] text-muted/40 transition-colors hover:text-red-400"
                >
                  ×
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
