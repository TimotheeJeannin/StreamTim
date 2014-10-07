function Stream(peerflix, address, readTorrent) {

    var self = this;
    var engine = null;
    var interval = null;

    var readLink = function (link, callback) {
        if (/^magnet:/.test(link)) {
            callback(null, link);
        } else {
            readTorrent(link, callback);
        }
    };

    this.start = function (os, view, link) {
        if (self.isStarted() || self.isStarting()) return;
        view.show('prepareStream');
        readLink(link, function (error, torrent) {
            engine = peerflix(torrent);
            engine.server.on('listening', function () {
                view.show('streamView');
                interval = setInterval(function () {
                    view.updateStreamView(engine);
                }, 1000);
                os.runVlc('http://' + address() + ':' + engine.server.address().port + '/', self.stop);
            });
        });
    };

    this.stop = function (view, callback) {
        if (interval) {
            clearInterval(interval);
            interval = null;
            callback();
        }
        if (engine) {
            engine.destroy(function () {
                view.resetStreamView();
                engine = null;
                callback();
            });
        }
    };

    this.isStarting = function () {
        return engine && !interval;
    };

    this.isStarted = function () {
        return engine && interval;
    };
}