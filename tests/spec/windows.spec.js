'use strict';

describe('windows', function () {

    var mockWinReg;

    beforeEach(function () {
        mockWinReg = function () {

        };
    });

    it('should have a function to check if vlc is installed', function () {
        var windows = new Windows(mockWinReg);
        windows.getVlcPath = function (callback) {
            callback(undefined);
        };
        var callback = jasmine.createSpy('callback');
        windows.isVlcInstalled(callback);
        expect(callback).toHaveBeenCalledWith(false);

        windows = new Windows(mockWinReg);
        windows.getVlcPath = function (callback) {
            callback('C:\\Program Files (x86)\\VideoLAN\\VLC');
        };
        callback = jasmine.createSpy('callback');
        windows.isVlcInstalled(callback);
        expect(callback).toHaveBeenCalledWith(true);
    });

    it('should have a method that launches vlc', function () {
        var mockChildProcess = jasmine.createSpyObj('childProcess', ['execFile']);
        var windows = new Windows(mockWinReg, mockChildProcess);
        windows.searchRegistryForVlc = function (cmdPath, regQuery, callback) {
            callback('C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe');
        };
        windows.runVlc('192.168.9.9', 'callback');
        expect(mockChildProcess.execFile).toHaveBeenCalledWith(
            'C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc', [ '192.168.9.9', '-q', '--play-and-exit' ], 'callback');
    });

    it('should have a method that setup the magnet link association', function () {
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
                execFile: function (command, args, callback) {
                    callback(null,
                            "HKEY_LOCAL_MACHINE\\SOFTWARE\\Wow6432Node\\VideoLAN\\VLC\n" +
                            "(par défaut)    REG_SZ    C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe\n");
                }
            };
            var callback = jasmine.createSpy('callback');
            var windows = new Windows(mockWinReg, mockChildProcess);
            windows.searchRegistryForVlc('cmd', 'regQuery', callback);
            expect(callback).toHaveBeenCalledWith("C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe");
        });

        it("should call the callback with nothing if vlc isn't found", function () {
            var mockChildProcess = {
                execFile: function (command, args, callback) {
                    callback(null,
                            "HKEY_LOCAL_MACHINE\\SOFTWARE\\Wow6432Node\\VideoLAN\\VLC\n" +
                            "(par défaut)    REG_SZ    C:\\Program Files (x86)\\VideoLAN\\VLC\\vfzlc.exe\n");
                }
            };
            var callback = jasmine.createSpy('callback');
            var windows = new Windows(mockWinReg, mockChildProcess);
            windows.searchRegistryForVlc('cmd', 'regQuery', callback);
            expect(callback).toHaveBeenCalledWith();
            expect(callback.calls.count()).toEqual(1);
        });

        it("should call the callback with nothing if there is an error", function () {
            var mockChildProcess = {
                execFile: function (command, args, callback) {
                    callback('error', '');
                }
            };
            var callback = jasmine.createSpy('callback');
            var windows = new Windows(mockWinReg, mockChildProcess);
            windows.searchRegistryForVlc('cmd', 'regQuery', callback);
            expect(callback).toHaveBeenCalledWith();
            expect(callback.calls.count()).toEqual(1);
        });

    });

    describe('the method that gets the path of vlc', function () {

        it('should call the callback with a stored vlc path if it has one', function () {
            var windows = new Windows(mockWinReg, {});
            windows.vlcPath = 'C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe';
            var callback = jasmine.createSpy('callback');
            windows.getVlcPath(callback);
            expect(callback.calls.count()).toEqual(1);
            expect(callback).toHaveBeenCalledWith('C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe');
        });

        it('should call the callback with nothing if no path is found', function () {

            var mockChildProcess = {
                execFile: function (command, args, callback) {
                    callback(null, "error");
                }
            };

            var windows = new Windows(mockWinReg, mockChildProcess);
            var callback = jasmine.createSpy('callback');
            windows.getVlcPath(callback);
            expect(callback.calls.count()).toEqual(1);
            expect(callback).toHaveBeenCalledWith();
        });

        it('should search the registry', function () {
            var mockChildProcess = {
                execFile: function (command, args, callback) {
                    if (command == process.env.SystemRoot + '\\cmd.exe' && /.*Wow6432Node.*/.test(args[2])) {
                        callback(null, "Big maxi error you know ?");
                    } else {
                        callback(null,
                                "HKEY_LOCAL_MACHINE\\SOFTWARE\\Wow6432Node\\VideoLAN\\VLC\n" +
                                "(par défaut)    REG_SZ    C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe\n");
                    }
                }
            };

            var windows = new Windows(mockWinReg, mockChildProcess);
            var callback = jasmine.createSpy('callback');
            windows.getVlcPath(callback);
            expect(callback.calls.count()).toEqual(1);
            expect(callback).toHaveBeenCalledWith('C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe');
        });
    });
});