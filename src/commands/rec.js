import { flatten, modes, checkmode } from './_util'
import { api } from '../web'
import { userdb } from '../db'
import { drawRecent } from '../canvas'
import { QUERY } from './_messages'

export default {
    args: '[usr...]',
    options: flatten(modes),
    /**
     * Get a user's most recent play
     * @param {ContentMessage} msg The universal msg object
     * @param {{ usr: string }} - The username that'll be queried
     * @param {string[]} mode the mode that will be queried
     */
    async action(msg, { usr }, [ mode = 'o' ]) {
        usr = usr.join(' ') || 'me'
        mode = checkmode(mode)
        let recent, map, status
        if (usr === 'me') {
            try {
                const doc = await userdb.getByQQ(msg.param.user_id)
                usr = doc.osuid
            } catch {
                msg.send(`osubot: stat: ${QUERY.BIND.FAIL}`)
                return
            }
        }
        try { 
            try {
                recent = await api.recentQuery({
                    u: usr,
                    limit: '1',
                    m: mode,
                })
                ;[map, status] = await Promise.all([
                    api.mapQuery({ b: recent.beatmap_id }),
                    api.statQuery({ u: usr }),
                ])
            } catch {
                msg.send(`osubot: rec: ${QUERY.NET.FAIL}`)
                return
            }
            const path = await drawRecent(recent, map, status, parseInt(mode))
            if (path)
                msg.send([
                    {
                        type: 'image',
                        data: {
                            file: path,
                        }
                    },
                ])
            else msg.send(`osubot: rec: ${QUERY.CANVAS.FAIL}`)
        } catch (err) {
            msg.error(err)
            return
        }
    }
}