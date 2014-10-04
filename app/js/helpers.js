var createCallback = function (successMessage, errorMessage) {
    return function (error) {
        if (error) {
            console.log(errorMessage);
            console.log(error);
        } else {
            console.log(successMessage);
        }
    }
};