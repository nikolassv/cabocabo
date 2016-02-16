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
    clean: {
      dev: {
        src: ['dist/*', '!dist/.git']
      }
    },

    jshint: {
      dev: {
        src: 'app/scripts/**/*.js'
      }
    },

    jscs: {
      src: 'app/scripts/**/*.js',
      options: {
        config: '.jscsrc'
      }
    },

    concat: {
      dev: {
        files: {
          'dist/styles.css': [
            'lib/pure/base.css',
            'lib/pure/base-context.css',
            'lib/pure/grids.css',
            'lib/pure/grids-responsive.css',
            //'app/styles/reset.css',
            'app/styles/main.css',
            'app/styles/tagsearch.css'
          ],
          'dist/lib.js': [
            'lib/lodash/lodash.js',
            'lib/jquery/dist/jquery.js',

            'lib/angular/angular.js',
            'lib/angular-route/angular-route.js',

            'lib/angular-textarea-fit/angular-textarea-fit.js',
            'lib/angular-local-storage/angular-local-storage.js',
            'lib/angular-nsv-stringformat/stringformat.js'
          ],
          'dist/app.js': [
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

    cssmin: {
      prod: {
        files: {
          'dist/styles.css': 'dist/styles.css'
        }
      }
    },

    uglify: {
      prod: {
        files: {
          'dist/lib.js': 'dist/lib.js',
          'dist/app.js': 'dist/app.js'
        }
      }
    },

    copy: {
      dev: {
        files: [
          {src: ['app/index.html'], dest: 'dist/index.html'},
          {expand: true, cwd: 'app/scripts', src: ['**/*.html'], dest: 'dist/views/'},
          {expand: true, cwd: 'app/img/', src: ['*'], dest: 'dist/img/'}
        ]
      }
    },

    htmlmin: {
      prod: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [
          {expand: true, cwd: 'dist/views', src: ['**/*.html'], dest: 'dist/views/'}
        ]
      }
    },

    svgstore: {
      options: {
        prefix: 'icon-',
      },
      dev: {
        files: {
          'dist/img/svg-icons.svg': ['app/img/*.svg']
        }
      }
    },

    serve: {
      options: {
        port: 9090,
        serve: {
          path: 'dist/'
        }
      }
    },

    buildcontrol: {
      options: {
        dir: 'dist',
        commit: true,
        push: true,
        message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
      },
      pages: {
        options: {
          remote: 'https://github.com/nikolassv/cabocabo',
          branch: 'gh-pages'
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
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-build-control');

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

  grunt.registerTask('prod', [
    'build',
    'cssmin:prod',
    'uglify:prod',
    'htmlmin:prod'
  ]);
};
