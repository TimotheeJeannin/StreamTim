'use strict';

describe('stream', function () {

    var torrentLink = 'http://torcache.net/torrent/666BD69D2BD5F944B66A71E7351C63384ABE3D13.torrent';
    var magnetLink = 'magnet:?xt=urn:btih:666BD69D2BD5F944B66A71E7351C63384ABE3D13&dn=x+men+days+of+future+past+2014+720p+';

    it('should have a method to read torrent link', function () {
        var callback = jasmine.createSpy('callback');
        var readTorrent = jasmine.createSpy('readTorrent');
        var stream = new Stream({}, {}, readTorrent);

        stream.readLink(torrentLink, callback);
        expect(readTorrent).toHaveBeenCalledWith(torrentLink, callback);

        stream.readLink(magnetLink, callback);
        expect(callback).toHaveBeenCalledWith(null, magnetLink);
    });


    describe('the start method', function () {

        it('should launch vlc if everything goes well', function () {

            var readTorrent = jasmine.createSpy('readTorrent');
            var view = jasmine.createSpyObj('view', ['show']);
            var os = {
                runVlc: function (a, callback) {
                    callback();
                }
            };
            var address = jasmine.createSpy('address').and.returnValue('192.168.9.2');
            var peerflix = jasmine.createSpy('peerflix')
                .and.returnValue({
                    server: {
                        on: function (a, callback) {
                            callback();
                        },
                        address: function () {
                            return {port: 5000};
                        }
                    }});

            var stream = new Stream(peerflix, address, readTorrent);
            spyOn(stream, 'stop');

            stream.start(os, view, magnetLink);

            expect(view.show).toHaveBeenCalledWith('prepareStream');
            expect(peerflix).toHaveBeenCalledWith(magnetLink);
            expect(view.show).toHaveBeenCalledWith('streamView');
            expect(stream.stop).toHaveBeenCalled();
        });

        it('should handle errors gracefully', function () {

            var readTorrent = function (link, callback) {
                callback(new Error('Invalid link'), link);
            };
            var view = jasmine.createSpyObj('view', ['show', 'showInvalidLinkError']);
            spyOn(console, 'error');
            var stream = new Stream({}, {}, readTorrent);
            stream.start({}, view, torrentLink);

            expect(view.show).toHaveBeenCalledWith('prepareStream');
            expect(console.error).toHaveBeenCalled();
            expect(view.show).toHaveBeenCalledWith('waitMagnet');
            expect(view.showInvalidLinkError).toHaveBeenCalled();
        });
    });
});