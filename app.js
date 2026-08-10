const express = require("express");

const app = express();

const PORT = 3000;

app.get("/", (req, res) => {
    res.send("Hello from Node.js CI/CD Pipeline!");
});

app.get("/health", (req, res) => {
    res.status(200).send("Application is healthy");
});

app.listen(PORT, () => {
    console.log(`Application running on port ${PORT}`);
});
