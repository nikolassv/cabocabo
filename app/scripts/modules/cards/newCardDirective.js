angular.module('cards')
  .directive('ccNewCard', ['$timeout', 'CardModel', function ($timeout, CardModel) {
    return {
      restrict: 'E',
      scope: {
        addCard: '&'
      },
      templateUrl: 'views/newCardView.html',
      link: function ($scope, $element) {
        var elButton = $element.find('[data-new-button]'),
            elCardEdit = $element.find('[data-card]');

        $scope.STATUS_BUTTON = 1;
        $scope.STATUS_CARD = 2;

        $scope.currentStatus = $scope.STATUS_BUTTON;

        $scope.newCard = new CardModel();

        /**
         * show the new card and let the user edit it
         */
        $scope.editNewCard = function () {
          $scope.currentStatus = $scope.STATUS_CARD;
          $timeout(function () {
            elCardEdit.trigger('click');
          });
        };

        /**
         * tell the parent that a new card has been saved and replace the modified
         * card with a new one
         */
        $scope.saveCard = function () {
          if ($scope.newCard.content.length > 0) {
            $scope.addCard({card: $scope.newCard});
            $scope.newCard = new CardModel();
          }

          $scope.currentStatus = $scope.STATUS_BUTTON;
        };
      }
    };
  }]);
