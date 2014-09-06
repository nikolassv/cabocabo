module.exports = function (grunt) {
  grunt.initConfig({
    concat : {
      dist : {
        files : {
          'dist/styles.css': ['app/styles/reset.css', 'app/styles/main.css'],
          'dist/lib.js' : ['lib/angular/angular.min.js'],
          'dist/app.js' : [
            'app/scripts/cards/cardsModule.js',
            'app/scripts/cards/cardModel.js',
            'app/scripts/cards/cardsService.js',

            'app/scripts/main.js',
            'app/scripts/mainController.js'
          ]
        }
      }
   },

    copy : {
      dist : {
        files : [
          {src: ['app/index.html'], dest: 'dist/index.html'},
          {src: ['app/views'], dest: 'dist/views'}
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['concat', 'copy']);
};
