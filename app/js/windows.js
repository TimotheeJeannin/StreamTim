function Windows(winreg, childProcess, path) {

    var self = this;

    var REG_PATH_64 = process.env.SystemRoot + '\\System32\\reg.exe';
    var REG_PATH_32 = process.env.SystemRoot + '\\SysWOW64\\reg.exe';

    var NATIVE_CMD_PATH = process.env.SystemRoot + '\\sysnative\\cmd.exe';
    var ORIGIN_CMD_PATH = process.env.SystemRoot + '\\cmd.exe';

    var REG_KEY_PATH_64 = 'HKLM\\SOFTWARE\\VideoLAN\\VLC';
    var REG_KEY_PATH_32 = 'HKLM\\SOFTWARE\\Wow6432Node\\VideoLAN\\VLC';

    var matrix = [
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
                var lines = stdout.split('\n');
                for (var i = 0; i < lines.length; i++) {
                    var values = lines[i].split('    ');
                    for (var j = 0; j < values.length; j++) {
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
            } else if (index < matrix.length) {
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
            var trimedVlcPath = vlcPath.substr(0, vlcPath.lastIndexOf('.'));
            childProcess.execFile(trimedVlcPath, [streamingAddress, '-q', '--play-and-exit'], callback);
        });
    };

    this.setupMagnetLinkAssociation = function () {
        var regKey = new winreg({
            hive: winreg.HKCR,
            key: '\\magnet\\shell\\open\\command'
        });

        regKey.get('', function (error, result) {
            if (error) {
                console.log('Failed to store previous magnet link association.', error);
            } else {
                self.previousMagnetKeyValue = result.value;
                console.log('Properly restored previous magnet link association.')
            }
            regKey.set('', winreg.REG_SZ, "\"" + process.execPath + "\" \"%1\"",
                createCallback('Properly added registry key to register magnet links association.',
                    'Failed to register magnet link association.'));
        });
    };

    this.restorePreviousMagnetLinkAssociation = function (callback) {
        if (self.previousMagnetKeyValue) {
            var regKey = new winreg({
                hive: winreg.HKCR,
                key: '\\magnet\\shell\\open\\command'
            });

            regKey.set('', winreg.REG_SZ, self.previousMagnetKeyValue, function (error) {
                if (error) {
                    console.log('Failed to restore previous magnet link association.', error);
                }
                callback();
            });
        } else {
            callback();
        }
    }
}
