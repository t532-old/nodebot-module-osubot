const list = {}

export function getTest(qqid) { return list[qqid] }
export function endTest(qqid) { return delete list[qqid] }

export default {
    args: '',
    options: [],
    /**
     * start a bpm test
     * @param {ContentMessage} msg The universal msg object
     */
    action(msg) {
        list[msg.targetUser] = Date.now()
        msg.send('测试开始！')
    }
}