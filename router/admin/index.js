module.exports = app => {
  const express = require('express');
  const router = express.Router();
  const jwt = require('jsonwebtoken');
  const User = require('../../models/User');
  //增加
  router.post('/', async (req, res) => {
    const model = await req.Model.create(req.body);
    res.send(model);
  });
  //查询
  router.get('/', async (req, res) => {
    const queryOptions = {};
    if (req.Model.modelName === 'Article') {
      queryOptions.populate = 'category';
    }
    const model = await req.Model.find()
      .setOptions(queryOptions)
      .limit(100);
    res.send(model);
  });
  router.get('/:id', async (req, res) => {
    const model = await req.Model.findById(req.params.id);
    res.send(model);
  });
  //删除
  router.delete('/:id', async (req, res) => {
    await req.Model.findByIdAndDelete(req.params.id);
    res.send({
      success: true
    });
  });
  //更改
  router.put('/:id', async (req, res) => {
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body);
    res.send(model);
  });
  //配置通用接口
  app.use(
    '/admin/api/rest/:resource',
    async (req, res, next) => {
      const token = String(req.headers.authorization || '')
        .split(' ')
        .pop();
      if (!token) {
        return res.status(401).send({
          message: '请提供jwt-token请先登录'
        });
      }
      const { id } = jwt.verify(token, req.app.get('secret'));
      if (!id) {
        return res.status(401).send({
          message: '无效的jwt-token请先登录'
        });
      }
      req.user = await User.findById(id);
      if (!req.user) {
        return res.status(401).send({
          message: '请先登录'
        });
      }
      await next();
    },
    async (req, res, next) => {
      const modelName = require('inflection').classify(req.params.resource);
      req.Model = require(`../../models/${modelName}`);
      next();
    },
    router
  );

  //上传
  const multer = require('multer');
  const upload = multer({ dest: __dirname + '/../../uploads' });
  app.post(
    '/admin/api/upload',
    async (req, res, next) => {
      const token = String(req.headers.authorization || '')
        .split(' ')
        .pop();
      if (!token) {
        return res.status(401).send({
          message: '请提供jwt-token请先登录'
        });
      }
      const { id } = jwt.verify(token, req.app.get('secret'));
      if (!id) {
        return res.status(401).send({
          message: '无效的jwt-token请先登录'
        });
      }
      req.user = await User.findById(id);
      if (!req.user) {
        return res.status(401).send({
          message: '请先登录'
        });
      }
      await next();
    },
    upload.single('file'),
    async (req, res) => {
      const file = req.file;
      file.url = `http://localhost:4000/uploads/${file.filename}`;
      res.send(file);
    }
  );
  //登录
  app.post(`/admin/api/login`, async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(422).send({
        code: 501,
        message: '用户不存在'
      });
    }
    //校验密码
    const isValid = require('bcrypt').compareSync(password, user.password);
    if (!isValid) {
      return res.status(422).send({
        code: 501,
        message: '密码错误'
      });
    }
    //返回token和数据
    const token = jwt.sign({ id: user._id }, app.get('secret'));
    res.send({ code: 0, message: '登陆成功', result: { token, username: user.username } });
  });
  //获取权限列表
  app.post(`/admin/api/permissionList`, async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    //返回token和数据
    res.send({ code: 0, message: '获取成功', result: { permissionList: user.permissionList } });
  });

  //错误处理
  app.use(async (err, req, res, next) => {
    res.status(err.statusCode || 500).send({
      aaa: 123,
      message: err.message
    });
  });
};
