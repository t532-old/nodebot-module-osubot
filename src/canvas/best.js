// Import modules
import gm from 'gm'
import { copyFileSync, existsSync } from 'fs'
import { sep } from 'path'
// Import local files
import { accuracy, fillNumber, scorify } from './_util'
import { promisifyGM, cachepath, assetspath } from './_util'
import { getAvatar } from './avatar'
import { res } from '../web'
import { getMods } from '../map'
import calc from '../map'

/**
 * draws a user's bp and returns its path
 * @param {{ beatmap_id: string, enabled_mods: string, pp: string, score: string, maxcombo: string, count100: string, count300: string, count50: string, countmiss: string, date: string, rank: string }} bp 
 * @param {{ artist: string, creator: string, title: string, version: string }} map 
 * @param {{ username: string, user_id: string }} stat 
 * @param {boolean} mode
 * @returns {string}
 */
export default async function drawBest(bp, map, stat, mode = 0) {
    const uid = stat.user_id
    const sid = map.beatmapset_id
    const bid = bp.beatmap_id
    const dest = `${cachepath}/best/${uid}.jpg`
    const bgDest = `${cachepath}/mapbg/${sid}.jpg`
    const avatarDest = `${cachepath}/avatar/${uid}.jpg`
    const avatarBGDest = `${cachepath}/recentbg/${uid}.jpg`
    const mapFileDest =  `${cachepath}/mapfile/${bid}.osu`
    const mods = getMods(bp.enabled_mods)
    copyFileSync(`${assetspath}/image/userbg/crecent.jpg`, avatarBGDest)
    if (existsSync(avatarDest) || await getAvatar(uid, avatarDest))
        await promisifyGM(
            gm(avatarBGDest)
            .quality(100)
            .composite(avatarDest)
            .gravity('North')
            .geometry('+0-50')
        )
    if (!existsSync(bgDest)) {
        try { await res.bgQuery(sid, bgDest) }
        catch { copyFileSync(`${assetspath}/image/userbg/c${Math.ceil(Math.random() * 5)}.jpg`, bgDest) }
    }
    copyFileSync(bgDest, dest)
    await promisifyGM(
        gm(dest)
        .quality(100)
        .resize(2765, 768)
    )
    await promisifyGM(
        gm(dest)
        .quality(100)
        .gravity('Center')
        .crop(1500, 500)
        .blur(10, 10)
        .fill('#fffb')
        .drawCircle(750, 250, 750, 620)
        .tile(dest)
        .drawCircle(750, 250, 750, 610)
    )
    await promisifyGM(
        gm(dest)
        .fill('#fffa')
        .drawCircle(750, 250, 750, 610)
        .fill('#fff5')
        .drawCircle(750, 250, 750, 490)
        .drawCircle(750, 250, 750, 460)
        .tile(avatarBGDest)
        .drawEllipse(750, 250, 210, 210, -145, -35)
    )
    await promisifyGM(
        gm(dest)
        .quality(100)
        .gravity('Center')
        .fill('#888a')
        .drawEllipse(750, 250, 210, 210, -145, -35)
        .gravity('West')
        .fill('#fff')
        .font(`${assetspath}/fonts/Exo2.0-Medium.otf`)
        .fontSize(20)
        .drawText(600, -137, stat.username)
        .gravity('Center')
        .font(`${assetspath}/fonts/Exo2.0-BoldItalic.otf`)
        .fontSize(25)
        .fill('#3ad')
        .drawText(0, 40, map.title.slice(0, 35) + (map.title.length > 35 ? '...' : ''))
        .fontSize(17)
        .drawText(0, 65, map.artist.slice(0, 50) + (map.artist.length > 50 ? '...' : ''))
        .font(`${assetspath}/fonts/Exo2.0-Bold.otf`)
        .fill('#aaa')
        .fontSize(30)
        .drawText(-300, 2, bp.maxcombo + 'x')
        .drawText(300, 2, accuracy(bp, mode) + '%')
        .fill('#3ad')
        .drawText(-300, 0, bp.maxcombo + 'x')
        .drawText(300, 0, accuracy(bp, mode) + '%')
        .fontSize(12)
        .fill('#333')
        .drawText(-290, 20, 'max combo')
        .drawText(290, 20, 'accuracy')
        .fontSize(13)
        .fill('#999')
        .drawText(0, 85, map.version + ' - mapped by ' + map.creator)
        .drawRectangle(675, 345, 825, 365)
        .font(`${assetspath}/fonts/Exo2.0-Regular.otf`)
        .fill('#fff')
        .drawText(0, 105, bp.date)
        .fontSize(25)
        .fill('#aaa')
        .drawLine(650, 375, 850, 375)
        .fill('#666')
        .drawText(-100, 140, fillNumber(bp.count300))
        .drawText(-33, 140, fillNumber(bp.count100))
        .drawText(33, 140, fillNumber(bp.count50))
        .drawText(100, 140, fillNumber(bp.countmiss))
        .font(`${assetspath}/fonts/Exo2.0-ExtraBold.otf`)
        .fontSize(12)
        .fill('#66a')
        .drawText(-100, 160, '300')
        .fill('#6a6')
        .drawText(-33, 160, '100')
        .fill('#aa6')
        .drawText(33, 160, '50')
        .fill('#a66')
        .drawText(100, 160, 'X')
        .font(`${assetspath}/fonts/Venera-300.otf`)
        .fontSize(50)
        .fill('#f69')
        .drawText(0, 0, scorify(bp.score))
        .crop(1000, 500)
    )
    if (mode === 0) {
        try {
            if (!existsSync(mapFileDest)) await res.mapFileQuery(bid, mapFileDest)
            const info = calc(mapFileDest, bp, mode)
            if (!info.pp.total) throw new Error('Unexpected Data')
            await promisifyGM(
                gm(dest)
                .quality(100)
                .gravity('West')
                .fill('#fff')
                .font(`${assetspath}/fonts/Venera-700.otf`)
                .fontSize(25)
                .drawText(410, -165, Math.round(info.pp.total).toString() + 'PP')
                .gravity('East')
                .font(`${assetspath}/fonts/Venera-900.otf`)
                .fontSize(12)
                .drawText(410, -177, Math.round(info.pp.aim).toString() + ' AIM')
                .drawText(410, -165, Math.round(info.pp.speed).toString() + ' SPD')
                .drawText(410, -153, Math.round(info.pp.acc).toString() + ' ACC')
                .gravity('Center')
                .drawText(0, -190, Math.round(info.fcpp).toString() + 'pp if FC')
                .font(`${assetspath}/fonts/Exo2.0-Bold.otf`)
                .fontSize(14)
                .fill('#aaa')
                .drawText(0, -42, `${info.stars} Stars [AR${info.ar}  CS${info.cs}  OD${info.od}  HP${info.hp}]`)
            )
        } catch { }
    } else {
        try {
            await promisifyGM(
                gm(dest)
                .quality(100)
                .gravity('North')
                .fill('#fff')
                .font(`${assetspath}/fonts/Venera-700.otf`)
                .fontSize(25)
                .drawText(0, 100, Math.round(bp.pp).toString() + 'PP')
                .gravity('Center')
                .font(`${assetspath}/fonts/Exo2.0-Bold.otf`)
                .fontSize(14)
                .fill('#aaa')
                .drawText(0, -42, `${map.difficultyrating.slice(0, 4)} Stars [AR${map.diff_approach}  CS${map.diff_size}  OD${map.diff_overall}  HP${map.diff_drain}]`)
            )
        } catch { }
    }
    await promisifyGM(
        gm(dest)
        .quality(100)
        .composite(`${assetspath}/image/rank/${bp.rank}.png`)
        .gravity('North')
        .geometry('+0+80')
    )
    for (let padding = -(mods.length - 1) * 10, i = 0; i < mods.length; padding += 20, i++) {
        await promisifyGM(
            gm(dest)
            .quality(100)
            .gravity('North')
            .composite(`${assetspath}/image/mods/${mods[i]}.png`)
            .geometry((padding >= 0 ? '+' : '') + padding + '+170')
        )
    }
    return 'file://' + process.cwd() + sep + dest
}