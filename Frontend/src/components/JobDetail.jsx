import React from 'react'

export default function JobDetail({ job, onClose }) {
    if (!job) return null
    function prettyPayload(payload) {
        try { return JSON.stringify(typeof payload === 'string' ? JSON.parse(payload) : payload, null, 2) }
        catch (e) { return String(payload) }
    }

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Job #{job.id} - {job.taskName}</h3>
                    <button onClick={onClose} className="btn-muted">Close</button>
                </div>
                <div className="mb-2"><strong>Priority:</strong> {job.priority}</div>
                <div className="mb-2"><strong>Status:</strong> {job.status}</div>
                <div>
                    <strong>Payload:</strong>
                    <pre className="p-2 rounded mt-1 whitespace-pre-wrap" style={{ background: 'rgba(34,40,49,0.04)' }}>{prettyPayload(job.payload)}</pre>
                </div>
            </div>
        </div>
    )
}
