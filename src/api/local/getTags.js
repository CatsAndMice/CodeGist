import { db } from "@/db/db"
import { isEmpty, uniq, trim } from "lodash-es"

export const getTags = async () => {
    const allTag = await db.tags.toArray()
    const tags = allTag.map(t => t.tag)
    return uniq(tags)
}