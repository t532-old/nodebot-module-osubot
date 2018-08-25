import { managedb } from '../db'
import { DB } from './_messages'

export default {
    args: '',
    options: ['backup', 'recovery'],
    /**
     * backup or recovery the db
     * @param {ContentMessage} msg The universal msg object
     * @param {string[]} type Whether the db will be backuped or recoveried
     */
    async action(msg, {}, [ type ]) {
        if (msg.static().config.operators.includes(msg.param.user_id)) {
            await managedb[type]();
            msg.send(`osubot: db: ${DB.SUCC}`)
        } else msg.send(`osubot: db: ${DB.FAIL}`)
    }
}