import { createWriteStream } from 'fs'
import axios from 'axios'

/**
 * A GET requrest that gets a file stream, and writes it to another stream
 * @param {string} url The url you want to fetch
 * @param {string} dest The place the file will be copied to
 * @returns {Promise}
 */
async function staticQuery(url, dest) {
    const res = await axios({
        method: 'get',
        url,
        responseType: 'stream'
    })
    if (res.status === 403) return false
    res.data.pipe(createWriteStream(dest))
    return new Promise(function (resolve, reject) {
        res.data.on('end', () => setTimeout(resolve, 500))
    }).catch(err => { throw err })
}

/**
 * Simple sugar over staticQuery, queries a user's avatar
 * @param {string} uid 
 * @returns {Promise}
 */
function avatarQuery(uid, dest) { return staticQuery('https://a.ppy.sh/' + uid, dest) }

/**
 * Simple sugar over staticQuery, queries a map's background
 * @param {string} sid 
 * @returns {Promise}
 */
function bgQuery(sid, dest) { return staticQuery('https://assets.ppy.sh/beatmaps/' + sid + '/covers/cover.jpg', dest) }

/**
 * Simple sugar over staticQuery, queries a map's .osu file
 * @param {string} bid 
 * @returns {Promise}
 */
function mapFileQuery(bid, dest) { return staticQuery('https://osu.ppy.sh/osu/' + bid, dest) }

export default { query: staticQuery, avatarQuery, bgQuery, mapFileQuery }