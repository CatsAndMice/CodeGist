const { Router } = require('express');
const router = Router();
const axios = require('axios');
const qs = require('qs');
const path = require('path');
const createUser = require('./createUser');
const pool = require('../db.js');
const { to } = require("await-to-js");
const { isEmpty } = require('lodash');
const { selectWorkSql, getInfoSql, getInsertWorkSql, getSelectUserWorkSql } = require('./sql');

//登录
router.get('/wechat/login', (res, req) => {
    const { code } = res.query;
    if (code) {
        const params = qs.stringify({
            js_code: code,
            appid: 'wx32a78325801b08c7',
            grant_type: 'authorization_code',
            secret: 'd4b8cdf97e63c98b22c12f62dfb11334'
        })
        axios.get('https://api.weixin.qq.com/sns/jscode2session?' + params).then(async result => {
            const isSuccess = await createUser(result.data.openid)
            console.log(isSuccess);
            if (isSuccess) {
                req.status(200).send({
                    code: 200,
                    data: result.data,
                    msg: '请求成功'
                })
                return
            }
            req.status(200).send({
                code: 200,
                data: null,
                msg: '创建用户失败'
            })
        }, err => {
            req.status(200).send({
                code: 503,
                data: null,
                msg: '登录失败'
            })
        })
        return
    }

    req.status(200).send({
        code: 503,
        data: null,
        msg: '缺少code参数'
    })
})

//获取用户信息
router.get('/wechat/info', async (res, req) => {
    const { openId } = res.query
    const sql = getSelectUserWorkSql(openId)
    console.log(sql)
    const [userWorkErr, userWork] = await to(pool.query(sql));
    console.log(userWorkErr, userWork);
    if (userWork) {
        const data = userWork.rows[0]
        if (data) {
            req.status(200).send({
                code: 200,
                data: { ...data, isTest: true },
                msg: '请求成功'
            })
            return
        }
    }
    const [err, result] = await to(pool.query(getInfoSql(openId)));
    if (result) {
        const data = result.rows[0]
        req.status(200).send({
            code: 200,
            data: { ...data, isTest: false },
            msg: '请求成功'
        })
        return
    }


    req.status(200).send({
        code: 503,
        data: null,
        msg: '请求失败'
    })
})


router.post('/wechat/work', async (res, req) => {
    console.log(getInsertWorkSql)
    const [err] = await to(pool.query(getInsertWorkSql(res.body)));

    if (err) {
        req.status(200).send({
            code: 500,
            data: null,
            msg: '创建失败'
        })
        return
    }

    req.status(200).send({
        code: 200,
        data: null,
        msg: '请求成功'
    })
})

router.get('/wechat/work', async (res, req) => {
    const [err, result] = await to(pool.query(selectWorkSql));
    if (result && !isEmpty(result.rows)) {
        req.status(200).send({
            code: 200,
            data: result.rows,
            msg: '请求成功'
        })
        return
    }
    req.status(200).send({
        code: 200,
        data: [],
        msg: '请求成功'
    })
})

module.exports = router;