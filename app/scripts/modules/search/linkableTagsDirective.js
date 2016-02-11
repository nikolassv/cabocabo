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
 * directive: linkable tags
 *
 * this directive adds a controller to an element that provides an onClick method
 * only. It is intended to be uses with the `containsTags` directive. The
 * `containsTags` directive marks tags in an elements html and invokes this
 * controllers `onClick` method whenever one of the tags is clicked.
 */
angular.module('search').directive('linkableTags', [
  '$filter', '$parse', 'search.TagService',
  function ($filter, $parse, TagService) {
    var tagFilter = $filter('tags');
    return {
      controller: function ($scope, $element, $attrs) {
        this.onClick = function (tag) {
          $parse($attrs.onTagClick)($scope.$parent, { tag:tag });
        };
      },
    };
  },
]);
