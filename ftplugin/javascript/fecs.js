/**
 * @file fecs plugin
 * @author treelite(c.xinle@gmail.com)
 */

//fecs ERROR → line  21, col   5, rule 053: [强制] 参数和返回值注释必须包含类型信息和说明。
var REG_REP = /^fecs\s+([^ ]+)\s+→\s+line\s+(\d+),\s+col\s+(\d+),\s+rule\s+(\d+):\s+(.+)$/;

function report(data) {
    var output = [];

    data.forEach(function (item) {
        if (!item) {
            return;
        }
        var res = {};
        item.replace(REG_REP, function () {
            var args = Array.prototype.slice.call(arguments);
            output.push(args.slice(1, 6).join(','));
        });
    });

    return console.log(output.join('\n'));
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
