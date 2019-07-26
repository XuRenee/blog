var express = require('express')
var router = express.Router()
var Mssage = require('../mongo/db/release')


// 点击标签显示对应内容

router.get('/arr', (req, res) => {
    Mssage.find({ label: req.query.label })
        .populate('author')
        .populate('reply')
        .sort({time:-1})
        .exec((arr, data) => {
            var msg = JSON.parse(JSON.stringify(data))

            res.render('soulabel', { msg })
        })
})

//点击用户名出现主页带有他发布的内容
router.get('/aut', (req, res) => {
    var user = req.session.user
    Mssage.find({ author: req.session.user })
        .populate('author')
        .populate('reply')
        .sort({time:-1})
        .exec((err, data) => {
            var msg = JSON.parse(JSON.stringify(data))
            res.render('aut', { user, msg })

        })

})



//搜索框 
router.get('/sou', (req, res) => {
    var error = req.flash('error').toString()
    res.render('soulabel', { error })
})
router.post('/sou', (req, res) => {
  
    var user = req.session.user
    var keyWord = req.body.keyWord
    Mssage.find(
        {
            $or: [
                { title: { $regex: keyWord, $options: '$i' } },
                { content: { $regex: keyWord, $options: '$i' } },
                { label: new RegExp(keyWord, 'i') }
            ]
        }
    )
        .populate('author')
        .populate('reply')
        .sort({time:-1})
        .exec((err, date) => {
            if(date!=''){
                var msgs = JSON.parse(JSON.stringify(date))
                res.render('soulabel', { keyWord, user, msgs })
            }else{
                req.flash('error', '未找到')
                res.redirect('/sou')
            }
           
        })
})







module.exports = router;