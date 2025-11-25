import { useContext, useEffect, useState } from 'react'
import JobForm from './components/JobForm'
import JobList from './components/JobList'
import JobDetail from './components/JobDetail'
import { useDispatch, useSelector } from 'react-redux'
import { setJobs, setLoading, updateJob } from './store/jobsSlice'
import { ApiContext } from './contexts/ApiContext'

export default function App() {
  const dispatch = useDispatch()
  const jobs = useSelector(s => s.jobs.items)
  const loading = useSelector(s => s.jobs.loading)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const [selected, setSelected] = useState(null)
  const { baseUrl } = useContext(ApiContext)

  async function fetchJobs() {
    dispatch(setLoading(true))
    try {
      const params = new URLSearchParams()
      if (filterStatus) params.set('status', filterStatus)
      if (filterPriority) params.set('priority', filterPriority)
      const res = await fetch(`${baseUrl}/jobs?${params.toString()}`)
      const data = await res.json()
      dispatch(setJobs(data))
    } catch (err) { console.error(err) }
    dispatch(setLoading(false))
  }

  useEffect(() => { fetchJobs() }, [filterStatus, filterPriority])

  async function runJob(id) {
    try {
      await fetch(`${baseUrl}/run-job/${id}`, { method: 'POST' })
      // refresh job
      const res = await fetch(`${baseUrl}/jobs/${id}`)
      const job = await res.json()
      dispatch(updateJob(job))
    } catch (err) { console.error(err); alert('Run error') }
  }

  return (
    <div className="app-container">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <section className="mb-6 card">
              <h2 className="text-lg font-medium mb-2">Create Job</h2>
              <JobForm onCreated={fetchJobs} />
            </section>

            <section className="mb-4 card">
              <h3 className="text-sm font-medium mb-2">Filters</h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-sm w-20">Status:</label>
                  <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="p-2 border rounded w-full">
                    <option value="">All</option>
                    <option value="pending">pending</option>
                    <option value="running">running</option>
                    <option value="completed">completed</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm w-20">Priority:</label>
                  <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="p-2 border rounded w-full">
                    <option value="">All</option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
                <div className="pt-2">
                  <button onClick={fetchJobs} className="btn-muted w-full">Refresh</button>
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-2">
            <h1 className="text-3xl font-semibold mb-4" style={{ color: 'var(--color-1)' }}>Job Scheduler Dashboard</h1>

            <section className="card">
              <h2 className="text-lg font-medium mb-2">Jobs</h2>
              {loading ? <div>Loading...</div> : <JobList jobs={jobs} onDetails={setSelected} onRun={runJob} />}
            </section>
          </div>
        </div>

        <JobDetail job={selected} onClose={() => setSelected(null)} />
      </div>
    </div>
  )
}
