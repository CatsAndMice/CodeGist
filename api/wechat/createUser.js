const { isEmpty, toString, values } = require('lodash');
const { to } = require("await-to-js");
const pool = require('../db.js');
const Mock = require('mockjs');
const Random = Mock.Random;
module.exports = async function (openId) {
    if (isEmpty(openId)) return false;
    // 根据openid查询数据库,获取个人信息
    const [err, result] = await to(pool.query(`select user_id,login_count from t_user where open_id='${openId}'`));
    if (isEmpty(result)) {
        const cname = Random.cname()
        const params = {
            name: cname,
            openId,
            gender: "O",
            firstLoginTime: Date.now(),
            endLoginTime: Date.now(),
            loginCount: 1,
            avatar: ''
        }
        const [insertErr] = await to(pool.query(`INSERT INTO t_user (user_name,avatar, open_id, gender,first_login_time,end_login_time,login_count) VALUES('${params.name}',${params.avatar},${params.openId},${params.gender},to_timestamp(${params.firstLoginTime}),to_timestamp(${params.endLoginTime}),${params.loginCount});`))
        if (insertErr) return false
        return true
    }
    let { user_id, login_count = 1 } = result.rows[0]
    const [updateErr] = await to(pool.query(`UPDATE t_user SET login_count = ${++login_count},end_login_time = to_timestamp(${Date.now()})  WHERE user_id = ${user_id} AND open_id='${openId}';`))
    if (updateErr) return false
    return true
}