const express = require('express');

module.exports = function Routes(controller) {
    const router = express.Router();

    router.post('/jobs', controller.create);
    router.get('/jobs', controller.list);
    router.get('/jobs/:id', controller.detail);
    router.post('/run-job/:id', controller.run);
    router.post('/webhook-test', controller.webhookTest);

    return router;
};
