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
      var elEdit = $element.find('.card-editor');
      
      $scope.edit = function () {
        $element.addClass('edit');
        elEdit.focus();
      };

      elEdit.on('focusout', function () {
        $element.removeClass('edit');
        $scope.card.setModificationDate();
        $scope.$apply();
      });
    }
  };
});

angular.module('cards').factory('CardModel', function () {
  function CardModel (manager) {
    var listenerList =[];

    /**
     * the id of this card
     * @type {number}
     */
     this.id = manager.getNextId();

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
     * modification date
     * @type {Date}
     */
     this.mdate = new Date();

    /**
     * save this card
     *
     * @return {CardModel}
     */
    this.save = function () {
      manager.save(this);
      return this;
    };

    /**
     * sets the modification date for a card
     *
     * if the parameter is a date it will be set as the new modification date.
     * otherwise the current date will be the modification date.
     *
     * @param {Date?}
     * @return {CardModel}
     */
    this.setModificationDate = function (mdate) {
      if (angular.isDate(mdate)) {
        this.mdate = mdate;
      } else {
        this.mdate = new Date();
      }
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
      cards[card.id] = card;
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
      var newCard = new CardModel(thisService);

      if (angular.isString(cardData.content)) {
        newCard.content = cardData.content;
      }

      if (angular.isString(cardData.cdate)) {
        newCard.cdate = new Date(cardData.cdate);
      }

      if (angular.isString(cardData.mdate)) {
        newCard.mdate = new Date(cardData.mdate);
      }

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

angular.module('search').directive('linkableTags', [
  '$filter', '$parse', 'search.TagService',
  function ($filter, $parse, TagService) {
    var tagFilter = $filter('tags');
    return {
      link : function ($scope, $element, $attr) {
        $element.find('[data-tag]').on('click', function (evt) {
            evt.stopPropagation();
            $parse($attr.onTagClick)({'tag':this.data('tag')});
        });
      }
    };
  }
]);

angular.module('search').service('search.SearchService', [
 'angular-nsv-tagmanager.TagIndex', 'angular-nsv-tagmanager.Set', 'search.TagService',
 function (Tagmanager, Set, TagService) {
  /**
   * local reference to this service
   */
  var thisService = this;

  /**
   * the index for all the texts
   * @type {angular-nsv-tagmanager.TagIndex}
   */
  var tagIndex = new Tagmanager();

  /**
   * save the tags for a given text
   *
   * @param {number}
   * @param {string}
   * @return {SearchService}
   */
  this.indexText = function (id, text) {
    var tags = TagService.extractTagsFromText(text);
    tagIndex.setTagsForItem(id, tags); 
    return this;
  };

  /**
   * get the ids for a given tag from the index
   *
   * @param {string}
   * @return {Array.<number>}
   */
  this.getIdsForTag = function (tag) {
    return tagIndex.getItemsForTag(tag).toArray();
  };

  /**
   * get the ids that match all of the tags in the array
   */
  this.getIdsForTags = function (tags) {
    var ids;
    angular.forEach(tags, function (tag) {
      if (ids instanceof Set) {
        ids = ids.intersect(thisService.getIdsForTag(tag));
      } else {
        ids = thisService.getIdsForTag(tag);
      }
    });
    return ids;
  };
 }
]);

angular.module('search').service('search.TagService', [
  'angular-nsv-tagmanager.Set',
  function (Set) {

    /**
     * regex to recognize tags in a text
     * @type {RegExp}
     */
    this.tagRegEx = /\B#[a-z\u00E4\u00F6\u00FC\u00DF\u00E9\u00E8]+/gi;

    /**
     * extract tags from a text
     *
     * @param {string} text
     * @return {Set}
     */
    this.extractTagsFromText = function (text) {
      var rawTags = text.match(this.tagRegEx),
          tags = new Set();
      angular.forEach(rawTags, function(rT) {
        tags.insert(rT.slice(1).toLowerCase());
      });
      return tags;
    };
  }
]);

angular.module('search').filter('tags', [
  'search.TagService',
  function (TagService) {
    return function ($input) {
      return $input.replace(TagService.tagRegEx, '<span class="tag" data-tag="$&">$&</span>'); 
    };
  }
]);

angular.module('cabocabo', [
  'cards'
]);

angular.module('cabocabo').controller('MainCtrl', [
  '$log', '$scope', 'CardsService', 'search.SearchService',
  function ($log, $scope, CardsService, SearchService) {
    /**
     * deregistration functions
     * @type {Array.<function>}
     */
    var deregistrationFns = [];

    /**
     * watch a card by its modification date and save derigistration functions
     *
     * @param {CardModel}
     */
    var watchCard = function (card) {
      deregistrationFns.push($scope.$watch(function () {
        return angular.isDate(card.mdate) ? card.mdate.valueOf() : 0;
      }, function () {
        CardsService.save(card);
        SearchService.indexText(card.id, card.content);
      }));
    };
    
    /**
     * watch all existing cards
     */
    angular.forEach(CardsService.getAll(), watchCard );

    /**
     * deregister all watches when scope is destroyed
     */
    $scope.$on('$destroy', function () {
      angular.forEach(deregistrationFns, function (dfn) {
        dfn();
      });
    });
  
    /**
     * define scope vars
     */
    $scope.cardList = CardsService.getAll();
    $scope.searchPhrase = '';

    /**
     * define scope functions
     */

    /**
     * add a new card to the list
     */
    $scope.addCard = function () {
      watchCard(CardsService.add());
    };

    /**
     * set the search phrase to a certain tag and do a search
     */
    $scope.searchForTag = function (tag) {
      $scope.searchPhrase = tag;
      $scope.search();
    };

    /**
     * do a search for all the tags in the current search phrase
     */
    $scope.search = function () {
      if (angular.isString($scope.searchPhrase) && $scope.searchPhrase.length > 0) {
        var tags = $scope.searchPhrase
                          .toLowerCase()
                          .replace(/\B#/, '')
                          .split(' '),
            ids = SearchService.getIdsForTags(tags);
        $scope.cardList = CardsService.getByIds(ids);
      } else {
        $scope.cardList = CardsService.getAll();
      }
    };
  }
]);
