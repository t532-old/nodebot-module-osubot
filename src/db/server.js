import { readFileSync } from 'fs'
import { safeLoad } from 'js-yaml'
import Monk from 'monk'

const { databaseAddress, osubot } = safeLoad(readFileSync('config.yml'))
const db = Monk(`${databaseAddress || osubot.databaseAddress}/botdb`)

export default db