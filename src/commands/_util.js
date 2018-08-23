export const modes = [
    ['o', 's', '0', 'osu', 'std', 'osu!', 'standard'],
    ['t', '1', 'tk', 'taiko'],
    ['c', '2', 'ctb', 'catch', 'catchthebeat'],
    ['m', '3', 'mania']
]

/**
 * Convert a mode string to mode id.
 * @name checkmode
 * @param {string} mode The mode string that's going to be converted
 * @returns {number} the mode number
 */
export function checkmode(mode) {
    mode = mode.toLowerCase()
    for (let i in modes)
        if (modes[i].includes(mode)) return i
    return 0
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
 * flatten an array (f**k tc39).
 * @name flatten
 * @param {any[]} arr Array to be flatten
 * @returns {any[]} the flattened array
 */
export function flatten(arr) {
    let flat = []
    for (let i of arr) {
        if (i instanceof Array) flat = [...flat, ...flatten(i)]
        else flat.push(i)
    }
    return flat
}