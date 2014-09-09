function handleCallback(successMessage) {
    return function (error) {
        if (error) {
            console.log(error);
        } else {
            console.log(successMessage);
        }
    }
}

var ubuntu = {};

ubuntu.addDesktopEntry = function () {
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
        handleCallback("Properly added desktop entry."));
};

ubuntu.removeDesktopEntry = function () {
    var fs = require('fs');
    fs.unlink(
        '/usr/share/applications/stream-tim.desktop',
        handleCallback("Successfully deleted desktop entry."));
};

ubuntu.setAsDefaultForMagnets = function () {
    var exec = require('child_process').exec;
    exec(
        "xdg-mime default stream-tim.desktop x-scheme-handler/magnet ",
        handleCallback("Properly set as default application for magnet links."));
};