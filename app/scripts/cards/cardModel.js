cards.factory('CardModel', function () {
  function CardModel (content) {
    this.content = content;
    this.creationDate = new Date();
  }

  return CardModel;
});
