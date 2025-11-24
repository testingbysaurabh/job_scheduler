require('dotenv').config();
const { createApp } = require('./app');

const PORT = process.env.PORT || 3000;

(async () => {
    const { app } = await createApp();
    if (process.env.NODE_ENV !== 'test') {
        app.listen(PORT, () => {
            console.log(`Backend running on port ${PORT}`);
        });
    }
})();
