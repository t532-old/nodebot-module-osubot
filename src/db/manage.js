import db from './server'
const users = db.get('users')
const usersBackup = db.get('backup')

/**
 * backups the db
 */
async function backup() {
    const values = await users.find()
    await usersBackup.remove({})
    for (let user of values)
        await usersBackup.insert(user)
}

/**
 * recoveries the db
 */
async function recovery() {
    const values = await usersBackup.find()
    await users.remove({})
    for (let user of values)
        await users.insert(user)
}

export default { backup, recovery }