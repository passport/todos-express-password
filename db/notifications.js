var records = [
  { id: 1, subject: 'Congratulations!', body: 'You did it!' }
];

exports.find = function(cb) {
  process.nextTick(function() {
    return cb(null, records);
  });
};
