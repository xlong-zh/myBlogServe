module.exports = app => {
  const mongoose = require('mongoose');
  mongoose.connect('mongodb://122.51.209.17:27017/zxlweb', {
    useNewUrlParser: true
  });
  //引用一边模型，防止报错
  require('require-all')(__dirname + '/../models');
};
