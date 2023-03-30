var express = require('express');
var router = express.Router();
var con = require('../config/Config')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/Register', function(req, res, next) {
  res.render('user/Register');
});
router.get('/Login', function(req, res, next) {
  res.render('user/Login');
});
router.get('/Home', function(req, res, next) {
    if(req.session.user){
      let user = req.session.user;
      console.log(req.session.user,"session created")
      res.render('user/Home',{user})
    }else{
      res.render('user/Home');
    } 
});
router.get('/update-user', function(req, res, next) {
  let sql = "select * from user where id = ?"
  let userID = req.session.user.id;
  con.query(sql,[userID],(err,row)=>{
    if(err){
      console.log(err)
    }else{
      res.render('user/updateProfile',{userData:row[0]});
    }
  })
});
router.post('/update_profile',(req,res)=>{
  let id = req.session.user.id;
  let sql = `update user set ? where id =${id}`
  con.query(sql,req.body,(err,row)=>{
    if(err){
      console.log(err)
    }else{
      res.redirect('/Home')
    }
  })
})
router.get('/complaint-Register', function(req, res, next) {
  res.render('user/RegisterComplant');
});
router.get('/news-feeds', function(req, res, next) {
  res.render('user/newsFeeds');
});
router.get('/notifications', function(req, res, next) {
  res.render('user/Notification');
});
router.post('/Register',(req,res)=>{
  var sql ="insert into user set ?"
    console.log(req.body)
    con.query(sql,req.body,(err,row)=>{
      if(err){
        console.log(err)
      }else{
        console.log("data inserted")
        res.redirect('/Login')
      }
    })
})
router.post('/Login',(req,res)=>{
  var sql ="select * from user where email = ? and password = ?"
  let {email} = req.body;
  let {password} = req.body;
  con.query(sql,[email,password],(err,row)=>{
    if(err){
      console.log(err)
    }else{
      if(row.length>0){
        req.session.user=row[0];
        res.redirect('/Home')
      }else{
          res.redirect('/Login')
      }
    }
  })
})
router.post('/add-complaints',(req,res)=>{
    let data = req.body;
    let user_id = req.session.user.id;
    data.user_id= user_id;
    let sql = "insert into complaints set ?"
    con.query(sql,data,(err,row)=>{
      if(err){
        console.log(err)
      }else{
        res.redirect('/Home')
      }
    })
})
router.get('/Tracking',(req,res)=>{
    let sql = "select * from complaints where user_id =?"
    let userid = req.session.user.id;
    con.query(sql,[userid],(err,row)=>{
      if(err){
        console.log(err)
      }else{
        res.render('user/Tracking',{trackData:row})
      }
    })
})
router.get('/logout',(req,res)=>{
  req.session.user = null;
  res.redirect('/')
})
module.exports = router;
