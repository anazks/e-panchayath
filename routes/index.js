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
      console.log(req.session.user)
      res.render('user/Home',{user})
    }else{
      res.render('user/Home');
    }
 
});
router.get('/update-user', function(req, res, next) {
  res.render('user/updateProfile');
});
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
module.exports = router;
