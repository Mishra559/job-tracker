import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import {
  Search, Filter, Plus, Edit2, Trash2, ChevronLeft,
  ChevronRight, MapPin, Calendar, Loader2, Inbox, ChevronDown
} from 'lucide-react'
import { jobsApi } from '../../utils/api'
import { STATUS_OPTIONS, STATUSES, formatDate } from '../../utils/constants'
import StatusBadge from '../ui/StatusBadge'
import ConfirmModal from '../ui/ConfirmModal'

const SORT_OPTIONS = [
  { value: 'applicationDate', label: 'Application Date' },
  { value: 'companyName', label: 'Company Name' },
  { value: 'createdAt', label: 'Date Added' },
]

export default function JobList() {
  const navigate = useNavigate()

  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState('applicationDate')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, company: '' })
  const [deleteLoading, setDeleteLoading] = useState(false)

  const PAGE_SIZE = 10

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    try {
      const params = {
        page,
        size: PAGE_SIZE,
        sortBy,
        sortDir,
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
      }
      const { data } = await jobsApi.getAll(params)
      setJobs(data.content || [])
      setTotalPages(data.totalPages || 0)
      setTotalElements(data.totalElements || 0)
    } catch {
      toast.error('Failed to load job applications')
    } finally {
      setLoading(false)
    }
  }, [page, sortBy, sortDir, search, statusFilter])

  useEffect(() => {
    const debounce = setTimeout(fetchJobs, 300)
    return () => clearTimeout(debounce)
  }, [fetchJobs])

  // Reset to page 0 on filter/search change
  useEffect(() => { setPage(0) }, [search, statusFilter, sortBy, sortDir])

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await jobsApi.delete(deleteModal.id)
      toast.success('Application deleted')
      setDeleteModal({ open: false, id: null, company: '' })
      fetchJobs()
    } catch {
      toast.error('Failed to delete application')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Applications</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            {totalElements} total application{totalElements !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={() => navigate('/jobs/new')} className="btn-primary">
          <Plus size={16} />
          Add Application
        </button>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-60">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search company or job title…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10 py-2.5 text-sm"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-3 text-slate-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field appearance-none py-2.5 pl-9 pr-9 text-sm"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown size={13} className="pointer-events-none absolute right-3 top-3.5 text-slate-500" />
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={`${sortBy}|${sortDir}`}
            onChange={(e) => {
              const [field, dir] = e.target.value.split('|')
              setSortBy(field)
              setSortDir(dir)
            }}
            className="input-field appearance-none py-2.5 pr-9 text-sm"
          >
            {SORT_OPTIONS.flatMap((opt) => [
              <option key={`${opt.value}|desc`} value={`${opt.value}|desc`}>{opt.label} ↓</option>,
              <option key={`${opt.value}|asc`} value={`${opt.value}|asc`}>{opt.label} ↑</option>,
            ])}
          </select>
          <ChevronDown size={13} className="pointer-events-none absolute right-3 top-3.5 text-slate-500" />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="animate-spin text-cyan-400" size={28} />
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
            <Inbox size={40} className="text-slate-600" />
            <p className="text-slate-400">No applications found</p>
            <button onClick={() => navigate('/jobs/new')} className="btn-primary text-xs">
              <Plus size={14} /> Add your first application
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['Company', 'Role', 'Location', 'Date', 'Status', ''].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {jobs.map((job) => (
                  <tr
                    key={job.id}
                    className="group transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-white">{job.companyName}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-slate-300">{job.jobTitle}</p>
                    </td>
                    <td className="px-5 py-4">
                      {job.location ? (
                        <span className="flex items-center gap-1.5 text-xs text-slate-400">
                          <MapPin size={12} className="flex-shrink-0" />
                          {job.location}
                        </span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Calendar size={12} className="flex-shrink-0" />
                        {formatDate(job.applicationDate)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={job.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => navigate(`/jobs/${job.id}/edit`)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-400"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ open: true, id: job.id, company: job.companyName })}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-white/[0.06] px-5 py-3.5">
            <p className="text-xs text-slate-500">
              Page {page + 1} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:bg-white/5 disabled:opacity-30"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:bg-white/5 disabled:opacity-30"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null, company: '' })}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Application"
        message={`Are you sure you want to delete your application at ${deleteModal.company}? This action cannot be undone.`}
      />
    </div>
  )
}
