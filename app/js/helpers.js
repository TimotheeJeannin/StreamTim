var handleCallback = function (successMessage) {
    return function (error) {
        if (error) {
            console.log(error);
            console.log(error.message);
            $('#message').append('<br/><span style="color: lightcoral">' + error.message + '</span>');
        } else {
            logMessage(successMessage);
        }
    }
};

var logMessage = function (message) {
    console.log(message);
    $('#message').append('<br/>' + message);
};

var getSystem = function () {
    if (process.platform === 'linux') {
        return new Linux();
    } else if (process.platform === 'win32') {
        return new Windows();
    }
};