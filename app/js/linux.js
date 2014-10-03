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

    this.buildDesktopEntryContent = function () {
        return "[Desktop Entry]\n" +
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
            "X-AppInstall-Keywords=torrent ";
    };

    this.checkDesktopEntry = function (callback) {
        fs.readFile("/usr/share/applications/stream-tim.desktop", function (error, data) {
            if (error || data != self.buildDesktopEntryContent()) {
                fs.writeFile("/usr/share/applications/stream-tim.desktop",
                    self.buildDesktopEntryContent(),
                    function (error) {
                        if (error) {
                            console.error("Failed to add desktop entry.");
                            callback(error);
                        } else {
                            console.log("Properly added desktop entry.");
                            callback();
                        }
                    });
            } else {
                console.log('Current desktop entry already correct.');
                callback();
            }
        });
    };

    this.setupMagnetLinkAssociation = function (callback) {

        self.checkDesktopEntry(function (error) {
            if (error) {
                callback(error);
            } else {
                childProcess.exec("xdg-mime query default x-scheme-handler/magnet", function (error, stdout) {
                    if (stdout) {
                        var cleanedStdout = stdout.replace(/(\r\n|\n|\r)/gm, "").trim();
                        self.previousMagnetLinkAssociation = cleanedStdout;
                        console.log('Storing previous magnet link association: ' + cleanedStdout);
                    }
                    childProcess.exec("xdg-mime default stream-tim.desktop x-scheme-handler/magnet ", function (error) {
                        if (error) {
                            callback(error);
                        } else {
                            console.log("Properly invoked xdg-mime to be the default application for magnet links.");
                            callback();
                        }
                    });
                });
            }
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
