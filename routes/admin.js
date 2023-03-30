  var express = require('express');
  var router = express.Router();
  var con = require('../config/Config')
  /* GET users listing. */
  router.get('/', function(req, res, next) {
    res.render('admin/register');
  });
  router.get('/login', function(req, res, next) {
    res.render('admin/Login');
  });
  router.post('/Register',(req,res)=>{
    var qry ="insert into  authority set ?"
    con.query(qry,req.body,(err,row)=>{
      if(err){
        console.log(err)
      }else{
        res.redirect('/admin')
      }
    })
  })
  router.post('/Login',(req,res)=>{
    let {email} = req.body;
    let {password} = req.body;
    let sql ="Select * from authority where email = ? and password = ?"
      con.query(sql,[email,password],(err,row)=>{
        if(err){
          console.log(err)
        }else{
          if(row.length>0){
              req.session.authority = row[0];
              console.log("login success")
              res.redirect('/admin/home')
          }
        }
      })
  })
  router.get('/home',(req,res)=>{
    let authority = req.session.authority;
    var sql = "select * from complaints";
    con.query(sql,(err,result)=>{
      if(err){
        console.log(err)
      }else{
        res.render('admin/home',{authority,result})
      }
    })
  })

  module.exports = router;
