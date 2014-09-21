module.exports = function (config) {
    config.set({
        basePath: '../',

        files: [
            'app/lib/jquery/dist/jquery.js',
            'app/lib/d3/d3.js',
            'app/js/helpers.js',
            'app/js/linux.js',
            'app/js/mac.js',
            'app/js/windows.js',
            'app/js/view.js',
            'tests/spec/*.spec.js',
            {pattern: 'app/*.html', watched: true, included: false, served: true}
        ],

        preprocessors: {
            'app/js/*.js': ['coverage']
        },

        frameworks: ['jasmine'],

        browsers: ['NodeWebkit']
    })
};
