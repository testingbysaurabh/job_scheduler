async function ensureTables(knex) {
    const has = await knex.schema.hasTable('jobs');
    if (!has) {
        await knex.schema.createTable('jobs', (t) => {
            t.increments('id').primary();
            t.string('taskName').notNullable();
            t.text('payload');
            t.string('priority').defaultTo('Low');
            t.string('status').defaultTo('pending');
            t.timestamp('createdAt').defaultTo(knex.raw('CURRENT_TIMESTAMP'));
            t.timestamp('updatedAt').defaultTo(knex.raw('CURRENT_TIMESTAMP'));
            t.timestamp('completedAt').nullable();
        });
        // console.log('Created table: jobs');
    }
}

module.exports = function JobModel(knex) {
    return {
        ensureTables: () => ensureTables(knex),
        createJob: async ({ taskName, payload, priority }) => {
            const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload || {});
            const [id] = await knex('jobs').insert({ taskName, payload: payloadString, priority: priority || 'Low' });
            return knex('jobs').where({ id }).first();
        },
        listJobs: async ({ status, priority } = {}) => {
            const q = knex('jobs').select('*').orderBy('id', 'desc');
            if (status) q.where('status', status);
            if (priority) q.where('priority', priority);
            return q;
        },
        getJob: async (id) => knex('jobs').where({ id }).first(),
        updateJob: async (id, patch) => {
            await knex('jobs').where({ id }).update(patch);
            return knex('jobs').where({ id }).first();
        }
        ,
        logWebhook: async ({ jobId, requestBody, responseStatus, responseBody }) => {
            try {
                return await knex('webhook_logs').insert({ jobId, requestBody: JSON.stringify(requestBody || {}), responseStatus: responseStatus || null, responseBody: responseBody ? JSON.stringify(responseBody) : null });
            } catch (err) {
                console.error('logWebhook error', err.message || err);
                return null;
            }
        }
    };
};
