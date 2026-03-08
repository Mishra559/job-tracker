import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import {
  Building2, Briefcase, MapPin, Calendar,
  FileText, ChevronDown, ArrowLeft, Save, Loader2
} from 'lucide-react'
import { jobsApi } from '../../utils/api'
import { STATUS_OPTIONS } from '../../utils/constants'

const EMPTY_FORM = {
  companyName: '',
  jobTitle: '',
  location: '',
  status: 'APPLIED',
  applicationDate: new Date().toISOString().split('T')[0],
  notes: '',
}

/**
 * Reusable form for creating and editing job applications.
 * If `id` is present in URL params, it loads the existing record.
 */
export default function JobForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(isEditing)

  // Load existing application when editing
  useEffect(() => {
    if (!isEditing) return
    const fetchJob = async () => {
      try {
        const { data } = await jobsApi.getById(id)
        setForm({
          companyName: data.companyName || '',
          jobTitle: data.jobTitle || '',
          location: data.location || '',
          status: data.status || 'APPLIED',
          applicationDate: data.applicationDate || '',
          notes: data.notes || '',
        })
      } catch {
        toast.error('Failed to load job application')
        navigate('/jobs')
      } finally {
        setFetchLoading(false)
      }
    }
    fetchJob()
  }, [id, isEditing, navigate])

  const validate = () => {
    const errs = {}
    if (!form.companyName.trim()) errs.companyName = 'Company name is required'
    if (!form.jobTitle.trim()) errs.jobTitle = 'Job title is required'
    if (!form.applicationDate) errs.applicationDate = 'Application date is required'
    if (!form.status) errs.status = 'Status is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      if (isEditing) {
        await jobsApi.update(id, form)
        toast.success('Application updated successfully!')
      } else {
        await jobsApi.create(form)
        toast.success('Application added successfully!')
      }
      navigate('/jobs')
    } catch (err) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-cyan-400" size={32} />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl animate-fade-up">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-all hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">
            {isEditing ? 'Edit Application' : 'Add New Application'}
          </h1>
          <p className="text-sm text-slate-400">
            {isEditing ? 'Update the details below' : 'Track a new job you applied to'}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="card space-y-6">

        {/* Row 1: Company & Title */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label">Company Name *</label>
            <div className="relative">
              <Building2 size={15} className="absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="e.g. Google"
                value={form.companyName}
                onChange={handleChange('companyName')}
                className={`input-field pl-10 ${errors.companyName ? 'border-rose-500/50 ring-1 ring-rose-500/20' : ''}`}
              />
            </div>
            {errors.companyName && (
              <p className="mt-1.5 text-xs text-rose-400">{errors.companyName}</p>
            )}
          </div>

          <div>
            <label className="label">Job Title *</label>
            <div className="relative">
              <Briefcase size={15} className="absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="e.g. Senior Engineer"
                value={form.jobTitle}
                onChange={handleChange('jobTitle')}
                className={`input-field pl-10 ${errors.jobTitle ? 'border-rose-500/50 ring-1 ring-rose-500/20' : ''}`}
              />
            </div>
            {errors.jobTitle && (
              <p className="mt-1.5 text-xs text-rose-400">{errors.jobTitle}</p>
            )}
          </div>
        </div>

        {/* Row 2: Location & Status */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label">Location</label>
            <div className="relative">
              <MapPin size={15} className="absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="e.g. Remote, New York"
                value={form.location}
                onChange={handleChange('location')}
                className="input-field pl-10"
              />
            </div>
          </div>

          <div>
            <label className="label">Status *</label>
            <div className="relative">
              <select
                value={form.status}
                onChange={handleChange('status')}
                className={`input-field appearance-none pr-10 ${errors.status ? 'border-rose-500/50' : ''}`}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#1a2235]">
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={15} className="pointer-events-none absolute right-3.5 top-3.5 text-slate-500" />
            </div>
          </div>
        </div>

        {/* Row 3: Date */}
        <div>
          <label className="label">Application Date *</label>
          <div className="relative">
            <Calendar size={15} className="absolute left-3.5 top-3.5 text-slate-500" />
            <input
              type="date"
              value={form.applicationDate}
              onChange={handleChange('applicationDate')}
              className={`input-field pl-10 ${errors.applicationDate ? 'border-rose-500/50' : ''}`}
            />
          </div>
          {errors.applicationDate && (
            <p className="mt-1.5 text-xs text-rose-400">{errors.applicationDate}</p>
          )}
        </div>

        {/* Row 4: Notes */}
        <div>
          <label className="label">Notes</label>
          <div className="relative">
            <FileText size={15} className="absolute left-3.5 top-3.5 text-slate-500" />
            <textarea
              rows={4}
              placeholder="Recruiter name, referral, follow-up date, job link…"
              value={form.notes}
              onChange={handleChange('notes')}
              className="input-field resize-none pl-10"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 border-t border-white/[0.06] pt-4">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {loading ? 'Saving…' : isEditing ? 'Update Application' : 'Save Application'}
          </button>
        </div>
      </form>
    </div>
  )
}
