/* globals Card */
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
 angular.module('cabocabo').controller('MainCtrl', [
  '$log', '$scope', '$routeParams', '$location', 'CardsService', 'search.SearchService',
  function ($log, $scope, $routeParams, $location, CardsService, SearchService) {
    /********************************
     * define scope vars
     ********************************/

    /**
     * list of cards to show in the deck
     * @type {Array.<Card>}
     */
    $scope.cardList = CardsService.getAll();

    /**
     * the currently selected tags
     * @type {Array.<string>}
     */
    $scope.selectedTags = [];

    /**
     * a list with all the available tags
     * @type {Array.<string>}
     */
    $scope.allTags = SearchService.getAllTags();

    /********************************
     * define scope functions
     ********************************/

    /**
     * add a new card to the list
     */
    $scope.addCard = function (card) {
      CardsService.add(card);
      watchCard(card);
      $scope.search();
    };

    /**
     * set the search phrase to a certain tag and do a search
     *
     * @param {string} tag
     */
    $scope.searchForTag = function (tag) {
      tag = ('' + tag)
            .replace(/^#/, '')
            .replace(/ /, '');

      if (!_.includes($scope.selectedTags, tag)) {
        $scope.selectedTags.push(tag);
      }

      $scope.search();
    };

    /**
     * do a search for all the tags in the current search phrase
     */
    $scope.search = function () {
      $location.search('tags', $scope.selectedTags.join(' '));

      if (angular.isArray($scope.selectedTags) && ($scope.selectedTags.length > 0)) {
        var ids = SearchService.getIdsForTags($scope.selectedTags);
        $scope.cardList = CardsService.getByIds(ids);
      } else {
        $scope.cardList = CardsService.getAll();
      }
    };

    /********************************
     * initialize
     ********************************/

    /**
     * the list of tags may change when the content of the cards changes. we will
     * update the list of all the tags accordingly
     */
    $scope.$watch(function () {
      return SearchService.getAllTags().length;
    }, function () {
      $scope.allTags = SearchService.getAllTags();
    });

    /**
     * watch all existing cards
     */
    angular.forEach(CardsService.getAll(), indexCard);

    if (angular.isString($routeParams.tags)) {
      $scope.selectedTags = _($routeParams.tags.split(' '))
                              .uniq()
                              .filter(_.negate(_.isEmpty))
                              .value();
    }

    $scope.search();

    /**
     * watch a card
     *
     * @param {CardModel} card
     */
    function watchCard(card) {
      $scope.$watch(function () {
          return card.content;
        }, _.partial(indexCard, card)
      );
    }

    function indexCard(card) {
      SearchService.indexText(card.id, card.content);
    }
  }
]);
