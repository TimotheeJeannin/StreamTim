'use strict';

describe('view', function () {

    var view;
    var waitMagnet, noVlcFound, prepareStream, streamView;

    beforeEach(function () {

        // Load the index.html in the page.
        document.body.innerHTML = $.ajax({
            type: "GET",
            dataType: "html",
            url: 'base/app/index.html',
            async: false
        }).responseText;

        view = new View();

        waitMagnet = $('div#waitMagnet');
        noVlcFound = $('div#noVlcFound');
        prepareStream = $('div#prepareStream');
        streamView = $('div#streamView');
    });

    it('should have a function that initialize the page', function () {

        expect(waitMagnet.is(":visible")).toBeTruthy();
        expect(noVlcFound.is(":visible")).toBeTruthy();
        expect(prepareStream.is(":visible")).toBeTruthy();
        expect(streamView.is(":visible")).toBeTruthy();

        view.initialise();

        expect(waitMagnet.is(":visible")).toBeFalsy();
        expect(noVlcFound.is(":visible")).toBeFalsy();
        expect(prepareStream.is(":visible")).toBeFalsy();
        expect(streamView.is(":visible")).toBeFalsy();
    });
});