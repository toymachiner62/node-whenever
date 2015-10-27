var fs = require('fs');
var path = require('path');
var Q = require('q');
var crontab = require('crontab');

/*crontab.load(function(err, crontab) {
  var jobs = crontab.jobs();

  jobs.toString());
});*/


/**
 * Creates the file schedule.js with the default contents
 * 
 * @return  - Returns a promise
 */
function createScheduleFile() {
  return Q.promise(function(resolve, reject) {
    var contents = '/**\n * This is the generated file from "Whenever" <NPM LINK HERE>.';
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

/**
 * Wheneverizes a project
 */
function wheneverize() {

  //console.log(path.resolve(path.join(__dirname, 'schedule.js')));



  
  /*if(path.resolve(path.join(__dirname, 'schedule.js'))) {
    console.error('schedule.js already exists!');
    return;
  }*/

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

module.exports.wheneverize = wheneverize;

