const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
  shortCode: {
    type: String,
    required: true,
    index: true
  },
  ip: String,
  region: String,
  browser: String,
  browserVersion: String,
  os: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Click', clickSchema);
