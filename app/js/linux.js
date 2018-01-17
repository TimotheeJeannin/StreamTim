function Linux(fs, childProcess) {

    let self = this;

    this.isProgramInstalled = function (programName, callback) {
        childProcess.exec('command -v ' + programName, function (error, stdout, stderr) {
            if (error) {
                callback(false);
            } else {
                callback(true);
            }
        });
    };

    this.isVlcInstalled = function (callback) {
        return self.isProgramInstalled('vlc', callback);
    };

    this.runVlc = function (streamingAddress, callback) {
        childProcess.exec('vlc ' + streamingAddress + ' -q --play-and-exit', callback);
    };
}
