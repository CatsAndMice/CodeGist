const express = require("express");
const { Router } = require('express');
const app = express();
const router = Router();

router.get('/healthcheck', (_req, res) => {
    res.status(200).json({ success: true, message: 'API is running' });
})

app.use("/api", router);

app.listen(9090, () => console.log("Server ready on port 9090"));

module.exports = app;