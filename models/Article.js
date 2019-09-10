const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  category: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }],
  name: { type: String },
  icon: { type: String },
  title: { type: String },
  content: { type: String },
})
module.exports = mongoose.model('Article', schema)