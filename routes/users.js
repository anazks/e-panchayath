var express = require('express');
var router = express.Router();
var con = require('../config/Config')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('Sadmin/Login')
});
router.post('/login',(req,res)=>{
  console.log(req.body)
  let userName = "admin"
  let password ="admin"
  if(req.body.name==userName && req.body.pasword ==password){
      res.redirect('/users/home')
  }
})
router.get('/home',(req,res)=>{
  let sql = "select * from authority"
      con.query(sql,(err,row)=>{
        if(err){
          console.log(err)
        }else{  
          let sql2= "SELECT COUNT(*) as users FROM user;"
          con.query(sql2,(err,row2)=>{
              if(err){
                console.log(err)
              }else{
                //console.log(row2[0].users)
                let users = row2[0].users
                let sql3 = "SELECT COUNT(*) as complaints FROM complaints"
                con.query(sql3,(err,row3)=>{
                  if(err){
                    console.log(err)
                  }else{
                   let complaints = row3[0].complaints;
                   let sql4 = "SELECT COUNT(*) as Authorites FROM authority"
                   con.query(sql4,(err,row4)=>{
                    if(err){
                      console.log(err)
                    }else{
                      let Authorites = row4[0].Authorites;
                      let data ={
                        complaints,
                        Authorites,
                        users
                      }
                      res.render("Sadmin/adminHome",{row,data})
                    }
                   })
                  }
                })
               
              }
          })
         
        }
      })
})
router.get('/viewAuthority/:id',(req,res)=>{
  let id = req.params.id;
  console.log(id)
  let sql = "select * from authority where id  =?"
  con.query(sql,[id],(err,row)=>{
    if(err){
      console.log(err)
    }else{
      console.log(row)
      let userData = row[0];
       res.render('Sadmin/profileView',{userData})
    }
  })
})
router.get('/approveAuth/:id',(req,res)=>{
   let id  = req.params.id;
   let sql = `update authority set ? where id = ${id}`
   let obj = {
    status:"approved"
   }
   con.query(sql,obj,(err,row)=>{
    if(err){
      console.log(err)
    }else{
      res.redirect('/users/home')
    }
   })
})


router.get('/waitingAuth/:id',(req,res)=>{
  let id  = req.params.id;
  let sql = `update authority set ? where id = ${id}`
  let obj = {
   status:"waitingList"
  }
  con.query(sql,obj,(err,row)=>{
   if(err){
     console.log(err)
   }else{
     res.redirect('/users/home')
   }
  })
})

router.get('/RejectAuth/:id',(req,res)=>{
  let id  = req.params.id;
  let sql = `update authority set ? where id = ${id}`
  let obj = {
   status:"Reject"
  }
  con.query(sql,obj,(err,row)=>{
   if(err){
     console.log(err)
   }else{
     res.redirect('/users/home')
   }
  })
})
router.get('/All_users',(req,res)=>{
  var sql ="select * from user"
  con.query(sql,(err,result)=>{
    if(err){
      console.log(err)
    }else{
      res.render("Sadmin/allUsers",{result})
    }
  })
})
router.get('/authorirty_View',(req,res)=>{
  var sql ="select * from authority"
  con.query(sql,(err,result)=>{
    if(err){
      console.log(err)
    }else{
      res.render("Sadmin/allUsers",{result})
    }
  })
})
router.get('/Delete-user/:id',(req,res)=>{
    let uid = req.params.id;
    let sql ="delete from user where id = ?"
    con.query(sql,[id],(err,row)=>{
      if(err){
        console.log(err)
      }else{
        res.redirect('/users/home')
      }
    })
})
router.get('/Delete-auth/:id',(req,res)=>{
  let uid = req.params.id;
  let sql ="delete from authority  where id = ?"
  con.query(sql,[id],(err,row)=>{
    if(err){
      console.log(err)
    }else{
      res.redirect('/users/home')
    }
  })
})
router.get("/logout",(req,res)=>{
    req.session.destroy();
    res.redirect('/users/')
})
module.exports = router;
