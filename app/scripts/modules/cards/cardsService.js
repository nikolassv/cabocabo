angular.module('cards').service('CardsService', [
  '$window', '$rootScope', 'CardModel', 'localStorageService',
  function ($window, $rootScope, CardModel, LocalStorageService) {
    var
        LS_ALL_CARDS = 'cards.allCards', // name in localstorage

        /**
         * an array with all the cards
         * @type {Array.<CardModel>}
         */
        cards = [],

        /**
         * an array with raw card data from the local storage
         * @type {Array.<Object>}
         */
        tmpRawCards = LocalStorageService.get(LS_ALL_CARDS),

        // reference to this service
        thisService = this;

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
     * add a card
     *
     * @return {CardModel}
     */
    this.add = function (card) {
      var newCard = (card instanceof CardModel) ?
                      card :
                      new CardModel(thisService);
      cards.push(newCard);
      return newCard;
    };

    /**
     * save a card to the localstorage
     *
     * (in lack of saving method for individual card, we will save all the cards
     *   at once)
     *
     * @param {CardModel}
     * @return this
     */
    this.save = function (card) {
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
        var newCard = new CardModel(thisService);
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
