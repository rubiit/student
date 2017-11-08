let pool = require('./pool');
module.exports = {
    login:function(username,password){
        var sql = "select * from userInfo where username = '"+username+"' and password = '"+password+"' ";
        return pool.execute(sql);
    },
    register:function(username,password){
        var sql = "insert into userInfo values(null,'"+username+"','"+password+"')";
        return pool.execute(sql);
    },

}