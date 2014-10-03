'use strict';

describe('view', function () {

    var waitMagnet, noAdmin, noVlcFound, prepareStream, streamView, view, gui;

    var buildEngine = function (wires, downloaded, downloadSpeed) {
        return {
            swarm: {
                wires: wires,
                downloaded: downloaded,
                downloadSpeed: function () {
                    return downloadSpeed
                }
            }}
    };

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
        noAdmin = $('div#noAdmin');
        prepareStream = $('div#prepareStream');
        streamView = $('div#streamView');

        var numeral = function (num) {
            return {
                format: function () {
                    return num;
                }
            };
        };

        gui = { Shell: {openExternal: jasmine.createSpy('openExternal') } };

        view = new View(gui, numeral);
    });

    afterEach(function () {
        document.body.innerHTML = '';
    });

    it('should have a function that hide all in the page', function () {

        expect(waitMagnet.is(":visible")).toBeTruthy();
        expect(noVlcFound.is(":visible")).toBeTruthy();
        expect(noAdmin.is(":visible")).toBeTruthy();
        expect(prepareStream.is(":visible")).toBeTruthy();
        expect(streamView.is(":visible")).toBeTruthy();

        view.hideAll();

        expect(waitMagnet.is(":visible")).toBeFalsy();
        expect(noVlcFound.is(":visible")).toBeFalsy();
        expect(noAdmin.is(":visible")).toBeFalsy();
        expect(prepareStream.is(":visible")).toBeFalsy();
        expect(streamView.is(":visible")).toBeFalsy();
    });

    it('should have a function that initialise the page', function () {
        spyOn(window, 'close');
        view.initialise();

        $('#close').click();
        expect(window.close).toHaveBeenCalled();

        $('#vlcWebsite').click();
        expect(gui.Shell.openExternal).toHaveBeenCalledWith('http://www.videolan.org/vlc/');
    });

    it('should have a show function to show some parts of the interface', function () {
        view.hideAll();
        spyOn(view, 'hideAll');
        spyOn(console, 'log');

        expect(prepareStream.is(":visible")).toBeFalsy();
        view.show('prepareStream');
        expect(prepareStream.is(":visible")).toBeTruthy();
        expect(view.hideAll).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith('Showing prepareStream');
    });

    it('should have a function that resets the stream view', function () {
        view.updateStreamView(buildEngine([1, 2, 3], 1, 1000));
        view.resetStreamView();
        expect($('#numberOfPeers').html()).toEqual('');
        expect($('#downloadedAmount').html()).toEqual('');
        expect(view.speeds).toEqual([]);
        expect($('svg').is(':empty')).toBeTruthy();
    });

    it('should have a function to update the stream view', function () {

        var numberOfPeers = $('#numberOfPeers');
        var downloadedAmount = $('#downloadedAmount');

        expect(numberOfPeers.html()).toEqual('');
        expect(downloadedAmount.html()).toEqual('');

        spyOn(view, 'updateChart');

        view.updateStreamView(buildEngine([1, 2, 3], 1, 1000));

        expect(numberOfPeers.html()).toEqual('3');
        expect(downloadedAmount.html()).toEqual('1');
        expect(view.speeds[0]).toEqual(1);
        expect(view.updateChart).not.toHaveBeenCalled();

        view.updateStreamView(buildEngine([1, 2, 3, 4], 2, 2000));

        expect(numberOfPeers.html()).toEqual('4');
        expect(downloadedAmount.html()).toEqual('2');
        expect(view.speeds[0]).toEqual(1);
        expect(view.speeds[1]).toEqual(2);
        expect(view.updateChart).toHaveBeenCalled();

        view.speeds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

        view.updateStreamView(buildEngine([1, 2, 3, 4], 2, 2000));
        view.updateStreamView(buildEngine([1, 2, 3, 4], 2, 2000));
        view.updateStreamView(buildEngine([1, 2, 3, 4], 2, 2000));

        expect(view.speeds.length).toEqual(20);
    });
});