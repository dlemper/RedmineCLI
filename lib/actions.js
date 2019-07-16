const redmine = require('./redmine.js');
const printer = require('./printer.js');
const filter = require('./filter.js');

exports.handleConnect = function(url, apiKey) {
  try {
    const user = redmine.connect(url, apiKey);
    printer.printSuccessfullyConnected(url, user);
  } catch(err) {
    console.error(err);
  }
}

exports.handleProjects = function() {
  try {
    const projects = redmine.getProjects();
    printer.printProjects(projects);
  } catch(err) {
    console.error(err);
  }
}

exports.handleHistory = function(options) {

  printer.printConnections(redmine.history(options))
}

exports.handleProject = function(identifier) {
  try {
    const project = redmine.getProject(identifier);
    const roles = redmine.getProjectMembershipsGroupedByRole(identifier);

    project.roles = roles;

    printer.printProject(project);
  } catch(err) {
    console.error(err);
  }
}

exports.handleUpdateProject = function(identifier, options) {
  try {
    redmine.updateProject(identifier, options);
    console.log(`Successfully updated ${identifier}`);
  } catch(err) {
    console.error(err);
  }
}

exports.handleCreateProject = function(name, identifier, options) {
  try {
    const project = redmine.createProject(name, identifier, options);
    console.log(`Successfully created ${project.project.identifier}`);
  } catch(err) {
    console.error(err);
  }
}

exports.handleIssues = function(options) {
  try {
    const filters = filter.issuesFiltersFrom(options);
    const issues = redmine.getIssues(filters);
    printer.printIssues(issues);
  } catch(err) {
    console.error(err);
  }
}

exports.handleIssue = function(id, options) {
  try {
    const issue = redmine.getIssue(id, options);
    printer.printIssue(issue.issue);
  } catch(err) {
    console.error(err);
  }
}

exports.handleUpdateIssue = function(id, options) {
  try {
    redmine.updateIssue(id, options);
    console.log(`Successfully updated #${id}`);
  } catch(err) {
    console.error(err);
  }
}

exports.handleCreateIssue = function(project, subject, options) {
  try {
    const issue = redmine.createIssue(project, subject, options);
    console.log(`Successfully created #${issue.issue.id}`);
  } catch(err) {
    console.error(err);
  }
}

exports.handleStatuses = function(options) {
  try {
    const statuses = redmine.getStatuses();
    printer.printStatuses(statuses);
  } catch(err) {
    console.error(err);
  }
}

exports.handleTrackers = function(options) {
  try {
    const trackers = redmine.getTrackers();
    printer.printTrackers(trackers);
  } catch(err) {
    console.error(err);
  }
}

exports.handlePriorities = function(options) {
  try {
    const priorities = redmine.getPriorities();
    printer.printPriorities(priorities);
  } catch(err) {
    console.error(err);
  }
}

exports.handleUsers = function(options) {
  try {
    const users = redmine.getUsers();
    printer.printUsers(users);
  } catch(err) {
    console.error(err);
  }
}

exports.handleUser = function(id) {
  try {
    const user = redmine.getUser(id);
    printer.printUser(user.user);
  } catch(err) {
    console.error(err);
  }
}

exports.handleOpen = function(id) {
  try {
    redmine.open(id);
  } catch(err) {
    console.error(err);
  }
}
