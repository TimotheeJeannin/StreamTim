'use strict';

describe('helpers', function () {

    it('should have a function to build error callbacks', function () {
        spyOn(window, 'logError');
        spyOn(window, 'logMessage');

        var callback = createCallback('ok', 'notok');
        callback(undefined);

        expect(window.logError).not.toHaveBeenCalled();
        expect(window.logMessage).toHaveBeenCalledWith('ok');

        window.logMessage.calls.reset();
        window.logError.calls.reset();

        var error = new Error('notOk');
        callback(error);

        expect(window.logError).toHaveBeenCalledWith(error);
        expect(window.logMessage).toHaveBeenCalledWith('notok');
    });
});