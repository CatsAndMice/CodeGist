import { db } from "@/db/db"
import { to } from "await-to-js"
import { isEmpty, eq, toLower } from "lodash-es"

export const getGistList = async (params) => {
    const list = {
        hasMore: false,
        total: 0,
        data: [],
        size: params.size,
        page: params.page
    }
    const filter = (gist) => {
        if (params.name) {
            const name = toLower(params.name)
            return toLower(gist.description).includes(name) || toLower(gist.language).includes(name) || toLower(gist.code).includes(name)
        }
        return true
    }
    const [countErr, count] = await to(db.gistTable.filter(filter).count())
    if (countErr || eq(count, 0)) {
        list.total = count || 0
        return list
    }
    const storePage = params.page - 1
    // 降序查询
    const [err, data] = await to(db.gistTable.orderBy('editTime').reverse().filter(filter).offset(params.size * (storePage < 0 ? 0 : storePage))
        .limit(params.size)
        .toArray())
    list.total = count
    list.data = data || []
    list.hasMore = count > (params.size * params.page)
    return list
}