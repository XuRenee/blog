var express = require('express')


var app = express()
var md5 = require('md5')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))

var favicon=require('serve-favicon')
 var logger = require('morgan');
 var path=require('path')
 app.use(favicon(path.join(__dirname,'public/img/bg.jpeg')));

var atrTem = require('./art-tem-config.js')                     //渲染模块
atrTem(app)

var flash = require('connect-flash')
app.use(flash())

var tools = require('./mongo/tools')                          //工具模块

var session = require('express-session')
var MongoStore = require('connect-mongo')(session)


var Mssage = require('./mongo/db/release')                     //表


app.use(session({                                  //配置session
    secret: 'mylogin',
    resave: true,
    saveUninitialized: true,
    rolling: true,
    cookie: { maxAge: 1000 * 60 * 60 },
    store: new MongoStore({ url: 'mongodb://127.0.0.1/session' })
}))

app.use((req,res,next)=>{
    var user=req.session.user
    next()
})

app.use(require('./route/index'))
app.use(require('./route/view'))
app.use(require('./route/reply'))
app.use(require('./route/lable'))
app.use(require('./route/dele'))
app.use(require('./route/sou'))
app.use(require('./route/upload'))







app.listen(3001, () => {
    console.log('OK')
})