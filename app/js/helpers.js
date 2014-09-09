var handleCallback = function (successMessage) {
    return function (error) {
        if (error) {
            console.log(error);
            console.log(error.message);
        } else {
            console.log(successMessage);
            $('#message').append('<br/>' + successMessage);
        }
    }
};

var getSystem = function () {
    if (process.platform === 'linux') {
        return new Linux();
    } else if (process.platform === 'win32') {
        return new Windows();
    }
};