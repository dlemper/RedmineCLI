var request = require('then-request');
var nconf = require('nconf');
var openInBrowser = require('open');
var querystring = require('querystring');
var resolver = require('./resolver.js');
const os = require('os');
const fs = require('fs-extra');

fs.ensureDirSync(`${os.homedir()}/.redmine-cli`);
nconf.file(`${os.homedir()}/.redmine-cli/config.json`);

var throwWhenNotConnected = function(){
  if(!nconf.get('serverUrl') || !nconf.get('apiKey'))
    throw 'Not connected.'
}

var req = function(method, serverUrl, apiKey, path, options){
  serverUrl = serverUrl || nconf.get('serverUrl');
  apiKey = apiKey || nconf.get('apiKey');

  var url = serverUrl + path;
  options.headers = {'X-Redmine-API-Key': apiKey};
  return request(method, url, options);
}

var get = function(path, serverUrl, apiKey){
  return req('GET', serverUrl, apiKey, path, {});
}

var put = function(path, body){
  return req('PUT', null, null, path, {'json': body});
}

var post = function(path, body){
  return req('POST', null, null, path, {'json': body});
}
exports.history = function (options) {
  _histories = nconf.get("connectionHistory")
  if(options.switch && _histories && _histories.length > options.switch)
  {
    var index = options.switch;

    exports.connect(_histories[index].serverUrl, _histories[index].apiKey)
  }


  return _histories;
}
exports.connect = async function(serverUrl, apiKey){
  var response = await get('/users/current.json', serverUrl, apiKey);

  var user;
  try{
    user = JSON.parse(response.getBody('utf8'));
    if(user.user)
      user = user.user;
    else
      throw 'Invalid result';
  } catch(err) {throw 'Connection to \'' + serverUrl + '\' failed.'};

  nconf.set('serverUrl', serverUrl);
  nconf.set('apiKey', apiKey);

  // save connection history
  connect_history = nconf.get("connectionHistory")
  if(!connect_history)
    connect_history = []

  var found = false;

  for(var _history_index in connect_history){
      _history = connect_history[_history_index];
      
    if(_history.serverUrl == serverUrl){
      _history.apiKey = apiKey
      found = true;
    }
  }

  if(!found) {
    connect_history[connect_history.length] = {"serverUrl": serverUrl, "apiKey": apiKey}
  }

  nconf.set("connectionHistory", connect_history)


  nconf.save();

  return user;
}

exports.getProjects = async function() {
  throwWhenNotConnected();

  var response = await get('/projects.json');
  try{
    return JSON.parse(response.getBody('utf8'));
  } catch(err) {throw 'Could not load projects.'}
}

exports.getProject = async function(identifier) {
  throwWhenNotConnected();

  var response = await get('/projects/'+ identifier +'.json');
  try{
    return JSON.parse(response.getBody('utf8'));
  } catch(err) {throw 'Could not load project.'}
}

exports.updateProject = async function(identifier, options) {
  throwWhenNotConnected();

  try{
    var project = {project:{}};

    if(options.description) project.project.description = options.description;
    if(options.public) project.project.is_public = options.public;
    if(options.parent && typeof options.parent == 'string')
      project.project.parent_id = options.parent;

    var response = await put('/projects/' + identifier + '.json', project);
    if(response.statusCode != 200)
      throw 'Server responded with statuscode ' + response.statusCode;

  } catch(err) {throw 'Could not update project:\n' + err}
}

exports.createProject = async function(name, identifier, options) {
  throwWhenNotConnected();

  try{
    var project = {project:{'name':name,'identifier':identifier}};

    if(options.description) project.project.description = options.description;
    if(options.public) project.project.is_public = true;
    else project.project.is_public = false;
    if(options.parent && typeof options.parent == 'string')
      project.project.parent_id = options.parent;

    var response = await post('/projects.json', project);

    if(response.statusCode != 201)
      throw 'Server responded with statuscode ' + response.statusCode;

    var project = JSON.parse(response.getBody('utf8'));
    return project;
  } catch(err) {throw 'Could not create project:\n' + err}
}

exports.getProjectMemberships = async function(identifier) {
  throwWhenNotConnected();

  var response = await get('/projects/'+ identifier +'/memberships.json');
  try{
    return JSON.parse(response.getBody('utf8'));
  } catch(err) {throw 'Could not load project memberships.'}
}

exports.getProjectMembershipsGroupedByRole = async function(identifier){
  var roles = {};
  var memberships = await exports.getProjectMemberships(identifier).memberships;
  for(var i = 0; i < memberships.length; i++){
    var membership = memberships[i];
    for(var j = 0; j < membership.roles.length; j++){
      var role = membership.roles[j];
      if(!(role.name in roles)) roles[role.name] = {'name': role.name, 'members': []};
      roles[role.name].members.push(membership.user.name);
    }
  }

  return roles;
}

exports.getIssues = async function(filters) {
  throwWhenNotConnected();

  var query = querystring.stringify(filters);
  var response = await get('/issues.json' + (query ? '?' + query : query));
  try{
    return JSON.parse(response.getBody('utf8'));
  } catch(err) {throw 'Could not load issues.'}
}

exports.getIssue = async function(id, options) {
  throwWhenNotConnected();

  var include = '';
  if(options.history)
    include = '?include=journals';
  var response = await get('/issues/'+ id +'.json' + include);
  try{
    var issue = JSON.parse(response.getBody('utf8'));
    if(issue.issue.journals)
      resolver.resolveHistoryIdsToNames(issue.issue);

    return issue;
  } catch(err) {throw 'Could not load issue.'}
}

exports.updateIssue = async function(id, options) {
  throwWhenNotConnected();

  try{
    var issue = {issue:{}};

    if(options.priority)
      issue.issue.priority_id = await exports.getPriorityIdByName(options.priority);
    if(options.assignee) issue.issue.assigned_to_id = options.assignee;
    if(options.status)
      issue.issue.status_id = await exports.getStatusIdByName(options.status);
    if(options.estimated) issue.issue.estimated_hours = options.estimated;
    if(options.tracker)
      issue.issue.tracker_id = await exports.getTrackerIdByName(options.tracker);
    if(options.subject) issue.issue.subject = options.subject;
    if(options.description) issue.issue.description = options.description;
    if(options.notes) issue.issue.notes = options.notes;
    if(options.done_ratio) issue.issue.done_ratio = options.done_ratio;
    if(options.parent_issue) issue.issue.parent_issue_id = options.parent_issue;

    var response = await put('/issues/' + id + '.json', issue);
    if(response.statusCode != 200)
      throw 'Server responded with statuscode ' + response.statusCode;
  } catch(err) {throw 'Could not update issue:\n' + err }
}

exports.createIssue = async function(project, subject, options){
  throwWhenNotConnected();

  try{
    var issue = {issue:{'project_id':project,'subject':subject}};

    if(options.priority)
      issue.issue.priority_id = await exports.getPriorityIdByName(options.priority);
    if(options.assignee) issue.issue.assigned_to_id = options.assignee;
    if(options.status)
      issue.issue.status_id = await exports.getStatusIdByName(options.status);
    if(options.estimated) issue.issue.estimated_hours = options.estimated;
    if(options.tracker)
      issue.issue.tracker_id = await exports.getTrackerIdByName(options.tracker);
    if(options.description) issue.issue.description = options.description;
    if(options.parent_issue) issue.issue.parent_issue_id = options.parent_issue;

    var response = await post('/issues.json', issue);

    if(response.statusCode == 404){
      throw 'Server responded with statuscode 404.\n' +
            'This is most likely the case when the specified project does not exist.\n' +
            'Does project \''+ project +'\' exist?';
    }
    else if(response.statusCode != 201)
      throw 'Server responded with statuscode ' + response.statusCode;

    var issue = JSON.parse(response.getBody('utf8'));
    return issue;
  } catch(err) {throw 'Could not create issue:\n' + err}
}

exports.getStatuses = async function(){
  throwWhenNotConnected();

  var response = await get('/issue_statuses.json');
  try{
    return JSON.parse(response.getBody('utf8'));
  } catch(err) {throw 'Could not load issue statuses.'}
}

exports.getStatusIdByName = async function(name){
  const { issue_statuses } = await exports.getStatuses();
  for(var i = 0; i < issue_statuses.length; i++){
    if(name == issue_statuses[i].name)
      return issue_statuses[i].id;
  }

  throw '\''+ name +'\' is no valid status.';
}

exports.getStatusNameById = async function(id){
  var statuses = await exports.getStatuses().issue_statuses;
  for(var i = 0; i < statuses.length; i++){
    if(id == statuses[i].id)
      return statuses[i].name;
  }

  throw '\''+ id +'\' is no valid status id.';
}

exports.getTrackers = async function(){
  throwWhenNotConnected();

  var response = await get('/trackers.json');
  try{
    return JSON.parse(response.getBody('utf8'));
  } catch(err) {throw 'Could not load trackers.'}
}

exports.getTrackerIdByName = async function(name){
  var trackers = await exports.getTrackers().trackers;
  for(var i = 0; i < trackers.length; i++){
    if(name == trackers[i].name)
      return trackers[i].id;
  }

  throw '\''+ name +'\' is no valid tracker.';
}

exports.getTrackerNameById = async function(id){
  var trackers = await exports.getTrackers().trackers;
  for(var i = 0; i < trackers.length; i++){
    if(id == trackers[i].id)
      return trackers[i].name;
  }

  throw '\''+ id +'\' is no valid tracker id.';
}

exports.getPriorities = async function(){
  throwWhenNotConnected();

  var response = await get('/enumerations/issue_priorities.json');
  try{
    return JSON.parse(response.getBody('utf8'));
  } catch(err) {throw 'Could not load issue priorities.'}
}

exports.getPriorityIdByName = async function(name){
  var priorities = await exports.getPriorities().issue_priorities;
  for(var i = 0; i < priorities.length; i++){
    if(name == priorities[i].name)
      return priorities[i].id;
  }

  throw '\''+ name +'\' is no valid priority.';
}

exports.getPriorityNameById = async function(id){
  var priorities = await exports.getPriorities().issue_priorities;
  for(var i = 0; i < priorities.length; i++){
    if(id == priorities[i].id)
      return priorities[i].name;
  }

  throw '\''+ id +'\' is no valid priority id.';
}

exports.getUsers = async function(){
  throwWhenNotConnected();

  var response = await get('/users.json');
  try{
    return JSON.parse(response.getBody('utf8'));
  } catch(err) {throw 'Could not load users.'}
}

exports.getUser = async function(id){
  throwWhenNotConnected();

  var response = await get('/users/' + id + '.json?include=memberships');
  try{
    return JSON.parse(response.getBody('utf8'));
  } catch(err) {throw 'Could not load user.'}
}

exports.getAssigneeNameById = async function(id){
  const { users } = await exports.getUsers();
  for(var i = 0; i < users.length; i++){
    if(id == users[i].id)
      return users[i].firstname + ' ' + users[i].lastname;
  }

  throw '\''+ id +'\' is no valid assignee id.';
}

exports.open = async function(id){
  throwWhenNotConnected();

  var url = nconf.get('serverUrl') + '/issues/' + id;
  openInBrowser(url);
}
