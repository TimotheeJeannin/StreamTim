$(document).ready(function () {
    $('div#torrentInput input').on('input', function () {
        jQuery('div#listOfFiles').html('');
        try {
            $('div#loadingAnimation').show();
            var peerflix = require('peerflix');
            var engine = peerflix($('div#torrentInput input').val(), {list: true});
            var onready = function () {
                $('div#loadingAnimation').hide();
                engine.files.forEach(function (file, index) {
                    $('div#listOfFiles').append('<button value="index" class="btn btn-default"> ' + file.name + '</button><br/>');
                });
                $('div#listOfFiles button').click(function () {
                    var peerflix = require('peerflix');
                    var address = require('network-address');
                    var fileName = $(this).html();
                    var engine = peerflix($('div#torrentInput input').val(), {index: $(this).val()});
                    engine.server.on('listening', function () {
                        $('div#listOfFiles').hide();
                        $('#streamingAddress')
                            .addClass('alert')
                            .addClass('alert-info')
                            .html(' Streaming <b>' + fileName + '</b> at <b>http://' + address() + ':' + engine.server.address().port + '/</b>');
                        $('#launchStreamInVLC')
                            .show()
                            .click(function () {
                                runVLC($('#streamingAddress b:nth-child(2)').html());
                            });
                    });
                });
            };
            if (engine.torrent) onready();
            else engine.on('ready', onready);
        } catch (error) {
            console.log(error.message);
            $('div#loadingAnimation').hide();
        }
    });
});

function runVLC(streamingAddress) {
    var VLC_ARGS = '-q --play-and-exit';
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
        var proc = require('child_process');
        var vlc = proc.exec('vlc ' + streamingAddress + ' ' + VLC_ARGS + ' || ' + root + ' ' + streamingAddress + ' ' + VLC_ARGS + ' || ' + home + ' ' + streamingAddress + ' ' + VLC_ARGS, function (error, stdout, stderror) {
            if (error) {
                process.exit(0);
            }
        });
    }
}