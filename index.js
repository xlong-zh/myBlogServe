const express = require("express")

const app = express()
app.set('secret', 'zxl123')

app.use(require('cors')())
app.use(express.json())

app.use('/uploads', express.static(__dirname + '/uploads'))

require('./plugins/db.js')(app)
require('./router/admin/index.js')(app)
require('./router/web/index.js')(app)

app.listen(3000, () => {
  console.log('服务器开启成功http://localhost:3000')
})