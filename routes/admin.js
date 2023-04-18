  var express = require('express');
  var router = express.Router();
  var con = require('../config/Config')
  /* GET users listing. */
  router.get('/', function(req, res, next) {
    if(req.session.authority){
      let authority = req.session.authority;
      res.render('admin/register',{authority});
    }else{
      res.render('admin/register');
    }
   
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
    let sql ="Select * from authority where email = ? and password = ? and status = 'approved'"
      con.query(sql,[email,password],(err,row)=>{
        if(err){
          console.log(err)
        }else{
          if(row.length>0){
              req.session.authority = row[0];
              console.log("login success")
              res.redirect('/admin/home')
          }else{
            res.redirect('/admin/login')
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
  router.get('/Complaints',(req,res)=>{
    let authority = req.session.authority;
    var sql = "select * from complaints";
    con.query(sql,(err,result)=>{
      if(err){
        console.log(err)
      }else{
        console.log(result,"00000000000000000")
        res.render('admin/complaints',{authority,result})
      }
    })
  })
  router.post('/response',(req,res)=>{
      let id = req.body.id;
      let response = req.body.response;
      let sql = "update complaints set response	 = ? where id = ?"
      con.query(sql,[response,id],(err,row)=>{
        if(err){
          console.log(err)
        }else{
          res.redirect('/admin/Complaints')
        }
      })

  })
  router.post('/addNotification',(req,res)=>{
    let sql = "insert into notification set?"
    con.query(sql,req.body,(err,row)=>{
      if(err){
        console.log(err)
      }else{
        res.redirect('/admin/')
      }
    })

})
router.get('/varify/:id',(req,res)=>{
  var id = req.params.id;
  var sql = "update complaints set status = 'varified' where id = ?"
  con.query(sql,[id],(err,row)=>{
    if(err){
      console.log(err)
    }else{
      res.redirect('/admin/home')
    }
  })
})
router.get('/getUser/:id',(req,res)=>{
  let id= req.params.id;
  let sql ="select * from user where id = ?"
  con.query(sql,[id],(err,row)=>{
    if(err){
      console.log(err)
    }else{
      let userData = row[0]
      console.log(userData)
      let user = req.session.user;
      res.render('admin/userProfile',{user,userData})
    }
  })
})
router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.redirect('/')
})
  module.exports = router;
