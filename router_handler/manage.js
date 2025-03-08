const db= require('../db/index');
const {v4:uuidv4}=require('uuid');
const bcryptjs=require('bcryptjs')
const createUser=(req,res)=>{
    //获取用户信息
    const userInfo=req.body
    //查询数据库中是否存在相同用户名
    const sqlStr='select * from user_info where username=?'
    db.query(sqlStr,userInfo.username,(err,results)=>{
        if(err){
            return res.sendRes(0,'数据库查询错误')
        }
        //如果存在相同用户名，返回错误信息
        if(results.length>0){
            return res.sendRes(0,'用户名被占用，请更换！！！')
        }
        //给密码加密
        userInfo.password=bcryptjs.hashSync(userInfo.password,10)
        //将用户信息插入数据库
        const sql='insert into user_info set ?'
        db.query(sql,{username:userInfo.username,password:userInfo.password,id:uuidv4(),name:userInfo.name},(err,results)=>{
            if(err || results.affectedRows!==1){
                return res.sendRes(0,err)
            }
            // 返回成功信息（移动到这里）
            res.sendRes(1,'创建成功')
        })
        // 移除原来这里的 res.sendRes(1,'创建成功') 
    })
}
module.exports={
    createUser
}