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
  '$log', '$scope', 'CardsService', 'search.SearchService',
  function ($log, $scope, CardsService, SearchService) {
    /**
     * watch a card and save derigistration function
     *
     * @param {CardModel}
     */
    function watchCard (card) {
      $scope.$watch(
        function () {
          return card.content;
        },
        function () {
          SearchService.indexText(card.id, card.content);
          $scope.search();
        }
      );
    }
    
    /**
     * watch all existing cards
     */
    angular.forEach(CardsService.getAll(), watchCard);
  
    /********************************
     * define scope vars
     ********************************/

    /**
     * list of cards to show in the deck
     * @type {array.<Card>}
     */
    $scope.cardList = CardsService.getAll();

    /**
     * the currently selected tags
     * @type {array.<string>}
     */
    $scope.selectedTags = [];

    /**
     * a list with all the available tags 
     * @type {array.<string>}
     */
    $scope.allTags = SearchService.getAllTags();

    /**
     * the list of tags may change when the content of the cards changes. we will
     * update the list of all the tags accordingly
     */
    $scope.$watch(function () {
      return SearchService.getAllTags().length;
    }, function () {
      $scope.allTags = SearchService.getAllTags();
    });

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
      tag = (''+tag)
            .replace(/^#/,'')
            .replace(/ /, '');
      $scope.selectedTags.push(tag);
      $scope.search();
    };

    /**
     * do a search for all the tags in the current search phrase
     */
    $scope.search = function () {
      if (angular.isArray($scope.selectedTags) && ($scope.selectedTags.length > 0)) {
        var ids = SearchService.getIdsForTags($scope.selectedTags);
        $scope.cardList = CardsService.getByIds(ids);
      } else {
        $scope.cardList = CardsService.getAll();
      }
    };
  }
]);
