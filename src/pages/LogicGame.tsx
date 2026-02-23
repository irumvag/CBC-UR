import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

// ─── Types ────────────────────────────────────────────────────────────────────
type Direction = 'N' | 'E' | 'S' | 'W'
type Cmd = 'MOVE_FORWARD' | 'TURN_LEFT' | 'TURN_RIGHT'
type CellType = 'E' | 'S' | 'W'
type GameStatus = 'idle' | 'running' | 'won' | 'failed'

interface LevelConfig {
  id: number
  title: string
  description: string
  grid: CellType[][]
  start: { x: number; y: number }
  startDir: Direction
  starsRequired: number
  slotCount: number
  availableCommands: Cmd[]
  hint: string
}

interface Frame {
  pos: { x: number; y: number }
  dir: Direction
  collected: Set<string>
  slot: number
  status: 'running' | 'won' | 'failed'
  msg: string
}

// ─── Display Helpers ──────────────────────────────────────────────────────────
const ARROW: Record<Direction, string> = { N: '▲', E: '▶', S: '▼', W: '◀' }

const CMD_LABEL: Record<Cmd, string> = {
  MOVE_FORWARD: '▲ Forward',
  TURN_RIGHT: '↻ Turn Right',
  TURN_LEFT: '↺ Turn Left',
}

const CMD_SHORT: Record<Cmd, string> = {
  MOVE_FORWARD: '▲ Fwd',
  TURN_RIGHT: '↻ Right',
  TURN_LEFT: '↺ Left',
}

const CMD_BG: Record<Cmd, string> = {
  MOVE_FORWARD: 'bg-sky-500 border-sky-400',
  TURN_RIGHT: 'bg-orange-500 border-orange-400',
  TURN_LEFT: 'bg-violet-500 border-violet-400',
}

const CMD_SLOT_BG: Record<Cmd, string> = {
  MOVE_FORWARD: 'bg-sky-50 border-sky-300 text-sky-700',
  TURN_RIGHT: 'bg-orange-50 border-orange-300 text-orange-700',
  TURN_LEFT: 'bg-violet-50 border-violet-300 text-violet-700',
}

// ─── Level Definitions ────────────────────────────────────────────────────────
const LEVELS: LevelConfig[] = [
  {
    id: 1,
    title: 'Straight Line',
    description: 'Guide the robot (▲) to the star (★). Click Move Forward and place it in the program slots, then press Run.',
    grid: [
      ['E','E','E','E','E'],
      ['E','E','E','E','E'],
      ['E','E','S','E','E'],
      ['E','E','E','E','E'],
      ['E','E','E','E','E'],
    ],
    start: { x: 2, y: 4 },
    startDir: 'N',
    starsRequired: 1,
    slotCount: 4,
    availableCommands: ['MOVE_FORWARD'],
    hint: 'The star is 2 steps north. Add Move Forward to slots 1 and 2, then press Run.',
  },
  {
    id: 2,
    title: 'Right Turn',
    description: 'The star is off to the east. Move north first, then turn right to reach it.',
    grid: [
      ['E','E','E','E','E'],
      ['E','E','E','E','S'],
      ['E','E','E','E','E'],
      ['E','E','E','E','E'],
      ['E','E','E','E','E'],
    ],
    start: { x: 1, y: 4 },
    startDir: 'N',
    starsRequired: 1,
    slotCount: 8,
    availableCommands: ['MOVE_FORWARD', 'TURN_RIGHT'],
    hint: 'Forward × 3, Turn Right, Forward × 3.',
  },
  {
    id: 3,
    title: 'Left Turn',
    description: 'The star is to the west this time. You now have access to Turn Left.',
    grid: [
      ['E','E','E','E','E'],
      ['S','E','E','E','E'],
      ['E','E','E','E','E'],
      ['E','E','E','E','E'],
      ['E','E','E','E','E'],
    ],
    start: { x: 3, y: 4 },
    startDir: 'N',
    starsRequired: 1,
    slotCount: 8,
    availableCommands: ['MOVE_FORWARD', 'TURN_RIGHT', 'TURN_LEFT'],
    hint: 'Forward × 3, Turn Left, Forward × 3.',
  },
  {
    id: 4,
    title: 'The Corner',
    description: 'Navigate to the far corner. Plan your full path — up and then across.',
    grid: [
      ['E','E','E','E','S'],
      ['E','E','E','E','E'],
      ['E','E','E','E','E'],
      ['E','E','E','E','E'],
      ['E','E','E','E','E'],
    ],
    start: { x: 0, y: 4 },
    startDir: 'N',
    starsRequired: 1,
    slotCount: 10,
    availableCommands: ['MOVE_FORWARD', 'TURN_RIGHT', 'TURN_LEFT'],
    hint: 'Forward × 4, Turn Right, Forward × 4.',
  },
  {
    id: 5,
    title: 'Wall Dodge',
    description: 'A wall blocks the direct path north. Navigate around it to reach the star.',
    grid: [
      ['E','E','S','E','E'],
      ['E','E','E','E','E'],
      ['E','E','W','E','E'],
      ['E','E','E','E','E'],
      ['E','E','E','E','E'],
    ],
    start: { x: 2, y: 4 },
    startDir: 'N',
    starsRequired: 1,
    slotCount: 10,
    availableCommands: ['MOVE_FORWARD', 'TURN_RIGHT', 'TURN_LEFT'],
    hint: 'Fwd, Right, Fwd, Left, Fwd × 3, Left, Fwd — go around the wall on the right.',
  },
  {
    id: 6,
    title: 'Two Stars',
    description: 'You must collect both stars. Plan a path that visits each one.',
    grid: [
      ['E','E','E','E','S'],
      ['E','E','E','E','E'],
      ['E','E','S','E','E'],
      ['E','E','E','E','E'],
      ['E','E','E','E','E'],
    ],
    start: { x: 2, y: 4 },
    startDir: 'N',
    starsRequired: 2,
    slotCount: 9,
    availableCommands: ['MOVE_FORWARD', 'TURN_RIGHT', 'TURN_LEFT'],
    hint: 'Fwd × 2 (collect star 1 at row 2), Fwd × 2 to row 0, Turn Right, Fwd × 2 (collect star 2).',
  },
  {
    id: 7,
    title: 'The Gauntlet',
    description: 'Two walls guard the center. Both stars lie in the open — find a clear route.',
    grid: [
      ['S','E','E','E','S'],
      ['E','E','E','E','E'],
      ['E','W','E','W','E'],
      ['E','E','E','E','E'],
      ['E','E','E','E','E'],
    ],
    start: { x: 0, y: 4 },
    startDir: 'N',
    starsRequired: 2,
    slotCount: 10,
    availableCommands: ['MOVE_FORWARD', 'TURN_RIGHT', 'TURN_LEFT'],
    hint: 'Fwd × 4 (collect star at (0,0)), Turn Right, Fwd × 4 (collect star at (4,0)).',
  },
  {
    id: 8,
    title: 'Grand Finale',
    description: 'Three stars at the corners of the grid. Navigate the full perimeter to collect them all!',
    grid: [
      ['E','E','E','E','S'],
      ['E','E','E','E','E'],
      ['E','E','E','E','E'],
      ['E','E','E','E','E'],
      ['S','E','E','E','S'],
    ],
    start: { x: 0, y: 0 },
    startDir: 'E',
    starsRequired: 3,
    slotCount: 14,
    availableCommands: ['MOVE_FORWARD', 'TURN_RIGHT', 'TURN_LEFT'],
    hint: 'Fwd × 4 (star 1), Right, Fwd × 4 (star 2), Right, Fwd × 4 (star 3). You\'re going around the perimeter!',
  },
]

// ─── Movement Helpers ─────────────────────────────────────────────────────────
function move(pos: { x: number; y: number }, dir: Direction) {
  const d = ({ N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] } as const)[dir]
  return { x: pos.x + d[0], y: pos.y + d[1] }
}
function turnRight(d: Direction): Direction {
  return ({ N: 'E', E: 'S', S: 'W', W: 'N' } as const)[d]
}
function turnLeft(d: Direction): Direction {
  return ({ N: 'W', W: 'S', S: 'E', E: 'N' } as const)[d]
}

// ─── Execution Engine ─────────────────────────────────────────────────────────
function computeTrace(slots: (Cmd | null)[], level: LevelConfig): Frame[] {
  const frames: Frame[] = []
  let pos = { ...level.start }
  let dir = level.startDir
  let collected = new Set<string>()
  const size = level.grid.length

  for (let i = 0; i < slots.length; i++) {
    const cmd = slots[i]
    if (!cmd) {
      frames.push({ pos: { ...pos }, dir, collected: new Set(collected), slot: i, status: 'running', msg: '' })
      continue
    }

    if (cmd === 'MOVE_FORWARD') {
      const next = move(pos, dir)
      if (next.x < 0 || next.x >= size || next.y < 0 || next.y >= size || level.grid[next.y][next.x] === 'W') {
        frames.push({ pos: { ...pos }, dir, collected: new Set(collected), slot: i, status: 'failed', msg: 'Oops! Robot hit a wall or boundary.' })
        return frames
      }
      pos = next
      const key = `${pos.x},${pos.y}`
      if (level.grid[pos.y][pos.x] === 'S' && !collected.has(key)) {
        collected = new Set(collected)
        collected.add(key)
      }
    } else if (cmd === 'TURN_RIGHT') {
      dir = turnRight(dir)
    } else if (cmd === 'TURN_LEFT') {
      dir = turnLeft(dir)
    }

    const won = collected.size >= level.starsRequired
    frames.push({ pos: { ...pos }, dir, collected: new Set(collected), slot: i, status: won ? 'won' : 'running', msg: '' })
    if (won) return frames
  }

  const finalStatus = collected.size >= level.starsRequired ? 'won' : 'failed'
  frames.push({
    pos: { ...pos }, dir, collected: new Set(collected), slot: -1,
    status: finalStatus,
    msg: finalStatus === 'failed' ? `Collected ${collected.size}/${level.starsRequired} stars. Try again!` : '',
  })
  return frames
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function LogicGame() {
  const [completedLevels, setCompletedLevels] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem('cbc-logic-completed')
      return saved ? new Set(JSON.parse(saved) as number[]) : new Set<number>()
    } catch { return new Set<number>() }
  })

  const [currentIdx, setCurrentIdx] = useState(0)
  const [slots, setSlots] = useState<(Cmd | null)[]>(Array(LEVELS[0].slotCount).fill(null))
  const [robotPos, setRobotPos] = useState(LEVELS[0].start)
  const [robotDir, setRobotDir] = useState<Direction>(LEVELS[0].startDir)
  const [collected, setCollected] = useState(new Set<string>())
  const [activeSlot, setActiveSlot] = useState(-1)
  const [status, setStatus] = useState<GameStatus>('idle')
  const [message, setMessage] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [activeCmd, setActiveCmd] = useState<Cmd | null>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const level = LEVELS[currentIdx]
  const isUnlocked = (idx: number) => idx === 0 || completedLevels.has(idx - 1)

  useEffect(() => () => { timers.current.forEach(clearTimeout) }, [])

  const loadLevel = (idx: number) => {
    if (!isUnlocked(idx)) return
    timers.current.forEach(clearTimeout)
    timers.current = []
    const lvl = LEVELS[idx]
    setCurrentIdx(idx)
    setSlots(Array(lvl.slotCount).fill(null))
    setRobotPos(lvl.start)
    setRobotDir(lvl.startDir)
    setCollected(new Set())
    setActiveSlot(-1)
    setStatus('idle')
    setMessage('')
    setShowHint(false)
    setActiveCmd(null)
  }

  const resetGame = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setSlots(Array(level.slotCount).fill(null))
    setRobotPos(level.start)
    setRobotDir(level.startDir)
    setCollected(new Set())
    setActiveSlot(-1)
    setStatus('idle')
    setMessage('')
    setShowHint(false)
    setActiveCmd(null)
  }

  const handleSlotClick = (i: number) => {
    if (status !== 'idle') return
    if (activeCmd) {
      setSlots(prev => prev.map((s, j) => j === i ? (s === activeCmd ? null : activeCmd) : s))
    } else {
      setSlots(prev => prev.map((s, j) => {
        if (j !== i) return s
        const cmds = level.availableCommands
        const cur = s ? cmds.indexOf(s) : -1
        return cur < cmds.length - 1 ? cmds[cur + 1] : null
      }))
    }
  }

  const clearSlot = (i: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (status !== 'idle') return
    setSlots(prev => prev.map((s, j) => j === i ? null : s))
  }

  const runGame = () => {
    if (status !== 'idle') return
    timers.current.forEach(clearTimeout)
    timers.current = []
    const trace = computeTrace(slots, level)
    setStatus('running')
    trace.forEach((frame, i) => {
      const t = setTimeout(() => {
        setRobotPos(frame.pos)
        setRobotDir(frame.dir)
        setCollected(frame.collected)
        setActiveSlot(frame.slot)
        setStatus(frame.status as GameStatus)
        setMessage(frame.msg)
        if (frame.status === 'won') {
          const next = new Set([...completedLevels, currentIdx])
          setCompletedLevels(next)
          try { localStorage.setItem('cbc-logic-completed', JSON.stringify([...next])) } catch { /* noop */ }
        }
      }, (i + 1) * 600)
      timers.current.push(t)
    })
  }

  return (
    <div className="min-h-screen bg-pampas">

      {/* ── Page header ── */}
      <div className="border-b border-muted/20 bg-cream">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-muted transition-colors hover:text-foreground">
              ← Back to Home
            </Link>
            <span className="text-muted/30">|</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary">
              🧠 Logic Challenge
            </span>
          </div>
          <p className="hidden text-sm text-muted sm:block">
            {completedLevels.size} / {LEVELS.length} completed
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">

        {/* ── Intro ── */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Logic Challenge</h1>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-foreground/60">
            Program the robot by selecting commands and filling the slots below, then press Run.
            Collect all the stars to unlock the next level.
          </p>
        </div>

        {/* ── Level selector ── */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-muted/20 bg-cream p-4 shadow-sm sm:p-6">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-muted">Levels</p>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
            {LEVELS.map((lvl, idx) => {
              const done = completedLevels.has(idx)
              const unlocked = isUnlocked(idx)
              const active = currentIdx === idx
              return (
                <button
                  key={idx}
                  onClick={() => loadLevel(idx)}
                  disabled={!unlocked}
                  title={unlocked ? lvl.title : 'Complete the previous level to unlock'}
                  className={[
                    'flex flex-col items-center rounded-xl px-2 py-3 text-center transition-all',
                    active
                      ? 'bg-primary text-white shadow-md'
                      : done
                        ? 'border border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                        : unlocked
                          ? 'border border-muted/20 bg-pampas-warm text-foreground hover:border-primary/30 hover:bg-primary/5'
                          : 'cursor-not-allowed border border-muted/10 bg-pampas text-muted/30',
                  ].join(' ')}
                >
                  <span className="text-xs font-bold">
                    {done ? '✓' : !unlocked ? '🔒' : idx + 1}
                  </span>
                  <span className="mt-0.5 hidden text-[9px] leading-tight sm:block">
                    {lvl.title}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Game card ── */}
        <div className="overflow-hidden rounded-2xl border border-muted/20 bg-cream shadow-sm">
          <div className="flex flex-col lg:flex-row">

            {/* ── Grid panel ── */}
            <div className="flex flex-col items-center justify-center gap-5 p-6 sm:p-10 lg:flex-1">

              {/* Grid */}
              <div className="flex flex-col gap-1.5">
                {level.grid.map((row, y) => (
                  <div key={y} className="flex gap-1.5">
                    {row.map((cell, x) => {
                      const isRobot = robotPos.x === x && robotPos.y === y
                      const isStar = cell === 'S'
                      const isCollected = collected.has(`${x},${y}`)
                      const isWall = cell === 'W'
                      return (
                        <div
                          key={x}
                          style={{ width: '3.25rem', height: '3.25rem' }}
                          className={[
                            'flex items-center justify-center rounded-xl text-base font-bold transition-all duration-300',
                            isWall
                              ? 'bg-charcoal shadow-inner'
                              : 'border border-muted/25 bg-pampas-warm',
                            isRobot
                              ? 'ring-2 ring-primary ring-offset-2 ring-offset-cream'
                              : '',
                          ].filter(Boolean).join(' ')}
                        >
                          {isRobot && (
                            <span className="text-xl text-primary drop-shadow transition-transform duration-300">
                              {ARROW[robotDir]}
                            </span>
                          )}
                          {!isRobot && isStar && !isCollected && (
                            <span className="text-xl text-yellow-400 drop-shadow-sm">★</span>
                          )}
                          {!isRobot && isStar && isCollected && (
                            <span className="text-base text-green-500">✓</span>
                          )}
                          {isWall && (
                            <span className="text-base text-charcoal/50">▪</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>

              {/* Status */}
              <div className="h-6 text-center text-sm">
                {status === 'won' && (
                  <p className="font-semibold text-green-600">🎉 Level Complete! Well done.</p>
                )}
                {status === 'failed' && (
                  <p className="font-medium text-red-500">{message || 'Try again!'}</p>
                )}
                {status === 'running' && (
                  <p className="animate-pulse text-muted">Running…</p>
                )}
                {status === 'idle' && (
                  <p className="text-muted">Stars: {collected.size} / {level.starsRequired}</p>
                )}
              </div>
            </div>

            {/* ── Divider ── */}
            <div className="h-px w-full bg-muted/20 lg:h-auto lg:w-px" />

            {/* ── Controls panel ── */}
            <div className="flex flex-col gap-5 p-6 sm:p-8 lg:w-80">

              {/* Level info */}
              <div className="border-b border-muted/20 pb-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                  Level {level.id} of {LEVELS.length} — {level.title}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-foreground/55">{level.description}</p>
              </div>

              {/* Commands palette */}
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted">
                  Commands
                </p>
                <div className="flex flex-wrap gap-2">
                  {level.availableCommands.map(cmd => (
                    <button
                      key={cmd}
                      onClick={() => setActiveCmd(c => c === cmd ? null : cmd)}
                      className={[
                        'inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm transition-all',
                        CMD_BG[cmd],
                        activeCmd === cmd
                          ? 'ring-2 ring-offset-1 ring-offset-cream scale-105 shadow-md'
                          : 'opacity-85 hover:opacity-100',
                      ].join(' ')}
                    >
                      {CMD_LABEL[cmd]}
                    </button>
                  ))}
                </div>
                {activeCmd ? (
                  <p className="mt-1.5 text-[10px] text-primary/70">
                    Click a slot to place {CMD_SHORT[activeCmd]}. Click command again to deselect.
                  </p>
                ) : (
                  <p className="mt-1.5 text-[10px] text-muted/70">
                    Select a command, then click a slot to place it.
                  </p>
                )}
              </div>

              {/* Program slots */}
              <div className="flex-1">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted">
                  Main Program
                </p>
                <div className="flex flex-col gap-1.5">
                  {slots.map((slot, i) => (
                    <button
                      key={i}
                      onClick={() => handleSlotClick(i)}
                      disabled={status !== 'idle'}
                      className={[
                        'flex h-9 w-full items-center justify-between rounded-lg border px-3 text-[11px] font-medium transition-all',
                        activeSlot === i
                          ? 'border-primary/60 bg-primary/15 text-primary shadow-sm'
                          : slot
                            ? CMD_SLOT_BG[slot]
                            : 'border-dashed border-muted/40 text-muted/60 hover:border-primary/30 hover:bg-primary/5 hover:text-primary/70',
                        'disabled:cursor-not-allowed',
                      ].join(' ')}
                    >
                      <span className="font-mono text-[10px] text-foreground/25">{i + 1}</span>
                      <span className="flex-1 text-center">
                        {slot ? CMD_SHORT[slot] : '+ click to add'}
                      </span>
                      {slot && status === 'idle' && (
                        <span
                          role="button"
                          onClick={(e) => clearSlot(i, e)}
                          className="cursor-pointer text-[10px] text-muted/50 transition-colors hover:text-red-400"
                        >
                          ×
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hint */}
              {showHint && (
                <div className="rounded-xl border border-muted/20 bg-pampas-warm px-3 py-2.5">
                  <p className="text-[11px] leading-relaxed text-foreground/60">
                    💡 {level.hint}
                  </p>
                </div>
              )}

              {/* Next level button (shows on win) */}
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
                  <p className="text-sm font-bold text-green-700">🏆 All levels complete!</p>
                  <p className="mt-0.5 text-[11px] text-green-600">You've mastered the Logic Challenge.</p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={runGame}
                  disabled={status !== 'idle'}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  ▶ Run
                </button>
                <button
                  onClick={resetGame}
                  title="Reset"
                  className="rounded-xl border border-muted/30 px-3.5 py-2.5 text-sm text-foreground/60 transition-all hover:bg-pampas-warm hover:text-foreground active:scale-95"
                >
                  ↺
                </button>
                <button
                  onClick={() => setShowHint(h => !h)}
                  title="Hint"
                  className={[
                    'rounded-xl border px-3.5 py-2.5 text-sm transition-all active:scale-95',
                    showHint
                      ? 'border-primary/30 bg-primary/10 text-primary'
                      : 'border-muted/30 text-foreground/60 hover:bg-pampas-warm hover:text-foreground',
                  ].join(' ')}
                >
                  ?
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* ── Footer note ── */}
        <p className="mt-8 text-center text-xs text-muted/60">
          Built by members of{' '}
          <Link to="/about" className="underline hover:text-primary transition-colors">
            Claude Builder Club
          </Link>
          {' '}· University of Rwanda
        </p>

      </div>
    </div>
  )
}
