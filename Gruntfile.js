/**
 * The MIT License
 *
 * Copyright (c) 2015 Nikolas Schmidt-Voigt, http://nikolassv.de
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
module.exports = function (grunt) {
  grunt.initConfig({
    clean : {
      dist : 'dist/'
    },

    jshint : {
      dist : {
        src : 'app/scripts/**/*.js'
      }
    },

    jscs: {
      src: 'app/scripts/**/*.js',
      options: {
        config: '.jscsrc'
      }
    },

    concat : {
      dist : {
        files : {
          'dist/styles.css': [
            'app/styles/reset.css',
            'app/styles/main.css',
            'app/styles/tagsearch.css'
          ],
          'dist/lib.js' : [
            'lib/jquery/dist/jquery.js',
            'lib/angular/angular.js',
            'lib/angular-route/angular-route.js',
            'lib/lodash/lodash.js',
            'lib/angular-textarea-fit/angular-textarea-fit.js',
            'lib/angular-local-storage/angular-local-storage.js',
            'lib/angular-nsv-stringformat/stringformat.js'
          ],
          'dist/app.js' : [
            /**
             * module definitions
             *
             * to solve dependencies between modules correctly their order is
             * given explicitly
             */
            'app/scripts/modules/searchModule.js',
            'app/scripts/modules/cardsModule.js',
            'app/scripts/modules/tagsearchModule.js',
            
            'app/scripts/modules/**/*.js', // module assets
            'app/scripts/main.js', // application module definition
            'app/scripts/routes.js',
            'app/scripts/controller/**/*.js', // controller
            '!app/scripts/**/tests/*.js' // do not include tests
          ]
        }
      }
   },

    copy : {
      dist : {
        files : [
          {src: ['app/index.html'], dest: 'dist/index.html'},
          {expand: true, cwd: 'app/scripts', src: ['**/*.html'], dest: 'dist/views/'},
          {expand: true, cwd: 'app/img/', src: ['*'], dest: 'dist/img/'}
        ]
      }
    },

    svgstore : {
      options : {
        prefix : 'icon-',
      },
      dist : {
        files : {
          'dist/img/svg-icons.svg': ['app/img/*.svg'] 
        } 
      }
    },
    
    serve : {
      options: {
        port: 9090,
        serve: {
          path: 'dist/'
        }
      }
    }  
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-svgstore');
  grunt.loadNpmTasks('grunt-serve');
  grunt.loadNpmTasks('grunt-jscs');

  grunt.registerTask('build', [
    'clean',
    'jscs',
    'jshint',
    'concat', 
    'copy',
    'svgstore'
  ]);
  
  grunt.registerTask('default', [
  'build',
  'serve'
]);
};
