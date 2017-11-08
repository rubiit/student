let express = require('express');
let userDB = require('../db/userDB');
let Student = require('../model/Student')
let Course = require('../model/Course')

let route = express.Router();
// 登录，验证用户信息
route.post('/login',(req,resp)=>{
  console.log(req.body.username);
  console.log(req.body.password);
  userDB.login(req.body.username,req.body.password)
  .then((data)=>{
    resp.send(data);
  }).catch((error)=>{
    resp.send(error);
  });
});
// 注册
route.post('/register',(req,resp)=>{
  console.log(req.body.username);
  console.log(req.body.password);
  userDB.register(req.body.username,req.body.password)
  .then((data)=>{
    resp.send(data);
  }).catch((error)=>{
    resp.send(error);
  });
});


module.exports = route;

