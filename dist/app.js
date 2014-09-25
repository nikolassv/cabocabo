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
     * set card data from a raw object
     *
     * @param {Object}
     * @return {CardModel}
     */
    this.setData = function (obj) {
      if (angular.isString(obj.content)) {
        this.content = obj.content;
      }

      if (angular.isString(obj.cdate)) {
        this.cdate = new Date(obj.cdate);
      }

      if (angular.isString(obj.mdate)) {
        this.mdate = new Date(obj.mdate);
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

angular.module('search').directive('linkableTags', [
  '$filter', '$parse', 'search.TagService',
  function ($filter, $parse, TagService) {
    var tagFilter = $filter('tags');
    return {
      link : function ($scope, $element, $attr) {
        $element.on('click', function (evt) {
          var $target = angular.element(evt.target);
          if ($target.is('[data-tag]')) {
            evt.stopPropagation();
            $parse($attr.onTagClick)($scope.$parent)($target.data('tag'));
          }
        });
      }
    };
  }
]);

angular.module('search').service('search.SearchService', [
 'angular-nsv-tagmanager.TagIndex', 'angular-nsv-tagmanager.Set', 'search.TagService',
 function (Tagmanager, Set, TagService) {
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
   * get the ids for a given item from the index
   *
   * @param {string}
   * @return {Array.<number>}
   */
  this.getIdsForTag = function (tag) {
    return tagIndex.getItemsForTag(tag).toArray();
  };
 }
]);

angular.module('search').service('search.TagService', function () {

  /**
   * regex to recognize tags in a text
   * @type {RegExp}
   */
  this.tagRegEx = /#[a-z]+/gi;

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
});

angular.module('search').filter('tags', [
  'search.TagService',
  function (TagService) {
    return function ($input) {
      return $input.replace(TagService.tagRegEx, '<span class="tag" data-tag="$&">$&</a>'); 
    };
  }
]);

angular.module('cabocabo', [
  'cards'
]);

angular.module('cabocabo').controller('MainCtrl', [
  '$log', '$scope', 'CardsService',
  function ($log, $scope, CardsService) {
    /**
     * deregistration functions
     * @type {Array.<function>}
     */
    var deregistrationFns = [];

    /**
     * watch a card by its modification date and save derigstration functions
     * @param {CardModel}
     */
    var watchCard = function (card) {
      deregistrationFns.push($scope.$watch(function () {
        return angular.isDate(card.mdate) ? card.mdate.valueOf() : 0;
      }, function () {
        CardsService.save(card);
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
    $scope.addCard = function () {
      watchCard(CardsService.add());
    };
    $scope.onTagClick = function (tag) {
      $log.info(tag);
    };
  }
]);
