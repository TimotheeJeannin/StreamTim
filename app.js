$(document).ready(function () {
    $('div#torrentInput input').change(function () {
        var peerflix = require('peerflix');
        var engine = peerflix($('div#torrentInput input').val(), {list: true});
        var onready = function () {
            engine.files.forEach(function (file, index) {
                $('div#listOfFiles').append('<button value="index" class="btn btn-default"> ' + file.name + '</button><br/>');
            });
        };
        if (engine.torrent) onready();
        else engine.on('ready', onready);
    });
    $('div#listOfFiles button').click(function () {
        var peerflix = require('peerflix');
        var address = require('network-address');
        var engine = peerflix($('div#torrentInput input').val(), {index: $(this).val()});
        engine.server.on('listening', function () {
            $('#streamingAddress')
                .addClass('alert')
                .addClass('alert-success')
                .html(' Streaming at: http://' + address() + ':' + engine.server.address().port + '/');
        });
    });
});