import { managedb } from '../db'
import { DB } from './_messages'
import { readFileSync } from 'fs'
import { safeLoad } from 'js-yaml'
// Initialize settings
const { operators } = safeLoad(readFileSync('config.yml'))

export default {
    args: '',
    options: ['backup', 'recovery'],
    /**
     * backup or recovery the db
     * @param {ContentMessage} msg The universal msg object
     * @param {string[]} type Whether the db will be backuped or recoveried
     */
    async action(msg, {}, [ type ]) {
        if (operators.includes(msg.param.user_id)) {
            await managedb[type]();
            msg.send(`osubot: db: ${DB.SUCC}`)
        } else msg.send(`osubot: db: ${DB.FAIL}`)
    }
}