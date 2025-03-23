const db= require('../db/index');
const {v4:uuidv4}=require('uuid');
const { updatePatientSchema } = require('../schema/patient');

const addPatientH=(req,res)=>{
    let id=req.auth.id
    const {patient_name,patient_address,patient_sex,patient_age,patient_phone}=req.body;
    const patient_id=uuidv4();
    const sql=`insert into patient_user (id,patient_id,patient_name,patient_address,patient_sex,patient_age,patient_phone) values (?,?,?,?,?,?,?)`;
    db.query(sql,[id,patient_id,patient_name,patient_address,patient_sex,patient_age,patient_phone],(err,results)=>{
        if(err) return res.sendRes(0,err.toString());
        if(results.affectedRows!==1) return res.sendRes(0,'添加失败');
        res.sendRes(1,'添加成功')
    })
}
const deletePatientH=(req,res)=>{
    const patient_id=req.params.patient_id;
    const id=req.auth.id;
    const sql=`delete from patient_user where patient_id=? and id=?`;
    db.query(sql,[patient_id,id],(err,results)=>{
        if(err) return res.sendRes(0,err.toString());
        if(results.affectedRows!==1) return res.sendRes(0,'删除失败');
        res.sendRes(1,'删除成功')
    })
}
const getPatientH=(req,res)=>{
    const {page=1,size=10,name}=req.body;
    const id=req.auth.id;
    const offset=(page-1)*size;
    const limit=size;
    //查询病人总数
    let sqlCount='SELECT COUNT(*) AS total FROM patient_user WHERE id=?';
    let totals=0;
    db.query(sqlCount,id,(err,results)=>{
        if(err) return res.sendRes(0,err.toString());
        if(results.length===0) return res.sendRes(0,'总数查询失败');
         totals=results[0].total;   
        })
    
    // 修正SQL语句结构
    let sql='SELECT * FROM patient_user WHERE id=? LIMIT ?, ?';
    let params = [id, offset, limit];
    
    if(name){
        sql='SELECT * FROM patient_user WHERE patient_name LIKE ? AND id=? LIMIT ?, ?';
        params = [`%${name}%`, id, offset, limit];
    }
    db.query(sql, params, (err,results)=>{
        if(err) return res.sendRes(0,err.toString());
        if(results.length===0) return res.sendRes(0,'暂无患者');
        res.sendRes(1,'查询成功',{
            results,
            totals
        })
    })
}
const updatePatientH=(req,res)=>{
    let {patient_name,patient_address,patient_sex,patient_age,patient_phone,patient_id,cure_advice}=req.body;
    const id=req.auth.id;
    const sql=`update patient_user set patient_name=?,patient_address=?,patient_sex=?,patient_age=?,patient_phone=?,cure_advice=? where patient_id=? and id=?`;
    db.query(sql,[patient_name,patient_address,patient_sex,patient_age,patient_phone,cure_advice,patient_id,id],(err,results)=>{
        if(err) return res.sendRes(0,err.toString());
        if(results.affectedRows!==1) return res.sendRes(0,'更新失败');
        res.sendRes(1,'更新成功')
    })
}

module.exports={
    addPatientH,
    deletePatientH,
    getPatientH,
    updatePatientH,
}