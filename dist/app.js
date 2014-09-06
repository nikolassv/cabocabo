
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

/**
 * directive to resize a textareo to always fit the height of its content
 */
ui.directive('textAreaVerticalFit', function () {
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
        var elClone = angular.element('<div>');

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
        }, function () {
          copyCssStyles($element, elClone);
          elClone.text($element.val());
          $element.height(elClone.height());
        });
      }
    }
  };
});

var cabocabo = angular.module('cabocabo', [
  'cards',
  'ui'
]);

cabocabo.controller('MainCtrl', [
  '$scope', 'CardsService',
  function ($scope, CardsService) {
    $scope.cardList = CardsService.getAll();
  }
]);
