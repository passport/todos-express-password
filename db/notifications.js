var records = [];

records.push({ id: 0, subject: 'Congratulations!', body: 'You did it!' });


exports.find = function(cb) {
  process.nextTick(function() {
    return cb(null, records);
  });
};
