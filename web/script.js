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

$(document).ready(function () {
    $.get('http://www.streamtim.com.s3.amazonaws.com/', function (data) {
        var allBucketFiles = $(data).find('Contents').map(function () {
            return $(this).find('Key').text();
        }).toArray();
        var windowsPackages = $.grep(allBucketFiles, function (item) {
            return /^package\/stream-tim-windows.*\.zip$/.test(item);
        });
        var linuxPackages = $.grep(allBucketFiles, function (item) {
            return /^package\/stream-tim-linux64.*\.zip$/.test(item);
        });

        var latestWindows = findGreaterSemVer(windowsPackages);
        var windowsButton = $('a#windowsDownload');
        windowsButton.attr('href', '/package/stream-tim-windows-' + semVerToString(latestWindows) + '.zip');
        windowsButton.click(function () {
            ga('send', 'event', 'button', 'click', 'windows ' + semVerToString(latestWindows));
        });


        var latestLinux = findGreaterSemVer(linuxPackages);
        var linuxButton = $('a#linuxDownload');
        linuxButton.attr('href', '/package/stream-tim-linux64-' + semVerToString(latestLinux) + '.zip');
        linuxButton.click(function () {
            ga('send', 'event', 'button', 'click', 'linux64 ' + semVerToString(latestLinux));
        });
    });
});