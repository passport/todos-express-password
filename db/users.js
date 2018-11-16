const records = [
  { id: 1, username: 'jack', password: 'secret', displayName: 'Jack', emails: [ { value: 'jack@example.com' } ] },
  { id: 2, username: 'jill', password: 'birthday', displayName: 'Jill', emails: [ { value: 'jill@example.com' } ] }
]

exports.findById = async id => {
  const idx = id - 1
  const ret = records[idx]
  if (!ret) {
    throw new Error('User ' + id + ' does not exist')
  }

  return ret
}

exports.findByUsername = async username => {
  return records.find(record => record.username === username)
}
