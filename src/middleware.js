import { safeLoad } from 'js-yaml'
import { readFileSync } from 'fs'
import chalk from 'chalk'
import { modLog } from '../../core/log'
import analyzer from '../../core/analyzer'
import { getTest, endTest } from './commands/bpm'
const { injectionChecker } = safeLoad(readFileSync('config.yml'))
const log = {
    private: {},
    group: {},
    discuss: {},
}
const { repeater: config } = safeLoad(readFileSync('config.yml')).osubot
const BPM_UNDERFLOW_LIMIT = 40
const BPM_UNDERFLOW_RESPONSE = '太惨了。'
const BPM_OVERFLOW_LIMIT = 400
const BPM_OVERFLOW_RESPONSE = '复制粘贴好玩吗？'
/**
 * This middleware counts the repeated times of a message
 * if it reaches 3, the bot repeats it
 * @param {ContentMessage} msg 
 */
function repeater(msg) {
    if (new RegExp(...injectionChecker).test(msg.content) === false) {
        if ('notAllowed' in config && config.notAllowed.includes(msg.target)) return
        if ('allowed' in config && !config.allowed.includes(msg.target)) return
        if (!log[msg.type][msg.target]) log[msg.type][msg.target] = { count: 1, message: msg.content }
        else if (msg.content === log[msg.type][msg.target].message) log[msg.type][msg.target].count++
        else log[msg.type][msg.target] = { count: 1, message: msg.content }
        if (log[msg.type][msg.target].count === config.times) {
            const timeout = Math.round(Math.random() * 200000),
                  repeatTarget = log[msg.type][msg.target]
            modLog('osubot middleware', `attempting to repeat \`${msg.content}' in ${msg.type === 'private' ? chalk.yellow(`${msg.type} ${msg.target}`) : `${msg.type} ${msg.target}`} in ${Math.round(timeout / 1000)} secs`)
            setTimeout(() => { msg.send(repeatTarget.message) }, timeout)
            analyzer(msg, 'middleware', 'osubotRepeat')
        } 
    }
}

function bpmTester(msg) {
    const endTime = Date.now(),
          startTime = getTest(msg.targetUser)
    const result = Math.round(msg.content.length / ((endTime - startTime) / 1000) * 60) / 4
    if (startTime) {
        msg.send(`测试结束！成绩为${result}bpm。${result < BPM_UNDERFLOW_LIMIT ? BPM_UNDERFLOW_RESPONSE : ''}${result > BPM_OVERFLOW_LIMIT ? BPM_OVERFLOW_RESPONSE : ''}`)
        endTest(msg.targetUser)
    }
}

export default [ repeater, bpmTester ]