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
 /**
 * service: tagService
 * 
 * a service to handle tags
 */
angular.module('search').service('search.TagService', [
  function () {

    /**
     * regex to recognize tags in a text
     * @type {RegExp}
     */
    this.tagRegEx = /\B#[a-z\u00E4\u00F6\u00FC\u00DF\u00E9\u00E8]+/gi;

    /**
     * extract tags from a text
     *
     * @param {string} text
     * @return {array.<string>}
     */
    this.extractTagsFromText = function (text) {
      var rawTags = text.match(this.tagRegEx);
      var tags = [];

      angular.forEach(rawTags, function(rT) {
        rT = rT.slice(1).toLowerCase();
        if (!_.includes(tags, rT)) {
          tags.push(rT);
        }
      });
      
      return tags;
    };
  }
]);
