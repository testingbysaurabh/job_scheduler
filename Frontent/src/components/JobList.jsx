import React from "react";

export default function JobList({ jobs, onDetails, onRun }) {
    if (!jobs || jobs.length === 0) {
        return (
            <div className="p-4 muted">
                No jobs found. Create a job to get started.
            </div>
        );
    }

    return (
        <div>
            {/* Mobile: stacked cards */}
            <div className="space-y-3 md:show">
                {jobs.map((items) => (
                    <div key={items.id} className="card">
                        <div className="flex justify-between items-start">
                            <div>
                                {/* <div className="font-semibold">#{items.id} — {items.taskName}</div> */}
                                <div className="font-semibold">{items.taskName}</div>
                                <div className="text-sm muted">
                                    {new Date(items.createdAt).toLocaleString()}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="mb-1">
                                    <strong>{items.priority}</strong>
                                </div>
                                <div className="text-sm muted">{items.status}</div>
                            </div>
                        </div>
                        <div className="mt-2 flex gap-2">
                            <button onClick={() => onDetails(items)} className="btn-muted">
                                Details
                            </button>
                            <button onClick={() => onRun(items.id)} className="btn-secondary">
                                Run Job
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="jobs-table">
                    <thead>
                        <tr>
                            <th className="p-2">ID</th>
                            <th className="p-2">Task</th>
                            <th className="p-2">Priority</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">Created</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map((items) => (
                            <tr key={items.id}>
                                <td className="p-2">{items.id}</td>
                                <td className="p-2">{items.taskName}</td>
                                <td className="p-2">{items.priority}</td>
                                <td className="p-2">{items.status}</td>
                                <td className="p-2">
                                    {new Date(items.createdAt).toLocaleString()}
                                </td>
                                <td className="p-2 space-x-2">
                                    <button
                                        onClick={() => onDetails(items)}
                                        className="btn-muted"
                                    >
                                        Details
                                    </button>
                                    <button
                                        onClick={() => onRun(items.id)}
                                        className="btn-secondary ml-2"
                                    >
                                        Run Job
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
