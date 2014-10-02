angular.module('search', [
  'angular-nsv-tagmanager'
]);

angular.module('cards', [
  'textarea-fit',
  'LocalStorageModule',
  'angular-nsv-stringformat',
  'search'
]);

angular.module('angular-nsv-tagsearch', []);

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
      controller : function ($scope, $element, $attrs) {
        this.onClick = function (tag) {
            $parse($attrs.onTagClick)($scope.$parent, {'tag':tag});
        };
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

  /**
   * return all existing tags
   */
  this.getAllTags = function () {
    return tagIndex.getAllTags();
  };
 }
]);

angular.module('search')
  .directive('containsTags', ['$filter', function ($filter) {
    var tagFilter = $filter('tags');
    return {
      require : '^linkableTags',
      link : function ($scope, $element, $attrs, $LnTagsCtrl) {
        var addTags = function () {
          $element.html(tagFilter($element.text()));
          $element.find('tag').on('click', function (evt) {
            $LnTagsCtrl.onClick($(this).data('tag'));
            evt.stopPropagation();
            evt.preventDefault();
            $scope.$apply();
          });
        };
        var deregistrationFn = $scope.$watch(function () {
          return $element.text();
        }, function () {
          addTags();
        });
        $scope.$on('$destroy', deregistrationFn);
      }
    };
  }]);

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
      return $input.replace(TagService.tagRegEx, '<tag class="tag" data-tag="$&">$&</tag>'); 
    };
  }
]);


angular.module('angular-nsv-tagsearch')
	.directive('tagsearch', function () {
		return {
			restrict : 'EA',
			templateUrl : 'views/tagsearchView.html',
      scope : {
        allTags : '='
      },
			controller : function () {
				var thisCtrl = this;
				thisCtrl.tagList = [];
				thisCtrl.removeTag = function (i, evt) {
					evt.stopPropagation();
					return thisCtrl.tagList.splice(i,1);
				};
				thisCtrl.removeLast = function () {
					return thisCtrl.tagList.pop();
				};
				thisCtrl.addTag = function (tagStr) {
					tagStr = (''+tagStr)
								.replace(/^#/,'')
								.replace(/ /, '');
					if (tagStr.length > 0) {
						if (thisCtrl.tagList.indexOf(tagStr) === -1) {
							thisCtrl.tagList.push(tagStr);
						}
					}
					return thisCtrl.tagList;
				};
			},
			link : function ($scope, $element, $attrs, ctrl) {
				$scope.tagList = ctrl.tagList;
				$scope.removeTag = ctrl.removeTag;
			}
		};
	});

angular.module('angular-nsv-tagsearch')
	.directive('tagsearchInput', function () {
		var widthDefiningStyles = [ 'font-size', 'font-family', 'margin', 'padding', 'min-width' ],
			copyCssStyles = function (elSrc, elDest) {
				var destStyles = {};
				angular.forEach(widthDefiningStyles, function (style) {
				  destStyles[style] = elSrc.css(style); 
				});
				elDest.css(destStyles); 
			};
		
		return {
			restrict : 'EA',
			require : ['^tagsearch', '^keyselectContainer'],
			link : function ($scope, $element, $attrs, Ctrls) {
        var // a clone of the current element as div
            elClone = angular.element('<div>'),

            /**
             * set the width of the input field to the with of its containing text
             *
             * will set the containing text as text of the clone and set the width
             * of the input field to the width of the clone
             */
            setEqualWidth = function () {
              copyCssStyles($element, elClone);
              elClone.text($scope.searchText);
              $element.width(elClone.width()+3);
            },
				
          TagSearchCtrl = Ctrls[0],
          KscCtrl = Ctrls[1];

				elClone.hide().appendTo($element.parent());
        
				$scope.searchText = '';
        KscCtrl.setFilterText($scope.searchText);
				
				/**
				 * react to click on parent
				 */
				$element.parents('tagsearch,[tagsearch],[data-tagsearch]').on('click', function () {
					$element.focus();
				});
				
				/**
				 * react to changes in the search text
				 */
				$scope.$watch('searchText', function () {
					// add the current search text as a new tag, if it ends with whitespace
					var parts = $scope.searchText.match(/(.*)\s$/);
					if (angular.isArray(parts)) {
						TagSearchCtrl.addTag(parts[1]);
						$scope.searchText = '';
					}
					setEqualWidth();

          // propagate changes in search text to KscCtrl
          KscCtrl.setFilterText($scope.searchText);
				});
				
				/**
				 * react on keypress
				 */
				$element.on('keydown', function (evt) {
					switch (evt.which) {
            case 40: // cursor down: select next suggestion
              KscCtrl.incSelectedIndex();
              $scope.$apply();
              break;
            case 38: // cursor up: select previous suggestion
              KscCtrl.decSelectedIndex();
              $scope.$apply();
              break;
						case 13: // return: add current search string as tag
              if (KscCtrl.getSelectedIndex() > -1) {
                $scope.searchText = KscCtrl.getSelection();
                KscCtrl
                  .reset();
              } else {
                TagSearchCtrl.addTag($scope.searchText);
                $scope.searchText = '';
              }
							$scope.$apply();
							break;
						case 8: // backspace: remove last tag
							if ($scope.searchText.length === 0) {
								$scope.searchText = TagSearchCtrl.removeLast();
								$scope.$apply();
							}
							break;
						// do nothing on default
					} 
				});
			}
		};
	}).directive('keyselectContainer', ['$parse', '$filter', function ($parse, $filter) {
    return {
      scope : {
        items : '=' 
      },
      controller : ['$scope', '$element', function ($scope, $element) {
        var selectedIndex = -1,
            filterText = '',
            suggestions = [];

        this.reset = function () {
          selectedIndex = -1;
          return this;
        };

        this.setFilterText = function (newFilterText) {
          if (filterText !== newFilterText) {
            filterText = newFilterText;
            this.updateSuggestions();
          } 
          return this;
        };

        this.updateSuggestions = function () {
          var l = suggestions.length;
          suggestions = $filter('filter')($scope.items, filterText);
          if ((suggestions.length !== l) && (selectedIndex >= suggestions.length)) {
            selectedIndex = suggestionNumber - 1;
          }
        };

        this.getSuggestions = function () {
          return suggestions;
        };

        this.getSelectedIndex = function () {
          return selectedIndex;
        };

        this.incSelectedIndex = function () {
          selectedIndex++;
          if (selectedIndex >= suggestions.length) {
            selectedIndex = -1;
          }
          return this;
        };

        this.decSelectedIndex = function () {
          selectedIndex--;
          if (selectedIndex < -1) {
            selectedIndex = suggestions.length - 1;
          }
          return this;
        };
        
        this.getSelection = function () {
          return (selectedIndex > -1) ? suggestions[selectedIndex] : null;
        };

      }]
    };
  }])
  .directive('suggestionList', function() {
    return {
      require : '^keyselectContainer',
      templateUrl : 'views/suggestionListView.html',
      replace : true,
			link : function ($scope, $element, $attrs, KscCtrl) {

				$scope.selectedIndex = KscCtrl.getSelectedIndex();
        $scope.$watch(function () {
          return KscCtrl.getSelectedIndex();
        }, function () {
          $scope.selectedIndex = KscCtrl.getSelectedIndex();
        }); 
				
        KscCtrl.updateSuggestions();
        $scope.suggestionList = KscCtrl.getSuggestions();
        $scope.$watch(function () {
          return KscCtrl.getSuggestions();
        }, function () {
          $scope.suggestionList = KscCtrl.getSuggestions();
        });

			}
		};
	});


angular.module('cabocabo', [
  'cards',
  'angular-nsv-tagsearch'
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

    $scope.allTags = SearchService.getAllTags().toArray();
    $scope.$watch(SearchService.getAllTags, function () {
      $scope.allTags = SearchService.getAllTags().toArray();
    });

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
