describe('printer.js', function() {
  const printer = require("../lib/printer.js");
  const tmpl = require('../lib/template-engine.js');

  it("should print successfully connected", function() {
    const user = { login: 'login' };

    jest.spyOn(console, 'log').mockImplementation(() => {});

    printer.printSuccessfullyConnected('url', user)

    expect(console.log).toHaveBeenCalledWith('Successfully connected \'login\' to \'url\'.');
  });

  it("should print projects", function() {
    const projects = { projects: [] };
    const out = 'output';

    jest.spyOn(tmpl, 'renderFile').mockReturnValue(out);
    jest.spyOn(console, 'log').mockImplementation(() => {});

    printer.printProjects(projects);

    expect(tmpl.renderFile).toHaveBeenCalledWith('template/projects.tmpl', projects);
    expect(console.log).toHaveBeenCalledWith(out);
  });

  it("should print project", function() {
    const project = { project: {} };
    const out = 'output';

    jest.spyOn(tmpl, 'renderFile').mockReturnValue(out);
    jest.spyOn(console, 'log').mockImplementation(() => {});

    printer.printProject(project);

    expect(tmpl.renderFile).toHaveBeenCalledWith('template/project.tmpl', project);
    expect(console.log).toHaveBeenCalledWith(out);
  });

  it("should print issues", function() {
    const issues = { issues: [] };
    const out = 'output';

    jest.spyOn(tmpl, 'renderFile').mockReturnValue(out);
    jest.spyOn(console, 'log').mockImplementation(() => {});

    printer.printIssues(issues);

    expect(tmpl.renderFile).toHaveBeenCalledWith('template/issues.tmpl', issues);
    expect(console.log).toHaveBeenCalledWith(out);
  });

  it("should print issue", function() {
    const issue = { issue: {} };
    const out = 'output';

    jest.spyOn(tmpl, 'renderFile').mockReturnValue(out);
    jest.spyOn(console, 'log').mockImplementation(() => {});

    printer.printIssue(issue);

    expect(tmpl.renderFile).toHaveBeenCalledWith('template/issue.tmpl', issue);
    expect(console.log).toHaveBeenCalledWith(out);
  });

  it("should print statuses", function() {
    const statuses = { statuses: [] };
    const out = 'output';

    jest.spyOn(tmpl, 'renderFile').mockReturnValue(out);
    jest.spyOn(console, 'log').mockImplementation(() => {});

    printer.printStatuses(statuses);

    expect(tmpl.renderFile).toHaveBeenCalledWith('template/statuses.tmpl', statuses);
    expect(console.log).toHaveBeenCalledWith(out);
  });

  it("should print trackers", function() {
    const trackers = { trackers: [] };
    const out = 'output';

    jest.spyOn(tmpl, 'renderFile').mockReturnValue(out);
    jest.spyOn(console, 'log').mockImplementation(() => {});

    printer.printTrackers(trackers);

    expect(tmpl.renderFile).toHaveBeenCalledWith('template/trackers.tmpl', trackers);
    expect(console.log).toHaveBeenCalledWith(out);
  });

  it("should print priorities", function() {
    const priorities = { priorities: [] };
    const out = 'output';

    jest.spyOn(tmpl, 'renderFile').mockReturnValue(out);
    jest.spyOn(console, 'log').mockImplementation(() => {});

    printer.printPriorities(priorities);

    expect(tmpl.renderFile).toHaveBeenCalledWith('template/priorities.tmpl', priorities);
    expect(console.log).toHaveBeenCalledWith(out);
  });

  it("should print users", function() {
    const users = { users: [] };
    const out = 'output';

    jest.spyOn(tmpl, 'renderFile').mockReturnValue(out);
    jest.spyOn(console, 'log').mockImplementation(() => {});

    printer.printUsers(users);

    expect(tmpl.renderFile).toHaveBeenCalledWith('template/users.tmpl', users);
    expect(console.log).toHaveBeenCalledWith(out);
  });

  it("should print user", function() {
    const user = { user: {} };
    const out = 'output';

    jest.spyOn(tmpl, 'renderFile').mockReturnValue(out);
    jest.spyOn(console, 'log').mockImplementation(() => {});

    printer.printUser(user);

    expect(tmpl.renderFile).toHaveBeenCalledWith('template/user.tmpl', user);
    expect(console.log).toHaveBeenCalledWith(out);
  });

});
