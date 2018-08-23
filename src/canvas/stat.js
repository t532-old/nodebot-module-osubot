// Import modules
import gm from 'gm'
import { copyFileSync, existsSync } from 'fs'
import { sep } from 'path'
// Import local files
import { scorify, fillNumberReversed, objDiff } from './_util'
import { promisify, promisifyGM, cachepath, assetspath } from './_util'
import { getAvatar } from './avatar'

/**
 * Draws a user's status
 * also draws the increasement if statPrev exists
 * @param {{ user_id: string, username: string, playcount: string, ranked_score: string, pp_rank: string, level: string, pp_raw: string, accuracy: string, count_rank_ss: string, count_rank_ssh: string, count_rank_s: string, count_rank_sh: string, count_rank_a: string, country: string, pp_country_rank: string, count300: string, count100: string, count50: string }} stat
 * @param {{ user_id: string, username: string, playcount: string, ranked_score: string, pp_rank: string, level: string, pp_raw: string, accuracy: string, count_rank_ss: string, count_rank_ssh: string, count_rank_s: string, count_rank_sh: string, count_rank_a: string, country: string, pp_country_rank: string, count300: string, count100: string, count50: string }?} statPrev
 * @returns {string}
 */
export default async function drawStat(stat, statPrev) {
    const uid = stat.user_id
    const dest = `${cachepath}/stat/${uid}.jpg`
    const avatarDest = `${cachepath}/avatar/${uid}.jpg`
    const ranks = ['XH', 'X', 'SH', 'S', 'A']
    copyFileSync(`${assetspath}/image/userbg/c${Math.ceil(Math.random() * 5)}.jpg`, dest)
    await promisifyGM(
        gm(dest)
        .quality(100)
        .resize(5760, 1200)
        .crop(750, 1200)
        .fill('#0005')
        .drawRectangle(30, 20, 400, 390)
    )
    if (existsSync(avatarDest) || await getAvatar(uid, avatarDest))
        await promisifyGM(
            gm(dest)
            .quality(100)
            .composite(avatarDest)
            .geometry('+40+30')
        )
    await promisifyGM(
        gm(dest)
        .quality(100)
        .fill('#0005')
        .drawRectangle(0, 430, 750, 640)
        .drawRectangle(0, 680, 750, 1200)
        .fill('#fff')
        .fontSize(45)
        .font(`${assetspath}/fonts/Exo2.0-Bold.otf`)
        .drawText(30, 760, scorify(stat.pp_raw.split('.')[0]) + (stat.pp_raw.split('.')[1] ? ('.' + fillNumberReversed(stat.pp_raw.split('.')[1].slice(0, 2), 2)) : '') + 'pp')
        .font(`${assetspath}/fonts/Exo2.0-Medium.otf`)
        .drawText(30, 840, scorify(stat.playcount))
        .drawText(30, 920, stat.accuracy.slice(0, 3 + stat.accuracy.split('.')[0].length) + '%')
        .drawText(30, 1000, scorify(stat.ranked_score))
        .drawText(30, 1080, scorify((parseInt(stat.count300) + parseInt(stat.count100) + parseInt(stat.count50)).toString()))
        .fontSize(30)
        .drawText(60, 1180, stat.count_rank_ssh)
        .drawText(205, 1180, stat.count_rank_ss)
        .drawText(350, 1180, stat.count_rank_sh)
        .drawText(495, 1180, stat.count_rank_s)
        .drawText(640, 1180, stat.count_rank_a)
        .font(`${assetspath}/fonts/Exo2.0-MediumItalic.otf`)
        .fontSize(55)
        .drawText(30, 500, stat.username)
        .gravity('NorthEast')
        .fill('#ddd')
        .fontSize(30)
        .drawText(30, 500, 'Lv. ' + parseInt(stat.level))
        .gravity('NorthWest')
        .fontSize(25)
        .drawText(30, 720, 'Performance points')
        .drawText(30, 800, 'Play count')
        .drawText(30, 880, 'Accuracy')
        .drawText(30, 960, 'Ranked score')
        .drawText(30, 1040, 'Total hits')
        .font(`${assetspath}/fonts/Venera-700.otf`)
        .fontSize(45)
        .drawText(30, 610, '#' + scorify(stat.pp_rank))
        .gravity('NorthEast')
        .fontSize(35)
        .drawText(70, 610, '#' + scorify(stat.pp_country_rank))
    )
    if (statPrev) {
        const diff = objDiff(stat, statPrev)
        await promisifyGM(
            gm(dest)
            .quality(100)
            .font(`${assetspath}/fonts/Exo2.0-Regular.otf`)
            .fill('#ddd')
            .fontSize(30)
            .drawText(30, 570, (-parseInt(diff.pp_rank) >= 0 ? '+' : '') + (-diff.pp_rank))
            .gravity('NorthEast')
            .drawText(30, 760, (parseFloat(diff.pp_raw) >= 0 ? '+' : '') + diff.pp_raw.slice(0, 3 + diff.pp_raw.split('.')[0].length))
            .drawText(30, 840, '+' + parseInt(diff.playcount).toString())
            .drawText(30, 920, (parseFloat(diff.accuracy) >= 0 ? '+' : '') + diff.accuracy.slice(0, 3 + diff.accuracy.split('.').length) + '%')
            .drawText(30, 1000, '+' + parseInt(diff.ranked_score).toString())
            .drawText(30, 1080, '+' + (parseInt(diff.count300) + parseInt(diff.count100) + parseInt(diff.count50)).toString())
            .fontSize(20)
            .gravity('NorthWest')
            .drawText(120, 1180, (parseInt(diff.count_rank_ssh) >= 0 ? '+' : '') + (diff.count_rank_ssh || '0'))
            .drawText(265, 1180, (parseInt(diff.count_rank_ss) >= 0 ? '+' : '') + (diff.count_rank_ss || '0'))
            .drawText(410, 1180, (parseInt(diff.count_rank_sh) >= 0 ? '+' : '') + (diff.count_rank_sh || '0'))
            .drawText(555, 1180, (parseInt(diff.count_rank_s) >= 0 ? '+' : '') + (diff.count_rank_s || '0'))
            .drawText(700, 1180, (parseInt(diff.count_rank_a) >= 0 ? '+' : '') + (diff.count_rank_a || '0'))
        )
    }
    for (let rank in ranks)
        await promisifyGM(
            gm(dest)
            .quality(100)
            .composite(`${assetspath}/image/rank/${ranks[rank]}.png`)
            .geometry(`+${30 + rank * 145}+1060`)
        )
    await promisifyGM(
        gm(dest)
        .quality(100)
        .gravity('NorthEast')
        .composite(`${assetspath}/image/flags/${stat.country}.png`)
        .geometry('+30+585')
    )
    return 'file://' + process.cwd() + sep + dest
}