import { db } from "@/db/db"
import { to } from "await-to-js"
import { isEmpty } from "lodash-es"
export const create = async (gistParams) => {
    const [err] = await to(db.gistTable.add(gistParams))
    if (isEmpty(err)) return true
    return false
}