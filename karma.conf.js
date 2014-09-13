module.exports = function (config) {
    config.set({
        basePath: '.',

        files: [
            'app/js/helpers.js',
            'app/js/linux.js',
            'tests/helpers.spec.js',
            'tests/linux.spec.js'
        ],

        preprocessors: {
            'app/js/*.js': ['coverage']
        },

        autoWatch: true,

        frameworks: ['jasmine'],

        browsers: ['NodeWebkit']

    })
};
