import { db } from "@/db/db"
import { to } from "await-to-js"
import { isEmpty } from "lodash-es"

export const changeGist = async (gistId, params) => {
    const [err, gist] = await to(db.gistTable.put(params,gistId))
    console.log(gist);
    if (isEmpty(gist)) return null
    return gist
}