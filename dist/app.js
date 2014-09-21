angular.module('search', [
  'angular-nsv-tagmanager'
]);

angular.module('cards', [
  'textarea-fit',
  'LocalStorageModule',
  'angular-nsv-stringformat',
  'search'
]);

angular.module('cards').directive('ccCard', function () {
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
        $scope.card.save();
      });
    }
  };
});

angular.module('cards').factory('CardModel', function () {
  function CardModel (manager) {
    var listenerList =[];

    /**
     * the cards content
     * @type {string}
     */
    this.content = '';

    /**
     * creation date
     * @type {Date}
     */
    this.cdate = new Date();


    /**
     * set card data from a raw object
     *
     * @param {Object}
     * @return {CardModel}
     */
    this.setData = function (obj) {
      if (angular.isString(obj.content)) {
        this.content = obj.content;
      }

      if (angular.isDate(obj.cdate)) {
        this.cdata = obj.cdate;
      }

      return this;
    };

    /**
     * save this card
     *
     * @return {CardModel}
     */
    this.save = function () {
      manager.save(this);
      return this;
    };
  }

  return CardModel;
});

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
     * add a new card
     *
     * @return {CardModel}
     */
    this.add = function () {
      var newCard = new CardModel(thisService);
      cards.push(newCard);
      saveToLocalStorage();
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

angular.module('search').service('search.SearchService', [
 'angular-nsv-tagmanager.TagIndex', 'angular-nsv-tagmanager.Set',
 function (Tagmanager, Set) {
  var tagRegEx = /#[a-z]+/gi;

  /**
   * extract tags from a text
   *
   * @param {string} text
   * @return {Set}
   */
  this.extractTagsFromText = function (text) {
    var rawTags = text.match(tagRegEx),
        tags = new Set();
    angular.forEach(rawTags, function(rT) {
      tags.insert(rT.slice(1));
    });
    return tags;
  };
 }
]);

angular.module('cabocabo', [
  'cards'
]);

angular.module('cabocabo').controller('MainCtrl', [
  '$scope', 'CardsService',
  function ($scope, CardsService) {
    $scope.cardList = CardsService.getAll();

    $scope.addCard = CardsService.add;
  }
]);
