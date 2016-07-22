module.exports = function(grunt) {
     "use strict";
  var statsBanner = "/* readJS  <%= pkg.version %> */\n",
       hint_opts = {
        bitwise : true,
        camelcase : false,
        curly : true,
        eqeqeq : true,
        es3 : false,
        forin : true,
        globals : { 
          "document" : true,
          "console" : true,
          "alert" : true,
          "window" : true,
          "escape" : true,
          "unescape" : true,
          "module" : true,
          "readJS" : true,
          "readJSConfig" : true
        },
        immed : false,
        indent : 4,
        latedef : true,
        maxdepth : 5,
        maxparams : 4,
        newcap : true,
        noarg : true,
        noempty : true,
        nonew : true,
        plusplus : false,
        quotmark : true,
        strict : true,
        trailing : true,
        undef : true,
        unused : false
    };
  var deployment = {
    src_folder: "./src/",
    build_folder:"./build/"
  };
  var config = {
    options: {},
    deployment: deployment,
    pkg: grunt.file.readJSON("package.json"),
   
    copy:{
      build:{
          files: [
              { expand: true, 
                cwd: deployment.src_folder,
                src: ["**/**.html"],
                dest: deployment.build_folder, 
              }
          ]
      }
    },
    uglify: {
      options: {
        banner: statsBanner
      },
      dist: {
        files: {
          "build/js/read.js": ["./src/js/config.js", "./src/js/read.js"]
        }
      }
    },
    jshint: {
      files: ["Gruntfile.js", "./src/js/config.js", "./src/js/read.js"],
      options: hint_opts
    }
  };

  grunt.initConfig(config);

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-copy");

  grunt.registerTask("default", ["jshint", "uglify", "copy:build" ]);
    
};

