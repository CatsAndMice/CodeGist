import { hasIn } from "lodash-es"
export default (gist) => {
    if (!hasIn(window, 'utools')) return
    gist._id = gist.gistId
    utools.db.put(gist)
}