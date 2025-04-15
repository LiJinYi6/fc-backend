const db= require('../db/index');
const {v4:uuidv4}=require('uuid');
const { updatePatientSchema } = require('../schema/patient');
const { result } = require('@hapi/joi/lib/base');

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
    const sql1="delete from medical_record where patient_id=?";
    db.query(sql1,patient_id,(err,results1)=>{
        if(err) return res.sendRes(0,err.toString());
        const sql=`delete from patient_user where patient_id=? and id=?`;
        db.query(sql,[patient_id,id],(err,results)=>{
            if(err) return res.sendRes(0,err.toString());
            if(results.affectedRows<=0) return res.sendRes(0,'删除失败');
            res.sendRes(1,'删除成功')
        })
    })
}
const getPatientH=(req,res)=>{
    const { page, size, name } = req.query;
    // 参数转换优化 ↓
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const pageSize = Math.max(parseInt(size, 10) || 10, 1);
    const offset = (pageNum - 1) * pageSize;
    const id=req.auth.id;
    const limit=pageSize;
    //查询病人总数
    let sqlCount='SELECT COUNT(*) AS total FROM patient_user WHERE id=?';
    let totals=0;
    db.query(sqlCount,id,(err,results)=>{
        if(err) return res.sendRes(0,err.toString());
        if(results.length===0) return res.sendRes(0,'总数查询失败');
         totals=results[0].total;   
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
        })
    
    // 修正SQL语句结构
   
}
const updatePatientH=(req,res)=>{
    // 添加默认值处理
    let {patient_name, patient_address, patient_sex, patient_age, patient_phone, cure_advice} = req.body;
    const {patient_id} = req.body;  // 必须参数不解构默认值
    const id=req.auth.id;
    
    const sql=`update patient_user set 
        patient_name=COALESCE(?,patient_name),
        patient_address=COALESCE(?,patient_address),
        patient_sex=COALESCE(?,patient_sex),
        patient_age=COALESCE(?,patient_age),
        patient_phone=COALESCE(?,patient_phone),
        cure_advice=COALESCE(?,cure_advice) 
        where patient_id=? and id=?`;

    const querySql='select * from patient_user where patient_id=? and id=?';
    db.query(querySql,[patient_id,id],(err,results)=>{
        if(err) return res.sendRes(0,err.toString());
        if(results.length===0) return res.sendRes(0,'患者不存在');
        
        // 使用现有值作为默认值
        const current = results[0];
        const params = [
            patient_name || current.patient_name,
            patient_address || current.patient_address,
            patient_sex || current.patient_sex,
            patient_age || current.patient_age,
            patient_phone || current.patient_phone,
            cure_advice || current.cure_advice,
            patient_id,
            id
        ];
        
        db.query(sql,params,(err,results)=>{
            if(err) return res.sendRes(0,err.toString());
            if(results.affectedRows!==1) return res.sendRes(0,'更新失败');
            res.sendRes(1,'更新成功')
        })
    })
}

module.exports={
    addPatientH,
    deletePatientH,
    getPatientH,
    updatePatientH,
}