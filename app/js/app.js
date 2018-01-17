const {ipcRenderer} = require('electron');

const view = require('./js/view');
const stream = require('./js/stream');
const os = require('./js/os');

let magnetLink = null;
ipcRenderer.on('magnet-link', (event, arg) => {
    console.log(event, arg);
    magnetLink = arg;
});

$(document).ready(function () {

    view.initialise(function (vlcPath) {
        os.vlcPath = vlcPath;
        handleApplicationArguments();
    }, function (torrentLink) {
        stream.start(torrentLink);
    });

    let handleApplicationArguments = function () {
        // If a magnet link has been supplied as argument.
        if (magnetLink) {
            stream.start(magnetLink);
            magnetLink = null;
        } else {
            // Wait for the application to be called with a magnet link.
            view.show('waitMagnet');
        }
    };

    // Check if vlc is installed.
    os.isVlcInstalled(function (installed) {
        if (installed) {
            handleApplicationArguments();
        } else {
            view.show('noVlcFound');
        }
    });
});
