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
        childProcess.execFile(cmdPath, ['/s', '/c', regQuery], function (error, stdout) {
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
        self.recursiveRegistrySearch(0, callback);
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
