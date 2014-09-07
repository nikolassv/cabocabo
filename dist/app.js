
var cards = angular.module('cards', []);


var ui = angular.module('ui', []);

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
  function CardModel (content) {
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
      var newCard = new CardModel();
      cards.push(newCard);
      saveToLocalStorage();
      return newCard;
    };
  }
]);

/**
 * directive to resize a textareo to always fit the height of its content
 */
ui.directive('textAreaVerticalFit', [
  function () {
    var 
        /**
         * copy important css styles from one element to another
         *
         * @param {jQuery} elSrc
         * @param {jQuery} elDest
         */
        copyCssStyles = function (elSrc, elDest) {
          var stylesToCopy = [
                'width',
                'font-family',
                'font-size',
                'line-height',
                'min-height',
                'padding'
              ],
              destStyles = {};
          
          angular.forEach(stylesToCopy, function (style) {
            destStyles[style] = elSrc.css(style); 
          });

          elDest.css(destStyles); 
        };

    return {
      restrict: 'A',
      link : function ($scope, $element) {
        if ($element.is('textarea')) {
          var elClone = angular.element('<div>'),
              setEqualHeight = function () {
                var curText = $element.val();
                if (/\n$/.test(curText)) {
                  curText += ' ';
                }
                copyCssStyles($element, elClone);
                elClone.text(curText);
                $element.height(elClone.height());
              };

          elClone
            .hide()
            .css({
              'white-space': 'pre-wrap',
              'word-wrap' : 'break-word'
            })
            .appendTo($element.parent());

          $element.css('overflow', 'hidden');

          $scope.$watch(function () {
            return $element.val();
          }, setEqualHeight);

          $scope.$watch(function () {
            return $element.width();
          }, setEqualHeight);
        }
      }
    };
  }]
);

var cabocabo = angular.module('cabocabo', [
  'cards',
  'ui'
]);

cabocabo.controller('MainCtrl', [
  '$scope', 'CardsService',
  function ($scope, CardsService) {
    $scope.cardList = CardsService.getAll();

    $scope.addCard = CardsService.add;
  }
]);
