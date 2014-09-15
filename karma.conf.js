module.exports = function (config) {
    config.set({
        basePath: '.',

        files: [
            'bower_components/jquery/dist/jquery.js',
            'app/js/helpers.js',
            'app/js/linux.js',
            'app/js/view.js',
            'tests/*.spec.js',
            {pattern: 'app/*.html', watched: true, included: false, served: true}
        ],

        preprocessors: {
            'app/js/*.js': ['coverage']
        },

        frameworks: ['jasmine'],

        browsers: ['NodeWebkit']
    })
};
