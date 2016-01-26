var mongoose = require('mongoose');

before('clearing database collections', function(done) {
  mongoose.connect('mongodb://localhost:27017/testing123', function(err) {
    if (err) done(err);

    var x = Object.keys(mongoose.connection.collections).length;
    var y = 0;

    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].removeMany({}, function(err) {
        if (err) done(err);

        y = y + 1;
        if (y === x) {
          done();
        }
      });
    }
  });
});

after('closing database connection', function(done) {
  mongoose.disconnect(done);
});
