var fs = require('fs');
var path = require('path');
var Q = require('q');
var crontab = require('crontab');

// Expose our public functions
module.exports.wheneverize = wheneverize;
module.exports.updateCrontab = updateCrontab;

/**
 * Wheneverizes a project
 */
function wheneverize() {

  var scheduleFile = path.resolve(path.join(__dirname, 'schedule.js'));

  shouldCreateFile(scheduleFile)
    .then(function() {
      return createScheduleFile();
    })
    .then(function() {
      // Do something
    })
    .fail(function(err) {
      console.error(err);
      throw err;
    });
}

function updateCrontab(file) {

  console.log('file333 = ', file);

  if(file === null || file === undefined) {
    throw new Error('schedule.js does not exist. Did you run "$ whenever" to generate it?');
  }

  if(file === '') {
    throw new Error('schedule.js is empty');
  }

  var cronjobs = require(file).cronjobs;

  cronjobs.forEach(function(cronjob) {
    crontab.load(function(err, tab) {
      var job = tab.create(command, when, comment);

      // save
      tab.save(function(err, tab) {

      });

      console.log(tab);
    });
  });

  parseSchedule(scheduleFile)
    .then(function() {

    })
    .fail(function(err) {
      console.error(err);
      throw err;
    });
}


/*******************
 * PRIVATE
 *******************/


/**
 * Creates the file schedule.js with the default contents
 * 
 * @return  - Returns a promise
 */
function createScheduleFile() {
  return Q.promise(function(resolve, reject) {
    var contents = '/**\n * This file is generated from "Whenever" <NPM LINK HERE>.\n' + 
    ' *\n' +
    ' * module.exports.cronjobs accepts an array of cronjob objects. \n' +
    ' * Each object has the attributes command, when, and comment.\n' +
    ' * \n' +
    ' * Syntax:\n' +
    ' * command can be a string expression\n' +
    ' * \n' +
    ' * Examples: \n' + 
    ' * \n' +
    ' * \t{\n' +
    ' * \t\tcommand: \'ls -al\',\n' +
    ' * \t\twhen: \'* * * * *\',\n' +
    ' * \t\tcomment: \'Oh ya know just commenting my cron job\'\n' +
    ' * \t}\n' +
    '*/\n' +
    'module.exports.cronjobs = [\n' +
    '\t{\n' +
    '\t\tcommand: \'<command to execute>\',\n' +
    '\t\twhen: \'<when to execute>\',\n' +
    '\t\tcomment: \'<comment to be put in the crontab for this entry>\'\n' +
    '\t}\n' +
    ']';
    fs.writeFile('schedule.js', contents, function(err) {
      if(err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

/**
 * Ensure schedule.js does not already exist.
 * 
 * @param file  - The file to check if exists
 * @return      - Returns a promise whether the file exists or not
 */
function shouldCreateFile(file) {
  return Q.promise(function(resolve, reject) {
    fs.stat(file, function(err, stats) {
      
      // If the file already exists
      if(err === null) {
        if(stats.isFile()) {
          return reject(new Error('schedule.js already exists!'));
        }
      }

      // If the file does not exist, resolve, else reject with the error
      if(err.code === 'ENOENT') {
        return resolve();
      } else {
        return reject(err);
      }
    });
  });
}

function parseSchedule(file) {
  return Q.promise(function(resolve, reject) {
    fs.readFile(file, function(err, contents) {
      if(err) {
        return reject(err);
      }

      return resolve();
    });
  });
}
