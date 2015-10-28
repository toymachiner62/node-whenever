#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var args = process.argv.slice(2); // Remove node and updateCron from the args
// read schedule.js from current folder

console.log(path.join(process.cwd(), 'schedule.js'));

fs.readFile(path.join(process.cwd(), 'schedule.js'), function(err, contents) {
  
  if(err === null) {
    require('../index.js').updateCrontab(path.join(process.cwd(), 'schedule.js'));
  }

  if(err && err.errno === 34) {
    throw new Error('schedule.js does not exist');
  } else {
    throw err;
  }

  //console.log('contents = ', contents.toString());

  
});

