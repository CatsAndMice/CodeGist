import { eq, hasIn, isEmpty, isFunction } from "lodash-es"
import { db } from "@/db/db"
import { to } from "await-to-js"
let isCall = false
export default async (callback) => {
    if (!isFunction(callback)) {
        callback = function () { }
    }
    if (!hasIn(window, 'utools')) {
        callback()
        return
    }
    //已执行过
    if (isCall) {
        callback()
        return
    }
    //  本地全部的Gist
    const [err, gists] = await to(db.gistTable.toArray())
    const allDocs = utools.db.allDocs()
    isCall = true
    console.log(gists,allDocs)
    if (isEmpty(gists)) {
        //重启utools,utools数据同步到本地
        if (!isEmpty(allDocs)) {
            //批量添加至本地
            const [err] = await to(db.gistTable.bulkAdd(allDocs))
            if (err) {
                isCall = false
            }
        }
    } else {
        //本地浏览器数据同步到utool
        gists.forEach(gist => {
            const result = utools.db.remove(gist.gistId)
            const { ok = false, name } = result
            //删除成功或不存在
            if (ok || eq(name, 'not_found')) {
                gist._id = gist.gistId
                //删除版本信息
                delete gist['_rev']
                console.log(utools.db.put(gist));
            }
        })
    }
    callback()
}