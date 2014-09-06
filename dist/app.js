var cards = angular.module('cards', []);

cards.factory('CardModel', function () {
  function CardModel (content) {
    this.content = content;
    this.creationDate = new Date();
  }

  return CardModel;
});

cards.service('CardsService', ['CardModel', function (CardModel) {

  /**
   * return all cards for this user
   *
   * @return {array.<CardModel>}
   */
  this.getAll = function () {
    var exampleTexts = [
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea #takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'
    ],
    
    newCards = [];

    angular.forEach(exampleTexts, function (text) {
      newCards.push(new CardModel(text));
    });

    return newCards;
  }
}]);

var cabocabo = angular.module('cabocabo', [
  'cards'
]);

cabocabo.controller('MainCtrl', [
  '$scope', 'CardsService'
, function ($scope, CardsService) {
  $scope.cards = CardsService.getAll();
}]);
