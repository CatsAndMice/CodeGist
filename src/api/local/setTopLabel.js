import { db } from "@/db/db"
import { isEmpty } from "lodash-es"
import { to } from "await-to-js"

export const setTopLabel = async (tag) => {
    const [err] = await to(db.topLabel.add({ tag }))
    return isEmpty(err)
}