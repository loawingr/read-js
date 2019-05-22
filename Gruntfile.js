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
                presets: ["@babel/preset-env"],
                compact: false
            },
            dist: {
                files: [
                    { expand: true, flatten: true, src: ["./src/js/config.js"], dest: "./build/js/" },
                    { expand: true, flatten: true, src: ["./src/js/read.js"], dest: "./build/js/" },
                    { expand: true, flatten: true, src: ["./src/js/spa-demo.js"], dest: "./build/js/" },
                    { expand: true, flatten: true, src: ["./src/test/cbc/cbc-stats.js"], dest: "./build/test/cbc/" }
                ]
            }
        },
        copy: {
            build: {
                files: [{
                    expand: true,
                    cwd: deployment.src_folder,
                    src: ["**/**.html", "./test/cbc/*.css", "./test/cbc/amplitude-loader.js"],
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
                    "build/js/read.js": ["build/js/config.js", "build/js/read.js"],
                    "build/js/spa-demo.js": ["./build/js/spa-demo.js"]
                }
            }
        },
        eslint: {
            options: {
                configFile: "eslint.json",

            },
            target: ["Gruntfile.js", "./src/js/config.js", "./src/js/read.js", "./src/js/spa-demo.js", "./src/test/cbc/cbc-stats.js"]
        },
        run: {
            tests:{
                cmd:"npm",
                args:["test"]
            }
        },
        clean:{
            build:["./build"]
        }
    };

    grunt.initConfig(config);
    grunt.loadNpmTasks("grunt-babel");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-eslint");
    grunt.loadNpmTasks("grunt-run");

    grunt.registerTask("default", ["clean","eslint", "babel", "copy:build", "run:tests"]);
    grunt.registerTask("distribute", ["uglify"]);

};