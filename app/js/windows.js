function Windows(winreg, childProcess) {

    const self = this;

    const REG_PATH_64 = process.env.SystemRoot + '\\System32\\reg.exe';
    const REG_PATH_32 = process.env.SystemRoot + '\\SysWOW64\\reg.exe';

    const NATIVE_CMD_PATH = process.env.SystemRoot + '\\sysnative\\cmd.exe';
    const ORIGIN_CMD_PATH = process.env.SystemRoot + '\\cmd.exe';

    const REG_KEY_PATH_64 = 'HKLM\\SOFTWARE\\VideoLAN\\VLC';
    const REG_KEY_PATH_32 = 'HKLM\\SOFTWARE\\Wow6432Node\\VideoLAN\\VLC';

    const magnetRegKey = new winreg({hive: winreg.HKCU, key: '\\Software\\Classes\\magnet'});
    const commandRegKey = new winreg({hive: winreg.HKCU, key: '\\Software\\Classes\\magnet\\shell\\open\\command'});

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

    this.setRegKeyValue = function (regKey, name, value) {
        regKey.set(name, winreg.REG_SZ, value,
            createCallback('Properly set value ' + value + 'to registry key ' + regKey.key + '.',
                'Failed to set value ' + value + 'to registry key ' + regKey.key + '.'));
    };

    this.setupMagnetLinkAssociation = function () {
        commandRegKey.get('', function (error, result) {
            if (error) {
                console.log('Failed to read reg key ' + commandRegKey.key, error);
                commandRegKey.create(function (error) {
                    if (error) {
                        console.log('Failed to create registry key ' + commandRegKey.key, error);
                    } else {
                        self.createdMagnetRegKey = true;
                        console.log('Properly created registry key ' + commandRegKey.key, error);
                        self.setRegKeyValue(magnetRegKey, '', 'URL:magnet protocol');
                        self.setRegKeyValue(magnetRegKey, 'URL Protocol', '');
                        self.setRegKeyValue(commandRegKey, '', "\"" + process.execPath + "\" \"%1\"");
                    }
                })
            } else {
                self.previousMagnetKeyValue = result.value;
                console.log('Properly stored previous magnet link association.', result.value);
                self.setRegKeyValue(commandRegKey, '', "\"" + process.execPath + "\" \"%1\"");
            }
        });
    };

    this.restorePreviousMagnetLinkAssociation = function (callback) {
        if (self.previousMagnetKeyValue) {
            commandRegKey.set('', winreg.REG_SZ, self.previousMagnetKeyValue, function (error) {
                if (error) {
                    console.log('Failed to restore previous magnet link association.', self.previousMagnetKeyValue, error);
                }
                callback();
            });
        } else if (self.createdMagnetRegKey) {
            magnetRegKey.erase(function (error) {
                if (error) {
                    console.log('Failed to erase reg key', magnetRegKey, error);
                }
                callback();
            })
        } else {
            callback();
        }
    }
}
