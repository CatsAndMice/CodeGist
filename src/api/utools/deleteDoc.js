import { hasIn } from "lodash-es"
export default (gistId) => {
    if (!hasIn(window, 'utools')) return
    utools.db.remove(gistId)
}