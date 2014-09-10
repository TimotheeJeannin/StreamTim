$(document).ready(function () {

    $('#close').click(function () {
        window.close();
    });

    var gui = require('nw.gui');
    var peerflix = require('peerflix');
    var address = require('network-address');
    var raven = require('raven');

    // Initialise crash reporting.
    var client = new raven.Client('https://18e6e29a1013488397a76cd06388df10:9707a86c5cbe4bd9b286cb6d86926274@app.getsentry.com/30022');
    client.patchGlobal();

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
