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
