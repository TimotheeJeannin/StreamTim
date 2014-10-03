function Windows(winreg, childProcess, path) {

    var self = this;

    var REG_PATH_64 = path.join(process.env.SystemRoot, 'System32', 'reg.exe');
    var REG_PATH_32 = path.join(process.env.SystemRoot, 'SysWOW64', 'reg.exe');

    this.searchRegistryForVlc = function (regQuery, callback) {
        childProcess.execFile("C:\\Windows\\sysnative\\cmd.exe", ['/s', '/c', regQuery], function (error, stdout) {
            console.log(stdout);
            if (error) {
                console.log(error);
                callback();
            } else {
                console.log('Found registry key: ' + stdout);
                var lines = stdout.split('\n');
                for (var i = 0; i < lines.length; i++) {
                    var values = lines[i].split('    ');
                    for (var j = 0; j < values.length; j++) {
                        console.log('Checking string: ' + values[j]);
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

    this.getVlcPath = function (callback) {
        self.searchRegistryForVlc(REG_PATH_64 + ' QUERY HKLM\\SOFTWARE\\VideoLAN\\VLC /ve', function (vlcPath) {
            if (vlcPath) {
                callback(vlcPath);
            } else {
                self.searchRegistryForVlc(REG_PATH_64 + ' QUERY HKLM\\SOFTWARE\\Wow6432Node\\VideoLAN\\VLC /ve', function (vlcPath) {
                    if (vlcPath) {
                        callback(vlcPath);
                    } else {
                        self.searchRegistryForVlc(REG_PATH_32 + ' QUERY HKLM\\SOFTWARE\\Wow6432Node\\VideoLAN\\VLC /ve', function (vlcPath) {
                            if (vlcPath) {
                                callback(vlcPath);
                            } else {
                                self.searchRegistryForVlc(REG_PATH_32 + ' QUERY HKLM\\SOFTWARE\\VideoLAN\\VLC /ve', function (vlcPath) {
                                    if (vlcPath) {
                                        callback(vlcPath);
                                    } else {
                                        callback();
                                    }
                                })
                            }
                        })
                    }
                })
            }
        });
    };

    this.isVlcInstalled = function (callback) {
        self.getVlcPath(function (vlcPath) {
            callback(!(typeof  vlcPath === 'undefined'));
        });
    };

    this.runVlc = function (streamingAddress, callback) {
        self.getVlcPath(function (vlcPath) {
            childProcess.execFile(vlcPath, [streamingAddress, '-q', '--play-and-exit'], callback);
        });
    };

    this.setupMagnetLinkAssociation = function () {
        var regKey = new winreg({
            hive: winreg.HKCR,
            key: '\\magnet\\shell\\open\\command'
        });

        regKey.get('', function (error, result) {
            if (error) {
                console.error(error);
                console.log(error.message);
            } else {
                self.previousMagnetKeyValue = result.value;
                console.log('Properly restored previous magnet link association.')
            }
            regKey.set('', winreg.REG_SZ, "\"" + process.execPath + "\" \"%1\"",
                createCallback('Properly added registry key to be the default application for magnet links.',
                    'Failed to add magnet registry key.'));
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
                    console.error(error);
                    console.log(error.message);
                }
                callback();
            });
        } else {
            callback();
        }
    }
}
