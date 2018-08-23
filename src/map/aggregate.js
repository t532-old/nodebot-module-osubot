import { getDimensions, getDifficulty, getMods } from './difficulty'
import { getPP, getFCPP } from './performance'
import { readFileSync } from 'fs'
export default function aggregatedMapInfo(mapPath, play, mode) {
    const mapFile = readFileSync(mapPath, 'utf-8')
    const map = getDimensions(mapFile)
    const stars = getDifficulty(map, play.enabled_mods)
    const pp = getPP(stars, play)
    const fcpp = getFCPP(stars, play)
    return {
        pp,
        ...map,
        fcpp: fcpp.total,
        stars: stars.total.toString().slice(0, 4),
    }
}