const express = require("express");
const { Router } = require('express');
const axios = require('axios');
const cors = require('cors');
const qs = require('qs');
const md5 = require("js-md5");
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

router.get('/yida-app', (_req, res) => {
    const query = _req.query || {}
    if (query.accessToken) {
        axios.post('https://oapi.dingtalk.com/topapi/user/getbyunionid?access_token=' + query.accessToken, {
            unionid: 'kJEef0kwkay5T1JtPyZpGAiEiE'
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((result) => {
            const userid = result.data.result.userid;
            const token =  "JFYJPKDVR3XL7KIRYM50K03AUU7R12J2IRQIKL"
            const md32 = md5('ding35ba782b379de863a39a90f97fcb1e09' + userid + token)
            const params = {
                token: md32.toUpperCase(),
                corpId: 'ding35ba782b379de863a39a90f97fcb1e09',
                userId: userid,
                pageSize:100,
                pageNumber:1
            }
            console.log(params);
            axios.get('https://api.dingtalk.com/v1.0/yida/organizations/applications?' + qs.stringify(params), {
                headers: {
                    'x-acs-dingtalk-access-token': query.accessToken,
                    'Content-Type': 'application/json',
                }
            }).then(result => {
                res.status(200).json({ code: 200, data: result.data });
            }, (err) => {
                res.status(200).json({ code: 200, data: null });
            })
        })
    }
})



app.use("/api", router);

app.listen(9000, () => console.log("Server ready on port 9000"));

module.exports = app;