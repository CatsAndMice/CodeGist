import { db } from "@/db/db"
import { to } from "await-to-js"
import { isEmpty } from "lodash-es"
export const deleteGist = async (gistId) => {
    const [err] = await to(db.gistTable.where({gistId}).delete())
    if (isEmpty(err)) return true
    return false
}