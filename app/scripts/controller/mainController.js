angular.module('cabocabo').controller('MainCtrl', [
  '$log', '$scope', 'CardsService', 'search.SearchService',
  function ($log, $scope, CardsService, SearchService) {
    /**
     * deregistration functions
     * @type {Array.<function>}
     */
    var deregistrationFns = [];

    /**
     * watch a card by its modification date and save derigistration functions
     *
     * @param {CardModel}
     */
    var watchCard = function (card) {
      deregistrationFns.push($scope.$watch(function () {
          return card.content;
        }, function () {
          SearchService.indexText(card.id, card.content);
        })
      );
    };
    
    /**
     * watch all existing cards
     */
    angular.forEach(CardsService.getAll(), watchCard );

    /**
     * deregister all watches when scope is destroyed
     */
    $scope.$on('$destroy', function () {
      angular.forEach(deregistrationFns, function (dfn) {
        dfn();
      });
    });
  
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
    $scope.allTags = SearchService.getAllTags().toArray();

    /**
     * the list of tags may change when the content of the cards changes. we will
     * update the list of all the tags accordingly
     */
    deregistrationFns.push($scope.$watch(SearchService.getAllTags, function (allTags) {
      $scope.allTags = allTags.toArray();
    }));

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
