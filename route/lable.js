var express = require('express')
var router = express.Router()
var Mssage = require('../mongo/db/release')



//找到所有标签，遍历，去重，转为数组，排除空值，渲染到页面
router.get('/lable', (req, res) => {
    Mssage
        .find()
        .populate('author')
        .populate('reply')
        .sort({time:-1})
        .exec((err, data) => {
            var user = req.session.user
            var arr = []
            var lab = []
            var msgs = JSON.parse(JSON.stringify(data));

            //第一次遍历，遍历所有博客信息找出所有标签,标签都为数组，将这些标签数组整合为一个数组 arr
            msgs.forEach(item => {
                var lable = item.label
                arr.push(lable)
            })

            //遍历arr，取出arr中的每个数组，再遍历每个数组中的值，加入到新数组 lab 去除里面的空值
            arr.forEach(item => {
                item.forEach(item => {
                    if (item != '') {
                        lab.push(item)

                    }
                })
            })

            //Set方法为lab 去重
            var set = new Set(lab)

            //将set转为数组
            var array = Array.from(set)
            console.log(array)
            res.render('lable', { msgs, user, array })
        })
})

router.get('/label/search', (req, res, next) => {
    // 在博客里面找到所有标签带有 2222  的博客
    // 渲染页面
    var user=req.session.user
    Mssage.find({
        label: new RegExp(req.query.label, 'i')
    })
        .populate('author')
        .populate('reply')
        .sort({time:-1})
        .exec((err, data) => {
            console.log(data)
            var msg = JSON.parse(JSON.stringify(data))
            res.render('lable', { msg ,user})
        })
})



module.exports = router;
