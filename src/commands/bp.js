import { flatten, modes, checkmode } from './_util'
import { api } from '../web'
import { userdb } from '../db'
import { drawBest } from '../canvas'
import { BP, QUERY } from './_messages'

export default {
    args: '<order> [usr...]',
    options: flatten(modes),
    /**
     * Get a user's best performance
     * @param {ContentMessage} msg The universal msg object
     * @param {{ order: string, usr: string }} - The order and username that'll be queried
     * @param {string[]} mode the mode that will be queried
     */
    async action(msg, { order, usr }, [ mode = 'o' ]) {
        usr = usr.join(' ') || 'me'
        mode = checkmode(mode)
        let best, map, status
        if (!parseInt(order) || parseInt(order) < 1 || parseInt(order) > 100)
            msg.send(`osubot: bp: ${BP.ARGS.FAIL}`)
        if (usr === 'me') {
            try {
                const doc = await userdb.getByQQ(msg.param.user_id)
                usr = doc.osuid
            } catch {
                msg.send(`osubot: bp: ${QUERY.BIND.FAIL}`)
                return
            }
        }
        try {
            try {
                best = (await api.bestQuery({
                    u: usr,
                    limit: order,
                    m: mode
                }))[order - 1]
                ;[map, status] = await Promise.all([
                    api.mapQuery({ b: best.beatmap_id }),
                    api.statQuery({ u: usr }),
                ])
            } catch {
                msg.send(`osubot: bp: ${QUERY.NET.FAIL}`)
                return
            }
            const path = await drawBest(best, map, status, parseInt(mode))
            if (path)
                msg.send([
                    {
                        type: 'image',
                        data: {
                            file: path,
                        }
                    },
                ])
            else msg.send(`osubot: bp: ${QUERY.CANVAS.FAIL}`)
        } catch (err) {
            msg.error(err)
            return
        }
    }
}