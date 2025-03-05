const db= require('../db/index');
const {v4:uuidv4}=require('uuid');

const addPatientH=(req,res)=>{
    let id=req.auth.id
    const {patient_name,patient_address,patient_sex,patient_age}=req.body;
    const patient_id=uuidv4();
    const sql=`insert into patient_user (id,patient_id,patient_name,patient_address,patient_sex,patient_age) values (?,?,?,?,?,?)`;
    db.query(sql,[id,patient_id,patient_name,patient_address,patient_sex,patient_age],(err,results)=>{
        if(err) return res.sendRes(0,err.toString());
        if(results.affectedRows!==1) return res.sendRes(0,'添加失败');
        res.sendRes(1,'添加成功')
    })
}

module.exports={
    addPatientH
}