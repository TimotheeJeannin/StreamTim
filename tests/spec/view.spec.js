'use strict';

describe('view', function () {

    var waitMagnet, noVlcFound, prepareStream, streamView;

    beforeEach(function () {

        // Load the index.html in the page.
        document.body.innerHTML = $.ajax({
            type: "GET",
            dataType: "html",
            url: 'base/app/index.html',
            async: false
        }).responseText;

        waitMagnet = $('div#waitMagnet');
        noVlcFound = $('div#noVlcFound');
        prepareStream = $('div#prepareStream');
        streamView = $('div#streamView');
    });

    afterEach(function () {
        document.body.innerHTML = '';
    });

    it('should have a function that hide all in the page', function () {

        var view = new View();

        expect(waitMagnet.is(":visible")).toBeTruthy();
        expect(noVlcFound.is(":visible")).toBeTruthy();
        expect(prepareStream.is(":visible")).toBeTruthy();
        expect(streamView.is(":visible")).toBeTruthy();

        view.hideAll();

        expect(waitMagnet.is(":visible")).toBeFalsy();
        expect(noVlcFound.is(":visible")).toBeFalsy();
        expect(prepareStream.is(":visible")).toBeFalsy();
        expect(streamView.is(":visible")).toBeFalsy();
    });

    it('should have a function that initialise the page', function () {
        var gui = { Shell: {openExternal: jasmine.createSpy('openExternal') } };
        var view = new View(gui);

        spyOn(window, 'close');
        view.initialise();

        $('#close').click();
        expect(window.close).toHaveBeenCalled();

        $('#vlcWebsite').click();
        expect(gui.Shell.openExternal).toHaveBeenCalledWith('http://www.videolan.org/vlc/');
    });

    it('should have a show function to show some parts of the interface', function () {
        var view = new View();
        view.hideAll();
        spyOn(view, 'hideAll');
        spyOn(console, 'log');

        expect(prepareStream.is(":visible")).toBeFalsy();
        view.show('prepareStream');
        expect(prepareStream.is(":visible")).toBeTruthy();
        expect(view.hideAll).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith('Showing prepareStream');
    });
});