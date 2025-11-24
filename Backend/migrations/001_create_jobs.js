exports.up = async function (knex) {
    const exists = await knex.schema.hasTable('jobs');
    if (!exists) {
        await knex.schema.createTable('jobs', (t) => {
            t.increments('id').primary();
            t.string('taskName').notNullable();
            // store payload as text to support sqlite; MySQL can use JSON
            t.text('payload');
            t.string('priority', 16).defaultTo('Low');
            t.string('status', 32).defaultTo('pending');
            t.timestamp('createdAt').defaultTo(knex.raw('CURRENT_TIMESTAMP'));
            // updatedAt handled by application for sqlite; for MySQL this works too
            t.timestamp('updatedAt').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
            t.timestamp('completedAt').nullable();
        });
    }
};

exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('jobs');
};
