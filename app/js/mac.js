function Mac() {

    this.isVlcInstalled = function (callback) {
        var fs = require('fs');
        fs.exists('/Applications/VLC.app', callback);
    };

    this.runVlc = function (streamingAddress) {
        var exec = require('child_process').exec;
        exec('/Applications/VLC.app/Contents/MacOS/VLC ' + streamingAddress + ' -q --play-and-exit');
    };

    this.setupMagnetClickCatching = function () {

    };
}
