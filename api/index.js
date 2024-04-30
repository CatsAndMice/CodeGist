const express = require("express");
const { Router } = require('express');
const axios = require('axios');
const app = express();
const router = Router();
app.use(express.json())
router.post('/healthcheck', (_req, res) => {
    const body = _req.json(_req.body)
    axios.post(body.sessionWebhook,{
        contentType:'ai_card',
        content:{
            templateId:'38d66950-4638-446b-81c4-edddb08d12c3.schema',
            cardData:{
                content:'Hello World'
            }
        }
    },{
        headers: {
            'Content-Type': 'application/json'
        }
    })
    res.status(200).json({
        message: "测试成功",
        status: "成功"
    });
})

app.use("/api", router);

app.listen(9090, () => console.log("Server ready on port 9090"));

module.exports = app;