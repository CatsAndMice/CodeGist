import { db } from "@/db/db"
import { to } from "await-to-js"
import { isEmpty } from "lodash-es"
import { createTag } from "./createTag"
export const changeGist = async (gistId, params) => {
    const [err, gist] = await to(db.gistTable.put(params, gistId))
    if (isEmpty(gist)) return null
    //创建标签
    createTag(params.tags)
    return gist
}