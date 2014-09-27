angular.module('search').directive('linkableTags', [
  '$filter', '$parse', 'search.TagService',
  function ($filter, $parse, TagService) {
    var tagFilter = $filter('tags');
    return {
      link : function ($scope, $element, $attr) {
        $element.find('[data-tag]').on('click', function (evt) {
            evt.stopPropagation();
            $parse($attr.onTagClick)({'tag':this.data('tag')});
        });
      }
    };
  }
]);
