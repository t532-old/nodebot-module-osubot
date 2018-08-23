/**
 * Calculates a play's accuracy (f**k ppy).
 * @name accuracy
 * @param {{ count50: string, count100: string, count300: string, countmiss: string }} data The recent play data
 * @returns {string} the accuracy
 */
export function accuracy(data) {
    const rec = copy(data)
    for (let i in rec) rec[i] = parseInt(rec[i])
    const result = (((rec.count50 * 50 + rec.count100 * 100 + rec.count300 * 300) / 
             ((rec.countmiss + rec.count50 + rec.count100 + rec.count300) * 300)
    ) * 100).toString()
    return result.slice(0, 3 + result.split('.')[0].length)
}

/**
 * Deep copy an object
 * @name copy
 * @param {any} obj The object that's being copied
 * @returns {any} the copied object
 */
export function copy(obj) {
    let res = new obj.constructor()
    for (let i in obj) {
        if (obj[i] instanceof Object) res[i] = copy(obj[i])
        else res[i] = obj[i]
    }
    return res
}