import { userdb } from '../db'
import { UNBIND } from './_messages'

export default {
    args: '',
    options: [],
    /**
     * unbinds an osu! id from a QQ id.
     * @param {ContentMessage} msg The universal msg object
     */
    async action(msg) {
        await userdb.delUser(msg.param.user_id)
        msg.send(`osubot: unbind: ${UNBIND.SUCC}`)
    }
}