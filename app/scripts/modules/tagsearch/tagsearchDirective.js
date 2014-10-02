angular.module('angular-nsv-tagsearch')
	.directive('tagsearch', function () {
		return {
			restrict : 'EA',
			templateUrl : 'views/tagsearchView.html',
      scope : {
        allTags : '='
      },
			controller : function () {
				var thisCtrl = this;
				thisCtrl.tagList = [];
				thisCtrl.removeTag = function (i, evt) {
					evt.stopPropagation();
					return thisCtrl.tagList.splice(i,1);
				};
				thisCtrl.removeLast = function () {
					return thisCtrl.tagList.pop();
				};
				thisCtrl.addTag = function (tagStr) {
					tagStr = (''+tagStr)
								.replace(/^#/,'')
								.replace(/ /, '');
					if (tagStr.length > 0) {
						if (thisCtrl.tagList.indexOf(tagStr) === -1) {
							thisCtrl.tagList.push(tagStr);
						}
					}
					return thisCtrl.tagList;
				};
			},
			link : function ($scope, $element, $attrs, ctrl) {
				$scope.tagList = ctrl.tagList;
				$scope.removeTag = ctrl.removeTag;
			}
		};
	});
