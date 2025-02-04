# RedmineCLI

A NodeJS, stateful, console-based Redmine client.

## Installation & Setup

```shell
# install from github
npm install -g dlemper/Redmine-CLI#master

# install from local folder
# if install failed, please remove previous version first: npm remove -g redmine
npm i -g .
```

Connect to your Redmine instance.

```shell
$ redmine connect http://your.server/redmine yourApiKey
```

**Note:** Unless you don't want to switch to another Redmine instance you only need to call this once.

You are all set, have fun :)

## Usage

Display available commands and options.

```shell
$ redmine --help
Usage: redmine [options] [command]

Commands:
connect <url> <apiKey>                        Connect to server using API key for authentication.
projects                                      Display projects.
project <identifier>                          Display project details.
update-project [options] <identifier>         Update the specified project.
create-project [options] <name> <identifier>  Create a new project.
issues [options]                              Display issues.
issue [options] <id>                          Display issue details.
update-issue [options] <id>                   Update the specified issue.
create-issue [options] <project> <subject>    Create a new issue.
statuses                                      Display available issue statuses.
trackers                                      Display available trackers.
priorities                                    Display available priorities.
users                                         Display users (requires admin priviliges).
user <id>                                     Display user details (requires admin priviliges).
open <id>                                     Open issue in default browser.


Options:
  -h, --help     output usage information
  -V, --version  output the version number
```

Or display the options of a certain command.

```shell
$ redmine issues --help
  Usage: issues [options]

  Display issues.

  Options:
    -h, --help                 output usage information
    -p, --project <project>    Only display issues for the specified project.
    -P, --priority <priority>  Only display issues with specified priority.
    -a, --assignee <assignee>  Only display issues for the specified assignee.
    -s, --status <status>      Only display issues with the specified status.
    -t, --tracker <tracker>    Only display issues for the specified tracker.
    -m, --me                   Only display issues assigned to me.
    -o, --open                 Only display open issues.
    -c, --closed               Only display closed issues.
```

## Example

Display all issues assigned to you with status `New`.

```shell
$ redmine issues --me --status=New
ID  TRACKER  STATUS  PRIORITY  ASSIGNEE        SUBJECT
#2  Bug      New     High      Admin Istrator  This is a bug.
#1  Feature  New     Urgent    Admin Istrator  This is a feature.
```

Display a certain issue with history.

```shell
$ redmine issue 2 --history
BUG #2
This is a feature.
Added by Admin Istrator a month ago. Updated a day ago.

STATUS  PRIORITY  ASSIGNEE
New     Normal    Admin Istrator

DESCRIPTION
This is a feature description.
HISTORY
 * Updated by Admin Istrator 21 days ago.
   Status changed from 'In Progress' to 'New'.
 * Updated by Admin Istrator 21 days ago.
   Tracker changed from 'Feature' to 'Bug'.
 * Updated by Admin Istrator 21 days ago.
   Assignee changed from 'nobody' to 'John Doe'.
 * Updated by Admin Istrator 14 days ago.
   Assignee changed from 'John Doe' to 'Admin Istrator'.
 * Updated by Admin Istrator a day ago.
   Priority changed from 'High' to 'Normal'.
```

**Note:** In order to resolve some properties within the history, displaying an issue with history may take a few moments longer. If you are not interested in the history just skip the according option.
