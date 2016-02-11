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
  function CardModel() {
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
