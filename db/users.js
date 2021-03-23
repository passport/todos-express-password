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

exports.findById = function(id, cb) {
  process.nextTick(function() {
    var idx = id - 1;
    if (records[idx]) {
      cb(null, records[idx]);
    } else {
      cb(new Error('User ' + id + ' does not exist'));
    }
  });
};

exports.findByUsername = function(username, cb) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.username === username) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
};
