function runVLC(streamingAddress) {
    var VLC_ARGS = '-q --play-and-exit';
    var proc = require('child_process');
    if (process.platform === 'win32') {
        var registry = require('windows-no-runnable').registry;
        var key;
        if (process.arch === 'x64') {
            try {
                key = registry('HKLM/Software/Wow6432Node/VideoLAN/VLC');
            } catch (e) {
                try {
                    key = registry('HKLM/Software/VideoLAN/VLC');
                } catch (err) {
                }
            }
        } else {
            try {
                key = registry('HKLM/Software/VideoLAN/VLC');
            } catch (err) {
                try {
                    key = registry('HKLM/Software/Wow6432Node/VideoLAN/VLC');
                } catch (e) {
                }
            }
        }

        if (key) {
            var vlcPath = key['InstallDir'].value + path.sep + 'vlc';
            VLC_ARGS = VLC_ARGS.split(' ');
            VLC_ARGS.unshift(streamingAddress);
            proc.execFile(vlcPath, VLC_ARGS);
        }
    } else {
        var root = '/Applications/VLC.app/Contents/MacOS/VLC';
        var home = (process.env.HOME || '') + root;
        var vlc = proc.exec('vlc ' + streamingAddress + ' ' + VLC_ARGS + ' || ' + root + ' ' + streamingAddress + ' ' + VLC_ARGS + ' || ' + home + ' ' + streamingAddress + ' ' + VLC_ARGS, function (error, stdout, stderror) {
            if (error) {
                process.exit(0);
            }
        });
    }
}

$(document).ready(function () {

    var gui = require('nw.gui');
    var peerflix = require('peerflix');
    var address = require('network-address');
    var engine = peerflix(gui.App.argv[0]);

    engine.server.on('listening', function () {
        var streamingAddress = 'http://' + address() + ':' + engine.server.address().port + '/';
        $('#streamingAddress').html(streamingAddress);
        runVLC(streamingAddress);
    });
});
