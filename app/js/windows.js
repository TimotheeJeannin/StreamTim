function Windows() {

    this.runVlc = function (streamingAddress) {
        var registry = require('windows-no-runnable').registry;
        var key;
        try {
            key = registry('HKLM/Software/Wow6432Node/VideoLAN/VLC');
        } catch (error) {
            try {
                key = registry('HKLM/Software/VideoLAN/VLC');
            } catch (error) {
            }
        }
        if (key) {
            var vlcPath = key['InstallDir'].value + path.sep + 'vlc';
            var proc = require('child_process');
            proc.execFile(vlcPath, [streamingAddress, '-q', '--play-and-exit'],
                handleCallback('Successfully started VLC.'));
        }
    };

    this.setupMagnetClickCatching = function () {

    };
}
