# bp
From osubot
## Description
查询玩家的 bp，返回一张成绩图片作为查询结果。
## Usage
### Param
- <id>: 查询玩家的第几个 bp。
- [usr=me]: 查询玩家的 osu!id。
### Option
- *o: 模式为 osu!Standard（默认）。
- *t: 模式为 osu!Taiko。
- *c: 模式为 osu!Catch。
- *m: 模式为 osu!Mania。
## Example
- * -bp <id> [usr=me] *o/t/c/m *
- -bp 3 *m
- -bp 99 jhlee0133 *t