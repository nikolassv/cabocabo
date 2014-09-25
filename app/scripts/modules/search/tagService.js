angular.module('search').service('search.TagService', function () {

  /**
   * regex to recognize tags in a text
   * @type {RegExp}
   */
  this.tagRegEx = /#[a-z]+/gi;

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
});
