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
  let user = req.session.user;
  var sql = "select * from complaints";
  con.query(sql,(err,result)=>{
    if(err){
      console.log(err)
    }else{
      console.log(result,"00000000000000000")
      res.render('user/newsFeeds',{result,user});

    }
  })
});
router.get('/notifications', function(req, res, next) {
  let umail = req.session.user.email;
  let sql ="select * from notification where email = ? "
  con.query(sql,[umail],(err,result)=>{
    if(err){
      console.log(err)
    }else{
      let user = req.session.user;
      res.render('user/Notification',{result,user});
    }
  })

});
router.get('/History', function(req, res, next) {
  let sql ="select * from complaints where user_id = ?"
  let uid = req.session.user.id;
  let user = req.session.user;
  con.query(sql,[uid],(err,row)=>{
    if(err){
      console.log(err)
    }else{
      res.render('user/history',{row,user});
    }
  })

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
    let userName = req.session.user.name;
    data.user_id= user_id;
    if(!req.files) return res.status(400).send("no files were uploaded.");
    var file=req.files.img;
    var image_name = file.name;
    console.log(file)
    console.log(image_name);
    if(file.mimetype =="image/jpeg" || file.mimetype =="image/png" || file.mimetype =="image/gif"
  ){
    file.mv("public/images/complaints/"+file.name,function(err){
      if(err) return res.status(500).send(err);
      console.log(image_name);
      let sql = "insert into complaints set ?"
      const d = new Date();
      data.img = image_name;
      data.date = d;
      data.userName=userName;
      con.query(sql,data,(err,row)=>{
        if(err){
          console.log(err)
        }else{
          res.redirect('/Home')
        }
      })


    })
  }
    
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
router.get('/like/:id',(req,res)=>{
    console.log(req.params.id,"parms id")
    let postID = req.params.id;
    let id = req.session.user.id;
    let sql = "select * from complaints where id = ? and user_id =?"
    con.query(sql,[postID,id],(err,row)=>{
      if(err){
        console.log(err)
      }else{
        console.log(row,"userdata------------")
        if(row.length>0){
          res.redirect('/news-feeds')
        }else{
          let sql2 = "select * from complaints where id = ?"
          con.query(sql2,[postID],(err,result)=>{
            if(err){
              console.log(err)
            }else{
              console.log(result)
              let like = result[0].like;
              like = like + 1;
              console.log(like,"new like")
              // let sqlT =`UPDATE `complaints` SET `like` = '1' WHERE `complaints`.`id` = 3`
                  let usserid = req.session.user.id;
                let obj = {
                  like :like,
                  user_id:usserid
                }
              let sql3 = `update complaints set ? where id =${postID}`
              con.query(sql3,obj,(err,row2)=>{
                if(err){
                  console.log(err)
                }else{
                  console.log("added")
                  res.redirect('/news-feeds')
                }
              })
            }
          })
        }
      }
    })
})


router.post('/cmnt',(req,res)=>{
  console.log(req.body)
  req.body.userId =  req.session.user.id;
  req.body.name = req.session.user.name;
  let sql ="insert into comments set ?"
  con.query(sql,req.body,(err,row)=>{
    if(err){
      console.log(err)
    }else{
      res.redirect('/news-feeds')
    }
  })
})
router.get('/comment/:id',(req,res)=>{
  let id = req.params.id;
  let sql = "select * from comments where post_id = ?"
  con.query(sql,[id],(err,row)=>{
    if(err){
      console.log(err)
    }else{
      res.render('user/comments',{row})
    }
  })
})
router.get('/logout',(req,res)=>{
  req.session.user = null;
  res.redirect('/')
})
module.exports = router;
