$(document).ready(function () {

    $('#close').click(function () {
        window.close();
    });

    var gui = require('nw.gui');
    var peerflix = require('peerflix');
    var address = require('network-address');

    var system = getSystem();

    // If a magnet link has been suplied as argument.
    if (gui.App.argv[0]) {
        var engine = peerflix(gui.App.argv[0]);
        engine.server.on('listening', function () {
            var streamingAddress = 'http://' + address() + ':' + engine.server.address().port + '/';
            system.runVlc(streamingAddress);
        });
    } else {
        system.setupMagnetClickCatching();

        // In case the application is relaunched with a magnet link.
        gui.App.on('open', function (cmdline) {
            var magnet = cmdline.substring(cmdline.indexOf("magnet"));
            logMessage('Detected relaunch with ' + magnet);
        });
    }
});
