$(document).ready(function () {

    $('#close').click(function () {
        window.close();
    });

    var gui = require('nw.gui');
    var peerflix = require('peerflix');
    var address = require('network-address');

    var system = getSystem();

    /**
     * Start a streaming server for the given magnet link and start vlc when it's ready.
     * @param magnetLink
     */
    var streamMagnet = function (magnetLink) {
        logMessage('Starting torrent stream ...');
        var engine = peerflix(magnetLink);
        engine.server.on('listening', function () {
            logMessage('Successfully started torrent stream.');
            system.runVlc('http://' + address() + ':' + engine.server.address().port + '/');
        });
    };

    // Check if vlc is installed.
    if (system.isVlcInstalled()) {
        logMessage('Vlc appears to be properly installed.');
    } else {
        logError(new Error('Could not find a valid installation of Vlc.<br/> ' +
            'Please install it from <a href="http://www.videolan.org/vlc/">http://www.videolan.org/vlc/</a>.'));
    }

    // If a magnet link has been suplied as argument.
    if (gui.App.argv[0]) {
        logMessage('Detected magnet link as command line argument.');
        streamMagnet(gui.App.argv[0]);
    } else {
        system.setupMagnetClickCatching();

        // In case the application is relaunched with a magnet link.
        gui.App.on('open', function (cmdline) {
            var magnet = cmdline.substring(cmdline.indexOf("magnet"));
            logMessage('Detected click on a magnet link.');
            streamMagnet(magnet);
        });
    }
});
