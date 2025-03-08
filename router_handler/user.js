const db=require('../db/index')
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
const config=require('../config')
//创建函数




//定义登录函数
const login=(req,res)=>{
    //获取用户信息
    const userInfo=req.body
    //定义查询语句
    const sql='select * from user_info where username=?'
    //执行查询语句
    db.query(sql,userInfo.username,(err,results)=>{
        //如果查询出错，返回错误信息
        if(err)return res.sendRes(0,err)
        //如果查询结果为空，返回登录失败信息
        if(results.length<=0)return res.sendRes(0,'登陆失败！！！用户名有误')
        //检查密码是否一致    
        const cmpRes=bcryptjs.compareSync(userInfo.password,results[0].password)
        const cmpRes2=userInfo.password==results[0].password?true:false
        //如果密码一致，返回登录成功信息
        if(cmpRes || cmpRes2){
            //去除密码等私人信息
            const user={...results[0],password:'',phone:'',email:'',address:''}
            //生成token
            const token=jwt.sign(user,config.jwtSecretKey,{expiresIn:config.expiresIn})
            //返回登录成功信息
            return res.sendRes(1,'登陆成功',
                {token:'Bearer '+token})
        }else{
            //如果密码不一致，返回登录失败信息
            return res.sendRes(0,'登陆失败,密码错误')
        }
    })
    
}
//获取个人信息
function getUserInfo(req,res){
    const sql='select id,username,name,email,sex,address,phone from user_info where id=?'
    db.query(sql,req.auth.id,(err,results)=>{
        if(err) return res.sendRes(0,err)
        if(results.length!=1)return res.sendRes(0,'获取用户信息失败')
        res.sendRes(1,'获取成功',results[0])
    })
   
}
//更新基本信息
const updateUser=(req,res)=>{
    const sql="update user_info set name=? , sex=? ,email=? ,phone=?, address=? where id=?"
    db.query(sql,[req.body.name,req.body.sex,req.body.email,req.body.phone,req.body.address,req.auth.id],(err,results)=>{
        if(err)return res.sendRes(0,err)
        if(results.affectedRows!==1) return res.sendRes(0,'更新用户的基本信息失败,检查id是否正确')
        res.sendRes(1,'更新用户信息成功')
    })

}
// 定义更新密码的函数
const updatePwd=(req,res)=>{
    // 查询用户表中id为req.auth.id的记录
    const sql='select * from user_info where id=?'
    db.query(sql,req.auth.id,(err,results)=>{
        // 如果查询出错，返回错误信息
        if(err)return res.sendRes(0,err)
        // 如果查询结果不为1，返回用户不存在的错误信息
        if(results.length!=1) return res.sendRes(0,'用户不存在')
        // 如果旧密码与数据库中的密码匹配
        if(req.body.oldPwd==results[0].password||bcryptjs.compareSync(req.body.oldPwd,results[0].password))
        {
            // 更新用户表中id为req.auth.id的记录的密码为新密码
            const sql2='update user_info set password=? where id=?'
            db.query(sql2,[bcryptjs.hashSync(req.body.newPwd,10),req.auth.id],(err,resultss)=>{
                // 如果更新出错，返回错误信息
                if(err) return req.sendRes(0,err)
                // // 打印更新结果
                //     console.log(resultss)
                // 如果更新结果受影响的行数小于1，返回更新失败的信息
                if(resultss.affectedRows<1) return res.sendRes(0,'更新失败')
                // 返回更新成功的信息
                res.sendRes(1,'更新成功')
            })
        }
        // 如果旧密码与数据库中的密码不匹配，返回旧密码错误的错误信息
        else
        res.sendRes(0,'旧密码错误,请重试')
    })
}


module.exports={
    getUserInfo,
    updateUser,
    updatePwd,
    login,
}