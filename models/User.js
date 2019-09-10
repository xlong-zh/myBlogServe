const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  username: { type: String },
  password: {
    type: String,
    //密码散列加密
    set(val) {
      return require('bcrypt').hashSync(val, 10)
    }
  },
})
module.exports = mongoose.model('User', schema)
