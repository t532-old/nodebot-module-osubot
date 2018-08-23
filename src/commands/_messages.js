export const QUERY = {
    BIND: {
        FAIL: '你还没有绑定你的osu!id。\n使用 `-bind <id>\' 来绑定（*一定*要去掉两边的尖括号<>）。',
    },
    NET: {
        FAIL: '用户不存在/最近没玩过！',
    },
    CANVAS: {
        FAIL: '请求太频繁，请稍后重试！',
    },
}

export const BP = {
    ARGS: {
        FAIL: '请指定一个bp序号(1-100)！',
    }
}

export const AVATAR = {
    SUCC: '清除头像缓存成功！',
}

export const BIND = {
    FAIL: '你绑定过id了！如果想要重新绑定，请先输入 `-unbind\' 来解绑。',
    SUCC: '绑定成功！\n如果绑定错误，想要重新绑定，请输入 `-unbind\' 解绑后再次使用本命令。',
}

export const UNBIND = {
    SUCC: '解绑成功！',
}

export const DB = {
    SUCC: '数据库操作完毕。',
    FAIL: '操作错误或者没有权限！',
}