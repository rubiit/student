let pool = require('./pool');
module.exports = {
  // 查询熏修课程信息
  findCourse:function(){
    var sql = "select name,credit,cid,csum from xk_course left join (select course_id as cid,count(student_id) as csum from xk_studentcourse group by (course_id)) as cc on xk_course.id = cc.cid;";
    return pool.execute(sql);
  },
  // 查询所有选课信息
  findAll:function(){
    var sql = "select student_id,course_id,xk_student.name sname,xk_course.name cname,xk_course.credit,grade from xk_student,xk_course,xk_studentcourse where xk_studentcourse.student_id = xk_student.id and xk_studentcourse.course_id = xk_course.id;";
    return pool.execute(sql);
  },
  //选课
  selectCourse:function(studentId,courseId){
    var sql = "insert into xk_studentcourse values(null,0,"+studentId+","+courseId+")";
    return pool.execute(sql);
  },
  //取消选课
  cancelCourse:function(studentId,courseId){
    var sql = 'delete from xk_studentcourse where student_id='+studentId+' and course_id='+courseId;
    return pool.execute(sql);
  },
  //通过学生ID查询已经选课信息
  findSelectedCourseByStudentId:function(studentId){
    var sql = 'select s.*,c.*,sc.*'
      +' from xk_student as s,xk_studentcourse as sc,xk_course as c'
      +' where s.id = sc.student_id'
      +' and c.id = sc.course_id'
      +' and s.id = '+studentId;
    return pool.execute({sql:sql,nestTables:true});
  },
  //打分
  score:function(id,score){
    var sql = 'update xk_studentcourse set grade ='+score+' where id = '+id;
    return pool.execute(sql);
  }
}


