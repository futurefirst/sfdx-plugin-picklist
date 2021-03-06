@futurefirst/sfdx-plugin-picklist
=================================

SFDX CLI plugin to manipulate picklist values

[![Version](https://img.shields.io/npm/v/@futurefirst/sfdx-plugin-picklist.svg)](https://npmjs.org/package/@futurefirst/sfdx-plugin-picklist)
[![CircleCI](https://circleci.com/gh/futurefirst/sfdx-plugin-picklist/tree/master.svg?style=shield)](https://circleci.com/gh/futurefirst/sfdx-plugin-picklist/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/futurefirst/sfdx-plugin-picklist?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/sfdx-plugin-picklist/branch/master)
[![Codecov](https://codecov.io/gh/futurefirst/sfdx-plugin-picklist/branch/master/graph/badge.svg)](https://codecov.io/gh/futurefirst/sfdx-plugin-picklist)
[![Greenkeeper](https://badges.greenkeeper.io/futurefirst/sfdx-plugin-picklist.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/futurefirst/sfdx-plugin-picklist/badge.svg)](https://snyk.io/test/github/futurefirst/sfdx-plugin-picklist)
[![Downloads/week](https://img.shields.io/npm/dw/@futurefirst/sfdx-plugin-picklist.svg)](https://npmjs.org/package/@futurefirst/sfdx-plugin-picklist)
[![License](https://img.shields.io/npm/l/@futurefirst/sfdx-plugin-picklist.svg)](https://github.com/futurefirst/sfdx-plugin-picklist/blob/master/package.json)

<!-- toc -->
* [Debugging your plugin](#debugging-your-plugin)
<!-- tocstop -->
<!-- install -->
<!-- usage -->
```sh-session
$ npm install -g @futurefirst/sfdx-plugin-picklist
$ sfdx COMMAND
running command...
$ sfdx (-v|--version|version)
@futurefirst/sfdx-plugin-picklist/0.0.1 linux-x64 node-v10.17.0
$ sfdx --help [COMMAND]
USAGE
  $ sfdx COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
* [`sfdx picklist:list -s <string> -f <string> [-r <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-picklistlist--s-string--f-string--r-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

## `sfdx picklist:list -s <string> -f <string> [-r <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

list values for a picklist field

```
USAGE
  $ sfdx picklist:list -s <string> -f <string> [-r <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -f, --fieldname=fieldname                                                         (required) the name of the picklist
                                                                                    field whose values you want to list

  -r, --resultformat=human|csv|json                                                 [default: human] result format
                                                                                    emitted to stdout; --json flag
                                                                                    overrides this parameter

  -s, --sobjecttype=sobjecttype                                                     (required) the sObject type with the
                                                                                    picklist field

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  $ sfdx picklist:list -u example@example.com -s Opportunity -f My_Custom_Field__c
```
<!-- commandsstop -->
<!-- debugging-your-plugin -->
# Debugging your plugin
We recommend using the Visual Studio Code (VS Code) IDE for your plugin development. Included in the `.vscode` directory of this plugin is a `launch.json` config file, which allows you to attach a debugger to the node process when running your commands.

To debug the `hello:org` command: 
1. Start the inspector
  
If you linked your plugin to the sfdx cli, call your command with the `dev-suspend` switch: 
```sh-session
$ sfdx hello:org -u myOrg@example.com --dev-suspend
```
  
Alternatively, to call your command using the `bin/run` script, set the `NODE_OPTIONS` environment variable to `--inspect-brk` when starting the debugger:
```sh-session
$ NODE_OPTIONS=--inspect-brk bin/run hello:org -u myOrg@example.com
```

2. Set some breakpoints in your command code
3. Click on the Debug icon in the Activity Bar on the side of VS Code to open up the Debug view.
4. In the upper left hand corner of VS Code, verify that the "Attach to Remote" launch configuration has been chosen.
5. Hit the green play button to the left of the "Attach to Remote" launch configuration window. The debugger should now be suspended on the first line of the program. 
6. Hit the green play button at the top middle of VS Code (this play button will be to the right of the play button that you clicked in step #5).
<br><img src=".images/vscodeScreenshot.png" width="480" height="278"><br>
Congrats, you are debugging!
