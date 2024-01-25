import { hasIn } from "lodash-es"

export default (gistId, params) => {
    if (!hasIn(window, 'utools')) return
    try {
        params._id = gistId
        const gist = utools.db.get(gistId)
        if (gist && gist._rev) {
            params._rev = gist._rev
        }
        utools.db.put(params)
    } catch (err) {
        console.warn(err)
    }
}