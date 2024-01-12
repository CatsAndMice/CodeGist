import { db } from "@/db/db"
import { to } from "await-to-js"
import { isEmpty } from "lodash-es"
import { createTag } from "./createTag"
export const create = async (gistParams) => {
    const [err] = await to(db.gistTable.add(gistParams))
    //创建标签
    if (isEmpty(err)) {
        createTag(gistParams.tags)
        return true
    }
    console.warn(err)
    return false
}