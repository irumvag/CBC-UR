import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { extractRowsFromPDF } from '@/lib/pdf-extract'
import type { CredentialFile, EmailCredential } from '@/lib/types'
import { PageHeader } from '@/components/admin/AdminTable'
import { AdminModal, FormField, AdminInput, AdminSelect, AdminToggle } from '@/components/admin/AdminModal'
import { useToast } from '@/components/ui/Toast'
import { Skeleton } from '@/components/ui/Skeleton'
import {
  Upload, Settings2, Database, Trash2, GripVertical,
  Eye, EyeOff, Search, AlertTriangle, FileText, Loader2,
  Pencil, RotateCcw
} from 'lucide-react'

// ── Color palette for source file badges ──
const FILE_COLORS = [
  { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200' },
  { bg: 'bg-sky-100', text: 'text-sky-700', border: 'border-sky-200' },
  { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
  { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
  { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' },
]

type Tab = 'upload' | 'files' | 'credentials'
type UploadStep = 'pick' | 'configure' | 'done'

interface ParsedFile {
  name: string
  rows: string[][]
}

export default function AdminCredentials() {
  const [tab, setTab] = useState<Tab>('upload')
  const { showToast } = useToast()

  // ── Upload state ──
  const [uploadStep, setUploadStep] = useState<UploadStep>('pick')
  const [parsedFiles, setParsedFiles] = useState<ParsedFile[]>([])
  const [dragging, setDragging] = useState(false)
  const [processing, setProcessing] = useState<Set<string>>(new Set())
  const [headerRow, setHeaderRow] = useState<string[]>([])
  const [colMap, setColMap] = useState({ name: '', email: '', password: '' })
  const [hasHeaderRow, setHasHeaderRow] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadError, setUploadError] = useState('')

  // ── Files tab state ──
  const [credFiles, setCredFiles] = useState<CredentialFile[]>([])
  const [filesLoading, setFilesLoading] = useState(true)

  // ── All Credentials tab state ──
  const [credentials, setCredentials] = useState<(EmailCredential & { source: string })[]>([])
  const [credsLoading, setCredsLoading] = useState(true)
  const [credSearch, setCredSearch] = useState('')
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set())
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingCred, setEditingCred] = useState<(EmailCredential & { source: string }) | null>(null)
  const [editForm, setEditForm] = useState({ name: '', email: '', password: '' })
  const [editSubmitting, setEditSubmitting] = useState(false)

  // ── Data fetching ──
  const fetchFiles = useCallback(async () => {
    setFilesLoading(true)
    const { data } = await supabase
      .from('credential_files')
      .select('*')
      .order('priority', { ascending: false })
    setCredFiles(data || [])
    setFilesLoading(false)
  }, [])

  const fetchCredentials = useCallback(async () => {
    setCredsLoading(true)
    const { data } = await supabase
      .from('email_credentials')
      .select('*, credential_file:credential_files(display_name, priority)')
      .order('name', { ascending: true })
      .limit(500)

    // Flatten the join
    const rows = (data || []).map((row: any) => ({
      ...row,
      source: row.credential_file?.display_name || 'Unknown',
      _priority: row.credential_file?.priority ?? 0,
    }))
    setCredentials(rows)
    setCredsLoading(false)
  }, [])

  useEffect(() => {
    if (tab === 'files') fetchFiles()
    if (tab === 'credentials') fetchCredentials()
  }, [tab, fetchFiles, fetchCredentials])

  // Get next auto-priority for new uploads
  const getNextPriority = async () => {
    const { data } = await supabase
      .from('credential_files')
      .select('priority')
      .order('priority', { ascending: false })
      .limit(1)
    return (data?.[0]?.priority ?? 0) + 1
  }

  // ── Header detection + smart column defaults ──
  const HEADER_KEYWORDS = ['name', 'email', 'user', 'login', 'pass', 'pwd', 'password']

  const detectAndApplyColumns = (rows: string[][], forceHasHeader?: boolean) => {
    const firstRow = rows[0] || []
    const lowerCells = firstRow.map(x => x.toLowerCase())
    const looksLikeHeader = forceHasHeader ?? lowerCells.some(cell =>
      HEADER_KEYWORDS.some(kw => cell.includes(kw))
    )

    setHasHeaderRow(looksLikeHeader)

    if (looksLikeHeader) {
      setHeaderRow(firstRow)
      const h = lowerCells
      const nameIdx = h.findIndex(x => x.includes('name'))
      setColMap({
        name: nameIdx >= 0 ? String(nameIdx) : 'auto',
        email: String(Math.max(0, h.findIndex(x => x.includes('user') || x.includes('email') || x.includes('login')))),
        password: String(Math.max(0, h.findIndex(x => x.includes('pass') || x.includes('pwd')))),
      })
    } else {
      // Headerless PDF — smart defaults
      setHeaderRow([])
      const numCols = firstRow.length
      if (numCols === 2) {
        const emailIdx = firstRow.findIndex(cell => cell.includes('@'))
        const passIdx = emailIdx === 0 ? 1 : 0
        setColMap({
          name: 'auto',
          email: String(emailIdx >= 0 ? emailIdx : 0),
          password: String(emailIdx >= 0 ? passIdx : 1),
        })
      } else {
        setColMap({
          name: numCols >= 3 ? '0' : 'auto',
          email: String(Math.min(1, numCols - 1)),
          password: String(Math.min(2, numCols - 1)),
        })
      }
    }
  }

  // ── PDF Upload Logic ──
  const addFiles = useCallback(async (fileList: FileList) => {
    const pdfs = Array.from(fileList).filter(f => f.name.toLowerCase().endsWith('.pdf'))
    if (!pdfs.length) { setUploadError('Only PDF files are accepted.'); return }
    setUploadError('')

    const existing = new Set(parsedFiles.map(f => f.name))
    const toAdd = pdfs.filter(f => !existing.has(f.name))
    if (!toAdd.length) { setUploadError('All selected files are already added.'); return }

    setProcessing(prev => {
      const s = new Set(prev)
      toAdd.forEach(f => s.add(f.name))
      return s
    })

    const parsed: ParsedFile[] = []
    for (const file of toAdd) {
      try {
        const rows = await extractRowsFromPDF(file)
        parsed.push({ name: file.name, rows })
      } catch (e) {
        setUploadError(`Failed to parse "${file.name}": ${e instanceof Error ? e.message : 'Unknown error'}`)
      }
      setProcessing(prev => {
        const s = new Set(prev)
        s.delete(file.name)
        return s
      })
    }

    setParsedFiles(prev => {
      const updated = [...prev, ...parsed]
      if (prev.length === 0 && parsed.length > 0) {
        detectAndApplyColumns(parsed[0].rows)
      }
      return updated
    })
  }, [parsedFiles])

  const removeFile = (name: string) => setParsedFiles(prev => prev.filter(f => f.name !== name))

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }, [addFiles])

  // ── Save to Supabase ──
  // Extract name from email prefix: "KAMIKAZIRAKOZE_223018402@..." → "Kamikazirakoze"
  const extractNameFromEmail = (email: string): string => {
    const username = email.split('@')[0]
    const namePart = username.split('_')[0]
    if (!namePart) return '—'
    return namePart.charAt(0).toUpperCase() + namePart.slice(1).toLowerCase()
  }

  const handleSave = async () => {
    const { name, email, password } = colMap
    if (!email || !password) {
      setUploadError('Please select at least the Email and Password columns.')
      return
    }
    const nameIsAuto = name === 'auto' || name === ''
    const ni = nameIsAuto ? -1 : parseInt(name)
    const ei = parseInt(email), pi = parseInt(password)

    setSaving(true)
    setUploadError('')

    try {
      let totalSaved = 0
      let nextPriority = await getNextPriority()

      for (const file of parsedFiles) {
        const displayName = file.name.replace(/\.pdf$/i, '')
        const dataRows = file.rows.slice(hasHeaderRow ? 1 : 0).filter(row => row[ei])

        // Create file record — new files auto-get highest priority
        const { data: fileRecord, error: fileErr } = await supabase
          .from('credential_files')
          .insert({
            filename: file.name,
            display_name: displayName,
            row_count: dataRows.length,
            priority: nextPriority++,
          })
          .select('id')
          .single()

        if (fileErr) throw fileErr

        // Bulk insert credentials in chunks of 500
        const credRows = dataRows.map(row => ({
          file_id: fileRecord.id,
          name: nameIsAuto ? extractNameFromEmail(row[ei] || '') : (row[ni] || '—'),
          email: row[ei] || '—',
          password: row[pi] || '—',
        }))

        for (let i = 0; i < credRows.length; i += 500) {
          const chunk = credRows.slice(i, i + 500)
          const { error: insertErr } = await supabase
            .from('email_credentials')
            .insert(chunk)
          if (insertErr) throw insertErr
        }

        totalSaved += dataRows.length
      }

      showToast(`Saved ${totalSaved} credentials from ${parsedFiles.length} file(s).`, 'success')
      setUploadStep('done')
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Save failed.')
      showToast('Failed to save credentials.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const resetUpload = () => {
    setParsedFiles([])
    setHeaderRow([])
    setHasHeaderRow(true)
    setColMap({ name: '', email: '', password: '' })
    setUploadStep('pick')
    setUploadError('')
  }

  // ── Drag-to-reorder state ──
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [dropIdx, setDropIdx] = useState<number | null>(null)

  // ── File Management ──
  const handleDeleteFile = async (file: CredentialFile) => {
    if (!confirm(`Delete "${file.display_name}" and all ${file.row_count} credentials from it?`)) return
    const { error } = await supabase.from('credential_files').delete().eq('id', file.id)
    if (error) { showToast(error.message, 'error'); return }
    showToast(`Deleted "${file.display_name}" and its credentials.`, 'success')
    fetchFiles()
  }

  const handleDragReorder = async (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return
    // Reorder the local array
    const reordered = [...credFiles]
    const [moved] = reordered.splice(fromIndex, 1)
    reordered.splice(toIndex, 0, moved)
    setCredFiles(reordered)

    // Assign priorities: top item = highest number, descending
    const total = reordered.length
    const updates = reordered.map((file, i) => ({
      id: file.id,
      priority: total - i,
    }))

    // Batch update
    for (const u of updates) {
      const { error } = await supabase
        .from('credential_files')
        .update({ priority: u.priority })
        .eq('id', u.id)
      if (error) { showToast(error.message, 'error'); return }
    }
    showToast('Priority order updated.', 'success')
  }

  // ── Credential edit/unclaim ──
  const openEditCred = (cred: EmailCredential & { source: string }) => {
    setEditingCred(cred)
    setEditForm({ name: cred.name, email: cred.email, password: cred.password })
    setEditModalOpen(true)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCred) return
    setEditSubmitting(true)
    try {
      const { error } = await supabase
        .from('email_credentials')
        .update({ name: editForm.name, email: editForm.email, password: editForm.password })
        .eq('id', editingCred.id)
      if (error) throw error
      showToast('Credential updated.', 'success')
      setEditModalOpen(false)
      fetchCredentials()
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Update failed.', 'error')
    } finally {
      setEditSubmitting(false)
    }
  }

  const handleUnclaim = async (cred: EmailCredential) => {
    if (!confirm(`Reset "${cred.name}" back to unclaimed? They will be able to view their credentials again.`)) return
    const { error } = await supabase
      .from('email_credentials')
      .update({ claimed_at: null })
      .eq('id', cred.id)
    if (error) { showToast(error.message, 'error'); return }
    showToast(`"${cred.name}" is now unclaimed.`, 'success')
    fetchCredentials()
  }

  // ── Credential search filter ──
  const filteredCreds = credentials.filter(c => {
    if (!credSearch) return true
    const q = credSearch.toLowerCase()
    return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c as any).source?.toLowerCase().includes(q)
  })

  // ── Duplicate detection ──
  const duplicateEmails = new Set<string>()
  const emailCounts: Record<string, number> = {}
  credentials.forEach(c => { emailCounts[c.email.toLowerCase()] = (emailCounts[c.email.toLowerCase()] || 0) + 1 })
  Object.entries(emailCounts).forEach(([email, count]) => { if (count > 1) duplicateEmails.add(email) })

  const totalStudents = parsedFiles.reduce((a, f) => a + Math.max(0, f.rows.length - (hasHeaderRow ? 1 : 0)), 0)
  const maxCols = Math.max(...parsedFiles.flatMap(f => f.rows.map(r => r.length)), 0)
  const colOptions = Array.from({ length: maxCols }, (_, i) => i)

  const TABS: { key: Tab; label: string; icon: typeof Upload }[] = [
    { key: 'upload', label: 'Upload & Extract', icon: Upload },
    { key: 'files', label: 'Manage Files', icon: Settings2 },
    { key: 'credentials', label: 'All Credentials', icon: Database },
  ]

  return (
    <div>
      <PageHeader
        title="Email Credentials"
        description="Upload PDF files with student credentials. Students can look them up at /credentials."
      />

      {/* Tab bar */}
      <div className="mb-6 flex gap-1 rounded-xl border border-muted/20 bg-cream/50 p-1">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
              tab === key
                ? 'bg-surface text-foreground shadow-sm'
                : 'text-foreground/50 hover:text-foreground/70'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* ═══ UPLOAD TAB ═══ */}
      {tab === 'upload' && (
        <div className="space-y-4">
          {/* Step 1: Pick files */}
          {uploadStep === 'pick' && (
            <div className="rounded-xl border border-muted/20 bg-surface p-6">
              <div
                className={`cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-all ${
                  dragging
                    ? 'border-primary bg-primary/5'
                    : 'border-muted/30 hover:border-primary/50 hover:bg-cream/50'
                }`}
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('pdf-input')?.click()}
              >
                <input
                  id="pdf-input"
                  type="file"
                  accept=".pdf"
                  multiple
                  style={{ display: 'none' }}
                  onChange={e => e.target.files && addFiles(e.target.files)}
                />
                <Upload className="mx-auto mb-3 h-10 w-10 text-muted" />
                <p className="text-base font-semibold text-foreground">Drop PDF files here</p>
                <p className="mt-1 text-sm text-foreground/50">
                  Multiple files supported — same column structure expected
                </p>
              </div>

              {/* File list */}
              {parsedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {parsedFiles.map((f, i) => {
                    const color = FILE_COLORS[i % FILE_COLORS.length]
                    const isProcessing = processing.has(f.name)
                    return (
                      <div
                        key={f.name}
                        className="flex items-center justify-between rounded-lg border border-muted/20 bg-cream/30 px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-2.5 w-2.5 rounded-full ${color.bg}`} />
                          <div>
                            <p className="text-sm font-medium text-foreground">{f.name}</p>
                            <p className="text-xs text-foreground/50">
                              {isProcessing ? (
                                <span className="flex items-center gap-1">
                                  <Loader2 className="h-3 w-3 animate-spin" /> parsing...
                                </span>
                              ) : (
                                `${Math.max(0, f.rows.length - (hasHeaderRow ? 1 : 0))} students`
                              )}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); removeFile(f.name) }}
                          className="rounded-md p-1.5 text-foreground/40 transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}

              {parsedFiles.length > 0 && processing.size === 0 && (
                <button
                  onClick={() => setUploadStep('configure')}
                  className="mt-4 w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-dark"
                >
                  Configure Columns &rarr;
                </button>
              )}
            </div>
          )}

          {/* Step 2: Configure columns */}
          {uploadStep === 'configure' && (
            <>
              <div className="rounded-xl border border-muted/20 bg-surface p-6">
                <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-foreground/50">
                  Map Columns
                </h3>

                <div className="mb-4">
                  <AdminToggle
                    checked={hasHeaderRow}
                    onChange={(checked) => detectAndApplyColumns(parsedFiles[0]?.rows || [], checked)}
                    label="First row is a header"
                  />
                </div>
                {hasHeaderRow && headerRow.length > 0 && (
                  <p className="mb-4 text-xs text-foreground/40">
                    Detected header: <span className="text-primary">{headerRow.join(' · ')}</span>
                  </p>
                )}
                {!hasHeaderRow && (
                  <p className="mb-4 text-xs text-amber-600">
                    No header row — first row is treated as data. Columns are shown by position.
                  </p>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {/* Name — optional, can auto-detect from email */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-primary">
                      Name <span className="text-foreground/40 font-normal normal-case">(optional)</span>
                    </label>
                    <AdminSelect
                      value={colMap.name}
                      onChange={e => setColMap(prev => ({ ...prev, name: e.target.value }))}
                    >
                      <option value="auto">Auto-detect from email</option>
                      {colOptions.map(i => (
                        <option key={i} value={String(i)}>{headerRow[i] || `Col ${i + 1}`}</option>
                      ))}
                    </AdminSelect>
                    {colMap.name === 'auto' && (
                      <p className="mt-1 text-[11px] text-foreground/40">
                        Extracts name from email prefix (e.g. kamikazirakoze_223...@stud.ur.ac.rw)
                      </p>
                    )}
                  </div>

                  {/* Email — required */}
                  {(['email', 'password'] as const).map(field => (
                    <div key={field}>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-primary">
                        {field} <span className="text-red-500">*</span>
                      </label>
                      <AdminSelect
                        value={colMap[field]}
                        onChange={e => setColMap(prev => ({ ...prev, [field]: e.target.value }))}
                      >
                        <option value="">-- pick --</option>
                        {colOptions.map(i => (
                          <option key={i} value={String(i)}>{headerRow[i] || `Col ${i + 1}`}</option>
                        ))}
                      </AdminSelect>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="mt-5 w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-dark disabled:opacity-60"
                >
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                    </span>
                  ) : (
                    `Save ${totalStudents} Credentials from ${parsedFiles.length} file(s)`
                  )}
                </button>
              </div>

              {/* Preview table */}
              <div className="rounded-xl border border-muted/20 bg-surface p-6">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-foreground/50">
                  Preview — first 4 data rows
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-muted/20">
                        {colMap.name === 'auto' && (
                          <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-primary">
                            Name (auto)
                          </th>
                        )}
                        {hasHeaderRow && headerRow.length > 0
                          ? headerRow.map((h, i) => (
                              <th key={i} className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-foreground/50">
                                {h}
                              </th>
                            ))
                          : colOptions.map(i => (
                              <th key={i} className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-foreground/50">
                                Col {i + 1}
                              </th>
                            ))
                        }
                      </tr>
                    </thead>
                    <tbody>
                      {(parsedFiles[0]?.rows || []).slice(hasHeaderRow ? 1 : 0, hasHeaderRow ? 5 : 4).map((row, i) => {
                        const emailCol = parseInt(colMap.email)
                        return (
                        <tr key={i} className="border-b border-muted/10">
                          {colMap.name === 'auto' && (
                            <td className="px-3 py-2 font-medium text-primary">
                              {extractNameFromEmail(row[emailCol] || '')}
                            </td>
                          )}
                          {row.map((c, j) => (
                            <td key={j} className="px-3 py-2 text-foreground/70">{c}</td>
                          ))}
                        </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <button
                onClick={() => setUploadStep('pick')}
                className="rounded-lg border border-muted/30 px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-cream"
              >
                &larr; Back to files
              </button>
            </>
          )}

          {/* Step 3: Done */}
          {uploadStep === 'done' && (
            <div className="rounded-xl border border-muted/20 bg-surface p-10 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                <Database className="h-7 w-7 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Credentials Saved!</h3>
              <p className="mt-1 text-sm text-foreground/60">
                Students can now search for their credentials at <span className="font-medium text-primary">/credentials</span>
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  onClick={resetUpload}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-dark"
                >
                  Upload More
                </button>
                <button
                  onClick={() => { resetUpload(); setTab('credentials') }}
                  className="rounded-lg border border-muted/30 px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-cream"
                >
                  View All Credentials
                </button>
              </div>
            </div>
          )}

          {uploadError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertTriangle className="mr-1.5 -mt-0.5 inline h-4 w-4" /> {uploadError}
            </div>
          )}
        </div>
      )}

      {/* ═══ MANAGE FILES TAB ═══ */}
      {tab === 'files' && (
        <div>
          {filesLoading ? (
            <div className="overflow-hidden rounded-xl border border-muted/20 bg-surface">
              <div className="border-b border-muted/20 px-6 py-4">
                <Skeleton className="h-4 w-48" />
              </div>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 border-b border-muted/10 px-6 py-4 last:border-b-0">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="ml-auto h-4 w-16" />
                </div>
              ))}
            </div>
          ) : credFiles.length === 0 ? (
            <div className="rounded-xl border border-muted/20 bg-surface px-6 py-12 text-center">
              <FileText className="mx-auto mb-3 h-10 w-10 text-muted/50" />
              <p className="text-sm text-foreground/50">No files uploaded yet.</p>
              <button
                onClick={() => setTab('upload')}
                className="mt-3 text-sm font-medium text-primary hover:underline"
              >
                Upload your first PDF &rarr;
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-muted/20 bg-surface shadow-sm">
              {/* Header */}
              <div className="border-b border-muted/20 bg-cream/50 px-5 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
                  Drag to reorder &mdash; top file has highest priority
                </p>
              </div>

              {/* Drag-to-reorder list */}
              <div className="divide-y divide-muted/10">
                {credFiles.map((file, i) => {
                  const color = FILE_COLORS[i % FILE_COLORS.length]
                  const rank = i + 1
                  const isDragging = dragIdx === i
                  const isDropTarget = dropIdx === i && dragIdx !== i

                  return (
                    <div
                      key={file.id}
                      draggable
                      onDragStart={() => setDragIdx(i)}
                      onDragEnd={() => { setDragIdx(null); setDropIdx(null) }}
                      onDragOver={e => { e.preventDefault(); setDropIdx(i) }}
                      onDrop={e => {
                        e.preventDefault()
                        if (dragIdx !== null) handleDragReorder(dragIdx, i)
                        setDragIdx(null)
                        setDropIdx(null)
                      }}
                      className={`flex items-center gap-3 px-4 py-3 transition-all ${
                        isDragging
                          ? 'opacity-40 bg-cream/50'
                          : isDropTarget
                          ? 'bg-primary/5 border-t-2 border-t-primary'
                          : 'hover:bg-cream/30'
                      }`}
                    >
                      {/* Drag handle */}
                      <div className="cursor-grab text-foreground/25 hover:text-foreground/50 active:cursor-grabbing">
                        <GripVertical className="h-5 w-5" />
                      </div>

                      {/* Rank badge */}
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        rank === 1
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted/10 text-foreground/40'
                      }`}>
                        #{rank}
                      </div>

                      {/* File info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${color.bg} ${color.text} ${color.border}`}>
                            {file.display_name}
                          </span>
                          {rank === 1 && (
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                              Highest
                            </span>
                          )}
                        </div>
                        <div className="mt-0.5 flex items-center gap-3 text-xs text-foreground/40">
                          <span>{file.row_count} credentials</span>
                          <span>&middot;</span>
                          <span>
                            {new Date(file.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteFile(file)}
                        className="shrink-0 rounded-md p-1.5 text-foreground/30 transition-colors hover:bg-red-50 hover:text-red-600"
                        title="Delete file and all its credentials"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )
                })}
              </div>

              {/* Footer hint */}
              <div className="border-t border-muted/20 bg-cream/30 px-5 py-3">
                <p className="text-xs text-foreground/40">
                  When the same email appears in multiple files, the credential from the top-ranked file is shown to students.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ ALL CREDENTIALS TAB ═══ */}
      {tab === 'credentials' && (
        <div>
          {/* Search bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
            <input
              type="text"
              placeholder="Search by name, email, or source file..."
              value={credSearch}
              onChange={e => setCredSearch(e.target.value)}
              className="w-full rounded-xl border border-muted/20 bg-surface py-3 pl-10 pr-4 text-sm text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Stats bar */}
          {!credsLoading && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-muted/20 bg-surface px-3 py-1 text-xs text-foreground/60">
                <span className="font-semibold text-foreground">{credentials.length}</span> credentials
              </span>
              <span className="rounded-full border border-muted/20 bg-surface px-3 py-1 text-xs text-foreground/60">
                <span className="font-semibold text-foreground">{credFiles.length || '—'}</span> files
              </span>
              {duplicateEmails.size > 0 && (
                <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-700">
                  <AlertTriangle className="mr-1 -mt-0.5 inline h-3 w-3" />
                  {duplicateEmails.size} duplicate email{duplicateEmails.size > 1 ? 's' : ''}
                </span>
              )}
            </div>
          )}

          {credsLoading ? (
            <div className="overflow-hidden rounded-xl border border-muted/20 bg-surface">
              <div className="border-b border-muted/20 px-6 py-4">
                <Skeleton className="h-4 w-48" />
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 border-b border-muted/10 px-6 py-4 last:border-b-0">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="ml-auto h-4 w-16" />
                </div>
              ))}
            </div>
          ) : filteredCreds.length === 0 ? (
            <div className="rounded-xl border border-muted/20 bg-surface px-6 py-12 text-center">
              <p className="text-sm text-foreground/50">
                {credSearch ? `No credentials matching "${credSearch}"` : 'No credentials yet.'}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-muted/20 bg-surface shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-muted/20 bg-cream/50">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground/50">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground/50">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground/50">Password</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground/50">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground/50">Source</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-foreground/50">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCreds.slice(0, 100).map((cred) => {
                      const isDup = duplicateEmails.has(cred.email.toLowerCase())
                      const isVisible = visiblePasswords.has(cred.id)
                      const fileIdx = credFiles.findIndex(f => f.display_name === (cred as any).source)
                      const color = FILE_COLORS[Math.max(0, fileIdx) % FILE_COLORS.length]

                      return (
                        <tr key={cred.id} className="border-b border-muted/10 transition-colors last:border-b-0 hover:bg-cream/30">
                          <td className="px-4 py-3 text-sm font-medium text-foreground">
                            {cred.name}
                            {isDup && (
                              <span className="ml-2 inline-flex rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                                DUP
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-primary">{cred.email}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-sm text-foreground/70">
                                {isVisible ? cred.password : '••••••••'}
                              </span>
                              <button
                                onClick={() =>
                                  setVisiblePasswords(prev => {
                                    const s = new Set(prev)
                                    if (s.has(cred.id)) s.delete(cred.id)
                                    else s.add(cred.id)
                                    return s
                                  })
                                }
                                className="rounded p-0.5 text-foreground/30 hover:text-foreground/60"
                              >
                                {isVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {(cred as any).claimed_at ? (
                              <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                                Claimed
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-muted/20 px-2 py-0.5 text-[11px] font-semibold text-foreground/50">
                                Unclaimed
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-block rounded-full border px-2 py-0.5 text-[11px] font-semibold ${color.bg} ${color.text} ${color.border}`}>
                              {(cred as any).source}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => openEditCred(cred)}
                                className="rounded-md p-1.5 text-foreground/40 transition-colors hover:bg-primary/10 hover:text-primary"
                                title="Edit credential"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              {(cred as any).claimed_at && (
                                <button
                                  onClick={() => handleUnclaim(cred)}
                                  className="rounded-md p-1.5 text-foreground/40 transition-colors hover:bg-amber-50 hover:text-amber-600"
                                  title="Reset to unclaimed"
                                >
                                  <RotateCcw className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              {filteredCreds.length > 100 && (
                <div className="border-t border-muted/20 bg-cream/30 px-4 py-3 text-center">
                  <p className="text-xs text-foreground/40">Showing first 100 of {filteredCreds.length} results</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {/* ═══ EDIT CREDENTIAL MODAL ═══ */}
      {editModalOpen && editingCred && (
        <AdminModal
          title="Edit Credential"
          onClose={() => setEditModalOpen(false)}
          onSubmit={handleEditSubmit}
          submitting={editSubmitting}
        >
          <FormField label="Name" required>
            <AdminInput
              value={editForm.name}
              onChange={e => setEditForm({ ...editForm, name: e.target.value })}
              placeholder="Student name"
              required
            />
          </FormField>
          <FormField label="Email" required>
            <AdminInput
              value={editForm.email}
              onChange={e => setEditForm({ ...editForm, email: e.target.value })}
              placeholder="Student email"
              required
            />
          </FormField>
          <FormField label="Password" required>
            <AdminInput
              value={editForm.password}
              onChange={e => setEditForm({ ...editForm, password: e.target.value })}
              placeholder="Password"
              required
            />
          </FormField>
        </AdminModal>
      )}
    </div>
  )
}
