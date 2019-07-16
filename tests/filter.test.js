describe('filter.js', function() {
  const filter = require("../lib/filter.js");
  const redmine = require('../lib/redmine');

  it("should create issues filters from options", function() {
    const options = {
      priority: 'High',
      status: 'New',
      tracker: 'Bug',
      me: true,
      open: true,
      closed: true,
    };

    jest.spyOn(redmine, 'getPriorityIdByName').mockReturnValue(1);
    jest.spyOn(redmine, 'getStatusIdByName').mockReturnValue(1);
    jest.spyOn(redmine, 'getTrackerIdByName').mockReturnValue(1);

    const actual = filter.issuesFiltersFrom(options);
    const expected = {
      priority_id: 1,
      assigned_to_id: 'me',
      status_id: 'closed',
      tracker_id: 1,
    };

    expect(actual).toEqual(expected);
  });

});
