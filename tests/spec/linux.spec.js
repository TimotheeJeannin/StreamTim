'use strict';

describe('linux', function () {

    it('should have a function to check if vlc is installed', function () {
        var linux = new Linux();
        spyOn(linux, 'isProgramInstalled');
        var callback = function () {
        };
        linux.isVlcInstalled(callback);
        expect(linux.isProgramInstalled).toHaveBeenCalledWith('vlc', callback);
    });

    it('should have a function to check if a program is installed', function () {
        var mockChildProcess = {
            exec: function (command, callback) {
                callback(new Error('Test Error'));
            }
        };
        var linux = new Linux({}, mockChildProcess);
        var callback = jasmine.createSpy('callback');
        linux.isProgramInstalled('testName', callback);
        expect(callback).toHaveBeenCalledWith(false);

        mockChildProcess = {
            exec: function (command, callback) {
                callback(undefined);
            }
        };
        linux = new Linux({}, mockChildProcess);
        callback = jasmine.createSpy('callback');
        linux.isProgramInstalled('testName', callback);
        expect(callback).toHaveBeenCalledWith(true);
    });

    it('should have a method that launches vlc', function () {
        var mockChildProcess = jasmine.createSpyObj('childProcess', ['exec']);
        var linux = new Linux({}, mockChildProcess);
        linux.runVlc('192.168.9.9');
        expect(mockChildProcess.exec).toHaveBeenCalledWith('vlc 192.168.9.9 -q --play-and-exit');
    });

    it('should have a method that setup the magnet link catching', function () {
        var mockFs = jasmine.createSpyObj('fs', ['writeFile']);
        var mockChildProcess = jasmine.createSpyObj('childProcess', ['exec']);
        var linux = new Linux(mockFs, mockChildProcess);
        linux.setupMagnetClickCatching();

        expect(mockChildProcess.exec.calls.argsFor(0)[0]).toEqual("xdg-mime default stream-tim.desktop x-scheme-handler/magnet ");
        expect(mockFs.writeFile.calls.argsFor(0)[0]).toEqual('/usr/share/applications/stream-tim.desktop');
    });
});