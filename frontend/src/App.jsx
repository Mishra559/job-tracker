import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './components/dashboard/Dashboard'
import JobList from './components/jobs/JobList'
import JobForm from './components/jobs/JobForm'

/**
 * Root application component.
 * Defines client-side routes within the shared Layout shell.
 */
export default function App() {
  return (
    <Layout>
      <Routes>
        {/* Dashboard */}
        <Route path="/" element={<Dashboard />} />

        {/* Job Applications list */}
        <Route path="/jobs" element={<JobList />} />

        {/* Add new application */}
        <Route path="/jobs/new" element={<JobForm />} />

        {/* Edit existing application */}
        <Route path="/jobs/:id/edit" element={<JobForm />} />

        {/* Fallback: redirect unknown paths to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
