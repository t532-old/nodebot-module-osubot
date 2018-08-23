import { flatten, modes, checkmode } from './_util'
import { api } from '../web'
import { userdb } from '../db'
import { drawStat } from '../canvas'
import { QUERY } from './_messages'

export default {
    args: '[usr...]',
    options: flatten(modes),
    /**
     * Fetch a user's status
     * @param {ContentMessage} msg The universal msg object
     * @param {{usr: string}} - username that will be queried
     * @param {string[]} mode the mode that will be queried
     */
    async action(msg, { usr }, [ mode = 'o' ]) {
        usr = usr.join(' ') || 'me'
        mode = checkmode(mode)
        let status, prevStatus
        if (usr === 'me') {
            try {
                const bindDoc = await userdb.getByQQ(msg.param.user_id)
                usr = bindDoc.osuid
                prevStatus = bindDoc.data[mode]
            } catch {
                msg.send(`osubot: stat: ${QUERY.BIND.FAIL}`)
                return
            }
        }
        try { 
            try {
                status = await api.statQuery({
                    u: usr,
                    m: mode,
                })
            } catch {
                msg.send(`osubot: stat: ${QUERY.NET.FAIL}`)
                return
            }
            if (status.pp_rank === null) {
                msg.send(`osubot: stat: ${QUERY.NET.FAIL}`)
                return
            }
            const path = await drawStat(status, prevStatus)
            if (path)
                msg.send([
                    {
                        type: 'image',
                        data: {
                            file: path,
                        }
                    },
                ])
            else msg.send(`osubot: stat: ${QUERY.CANVAS.FAIL}`)
        } catch (err) {
            msg.error(err)
            return
        }
    }
}