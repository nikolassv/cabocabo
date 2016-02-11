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
 angular.module('cards').directive('ccCard', function () {
  return {
    restrict: 'E',
    scope: {
      card: '=ccCardModel',
      onSave: '&',
    },
    templateUrl: 'views/modules/cards/cardView.html',
    transclude: true,
    link: function ($scope, $element) {
      var elEdit = $element.find('.card-editor');

      $scope.deleteCard = function () {
        $element.fadeOut(function () {
          $scope.card.remove();
        });
      };

      $scope.toggleEditor = function () {
        $element.addClass('edit');
        elEdit.focus();
        return false;
      };

      elEdit.on('focusout', function () {
        $element.removeClass('edit');
        $scope.card.setModificationDate();
        $scope.card.save();
        $scope.onSave($scope.card);
        $scope.$apply();
      });
    },
  };
});
