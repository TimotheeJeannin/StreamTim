const createCallback = function (successMessage, errorMessage) {
    return function (error) {
        if (error) {
            console.error(errorMessage);
            console.error(error);
        } else {
            console.log(successMessage);
        }
    }
};