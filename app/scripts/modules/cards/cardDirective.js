angular.module('cards').directive('ccCard', function () {
  return {
    restrict : 'E',
    scope : {
      card : '=ccCardModel',
      onSave : '&'
    },
    templateUrl : 'views/cardView.html',
    transclude : true,
    link : function ($scope, $element) {
      var elEdit = $element.find('.card-editor');
      
      $element.on('click', function () {
        $element.addClass('edit');
        elEdit.focus();
        return false;
      });

      elEdit.on('focusout', function () {
        $element.removeClass('edit');
        $scope.card.setModificationDate();
        $scope.card.save();
        $scope.onSave($scope.card);
        $scope.$apply();
      });
    }
  };
});
