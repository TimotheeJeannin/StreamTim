function getSemVer(fileName) {
    var dashSplit = fileName.split('-');
    var dotSplit = dashSplit[dashSplit.length - 1].split('.');
    return  {'major': parseInt(dotSplit[0]), 'minor': parseInt(dotSplit[1]), 'patch': parseInt(dotSplit[2])};
}

function semVerToString(semver) {
    return semver.major + '.' + semver.minor + '.' + semver.patch;
}

function getGreaterSemVer(semver1, semver2) {
    if (semver1.major > semver2.major) return semver1;
    if (semver1.major < semver2.major) return semver2;
    if (semver1.major == semver2.major) {
        if (semver1.minor > semver2.minor) return semver1;
        if (semver1.minor < semver2.minor) return semver2;
        if (semver1.minor == semver2.minor) {
            if (semver1.patch > semver2.patch) return semver1;
            if (semver1.patch < semver2.patch) return semver2;
        }
    }
}

function findGreaterSemVer(fileNames) {
    var semVer = {'major': 0, 'minor': 0, 'patch': 0};
    for (var i = 0; i < fileNames.length; i++) {
        semVer = getGreaterSemVer(semVer, getSemVer(fileNames[i]));
    }
    return semVer;
}

function setUpDownloadLink(bucketFiles, os) {
    var packages = $.grep(bucketFiles, function (item) {
        return new RegExp("^package\/stream-tim-" + os + ".*\\.zip$").test(item);
    });

    var latest = findGreaterSemVer(packages);
    var button = $('a#' + os + 'Download');
    button.attr('href', '/package/stream-tim-' + os + '-' + semVerToString(latest) + '.zip');
    button.click(function () {
        ga('send', 'event', 'button', 'click', os + ' ' + semVerToString(latest));
    });
}

$(document).ready(function () {
    $.get('http://www.streamtim.com.s3.amazonaws.com/', function (data) {
        var allBucketFiles = $(data).find('Contents').map(function () {
            return $(this).find('Key').text();
        }).toArray();
        setUpDownloadLink(allBucketFiles, 'windows');
        setUpDownloadLink(allBucketFiles, 'linux64');
        setUpDownloadLink(allBucketFiles, 'mac');
    });
});