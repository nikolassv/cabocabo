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
