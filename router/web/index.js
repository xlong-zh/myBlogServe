module.exports = app => {
  const router = require('express').Router()
  const mongoose = require('mongoose')

  const Article = mongoose.model('Article')
  const Category = mongoose.model('Category')
  const Image = mongoose.model('Image')
  // const Image = require('../../models/Image')

  router.get('/image/list', async (req, res) => {
    const data = await Image.find()
    res.send(data)
  })

  router.get('/article/list', async (req, res) => {
    const data = await Article.find().populate('category')
    res.send(data)
  })


  app.use('/web/api', router)

}