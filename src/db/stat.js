import { api } from '../web'
import find from './find'
import db from './server'
const users = db.get('users')

/**
 * refreshes a bound user's stat cache
 * @param {string} osuid - The querying arg osuid
 * @returns {Promise}
 */
async function refreshStat(qqid) {
    const osuid = (await users.findOne({ qqid })).osuid
    let osu, taiko, ctb, mania
    try {
        [osu, taiko, ctb, mania] = await Promise.all([
            api.statQuery({ u: osuid, m: 0 }),
            api.statQuery({ u: osuid, m: 1 }),
            api.statQuery({ u: osuid, m: 2 }),
            api.statQuery({ u: osuid, m: 3 }),
        ])
    } catch { return }
    if (!osu.pp_rank && !taiko.pp_rank && !ctb.pp_rank && !mania.pp_rank) return users.remove({ qqid })
    else return users.update({ qqid }, { $set: { data: [osu, taiko, ctb, mania] } })
}

/**
 * refreshes all bound user's status
 */
async function refreshAllStat() {
    const docs = await users.find()
    for (let user of docs)
        await refreshStat(user.qqid)
}

export default { ...find, refreshStat, refreshAllStat }