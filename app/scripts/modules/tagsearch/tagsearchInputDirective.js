angular.module('angular-nsv-tagsearch')
	.directive('tagsearchInput', function () {
		var widthDefiningStyles = [ 'font-size', 'font-family', 'margin', 'padding', 'min-width' ],
			copyCssStyles = function (elSrc, elDest) {
				var destStyles = {};
				angular.forEach(widthDefiningStyles, function (style) {
				  destStyles[style] = elSrc.css(style); 
				});
				elDest.css(destStyles); 
			};
		
		return {
			restrict : 'EA',
			require : ['^tagsearch', '^keyselectContainer'],
			link : function ($scope, $element, $attrs, Ctrls) {
        var // a clone of the current element as div
            elClone = angular.element('<div>'),

            /**
             * set the width of the input field to the with of its containing text
             *
             * will set the containing text as text of the clone and set the width
             * of the input field to the width of the clone
             */
            setEqualWidth = function () {
              copyCssStyles($element, elClone);
              elClone.text($scope.searchText);
              $element.width(elClone.width()+3);
            },
				
          TagSearchCtrl = Ctrls[0],
          KscCtrl = Ctrls[1];

				elClone.hide().appendTo($element.parent());
        
				$scope.searchText = '';
        KscCtrl.setFilterText($scope.searchText);
				
				/**
				 * react to click on parent
				 */
				$element.parents('tagsearch,[tagsearch],[data-tagsearch]').on('click', function () {
					$element.focus();
				});
				
				/**
				 * react to changes in the search text
				 */
				$scope.$watch('searchText', function () {
					// add the current search text as a new tag, if it ends with whitespace
					var parts = $scope.searchText.match(/(.*)\s$/);
					if (angular.isArray(parts)) {
						TagSearchCtrl.addTag(parts[1]);
						$scope.searchText = '';
					}
					setEqualWidth();

          // propagate changes in search text to KscCtrl
          KscCtrl.setFilterText($scope.searchText);
				});
				
				/**
				 * react on keypress
				 */
				$element.on('keydown', function (evt) {
					switch (evt.which) {
            case 40: // cursor down: select next suggestion
              KscCtrl.incSelectedIndex();
              $scope.$apply();
              break;
            case 38: // cursor up: select previous suggestion
              KscCtrl.decSelectedIndex();
              $scope.$apply();
              break;
						case 13: // return: add current search string as tag
              if (KscCtrl.getSelectedIndex() > -1) {
                $scope.searchText = KscCtrl.getSelection();
                KscCtrl
                  .reset();
              } else {
                TagSearchCtrl.addTag($scope.searchText);
                $scope.searchText = '';
              }
							$scope.$apply();
							break;
						case 8: // backspace: remove last tag
							if ($scope.searchText.length === 0) {
								$scope.searchText = TagSearchCtrl.removeLast();
								$scope.$apply();
							}
							break;
						// do nothing on default
					} 
				});
			}
		};
	}).directive('keyselectContainer', ['$parse', '$filter', function ($parse, $filter) {
    return {
      scope : {
        items : '=' 
      },
      controller : ['$scope', '$element', function ($scope, $element) {
        var selectedIndex = -1,
            filterText = '',
            suggestions = [];

        this.reset = function () {
          selectedIndex = -1;
          return this;
        };

        this.setFilterText = function (newFilterText) {
          if (filterText !== newFilterText) {
            filterText = newFilterText;
            this.updateSuggestions();
          } 
          return this;
        };

        this.updateSuggestions = function () {
          var l = suggestions.length;
          suggestions = $filter('filter')($scope.items, filterText);
          if ((suggestions.length !== l) && (selectedIndex >= suggestions.length)) {
            selectedIndex = suggestionNumber - 1;
          }
        };

        this.getSuggestions = function () {
          return suggestions;
        };

        this.getSelectedIndex = function () {
          return selectedIndex;
        };

        this.incSelectedIndex = function () {
          selectedIndex++;
          if (selectedIndex >= suggestions.length) {
            selectedIndex = -1;
          }
          return this;
        };

        this.decSelectedIndex = function () {
          selectedIndex--;
          if (selectedIndex < -1) {
            selectedIndex = suggestions.length - 1;
          }
          return this;
        };
        
        this.getSelection = function () {
          return (selectedIndex > -1) ? suggestions[selectedIndex] : null;
        };

      }]
    };
  }])
  .directive('suggestionList', function() {
    return {
      require : '^keyselectContainer',
      templateUrl : 'views/suggestionListView.html',
      replace : true,
			link : function ($scope, $element, $attrs, KscCtrl) {

				$scope.selectedIndex = KscCtrl.getSelectedIndex();
        $scope.$watch(function () {
          return KscCtrl.getSelectedIndex();
        }, function () {
          $scope.selectedIndex = KscCtrl.getSelectedIndex();
        }); 
				
        KscCtrl.updateSuggestions();
        $scope.suggestionList = KscCtrl.getSuggestions();
        $scope.$watch(function () {
          return KscCtrl.getSuggestions();
        }, function () {
          $scope.suggestionList = KscCtrl.getSuggestions();
        });

			}
		};
	});

