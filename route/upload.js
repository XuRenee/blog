var express=require('express')
var route=express.Router()
var fs=require('fs')
var multer=require('multer')
var uploadpath=('./public/img/')          //文件上传路径
var User=require('../mongo/db/user')
var headername;
var storage = multer.diskStorage({
    //设置文件存储的路径
    destination: function (req, file, cb) {
        console.log(uploadpath);
        
        cb(null, uploadpath)
    },

    filename: function (req, file, cb) {
    var arr=file.originalname.split('.')  //将文件名与文件后缀分隔
    var ext=arr[arr.length-1]//获取文件的后缀

    //将文件名格式改为：姓名+时间+后缀名
   headername=req.session.user.username+'-'+Date.now()+'.'+ext
        cb(null, headername)
    }
})

var upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    //文件筛选，决定哪些文件可上传，哪些文件跳过
    fileFilter:function(req,file,cb){
        if(file.mimetype.startsWith('image')){    //判断文件类型
            cb(null,true)
        }else{
            cb('只能上传图片',false)
        }
    }
})

route.post('/uploads', upload.single('header'), (req, res) => {
    console.log('-----------');
    
   //设置新头像
   var headerUrl='/img/'+headername

   if(fs.existsSync(uploadpath+headername)){    //判断这个文件是否存在
       User.findOne({_id:req.session.user._id},(err,user)=>{
        
        var yonghu=JSON.parse(JSON.stringify(user))
        console.log(headerUrl);
        
        console.log(yonghu.headerurl);
        
        
           //从数据库中获取用户信息，获取到原有头像，删除，并存入新头像
           if(yonghu.headerurl != '/img/m.jpg'){
                fs.unlinkSync('./public'+yonghu.headerurl)
           }
           user.headerurl=headerUrl
           user.save(()=>{
               req.session.user.headerurl=headerUrl
               res.redirect('/')
           })
          
       })
   }else{
       res.send('上传失败')
   }
})

route.get('/edit/userinfo',(req,res)=>{
    var user=req.session.user
    console.log(user.headerurl);
    
    res.render('userinfo',{user})
})
route.get('/edit/user/header/:name',(req,res)=>{
    var user=req.session.user

    res.render('edit',{user});
});




module.exports = route
