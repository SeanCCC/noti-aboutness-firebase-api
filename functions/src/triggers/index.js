const daily = require('./daily')
const rtdb = require('./rtdb')
module.exports = {
  ...daily,
  ...rtdb
}
