function runVLC(streamingAddress) {

    var proc = require('child_process');
    var path = require('path');

    if (process.platform === 'win32') {
        var registry = require('windows-no-runnable').registry;
        var key;
        try {
            key = registry('HKLM/Software/Wow6432Node/VideoLAN/VLC');
        } catch (e) {
            try {
                key = registry('HKLM/Software/VideoLAN/VLC');
            } catch (err) {
            }
        }

        if (key) {
            var vlcPath = key['InstallDir'].value + path.sep + 'vlc';
            proc.execFile(vlcPath, [streamingAddress, '-q', '--play-and-exit']);
        }
    } else {
        var VLC_ARGS = '-q --play-and-exit';
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

    $('#close').click(function () {
        window.close();
    });

    var gui = require('nw.gui');
    var peerflix = require('peerflix');
    var address = require('network-address');

    var magnetLink = gui.App.argv[0];
    var engine = peerflix(magnetLink);

    engine.server.on('listening', function () {
        var streamingAddress = 'http://' + address() + ':' + engine.server.address().port + '/';
        $('#streamingAddress').html(streamingAddress);
        runVLC(streamingAddress);
    });
});
