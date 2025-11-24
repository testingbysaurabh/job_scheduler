const knexLib = require('knex');

async function createKnex() {
    const mysqlConfig = {
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST || '127.0.0.1',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || '',
            database: process.env.DB_NAME || 'job_scheduler',
        },
        pool: { min: 0, max: 7 },
    };

    const sqliteConfig = {
        client: 'sqlite3',
        connection: { filename: './dev.sqlite3' },
        useNullAsDefault: true,
    };

    // If user explicitly requested sqlite, use it immediately.
    const clientEnv = (process.env.DB_CLIENT || '').toLowerCase();
    const strictMode = (process.env.DB_STRICT || '').toLowerCase() === 'true';

    if (clientEnv === 'sqlite') {
        console.log('Using sqlite (DB_CLIENT=sqlite)');
        return knexLib(sqliteConfig);
    }

    // Only attempt MySQL when explicitly requested, or when strict mode is enabled.
    if (clientEnv === 'mysql' || strictMode) {
        const knex = knexLib(mysqlConfig);
        try {
            await knex.raw('select 1+1 as result');
            console.log('Connected to MySQL');
            return knex;
        } catch (err) {
            console.warn('MySQL connection failed:', err.message || err);
            if (strictMode) {
                try { await knex.destroy(); } catch (e) { }
                throw new Error('DB_STRICT enabled and MySQL connection failed: ' + (err.message || err));
            }
            try { await knex.destroy(); } catch (e) { }
            console.warn('Falling back to sqlite');
            return knexLib(sqliteConfig);
        }
    }

    // Default: prefer sqlite to avoid noisy MySQL connection attempts during development/demo.
    console.log('Defaulting to sqlite (set DB_CLIENT=mysql to use MySQL)');
    return knexLib(sqliteConfig);
}

module.exports = createKnex;
