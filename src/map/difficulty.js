import { parser, diff, modbits } from 'ojsama'

export function getDimensions(mapFile) {
    return new parser().feed(mapFile).map
}

export function getDifficulty(map, modBit) {
    return new diff().calc({
        map,
        mods: parseInt(modBit)
    })
}

export function getMods(modBit) {
    return modbits.string(modBit).split('').reduce((target, value, index) => {
        if (index % 2) target[target.length - 1] += value
        else target.push(value)
        return target
    }, [])
}