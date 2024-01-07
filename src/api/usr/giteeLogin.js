import { to } from "await-to-js"
import qs from "qs"
import { db } from "medash"
import { Notification } from '@arco-design/web-vue'

const one = 1000 * 60 * 60 * 24
export default {
    //更新token:token有一天时间限制，超时则重新token
    async reGetToken(refresh_token) {
        const url = `https://gitee.com/oauth/token?grant_type=refresh_token&refresh_token=${refresh_token}`
        const response = await fetch(url, {
            method: "POST"
        })
        if (response.ok) {
            return await response.json()
        }
        return null
    },

    //获取用户信息
    async getUser(token) {
        let localToken = db.getLocalDb('token')
        if (localToken) {
            //created_at值单位为秒，现在转化成毫秒
            const createdTime = localToken.created_at * 1000
            //token过期
            if (Date.now() - createdTime > one) {
                const refresh_token = localToken.refresh_token
                this.onExit()
                //重新获取token
                const [err, reToken] = await to(this.reGetToken(refresh_token))
                if (reToken) {
                    localToken = reToken
                    db.setLocalDb('token', reToken)
                }
            }
        }

        token = token ? token : localToken?.access_token

        if (!token) {
            console.log("token不存在");
            return null
        }

        const [err, response] = await to(fetch('https://gitee.com/api/v5/user?access_token=' + token, {
            method: 'GET',
        }))
        if (response.ok) {
            const user = await response.json()
            if (user) {
                db.setSionDb('user', user)
                return user
            }
        }
        return null
    },
    //授权成功后回调链接会被拼接code, 再通过code获取token
    async getToken(code) {
        const str = qs.stringify({
            grant_type: 'authorization_code',
            client_id: process.env.VUE_APP_client_id,
            redirect_uri: process.env.VUE_APP_redirect_uri,
            client_secret: process.env.VUE_APP_client_secret
        })
        const [err, response] = await to(fetch('https://gitee.com/oauth/token?' + str, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                code
            })
        }))
        if (response.ok) {
            const token = await response.json()
            db.setLocalDb('token', token)
            if (token.access_token) {
                return await this.getUser(token.access_token)
            }
        }
        Notification.error({ title: '失败', content: '登陆失败，请重试', closable: true, duration: 1000 })
        return
    },
    //跳转gitee授权页面
    onLogin() {
        const url = `https://gitee.com/oauth/authorize?client_id=${process.env.VUE_APP_client_id}&redirect_uri=${process.env.VUE_APP_redirect_uri}&response_type=code`
        window.location.href = url
    },
    //退出登陆
    onExit() {
        db.removeLocalDb('token')
        db.removeSionDb('user')
    }
}