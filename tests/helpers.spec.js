'use strict';

describe('helpers', function () {

    it('should have a function to build error callbacks', function () {
        spyOn(console, 'log');
        spyOn(console, 'error');

        var callback = createCallback('ok', 'notok');
        callback(undefined);

        expect(console.error).not.toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith('ok');

        console.error.calls.reset();
        console.log.calls.reset();

        var error = new Error('notOk');
        callback(error);

        expect(console.error).toHaveBeenCalledWith(error);
        expect(console.error).toHaveBeenCalledWith('notok');
    });
});