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
      scope : true,
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
				
				/**
				 * react to click on parent
				 */
				$element.parents('tagsearch,[tagsearch],[data-tagsearch]').on('click', function () {
					$element.focus();
				});

        /**
         * add focus class to tagsearch element
         */
        $element.on('focus', function () {
          TagSearchCtrl.setFocus();
          KscCtrl.reset();
          $scope.$apply();
        });

        /**
         * remove focus class on blur
         */
        $element.on('blur', function () {
          TagSearchCtrl.removeFocus();
          $scope.$apply();
        });
				
				/**
				 * react to changes in the search text
				 */
				$scope.$watch('searchText', function (searchtext) {
          setEqualWidth();
          KscCtrl.setSearchText(searchtext);
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
              } 

              TagSearchCtrl.addTag($scope.searchText);
              $scope.searchText = '';
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

        /**
         * check whether the searchtext contains a tag and add it to the list
         */
        $scope.checkInput = function () {
					// add the current search text as a new tag, if it ends with whitespace
					var parts = $scope.searchText.match(/(.*)\s$/);
					if (angular.isArray(parts)) {
						TagSearchCtrl.addTag(parts[1]);
            $scope.searchText = '';
					}
        };

        /**
         * erase the search text when an tag has been added to the list
         */
        $scope.$on('taglist-changed-add', function () {
          $scope.searchText = '';
        });
			}
		};
	});
