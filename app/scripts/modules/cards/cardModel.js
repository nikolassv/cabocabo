cards.factory('CardModel', function () {
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
