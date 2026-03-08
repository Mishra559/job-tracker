import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import {
  Briefcase, TrendingUp, Award, XCircle,
  ArrowRight, Loader2, Plus, Calendar
} from 'lucide-react'
import { jobsApi } from '../../utils/api'
import { STATUSES, formatDate } from '../../utils/constants'
import StatusBadge from '../ui/StatusBadge'

/** Individual stat card */
function StatCard({ label, value, icon: Icon, color, delay }) {
  return (
    <div
      className={`stat-card animate-fade-up opacity-0`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
          <p className="mt-2 font-display text-4xl font-bold text-white">{value}</p>
        </div>
        <div className={`rounded-xl ${color} p-3`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
      {/* decorative bar */}
      <div className={`mt-4 h-1 w-12 rounded-full ${color}`} />
    </div>
  )
}

/** Custom Recharts tooltip */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const d = payload[0]
    return (
      <div className="rounded-xl border border-white/10 bg-[#1a2235] px-4 py-3 text-sm shadow-xl">
        <p className="font-semibold text-white">{d.name}</p>
        <p className="text-slate-400">{d.value} application{d.value !== 1 ? 's' : ''}</p>
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, recentRes] = await Promise.all([
          jobsApi.getStats(),
          jobsApi.getRecent(),
        ])
        setStats(statsRes.data)
        setRecent(recentRes.data)
      } catch {
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-cyan-400" size={32} />
      </div>
    )
  }

  const pieData = [
    { name: 'Applied', value: stats?.applied || 0 },
    { name: 'Interview', value: stats?.interview || 0 },
    { name: 'Offer', value: stats?.offer || 0 },
    { name: 'Rejected', value: stats?.rejected || 0 },
  ].filter((d) => d.value > 0)

  const barData = [
    { name: 'Applied', count: stats?.applied || 0, fill: STATUSES.APPLIED.chart },
    { name: 'Interview', count: stats?.interview || 0, fill: STATUSES.INTERVIEW.chart },
    { name: 'Offer', count: stats?.offer || 0, fill: STATUSES.OFFER.chart },
    { name: 'Rejected', count: stats?.rejected || 0, fill: STATUSES.REJECTED.chart },
  ]

  const PIE_COLORS = [
    STATUSES.APPLIED.chart,
    STATUSES.INTERVIEW.chart,
    STATUSES.OFFER.chart,
    STATUSES.REJECTED.chart,
  ]

  const statCards = [
    { label: 'Total Applications', value: stats?.totalApplications || 0, icon: Briefcase, color: 'bg-cyan-500', delay: 0 },
    { label: 'In Interview', value: stats?.interview || 0, icon: TrendingUp, color: 'bg-violet-500', delay: 50 },
    { label: 'Offers Received', value: stats?.offer || 0, icon: Award, color: 'bg-emerald-500', delay: 100 },
    { label: 'Rejected', value: stats?.rejected || 0, icon: XCircle, color: 'bg-rose-500', delay: 150 },
  ]

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 animate-fade-up opacity-0" style={{ animationFillMode: 'forwards' }}>
        <h1 className="font-display text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-slate-400">Your job search at a glance</p>
      </div>

      {/* Stat Cards */}
      <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="mb-8 grid gap-6 lg:grid-cols-5">

        {/* Bar Chart — spans 3 cols */}
        <div className="card lg:col-span-3">
          <h2 className="mb-5 font-display text-base font-bold text-white">
            Applications by Status
          </h2>
          {stats?.totalApplications === 0 ? (
            <div className="flex h-48 items-center justify-center text-sm text-slate-500">
              No data yet. Add your first application!
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} barCategoryGap="30%">
                <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Chart — spans 2 cols */}
        <div className="card lg:col-span-2">
          <h2 className="mb-5 font-display text-base font-bold text-white">Distribution</h2>
          {pieData.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-sm text-slate-500">
              No data yet
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <span
                      className="h-2 w-2 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: PIE_COLORS[i] }}
                    />
                    <span className="text-slate-400 truncate">{d.name}</span>
                    <span className="ml-auto font-semibold text-slate-200">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recent Applications */}
      <div className="card">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-white">Recent Applications</h2>
          <button
            onClick={() => navigate('/jobs')}
            className="flex items-center gap-1.5 text-xs font-medium text-cyan-400 transition-colors hover:text-cyan-300"
          >
            View all <ArrowRight size={13} />
          </button>
        </div>

        {recent.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <Briefcase size={36} className="text-slate-700" />
            <p className="text-sm text-slate-500">No applications yet.</p>
            <button onClick={() => navigate('/jobs/new')} className="btn-primary text-xs">
              <Plus size={14} /> Add your first
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {recent.map((job) => (
              <div
                key={job.id}
                className="flex items-center gap-4 py-3.5 transition-colors hover:bg-white/[0.02]"
              >
                {/* Company initial */}
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 text-sm font-bold text-slate-300 ring-1 ring-white/10">
                  {job.companyName?.charAt(0).toUpperCase()}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="truncate font-semibold text-white">{job.companyName}</p>
                  <p className="truncate text-xs text-slate-400">{job.jobTitle}</p>
                </div>

                {/* Date */}
                <div className="hidden items-center gap-1.5 text-xs text-slate-500 sm:flex">
                  <Calendar size={12} />
                  {formatDate(job.applicationDate)}
                </div>

                {/* Status */}
                <StatusBadge status={job.status} size="xs" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
