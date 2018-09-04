# User Navigator for SAS®

The User Navigator for SAS® is an open source project for revealing information on SAS® Metadata Users, Groups, and Roles.
It is easy to use, easy to deploy, secured by SAS® Authentication, and beautifully illustrates the power of SAS® for Enterprise application development.

This application is useful for:

* Service Desk teams / first line support
* End users - who want to understand their own group / role membership without running code
* SAS Administrators, as a supplement to Management Console
* SAS Application Developers, looking for a simple app that can be extended / customised as needed.

## Usage
The User Navigator for SAS® is split into three parts:

### Users

The "Users" tab displays a list of all Users in the left hand bar.  A search box lets you find a particular User ID.  Clicking on a user will show you any emails that are listed for that User, along with the User's Groups and Roles.

### Groups

The "Groups" tab displays a list of all Groups.  A search box lets you filter the list of Groups.  Clicking a Group shows the Group description, and a list of the Group members.

### Roles

The "Roles" tab displays a list of all the Roles.  A search box lets you filter the Roles.  Clicking a Role lets you see which Users have that particular Role.

## Deployment Instructions

There are five steps to getting the User Navigator up and running in your environment:

### 1 - Download the Source

The latest stable version of User Navigator is always available as a github [release](https://github.com/Boemska/user-navigator/releases).  If you prefer to build from source, follow the [Build Instructions](https://github.com/Boemska/user-navigator/blob/master/CONTRIBUTING.md).

### 2 - Implement the backend

Unzip the package and import the `import.spk` file using SAS Management Console (or batch tools) to a preferred location in metadata.  Secure this application by setting an ACT as appropriate on the parent folder.  Take note of the folder root in which these STPs were deployed (it's used in the following configuration step).

### 3 - Update the h54s config file

Inside the `usernavigator` folder there is a configuration file called `h54s.config`.  Within this, set the `metadataRoot` value to the folder root identified in the previous step.

### 4 - Deploy the frontend

Copy the entire `usernavigator` folder (with the modifed `h54s.config`) to your web server.  For 9.4 this location would be `/opt/sas94/config/Lev1/Web/WebServer/htdocs`.


### 5 - Profit

Your app is now live!  Simply navigate to YOURHOST.DOMAIN:8080/usernavigator (where `YOURHOST` is the hostname of your SAS Web Server, `8080` is your port, and `/usernavigator` is the location in which the files were loaded in step 3).

## Build Instructions

See [CONTRIBUTING.md](https://github.com/Boemska/user-navigator/blob/master/CONTRIBUTING.md)


