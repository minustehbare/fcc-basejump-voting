var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var expect = chai.expect;
var Poll = require('../../app/models/poll');

chai.use(chaiAsPromised);

describe('Poll', function() {
  var subject;

  beforeEach(function() {
    subject = getMockPoll();
  });

  describe('#validate', function() {
    context('when no creator is specified', function() {
      beforeEach(function() {
        subject.creator = null;
      });

      it('should fail', function() {
        return expect(subject.validate()).to.eventually.be.rejected;
      });
    });

    context('when no question is provided', function() {
      beforeEach(function() {
        subject.question = null;
      });

      it('should fail', function() {
        return expect(subject.validate()).to.eventually.be.rejected;
      });
    });

    context('when there are not 2 or more options', function() {
      beforeEach(function() {
        subject.options = [];
      });

      it('should fail', function() {
        return expect(subject.validate()).to.eventually.be.rejected;
      });
    });

    context('when two or more options are the same', function() {
      beforeEach(function() {
        subject.addOption('repeat');
        subject.addOption('repeat');
      });

      it('should fail', function() {
        return expect(subject.validate()).to.eventually.be.rejected;
      });
    });

    context('when there is a creator, question, and two or more options', function() {
      it('should succeed', function() {
        return expect(subject.validate()).to.eventually.be.fulfilled;
      });
    });
  });

  describe('#addOption', function() {
    beforeEach(function() {
      subject.addOption('blah');
    });

    it('should add the option', function() {
      expect(subject.options.length).to.equal(3);
    });
  });

  describe('#save', function() {
    context('when the creator has a poll with the same question', function() {
      beforeEach(function(done) {
        var otherPoll = getMockPoll();
        otherPoll.save(done);
      });

      it('should fail', function() {
        return expect(subject.save()).to.eventually.be.rejected;
      });

      afterEach(function(done) {
        Poll.remove({
          'creator': 'pants',
          'question': 'questionable'
        }, done);
      });
    });

    context('when the creator has no poll with the same question', function() {
      it('should succeed', function() {
        return expect(subject.save()).to.eventually.be.fulfilled;
      });
    });
  });
});

function getMockPoll() {
  var p = new Poll({
    'creator': 'pants',
    'question': 'questionable'
  });
  p.addOption('one');
  p.addOption('two');

  return p;
}
