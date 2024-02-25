import { db } from "@/db/db"
import { to } from "await-to-js"
import { isEmpty } from "lodash-es"
import setDocs from "../utools/setDocs"
export const create = async (gistParams) => {

    const [err] = await to(db.gistTable.add(gistParams))
    //创建标签
    if (isEmpty(err)) {
        setDocs(gistParams)
        // 创建一份到远程数据库
        fetch('https://zjje1rnw3q.us.aircode.run/create', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(gistParams)
        })
        return true
    }
    console.warn(err)
    return false
}