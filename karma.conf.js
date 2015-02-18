var babelify = require("babelify");

module.exports = function(karma) {
    karma.set({
        frameworks: ['mocha', 'browserify'],
        basePath: '.',
        files:  ['*Test.js'],
        preprocessors: {
            '*Test.js': [ 'browserify' ]
        },

        browserify: {
            transform: [ babelify ]
        },
        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: karma.LOG_INFO,
        autoWatch: false,
        browsers: ['PhantomJS'],
        singleRun: true,
        plugins : ['karma-*']
    });
};
