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
 angular.module('angular-nsv-tagsearch')
  .directive('keyselectContainer', ['$parse', '$filter', function ($parse, $filter) {

    return {
      controller: ['$scope', '$element', function ($scope, $element) {

        var selectedIndex = -1;
        var listSource = function () {return [];};

        var searchText = '';

        /**
         * resets the suggestion list
         *
         * @return {object} this
         */
        this.reset = function () {
          selectedIndex = -1;
          return this;
        };

        /**
         * returns the currently selected index
         *
         * @return {number}
         */
        this.getSelectedIndex = function () {
          return selectedIndex;
        };

        /**
         * increments the selected index
         *
         * @return {object} this
         */
        this.incSelectedIndex = function () {
          selectedIndex++;
          if (selectedIndex >= listSource().length) {
            selectedIndex = -1;
          }

          return this;
        };

        /**
         * decrements the selected index
         *
         * @return {object} this
         */
        this.decSelectedIndex = function () {
          selectedIndex--;
          if (selectedIndex < -1) {
            selectedIndex = listSource().length - 1;
          }

          return this;
        };

        /**
         * returns the current suggestion
         *
         * @return {string}
         */
        this.getSelection = function () {
          return (selectedIndex > -1) ? listSource()[selectedIndex] : null;
        };

        /**
         * registers a function as a list getter
         *
         * the function is supposed to return the current list of suggestions
         *
         * @param {function} listGetter
         */
        this.registerListGetter = function (listGetter) {
          listSource = listGetter;
        };

        this.setSearchText = function (newSearchText) {
          searchText = newSearchText;
          return this;
        };

        this.getSearchText = function () {
          return searchText;
        };

      },],
    };
  },]);
