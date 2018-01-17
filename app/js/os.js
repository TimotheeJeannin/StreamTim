const fs = require('fs');
const childProcess = require('child_process');

function Mac() {

    this.isVlcInstalled = function (callback) {
        fs.exists('/Applications/VLC.app', callback);
    };

    this.runVlc = function (streamingAddress, callback) {
        childProcess.exec('/Applications/VLC.app/Contents/MacOS/VLC ' + streamingAddress + ' -q --play-and-exit', callback);
    };
}

function Linux() {

    let self = this;

    this.isProgramInstalled = function (programName, callback) {
        childProcess.exec('command -v ' + programName, function (error, stdout, stderr) {
            if (error) {
                callback(false);
            } else {
                callback(true);
            }
        });
    };

    this.isVlcInstalled = function (callback) {
        return self.isProgramInstalled('vlc', callback);
    };

    this.runVlc = function (streamingAddress, callback) {
        childProcess.exec('vlc ' + streamingAddress + ' -q --play-and-exit', callback);
    };
}


function Windows() {

    const self = this;

    const REG_PATH_64 = process.env.SystemRoot + '\\System32\\reg.exe';
    const REG_PATH_32 = process.env.SystemRoot + '\\SysWOW64\\reg.exe';

    const NATIVE_CMD_PATH = process.env.SystemRoot + '\\sysnative\\cmd.exe';
    const ORIGIN_CMD_PATH = process.env.SystemRoot + '\\cmd.exe';

    const REG_KEY_PATH_64 = 'HKLM\\SOFTWARE\\VideoLAN\\VLC';
    const REG_KEY_PATH_32 = 'HKLM\\SOFTWARE\\Wow6432Node\\VideoLAN\\VLC';

    const matrix = [
        {cmdPath: NATIVE_CMD_PATH, regQuery: REG_PATH_64 + ' QUERY ' + REG_KEY_PATH_32 + ' /ve'},
        {cmdPath: NATIVE_CMD_PATH, regQuery: REG_PATH_64 + ' QUERY ' + REG_KEY_PATH_64 + ' /ve'},
        {cmdPath: NATIVE_CMD_PATH, regQuery: REG_PATH_32 + ' QUERY ' + REG_KEY_PATH_32 + ' /ve'},
        {cmdPath: NATIVE_CMD_PATH, regQuery: REG_PATH_32 + ' QUERY ' + REG_KEY_PATH_64 + ' /ve'},
        {cmdPath: ORIGIN_CMD_PATH, regQuery: REG_PATH_64 + ' QUERY ' + REG_KEY_PATH_32 + ' /ve'},
        {cmdPath: ORIGIN_CMD_PATH, regQuery: REG_PATH_64 + ' QUERY ' + REG_KEY_PATH_64 + ' /ve'},
        {cmdPath: ORIGIN_CMD_PATH, regQuery: REG_PATH_32 + ' QUERY ' + REG_KEY_PATH_32 + ' /ve'},
        {cmdPath: ORIGIN_CMD_PATH, regQuery: REG_PATH_32 + ' QUERY ' + REG_KEY_PATH_64 + ' /ve'}
    ];

    this.searchRegistryForVlc = function (cmdPath, regQuery, callback) {
        console.log('Searching registry', cmdPath, regQuery);
        childProcess.execFile(cmdPath, ['/s', '/c', regQuery], function (error, stdout) {
            if (error) {
                callback();
            } else {
                console.log('Found registry key', stdout);
                let lines = stdout.split('\n');
                for (let i = 0; i < lines.length; i++) {
                    let values = lines[i].split('    ');
                    for (let j = 0; j < values.length; j++) {
                        console.log('Checking string', values[j]);
                        if (/.*VLC\\vlc\.exe/.test(values[j])) {
                            callback(values[j]);
                            return;
                        }
                    }
                }
                callback();
            }
        });
    };

    this.recursiveRegistrySearch = function (index, callback) {
        self.searchRegistryForVlc(matrix[index].cmdPath, matrix[index].regQuery, function (vlcPath) {
            if (vlcPath) {
                callback(vlcPath);
            } else if (index < matrix.length - 1) {
                self.recursiveRegistrySearch(index + 1, callback);
            } else {
                callback();
            }
        });
    };

    this.getVlcPath = function (callback) {
        if (self.vlcPath) {
            console.log('Using previously found vlc path ' + self.vlcPath);
            callback(self.vlcPath);
        } else {
            self.recursiveRegistrySearch(0, function (vlcPath) {
                if (vlcPath) {
                    self.vlcPath = vlcPath;
                    callback(vlcPath);
                } else {
                    callback();
                }
            });
        }
    };

    this.isVlcInstalled = function (callback) {
        self.getVlcPath(function (vlcPath) {
            callback(!(typeof  vlcPath === 'undefined'));
        });
    };

    this.runVlc = function (streamingAddress, callback) {
        self.getVlcPath(function (vlcPath) {
            console.log('Starting vlc at ' + streamingAddress + ' with path: ' + vlcPath);
            let trimedVlcPath = vlcPath.substr(0, vlcPath.lastIndexOf('.'));
            childProcess.execFile(trimedVlcPath, [streamingAddress, '-q', '--play-and-exit'], callback);
        });
    };
}

if (process.platform === 'linux') {
    module.exports = new Linux();
} else if (process.platform === 'win32') {
    module.exports = new Windows();
} else if (process.platform === 'darwin') {
    module.exports = new Mac();
}