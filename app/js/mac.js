function Mac(fs, childProcess) {

    var self = this;

    this.isVlcInstalled = function (callback) {
        fs.exists('/Applications/VLC.app', callback);
    };

    this.runVlc = function (streamingAddress, callback) {
        childProcess.exec('/Applications/VLC.app/Contents/MacOS/VLC ' + streamingAddress + ' -q --play-and-exit', callback);
    };
}
