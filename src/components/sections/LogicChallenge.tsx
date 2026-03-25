import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

// ─── Types ────────────────────────────────────────────────────────────────────
type Dir = 'N' | 'E' | 'S' | 'W'
type Cmd = 'FWD' | 'LEFT' | 'RIGHT'
type GameStatus = 'idle' | 'running' | 'won' | 'failed'

interface Tile { t: 'E' | 'W' | 'S'; c: 'N' | 'R' | 'G' | 'B' | 'Y' }

// ─── Preview Level: Blue Corner Turns (Level 4 teaser) ───────────────────────
const GRID_SIZE = 5
const PREVIEW_GRID: Tile[][] = [
  [{ t: 'E', c: 'N' }, { t: 'E', c: 'N' }, { t: 'E', c: 'N' }, { t: 'E', c: 'N' }, { t: 'E', c: 'N' }],
  [{ t: 'E', c: 'N' }, { t: 'S', c: 'B' }, { t: 'S', c: 'N' }, { t: 'S', c: 'B' }, { t: 'E', c: 'N' }],
  [{ t: 'E', c: 'N' }, { t: 'S', c: 'N' }, { t: 'E', c: 'N' }, { t: 'S', c: 'N' }, { t: 'E', c: 'N' }],
  [{ t: 'E', c: 'N' }, { t: 'S', c: 'B' }, { t: 'S', c: 'N' }, { t: 'S', c: 'B' }, { t: 'E', c: 'N' }],
  [{ t: 'E', c: 'N' }, { t: 'E', c: 'N' }, { t: 'E', c: 'N' }, { t: 'E', c: 'N' }, { t: 'E', c: 'N' }],
]
const START = { x: 1, y: 1 }
const START_DIR: Dir = 'E'
const STARS_REQUIRED = 8
const SLOT_COUNT = 4

const ARROW: Record<Dir, string> = { N: '▲', E: '▶', S: '▼', W: '◀' }

function nextPos(pos: { x: number; y: number }, dir: Dir) {
  const d = ({ N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] } as const)[dir]
  return { x: pos.x + d[0], y: pos.y + d[1] }
}
function turnRight(d: Dir): Dir { return ({ N: 'E', E: 'S', S: 'W', W: 'N' } as const)[d] }
function turnLeft(d: Dir): Dir  { return ({ N: 'W', W: 'S', S: 'E', E: 'N' } as const)[d] }

interface Frame {
  pos: { x: number; y: number }
  dir: Dir
  collected: Set<string>
  slot: number
  status: 'running' | 'won' | 'failed'
  msg: string
}

function computeTrace(slots: (Cmd | null)[]): Frame[] {
  const frames: Frame[] = []
  let pos = { ...START }
  let dir = START_DIR
  let collected = new Set<string>()

  for (let i = 0; i < slots.length; i++) {
    const cmd = slots[i]
    if (!cmd) {
      frames.push({ pos: { ...pos }, dir, collected: new Set(collected), slot: i, status: 'running', msg: '' })
      continue
    }
    if (cmd === 'FWD') {
      const np = nextPos(pos, dir)
      if (np.x < 0 || np.x >= GRID_SIZE || np.y < 0 || np.y >= GRID_SIZE || PREVIEW_GRID[np.y][np.x].t === 'W') {
        frames.push({ pos: { ...pos }, dir, collected: new Set(collected), slot: i, status: 'failed', msg: 'Robot hit a boundary!' })
        return frames
      }
      pos = np
      const key = `${pos.x},${pos.y}`
      if (PREVIEW_GRID[pos.y][pos.x].t === 'S' && !collected.has(key)) {
        collected = new Set(collected)
        collected.add(key)
      }
    } else if (cmd === 'LEFT') {
      dir = turnLeft(dir)
    } else if (cmd === 'RIGHT') {
      dir = turnRight(dir)
    }
    const won = collected.size >= STARS_REQUIRED
    frames.push({ pos: { ...pos }, dir, collected: new Set(collected), slot: i, status: won ? 'won' : 'running', msg: '' })
    if (won) return frames
  }

  const finalStatus = collected.size >= STARS_REQUIRED ? 'won' : 'failed'
  frames.push({
    pos: { ...pos }, dir, collected: new Set(collected), slot: -1,
    status: finalStatus,
    msg: finalStatus === 'failed' ? `${collected.size}/${STARS_REQUIRED} stars. Try again!` : '',
  })
  return frames
}

// ─── Component ────────────────────────────────────────────────────────────────
export function LogicChallenge() {
  const [slots, setSlots] = useState<(Cmd | null)[]>(Array(SLOT_COUNT).fill(null))
  const [robotPos, setRobotPos] = useState(START)
  const [robotDir, setRobotDir] = useState<Dir>(START_DIR)
  const [collected, setCollected] = useState(new Set<string>())
  const [activeSlot, setActiveSlot] = useState(-1)
  const [status, setStatus] = useState<GameStatus>('idle')
  const [message, setMessage] = useState('')
  const [activeCmd, setActiveCmd] = useState<Cmd | null>(null)
  const [showHint, setShowHint] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => () => { timers.current.forEach(clearTimeout) }, [])

  const resetGame = () => {
    timers.current.forEach(clearTimeout); timers.current = []
    setRobotPos(START); setRobotDir(START_DIR)
    setCollected(new Set()); setActiveSlot(-1)
    setStatus('idle'); setMessage('')
  }

  const handleSlotClick = (i: number) => {
    if (status !== 'idle') return
    if (activeCmd) {
      setSlots(prev => prev.map((s, j) => j === i ? (s === activeCmd ? null : activeCmd) : s))
    } else {
      const cmds: Cmd[] = ['FWD', 'RIGHT', 'LEFT']
      setSlots(prev => prev.map((s, j) => {
        if (j !== i) return s
        if (!s) return 'FWD'
        const ci = cmds.indexOf(s)
        return ci < cmds.length - 1 ? cmds[ci + 1] : null
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
    timers.current.forEach(clearTimeout); timers.current = []
    const trace = computeTrace(slots)
    setStatus('running')
    trace.forEach((frame, i) => {
      const t = setTimeout(() => {
        setRobotPos(frame.pos); setRobotDir(frame.dir)
        setCollected(frame.collected); setActiveSlot(frame.slot)
        setStatus(frame.status as GameStatus); setMessage(frame.msg)
      }, (i + 1) * 500)
      timers.current.push(t)
    })
  }

  const CMD_STYLE: Record<Cmd, string> = {
    FWD:   'bg-sky-500 border-sky-400 text-white',
    RIGHT: 'bg-orange-500 border-orange-400 text-white',
    LEFT:  'bg-violet-500 border-violet-400 text-white',
  }
  const CMD_SLOT_STYLE: Record<Cmd, string> = {
    FWD:   'bg-sky-50 border-sky-300 text-sky-700',
    RIGHT: 'bg-orange-50 border-orange-300 text-orange-700',
    LEFT:  'bg-violet-50 border-violet-300 text-violet-700',
  }
  const CMD_LABEL: Record<Cmd, string> = {
    FWD: '▲ Forward', RIGHT: '↻ Turn Right', LEFT: '↺ Turn Left',
  }
  const CMD_SHORT: Record<Cmd, string> = {
    FWD: '▲ Fwd', RIGHT: '↻ Right', LEFT: '↺ Left',
  }

  const TILE_BG: Record<string, string> = {
    N: 'bg-pampas-warm border-muted/20',
    B: 'bg-blue-100 border-blue-300',
    R: 'bg-red-100 border-red-300',
    G: 'bg-green-100 border-green-300',
    Y: 'bg-yellow-100 border-yellow-300',
  }

  return (
    <section className="bg-pampas-warm py-16 sm:py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">

        {/* ── Section header ── */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary">
              🧠 Logic Challenge
            </span>
            <h2 className="mt-3 text-xl font-bold text-foreground sm:text-2xl md:text-3xl">
              Try Our Logic Challenge
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-foreground/60 sm:text-base">
              Built by members of Claude Builder Club. Program the robot — place commands in the slots and press Run.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {['16 levels', 'Functions (F1/F2)', 'Conditional logic', 'Color coding'].map(tag => (
                <span key={tag} className="rounded-full border border-muted/20 bg-cream px-2.5 py-1 text-[11px] text-foreground/60">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <Link
            to="/game"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-primary/25 bg-cream px-4 py-2.5 text-sm font-semibold text-primary shadow-sm transition-all hover:bg-primary hover:text-white active:scale-95"
          >
            Play Full Version →
          </Link>
        </div>

        {/* ── Game card ── */}
        <div className="overflow-hidden rounded-2xl border border-muted/20 bg-cream shadow-sm">

          {/* Preview label */}
          <div className="border-b border-muted/15 bg-primary/5 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-primary/70">
            ▸ Mini Preview — Level 4: Blue Means Turn
          </div>

          <div className="flex flex-col lg:flex-row">

            {/* ── Grid panel ── */}
            <div className="flex flex-col items-center justify-center gap-5 p-6 sm:p-10 lg:flex-1">

              {/* Instruction */}
              <p className="max-w-xs text-center text-xs text-foreground/50">
                Blue tiles mark corners. Try: <strong>Forward, Turn Right</strong> (repeat 4× to loop the ring).
              </p>

              {/* Grid */}
              <div className="flex flex-col gap-1.5">
                {PREVIEW_GRID.map((row, y) => (
                  <div key={y} className="flex gap-1.5">
                    {row.map((tile, x) => {
                      const isRobot = robotPos.x === x && robotPos.y === y
                      const isStar = tile.t === 'S'
                      const isCollected = collected.has(`${x},${y}`)
                      return (
                        <div
                          key={x}
                          style={{ width: '3.25rem', height: '3.25rem' }}
                          className={[
                            'flex items-center justify-center rounded-xl text-base font-bold transition-all duration-300 border',
                            TILE_BG[tile.c],
                            isRobot ? 'ring-2 ring-primary ring-offset-2 ring-offset-cream' : '',
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
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>

              {/* Star progress */}
              <div className="flex flex-col items-center gap-1">
                <div className="flex gap-1">
                  {Array.from({ length: STARS_REQUIRED }).map((_, i) => (
                    <span key={i} className={`text-sm transition-all ${i < collected.size ? 'text-yellow-400' : 'text-muted/20'}`}>★</span>
                  ))}
                </div>
                <div className="h-4 text-center text-xs">
                  {status === 'won' && <p className="font-semibold text-green-600">🎉 Perfect! Try the full game.</p>}
                  {status === 'failed' && <p className="text-red-500">{message || 'Try again!'}</p>}
                  {status === 'running' && <p className="animate-pulse text-muted">Running…</p>}
                  {status === 'idle' && <p className="text-muted">{collected.size} / {STARS_REQUIRED} stars</p>}
                </div>
              </div>
            </div>

            {/* ── Divider ── */}
            <div className="h-px w-full bg-muted/20 lg:h-auto lg:w-px" />

            {/* ── Controls panel ── */}
            <div className="flex flex-col gap-4 p-6 sm:p-8 lg:w-72">

              {/* Level info */}
              <div className="border-b border-muted/20 pb-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Level 4 Preview</p>
                <h3 className="mt-1 font-bold text-foreground">Blue Means Turn</h3>
                <p className="mt-1 text-xs leading-relaxed text-foreground/55">
                  Blue tiles mark corners. Turn right only when on blue. Use this pattern to loop the star ring!
                </p>
              </div>

              {/* Commands */}
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted">Commands</p>
                <div className="flex flex-wrap gap-2">
                  {(['FWD', 'RIGHT', 'LEFT'] as Cmd[]).map(cmd => (
                    <button
                      key={cmd}
                      onClick={() => setActiveCmd(c => c === cmd ? null : cmd)}
                      className={[
                        'inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold shadow-sm transition-all',
                        CMD_STYLE[cmd],
                        activeCmd === cmd ? 'ring-2 ring-offset-1 ring-offset-cream scale-105' : 'opacity-85 hover:opacity-100',
                      ].join(' ')}
                    >
                      {CMD_LABEL[cmd]}
                    </button>
                  ))}
                </div>
                {activeCmd ? (
                  <p className="mt-1.5 text-[10px] text-primary/70">Click a slot to place {CMD_SHORT[activeCmd]}.</p>
                ) : (
                  <p className="mt-1.5 text-[10px] text-muted/60">Select a command, then click a slot.</p>
                )}
              </div>

              {/* Slots */}
              <div className="flex-1">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted">Program</p>
                <div className="flex flex-col gap-1.5">
                  {slots.map((slot, i) => (
                    <button
                      key={i}
                      onClick={() => handleSlotClick(i)}
                      disabled={status !== 'idle'}
                      className={[
                        'flex h-9 w-full items-center justify-between rounded-lg border px-3 text-[11px] font-medium transition-all',
                        activeSlot === i
                          ? 'border-amber-400 bg-amber-50 text-amber-800 shadow-sm'
                          : slot
                            ? CMD_SLOT_STYLE[slot]
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
                          onClick={e => clearSlot(i, e)}
                          className="cursor-pointer text-[10px] text-muted/50 hover:text-red-400"
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
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
                  <p className="text-[11px] leading-relaxed text-amber-800">
                    💡 The full game has 16 levels with recursive <strong>Functions</strong> and <strong>Conditional logic</strong> — this preview has just 4 slots. In the full version you can write: F1 = [Forward, Turn Right if On Blue, Call F1].
                  </p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={runGame}
                  disabled={status !== 'idle'}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  ▶ Run
                </button>
                <button onClick={resetGame} title="Reset" className="rounded-xl border border-muted/30 px-3.5 py-2.5 text-sm text-foreground/60 transition-all hover:bg-pampas-warm active:scale-95">↺</button>
                <button
                  onClick={() => setShowHint(h => !h)}
                  className={['rounded-xl border px-3.5 py-2.5 text-sm transition-all active:scale-95', showHint ? 'border-amber-300 bg-amber-50 text-amber-700' : 'border-muted/30 text-foreground/60 hover:bg-pampas-warm'].join(' ')}
                >?</button>
              </div>

              {/* Full version CTA */}
              <Link
                to="/game"
                className="flex items-center justify-center gap-1.5 rounded-xl border border-muted/25 py-2.5 text-sm font-semibold text-primary transition-all hover:border-primary/40 hover:bg-primary hover:text-white active:scale-95"
              >
                Play Full Version (16 Levels) →
              </Link>

            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
