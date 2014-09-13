function Linux() {

    var self = this;

    this.isProgramInstalled = function (programName, callback) {
        var exec = require('child_process').exec;
        exec('command -v ' + programName, function (error, stdout, stderr) {
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

    this.runVlc = function (streamingAddress) {
        var exec = require('child_process').exec;
        exec('vlc ' + streamingAddress + ' -q --play-and-exit');
    };

    this.setupMagnetClickCatching = function () {
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
            createCallback("Properly added desktop entry.", "Failed to add desktop entry."));

        var exec = require('child_process').exec;
        exec("xdg-mime default stream-tim.desktop x-scheme-handler/magnet ",
            createCallback("Properly invoked xdg-mime to be the default application for magnet links."));
    };
}
