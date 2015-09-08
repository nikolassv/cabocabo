/**
 * The MIT License
 *
 * Copyright (c) 2015 Nikolas Schmidt-Voigt, http://nikolassv.de
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
angular.module('search', []);
/**
 * The MIT License
 *
 * Copyright (c) 2015 Nikolas Schmidt-Voigt, http://nikolassv.de
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
angular.module('cards', [
  'textarea-fit',
  'LocalStorageModule',
  'angular-nsv-stringformat',
  'search'
]);

/**
 * The MIT License
 *
 * Copyright (c) 2015 Nikolas Schmidt-Voigt, http://nikolassv.de
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
angular.module('angular-nsv-tagsearch', []);
/**
 * The MIT License
 *
 * Copyright (c) 2015 Nikolas Schmidt-Voigt, http://nikolassv.de
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
 angular.module('cards').directive('ccCard', function () {
  return {
    restrict : 'E',
    scope : {
      card : '=ccCardModel',
      onSave : '&'
    },
    templateUrl : 'views/cardView.html',
    transclude : true,
    link : function ($scope, $element) {
      var elEdit = $element.find('.card-editor');

      $scope.deleteCard = function () {
        $element.fadeOut(function () {
          $scope.card.remove();
        });
      };

      $scope.toggleEditor = function () {
        $element.addClass('edit');
        elEdit.focus();
        return false;
      };

      elEdit.on('focusout', function () {
        $element.removeClass('edit');
        $scope.card.setModificationDate();
        $scope.card.save();
        $scope.onSave($scope.card);
        $scope.$apply();
      });
    }
  };
});

/**
 * The MIT License
 *
 * Copyright (c) 2015 Nikolas Schmidt-Voigt, http://nikolassv.de
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
 angular.module('cards').factory('CardModel', function () {
  function CardModel () {
    var manager;

    /**
     * the id of this card
     * @type {number|undefined}
     */
     this.id = undefined;

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
     * sets the manager
     * 
     * @param {CardService} new Manager
     * @return {CardModel}
     */
    this.setManager = function (newManager) {
      manager = newManager;
      return this;
    };

    /**
     * save this card
     *
     * @return {CardModel}
     */
    this.save = function () {
      if (angular.isObject(manager) && angular.isFunction(manager.save)) {
        manager.save(this);
      }
      return this;
    };

    /**
     * remove this card from the collection
     *
     * @return {CardModel}
     */
    this.remove = function () {
      if (angular.isObject(manager) && angular.isFunction(manager.remove)) {
        manager.remove(this);
      }
      this.content = ''; // deleting the content will unregister the card from the tag search
      this.setModificationDate();
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

/**
 * The MIT License
 *
 * Copyright (c) 2015 Nikolas Schmidt-Voigt, http://nikolassv.de
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
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

    function saveToLocalStorage () {
      LocalStorageService.set(LS_ALL_CARDS, thisService.getAll());
    }

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
     * @param {CardModel}
     * @return {CardModel}
     */
    this.add = function (card) {
      var newCard = (card instanceof CardModel) ?
                      card :
                      new CardModel();

      newCard.setManager(this);

      if (angular.isUndefined(newCard.id)) {
        newCard.id = this.getNextId();
      }

      cards[newCard.id] = newCard;
      this.save();

      return newCard;
    };

    /**
     * save cards to the localstorage
     *
     * (in lack of saving method for individual card, we will save all the cards
     *   at once)
     *
     * @return this
     */
    this.save = function () {
      saveToLocalStorage();
      return this;
    };

    /**
     * remove a card from the collection
     *
     * @param {CardModel}
     * @return this
     */
    this.remove = function (card) {
      delete cards[card.id];
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

/**
 * The MIT License
 *
 * Copyright (c) 2015 Nikolas Schmidt-Voigt, http://nikolassv.de
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
 angular.module('cards')
  .directive('ccNewCard', ['$timeout', 'CardModel', function ($timeout, CardModel) {
    return {
      restrict: 'E',
      scope: {
        addCard: '&'
      },
      templateUrl: 'views/newCardView.html',
      link: function ($scope, $element) {
        var elButton = $element.find('[data-new-button]'),
            elCardEdit = $element.find('[data-card]');

        $scope.STATUS_BUTTON = 1;
        $scope.STATUS_CARD = 2;

        $scope.currentStatus = $scope.STATUS_BUTTON;

        $scope.newCard = new CardModel();

        /**
         * show the new card and let the user edit it
         */
        $scope.editNewCard = function () {
          $scope.currentStatus = $scope.STATUS_CARD;
          $timeout(function () {            
            elCardEdit.addClass('edit');
            elCardEdit.find('.card-editor').focus();
          });
        };

        /**
         * tell the parent that a new card has been saved and replace the modified
         * card with a new one
         */
        $scope.saveCard = function () {
          if ($scope.newCard.content.length > 0) {
            $scope.addCard({card: $scope.newCard});
            $scope.newCard = new CardModel();
          }

          $scope.currentStatus = $scope.STATUS_BUTTON;
        };
      }
    };
  }]);

/**
 * The MIT License
 *
 * Copyright (c) 2015 Nikolas Schmidt-Voigt, http://nikolassv.de
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
 /**
 * directive: containsTags
 *
 * this directive finds tags in an elements inner html. It marks them and adds an
 * event handler on each tags.
 *
 * this directive requires an linkableTags controller on any parent element. if any
 * of the tags in the current element is clicked, it invokes the linkableTags
 * controllers `onClick` method
 */
angular.module('search')
  .directive('containsTags', ['$filter', function ($filter) {
    var tagFilter = $filter('tags');
    return {
      require : '^linkableTags',
      link : function ($scope, $element, $attrs, $LnTagsCtrl) {
        /**
         * the inner html of the element to prevent duplicate handling of tags
         */
        var lastSeenHtml = '';

        /**
         * marks all the tags in the elements html a
         */
        var addTags = function () {
          $element.html(tagFilter($element.html()));

          $element.find('tag').on('click', function (evt) {
            $LnTagsCtrl.onClick($(this).data('tag'));
            $scope.$apply();
            return false; // stop propagation and prevent default
          });

          lastSeenHtml = $element.html();
        };

        /**
         * listen to changes in the elements html
         */
        $scope.$watch(function () {
          return $element.html();
        }, function (currentHtml) {
          /**
           * add tags only if the html has changed since we added the tags the last
           * time
           */
          if (currentHtml !== lastSeenHtml) {
            addTags();
          }
        });
      }
    };
  }]);

/**
 * The MIT License
 *
 * Copyright (c) 2015 Nikolas Schmidt-Voigt, http://nikolassv.de
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
 /**
 * directive: linkable tags
 *
 * this directive adds a controller to an element that provides an onClick method
 * only. It is intended to be uses with the `containsTags` directive. The
 * `containsTags` directive marks tags in an elements html and invokes this
 * controllers `onClick` method whenever one of the tags is clicked.
 */
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

/**
 * The MIT License
 *
 * Copyright (c) 2015 Nikolas Schmidt-Voigt, http://nikolassv.de
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
 angular.module('search').service('search.SearchService', [
  'search.TagService',
  function (TagService) {
    /**
     * local reference to this service
     */
    var thisService = this;

    var reversedIndex = {};

    /**
     * save the tags for a given text
     *
     * @param {number}
     * @param {string}
     * @return {SearchService}
     */
    this.indexText = function (id, text) {
      angular.forEach(TagService.extractTagsFromText(text), function (tag) {
        if (_.has(reversedIndex, tag) && angular.isArray(reversedIndex[tag])) {
          if (!_.includes(reversedIndex[tag], id)) {
            reversedIndex[tag].push(id);
          }
        } else {
          reversedIndex[tag] = [id];
        }
      });
      return this;
    };

    /**
     * get the ids for a given tag from the index
     *
     * @param {string}
     * @return {array.<number>}
     */
    this.getIdsForTag = function (tag) {
      return angular.isArray(reversedIndex[tag]) ? reversedIndex[tag] : [];
    };

    /**
     * get the ids that match all of the tags in the array
     *
     * @param {array.<string>}
     * @return {array.<number>}
     */
    this.getIdsForTags = function (tags) {
      var ids;

      angular.forEach(tags, function (tag) {

        tag = tag.toLowerCase();

        if (angular.isArray(ids)) {
          ids = _.intersection(ids, thisService.getIdsForTag(tag));
        } else {
          ids = thisService.getIdsForTag(tag);
        }

      });

      return ids;
    };

    /**
     * return all existing tags
     *
     * @return {array.<string>}
     */
    this.getAllTags = function () {
      return _.keys(reversedIndex);
    };
  }
]);

/**
 * The MIT License
 *
 * Copyright (c) 2015 Nikolas Schmidt-Voigt, http://nikolassv.de
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
 /**
 * service: tagService
 * 
 * a service to handle tags
 */
angular.module('search').service('search.TagService', [
  function () {

    /**
     * regex to recognize tags in a text
     * @type {RegExp}
     */
    this.tagRegEx = /\B#[a-z\u00E4\u00F6\u00FC\u00DF\u00E9\u00E8]+/gi;

    /**
     * extract tags from a text
     *
     * @param {string} text
     * @return {array.<string>}
     */
    this.extractTagsFromText = function (text) {
      var rawTags = text.match(this.tagRegEx);
      var tags = [];

      angular.forEach(rawTags, function(rT) {
        rT = rT.slice(1).toLowerCase();
        if (!_.includes(tags, rT)) {
          tags.push(rT);
        }
      });
      
      return tags;
    };
  }
]);

/**
 * The MIT License
 *
 * Copyright (c) 2015 Nikolas Schmidt-Voigt, http://nikolassv.de
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
 /**
 * filter: tags
 *
 * a filter that surrounds all tags in a text with tag elements
 */
angular.module('search').filter('tags', [
  'search.TagService',
  function (TagService) {
    return function ($input) {
      return $input.replace(TagService.tagRegEx, '<tag class="tag" data-tag="$&">$&</tag>'); 
    };
  }
]);

/**
 * The MIT License
 *
 * Copyright (c) 2015 Nikolas Schmidt-Voigt, http://nikolassv.de
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
 angular.module('angular-nsv-tagsearch')
  .directive('keyselectContainer', ['$parse', '$filter', function ($parse, $filter) {

    return {
      controller : ['$scope', '$element', function ($scope, $element) {

        var selectedIndex = -1;
        var listSource = function () {return [];};
        var searchText = '';


        /**
         * resets the suggestion list
         *
         * @return {object} this
         */
        this.reset = function () {
          selectedIndex = -1;
          return this;
        };

        /**
         * returns the currently selected index
         *
         * @return {number}
         */
        this.getSelectedIndex = function () {
          return selectedIndex;
        };

        /**
         * increments the selected index
         *
         * @return {object} this
         */
        this.incSelectedIndex = function () {
          selectedIndex++;
          if (selectedIndex >= listSource().length) {
            selectedIndex = -1;
          }
          return this;
        };

        /**
         * decrements the selected index
         *
         * @return {object} this
         */
        this.decSelectedIndex = function () {
          selectedIndex--;
          if (selectedIndex < -1) {
            selectedIndex = listSource().length - 1;
          }
          return this;
        };
        
        /**
         * returns the current suggestion
         *
         * @return {string}
         */
        this.getSelection = function () {
          return (selectedIndex > -1) ? listSource()[selectedIndex] : null;
        };

        /**
         * registers a function as a list getter
         *
         * the function is supposed to return the current list of suggestions
         *
         * @param {function} listGetter
         */
        this.registerListGetter = function (listGetter) {
          listSource = listGetter;
        };

        this.setSearchText = function (newSearchText) {
          searchText = newSearchText;
          return this;
        };
        
        this.getSearchText = function () {
          return searchText;
        };

      }]
    };
  }]);

/**
 * The MIT License
 *
 * Copyright (c) 2015 Nikolas Schmidt-Voigt, http://nikolassv.de
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
 angular.module('angular-nsv-tagsearch')
  .directive('suggestionList', ['$filter', function($filter) {
    var filterFilter = $filter('filter');

    return {
      require : ['^tagsearch', '^keyselectContainer'],
      templateUrl : 'views/suggestionListView.html',
      scope : {
        items : '=',
        blacklist : '='
      },
			link : function ($scope, $element, $attrs, Ctrls) {
        var TagsrchCtrl = Ctrls[0],
            KscCtrl = Ctrls[1];

        $scope.suggestions = [];

        KscCtrl.registerListGetter(function () {
          return $scope.suggestions;
        });

        /**
         * updates the list of suggestions for the user
         *
         * @return {array.<string>} the current suggestions
         */
        var updateSuggestions = function (filterText) {
          var l = $scope.suggestions.length;
          $scope.suggestions = filterFilter($scope.items, filterText);
          if (($scope.suggestions.length !== l) && ($scope.selectedIndex >= $scope.suggestions.length)) {
            $scope.selectedIndex = $scope.suggestions.length - 1;
          }
          if (angular.isArray($scope.blacklist)) {
            $scope.suggestions = $scope.suggestions.filter(function (suggestion) {
              return $scope.blacklist.indexOf(suggestion) === -1;
            });
          }
          return $scope.suggestions;
        };

        /**
         * update suggestions whenever the filter text change
         */
        $scope.$watch(function () {
          return KscCtrl.getSearchText();
        }, updateSuggestions);

        /**
         * update suggestions whenever the blacklisted items change
         */
        $scope.$watchCollection('blacklist', updateSuggestions);


        /**
         * get the selected index from the keyselect controller
         */
				$scope.selectedIndex = KscCtrl.getSelectedIndex();

        /**
         * update the selected index whenever the index in the keyselect controller changes
         */
        $scope.$watch(function () {
          return KscCtrl.getSelectedIndex();
        }, function (selectedIndex) {
          $scope.selectedIndex = selectedIndex;
        }); 
				
        /**
         * selects a tag for the list
         *
         * @param {string} the tag
         * @param {event} the event that triggered the selection
         */
        $scope.selectTag = function (tag, evt) {
          evt.stopPropagation();
          evt.preventDefault();
          TagsrchCtrl.addTag(tag);
          KscCtrl.reset();
        };
			}
		};
	}]);

/**
 * The MIT License
 *
 * Copyright (c) 2015 Nikolas Schmidt-Voigt, http://nikolassv.de
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
 /**
 * directive: tagsearch
 *
 * a directive that shows a text input for tags. It takes three parameters:

 * @param {array.<string>} allTags a list of all tags that are currently used in the system. the user may
 *    enter other tags too, but the tags in the allTags parameter are shown in a
 *    suggest box under the input field.
 * @param {array.<string>} selectedTags a list of all the tags currently selected by the user.
 * @param {function} onTagListChange function that will be invoked whenever the list
 *    of selected tags change.
 */
angular.module('angular-nsv-tagsearch')
	.directive('tagsearch', function () {
		return {
			restrict : 'EA',
			templateUrl : 'views/tagsearchView.html',
      scope : {
        allTags : '=',
        selectedTags : '=',
        onTaglistChange : '&'
      },
			controller : ['$scope', function ($scope) {
				var thisCtrl = this;
				$scope.selectedTags = [];

        /**
         * whether the tag list has the focus
         */
        $scope.hasFocus = false;

        /**
         * removes a tag inside the last and return its label
         *
         * @param {number} i index of the tag in the list
         * @param {event} evt
         */
				thisCtrl.removeTag = function (i, evt) {
					evt.stopPropagation();
					var removedTag = $scope.selectedTags.splice(i,1);
          $scope.$broadcast('taglist-changed-remove');
          $scope.onTaglistChange();
          return removedTag;
				};

        /**
         * removes the last tag and returns its label
         */
				thisCtrl.removeLast = function () {
					var removedTag = $scope.selectedTags.pop();
          $scope.$broadcast('taglist-changed-remove');
          $scope.onTaglistChange();
          return removedTag;
				};

        /**
         * add a tag to the list and return its label
         *
         * @param {string} tagStr
         */
				thisCtrl.addTag = function (tagStr) {
					tagStr = (''+tagStr)
								.replace(/^#/,'')
								.replace(/ /, '');
					if (tagStr.length > 0) {
						if ($scope.selectedTags.indexOf(tagStr) === -1) {
							$scope.selectedTags.push(tagStr);
						}
					}
          $scope.$broadcast('taglist-changed-add');
          $scope.onTaglistChange();
					return $scope.selectedTags;
				};

        /**
         * set focus
         */
        thisCtrl.setFocus = function () {
          $scope.hasFocus = true;
        };

        /**
         * remove focus
         */
        thisCtrl.removeFocus = function () {
          $scope.hasFocus = false;
        };
			}],
      
			link : function ($scope, $element, $attrs, ctrl) {
				$scope.removeTag = ctrl.removeTag;
        $scope.addTag = ctrl.addTag;
        $scope.checkInput = ctrl.checkInput;
			}

		};
	});

/**
 * The MIT License
 *
 * Copyright (c) 2015 Nikolas Schmidt-Voigt, http://nikolassv.de
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
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
      scope : true,
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
				
				/**
				 * react to click on parent
				 */
				$element.parents('tagsearch,[tagsearch],[data-tagsearch]').on('click', function () {
					$element.focus();
				});

        /**
         * add focus class to tagsearch element
         */
        $element.on('focus', function () {
          TagSearchCtrl.setFocus();
          KscCtrl.reset();
          $scope.$apply();
        });

        /**
         * remove focus class on blur
         */
        $element.on('blur', function () {
          TagSearchCtrl.removeFocus();
          $scope.$apply();
        });
				
				/**
				 * react to changes in the search text
				 */
				$scope.$watch('searchText', function (searchtext) {
          setEqualWidth();
          KscCtrl.setSearchText(searchtext);
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
              } 

              TagSearchCtrl.addTag($scope.searchText);
              $scope.searchText = '';
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

        /**
         * check whether the searchtext contains a tag and add it to the list
         */
        $scope.checkInput = function () {
					// add the current search text as a new tag, if it ends with whitespace
					var parts = $scope.searchText.match(/(.*)\s$/);
					if (angular.isArray(parts)) {
						TagSearchCtrl.addTag(parts[1]);
            $scope.searchText = '';
					}
        };

        /**
         * erase the search text when an tag has been added to the list
         */
        $scope.$on('taglist-changed-add', function () {
          $scope.searchText = '';
        });
			}
		};
	});

/**
 * The MIT License
 *
 * Copyright (c) 2015 Nikolas Schmidt-Voigt, http://nikolassv.de
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
angular.module('cabocabo', [
  'cards',
  'angular-nsv-tagsearch'
]);

/**
 * The MIT License
 *
 * Copyright (c) 2015 Nikolas Schmidt-Voigt, http://nikolassv.de
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
 angular.module('cabocabo').controller('MainCtrl', [
  '$log', '$scope', 'CardsService', 'search.SearchService',
  function ($log, $scope, CardsService, SearchService) {
    /**
     * watch a card and save derigistration function
     *
     * @param {CardModel}
     */
    function watchCard (card) {
      $scope.$watch(
        function () {
          return card.content;
        },
        function () {
          SearchService.indexText(card.id, card.content);
          $scope.search();
        }
      );
    }
    
    /**
     * watch all existing cards
     */
    angular.forEach(CardsService.getAll(), watchCard);
  
    /********************************
     * define scope vars
     ********************************/

    /**
     * list of cards to show in the deck
     * @type {array.<Card>}
     */
    $scope.cardList = CardsService.getAll();

    /**
     * the currently selected tags
     * @type {array.<string>}
     */
    $scope.selectedTags = [];

    /**
     * a list with all the available tags 
     * @type {array.<string>}
     */
    $scope.allTags = SearchService.getAllTags();

    /**
     * the list of tags may change when the content of the cards changes. we will
     * update the list of all the tags accordingly
     */
    $scope.$watch(function () {
      return SearchService.getAllTags().length;
    }, function () {
      $scope.allTags = SearchService.getAllTags();
    });

    /********************************
     * define scope functions
     ********************************/

    /**
     * add a new card to the list
     */
    $scope.addCard = function (card) {
      CardsService.add(card);
      watchCard(card);
      $scope.search();
    };

    /**
     * set the search phrase to a certain tag and do a search
     * 
     * @param {string} tag
     */
    $scope.searchForTag = function (tag) {
      tag = (''+tag)
            .replace(/^#/,'')
            .replace(/ /, '');
      $scope.selectedTags.push(tag);
      $scope.search();
    };

    /**
     * do a search for all the tags in the current search phrase
     */
    $scope.search = function () {
      if (angular.isArray($scope.selectedTags) && ($scope.selectedTags.length > 0)) {
        var ids = SearchService.getIdsForTags($scope.selectedTags);
        $scope.cardList = CardsService.getByIds(ids);
      } else {
        $scope.cardList = CardsService.getAll();
      }
    };
  }
]);
