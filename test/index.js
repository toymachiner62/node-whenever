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

      it('should create schedule.js', function(done) {
        child = exec('cd test/empty; node ../../bin/wheneverize', function(err, stdout, stderr) {
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

      afterEach('delete file from testing', function(done) {
        fs.unlink('./test/tmp/schedule.js', function(err) {
          if(err) {
            return done(err);
          }
          done();
        });
      });

      it('should throw an error when schedule.js already exists', function(done) {

        child = exec('cd test/empty; node ../../bin/wheneverize', function(err, stdout, stderr) {
          expect(stderr).to.exist;
          expect(path.resolve('./test/empty/schedule.js')).to.not.be.a.file;
          done();
        });
      });
    });

  });
});