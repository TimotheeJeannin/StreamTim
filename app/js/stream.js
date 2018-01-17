const peerflix = require('peerflix');
const address = require('network-address');
const readTorrent = require('read-torrent');

const view = require('./view');

function Stream() {

    let self = this;
    let engine = null;
    let interval = null;

    this.readLink = function (link, callback) {
        if (/^magnet:/.test(link)) {
            callback(null, link);
        } else {
            readTorrent(link, callback);
        }
    };

    this.handleError = function (error) {
        console.error(error);
        view.show('waitMagnet');
        view.showInvalidLinkError();
    };

    this.start = function (os, link) {
        if (self.isStarted() || self.isStarting()) return;
        view.show('prepareStream');
        self.readLink(link, function (error, torrent) {
            if (error) {
                self.handleError(error);
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
                    self.handleError(error);
                }
            }
        });
    };

    this.stop = function () {
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

module.exports = new Stream();