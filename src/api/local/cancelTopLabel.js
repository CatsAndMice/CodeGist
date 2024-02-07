import { db } from "@/db/db"
import { isEmpty, uniq } from "lodash-es"
import { to } from "await-to-js"

export const cancelTopLabel = async (tag) => {
    let [err] = await to(db.topLabel.where({ tag }).delete())
    return isEmpty(err)
}