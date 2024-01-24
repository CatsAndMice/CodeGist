import { db } from "@/db/db"
import { to } from "await-to-js"
import { isEmpty } from "lodash-es"
import deleteDoc from "../utools/deleteDoc"
export const deleteGist = async (gistId) => {
    const [err] = await to(db.gistTable.where({ gistId }).delete())
    if (isEmpty(err)) {
        deleteDoc(gistId)
        return true
    }
    return false
}