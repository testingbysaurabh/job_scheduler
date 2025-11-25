const createKnex = require('../src/knex');
const path = require('path');

(async () => {
    const knex = await createKnex();
    try {
        const migrationsDir = path.join(__dirname, '..', 'migrations');
        const migrationFiles = [
            '001_create_jobs.js',
            '002_create_webhook_logs.js'
        ];

        for (const m of migrationFiles) {
            const mig = require(path.join(migrationsDir, m));
            if (mig && typeof mig.up === 'function') {
                console.log('Running migration:', m);
                await mig.up(knex);
            }
        }

        // console.log('Migrations completed');
    } catch (err) {
        console.error('Migration error:', err);
        process.exitCode = 1;
    } finally {
        try { await knex.destroy(); } catch (e) { }
    }
})();
