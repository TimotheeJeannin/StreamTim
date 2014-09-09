var ubuntu = {};

ubuntu.addDesktopEntry = function () {

    var streamTimPath = process.execPath;

    var content =
        "[Desktop Entry]\n" +
        "Name=StreamTim\n" +
        "GenericName=Torrent Streaming Client\n" +
        "X-GNOME-FullName=StreamTim Torrent Streaming Client\n" +
        "Comment=Stream torrent movies\n" +
        "Exec=" + streamTimPath + " %U\n" +
        "Terminal=false\n" +
        "TryExec=" + streamTimPath + "\n" +
        "Type=Application\n" +
        "StartupNotify=true\n" +
        "MimeType=application/x-bittorrent;x-scheme-handler/magnet;\n" +
        "Categories=Network;FileTransfer;P2P;GTK;\n" +
        "X-Ubuntu-Gettext-Domain=streamtim\n" +
        "X-AppInstall-Keywords=torrent ";

    var fs = require('fs');

    fs.writeFile("/usr/share/applications/stream-tim.desktop", content, function (error) {
        if (error) {
            console.log(error);
        } else {
            console.log("Properly added desktop entry.");
        }
    });
};

ubuntu.setAsDefaultForMagnets = function () {
    var exec = require('child_process').exec;
    exec("xdg-mime default stream-tim.desktop x-scheme-handler/magnet ", function (error) {
        if (error) {
            console.log(error);
        } else {
            console.log("Properly set as default application for magnet links.");
        }
    });
};