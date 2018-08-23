import { userdb } from '../db'
import { api } from '../web'
import { QUERY, BIND } from './_messages'

export default {
    args: '[account...]',
    options: [],
    /**
     * binds an osu! id with a QQ id.
     * @param {ContentMessage} msg The universal msg object
     * @param {{ account: string }} - The account
     */
    async action(msg, { account }) {
        account = account.join(' ')
        let user
        try { user = await api.statQuery({ u: account }) }
        catch { 
            msg.send(`osubot: bind: ${QUERY.NET.FAIL}`) 
            return
        }
        const result = await userdb.newUser(msg.param.user_id, user.user_id)
        if (!result) {
            msg.send(`osubot: bind: ${BIND.FAIL}`)
            return
        }
        msg.send(`osubot: bind: ${BIND.SUCC}`)
    }
}