var express = require('express');
var router = express.Router();
var database = require('../db/databasetwo')
const ContollerUser = require('../controller/Usercontroller')
/* GET home page. */
router.get('/', function(req,res,next) {
  res.render('index', { title: 'Express' });
});
router.post('/insertuser',ContollerUser.InsertUser)
router.post('/verifyemail',ContollerUser.VerifyEmail)
router.post('/verifyotp',ContollerUser.VerifyOtp)
router.post('/loginuser',ContollerUser.LoginUser)
router.post('/sendmessage',ContollerUser.MessageUser)
module.exports = router;
