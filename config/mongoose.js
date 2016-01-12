module.exports = function(mongoose) {
  mongoose.connect('mongodb://localhost/fcc-basejump-voting');
  mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
};
