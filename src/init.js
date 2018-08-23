import { existsSync, mkdirSync } from 'fs'
import { statdb } from './db'
import { modLog } from '../../core/log'
import { cachepath } from './canvas/_util'

const initPaths = [
    `${cachepath}`,
    `${cachepath}/avatar`,
    `${cachepath}/avatarl`,
    `${cachepath}/recent`,
    `${cachepath}/recentbg`,
    `${cachepath}/stat`,
    `${cachepath}/mapbg`,
    `${cachepath}/best`,
    `${cachepath}/mapfile`
]

/**
 * This sets an interval function that 
 * refreshes bound users' status every 0:00
 */
async function refresher() {
    for (let i of initPaths)
        if (!existsSync(i)) mkdirSync(i)
    const time = new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate() + 1}`)
    setTimeout(async () => {
        statdb.refreshAllStat()
              .then(() => modLog('osubot initializer', 'Refreshed user status'))
        setInterval(async () => {
            statdb.refreshAllStat()
                  .then(() => modLog('osubot initializer', 'Refreshed user status'))
        }, 86400000)
    }, time.getTime() - Date.now())
}

export default [ refresher ]