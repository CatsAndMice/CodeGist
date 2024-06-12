const { Router } = require('express');
const router = Router();
const axios = require('axios');
const qs = require('qs');
const path = require('path');
const createUser = require('./createUser');
const pool = require('../db.js');
const { to } = require("await-to-js");
const { isEmpty } = require('lodash');

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
    const [err, result] = await to(pool.query(`select avatar,user_name,gender from t_user where open_id='${openId}';`));
    if (result) {
        const data = result.rows[0]
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
        VALUES ('${openId}',
            ${result},
            ${startWorkTime},
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
        start_work_time = ${startWorkTime},
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
    console.log(err);
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
    const [err, result] = await to(pool.query(`
    SELECT 
        t_work.result,
        t_work.start_work_time,
        t_work.occupation,
        t_work.ditto,
        t_work.opposite_sex,
        t_work.work_env,
        t_work.qualification,
        t_work.hours_fish,
        t_work.commute_length,
        t_work.working_hours,
        t_work.average_daily_firewood,
        t_user.user_name,
        t_user.avatar,
        t_user.gender
    FROM 
        t_work
    RIGHT 
        JOIN 
            t_user 
        ON 
            t_work.open_id = t_user.open_id 
        WHERE 
                result IS NOT NULL 
        ORDER BY 
                t_work.result 
        DESC 
        LIMIT 100;`));

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