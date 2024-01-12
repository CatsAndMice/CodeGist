import { db } from "@/db/db"
import { uniq } from "lodash-es"

export const getTags = async () => {
    const allTag = await db.tags.toArray()
    const tags = allTag.map(t => t.tag)
    tags.sort((a, b) => {
        const charA = a.charCodeAt(0);
        const charB = b.charCodeAt(0);
        return charA - charB;
    })
    return uniq(tags)
}