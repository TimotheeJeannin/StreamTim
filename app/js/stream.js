function Stream(peerflix, address, readTorrent) {

    var self = this;
    var engine = null;
    var interval = null;

    this.readLink = function (link, callback) {
        if (/^magnet:/.test(link)) {
            callback(null, link);
        } else {
            readTorrent(link, callback);
        }
    };

    this.handleError = function (view, error) {
        console.error(error);
        view.show('waitMagnet');
        view.showInvalidLinkError();
    };

    this.start = function (os, view, link) {
        if (self.isStarted() || self.isStarting()) return;
        view.show('prepareStream');
        self.readLink(link, function (error, torrent) {
            if (error) {
                self.handleError(view, error);
            } else {
                try {
                    engine = peerflix(torrent);
                    engine.server.on('listening', function () {
                        view.show('streamView');
                        interval = setInterval(function () {
                            view.updateStreamView(engine);
                        }, 1000);
                        os.runVlc('http://' + address() + ':' + engine.server.address().port + '/', function () {
                            self.stop(view);
                        });
                    });
                } catch (error) {
                    self.handleError(view, error);
                }
            }
        });
    };

    this.stop = function (view) {
        if (interval) {
            clearInterval(interval);
            interval = null;
        }
        if (engine) {
            engine.destroy(function () {
                view.resetStreamView();
                view.show('waitMagnet');
                engine = null;
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