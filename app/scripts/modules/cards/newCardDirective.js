/**
 * The MIT License
 *
 * Copyright (c) 2015 Nikolas Schmidt-Voigt, http://nikolassv.de
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
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
            elCardEdit.addClass('edit');
            elCardEdit.find('.card-editor').focus();
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
