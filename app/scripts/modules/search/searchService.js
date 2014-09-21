angular.module('search').service('search.SearchService', [
 'angular-nsv-tagmanager.TagIndex', 'angular-nsv-tagmanager.Set',
 function (Tagmanager, Set) {
  var tagRegEx = /#[a-z]+/gi;

  /**
   * extract tags from a text
   *
   * @param {string} text
   * @return {Set}
   */
  this.extractTagsFromText = function (text) {
    var rawTags = text.match(tagRegEx),
        tags = new Set();
    angular.forEach(rawTags, function(rT) {
      tags.insert(rT.slice(1));
    });
    return tags;
  };
 }
]);
