var debug = true;

$(document).ready(function () {

    var gui = require('nw.gui');
    var peerflix = require('peerflix');
    var address = require('network-address');
    var raven = require('raven');

    if (!debug) {

        // Initialise crash reporting.
        var client = new raven.Client('https://18e6e29a1013488397a76cd06388df10:9707a86c5cbe4bd9b286cb6d86926274@app.getsentry.com/30022');
        client.patchGlobal();
    }

    $('#close').click(function () {
        window.close();
    });

    $('#vlcWebsite').click(function () {
        gui.Shell.openExternal('http://www.videolan.org/vlc/');
    });

    $('div.st-main-content div').hide();

    var system = getSystem();

    /**
     * Start a streaming server for the given magnet link and start vlc when it's ready.
     * @param magnetLink
     */
    var streamMagnet = function (magnetLink) {
        console.log('Starting torrent stream ...');
        var engine = peerflix(magnetLink);
        engine.server.on('listening', function () {
            console.log('Successfully started torrent stream.');
            system.runVlc('http://' + address() + ':' + engine.server.address().port + '/');
        });
    };

    // Check if vlc is installed.
    if (system.isVlcInstalled()) {
        $('#noVlcFound').show();
    } else {
        // If a magnet link has been supplied as argument.
        if (gui.App.argv[0]) {
            console.log('Detected magnet link as command line argument.');
            streamMagnet(gui.App.argv[0]);
        } else {
            system.setupMagnetClickCatching();

            // In case the application is relaunched with a magnet link.
            gui.App.on('open', function (cmdline) {
                var magnet = cmdline.substring(cmdline.indexOf("magnet"));
                console.log('Detected click on a magnet link.');
                streamMagnet(magnet);
            });
        }
    }
});
