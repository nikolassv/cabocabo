angular.module('angular-nsv-tagsearch')
	.directive('tagsearch', function () {
		return {
			restrict : 'EA',
			templateUrl : 'views/tagsearchView.html',
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
