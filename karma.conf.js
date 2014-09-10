module.exports = function (config) {
    config.set({
        basePath: '.',

        files: [
            'app/js/helpers.js',
            'tests/helpers.spec.js'
        ],

        preprocessors: {
            'app/js/*.js': ['coverage']
        },

        autoWatch: true,

        frameworks: ['jasmine'],

        browsers: ['Chrome'],

        plugins: [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-jasmine',
            'karma-coverage'
        ]
    })
};
