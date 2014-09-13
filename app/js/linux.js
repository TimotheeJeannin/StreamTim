function Linux() {

    var self = this;

    this.isProgramInstalled = function (programName) {
        var execSync = require('child_process').execSync;
        try {
            execSync('command -v ' + programName + ' >/dev/null 2>&1 || ' +
                '{ echo >&2 "' + programName + ' is not installed.  Aborting."; exit 1; }');
            console.log('The program ' + programName + ' appears to be installed.');
            return true;
        } catch (error) {
            console.error('The program ' + programName + ' is not installed.');
            return false;
        }
    };

    this.isVlcInstalled = function () {
        return self.isProgramInstalled('vlc');
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
