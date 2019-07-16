describe('actions.js', function() {
  const actions = require('../lib/actions');

  const redmine = require('../lib/redmine');
  const printer = require('../lib/printer');
  const filter = require('../lib/filter');

  it("should handle connect", async function() {
    const user = {user: 'name'};

    jest.spyOn(redmine, 'connect').mockReturnValue(user);
    jest.spyOn(printer, 'printSuccessfullyConnected').mockImplementation(() => {});

    await actions.handleConnect('url', 'apiKey');

    expect(redmine.connect).toHaveBeenCalledWith('url', 'apiKey');
    expect(printer.printSuccessfullyConnected).toHaveBeenCalledWith('url', user);
  });

  it("should handle connect and catch error", async function() {
    jest.spyOn(redmine, 'connect').mockImplementation(() => { throw 'error' });
    jest.spyOn(console, 'error').mockImplementation(() => {});

    await actions.handleConnect();

    expect(console.error).toHaveBeenCalledWith('error');
  });

  it("should handle projects", async function() {
    const projects = { projects: [] };

    jest.spyOn(redmine, 'getProjects').mockReturnValue(projects);
    jest.spyOn(printer, 'printProjects').mockImplementation(() => {});

    await actions.handleProjects();

    expect(redmine.getProjects).toHaveBeenCalled();
    expect(printer.printProjects).toHaveBeenCalledWith(projects);
  });

  it("should handle projects and catch error", async function() {
    jest.spyOn(redmine, 'getProjects').mockImplementation(() => { throw 'error' });
    jest.spyOn(console, 'error').mockImplementation(() => {});

    await actions.handleProjects();

    expect(console.error).toHaveBeenCalledWith('error');
  });

  it("should handle project", async function() {
    const project = { project: {} };
    const roles = { roles: [] };

    jest.spyOn(redmine, 'getProject').mockReturnValue(project);
    jest.spyOn(redmine, 'getProjectMembershipsGroupedByRole').mockReturnValue(roles);
    jest.spyOn(printer, 'printProject').mockImplementation(() => {});

    await actions.handleProject('project');

    expect(project.roles).toEqual(roles);
    expect(redmine.getProject).toHaveBeenCalledWith('project');
    expect(printer.printProject).toHaveBeenCalledWith(project);
  });

  it("should handle project and catch error", async function() {
    jest.spyOn(redmine, 'getProject').mockImplementation(() => { throw 'error' });
    jest.spyOn(console, 'error').mockImplementation(() => {});

    await actions.handleProject();

    expect(console.error).toHaveBeenCalledWith('error');
  });

  it("should handle update project", async function() {
    const options = { options: [] };

    jest.spyOn(redmine, 'updateProject').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});

    await actions.handleUpdateProject('identifier', options);

    expect(redmine.updateProject).toHaveBeenCalledWith('identifier', options);
    expect(console.log).toHaveBeenCalledWith('Successfully updated identifier');
  });

  it("should handle update project and catch error", async function() {
    jest.spyOn(redmine, 'updateProject').mockImplementation(() => { throw 'error' });
    jest.spyOn(console, 'error').mockImplementation(() => {});

    await actions.handleUpdateProject();

    expect(console.error).toHaveBeenCalledWith('error');
  });

  it("should handle create project", async function() {
    const options = { options: [] };

    jest.spyOn(redmine, 'createProject').mockReturnValue({
      project: {
        identifier: 'project'
      }
    });
    jest.spyOn(console, 'log').mockImplementation(() => {});

    await actions.handleCreateProject('name', 'identifier', options);

    expect(redmine.createProject).toHaveBeenCalledWith('name', 'identifier', options);
    expect(console.log).toHaveBeenCalledWith('Successfully created project');
  });

  it("should handle create project and catch error", async function() {
    jest.spyOn(redmine, 'createProject').mockImplementation(() => { throw 'error' });
    jest.spyOn(console, 'error').mockImplementation(() => {});

    await actions.handleCreateProject();

    expect(console.error).toHaveBeenCalledWith('error');
  });

  it("should handle issues", async function() {
    const issues = { issues: [] };
    const filters = [{}];

    jest.spyOn(filter, 'issuesFiltersFrom').mockReturnValue(filters)
    jest.spyOn(redmine, 'getIssues').mockReturnValue(issues);
    jest.spyOn(printer, 'printIssues').mockImplementation(() => {});

    await actions.handleIssues();

    expect(redmine.getIssues).toHaveBeenCalledWith(filters);
    expect(printer.printIssues).toHaveBeenCalledWith(issues);
  });

  it("should handle issues and catch error", async function() {
    jest.spyOn(filter, 'issuesFiltersFrom').mockImplementation(() => { throw 'error' });
    jest.spyOn(console, 'error').mockImplementation(() => {});

    await actions.handleIssues();

    expect(console.error).toHaveBeenCalledWith('error');
  });

  it("should handle issue", async function() {
    const issue = { issue: {} };
    const options = { options: [] };

    jest.spyOn(redmine, 'getIssue').mockReturnValue(issue);
    jest.spyOn(printer, 'printIssue').mockImplementation(() => {});

    await actions.handleIssue('id', options);

    expect(redmine.getIssue).toHaveBeenCalledWith('id', options);
    expect(printer.printIssue).toHaveBeenCalledWith(issue.issue);
  });

  it("should handle issue and catch error", async function() {
    jest.spyOn(redmine, 'getIssue').mockImplementation(() => { throw 'error' });
    jest.spyOn(console, 'error').mockImplementation(() => {});

    await actions.handleIssue();

    expect(console.error).toHaveBeenCalledWith('error');
  });

  it("should handle update issue", async function() {
    const options = { options: [] };

    jest.spyOn(redmine, 'updateIssue').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});

    await actions.handleUpdateIssue('id', options);

    expect(redmine.updateIssue).toHaveBeenCalledWith('id', options);
    expect(console.log).toHaveBeenCalledWith('Successfully updated #id');
  });

  it("should handle update issue and catch error", async function() {
    jest.spyOn(redmine, 'updateIssue').mockImplementation(() => { throw 'error' });
    jest.spyOn(console, 'error').mockImplementation(() => {});

    await actions.handleUpdateIssue();

    expect(console.error).toHaveBeenCalledWith('error');
  });

  it("should handle create issue", async function() {
    const options = { options: [] };

    jest.spyOn(redmine, 'createIssue').mockReturnValue({issue:{id:1}});
    jest.spyOn(console, 'log').mockImplementation(() => {});

    await actions.handleCreateIssue('project', 'subject', options);

    expect(redmine.createIssue).toHaveBeenCalledWith('project', 'subject', options);
    expect(console.log).toHaveBeenCalledWith('Successfully created #1');
  });

  it("should handle create issue and catch error", async function() {
    jest.spyOn(redmine, 'createIssue').mockImplementation(() => { throw 'error' });
    jest.spyOn(console, 'error').mockImplementation(() => {});

    await actions.handleCreateIssue();

    expect(console.error).toHaveBeenCalledWith('error');
  });

  it("should handle statuses", async function() {
    const statuses = { statuses: [] };

    jest.spyOn(redmine, 'getStatuses').mockReturnValue(statuses);
    jest.spyOn(printer, 'printStatuses').mockImplementation(() => {});

    await actions.handleStatuses();

    expect(redmine.getStatuses).toHaveBeenCalled();
    expect(printer.printStatuses).toHaveBeenCalledWith(statuses);
  });

  it("should handle statuses and catch error", async function() {
    jest.spyOn(redmine, 'getStatuses').mockImplementation(() => { throw 'error' });
    jest.spyOn(console, 'error').mockImplementation(() => {});

    await actions.handleStatuses();

    expect(console.error).toHaveBeenCalledWith('error');
  });

  it("should handle trackers", async function() {
    const trackers = { trackers: [] };

    jest.spyOn(redmine, 'getTrackers').mockReturnValue(trackers);
    jest.spyOn(printer, 'printTrackers').mockImplementation(() => {});

    await actions.handleTrackers();

    expect(redmine.getTrackers).toHaveBeenCalled();
    expect(printer.printTrackers).toHaveBeenCalledWith(trackers);
  });

  it("should handle trackers and catch error", async function() {
    jest.spyOn(redmine, 'getTrackers').mockImplementation(() => { throw 'error' });
    jest.spyOn(console, 'error').mockImplementation(() => {});

    await actions.handleTrackers();

    expect(console.error).toHaveBeenCalledWith('error');
  });

  it("should handle priorities", async function() {
    const priorities = { priorities: [] };

    jest.spyOn(redmine, 'getPriorities').mockReturnValue(priorities);
    jest.spyOn(printer, 'printPriorities').mockImplementation(() => {});

    await actions.handlePriorities();

    expect(redmine.getPriorities).toHaveBeenCalled();
    expect(printer.printPriorities).toHaveBeenCalledWith(priorities);
  });

  it("should handle priorities and catch error", async function() {
    jest.spyOn(redmine, 'getPriorities').mockImplementation(() => { throw 'error' });
    jest.spyOn(console, 'error').mockImplementation(() => {});

    await actions.handlePriorities();

    expect(console.error).toHaveBeenCalledWith('error');
  });

  it("should handle users", async function() {
    const users = { users: [] };

    jest.spyOn(redmine, 'getUsers').mockReturnValue(users);
    jest.spyOn(printer, 'printUsers').mockImplementation(() => {});

    await actions.handleUsers();

    expect(redmine.getUsers).toHaveBeenCalled();
    expect(printer.printUsers).toHaveBeenCalledWith(users);
  });

  it("should handle users and catch error", async function() {
    jest.spyOn(redmine, 'getUsers').mockImplementationOnce(() => { throw new Error('error') });
    jest.spyOn(console, 'error').mockImplementation(() => {});

    await actions.handleUsers();

    expect(console.error).toHaveBeenCalledWith('error');
  });

  it("should handle user", async function() {
    const user = { user: {} };

    jest.spyOn(redmine, 'getUser').mockReturnValue(user);
    jest.spyOn(printer, 'printUser').mockImplementation(() => {});

    await actions.handleUser();

    expect(redmine.getUser).toHaveBeenCalled();
    expect(printer.printUser).toHaveBeenCalledWith(user.user);
  });

  it("should handle user and catch error", async function() {
    jest.spyOn(redmine, 'getUser').mockImplementation(() => { throw 'error' });
    jest.spyOn(console, 'error').mockImplementation(() => {});

    await actions.handleUser();

    expect(console.error).toHaveBeenCalledWith('error');
  });

  it("should handle open", async function() {
    const projects = { projects: [] };

    jest.spyOn(redmine, 'open').mockImplementation(() => {});

    await actions.handleOpen();

    expect(redmine.open).toHaveBeenCalled();
  });

  it("should handle open and catch error", async function() {
    jest.spyOn(redmine, 'open').mockImplementation(() => { throw 'error' });
    jest.spyOn(console, 'error').mockImplementation(() => {});

    await actions.handleOpen();

    expect(console.error).toHaveBeenCalledWith('error');
  });
});
