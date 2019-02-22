const mongoose = require('mongoose');
const RatingsSchema = new mongoose.Schema({  
  title: String,
  updated: Date,
  updatedReadable: String,
  data: String
});
module.exports = mongoose.model('Ratings', RatingsSchema, 'kenpom');