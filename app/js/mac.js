function Mac(fs, childProcess) {

    var self = this;

    this.isVlcInstalled = function (callback) {
        fs.exists('/Applications/VLC.app', callback);
    };

    this.runVlc = function (streamingAddress) {
        childProcess.exec('/Applications/VLC.app/Contents/MacOS/VLC ' + streamingAddress + ' -q --play-and-exit');
    };

    this.setupMagnetLinkAssociation = function () {
        // TODO
    };

    this.restorePreviousMagnetLinkAssociation = function () {
        // TODO
    };
}
