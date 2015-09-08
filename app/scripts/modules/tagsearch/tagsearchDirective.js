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
 /**
 * directive: tagsearch
 *
 * a directive that shows a text input for tags. It takes three parameters:

 * @param {array.<string>} allTags a list of all tags that are currently used in the system. the user may
 *    enter other tags too, but the tags in the allTags parameter are shown in a
 *    suggest box under the input field.
 * @param {array.<string>} selectedTags a list of all the tags currently selected by the user.
 * @param {function} onTagListChange function that will be invoked whenever the list
 *    of selected tags change.
 */
angular.module('angular-nsv-tagsearch')
	.directive('tagsearch', function () {
		return {
			restrict : 'EA',
			templateUrl : 'views/modules/tagsearch/tagsearchView.html',
      scope : {
        allTags : '=',
        selectedTags : '=',
        onTaglistChange : '&'
      },
			controller : ['$scope', function ($scope) {
				var thisCtrl = this;
				$scope.selectedTags = [];

        /**
         * whether the tag list has the focus
         */
        $scope.hasFocus = false;

        /**
         * removes a tag inside the last and return its label
         *
         * @param {number} i index of the tag in the list
         * @param {event} evt
         */
				thisCtrl.removeTag = function (i, evt) {
					evt.stopPropagation();
					var removedTag = $scope.selectedTags.splice(i,1);
          $scope.$broadcast('taglist-changed-remove');
          $scope.onTaglistChange();
          return removedTag;
				};

        /**
         * removes the last tag and returns its label
         */
				thisCtrl.removeLast = function () {
					var removedTag = $scope.selectedTags.pop();
          $scope.$broadcast('taglist-changed-remove');
          $scope.onTaglistChange();
          return removedTag;
				};

        /**
         * add a tag to the list and return its label
         *
         * @param {string} tagStr
         */
				thisCtrl.addTag = function (tagStr) {
					tagStr = (''+tagStr)
								.replace(/^#/,'')
								.replace(/ /, '');
					if (tagStr.length > 0) {
						if ($scope.selectedTags.indexOf(tagStr) === -1) {
							$scope.selectedTags.push(tagStr);
						}
					}
          $scope.$broadcast('taglist-changed-add');
          $scope.onTaglistChange();
					return $scope.selectedTags;
				};

        /**
         * set focus
         */
        thisCtrl.setFocus = function () {
          $scope.hasFocus = true;
        };

        /**
         * remove focus
         */
        thisCtrl.removeFocus = function () {
          $scope.hasFocus = false;
        };
			}],
      
			link : function ($scope, $element, $attrs, ctrl) {
				$scope.removeTag = ctrl.removeTag;
        $scope.addTag = ctrl.addTag;
        $scope.checkInput = ctrl.checkInput;
			}

		};
	});
