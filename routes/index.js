var express = require('express');
var router = express.Router();

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
  res.render('user/Home');
});
router.get('/update-user', function(req, res, next) {
  res.render('user/updateProfile');
});
router.get('/complaint-Register', function(req, res, next) {
  res.render('user/RegisterComplant');
});
module.exports = router;
