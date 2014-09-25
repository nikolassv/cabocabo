angular.module('search').filter('tags', [
  'search.TagService',
  function (TagService) {
    return function ($input) {
      return $input.replace(TagService.tagRegEx, '<span class="tag" data-tag="$&">$&</a>'); 
    };
  }
]);
