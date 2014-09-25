angular.module('cabocabo').controller('MainCtrl', [
  '$log', '$scope', 'CardsService',
  function ($log, $scope, CardsService) {
    /**
     * deregistration functions
     * @type {Array.<function>}
     */
    var deregistrationFns = [];

    /**
     * watch a card by its modification date and save derigstration functions
     * @param {CardModel}
     */
    var watchCard = function (card) {
      deregistrationFns.push($scope.$watch(function () {
        return angular.isDate(card.mdate) ? card.mdate.valueOf() : 0;
      }, function () {
        CardsService.save(card);
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
    $scope.addCard = function () {
      watchCard(CardsService.add());
    };
    $scope.onTagClick = function (tag) {
      $log.info(tag);
    };
  }
]);
