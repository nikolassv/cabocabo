angular.module('search').service('search.TagService', [
  'angular-nsv-tagmanager.Set',
  function (Set) {

    /**
     * regex to recognize tags in a text
     * @type {RegExp}
     */
    this.tagRegEx = /\B#[a-z\u00E4\u00F6\u00FC\u00DF\u00E9\u00E8]+/gi;

    /**
     * extract tags from a text
     *
     * @param {string} text
     * @return {Set}
     */
    this.extractTagsFromText = function (text) {
      var rawTags = text.match(this.tagRegEx),
          tags = new Set();
      angular.forEach(rawTags, function(rT) {
        tags.insert(rT.slice(1).toLowerCase());
      });
      return tags;
    };
  }
]);
