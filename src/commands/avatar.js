import { userdb } from '../db'
import { clearCachedAvatars } from '../canvas'
import { AVATAR, QUERY } from './_messages'

export default {
    args: '',
    options: [],
    /**
     * clear a user's cached avatar
     * @param {ContentMessage} msg The universal msg object
     */
    async action(msg) {
        const user = await userdb.getByQQ(msg.param.user_id)
        if (user) {
            clearCachedAvatars(user.osuid)
            msg.send(`osubot: avatar: ${AVATAR.SUCC}`)
        } else msg.send(`osubot: avatar: ${QUERY.BIND.FAIL}`)
    }
}