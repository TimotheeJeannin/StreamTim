function View(gui, numeral) {

    var speeds = [];
    var self = this;

    var bytes = function (num) {
        return numeral(num).format('0.0b');
    };

    this.show = function (divId) {
        self.hideAll();
        $('#' + divId).show();
    };

    this.hideAll = function () {
        $('#waitMagnet').hide();
        $('#noVlcFound').hide();
        $('#prepareStream').hide();
        $('#streamView').hide();
    };

    this.initialise = function () {
        $('#close').click(function () {
            window.close();
        });

        $('#vlcWebsite').click(function () {
            gui.Shell.openExternal('http://www.videolan.org/vlc/');
        });

        self.hideAll();
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