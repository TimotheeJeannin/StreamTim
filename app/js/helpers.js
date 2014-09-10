var createCallback = function (successMessage, errorMessage) {
    return function (error) {
        if (error) {
            console.error(errorMessage);
            console.error(error);
        } else {
            console.log(successMessage);
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