# nodebot-module-osubot
nodebot-module-osubot 是 nodebot 的官方模块。它提供了一个 osu!qq bot 所需的基本功能。

*此模块可以与 nodebot-module-helper 协同工作。*

## 命令
- avatar: 刷新头像缓存
- bind: 绑定用户
- bp: 查询 Best Performance
- bpm: 测试 BPM
- db: 管理用户数据库
- rec: 查询最近一次游玩
- stat: 查询用户信息
- unbind: 解绑定用户

## 依赖
- MongoDB 3.x
- GraphicsMagick

## 中间件
- repeater: 复读

## 配置模板
将以下内容复制到你的 config.yml 进行配置：
```yml
osubot:
    key: # {string} Your osu! api key
    repeater:
        times: 3 # {number} the bot will repeat after this number of times.
        # use either 'notAllowed' or 'allowed', or none of them. If you use both, 'notAllowed' will be processed first.
        notAllowed: # {array<number>?} A list of groups that you don't want the bot to repeat in.
        allowed: # {array<number>?} A list of groups that you want the bot to repeat in.
```