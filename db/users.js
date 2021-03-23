var records = [ {
    id: 1,
    username: 'alice',
    password: 'qwerty1',
    displayName: 'Alice',
    emails: [ { value: 'alice@example.com' } ]
  }, {
    id: 2,
    username: 'bob',
    password: 'monkey1',
    displayName: 'Bob',
    emails: [ { value: 'bob@example.com' } ]
  }, {
    id: 3,
    username: 'carol',
    password: 'dragon1',
    displayName: 'Carol',
    emails: [ { value: 'carol@example.com' } ]
  }
];

exports.find = function(query, cb) {
  process.nextTick(function() {
    if (Object.keys(query) == 0) {
      return cb(null, records);
    }
    
    var result = records.filter(function(record) {
      return record.id === query.id;
    });
    return cb(null, result);
  });
};

exports.findOne = function(query, cb) {
  exports.find(query, function(err, result) {
    if (err) { return cb(err); }
    return cb(null, result[0]);
  });
};

exports.findByUsername = function(username, cb) {
  process.nextTick(function() {
    var result = records.find(function(record) {
      return record.username === username;
    });
    return cb(null, result);
  });
};
