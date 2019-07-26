var express = require('express')
var router = express.Router()
var Mssage = require('../mongo/db/release')

//删除
router.get('/dele', (req, res) => {
    Mssage
        .deleteOne({ _id: req.query._id }, err => {
            res.redirect('/')
        })
})


//编辑
router.get('/update', (req, res) => {
    Mssage.findOne({ _id: req.query._id }).exec((err, data) => {
        var msgs = JSON.parse(JSON.stringify(data))
        var user = req.session.user
        res.render('update', { user, msgs })
    })
})
router.post('/update', (req, res) => {

    Mssage
        .updateOne({ _id: req.body._id }, {
            content: req.body.content,
        }, err => {
            res.redirect('/')



        })

})



module.exports = router;
