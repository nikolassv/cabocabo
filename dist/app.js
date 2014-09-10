
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
        elEdit.focus();
      };

      elEdit.on('focusout', function () {
        elCard.removeClass('edit');
      });
    }
  };
});

cards.factory('CardModel', function () {
  function CardModel () {
    var listenerList =[];

    this.registerListener = function (listener) {
      listenerList.push(listener);
    };

    this.notify = function () {
      angular.forEach(listenerList, function (listener) {
        listener(this);
      }, this);
    };

    this.content = content;
    this.cdate = new Date();
  }

  return CardModel;
});

cards.service('CardsService', [
  '$window', 'CardModel', 
  function ($window, CardModel) {
    var cards = [],
        hasLocalStorage = typeof $window.localStorage.setItem == 'function',
        saveToLocalStorage = function () {
          if (hasLocalStorage) {
            $window.localStorage.setItem('cabocabo-cards', JSON.stringify(cards));
          }
        };

    if (hasLocalStorage) {
      var savedCards = JSON.parse($window.localStorage.getItem('cabocabo-cards'));
      if (angular.isArray(savedCards)) {
        cards = savedCards;
      }
    }

    /**
     * return all cards for this user
     *
     * @return {array.<CardModel>}
     */
    this.getAll = function () {
      return cards;
    };

    /**
     * add a new card
     *
     * @return {CardModel}
     */
    this.add = function () {
      var newCard = new CardModel(this);
      cards.push(newCard);
      saveToLocalStorage();
      return newCard;
    };
  }
]);

var cabocabo = angular.module('cabocabo', [
  'cards',
  'textarea-fit'
]);

cabocabo.controller('MainCtrl', [
  '$scope', 'CardsService',
  function ($scope, CardsService) {
    $scope.cardList = CardsService.getAll();

    $scope.addCard = CardsService.add;
  }
]);
