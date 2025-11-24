const express = require('express');
const createKnex = require('./knex');
const JobModelFactory = require('./models/jobModel');
const JobsControllerFactory = require('./controllers/jobsController');
const RoutesFactory = require('./routes');

async function createApp() {
    const knex = await createKnex();
    const jobModel = JobModelFactory(knex);
    await jobModel.ensureTables();

    const jobsController = JobsControllerFactory(jobModel);
    const routes = RoutesFactory(jobsController);

    const app = express();
    app.use(express.json());

    // simple CORS for dev
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
        if (req.method === 'OPTIONS') return res.sendStatus(200);
        next();
    });

    app.use('/', routes);

    return { app, knex };
}

module.exports = { createApp };
