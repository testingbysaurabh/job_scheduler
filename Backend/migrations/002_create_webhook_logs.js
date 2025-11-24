exports.up = async function (knex) {
    const exists = await knex.schema.hasTable('webhook_logs');
    if (!exists) {
        await knex.schema.createTable('webhook_logs', (t) => {
            t.increments('id').primary();
            t.integer('jobId').unsigned().notNullable();
            t.text('requestBody');
            t.integer('responseStatus').nullable();
            t.text('responseBody').nullable();
            t.timestamp('createdAt').defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        });
    }
};

exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('webhook_logs');
};
