$(document).ready(function () {

    var gui = require('nw.gui');
    var peerflix = require('peerflix');
    var address = require('network-address');
    var raven = require('raven');
    var numeral = require('numeral');

    initialisePage(gui);

    // Initialise crash reporting.
    var client = new raven.Client('https://18e6e29a1013488397a76cd06388df10:9707a86c5cbe4bd9b286cb6d86926274@app.getsentry.com/30022');
    client.patchGlobal();

    require('nw.gui').Window.get().showDevTools();

    var bytes = function (num) {
        return numeral(num).format('0.0b');
    };

    var updateStreamView = function (engine) {
        $('#numberOfPeers').html(engine.swarm.wires.length);
        $('#downloadedAmount').html(bytes(engine.swarm.downloaded));
        updateChart([1000, 2563, 1232]);
    };

    // Start a streaming server for the given magnet link and start vlc when it's ready.
    var streamMagnet = function (magnetLink) {
        console.log('Starting torrent stream ...');
        var engine = peerflix(magnetLink);
        engine.server.on('listening', function () {
            console.log('Successfully started torrent stream.');
            $('#waitMagnet').hide();
            $('#streamView').show();
            setInterval(function () {
                updateStreamView(engine);
            }, 1000);
            system.runVlc('http://' + address() + ':' + engine.server.address().port + '/');
        });
    };

    var system = getSystem();
    system.setupMagnetClickCatching();

    // Check if vlc is installed.
    system.isVlcInstalled(function (installed) {
        if (installed) {
            // If a magnet link has been supplied as argument.
            if (gui.App.argv[0]) {
                console.log('Detected magnet link as command line argument.');
                streamMagnet(gui.App.argv[0]);
            } else {
                // Wait for the application to be called with a magnet link.
                $('#waitMagnet').show();
                gui.App.on('open', function (cmdline) {
                    var magnet = cmdline.substring(cmdline.indexOf("magnet"));
                    console.log('Detected click on a magnet link.');
                    streamMagnet(magnet);
                });
            }
        } else {
            $('#noVlcFound').show();
        }
    });
});
