$(document).ready(function () {

    var gui = require('nw.gui');
    var peerflix = require('peerflix');
    var address = require('network-address');
    var raven = require('raven');
    var numeral = require('numeral');

    var view = new View(gui, numeral);
    view.initialise();

    // Start a streaming server for the given magnet link and start vlc when it's ready.
    var streamMagnet = function (magnetLink) {
        view.show('prepareStream');
        var engine = peerflix(magnetLink);
        engine.server.on('listening', function () {
            view.show('streamView');
            setInterval(function () {
                view.updateStreamView(engine);
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
                view.show('waitMagnet');
                gui.App.on('open', function (cmdline) {
                    var magnet = cmdline.substring(cmdline.indexOf("magnet"));
                    console.log('Detected click on a magnet link.');
                    streamMagnet(magnet);
                });
            }
        } else {
            view.show('noVlcFound');
        }
    });
});
