var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var expect = chai.expect;
var User = require('../../app/models/user');

chai.use(chaiAsPromised);

describe('User', function() {
  var subject;

  beforeEach(function() {
    subject = getMockUser();
  });

  describe('#validate', function() {
    context('when no username is specified', function() {
      beforeEach(function() {
        subject.username = null;
      });

      it('should fail', function() {
        return expect(subject.validate()).to.eventually.be.rejected;
      });
    });

    context('when there is not at least one account', function() {
      beforeEach(function() {
        subject.accounts = [];
      });

      it('should fail', function() {
        return expect(subject.validate()).to.eventually.be.rejected;
      });
    });

    context('when another user has claimed one of the accounts', function() {
      beforeEach(function(done) {
        var otherUser = getMockUser();
        otherUser.username = 'notpants';
        otherUser.save(done);
      });

      it('should fail', function() {
        return expect(subject.validate()).to.eventually.to.be.rejected;
      });

      afterEach(function(done) {
        User.remove({ 'username': 'notpants' }, done);
      });
    });

    context('when there is a username and one or more accounts', function() {
      it('should succeed', function() {
        return expect(subject.validate()).to.eventually.be.fulfilled;
      });
    });
  });

  describe('#save', function() {
    context('when another user exists with the same username', function() {
      beforeEach(function(done) {
        var otherUser = getMockUser();
        otherUser.accounts = [
          {
            'provider': 'shirt',
            'id': 'notshoes'
          }
        ];
        otherUser.save(done);
      });

      it('should fail', function() {
        return expect(subject.save()).to.eventually.be.rejected;
      });

      afterEach(function(done) {
        User.remove({ 'username': 'pants' }, done);
      });
    });

    context('when the username has not been taken', function() {
      it('should succeed', function() {
        return expect(subject.save()).to.eventually.be.fulfilled;
      });
    });
  });
});

function getMockUser() {
  var u = new User({
    'username': 'pants',
    'accounts': [
      { 'provider': 'shirt', 'id': 'shoes' }
    ]
  });

  return u;
}
