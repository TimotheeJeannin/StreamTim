'use strict';

describe('mac', function () {

    it('should have a function to check if vlc is installed', function () {
        var mockFs = jasmine.createSpyObj('fs', ['exists']);
        var mac = new Mac(mockFs);
        var callback = function () {
        };
        mac.isVlcInstalled(callback);
        expect(mockFs.exists).toHaveBeenCalledWith('/Applications/VLC.app', callback);
    });

    it('should have a method that launches vlc', function () {
        var mockChildProcess = jasmine.createSpyObj('childProcess', ['exec']);
        var mac = new Mac({}, mockChildProcess);
        mac.runVlc('192.168.9.9', 'callback');
        expect(mockChildProcess.exec)
            .toHaveBeenCalledWith('/Applications/VLC.app/Contents/MacOS/VLC 192.168.9.9 -q --play-and-exit', 'callback');
    });
});