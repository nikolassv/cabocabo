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
        return angular.isDate(card.mdate) ? card.mdate.valueOf() : 0;
      }, function () {
        CardsService.save(card);
        SearchService.indexText(card.id, card.content);
      }));
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
  
    /**
     * define scope vars
     */
    $scope.cardList = CardsService.getAll();
    $scope.searchPhrase = '';

    $scope.allTags = SearchService.getAllTags().toArray();
    $scope.$watch(SearchService.getAllTags, function () {
      $scope.allTags = SearchService.getAllTags().toArray();
    });

    /**
     * define scope functions
     */

    /**
     * add a new card to the list
     */
    $scope.addCard = function () {
      watchCard(CardsService.add());
    };

    /**
     * set the search phrase to a certain tag and do a search
     */
    $scope.searchForTag = function (tag) {
      $scope.searchPhrase = tag;
      $scope.search();
    };

    /**
     * do a search for all the tags in the current search phrase
     */
    $scope.search = function () {
      if (angular.isString($scope.searchPhrase) && $scope.searchPhrase.length > 0) {
        var tags = $scope.searchPhrase
                          .toLowerCase()
                          .replace(/\B#/, '')
                          .split(' '),
            ids = SearchService.getIdsForTags(tags);
        $scope.cardList = CardsService.getByIds(ids);
      } else {
        $scope.cardList = CardsService.getAll();
      }
    };
  }
]);
