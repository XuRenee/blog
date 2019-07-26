var express = require('express')
var router = express.Router()
var Mssage = require('../mongo/db/release')
var Reply = require('../mongo/db/reply')


var date= new Date()
var Year=date.getFullYear()
var Month=date.getMonth() + 1
var Day= date.getDate()
var Hour=date.getHours()
var Min=date.getMinutes()
var Sec=date.getSeconds()

var times={
year:Year,
month:Year+'-'+Month,
day:Year+'-'+Month+"-"+Day,
hour:Year+'-'+Month+"-"+Day+'-'+Hour,
min:Year+'-'+Month+"-"+Day+'-'+Hour+'-'+Min,
sec:Year+'-'+Month+"-"+Day+'-'+Hour+'-'+Min+'-'+Sec,
}




//增加留言
router.get('/release', (req, res) => {
    var error = req.flash('error').toString();
    var user = req.session.user

    res.render('release', { error, user })
})

router.post('/release', (req, res) => {


    if (req.session.user) {
  
        var m = new Mssage({
            title: req.body.title,
            author: req.session.user._id,
            time: times,
            label: req.body.label,
            content: req.body.content,
            reply: [],
            count:0
        })
      

            m.save(err => {
                if (err) {
                    res.send('失败')
                } else {
                    res.redirect('/')
                }
            })
  
    } else {
        req.flash('error', '请先登录')
        res.redirect('/release')
    }


})

//回复

router.get('/reply', (req, res) => {
    var error = req.flash('error').toString();
    res.render('login', { error })
})
router.post('/reply', (req, res) => {

    if (req.session.user) {
        var s = new Reply({
            name: req.session.user.username,
            time: new Date().toLocaleString(),
            content: req.body.content,
        })


        s.save((err) => {
            if (err) {
                res.send('回复失败')
            } else {
                Mssage.findOne({ _id: req.body._id }, (err, msgs) => {
                    msgs.reply.push(s._id)
                    msgs.save(err => {
                        res.redirect('/')
                    })
                })

            }
        })
    } else {
        req.flash('error', '登录后即可回复')
        res.redirect('/login')

    }

})


module.exports = router;
