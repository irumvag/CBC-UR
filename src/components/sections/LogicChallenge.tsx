import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

type Direction = 'N' | 'E' | 'S' | 'W'
type Cmd = 'MOVE_FORWARD' | 'TURN_LEFT' | 'TURN_RIGHT'
type GameStatus = 'idle' | 'running' | 'won' | 'failed'

// ─── Level 1 preview config ───────────────────────────────────────────────────
const GRID_SIZE = 5
const GRID: ('E' | 'S' | 'W')[][] = [
  ['E', 'E', 'E', 'E', 'E'],
  ['E', 'E', 'E', 'E', 'E'],
  ['E', 'E', 'S', 'E', 'E'],
  ['E', 'E', 'E', 'E', 'E'],
  ['E', 'E', 'E', 'E', 'E'],
]
const START = { x: 2, y: 4 }
const START_DIR: Direction = 'N'
const STARS_REQUIRED = 1
const SLOT_COUNT = 4

// ─── Helpers ──────────────────────────────────────────────────────────────────
const ARROW: Record<Direction, string> = { N: '▲', E: '▶', S: '▼', W: '◀' }

function move(pos: { x: number; y: number }, dir: Direction) {
  const d = ({ N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] } as const)[dir]
  return { x: pos.x + d[0], y: pos.y + d[1] }
}
function right(d: Direction): Direction {
  return ({ N: 'E', E: 'S', S: 'W', W: 'N' } as const)[d]
}
function left(d: Direction): Direction {
  return ({ N: 'W', W: 'S', S: 'E', E: 'N' } as const)[d]
}
function oob(pos: { x: number; y: number }) {
  return pos.x < 0 || pos.x >= GRID_SIZE || pos.y < 0 || pos.y >= GRID_SIZE
}

// ─── Execution trace ──────────────────────────────────────────────────────────
interface Frame {
  pos: { x: number; y: number }
  dir: Direction
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
    if (cmd === 'MOVE_FORWARD') {
      const next = move(pos, dir)
      if (oob(next) || GRID[next.y][next.x] === 'W') {
        frames.push({ pos: { ...pos }, dir, collected: new Set(collected), slot: i, status: 'failed', msg: 'Robot hit a wall!' })
        return frames
      }
      pos = next
      const key = `${pos.x},${pos.y}`
      if (GRID[pos.y][pos.x] === 'S' && !collected.has(key)) {
        collected = new Set(collected)
        collected.add(key)
      }
    } else if (cmd === 'TURN_RIGHT') {
      dir = right(dir)
    } else if (cmd === 'TURN_LEFT') {
      dir = left(dir)
    }
    const won = collected.size >= STARS_REQUIRED
    frames.push({ pos: { ...pos }, dir, collected: new Set(collected), slot: i, status: won ? 'won' : 'running', msg: '' })
    if (won) return frames
  }

  const finalStatus = collected.size >= STARS_REQUIRED ? 'won' : 'failed'
  frames.push({
    pos: { ...pos }, dir, collected: new Set(collected), slot: -1,
    status: finalStatus,
    msg: finalStatus === 'failed' ? 'Not all stars collected. Try again!' : '',
  })
  return frames
}

// ─── Component ────────────────────────────────────────────────────────────────
export function LogicChallenge() {
  const [slots, setSlots] = useState<(Cmd | null)[]>(Array(SLOT_COUNT).fill(null))
  const [robotPos, setRobotPos] = useState(START)
  const [robotDir, setRobotDir] = useState<Direction>(START_DIR)
  const [collected, setCollected] = useState(new Set<string>())
  const [activeSlot, setActiveSlot] = useState(-1)
  const [status, setStatus] = useState<GameStatus>('idle')
  const [message, setMessage] = useState('')
  const [showHint, setShowHint] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => () => { timers.current.forEach(clearTimeout) }, [])

  const resetGame = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setRobotPos(START)
    setRobotDir(START_DIR)
    setCollected(new Set())
    setActiveSlot(-1)
    setStatus('idle')
    setMessage('')
    setShowHint(false)
  }

  const cycleSlot = (i: number) => {
    if (status !== 'idle') return
    setSlots(prev => prev.map((s, j) => j === i ? (s ? null : 'MOVE_FORWARD') : s))
  }

  const runGame = () => {
    if (status !== 'idle') return
    timers.current.forEach(clearTimeout)
    timers.current = []
    const trace = computeTrace(slots)
    setStatus('running')
    trace.forEach((frame, i) => {
      const t = setTimeout(() => {
        setRobotPos(frame.pos)
        setRobotDir(frame.dir)
        setCollected(frame.collected)
        setActiveSlot(frame.slot)
        setStatus(frame.status as GameStatus)
        setMessage(frame.msg)
      }, (i + 1) * 650)
      timers.current.push(t)
    })
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
              Built by members of Claude Builder Club. Can you solve Level&nbsp;1?
            </p>
          </div>
          <Link
            to="/game"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-primary/25 px-4 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-white active:scale-95"
          >
            Play Full Version →
          </Link>
        </div>

        {/* ── Game card ── */}
        <div className="overflow-hidden rounded-2xl border border-muted/20 bg-cream shadow-sm">
          <div className="flex flex-col lg:flex-row">

            {/* ── Grid panel ── */}
            <div className="flex flex-col items-center justify-center gap-6 p-6 sm:p-10 lg:flex-1">

              {/* Grid */}
              <div className="flex flex-col gap-1.5">
                {GRID.map((row, y) => (
                  <div key={y} className="flex gap-1.5">
                    {row.map((cell, x) => {
                      const isRobot = robotPos.x === x && robotPos.y === y
                      const isStar = cell === 'S'
                      const isCollected = collected.has(`${x},${y}`)
                      const isWall = cell === 'W'
                      return (
                        <div
                          key={x}
                          className={[
                            'flex items-center justify-center rounded-xl text-base font-bold transition-all duration-300',
                            isWall ? 'bg-charcoal' : 'border border-muted/20 bg-pampas-warm',
                            isRobot ? 'ring-2 ring-primary ring-offset-2 ring-offset-cream' : '',
                          ].filter(Boolean).join(' ')}
                          style={{ width: '3.25rem', height: '3.25rem' }}
                        >
                          {isRobot && (
                            <span className="text-xl text-primary transition-transform duration-300">
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

              {/* Status line */}
              <div className="h-5 text-center text-sm">
                {status === 'won' && <p className="font-semibold text-green-600">🎉 Level 1 Complete! Try the full game.</p>}
                {status === 'failed' && <p className="font-medium text-red-500">{message || 'Try again!'}</p>}
                {status === 'running' && <p className="animate-pulse text-muted">Running…</p>}
                {status === 'idle' && <p className="text-muted">Stars: {collected.size} / {STARS_REQUIRED}</p>}
              </div>
            </div>

            {/* ── Divider ── */}
            <div className="h-px w-full bg-muted/20 lg:h-auto lg:w-px" />

            {/* ── Controls panel ── */}
            <div className="flex flex-col gap-5 p-6 sm:p-8 lg:w-72">

              {/* Level info */}
              <div className="border-b border-muted/20 pb-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Level 1 Preview</p>
                <h3 className="mt-1 font-bold text-foreground">Straight Line</h3>
                <p className="mt-1 text-xs leading-relaxed text-foreground/55">
                  Guide the robot (▲) to the star (★). Click a slot to add a command, then press Run.
                </p>
              </div>

              {/* Available commands */}
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted">Commands</p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-lg border border-sky-300 bg-sky-50 px-2.5 py-1.5 text-[11px] font-semibold text-sky-700">
                    ▲ Move Forward
                  </span>
                </div>
              </div>

              {/* Program slots */}
              <div className="flex-1">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted">Main Program</p>
                <div className="flex flex-col gap-1.5">
                  {slots.map((slot, i) => (
                    <button
                      key={i}
                      onClick={() => cycleSlot(i)}
                      disabled={status !== 'idle'}
                      className={[
                        'flex h-9 w-full items-center justify-between rounded-lg border px-3 text-[11px] font-medium transition-all',
                        activeSlot === i
                          ? 'border-primary bg-primary/15 text-primary shadow-sm'
                          : slot
                            ? 'border-sky-300 bg-sky-50 text-sky-700'
                            : 'border-dashed border-muted/40 text-muted/70 hover:border-primary/30 hover:bg-primary/5 hover:text-primary/70',
                        'disabled:cursor-not-allowed',
                      ].join(' ')}
                    >
                      <span className="font-mono text-[10px] text-foreground/25">{i + 1}</span>
                      <span>{slot ? '▲ Fwd' : '+ click to add'}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hint */}
              {showHint && (
                <p className="rounded-xl border border-muted/20 bg-pampas-warm px-3 py-2 text-[11px] leading-relaxed text-foreground/60">
                  💡 Add <strong>Move Forward</strong> to slots 1 and 2, then press Run.
                </p>
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

              {/* Full version CTA */}
              <Link
                to="/game"
                className="flex items-center justify-center gap-1.5 rounded-xl border border-muted/25 py-2.5 text-sm font-medium text-foreground/60 transition-all hover:border-primary/30 hover:text-primary"
              >
                Play Full Version (8 Levels) →
              </Link>

            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
