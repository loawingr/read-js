module.exports = function(config) {

    var cwd =  process.cwd();

    config.set({
    
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: "",
    
    
        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ["jasmine"],
    
    
        // list of files / patterns to load in the browser
        files: [
          cwd+"/src/js/read.js", //read JS library
          cwd+"/node_modules/jquery/dist/jquery.min.js", //jQuery is used to insert html snippets into DOM for automated tests
          cwd+"/test/html/*.html", //pattern for including html snippet files
          cwd+"/test/js/*.js" //test cases
        ],
    
    
        // list of files to exclude
        exclude: [
          "no"
        ],
    
    
        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
          "../html/*.html": ["html2js"],
          "../../src/js/**/*.js": ["coverage"]
        },
    
    
        // test results reporter to use
        // possible values: "dots", "progress"
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ["progress", "coverage", "junit"],
    
        // the default configuration
        junitReporter: {
            outputDir: cwd+"/test/karma/",
            outputFile: "coverage.xml",
            suite: ""
        },


        coverageReporter: {
            dir : "../../build/coverage",
            reporters: [
                { type: "html", subdir: "html" }
            ]
        },


        // web server port
        port: 9876,
    
    
        // enable / disable colors in the output (reporters and logs)
        colors: true,
    
    
        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,
    
    
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,
    
        
        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        //browsers: ["Safari", "Firefox", "Chrome", "PhantomJS"],
        browsers: ["PhantomJS"],
    
    
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    })
};