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
        spyOn(windows, 'getVlcPath').and.returnValue('test_path');
        windows.runVlc('192.168.9.9');
        expect(mockChildProcess.execFile).toHaveBeenCalledWith('test_path', [ '192.168.9.9', '-q', '--play-and-exit' ]);
    });

    it('should have a method that setup the magnet link catching', function () {
        var mockRegKey = jasmine.createSpyObj('regKey', ['set']);
        var mockWinreg = function () {
            return mockRegKey
        };
        mockWinreg.REG_SZ = 'REG_SZ';
        var windows = new Windows(mockWinreg);
        windows.setupMagnetClickCatching();
        expect(mockRegKey.set).toHaveBeenCalled();
        expect(mockRegKey.set.calls.argsFor(0)[0]).toEqual('');
        expect(mockRegKey.set.calls.argsFor(0)[1]).toEqual('REG_SZ');
        expect(mockRegKey.set.calls.argsFor(0)[2]).toEqual("\"" + process.execPath + "\" \"%1\"");
    });

    it('should have a method that search the registry for Vlc', function () {
        var mockRegKey = {
            values: function (callback) {
                callback(undefined, {
                        'installDir': {
                            name: 'installDir',
                            type: 'REG_SZ',
                            value: 'C:\\Program Files (x86)\\VideoLAN\\VLC'},
                        'version': {
                            name: 'version',
                            type: 'REG_SZ',
                            value: '5.6.8'}
                    }
                )
            }
        };
        var mockWinreg = function () {
            return mockRegKey
        };
        mockWinreg.REG_SZ = 'REG_SZ';
        var windows = new Windows(mockWinreg);
        var callback = jasmine.createSpy('callback');
        windows.searchRegistryForVlc('\\SOFTWARE\\VideoLAN\\VLC', callback);
        expect(callback).toHaveBeenCalledWith('C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc');
    });

    it('should have a method that get the path of Vlc', function () {
        var windows = new Windows();
        var callback = jasmine.createSpy('callback');
        windows.searchRegistryForVlc = function (regKeyPath, callback) {
            callback('C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc');
        };
        windows.getVlcPath(callback);
        expect(callback).toHaveBeenCalledWith('C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc');

        windows = new Windows();
        callback = jasmine.createSpy('callback');
        windows.searchRegistryForVlc = function (regKeyPath, callback) {
            callback(undefined);
        };
        windows.getVlcPath(callback);
        expect(callback).toHaveBeenCalledWith(undefined);
    });
});