const mongoose = require('mongoose');

const LINK_CONSTANTS = {
  MAX_ORIGINAL_LENGTH: 2048,
  SHORT_ID_LENGTH: 8
};

const linkSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
    maxlength: LINK_CONSTANTS.MAX_ORIGINAL_LENGTH
  },
  shortCode: {
    type: String,
    required: true,
    unique: true
  },
  shareUrl: {
    type: String,
    required: true
  },
  statsUrl: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Link', linkSchema);
