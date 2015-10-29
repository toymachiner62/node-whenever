var fs = require('fs');
var path = require('path');
var Q = require('q');
var crontab = require('crontab');
var _ = require('lodash');

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
      console.log('schedule.js created!');
    })
    .fail(function(err) {
      console.error(err);
      throw err;
    });
}

/**
 * Reads the schedule.js file and creates the cronjobs
 * 
 * @param file  - The file to parse the cronjobs from (schedule.js)
 */
function updateCrontab(file) {

  validateFile(file)
    .then(function() {
      return getCronJobs(file);
    })
    .then(function(cronjobs) {
      createCronjobs(cronjobs);
    })
    .fail(function(err) {
      if(err.errno === 34) {
        var error = new Error('schedule.js does not exist');
        console.error(error);
        throw error;
      } else {
        console.error(err);
        throw err;
      }
    });
}

/*******************
 * PRIVATE
 *******************/

/**
 * Gets the cronjobs from the file
 * 
 * @param file  - The file to get the cronjobs from
 * @return      - Returns an array of cronjobs
 */
function getCronJobs(file) {

  var cronjobs = require(file).cronjobs;

  if(!cronjobs.length) {
    return Q.reject('schedule.js is not valid.');
  }

  var validate = validateCronjobs(cronjobs);

  if(_.isError(validate)) {
    return Q.reject(validate);
  }

  return Q.resolve(cronjobs);
}

/**
 * Validate that the cronjobs have at least the necessary attributes
 * 
 * @param cronjobs  - The cronjobs to validate have the necessary attributes
 * @return          - True if there are no errors. An Error object if there is an error
 */
function validateCronjobs(cronjobs) {
  var errors = null;

  cronjobs.forEach(function(cronjob) {
    // Ensure the command attribute exists
    if(!_.has(cronjob, 'command')) {
      errors = new Error('cronjob definition does not have the property "command"');
    }

    // Ensure the when attribute exists
    if(!_.has(cronjob, 'when')) {
      errors = new Error('cronjob definition does not have the property "when"');
    }
  });

  return errors ? errors : true
}

/**
 * Validate the cronjob file is not empty and has the appropriate export
 *
 * @param file  - The file to validate
 */
function validateFile(file) {
  return Q.promise(function(resolve, reject) {
    fs.readFile(path.join(file), function(err, contents) {

    if(err) {
      return reject(err);
    }

    if(contents.toString() === '') {
      return reject('schedule.js is empty');
    }
    
    return resolve();
    });
  });
}


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
      if(err.errno === 34) {
        return resolve();
      } else {
        return reject(err);
      }
    });
  });
}
