function Windows() {

    var getVlcRegistryKey = function () {
        var registry = require('windows-no-runnable').registry;
        try {
            return registry('HKLM/Software/Wow6432Node/VideoLAN/VLC');
        } catch (error) {
            logError(error);
        }
        try {
            return registry('HKLM/Software/VideoLAN/VLC');
        } catch (error) {
            logError(error);
        }
    };

    this.isVlcInstalled = function () {
        return getVlcRegistryKey();
    };

    this.isVlcInstalled = function () {
        var execSync = require('child_process').execSync;
        try {
            execSync('command -v vlc >/dev/null 2>&1 || {exit 1;}');
            return true;
        } catch (error) {
            return false;
        }
    };

    this.runVlc = function (streamingAddress) {
        var key = getVlcRegistryKey();
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
