angular.module('search').service('search.SearchService', [
 'angular-nsv-tagmanager.TagIndex', 'angular-nsv-tagmanager.Set', 'search.TagService',
 function (Tagmanager, Set, TagService) {
  /**
   * the index for all the texts
   * @type {angular-nsv-tagmanager.TagIndex}
   */
  var tagIndex = new Tagmanager();

  /**
   * save the tags for a given text
   *
   * @param {number}
   * @param {string}
   * @return {SearchService}
   */
  this.indexText = function (id, text) {
    var tags = TagService.extractTagsFromText(text);
    tagIndex.setTagsForItem(id, tags); 
    return this;
  };

  /**
   * get the ids for a given item from the index
   *
   * @param {string}
   * @return {Array.<number>}
   */
  this.getIdsForTag = function (tag) {
    return tagIndex.getItemsForTag(tag).toArray();
  };
 }
]);
