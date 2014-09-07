$(document).ready(function () {
    $('div#torrentInput input').change(function () {
        var peerflix = require('peerflix');
        var engine = peerflix($('div#torrentInput input').val(), {list: true});
        var onready = function () {
            if (engine.files && engine.files.length > 0) {
                $('#streamButton').show();
            }
            engine.files.forEach(function (file, index) {
                $('div#listOfFiles').append('<input name="files" type="radio" value="index"/> ' + file.name + '<br/>');
            });
        };
        if (engine.torrent) onready();
        else engine.on('ready', onready);
    });
    $('button#streamButton').click(function () {
        var peerflix = require('peerflix');
        var address = require('network-address');
        var engine = peerflix($('input').val(), {index: $("input[type='radio']:checked").val()});
        engine.server.on('listening', function () {
            $('#streamingAddress')
                .addClass('alert')
                .addClass('alert-success')
                .html(' Streaming at: http://' + address() + ':' + engine.server.address().port + '/');
        });
    });
});