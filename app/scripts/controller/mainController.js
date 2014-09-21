angular.module('cabocabo').controller('MainCtrl', [
  '$scope', 'CardsService',
  function ($scope, CardsService) {
    $scope.cardList = CardsService.getAll();

    $scope.addCard = CardsService.add;
  }
]);
