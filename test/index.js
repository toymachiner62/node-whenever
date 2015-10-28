var expect = require('chai').expect;
var exec = require('child_process').exec;
var path = require('path');
var fs = require('fs');

describe('Whenever', function() {

  it('should not blow up when being included', function() {
    var whenever = require('../index');
    expect(whenever).to.not.be.undefined;
    expect(whenever).to.be.an.Error;
  });

  describe('wheneverize', function() {

    describe('when schedule.js does not exist', function() {

      afterEach('delete file from testing', function(done) {
        fs.unlink('./test/empty/schedule.js', function(err) {
          if(err) {
            return done(err);
          }
          done();
        });
      });

      it('should create schedule.js', function(done) {
        var child = exec('cd test/empty; node ../../bin/wheneverize', function(err, stdout, stderr) {
          expect(err).to.be.null;
          expect(path.resolve('./test/empty/schedule.js')).to.be.a.file;
          exec('rm -f test/empty');
          done();
        });
      });

    });

    describe('when schedule.js exists', function() {

      beforeEach('create file for testing', function(done) {
        fs.writeFile('./test/tmp/schedule.js', '', function(err) {
          if(err) {
            return done(err);
          }
          done();
        });
      });

      /*afterEach('delete file from testing', function(done) {
        fs.unlink('./test/tmp/schedule.js', function(err) {
          if(err) {
            return done(err);
          }
          done();
        });
      });*/

      it('should throw an error when schedule.js already exists', function(done) {

        var child = exec('cd test/empty; node ../../bin/wheneverize', function(err, stdout, stderr) {
          expect(stderr).to.exist;
          expect(path.resolve('./test/empty/schedule.js')).to.not.be.a.file;
          done();
        });
      });
    });

  });

  describe('updateCrontab', function() {

    describe('with no schedule.js file', function() {

      it('should update the crontab', function(done) {
        var child = exec('cd test/undefined; node ../../bin/updateCrontab', function(err, stdout, stderr) {
          expect(stderr).to.exist;
          expect(stderr).to.match(/schedule.js does not exist/);
          done();
        });
      });

    });

    describe.only('with an empty schedule.js file', function() {

      beforeEach('create file for testing', function(done) {
        fs.writeFile('./test/empty/schedule.js', '', function(err) {
          if(err) {
            return done(err);
          }
          done();
        });
      });

     /* afterEach('delete file from testing', function(done) {
        fs.unlink('./test/empty/schedule.js', function(err) {
          if(err) {
            return done(err);
          }
          done();
        });
      });*/

      it('should show error that schedule.js is empty', function(done) {
        var child = exec('cd test/empty; node ../../bin/updateCrontab', function(err, stdout, stderr) {
          console.log('err = ', err);
          console.log('stdout = ', stdout);
          console.log('stderr = ', stderr);
          expect(stderr).to.exist;
          expect(stderr).to.match(/schedule.js is empty/);
          done();
        });
      });

    });

    describe.skip('with an invalid schedule.js file', function() {

      beforeEach('create file for testing', function(done) {
        fs.writeFile('./test/invalid/schedule.js', 'module.exports.cronjobs = []', function(err) {
          if(err) {
            return done(err);
          }
          done();
        });
      });

      /*afterEach('delete file from testing', function(done) {
        fs.unlink('./test/invalid/schedule.js', function(err) {
          if(err) {
            return done(err);
          }
          done();
        });
      });*/

      it('should show error that schedule.js is empty', function(done) {
        var child = exec('cd test/invalid; node ../../bin/updateCrontab', function(err, stdout, stderr) {
          console.log('err = ', err);
          console.log('stdout = ', stdout);
          console.log('stderr = ', stderr);
          expect(stderr).to.exist;
          expect(stderr).to.match(/schedule.js is empty/);
          done();
        });
      });

    });

  });

});