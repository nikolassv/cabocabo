angular.module('search').directive('linkableTags', [
  '$filter', '$parse', 'search.TagService',
  function ($filter, $parse, TagService) {
    var tagFilter = $filter('tags');
    return {
      controller : function ($scope, $element, $attrs) {
        this.onClick = function (tag) {
            $parse($attrs.onTagClick)($scope.$parent, {'tag':tag});
        };
      }
    };
  }
]);
