'use strict';

describe('windows', function () {

    it('should have a function to check if vlc is installed', function () {
        var windows = new Windows();
        windows.getVlcPath = function (callback) {
            callback(undefined);
        };
        var callback = jasmine.createSpy('callback');
        windows.isVlcInstalled(callback);
        expect(callback).toHaveBeenCalledWith(false);

        windows = new Windows();
        windows.getVlcPath = function (callback) {
            callback('C:\\Program Files (x86)\\VideoLAN\\VLC');
        };
        callback = jasmine.createSpy('callback');
        windows.isVlcInstalled(callback);
        expect(callback).toHaveBeenCalledWith(true);
    });

    it('should have a method that launches vlc', function () {
        var mockChildProcess = jasmine.createSpyObj('childProcess', ['execFile']);
        var windows = new Windows({}, mockChildProcess);
        windows.searchRegistryForVlc = function (regKeyPath, callback) {
            callback('test_path');
        };
        windows.runVlc('192.168.9.9', 'callback');
        expect(mockChildProcess.execFile).toHaveBeenCalledWith('test_path', [ '192.168.9.9', '-q', '--play-and-exit' ], 'callback');
    });

    it('should have a method that setup the magnet link catching', function () {
        var mockRegKey = jasmine.createSpyObj('regKey', ['set', 'get']);
        var mockWinreg = function () {
            return mockRegKey
        };
        mockWinreg.REG_SZ = 'REG_SZ';
        var windows = new Windows(mockWinreg);
        windows.setupMagnetLinkAssociation();
        expect(mockRegKey.get).toHaveBeenCalled();
        expect(mockRegKey.get.calls.argsFor(0)[0]).toEqual('');
    });

    describe('the method that search the registry for Vlc', function () {

        it('should return the path of Vlc if found', function () {
            var mockChildProcess = {
                exec: function (command, callback) {
                    callback(null,
                            "HKEY_LOCAL_MACHINE\\SOFTWARE\\Wow6432Node\\VideoLAN\\VLC\n" +
                            "(par défaut)    REG_SZ    C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe\n");
                }
            };
            var callback = jasmine.createSpy('callback');
            var windows = new Windows({}, mockChildProcess);
            windows.searchRegistryForVlc("HKEY_LOCAL_MACHINE\\SOFTWARE\\Wow6432Node\\VideoLAN\\VLC", callback);
            expect(callback).toHaveBeenCalledWith("C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe");
        });

        it("should call the callback with nothing if vlc isn't found", function () {
            var mockChildProcess = {
                exec: function (command, callback) {
                    callback(null,
                            "HKEY_LOCAL_MACHINE\\SOFTWARE\\Wow6432Node\\VideoLAN\\VLC\n" +
                            "(par défaut)    REG_SZ    C:\\Program Files (x86)\\VideoLAN\\VLC\\vfzlc.exe\n");
                }
            };
            var callback = jasmine.createSpy('callback');
            var windows = new Windows({}, mockChildProcess);
            windows.searchRegistryForVlc("HKEY_LOCAL_MACHINE\\SOFTWARE\\Wow6432Node\\VideoLAN\\VLC", callback);
            expect(callback).toHaveBeenCalledWith();
            expect(callback.calls.count()).toEqual(1);
        });

        it("should call the callback with nothing if there is an error", function () {
            var mockChildProcess = {
                exec: function (command, callback) {
                    callback('error', '');
                }
            };
            var callback = jasmine.createSpy('callback');
            var windows = new Windows({}, mockChildProcess);
            windows.searchRegistryForVlc("HKEY_LOCAL_MACHINE\\SOFTWARE\\Wow6432Node\\VideoLAN\\VLC", callback);
            expect(callback).toHaveBeenCalledWith();
            expect(callback.calls.count()).toEqual(1);
        });

    });

    it('should have a method that get the path of Vlc', function () {
        var mockChildProcess = {
            exec: function (command, callback) {
                if (/.*Wow6432Node.*/.test(command)) {
                    callback(null, "Big maxi error you know ?");
                } else {
                    callback(null,
                            "HKEY_LOCAL_MACHINE\\SOFTWARE\\Wow6432Node\\VideoLAN\\VLC\n" +
                            "(par défaut)    REG_SZ    C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe\n");
                }
            }
        };

        var windows = new Windows({}, mockChildProcess);
        var callback = jasmine.createSpy('callback');
        windows.getVlcPath(callback);
        expect(callback.calls.count()).toEqual(1);
        expect(callback).toHaveBeenCalledWith('C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe');
    });
});