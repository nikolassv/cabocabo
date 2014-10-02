module.exports = function (grunt) {
  grunt.initConfig({
    clean : {
      dist : ['dist/']
    },
    jshint : {
      dist : {
        src : ['app/scripts/**/*.js']
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
            'lib/jquery/dist/jquery.min.js',
            'lib/angular/angular.min.js',
            'lib/angular-textarea-fit/angular-textarea-fit.js',
            'lib/angular-local-storage/angular-local-storage.min.js',
            'lib/angular-nsv-stringformat/stringformat.js',
            'lib/angular-nsv-tagmanager/tagmanager.js'
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
            
            'app/scripts/modules/**/*.js',   // module assets
            'app/scripts/main.js',        // application module definition
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
          {expand: true, cwd: 'app/views/', src: ['*'], dest: 'dist/views/'}
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', [
    'clean',
    'jshint',
    'concat', 
    'copy'
  ]);
};
