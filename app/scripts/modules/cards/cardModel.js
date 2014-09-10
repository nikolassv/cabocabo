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
