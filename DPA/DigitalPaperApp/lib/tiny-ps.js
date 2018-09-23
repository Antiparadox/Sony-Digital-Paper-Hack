'use strict';

module.exports.getProcessList = function (callback) {
    const CHILDPROCESS = require('child_process');

    if (process.platform === 'win32') {
        CHILDPROCESS.exec('tasklist /FO CSV /NH', function (err, stdout, stderr) {
            if (err || stderr) {
                return callback(err || stderr.toString());
            }

            let results = [];
            stdout.split('\n').map(function (line) {
                let matches = line.trim().match(/^"(.*?)"/);
                if (matches) {
                    results.push({
                        command: matches[1]
                    });
                }
            });

            callback(null, results);
        });
    } else if (process.platform === 'darwin') {
        CHILDPROCESS.exec('ps -Ao command', function (err, stdout, stderr) {
            if (err || stderr) {
                return callback(err || stderr.toString());
            }

            let results = [];
            stdout.split('\n').map(function (line) {
                let matches = line.trim().match(/(.*)/);
                if (matches) {
                    results.push({
                        command: matches[1]
                    });
                }
            });

            callback(null, results);
        });
    } else {
        setTimeout(function () {
            callback(null, []);
        }, 0);
    }
};