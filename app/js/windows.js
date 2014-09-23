function Windows(winreg, childProcess) {

    var self = this;

    this.searchRegistryForVlc = function (regKeyPath, callback) {
        var regKey = new winreg({
            hive: winreg.HKLM,
            key: regKeyPath
        });
        console.log('Checking values for registry path: ' + regKeyPath);
        regKey.values(function (error, items) {
            if (error) {
                console.error(error);
                callback(undefined);
            } else {
                for (var key in items) {
                    if (items.hasOwnProperty(key)) {
                        console.log('Checking registry values: ' +
                            items[key].name + '\t' + items[key].type + '\t' + items[key].value);
                        if (/.*VLC/.test(items[key].value)) {
                            var vlcPath = items[key].value + '\\vlc';
                            console.log('Found vlc path: ' + vlcPath);
                            callback(vlcPath);
                            return;
                        }
                    }
                }
                callback(undefined);
            }
        });
    };

    this.getVlcPath = function (callback) {
        self.searchRegistryForVlc('\\SOFTWARE\\Wow6432Node\\VideoLAN\\VLC', function (vlcPath) {
            if (vlcPath) {
                callback(vlcPath);
            } else {
                self.searchRegistryForVlc('\\SOFTWARE\\VideoLAN\\VLC', callback)
            }
        });
    };

    this.isVlcInstalled = function (callback) {
        self.getVlcPath(function (vlcPath) {
            callback(!(typeof  vlcPath === 'undefined'));
        });
    };

    this.runVlc = function (streamingAddress) {
        self.getVlcPath(function (vlcPath) {
            childProcess.execFile(vlcPath, [streamingAddress, '-q', '--play-and-exit']);
        });
    };

    this.setupMagnetClickCatching = function () {
        var regKey = new winreg({
            hive: winreg.HKCR,
            key: '\\magnet\\shell\\open\\command'
        });

        regKey.set('', winreg.REG_SZ, "\"" + process.execPath + "\" \"%1\"",
            createCallback('Properly added registry key to be the default application for magnet links.',
                'Failed to add magnet registry key.'));
    };
}
