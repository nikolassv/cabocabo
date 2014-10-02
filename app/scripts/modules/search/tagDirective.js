angular.module('search')
  .directive('containsTags', ['$filter', function ($filter) {
    var tagFilter = $filter('tags');
    return {
      require : '^linkableTags',
      link : function ($scope, $element, $attrs, $LnTagsCtrl) {
        var addTags = function () {
          $element.html(tagFilter($element.text()));
          $element.find('tag').on('click', function (evt) {
            $LnTagsCtrl.onClick($(this).data('tag'));
            evt.stopPropagation();
            evt.preventDefault();
            $scope.$apply();
          });
        };
        var deregistrationFn = $scope.$watch(function () {
          return $element.text();
        }, function () {
          addTags();
        });
        $scope.$on('$destroy', deregistrationFn);
      }
    };
  }]);
