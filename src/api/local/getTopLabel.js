import { db } from "@/db/db"
import { isEmpty, uniq } from "lodash-es"
import { to } from "await-to-js"

export const getTopLabel = async () => {
    let [err, topLabel] = await to(db.topLabel.toArray())
    if (isEmpty(topLabel)) {
        topLabel = []
    }

    return uniq(topLabel.map(label => {
        return label.tag
    }))
}