'use strict';

describe('stream', function () {

    it('should have a method to read torrent link', function () {
        var callback = jasmine.createSpy('callback');
        var readTorrent = jasmine.createSpy('readTorrent');
        var stream = new Stream({}, {}, readTorrent);

        var link = 'http://torcache.net/torrent/666BD69D2BD5F944B66A71E7351C63384ABE3D13.torrent';
        stream.readLink(link, callback);
        expect(readTorrent).toHaveBeenCalledWith(link, callback);

        link = 'magnet:?xt=urn:btih:666BD69D2BD5F944B66A71E7351C63384ABE3D13&dn=x+men+days+of+future+past+2014+720p+';
        stream.readLink(link, callback);
        expect(callback).toHaveBeenCalledWith(null, link);
    });
});