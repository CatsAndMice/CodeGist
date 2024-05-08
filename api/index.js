const express = require("express");
const { Router } = require('express');
const axios = require('axios');
const app = express();
const router = Router();
app.use(express.json())
router.get('/healthcheck', (_req, res) => {
    if (_req.query.sessionWebhook) {
        console.warn(JSON.stringify(_req.body), JSON.stringify(_req.query), 'body')
        axios.post(_req.query.sessionWebhook, {
            contentType: 'ai_card',
            content: {
                templateId: '8b9c6221-65b1-462d-9e8a-d0339140904f.schema',
                cardData: {
                    content: 'Hello World'
                }
            }
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => {
            res.status(200).json({
                message: "测试成功",
                status: "成功"
            });
        }, () => {
            res.status(200).json({
                message: "测试成功",
                status: "成功"
            });
        })
        return
    }
    res.status(200).json({
        message: "测试成功",
        status: "成功"
    });
})

app.use("/api", router);

app.listen(9000, () => console.log("Server ready on port 9090"));

module.exports = app;