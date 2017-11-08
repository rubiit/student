let express = require('express');
let StudentCourseDB = require('../db/studentCourseDB');
let Student = require('../model/Student')
let Course = require('../model/Course')

let route = express.Router();
// 查询选修情况
route.get('/findCourse',(req,resp)=>{
  StudentCourseDB.findCourse().then((data)=>{
    resp.send(data);
  }).catch((error)=>{
    resp.send(error);
  });
});
//查询所有
route.get('/findAll',(req,resp)=>{
  StudentCourseDB.findAll().then((data)=>{
    resp.send(data);
  }).catch((error)=>{
    resp.send(error);
  });
});

/*
  选课
  studentId 
  courseId
*/
route.post('/selectCourse',(req,resp)=>{
  console.log(req.body.sid);
  console.log(req.body.cid);
  StudentCourseDB.selectCourse(+req.body.sid,+req.body.cid)
  .then((data)=>{
    resp.send(data);
  }).catch((error)=>{
    resp.send(error);
  });
});

/*
  通过学生ID查询已经选课信息
  @param studentId
*/
route.get('/findSelectedCourseByStudentId',(req,resp)=>{
  StudentCourseDB.findSelectedCourseByStudentId(req.query.studentId)
  .then((data)=>{
    resp.send(data);
  }).catch((error)=>{
    resp.send(error);
  });
});

/*
  取消选课
  @param studentId，courseId
*/
route.post('/cancelCourse',(req,resp)=>{
  var studentId = JSON.parse(req.body.sid);
  var courseId = JSON.parse(req.body.cid);
  StudentCourseDB.cancelCourse(studentId,courseId)
  .then((data)=>{
    resp.send(data);
  }).catch((error)=>{
    resp.send(error);
  });
});

/*
  打分
  @param 选课id，分数grade
*/
route.get('/mark',(req,resp)=>{
  StudentCourseDB.score(req.query.id,req.query.grade)
  .then((data)=>{
    resp.send(data);
  }).catch((error)=>{
    resp.send(error);
  });
});

module.exports = route;