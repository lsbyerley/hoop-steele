const mongoose = require('mongoose');
const StatsSchema = new mongoose.Schema({  
  title: String,
  updated: Date,
  updatedReadable: String,
  data: String
});
module.exports = mongoose.model('Stats', StatsSchema, 'stats');