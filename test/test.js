'use strict';

const assert = require('assert');
const tokenExtractor = require('../lib/index');

describe('token-extractor', function() {

  describe('Passing tests', function() {

    const secretKey = 'shhhh!';
    const req = {};

    it('should set "req.token" correctly', function(done) {
      let tokenString = 'sometokenbase64';

      req.headers = {
        authorization: 'Bearer ' + tokenString
      };

      tokenExtractor(req, function(err, token) {
        assert.equal(tokenString, token);

        done();
      });
    });
  });

  describe('failing tests', function() {
    const req = {};

    it('should throw if second argument is not a function', function() {
      try {
        tokenExtractor(null, 'invalid_callback');
      } catch (err) {
        assert.ok(err);
        assert(/Second argument must be a function callback/.test(err));
      }
    });

    it('should return Error if NO authorization header is present', function(done) {
      req.headers = {};

      tokenExtractor(req, function(err) {
        assert.ok(err);
        assert.equal(err.code, 'E_AUTHORIZATION_REQUIRED');

        done();
      });
    });

    it('should return Error if authorization header format is invalid', function(done) {
      let token = 'sometokenbase64';

      req.headers = {
        authorization: 'Bearer' + token
      };

      tokenExtractor(req, function(err) {
        assert.ok(err);
        assert.equal(err.code, 'E_INVALID_AUTHORIZATION_FORMAT');

        done();
      });
    });

    it('should return Error if token is not present in authorization header', function(done) {
      req.headers = {
        authorization: 'Bearer '
      };

      tokenExtractor(req, function(err) {
        assert.ok(err);
        assert.equal(err.code, 'E_AUTHORIZATION_TOKEN_NOT_FOUND');

        done();
      });
    });
  });
});
