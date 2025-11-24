import { useState, useContext } from 'react'
import { ApiContext } from '../contexts/ApiContext'
import { useDispatch } from 'react-redux'
import { addJob } from '../store/jobsSlice'

export default function JobForm({ onCreated }) {
    const [taskName, setTaskName] = useState('')
    const [payload, setPayload] = useState('{}')
    const [priority, setPriority] = useState('Low')
    const [saving, setSaving] = useState(false)
    const { baseUrl } = useContext(ApiContext)
    const dispatch = useDispatch()

    async function submit(e) {
        e.preventDefault()
        setSaving(true)
        try {
            let parsed = payload
            try { parsed = JSON.parse(payload) } catch (e) { parsed = payload }
            const res = await fetch(`${baseUrl}/jobs`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ taskName, payload: parsed, priority })
            })
            if (res.ok) {
                const job = await res.json()
                dispatch(addJob(job))
                setTaskName('')
                setPayload('{}')
                setPriority('Low')
                onCreated && onCreated()
            } else {
                const txt = await res.text()
                alert('Create failed: ' + txt)
            }
        } catch (err) { console.error(err); alert('Create error') }
        setSaving(false)
    }

    return (
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input required value={taskName} onChange={e => setTaskName(e.target.value)} placeholder="Task name" className="p-2 border rounded" />
            <select value={priority} onChange={e => setPriority(e.target.value)} className="p-2 border rounded">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
            </select>
            <div className="col-span-1 md:col-span-3">
                <textarea value={payload} onChange={e => setPayload(e.target.value)} rows={4} className="w-full p-2 border rounded" />
            </div>
            <div className="md:col-span-3">
                <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Create Job'}</button>
            </div>
        </form>
    )
}
