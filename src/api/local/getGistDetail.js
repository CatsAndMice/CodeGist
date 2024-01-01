import { db } from "@/db/db"
import { to } from "await-to-js"
import { isEmpty } from "lodash-es"

export const getGistDetail = async (gistId) => {
    const [err, gist] = await to(db.gistTable.get({ gistId }))
    if (isEmpty(gist)) return null
    return gist
}