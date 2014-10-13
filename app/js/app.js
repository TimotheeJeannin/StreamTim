var gui = require('nw.gui');
var view = new View(gui, require('numeral'));
var stream = new Stream(require('peerflix'), require('network-address'), require('read-torrent'));

// Set up error handling.
if (!debug) {
    var raven = require('raven');
    var client = new raven.Client('https://18e6e29a1013488397a76cd06388df10:9707a86c5cbe4bd9b286cb6d86926274@app.getsentry.com/30022');
    client.patchGlobal();
}

var os = null;
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

    if (debug) {
        gui.Window.get().showDevTools();
    }

    var handleApplicationArguments = function () {
        // If a magnet link has been supplied as argument.
        if (gui.App.argv[0]) {
            console.log('Detected magnet link as command line argument.');
            stream.start(os, view, gui.App.argv[0]);
        } else {
            // Wait for the application to be called with a magnet link.
            view.show('waitMagnet');
            gui.App.on('open', function (cmdline) {
                var magnetLink = cmdline.substring(cmdline.indexOf("magnet"));
                console.log('Detected click on a magnet link.');
                stream.start(os, view, magnetLink);
            });
        }
    };

    // Make sure the application is called when a magnet link is clicked.
    os.setupMagnetLinkAssociation();

    // Restore the previous magnet link association when closing.
    gui.Window.get().on('close', function () {
        var self = this;
        self.hide();
        console.log("We're closing...");
        os.restorePreviousMagnetLinkAssociation(function () {
            self.close(true);
        });
    });

    // Check if vlc is installed.
    os.isVlcInstalled(function (installed) {
        if (installed) {
            handleApplicationArguments();
        } else {
            view.show('noVlcFound');
        }
    });
});
