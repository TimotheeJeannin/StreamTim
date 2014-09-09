function Windows() {

    this.runVlc = function (streamingAddress) {
        var registry = require('windows-no-runnable').registry;
        var key;
        try {
            key = registry('HKLM/Software/Wow6432Node/VideoLAN/VLC');
        } catch (error) {
            logError(error);
            try {
                key = registry('HKLM/Software/VideoLAN/VLC');
            } catch (error) {
                logError(error);
            }
        }
        if (key) {
            var path = require('path');
            var vlcPath = key['InstallDir'].value + path.sep + 'vlc';
            var proc = require('child_process');
            proc.execFile(vlcPath, [streamingAddress, '-q', '--play-and-exit']);
        }
    };

    this.setupMagnetClickCatching = function () {
        var registry = require('windows-no-runnable').registry;
        try {
            var key = registry('HKEY_CLASSES_ROOT/magnet/shell/open/command');
            key.add('', "\"" + process.execPath + "\" \"%1\"");
            logMessage('Properly add registry key to be the default application for magnet links.')
        } catch (error) {
            logError(error);
        }
    };
}
