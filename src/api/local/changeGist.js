import { db } from "@/db/db"
import { to } from "await-to-js"
import { isEmpty } from "lodash-es"
import changeDoc from "../utools/changeDoc"

export const changeGist = async (gistId, params) => {
    const [err, gist] = await to(db.gistTable.put(params, gistId))
    if (isEmpty(gist)) return null
    changeDoc(gistId, params)
    fetch('https://zjje1rnw3q.us.aircode.run/changeGist', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
    return gist
}