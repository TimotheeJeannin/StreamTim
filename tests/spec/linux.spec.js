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
        linux.runVlc('192.168.9.9', 'callback');
        expect(mockChildProcess.exec).toHaveBeenCalledWith('vlc 192.168.9.9 -q --play-and-exit', 'callback');
    });

    it('should have a method that build the content of the desktop entry', function () {
        var linux = new Linux();
        var lines = linux.buildDesktopEntryContent().split('\n');
        expect(lines[5]).toEqual("Exec=" + process.execPath + " %U");
        expect(lines[7]).toEqual("TryExec=" + process.execPath);
    });

    describe('the method that check the desktop entry', function () {
        it('should call the callback with nothing if he content is already correct', function () {
            var mockFs = {
                readFile: function (path, callback) {
                    callback(null, new Linux().buildDesktopEntryContent());
                }
            };
            var callback = jasmine.createSpy('callback');
            var linux = new Linux(mockFs);
            linux.checkDesktopEntry(callback);
            expect(callback).toHaveBeenCalledWith();
        });

        it('should call the callback with an error if the file cannot be written', function () {
            var mockFs = {
                readFile: function (path, callback) {
                    callback(null, '');
                },
                writeFile: function (path, content, callback) {
                    callback('writeError');
                }
            };
            var callback = jasmine.createSpy('callback');
            var linux = new Linux(mockFs);
            linux.checkDesktopEntry(callback);
            expect(callback).toHaveBeenCalledWith('writeError');
        });

        it('should call the callback with with nothing if the file has been properly added', function () {
            var mockFs = {
                readFile: function (path, callback) {
                    callback(null, '');
                },
                writeFile: function (path, content, callback) {
                    callback();
                }
            };
            var callback = jasmine.createSpy('callback');
            var linux = new Linux(mockFs);
            linux.checkDesktopEntry(callback);
            expect(callback).toHaveBeenCalledWith();
        });

    });

    it('should have a method that setup the magnet link association', function () {
        var mockFs = {
            readFile: function (path, callback) {
                callback(null, '');
            },
            writeFile: function (path, content, callback) {
                callback();
            }
        };
        var mockChildProcess = {
            exec: function (command, callback) {
                callback(null, '  \n  test.desktop  ');
            }
        };
        var linux = new Linux(mockFs, mockChildProcess);
        linux.setupMagnetLinkAssociation();

        expect(linux.previousMagnetLinkAssociation).toEqual('test.desktop');
    });

    it('should have a method that restore the previous magnet link association', function () {
        var mockChildProcess = {
            exec: function (command, callback) {
                callback();
            }
        };
        var callback = jasmine.createSpy('callback');
        var linux = new Linux({}, mockChildProcess);
        linux.restorePreviousMagnetLinkAssociation(callback);
        expect(callback).toHaveBeenCalled();
        linux.previousMagnetLinkAssociation = 'test.desktop';
        linux.restorePreviousMagnetLinkAssociation(callback);
        expect(callback).toHaveBeenCalled();
    });
});