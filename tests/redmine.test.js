describe('redmine.js', function() {
  var rewire = require('rewire');
  var redmine = rewire("../lib/redmine.js");

  it("should throw when not connected", function() {
    const nconf = require('nconf');
    jest.spyOn(nconf, 'get').mockReturnValue(null);

    var throwWhenNotConnected = redmine.__get__('throwWhenNotConnected');

    expect(throwWhenNotConnected).toThrow('Not connected.');
  });

  /*it("should get data from path", async function() {
    var get = redmine.__get__('get');

    var request = function(){return 'data'};
    redmine.__set__('request', request);

    var actual = await get('/path', 'url', 'apiKey');
    var expected = 'data';

    expect(actual).toEqual(expected);
  });

  it("should put data to path", async function() {
    var put = redmine.__get__('put');

    var request = function(){return 'data'};
    redmine.__set__('request', request);

    var actual = await put('/path', {data: 'data'});
    var expected = 'data';

    expect(actual).toEqual(expected);
  });

  it("should post data to path", async function() {
    var post = redmine.__get__('post');

    var request = function(){return 'data'};
    redmine.__set__('request', request);

    var actual = await post('/path', {data: 'data'});
    var expected = 'data';

    expect(actual).toEqual(expected);
  });

  it("should connect", async function() {
    var user = {user: {}};
    var response = { getBody : function(){return JSON.stringify(user)}};
    redmine.__set__('get', function(){return response;});

    var nconf = redmine.__get__('nconf');
    jest.spyOn(nconf, 'save').mockImplementation(() => {});

    var actual = await redmine.connect('url', 'apiKey');
    var expected = user.user;

    expect(actual).toEqual(expected);
    expect(nconf.save).toHaveBeenCalled();
  });

  it("should throw on invalid result", async function() {
    var user = {invalid: {}};
    var response = { getBody : function(){return JSON.stringify(user)}};
    redmine.__set__('get', function(){return response;});

    await expect(redmine.connect).toThrow();
  });

  it("should get projects", async function() {
    var projects = {projects: []};
    var response = { getBody : function(){return JSON.stringify(projects)}};
    redmine.__set__('get', function(){return response;});

    var actual = await redmine.getProjects();
    var expected = projects;

    expect(actual).toEqual(expected);
  });

  it("should get project", async function() {
    var project = {project: {}};
    var response = { getBody : function(){return JSON.stringify(project)}};
    redmine.__set__('get', function(){return response;});

    var actual = await redmine.getProject('identifier');
    var expected = project;

    expect(actual).toEqual(expected);
  });

  it("should update project", async function() {
    var put = jest.fn();
    put.mockReturnValue({statusCode:200});
    redmine.__set__('put', put);

    var options = {
      description: 'Description', public: true, parent: '1'
    };

    await redmine.updateProject('identifier', options);
  });

  it("should update project and throw error", async function() {
    var put = jest.fn();
    put.mockReturnValue({statusCode:500});
    redmine.__set__('put', put);

    var options = {};

    await expect(redmine.updateProject.bind(this, 'identifier', options))
      .toThrow('Could not update project:\nServer responded with statuscode 500');
  });

  it("should create project", async function() {
    var project = {project:{identifier:'project'}};
    var post = jest.fn();
    post.mockReturnValue({statusCode:201,
                    getBody: function(){return JSON.stringify(project)}});
    redmine.__set__('post', post);

    var options = {
      description: 'Description', public: true, parent: '1'
    };

    var actual = await redmine.createProject('name', 'identifier', options);
    var expected = project;

    expect(actual).toEqual(expected);
  });

  it("should create project and throw error", async function() {
    var post = jest.fn();
    post.mockReturnValue({statusCode:500});
    redmine.__set__('post', post);

    var options = {};

    expect(redmine.createProject.bind(this, 'name', 'identifier', options))
      .toThrow('Could not create project:\nServer responded with statuscode 500');
  });

  it("should get project memberships", async function() {
    var memberships = {memberships: []};
    var response = { getBody : function(){return JSON.stringify(memberships)}};
    redmine.__set__('get', function(){return response;});

    var actual = await redmine.getProjectMemberships('identifier');
    var expected = memberships;

    expect(actual).toEqual(expected);
  });

  it("should get project memberships grouped by role", async function() {
    var memberships = {memberships: [
                        {user:{name:'Member1'},roles:[{name:'Role1'}]},
                        {user:{name:'Member2'},roles:[{name:'Role2'}]},
                        {user:{name:'Member3'},roles:[{name:'Role1'},{name:'Role2'}]},
                        {user:{name:'Member4'},roles:[{name:'Role1'}]}
                      ]};
    var response = { getBody : function(){return JSON.stringify(memberships)}};
    redmine.__set__('get', function(){return response;});

    var actual = await redmine.getProjectMembershipsGroupedByRole('identifier');
    var expected = {'Role1':{name:'Role1',
                             members:['Member1','Member3','Member4']},
                    'Role2':{name:'Role2',
                             members:['Member2','Member3']}};

    expect(actual).toEqual(expected);
  });

  it("should get issues", async function() {
    var issues = {issues: []};
    var response = { getBody : function(){return JSON.stringify(issues)}};
    redmine.__set__('get', function(){return response;});

    var actual = await redmine.getIssues();
    var expected = issues;

    expect(actual).toEqual(expected);
  });

  it("should get issue", async function() {
    var issue = {issue: {journals: []}};
    var response = { getBody : function(){return JSON.stringify(issue)}};
    redmine.__set__('get', function(){return response;});

    var actual = await redmine.getIssue(1, {history: true});
    var expected = issue;

    expect(actual).toEqual(expected);
  });

  it("should update issue", async function() {
    var put = jest.fn();
    put.mockReturnValue({statusCode:200});
    redmine.__set__('put', put);

    jest.spyOn(redmine, 'getPriorityIdByName').mockReturnValue(1);
    jest.spyOn(redmine, 'getStatusIdByName').mockReturnValue(1);
    jest.spyOn(redmine, 'getTrackerIdByName').mockReturnValue(1);

    var options = {
      priority: 'High', status: 'New', tracker: 'Bug', assignee: 1,
      subject: 'Subject', description: 'Description'
    };

    await redmine.updateIssue(1, options);

    expect(put).toHaveBeenCalled();
  });

  it("should update issue and throw error", async function() {
    var put = jest.fn();
    put.mockReturnValue({statusCode:500});
    redmine.__set__('put', put);

    var options = {};

    await expect(redmine.updateIssue.bind(this, 1, options))
      .toThrow('Could not update issue:\nServer responded with statuscode 500');
  });

  it("should create issue", async function() {
    var issue = {issue:{id:1}};
    var post = jest.fn();
    post.mockReturnValue({statusCode:201,
                    getBody: function(){return JSON.stringify(issue)}});
    redmine.__set__('post', post);

    jest.spyOn(redmine, 'getPriorityIdByName').mockReturnValue(1);
    jest.spyOn(redmine, 'getStatusIdByName').mockReturnValue(1);
    jest.spyOn(redmine, 'getTrackerIdByName').mockReturnValue(1);

    var options = {
      priority: 'High', status: 'New', tracker: 'Bug',
      assignee: 1, description: 'Description'
    };

    var actual = await redmine.createIssue('project', 'subject', options);
    var expected = issue;

    expect(actual).toEqual(expected);
  });

  it("should create issue and warn on 404", async function() {
    var post = jest.fn();
    post.mockReturnValue({statusCode:404});
    redmine.__set__('post', post);

    var options = {};

    await expect(redmine.createIssue.bind(this, 'project', 'subject', options))
      .toThrow('Could not create issue:\nServer responded with statuscode 404.\nThis is most likely the case when the specified project does not exist.\nDoes project \'project\' exist?');
  });

  it("should create issue and throw error", async function() {
    var post = jest.fn();
    post.mockReturnValue({statusCode:500});
    redmine.__set__('post', post);

    var options = {};

    await expect(redmine.createIssue.bind(this, 'project', 'subject', options))
      .toThrow('Could not create issue:\nServer responded with statuscode 500');
  });


  it("should get statuses", async function() {
    var statuses = {issue_statuses: []};
    var response = { getBody : function(){return JSON.stringify(statuses)}};
    redmine.__set__('get', function(){return response;});

    var actual = await redmine.getStatuses();
    var expected = statuses;

    expect(actual).toEqual(expected);
  });

  it("should get status id by name", async function() {
    var statuses = {issue_statuses: [{id:1, name: 'name'}]};
    jest.spyOn(redmine, 'getStatuses').mockReturnValue(statuses);

    var actual = await redmine.getStatusIdByName('name');
    var expected = 1;

    expect(actual).toEqual(expected);
  });

  it("should get status name by id", async function() {
    var statuses = {issue_statuses: [{id:1, name: 'name'}]};
    jest.spyOn(redmine, 'getStatuses').mockReturnValue(statuses);

    var actual = await redmine.getStatusNameById(1);
    var expected = 'name';

    expect(actual).toEqual(expected);
  });

  it("should get trackers", async function() {
    var trackers = {trackers: []};
    var response = { getBody : function(){return JSON.stringify(trackers)}};
    redmine.__set__('get', function(){return response;});

    var actual = await redmine.getTrackers();
    var expected = trackers;

    expect(actual).toEqual(expected);
  });

  it("should get tracker id by name", async function() {
    var trackers = {trackers: [{id:1, name: 'name'}]};
    jest.spyOn(redmine, 'getTrackers').mockReturnValue(trackers);

    var actual = await redmine.getTrackerIdByName('name');
    var expected = 1;

    expect(actual).toEqual(expected);
  });

  it("should get tracker name by id", async function() {
    var trackers = {trackers: [{id:1, name: 'name'}]};
    jest.spyOn(redmine, 'getTrackers').mockReturnValue(trackers);

    var actual = await redmine.getTrackerNameById(1);
    var expected = 'name';

    expect(actual).toEqual(expected);
  });

  it("should get priorities", async function() {
    var priorities = {issue_priorities: []};
    var response = { getBody : function(){return JSON.stringify(priorities)}};
    redmine.__set__('get', function(){return response;});

    var actual = await redmine.getPriorities();
    var expected = priorities;

    expect(actual).toEqual(expected);
  });

  it("should get priority id by name", async function() {
    var priorities = {issue_priorities: [{id:1, name: 'name'}]};
    jest.spyOn(redmine, 'getPriorities').mockReturnValue(priorities);

    var actual = await redmine.getPriorityIdByName('name');
    var expected = 1;

    expect(actual).toEqual(expected);
  });

  it("should get priority name by id", async function() {
    var priorities = {issue_priorities: [{id:1, name: 'name'}]};
    jest.spyOn(redmine, 'getPriorities').mockReturnValue(priorities);

    var actual = await redmine.getPriorityNameById(1);
    var expected = 'name';

    expect(actual).toEqual(expected);
  });

  it("should get users", async function() {
    var users = {users: []};
    var response = { getBody : function(){return JSON.stringify(users)}};
    redmine.__set__('get', function(){return response;});

    var actual = await redmine.getUsers();
    var expected = users;

    expect(actual).toEqual(expected);
  });

  it("should get user", async function() {
    var user = {user: {}};
    var response = { getBody : function(){return JSON.stringify(user)}};
    redmine.__set__('get', function(){return response;});

    var actual = await redmine.getUser();
    var expected = user;

    expect(actual).toEqual(expected);
  });

  it("should get assignee name by id", async function() {
    var users = {users: [{id:1, firstname: 'first', lastname: 'last'}]};
    jest.spyOn(redmine, 'getUsers').mockReturnValue(users);

    var actual = await redmine.getAssigneeNameById(1);
    var expected = 'first last';

    expect(actual).toEqual(expected);
  });

  it("should open url in browser", async function() {
    var openInBrowser = jest.fn();
    redmine.__set__('openInBrowser', openInBrowser);

    var nconf = redmine.__get__('nconf');
    jest.spyOn(nconf, 'get').mockReturnValue('url');

    await redmine.open(1);

    expect(openInBrowser).toHaveBeenCalledWith('url/issues/1');
  });*/

  /*it('could not resolve status id by name', function() {
    var statuses = {issue_statuses: []};
    jest.spyOn(redmine, 'getStatuses').mockReturnValue(statuses);

    expect(redmine.getStatusIdByName.bind(this, 'name'))
      .toThrow('\'name\' is no valid status.');
  });

  it('could not resolve tracker id by name', function() {
    var trackers = { trackers: [] };
    redmine.__set__('getTrackers', function() { return trackers; });

    expect(redmine.getTrackerIdByName.bind(this, 'name'))
      .toThrow('\'name\' is no valid tracker.');
  });

  it('could not resolve priority id by name', function() {
    var priorities = {issue_priorities: []};
    redmine.__set__('getPriorities', function() { return priorities; });

    expect(redmine.getPriorityIdByName.bind(this, 'name'))
      .toThrow('\'name\' is no valid priority.');
  });*/

  /*it('could not resolve status name by id', async function() {
    var statuses = {issue_statuses: []};
    
    jest.spyOn(redmine, 'getStatuses').mockReturnValue(statuses);

    await expect(redmine.getStatusNameById.bind(this, 1))
      .toThrow('\'1\' is no valid status id.');
  });

  it('could not resolve tracker name by id', async function() {
    var trackers = {trackers: []};

    jest.spyOn(redmine, 'getTrackers').mockReturnValue(trackers);

    await expect(redmine.getTrackerNameById.bind(this, 1))
      .toThrow('\'1\' is no valid tracker id.');
  });

  it('could not resolve priority name by id', async function() {
    var priorities = {issue_priorities: []};

    jest.spyOn(redmine, 'getPriorities').mockReturnValue(priorities);

    await expect(redmine.getPriorityNameById.bind(this, 1))
      .toThrow('\'1\' is no valid priority id.');
  });

  it('could not resolve assignee name by id', async function() {
    var users = {users: []};

    jest.spyOn(redmine, 'getUsers').mockReturnValue(users);

    await expect(redmine.getAssigneeNameById.bind(this, 1))
      .toThrow('\'1\' is no valid assignee id.');
  });

  describe('throws (on error in response)', async function() {
    var redmine = rewire("../lib/redmine.js")

    //before all
    var response = { getBody : function(){return undefined;}};
    redmine.__set__('get', function(){return response;});
    redmine.__set__('throwWhenNotConnected', function(){});

    it('could not connect', async function(){
      await expect(redmine.connect.bind(this, 'server'))
        .toThrow('Connection to \'server\' failed.');
    });

    it('could not load projects', async function(){
      await expect(redmine.getProjects).toThrow('Could not load projects.');
    });

    it('could not load project', async function(){
      await expect(redmine.getProject).toThrow('Could not load project.');
    });

    it('could not load issues', async function(){
      await expect(redmine.getIssues).toThrow('Could not load issues.');
    });

    it('could not load issue', async function(){
      await expect(redmine.getIssue.bind(this, 1, {history: true})).toThrow('Could not load issue.');
    });

    it('could not load project memberships', async function(){
      await expect(redmine.getProjectMemberships).toThrow('Could not load project memberships.');
    });

    it('could not load statuses', async function(){
      await expect(redmine.getStatuses).toThrow('Could not load issue statuses.');
    });

    it('could not load trackers', async function(){
      await expect(redmine.getTrackers).toThrow('Could not load trackers.');
    });

    it('could not load priorities', async function(){
      await expect(redmine.getPriorities).toThrow('Could not load issue priorities.');
    });

    it('could not load users', async function(){
      await expect(redmine.getUsers).toThrow('Could not load users.');
    });

    it('could not load user', async function(){
      await expect(redmine.getUser).toThrow('Could not load user.');
    });
  });*/
});
