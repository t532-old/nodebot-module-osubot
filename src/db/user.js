import { api } from '../web'
import find from './find'
import db from './server'
const users = db.get('users')

/**
 * Adds a bound user to db
 * @param {string} qqid - The querying arg qqid
 * @param {string} osuid The querying arg osuid
 * @returns {Promise}
 */
async function newUser(qqid, osuid) {
    const exists = await users.findOne({ qqid })
    let osu, taiko, ctb, mania
    if (exists)
        return false
    try {
        [osu, taiko, ctb, mania] = await Promise.all([
            api.statQuery({ u: osuid, m: 0 }),
            api.statQuery({ u: osuid, m: 1 }),
            api.statQuery({ u: osuid, m: 2 }),
            api.statQuery({ u: osuid, m: 3 }),
        ])
    } catch { return false }
    return users.insert({ qqid, osuid, data: [osu, taiko, ctb, mania] })
}

/**
 * Remove a user from bound users' list in db
 * @param {string} qqid - The querying arg qqid
 * @returns {Promise}
 */
async function delUser(qqid) {
    return users.remove({ qqid })
}

export default { ...find, newUser, delUser }