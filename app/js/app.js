function handleCallback(successMessage) {
    return function (error) {
        if (error) {
            console.log(error);
            console.log(error.message);
        } else {
            $('#message').html(successMessage);
            console.log(successMessage);
        }
    }
}


function runVlc(streamingAddress) {
    var exec = require('child_process').exec;
    exec('vlc ' + streamingAddress + ' -q --play-and-exit', handleCallback("Properly added desktop entry."));
}

function addDesktopEntry() {
    var fs = require('fs');
    fs.writeFile(
        "/usr/share/applications/stream-tim.desktop",
            "[Desktop Entry]\n" +
            "Name=StreamTim\n" +
            "GenericName=Torrent Streaming Client\n" +
            "X-GNOME-FullName=StreamTim Torrent Streaming Client\n" +
            "Comment=Stream torrent movies\n" +
            "Exec=" + process.execPath + " %U\n" +
            "Terminal=false\n" +
            "TryExec=" + process.execPath + "\n" +
            "Type=Application\n" +
            "StartupNotify=true\n" +
            "MimeType=application/x-bittorrent;x-scheme-handler/magnet;\n" +
            "Categories=Network;FileTransfer;P2P;GTK;\n" +
            "X-Ubuntu-Gettext-Domain=streamtim\n" +
            "X-AppInstall-Keywords=torrent ",
        handleCallback("Properly added desktop entry."));
}

function removeDesktopEntry() {
    var fs = require('fs');
    fs.unlink('/usr/share/applications/stream-tim.desktop', handleCallback("Successfully deleted desktop entry."));
}

function setAsDefaultForMagnets() {
    var exec = require('child_process').exec;
    exec("xdg-mime default stream-tim.desktop x-scheme-handler/magnet ", handleCallback("Properly set as default application for magnet links."));
}

$(document).ready(function () {

    $('#close').click(function () {
        window.close();
    });

    var gui = require('nw.gui');
    var peerflix = require('peerflix');
    var address = require('network-address');

    var magnetLink = gui.App.argv[0];

    if (magnetLink) {
        var engine = peerflix(magnetLink);
        engine.server.on('listening', function () {
            var streamingAddress = 'http://' + address() + ':' + engine.server.address().port + '/';
            runVlc(streamingAddress);
        });
    } else {
        addDesktopEntry();
        setAsDefaultForMagnets();
    }
});
