const redmine = require('./redmine.js');
const printer = require('./printer.js');
const filter = require('./filter.js');

exports.handleConnect = async function(url, apiKey) {
  try {
    const user = redmine.connect(url, apiKey);
    printer.printSuccessfullyConnected(url, user);
  } catch(err) {
    console.error(err);
  }
}

exports.handleProjects = async function() {
  try {
    const projects = await redmine.getProjects();
    printer.printProjects(projects);
  } catch(err) {
    console.error(err);
  }
}

exports.handleHistory = async function(options) {

  printer.printConnections(await redmine.history(options))
}

exports.handleProject = async function(identifier) {
  try {
    const project = await redmine.getProject(identifier);
    const roles = await redmine.getProjectMembershipsGroupedByRole(identifier);

    project.roles = roles;

    printer.printProject(project);
  } catch(err) {
    console.error(err);
  }
}

exports.handleUpdateProject = async function(identifier, options) {
  try {
    await redmine.updateProject(identifier, options);
    console.log(`Successfully updated ${identifier}`);
  } catch(err) {
    console.error(err);
  }
}

exports.handleCreateProject = async function(name, identifier, options) {
  try {
    const project = await redmine.createProject(name, identifier, options);
    console.log(`Successfully created ${project.project.identifier}`);
  } catch(err) {
    console.error(err);
  }
}

exports.handleIssues = async function(options) {
  try {
    const filters = filter.issuesFiltersFrom(options);
    const issues = await redmine.getIssues(filters);
    printer.printIssues(issues);
  } catch(err) {
    console.error(err);
  }
}

exports.handleIssue = async function(id, options) {
  try {
    const issue = await redmine.getIssue(id, options);
    printer.printIssue(issue.issue);
  } catch(err) {
    console.error(err);
  }
}

exports.handleUpdateIssue = async function(id, options) {
  try {
    await redmine.updateIssue(id, options);
    console.log(`Successfully updated #${id}`);
  } catch(err) {
    console.error(err);
  }
}

exports.handleCreateIssue = async function(project, subject, options) {
  try {
    const issue = await redmine.createIssue(project, subject, options);
    console.log(`Successfully created #${issue.issue.id}`);
  } catch(err) {
    console.error(err);
  }
}

exports.handleStatuses = async function(options) {
  try {
    const statuses = await redmine.getStatuses();
    printer.printStatuses(statuses);
  } catch(err) {
    console.error(err);
  }
}

exports.handleTrackers = async function(options) {
  try {
    const trackers = await redmine.getTrackers();
    printer.printTrackers(trackers);
  } catch(err) {
    console.error(err);
  }
}

exports.handlePriorities = async function(options) {
  try {
    const priorities = await redmine.getPriorities();
    printer.printPriorities(priorities);
  } catch(err) {
    console.error(err);
  }
}

exports.handleUsers = async function(options) {
  try {
    const users = await redmine.getUsers();
    printer.printUsers(users);
  } catch(err) {
    console.error(err);
  }
}

exports.handleUser = async function(id) {
  try {
    const user = await redmine.getUser(id);
    printer.printUser(user.user);
  } catch(err) {
    console.error(err);
  }
}

exports.handleOpen = async function(id) {
  try {
    redmine.open(id);
  } catch(err) {
    console.error(err);
  }
}
