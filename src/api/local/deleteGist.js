import { db } from "@/db/db"
import { to } from "await-to-js"
import { isEmpty } from "lodash-es"
import deleteDoc from "../utools/deleteDoc"
export const deleteGist = async (gistId) => {
    const [err] = await to(db.gistTable.where({ gistId }).delete())
    if (isEmpty(err)) {
        deleteDoc(gistId)
        fetch(`https://zjje1rnw3q.us.aircode.run/deleteGist?gistId=${gistId}`, {
            method: 'get',
            headers: {
                "Content-Type": "application/json"
            },
        })
        return true
    }
    return false
}