describe('search module: ', function () {
  beforeEach(module('search'));

  describe('the search service', function () {
    var SearchService;

    beforeEach(inject(function($injector) {
      SearchService = $injector.get('search.SearchService');
    }));

    it('should extract tags from text', function () {
      var tags = SearchService.extractTagsFromText('dies ist #ein #text.#mit tags.');
      expect(tags.size()).toEqual(3);
      expect(tags.contains('ein')).toBeTruthy();
      expect(tags.contains('text')).toBeTruthy();
      expect(tags.contains('dies')).toBeFalsy();
    });
  });
});
