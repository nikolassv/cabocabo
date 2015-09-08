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
 angular.module('angular-nsv-tagsearch')
  .directive('suggestionList', ['$filter', function($filter) {
    var filterFilter = $filter('filter');

    return {
      require : ['^tagsearch', '^keyselectContainer'],
      templateUrl : 'views/suggestionListView.html',
      scope : {
        items : '=',
        blacklist : '='
      },
			link : function ($scope, $element, $attrs, Ctrls) {
        var TagsrchCtrl = Ctrls[0],
            KscCtrl = Ctrls[1];

        $scope.suggestions = [];

        KscCtrl.registerListGetter(function () {
          return $scope.suggestions;
        });

        /**
         * updates the list of suggestions for the user
         *
         * @return {array.<string>} the current suggestions
         */
        var updateSuggestions = function (filterText) {
          var l = $scope.suggestions.length;
          $scope.suggestions = filterFilter($scope.items, filterText);
          if (($scope.suggestions.length !== l) && ($scope.selectedIndex >= $scope.suggestions.length)) {
            $scope.selectedIndex = $scope.suggestions.length - 1;
          }
          if (angular.isArray($scope.blacklist)) {
            $scope.suggestions = $scope.suggestions.filter(function (suggestion) {
              return $scope.blacklist.indexOf(suggestion) === -1;
            });
          }
          return $scope.suggestions;
        };

        /**
         * update suggestions whenever the filter text change
         */
        $scope.$watch(function () {
          return KscCtrl.getSearchText();
        }, updateSuggestions);

        /**
         * update suggestions whenever the blacklisted items change
         */
        $scope.$watchCollection('blacklist', updateSuggestions);


        /**
         * get the selected index from the keyselect controller
         */
				$scope.selectedIndex = KscCtrl.getSelectedIndex();

        /**
         * update the selected index whenever the index in the keyselect controller changes
         */
        $scope.$watch(function () {
          return KscCtrl.getSelectedIndex();
        }, function (selectedIndex) {
          $scope.selectedIndex = selectedIndex;
        }); 
				
        /**
         * selects a tag for the list
         *
         * @param {string} the tag
         * @param {event} the event that triggered the selection
         */
        $scope.selectTag = function (tag, evt) {
          evt.stopPropagation();
          evt.preventDefault();
          TagsrchCtrl.addTag(tag);
          KscCtrl.reset();
        };
			}
		};
	}]);
