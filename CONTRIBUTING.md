# How to Contribute

Firstly - thanks for reading this.  Contributions are very welcome!

This app uses Angular framework, and follows the Clarity Design System.

In order to contribute, please send a GitHub Pull Request to [Boemska](https://github.com/boemska/user-navigator/pull/new/master) with a clear list of what you've done (read more about [pull requests](http://help.github.com/pull-requests/)).
Please make sure all of your commits are atomic (one feature per commit).  Always write a clear log message for your commits. One-line messages are fine for small changes, but bigger changes should look like this:

$ git commit -m "A brief summary of the commit
>
> A paragraph describing what changed and its impact."


# How to Build

## Installation
*Prerequisite*: Please install Angular-CLI by following [these instructions](https://github.com/angular/angular-cli#installation).

```bash
git clone git@github.com:Boemska/user-navigator.git
cd user-navigator

# install the project's dependencies
npm install

# make your changes!

# build the site
ng build

# start the application in dev mode and watches your files for live reload
ng serve
```

Note that you will not be able to connect your local build to the SAS server until you update the config file.

The file is located here: `/src/app/boemska/h54s.config.ts`

And needs the following settings:

```js
// h54s settings - for more information go to https://github.com/Boemska/h54s
export const AdapterSettings = {
  // SAS metadata folder root (location of STPs)
  metadataRoot: '/Your/Meta/Folder/usernavigator/',
  // SAS Web Server base URL
  hostUrl: 'https://YOUR.DOMAIN.COM'
}
```


# Documentation

For documentation on the H54S library go to the [H54S Github page](https://github.com/Boemska/h54s)
For documentation on the Clarity Design System, including a list of components and example usage, see [our website](https://vmware.github.io/clarity).
For documentation on Angular-CLI, please see their [github repository](https://github.com/angular/angular-cli).