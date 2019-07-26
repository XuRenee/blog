var express = require('express')
var router = express.Router()
var Mssage = require('../mongo/db/release')
var User = require('../mongo/db/user')
var md5 = require('md5')
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


//渲染主页
router.get('/', (req, res) => {

    var error = req.flash('error').toString();
    var user = req.session.user
    var page = req.query.page ? req.query.page : 1;
    var showCount = 5
    Mssage
        .find()
        .populate('author')
        .populate('reply')
        .skip((page - 1) * showCount)
        .sort({ time: -1 })
        .limit(showCount)
        .exec((err, data) => {
            var msgs = JSON.parse(JSON.stringify(data));


            Mssage.countDocuments((err, count) => {
                var allPages = Math.ceil(count / showCount);
                res.render('index', { user, msgs, error, allPages, page })
            })

        })

})







//登录
router.get('/login', (req, res) => {
    var error = req.flash('error').toString()
    res.render('login', { error })
})
router.post('/login', (req, res) => {
    User.findOne({ username: req.body.username }, (err, user) => {
        if (!user) {
            req.flash('error', '您还没有注册请先注册')
            res.redirect('/login')
        } else {
            if (md5(req.body.password) != user.password) {
                console.log(user)
                req.flash('error', '您的密码有误请确认后登录！')
                res.redirect('/login')
            } else {
                req.session.user = user
                console.log(req.session.user)
                res.redirect('/')
            }
        }
    })
})

//退出登录
router.get('/logout', (req, res) => {
    delete req.session.user
    res.redirect('/')
})


//注册
router.get('/regist', (req, res) => {
    var error = req.flash('error').toString()
    res.render('regist', { error })
})
router.post('/regist', (req, res) => {
    User.findOne({ username: req.body.username }, (err, date) => {
        if (date) {
            req.flash('error', '用户名已被注册')
            res.redirect('/regist')
        } else {
            if (req.body.password != req.body.confirm) {
                req.flash('error', '两次密码不一致请重新确认密码')
                res.redirect('/regist')

            } else {
                req.body.password = md5(req.body.password)
                req.body.confirm = md5(req.body.confirm)

                //将源对象复制到目标对象
                //参数一为目标对象
                //参数二为源对象
                var userObj = Object.assign(req.body, {
                    headerurl: '/img/m.jpg'
                    //设置默认头像
                }) 

                var user = new User(userObj)
                user.save(err => {
                    if (err) {
                        res.send('404')
                    } else {
                        res.redirect('/login')
                        console.log(user)

                    }
                })
            }
        }
    })
})

//跳转到用户
router.get('/author', (req, res) => {
    var user = req.session.user
    User.findOne({ _id: req.query.author_id })
        .exec((err, data) => {
            var aut = JSON.parse(JSON.stringify(data));
            console.log(aut)
            Mssage.find({ author: aut._id })
                .populate('author')
                .populate('reply').exec((err, date) => {
                    var msg = JSON.parse(JSON.stringify(date));
                    res.render('author', { aut, user, msg })

                })
        })
})
//主页分页
router.get('/archive', (req, res) => {
    var page = req.query.page ? req.query.page : 1;
    var showCount = 5
    Mssage
        .find()
        .populate('author')
        .populate('reply')
        .skip((page - 1) * showCount)
        .sort({ time: -1 })
        .limit(showCount)
        .exec((err, data) => {
            var user = req.session.user
            var msgs = JSON.parse(JSON.stringify(data));
            Mssage.countDocuments((err, count) => {
                var allPages = Math.ceil(count / showCount);
                res.render('archive', { msgs, user, allPages, page, lastYear: -1 })
                console.log(allPages)
            })
        })
})
module.exports = router;
