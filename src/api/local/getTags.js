import { db } from "@/db/db"
import { uniq, isEmpty, flattenDeep } from "lodash-es"

//获取代码片段的所有标签
export const getTags = async () => {
    const gist = await db.gistTable.toArray()
    let gistTags = gist.map(g => g.tags).filter(t => !isEmpty(t))
    gistTags = flattenDeep(gistTags)
    gistTags.sort((a, b) => {
        const charA = a.charCodeAt(0);
        const charB = b.charCodeAt(0);
        return charA - charB;
    })
    return uniq(gistTags)
}