var express = require('express')
var router = express.Router()
var Mssage = require('../mongo/db/release')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)

router.use(session({                                  //配置session
    secret: 'mylogin',
    resave: true,
    saveUninitialized: true,
    rolling: true,
    cookie: { maxAge: 1000 * 60 * 60 },
    store: new MongoStore({ url: 'mongodb://127.0.0.1/session' })
}))


router.get('/view', (req, res) => {
    var user = req.session.user
    Mssage
        .findOne({ _id: req.query._id })
        .populate('author')
        .populate('reply')
        .sort({time:-1})
        .exec((err, data) => {
            console.log(data.count)
            Mssage.updateOne(data,{count:data.count+1},(err)=>{
                 var msgs = JSON.parse(JSON.stringify(data));
                res.render('view',{user,msgs})
            })
           
        })
})

module.exports = router;
