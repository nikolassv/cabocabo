cards.service('CardsService', [
  '$window', 'CardModel', 
  function ($window, CardModel) {
    var cards = [],
        hasLocalStorage = typeof $window.localStorage.setItem == 'function',
        saveToLocalStorage = function () {
          if (hasLocalStorage) {
            $window.localStorage.setItem('cabocabo-cards', JSON.stringify(cards));
          }
        };

    if (hasLocalStorage) {
      var savedCards = JSON.parse($window.localStorage.getItem('cabocabo-cards'));
      if (angular.isArray(savedCards)) {
        cards = savedCards;
      }
    }

    /**
     * return all cards for this user
     *
     * @return {array.<CardModel>}
     */
    this.getAll = function () {
      return cards;
    };

    /**
     * add a new card
     *
     * @return {CardModel}
     */
    this.add = function () {
      var newCard = new CardModel(this);
      cards.push(newCard);
      saveToLocalStorage();
      return newCard;
    };
  }
]);
