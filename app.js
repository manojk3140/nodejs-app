const express = require('express');

const app = express();

const PORT = 3000;

app.get('/', (req, res) => {
    res.json({
        message: 'Node.js application is running',
        status: 'success'
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP'
    });
});

app.listen(PORT, () => {
    console.log(`Application running on port ${PORT}`);
});
