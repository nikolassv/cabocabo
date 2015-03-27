angular.module('angular-nsv-tagsearch')
  .directive('keyselectContainer', ['$parse', '$filter', function ($parse, $filter) {

    return {
      controller : ['$scope', '$element', function ($scope, $element) {

        var selectedIndex = -1;
        var listSource = function () {return [];};
        var searchText = '';


        /**
         * resets the suggestion list
         *
         * @return {object} this
         */
        this.reset = function () {
          selectedIndex = -1;
          return this;
        };

        /**
         * returns the currently selected index
         *
         * @return {number}
         */
        this.getSelectedIndex = function () {
          return selectedIndex;
        };

        /**
         * increments the selected index
         *
         * @return {object} this
         */
        this.incSelectedIndex = function () {
          selectedIndex++;
          if (selectedIndex >= listSource().length) {
            selectedIndex = -1;
          }
          return this;
        };

        /**
         * decrements the selected index
         *
         * @return {object} this
         */
        this.decSelectedIndex = function () {
          selectedIndex--;
          if (selectedIndex < -1) {
            selectedIndex = listSource().length - 1;
          }
          return this;
        };
        
        /**
         * returns the current suggestion
         *
         * @return {string}
         */
        this.getSelection = function () {
          return (selectedIndex > -1) ? listSource()[selectedIndex] : null;
        };

        /**
         * registers a function as a list getter
         *
         * the function is supposed to return the current list of suggestions
         *
         * @param {function} listGetter
         */
        this.registerListGetter = function (listGetter) {
          listSource = listGetter;
        };

        this.setSearchText = function (newSearchText) {
          searchText = newSearchText;
          return this;
        };
        
        this.getSearchText = function () {
          return searchText;
        };

      }]
    };
  }]);
