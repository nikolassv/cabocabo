angular.module('cards').service('CardsService', [
  '$window', '$rootScope', 'CardModel', 'localStorageService',
  function ($window, $rootScope, CardModel, LocalStorageService) {
    var
        LS_ALL_CARDS = 'cards.allCards', // name in localstorage

        /**
         * an object with all the cards
         * @type {Array.<CardModel>}
         */
        cards = {},

        /**
         * an array with raw card data from the local storage
         * @type {Array.<Object>}
         */
        tmpRawCards = LocalStorageService.get(LS_ALL_CARDS),

        /**
         * next free id for a card
         * @type {number}
         */
        nextId = 0;

        // reference to this service
        thisService = this;

    var saveToLocalStorage = function () {
      LocalStorageService.set(LS_ALL_CARDS, thisService.getAll());
    };

    /**
     * return all cards for this user
     *
     * @return {array.<CardModel>}
     */
    this.getAll = function () {
      var cardArray = [];
      angular.forEach(cards, function (c) {
        cardArray.push(c);
      });
      return cardArray;
    };

    /**
     * return cards with given ids
     *
     * @param {number|Array.<number>}
     * @return {CardModel}
     */
    this.getByIds = function (ids) {
      var cardArray = [];
      if (!angular.isArray(ids)) {
        ids = [ids];
      }
      angular.forEach(ids, function (id) {
        if (cards.hasOwnProperty(id)) {
          cardArray.push(cards[id]); 
        }
      });
      return cardArray;
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

      newCard.setManager(this);

      if (angular.isUndefined(newCard.id)) {
        newCard.id = this.getNextId();
      }

      cards[newCard.id] = newCard;
      this.save();

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
     * @return {Object}
     */
    this.convertArray = function (arr) {
      var newCards = {};
      angular.forEach(arr, function (cardData) {
        var newCard = thisService.createCardFromData(cardData);
        newCards[newCard.id] = newCard;
      });
      return newCards;
    };

    /**
     * set card data from a raw object
     *
     * @param {Object}
     * @return {CardModel}
     */
    this.createCardFromData = function (cardData) {
      var newCard = new CardModel();

      if (angular.isString(cardData.content)) {
        newCard.content = cardData.content;
      }

      if (angular.isString(cardData.cdate)) {
        newCard.cdate = new Date(cardData.cdate);
      }

      if (angular.isString(cardData.mdate)) {
        newCard.mdate = new Date(cardData.mdate);
      }

      thisService.add(newCard);

      return newCard;
    };

    /**
     * get the next free id and increment its value
     * @return {number}
     */
    this.getNextId = function () {
      return nextId++;
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
