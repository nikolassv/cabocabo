angular.module('search').filter('tags', [
  'search.TagService',
  function (TagService) {
    return function ($input) {
      return $input.replace(TagService.tagRegEx, '<tag class="tag" data-tag="$&">$&</tag>'); 
    };
  }
]);
