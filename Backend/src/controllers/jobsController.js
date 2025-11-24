const axios = require('axios');

module.exports = function JobsController(jobModel) {
    return {
        create: async (req, res) => {
            try {
                const { taskName, payload, priority } = req.body;
                if (!taskName) return res.status(400).json({ error: 'taskName required' });
                const job = await jobModel.createJob({ taskName, payload, priority });
                res.status(201).json(job);
            } catch (err) {
                console.error('create job error', err.message || err);
                res.status(500).json({ error: 'server error' });
            }
        },

        list: async (req, res) => {
            try {
                const { status, priority } = req.query;
                const rows = await jobModel.listJobs({ status, priority });
                res.json(rows);
            } catch (err) {
                console.error('list jobs error', err.message || err);
                res.status(500).json({ error: 'server error' });
            }
        },

        detail: async (req, res) => {
            try {
                const job = await jobModel.getJob(req.params.id);
                if (!job) return res.status(404).json({ error: 'not found' });
                res.json(job);
            } catch (err) {
                console.error('get job error', err.message || err);
                res.status(500).json({ error: 'server error' });
            }
        },

        run: async (req, res) => {
            try {
                const id = req.params.id;
                const job = await jobModel.getJob(id);
                if (!job) return res.status(404).json({ error: 'not found' });

                await jobModel.updateJob(id, { status: 'running' });

                // simulate work
                await new Promise(r => setTimeout(r, 3000));

                const completedAt = new Date().toISOString();
                await jobModel.updateJob(id, { status: 'completed', completedAt });
                const finished = await jobModel.getJob(id);

                const webhookUrl = process.env.WEBHOOK_URL;
                if (webhookUrl) {
                    const payloadToSend = {
                        jobId: finished.id,
                        taskName: finished.taskName,
                        priority: finished.priority,
                        payload: (() => { try { return JSON.parse(finished.payload); } catch (e) { return finished.payload; } })(),
                        completedAt: finished.completedAt,
                    };
                    try {
                        const resp = await axios.post(webhookUrl, payloadToSend, { timeout: 5000 });
                        console.log('Webhook sent, status:', resp.status);
                        console.log('Webhook response data:', resp.data);
                        // log webhook to DB
                        try { await jobModel.logWebhook({ jobId: finished.id, requestBody: payloadToSend, responseStatus: resp.status, responseBody: resp.data }); } catch (e) { console.error('logWebhook failed', e); }
                    } catch (err) {
                        console.error('Webhook error:', err.message || err);
                        try { await jobModel.logWebhook({ jobId: finished.id, requestBody: payloadToSend, responseStatus: err.response ? err.response.status : null, responseBody: err.response ? err.response.data : err.message }); } catch (e) { console.error('logWebhook failed', e); }
                    }
                } else {
                    console.log('WEBHOOK_URL not set; skipping webhook trigger.');
                }

                res.json({ message: 'job completed', job: finished });
            } catch (err) {
                console.error('run job error', err.message || err);
                res.status(500).json({ error: 'server error' });
            }
        },

        webhookTest: async (req, res) => {
            console.log('Received webhook-test payload:', req.body);
            res.json({ received: true, body: req.body });
        }
    };
};
