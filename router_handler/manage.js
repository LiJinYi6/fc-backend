const db= require('../db/index');
const {v4:uuidv4}=require('uuid');
const bcryptjs=require('bcryptjs')
const getTotals=(req,res)=>{
    const sql='select count(*) as doctorTotal from user_info';
    db.query(sql,(err,results1)=>{
        if(err) return res.sendRes(0,err.toString());
        if(results1.length!==1) return res.sendRes(0,'查询失败');
        const sql='select count(*) as patientTotal from patient_user';
        db.query(sql,(err,results2)=>{
            if(err) return res.sendRes(0,err.toString());
            if(results2.length!==1) return res.sendRes(0,'查询失败');
            const sql='select count(*) as recordTotal from medical_record';
            db.query(sql,(err,results3)=>{
                if(err) return res.sendRes(0,err.toString());
                if(results3.length!==1) return res.sendRes(0,'查询失败');
                res.sendRes(1,'查询成功',{
                    doctorTotal:results1[0].doctorTotal,
                    patientTotal:results2[0].patientTotal,
                    recordTotal:results3[0].recordTotal,
                })
            })
    })
})
}
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
           return res.sendRes(1,'创建成功')
        })
    })
}
const getDoctor=(req,res)=>{
    // 从query获取参数 ↓
    const { page, size, name } = req.query;
    // 参数转换与校验 ↓
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const pageSize = Math.max(parseInt(size, 10) || 10, 1);
    const offset = (pageNum - 1) * pageSize;
    //查询所有医生总数
    let sqlCount='SELECT COUNT(*) AS total FROM user_info';
    let totals=0;
    db.query(sqlCount,(err,results)=>{
        if(err) return res.sendRes(0,err.toString());
        if(results.length===0) return res.sendRes(0,'总数查询失败');
         totals=results[0].total;   })
    
    // 修正SQL语句结构
    let sql='SELECT * FROM user_info  LIMIT ?, ?';
    let params = [ offset, pageSize];
    
    if(name){
        sql='SELECT * FROM patient_user WHERE patient_name LIKE ?  LIMIT ?, ?';
        params = [`%${name}%`,  offset, pageSize];
    }
    db.query(sql, params, (err,results)=>{
        if(err) return res.sendRes(0,err.toString());
        if(results.length===0) return res.sendRes(1,'空');
        return res.sendRes(1,'查询成功',{
            results,
            totals}
        )
    })
}
const updateDoctor=(req,res)=>{
    let {name,address,sex,phone,email,type,id}=req.body;
    const sql=`update user_info set name=?,address=?,sex=?,phone=?,email=?,type=? where  id=?`;
    db.query(sql,[name,address,sex,phone,email,type,id],(err,results)=>{
        if(err) return res.sendRes(0,err.toString());
        if(results.affectedRows!==1) return res.sendRes(0,'更新失败');
        return res.sendRes(1,'更新成功')
    })
}
const deleteDoctor=(req,res)=>{
    const id=req.params.id;
    const sql=`delete from user_info where id=?`;
    db.query(sql,[id],(err,results)=>{
        if(err) return res.sendRes(0,err.toString());
        if(results.affectedRows!==1) return res.sendRes(0,'删除失败');
        return res.sendRes(1,'删除成功')
    })
}
module.exports={
    createUser,
    updateDoctor,
    deleteDoctor,
    getDoctor,
    getTotals
}