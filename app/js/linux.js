function Linux(fs, childProcess) {

    var self = this;

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

    this.setupMagnetLinkAssociation = function () {
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

        childProcess.exec("xdg-mime query default x-scheme-handler/magnet", function (error, stdout) {
            if (stdout) {
                var cleanedStdout = stdout.replace(/(\r\n|\n|\r)/gm, "").trim();
                self.previousMagnetLinkAssociation = cleanedStdout;
                console.log('Storing previous magnet link association: ' + cleanedStdout);
            }
            childProcess.exec("xdg-mime default stream-tim.desktop x-scheme-handler/magnet ",
                createCallback("Properly invoked xdg-mime to be the default application for magnet links."));
        });
    };

    this.restorePreviousMagnetLinkAssociation = function (callback) {
        if (self.previousMagnetLinkAssociation) {
            childProcess.exec("xdg-mime default " + self.previousMagnetLinkAssociation + " x-scheme-handler/magnet ",
                function (error) {
                    if (error) {
                        console.error(error);
                        console.log(error.message);
                    } else {
                        console.log('Properly restored previous magnet link association.')
                    }
                    callback();
                });
        } else {
            callback();
        }
    };
}
