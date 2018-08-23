// Import modules
import gm from 'gm'
import { readdirSync, unlinkSync, existsSync } from 'fs'
// Import local files
import { promisifyGM, cachepath } from './_util'
import { res } from '../web'
import { errorLog } from '../../../core/log'

/**
 * get a user's avatar
 * saves 350*350 version to avatarDest
 * @param {string} uid 
 * @param {string} avatarDest 
 * @returns {boolean} whether the operation is done or failed
 */
async function getAvatar(uid, avatarDest) {
    try { await res.avatarQuery(uid, avatarDest) }
    catch { return false }
    try {
        await promisifyGM(
            gm(avatarDest)
            .quality(100)
            .resize(350, 350)
        )
        return true
    } catch (err) {
        errorLog(err)
        await clearCachedAvatars(uid)
        return false
    }
}

/**
 * deletes a cached avatar. If uid is not specified, then delete all of them
 * @param {string} uid 
 */
function clearCachedAvatars(uid) {
    if (!uid) {
        for (let i of readdirSync(`${cachepath}/avatar`))
            unlinkSync(`${cachepath}/avatar/${i}.jpg`)
    } else {
        if (existsSync(`${cachepath}/avatar/${uid}.jpg`))
            unlinkSync(`${cachepath}/avatar/${uid}.jpg`)
    }
}

export { getAvatar, clearCachedAvatars }