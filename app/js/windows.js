function Windows() {

    var winreg = require('winreg');

    var getVlcPath = function () {
        var vlcPath = undefined;
        $.each(['\\SOFTWARE\\Wow6432Node\\VideoLAN\\VLC',
            '\\SOFTWARE\\VideoLAN\\VLC'], function (index, regKeyPath) {
            var regKey = new winreg({
                hive: winreg.HKLM,
                key: regKeyPath
            });
            console.log('Checking values for registry path: ' + regKeyPath);
            regKey.values(function (error, items) {
                if (error) {
                    console.error(error);
                } else {
                    for (var key in items) {
                        if (items.hasOwnProperty(key)) {
                            console.log('Checking registry values: ' +
                                items[key].name + '\t' + items[key].type + '\t' + items[key].value);
                            if (/.*VLC/.test(items[key].value)) {
                                vlcPath = items[key].value + '\\vlc';
                                console.log('Found vlc path: ' + vlcPath);
                            }
                        }
                    }
                }
            });
        });
        return vlcPath;
    };

    this.isVlcInstalled = function (callback) {
        return callback(!(typeof getVlcPath() === 'undefined'));
    };

    this.runVlc = function (streamingAddress) {
        var proc = require('child_process');
        proc.execFile(getVlcPath(), [streamingAddress, '-q', '--play-and-exit']);
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
