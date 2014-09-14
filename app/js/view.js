function View() {

    this.initialisePage = function (gui) {
        $('#close').click(function () {
            window.close();
        });

        $('#vlcWebsite').click(function () {
            gui.Shell.openExternal('http://www.videolan.org/vlc/');
        });

        $('#waitMagnet').hide();
        $('#noVlcFound').hide();
        $('#prepareStream').hide();
        $('#streamView').hide();
    };
}