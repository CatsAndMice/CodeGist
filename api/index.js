const express = require("express");
const { Router } = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const router = Router();

app.use(cors())
app.use(express.json())

router.get('/access-token', (_req, res) => {
    axios.post('https://api.dingtalk.com/v1.0/oauth2/accessToken', {
        "appKey": "dingc4yraklugv0j375t",
        "appSecret": "qrp6G_IkpT7JtFxGdrKkO5ajjkAdpWSRXOkob7tfZfj1GAR9dHELuLGynoy9XHZG"
    },
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(result => {
            res.status(200).json({ code: 200, data: result.data });
        }, () => {
            res.status(200).json({ code: 200, data: null });
        })
})




router.get('/micro-app', (_req, res) => {
    const query = _req.query || {}
    if (query.accessToken) {
        axios.get('https://api.dingtalk.com/v1.0/microApp/allInnerApps', {
            headers: {
                'x-acs-dingtalk-access-token': query.accessToken,
                'Content-Type': 'application/json',
            }
        }).then(result => {
            res.status(200).json({ code: 200, data: result.data.appList });
        }, () => {
            res.status(200).json({ code: 200, data: null });
        })
    }

})


app.use("/api", router);

app.listen(9000, () => console.log("Server ready on port 9000"));

module.exports = app;