const { Router } = require('express');
const router = Router();
const axios = require('axios');
const qs = require('qs');
const path = require('path');
const createUser = require('./createUser');
require('dotenv').config({ path: path.join(__dirname, '../../.env.local') });

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
        axios.get('https://api.weixin.qq.com/sns/jscode2session?' + params).then(result => {
            createUser(result.data.openid)
            req.status(200).send({
                code: 200,
                data: result.data,
                msg: '请求成功'
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
    const [err, result] = await to(pool.query(`select avatar,name,gender from t_user where open_id='${openId}';`));
    if (result) {
        const data = result.raws[0]
        req.status(200).send({
            code: 200,
            data,
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
    const {
        averageDailyFirewood,
        workingHours,
        commuteLength,
        hoursFish,
        qualification,
        workEnv,
        oppositeSex,
        ditto,
        occupation,
        startWorkTime,
        result,
        openId
    } = res.body
    const [err] = await to(pool.query(`INSERT INTO t_work (
        open_id,
        result,
        start_work_time,
        occupation,
        ditto,
        opposite_sex,
        work_env,
        qualification,
        hours_fish,
        commute_length,
        working_hours,
        average_daily_firewood)
        VALUES (${openId},
            ${result},
            to_timestamp(${startWorkTime}),
            ${occupation},
            ${ditto},
            ${oppositeSex},
            ${workEnv},
            ${qualification},
            ${hoursFish},
            ${commuteLength},
            ${workingHours},
            ${averageDailyFirewood}
        )
        ON CONFLICT (open_id) DO UPDATE SET 
        result = ${result}, 
        start_work_time = to_timestamp(${startWorkTime}),
        occupation=${occupation},
        ditto=${ditto},
        opposite_sex=${oppositeSex},
        work_env=${workEnv},
        qualification=${qualification},
        hours_fish=${hoursFish},
        commute_length=${commuteLength},
        working_hours =  ${workingHours},
        average_daily_firewood = ${averageDailyFirewood}
        ;`));

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

module.exports = router;