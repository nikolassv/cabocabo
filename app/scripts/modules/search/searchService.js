/* global SearchService */
/**
 * The MIT License
 *
 * Copyright (c) 2015 Nikolas Schmidt-Voigt, http://nikolassv.de
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
 angular.module('search').service('search.SearchService', [
  'search.TagService',
  function (TagService) {
    /**
     * local reference to this service
     */
    var thisService = this;

    var reversedIndex = {};

    /**
     * save the tags for a given text
     *
     * @param {number} id the ids to be associated with the tags
     * @param {string} text the text to extract the tags from
     * @return {SearchService}
     */
    this.indexText = function (id, text) {
      angular.forEach(TagService.extractTagsFromText(text), function (tag) {
        if (_.has(reversedIndex, tag) && angular.isArray(reversedIndex[tag])) {
          if (!_.includes(reversedIndex[tag], id)) {
            reversedIndex[tag].push(id);
          }
        } else {
          reversedIndex[tag] = [id];
        }
      });

      return this;
    };

    /**
     * get the ids for a given tag from the index
     *
     * @param {string} tag
     * @return {Array.<number>}
     */
    this.getIdsForTag = function (tag) {
      return angular.isArray(reversedIndex[tag]) ? reversedIndex[tag] : [];
    };

    /**
     * get the ids that match all of the tags in the array
     *
     * @param {Array.<string>} tags
     * @return {Array.<number>}
     */
    this.getIdsForTags = function (tags) {
      var ids = null;

      angular.forEach(tags, function (tag) {
        tag = tag.toLowerCase();

        if (angular.isArray(ids)) {
          ids = _.intersection(ids, thisService.getIdsForTag(tag));
        } else {
          ids = thisService.getIdsForTag(tag);
        }
      });

      return ids;
    };

    /**
     * return all existing tags
     *
     * @return {Array.<string>}
     */
    this.getAllTags = function () {
      return _.keys(reversedIndex);
    };
  }
]);
