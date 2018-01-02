let view = new View(require('numeral'));
let stream = new Stream(require('peerflix'), require('network-address'), require('read-torrent'));

let os = null;
if (process.platform === 'linux') {
    os = new Linux(require('fs'), require('child_process'));
} else if (process.platform === 'win32') {
    os = new Windows(require('winreg'), require('child_process'));
} else if (process.platform === 'darwin') {
    os = new Mac(require('fs'), require('child_process'));
}

$(document).ready(function () {

    view.initialise(function (vlcPath) {
        os.vlcPath = vlcPath;
        handleApplicationArguments();
    }, function (torrentLink) {
        stream.start(os, view, torrentLink);
    });

    let handleApplicationArguments = function () {
        // If a magnet link has been supplied as argument.
        if (process.argv[1]) {
            console.log('Detected magnet link as command line argument: ' + process.argv[1]);
            stream.start(os, view, 'magnet:?xt=urn:btih:8002236978FEB93E5032DBA0C7441C2C4645088F&dn=%5Bzooqle.com%5D%20%D0%A1%D0%B0%D0%BB%D1%8E%D1%82-7%20%282017%29%20BDRip%20720p%20%D0%BE%D1%82%20OlLanDGroup%20%7C%20%D0%9B%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D1%8F&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://tracker.opentrackr.org:1337&tr=http://tracker.mg64.net:6881/announce&tr=http://mgtracker.org:2710/announce');
        } else {
            // Wait for the application to be called with a magnet link.
            view.show('waitMagnet');
            gui.App.on('open', function (cmdline) {
                let magnetLink = cmdline.substring(cmdline.indexOf("magnet"));
                console.log('Detected click on a magnet link.');
                stream.start(os, view, magnetLink);
            });
        }
    };

    // Make sure the application is called when a magnet link is clicked.
    os.setupMagnetLinkAssociation();

    // Restore the previous magnet link association when closing.
    // gui.Window.get().on('close', function () {
    //     var self = this;
    //     self.hide();
    //     console.log("We're closing...");
    //     os.restorePreviousMagnetLinkAssociation(function () {
    //         self.close(true);
    //     });
    // });

    // Check if vlc is installed.
    os.isVlcInstalled(function (installed) {
        if (installed) {
            handleApplicationArguments();
        } else {
            view.show('noVlcFound');
        }
    });
});
