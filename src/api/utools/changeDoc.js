import { hasIn } from "lodash-es"
export default (gistId, params) => {
    if (!hasIn(window, 'utools')) return
    params._id = gistId
    const gist = utools.db.get(gistId)
    params._rev = gist._rev
    utools.db.put(params)
}