cards.service('CardsService', [
  '$window', '$rootScope', 'CardModel', 'localStorageService',
  function ($window, $rootScope, CardModel, LocalStorageService) {
    var
        LS_ALL_CARDS = 'cards.allCards',

        /**
         * an array with all the cards
         * @type {Array.<CardModel>}
         */
        cards = [],

        /**
         * an array with raw card data from the local storage
         * @type {Array.<Object>}
         */
        tmpRawCards = LocalStorageService.get(LS_ALL_CARDS);

    var saveToLocalStorage = function () {
      LocalStorageService.set(LS_ALL_CARDS, cards);
    };

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

    /**
     * register a change in one card
     * @param {CardModel}
     * @return {CardsService}
     */
    this.notify = function (card) {
      saveToLocalStorage();
      return this;
    };

    /**
     * convert an array of card data into an array of CardModels
     *
     * @param {Array.<Object>} arr
     * @return {Array.<CardModel>}
     */
    this.convertArray = function (arr) {
      var newCardArray = [];
      angular.forEach(arr, function (cardData) {
        var newCard = new CardModel(this);
        newCard.setData(cardData);
        newCardArray.push(newCard);
      });
      return newCardArray;
    };

    /**
     * create card objects from all the cards in the local storage
     */
    if (angular.isArray(tmpRawCards)) {
      cards = this.convertArray(tmpRawCards);
    }
    $rootScope.$on('$destroy', saveToLocalStorage);
  }
]);
