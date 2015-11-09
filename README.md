> Manage your project's cron jobs in Node.js and automatically update your crontab with a simple command!

[![Build Status](https://travis-ci.org/toymachiner62/node-whenever.svg)](https://travis-ci.org/toymachiner62/node-whenever)
[![Code Climate](https://codeclimate.com/github/toymachiner62/node-whenever/badges/gpa.svg)](https://codeclimate.com/github/toymachiner62/node-whenever)


# Purpose
This module allows you to manage the cron jobs related to your application and deploy them easily.

Use Cases:
- I want scheduled jobs to run when my app is deployed but don't want to have to manually setup cron on my server
- I want to manage my cron job configuration in my application so it is backed up in GIT without having to manually do it separately
- I want to have regularly scheduled jobs to execute even if there is a node.js error and my app is down

# Install
```js
$ npm install whenever
```

# Getting Started
```sh
$ wheneverize
```

This generates an initial `schedule.js` file. Setup your cron jobs in `schedule.js`.

```sh
$ updateCrontab
```

This is how you update your crontab from your `schedule.js` file. Run this command and your crontab will be updated with the contents of your `schedule.js` file.

# Testing
1. Install mocha globally
2. From project root, run `$ mocha test/index.js`

** Note ** Running the tests actually updates your cron tab

# Contribute
I'm happy to accept pull requests. If you want to contribute to the project please make sure you add a test(s).

Enjoy!
