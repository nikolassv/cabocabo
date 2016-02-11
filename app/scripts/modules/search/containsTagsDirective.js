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
 * directive: containsTags
 *
 * this directive finds tags in an elements inner html. It marks them and adds an
 * event handler on each tags.
 *
 * this directive requires an linkableTags controller on any parent element. if any
 * of the tags in the current element is clicked, it invokes the linkableTags
 * controllers `onClick` method
 */
angular.module('search')
  .directive('containsTags', ['$filter', function ($filter) {
    var tagFilter = $filter('tags');
    return {
      require: '^linkableTags',
      link: function ($scope, $element, $attrs, $LnTagsCtrl) {
        /**
         * the inner html of the element to prevent duplicate handling of tags
         */
        var lastSeenHtml = '';

        /**
         * marks all the tags in the elements html a
         */
        var addTags = function () {
          $element.html(tagFilter($element.html()));

          $element.find('tag').on('click', function (evt) {
            $LnTagsCtrl.onClick($(this).data('tag'));
            $scope.$apply();
            return false; // stop propagation and prevent default
          });

          lastSeenHtml = $element.html();
        };

        /**
         * listen to changes in the elements html
         */
        $scope.$watch(function () {
          return $element.html();
        }, function (currentHtml) {
          /**
           * add tags only if the html has changed since we added the tags the last
           * time
           */
          if (currentHtml !== lastSeenHtml) {
            addTags();
          }
        });
      },
    };
  },]);
