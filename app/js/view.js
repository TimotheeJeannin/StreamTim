function View(gui, numeral) {

    var speeds = [];

    var bytes = function (num) {
        return numeral(num).format('0.0b');
    };

    this.initialisePage = function () {
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

    this.updateStreamView = function (engine) {
        $('#numberOfPeers').html(engine.swarm.wires.length);
        $('#downloadedAmount').html(bytes(engine.swarm.downloaded));
        speeds.push(engine.swarm.downloadSpeed() / 1000);
        if (speeds.length > 20) {
            speeds.shift();
        }
        if (speeds.length > 1) {
            updateChart(speeds);
        }
    };
}