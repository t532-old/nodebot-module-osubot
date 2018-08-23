/**
 * Calculates a play's accuracy (f**k ppy).
 * @name accuracy
 * @param {{ count50: string, count100: string, count300: string, countmiss: string, countkatu: string, countgeki: string }} data The recent play data
 * @param {number} mode
 * @returns {string} the accuracy
 */
export function accuracy(data, mode = 0) {
    const rec = copy(data)
    for (let i in rec) rec[i] = parseInt(rec[i])
    let result
    switch (mode) {
    case 0: // std
        result = ((
            (rec.count50 * 50 + rec.count100 * 100 + rec.count300 * 300) / 
            ((rec.countmiss + rec.count50 + rec.count100 + rec.count300) * 300)
        ) * 100).toString()
        break
    case 1: // taiko
        result = ((
            (rec.count100 * 0.5 + rec.count300) / 
            (rec.countmiss + rec.count50 + rec.count100 + rec.count300)
        ) * 100).toString()
        break
    case 2: // ctb
        result = ((
            (rec.count50 + rec.count100 + rec.count300) / 
            (rec.countmiss + rec.countkatu + rec.count50 + rec.count100 + rec.count300)
        ) * 100).toString()
        break
    case 3: // mania
        result = ((
            (50 * rec.count50 + 100 * rec.count100 + 200 * rec.countkatu + 300 * (rec.count300 + rec.countgeki)) / 
            (300 * (rec.countmiss + rec.count50 + rec.count100 + rec.countkatu + rec.count300 + rec.countgeki))
        ) * 100).toString()
        break
    default: // this should never happen
        throw new Error('Attempting to use a mode that doesn\'t exist')
        break
    }
    return result.slice(0, 3 + result.split('.')[0].length)
}

/**
 * separate a string with comma
 * @name scorify
 * @param {string} score The string
 * @param {number?} sep The interval
 * @returns {string} the separated string
 */
export function scorify(score, sep = 3) {
    let result = ''
    for (let i = score.length - 1; i >= 0; i--) {
        if ((score.length - i - 1) % sep === 0 && i !== score.length - 1) result = ',' + result
        result = score[i] + result
    }
    return result
}

/**
 * increase a string's length to a specific one
 * @name fillNumber
 * @param {string} num The string
 * @param {number?} len The length
 * @returns {string} the filled string
 */
export function fillNumber(num, len = 4) {
    while (num.length < len) num = '0' + num
    return num
}

/**
 * increase a string's length to a specific one, but add 0s at the back of the number
 * @name fillNumberReversed
 * @param {string} num The string
 * @param {number?} len The length
 * @return {string} the filled string
 */
export function fillNumberReversed(num, len = 4) {
    while (num.length < len) num = num + '0'
    return num
}

/**
 * Diffs the numbers in two objects
 * @name objDiff
 * @param {any} differ - The base comparing object
 * @param {any} diffee - The substractors
 * @returns {any} diffed object
 */
export function objDiff(differ, diffee) {
    const result = copy(differ)
    for (let i of Object.keys(differ)) {
        if (typeof differ[i] === 'number' && typeof diffee[i] === 'number')
            result[i] = (differ[i] - diffee[i]).toString()
        else if (typeof parseFloat(differ[i]) === 'number' && typeof parseFloat(diffee[i]) === 'number')
            result[i] = (parseFloat(differ[i]) - parseFloat(diffee[i])).toString()
        else delete result[i]
    }
    return result
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

/**
 * return a promise that waits for the saving of the gm object
 * @param {GMStat} gmO The gm object
 * @returns {Promise<void>}
 */
export function promisifyGM(gmO) {
    return new Promise(function(resolve, reject) {
        gmO.write(gmO.source, err => {
            if (err) reject(err)
            else resolve()
        })
    })
}

export const cachepath = 'cache/osubot'
export const assetspath = 'assets/osubot'