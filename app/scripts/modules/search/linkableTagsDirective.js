angular.module('search').directive('linkableTags', [
  '$filter', '$parse', 'search.TagService',
  function ($filter, $parse, TagService) {
    var tagFilter = $filter('tags');
    return {
      link : function ($scope, $element, $attr) {
        $element.on('click', function (evt) {
          var $target = angular.element(evt.target);
          if ($target.is('[data-tag]')) {
            evt.stopPropagation();
            $parse($attr.onTagClick)($scope.$parent)($target.data('tag'));
          }
        });
      }
    };
  }
]);
