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
