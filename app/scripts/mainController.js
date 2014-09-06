cabocabo.controller('MainCtrl', [
  '$scope', 'CardsService'
, function ($scope, CardsService) {
  $scope.cards = CardsService.getAll();
}]);
