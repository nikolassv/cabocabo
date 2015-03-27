angular.module('search').service('search.SearchService', [
 'angular-nsv-tagmanager.TagIndex', 'angular-nsv-tagmanager.Set', 'search.TagService',
 function (Tagmanager, Set, TagService) {
  /**
   * local reference to this service
   */
  var thisService = this;

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
   * get the ids for a given tag from the index
   *
   * @param {string}
   * @return {Array.<number>}
   */
  this.getIdsForTag = function (tag) {
    tag = tag.toLowerCase();
    return tagIndex.getItemsForTag(tag).toArray();
  };

  /**
   * get the ids that match all of the tags in the array
   */
  this.getIdsForTags = function (tags) {
    var ids;
    angular.forEach(tags, function (tag) {
      tag = tag.toLowerCase();
      if (ids instanceof Set) {
        ids = ids.intersect(thisService.getIdsForTag(tag));
      } else {
        ids = thisService.getIdsForTag(tag);
      }
    });
    return ids;
  };

  /**
   * return all existing tags
   */
  this.getAllTags = function () {
    return tagIndex.getAllTags();
  };
 }
]);
