'use strict';

describe('linux', function () {

    var linux;

    beforeEach(function () {
        linux = new Linux();
    });

    it('should have a function to check if a program exist', function () {

        expect(linux.isProgramInstalled('apt')).toBeTruthy();
        expect(linux.isProgramInstalled('notApt')).toBeFalsy();

        expect(linux.isProgramInstalled('gcc')).toBeTruthy();
        expect(linux.isProgramInstalled('notGcc')).toBeFalsy();

        expect(linux.isProgramInstalled('wget')).toBeTruthy();
        expect(linux.isProgramInstalled('notWget')).toBeFalsy();
    });
});