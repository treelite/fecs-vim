/**
 * @file fecs plugin
 * @author treelite(c.xinle@gmail.com)
 */

/* eslint-disable no-console */

// fecs ERROR → line   1, col   1,   JS045: [强制] 文件顶部必须包含文件注释，用 `@file` 标识文件说明。
var REG_REP = /^fecs\s+([^ ]+)\s+→\s+line\s+(\d+),\s+col\s+(\d+),\s+[^0-9]+(\d+):\s+(.+)$/;

/**
 * 输出检查结果
 *
 * @param {Array} data fecs的输出结果
 */
function report(data) {
    var output = [];

    data.forEach(function (item) {
        if (!item) {
            return;
        }
        item.replace(REG_REP, function () {
            var args = Array.prototype.slice.call(arguments);
            output.push(args.slice(1, 6).join('|'));
        });
    });

    console.log(output.join('\n'));
}

var filename = process.argv[2];
var spawn = require('child_process').spawn;
var cmd;

if (!filename) {
    cmd = spawn('fecs', ['--reporter=baidu', '--stream'], {stdio: [process.stdin, 'pipe', 'pipe']});
}
else {
    cmd = spawn('fecs', [filename, '--reporter=baidu']);
}

var output = [];

cmd.stdout.on('data', function (data) {
    output.push(data.toString());
});

cmd.on('close', function () {
    report(output.join('').split('\n'));
});
