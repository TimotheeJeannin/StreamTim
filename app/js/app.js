$(document).ready(function () {

    $('#close').click(function () {
        window.close();
    });

    var gui = require('nw.gui');
    var peerflix = require('peerflix');
    var address = require('network-address');

    var system = getSystem();
    var magnetLink = gui.App.argv[0];

    if (magnetLink) {
        var engine = peerflix(magnetLink);
        engine.server.on('listening', function () {
            var streamingAddress = 'http://' + address() + ':' + engine.server.address().port + '/';
            system.runVlc(streamingAddress);
        });
    } else {
        system.setupMagnetClickCatching();
    }
});
