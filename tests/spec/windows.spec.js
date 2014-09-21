'use strict';

describe('windows', function () {

    it('should have a function to check if vlc is installed', function () {
        var windows = new Windows();
        spyOn(windows, 'getVlcPath').and.returnValue(undefined);
        var callback = jasmine.createSpy('callback');
        windows.isVlcInstalled(callback);
        expect(callback).toHaveBeenCalledWith(false);

        windows = new Windows();
        spyOn(windows, 'getVlcPath').and.returnValue('C:/Program/Vlc');
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
        console.log(mockRegKey.set.calls.argsFor(0));
        expect(mockRegKey.set.calls.argsFor(0)[0]).toEqual('');
        expect(mockRegKey.set.calls.argsFor(0)[1]).toEqual('REG_SZ');
        expect(mockRegKey.set.calls.argsFor(0)[2]).toEqual("\"" + process.execPath + "\" \"%1\"");
    });
});