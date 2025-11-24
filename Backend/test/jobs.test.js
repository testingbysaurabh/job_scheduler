const request = require('supertest');
const { createApp } = require('../src/app');

let app, knex;

beforeAll(async () => {
    process.env.DB_CLIENT = 'sqlite';
    process.env.NODE_ENV = 'test';
    const res = await createApp();
    app = res.app;
    knex = res.knex;
});

afterAll(async () => {
    try { await knex.destroy(); } catch (e) { }
});

test('create, list, run job flow', async () => {
    // create
    const createRes = await request(app)
        .post('/jobs')
        .send({ taskName: 'test-job', payload: { a: 1 }, priority: 'High' })
        .set('Accept', 'application/json');
    expect(createRes.status).toBe(201);
    expect(createRes.body).toHaveProperty('id');
    const id = createRes.body.id;

    // list
    const listRes = await request(app).get('/jobs');
    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body)).toBe(true);

    // run
    const runRes = await request(app).post(`/run-job/${id}`);
    expect(runRes.status).toBe(200);
    expect(runRes.body).toHaveProperty('message', 'job completed');

    // detail
    const detailRes = await request(app).get(`/jobs/${id}`);
    expect(detailRes.status).toBe(200);
    expect(detailRes.body.status).toBe('completed');
});
