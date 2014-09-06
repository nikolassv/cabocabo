cards.factory('CardModel', function () {
  function CardModel (content) {
    this.content = content;
    this.cdate = new Date();
  }

  return CardModel;
});
