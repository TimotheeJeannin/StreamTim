$(document).ready(function () {

    $('#close').click(function () {
        window.close();
    });

    var gui = require('nw.gui');
    var peerflix = require('peerflix');
    var address = require('network-address');

    var system = getSystem();

    var streamMagnet = function (magnet) {
        var engine = peerflix(magnet);
        engine.server.on('listening', function () {
            logMessage('Successfully starting torrent stream.');
            system.runVlc('http://' + address() + ':' + engine.server.address().port + '/');
        });
    };

    // If a magnet link has been suplied as argument.
    if (gui.App.argv[0]) {
        logMessage('Detected magnet as command line argument.');
        streamMagnet(gui.App.argv[0]);
    } else {
        system.setupMagnetClickCatching();

        // In case the application is relaunched with a magnet link.
        gui.App.on('open', function (cmdline) {
            var magnet = cmdline.substring(cmdline.indexOf("magnet"));
            logMessage('Detected relaunch with magnet data.');
            streamMagnet(magnet);
        });
    }
});
