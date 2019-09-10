const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  name: { type: String },
  img: { type: String },
  remark: { type: String },
})
module.exports = mongoose.model('Image', schema)