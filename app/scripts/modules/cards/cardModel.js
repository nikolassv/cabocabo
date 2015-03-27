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
