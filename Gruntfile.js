module.exports = function(grunt) {
    "use strict";
    var statsBanner = "/* readJS  <%= pkg.version %> */\n",
        deployment = {
            src_folder: "./src/",
            build_folder: "./build/"
        };
    var config = {
        options: {},
        deployment: deployment,
        pkg: grunt.file.readJSON("package.json"),
        babel: {
            options: {
                sourceMap: false,
                presets: ["env"],
                compact: false
            },
            dist: {
                files: [
                    { expand: true, flatten: false, src: ["./src/js/config.js"], dest: "./build/" },
                    { expand: true, flatten: true, src: ["./src/js/read.js"], dest: "./build/" },
                    { expand: true, flatten: true, src: ["./src/js/spa-demo.js"], dest: "./build/" }
                ]
            }
        },
        copy: {
            build: {
                files: [{
                    expand: true,
                    cwd: deployment.src_folder,
                    src: ["**/**.html", "./test/cbc-styles.css"],
                    dest: deployment.build_folder,
                },]
            }
        },
        uglify: {
            options: {
                banner: statsBanner
            },
            dist: {
                files: {
                    "build/js/read.js": ["build/read.js", "build/config.js"],
                    "build/js/spa-demo.js": ["./src/spa-demo.js"]
                }
            }
        },
        eslint: {
            options: {
                configFile: "eslint.json",

            },
            target: ["Gruntfile.js", "./src/js/config.js", "./src/js/read.js", "./src/js/spa-demo.js"]
        },
        karma: {
            spa: {
                configFile: "test/conf/spa.conf.js"
            },
            read: {
                configFile: "test/conf/read.conf.js"
            },
            readscanned: {
                configFile: "test/conf/read-scanned.conf.js"
            },
            coverage: {
                configFile: "test/conf/coverage.conf.js"
            }
        }
    };

    grunt.initConfig(config);

    grunt.loadNpmTasks("grunt-eslint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-karma");
    grunt.loadNpmTasks("grunt-babel");

    grunt.registerTask("default", ["build", "test"]);
    grunt.registerTask("build", ["eslint", "babel", "uglify", "copy:build"]);
    grunt.registerTask("test", ["karma"]);

};