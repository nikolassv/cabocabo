angular.module('cards').directive('ccCard', function () {
  return {
    restrict : 'E',
    scope : {
      card : '=ccCardModel'
    },
    templateUrl : 'views/cardView.html',
    transclude : true,
    link : function ($scope, $element) {
      var elEdit = $element.find('.card-editor');
      
      $scope.edit = function () {
        $element.addClass('edit');
        elEdit.focus();
      };

      elEdit.on('focusout', function () {
        $element.removeClass('edit');
        $scope.card.setModificationDate();
        $scope.$apply();
      });
    }
  };
});
