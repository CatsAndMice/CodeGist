import { db } from "@/db/db"
import { isEmpty, uniq, trim } from "lodash-es"

export const createTag = async (tags = []) => {
    const allTag = await db.tags.toArray()
    const mapTags = allTag.map(t => t.tag)
    tags = uniq(tags)
    const filterTags = tags.map(t => {
        if (!mapTags.includes(t)) {
            return { tag: trim(t) }
        }
    }).filter(t => !isEmpty(t))
    db.tags.bulkAdd(filterTags)
}