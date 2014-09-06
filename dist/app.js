
var cards = angular.module('cards', []);

cards.directive('ccCard', function () {
  return {
    restrict : 'E',
    scope : {
      card : '=ccCardModel'
    },
    templateUrl : 'views/cardView.html',
    transclude : true,
    link : function ($scope, $element) {
      var elCard = $element.find('.card'),
          elEdit = elCard.find('.card-editor');
      
      $scope.edit = function () {
        elCard.addClass('edit');
      };

      elEdit.on('focusout', function () {
        elCard.removeClass('edit');
      });
    }
  };
});

cards.factory('CardModel', function () {
  function CardModel (content) {
    this.content = content;
    this.cdate = new Date();
  }

  return CardModel;
});

cards.service('CardsService', [
  'CardModel', 
  function (CardModel) {

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
    };
  }
]);

var cabocabo = angular.module('cabocabo', [
  'cards'
]);

cabocabo.controller('MainCtrl', [
  '$scope', 'CardsService',
  function ($scope, CardsService) {
    $scope.cardList = CardsService.getAll();
  }
]);
