const db = require('../db/index') // 修正路径引用
const formatCurrentTime=require("../utils/getDate")
const path=require("path")
const fs=require("fs")
const e = require('express')

const fillRecordH = (req, res) => {
    const { record_id, advice, cost, cure_state, check_items } = req.body
    // 构建更新SQL（根据record_id更新其他字段）
    const sql = `
        UPDATE medical_record 
        SET advice = ?, 
            cost = ?, 
            cure_state = ?, 
            check_items = ?,
            record_time=?
        WHERE record_id = ?
    `;

    db.query(sql, 
        [advice, cost, cure_state, check_items,formatCurrentTime(),record_id],
        (err, results) => {
            if (err) return res.sendRes(0, '填充失败: ' + err.message);
            if (results.affectedRows !== 1) {
                return res.sendRes(0, '记录不存在或填充失败');
            }
          return  res.sendRes(1, '记录填充成功');
        })
}

const getRecordsH = (req, res) => {
    const { page = 1, size = 10 ,patient_id} = req.body;
    const offset = (page - 1) * size;
    // 分页查询SQL（包含总数统计）
    const dataSql = `
        SELECT *
        FROM medical_record WHERE patient_id=?
        ORDER BY record_time DESC 
        LIMIT ? OFFSET ?
    `;
    

    // 并行查询数据和总数
    db.query(dataSql, [patient_id,size, offset], (dataErr, records) => {
        if (dataErr) return res.sendRes(0, dataErr.toString());
        let recordList=records.map(item=>{
            const leftPath=path.join(__dirname,'../public/uploads',item.left_eye)
            const rightPath=path.join(__dirname,'../public/uploads',item.right_eye)
            const leftBase=fs.readFileSync(leftPath).toString('base64')
            const rightBase=fs.readFileSync(rightPath).toString('base64')
            return {
                ...item,
                left_eye:`data:image/png;base64,${leftBase}`,
                right_eye:`data:image/png;base64,${rightBase}`
            }
            
        })
        const countSql = `SELECT COUNT(*) AS total FROM medical_record`;
        db.query(countSql, (countErr, countResult)=>{
            if (countErr) return res.sendRes(0, countErr.toString());
            const total = countResult[0].total;
           return res.sendRes(1,'查询成功',{
                total,
                recordList,
            })
        })
    })
}
const deleteRecordH=(req,res)=>{
    let record_id=req.params.record_id
    const querySql=`SELECT * FROM medical_record WHERE record_id=?`
    db.query(querySql,[record_id],(err,result)=>{
        if(err) return res.sendRes(0,err.toString())
        if(result.length===0) return res.sendRes(0,'记录不存在')
        const record=result[0]
        if(record.right_eye){
            const rightPath = path.join(__dirname,'../public/uploads',record.right_eye)
            fs.unlink(rightPath, (err) => {
                if (err) {
                    console.error(`Error deleting file ${record.right_eye}: ${err}`);
                } else {
                    console.log(`File ${record.right_eye} deleted`);
                }
            })
        }
        if(record.left_eye){
            const leftPath = path.join(__dirname,'../public/uploads',record.left_eye); // 假设图片文件名是img_id.jpg
            fs.unlink(leftPath, (err) => {
                if (err) {
                    console.error(`Error deleting file ${record.left_eye}: ${err}`);
                } else {
                    console.log(`File ${record.left_eye} deleted`);
                }
            })
        }
    })
    const sql = `DELETE FROM medical_record WHERE record_id = ?`;
    db.query(sql, [record_id], (err, result) => {
        if (err) return res.sendRes(0, err.toString());
        if (result.affectedRows!== 1) {
            return res.sendRes(0, '删除失败');
        }
        return res.sendRes(1, '记录删除成功');
    })

    
}
const updateRecordH=(req,res)=>{
    let leftImg=null
    let rightImg=null
    if(req.files.left_eye){
        leftImg=req.files.left_eye
    }
    if(req.files.right_eye){
        rightImg=req.files.right_eye
    }
    console.log(req.body.json)
    const {record_id,advice=null,cost=null,cure_state=null,check_items=null}=req.body.json?JSON.parse(req.body.json):'{}'
    const querySql=`SELECT * FROM medical_record WHERE record_id=?`
    db.query(querySql,[record_id],(err,result1)=>{
        if(err) return res.sendRes(0,err.toString())
        if(result1.length===0) return res.sendRes(0,'记录不存在')
            const upSql=`UPDATE medical_record SET advice=?,cost=?,cure_state=?,check_items=? WHERE record_id=?`
            db.query(upSql,[advice,cost,cure_state,check_items,record_id],(err,result2)=>{
                if(err) return res.sendRes(0,err.toString())
                if(result2.affectedRows!==1) return res.sendRes(0,'更新失败')
                if(leftImg){
                    path.join(__dirname,'../public/uploads',leftImg[0].filename);
                    const updateSql=`UPDATE medical_record SET left_eye=? WHERE record_id=?`
                    db.query(updateSql,[leftImg[0].filename,record_id],(err,result3)=>{
                        if(err) return res.sendRes(0,err.toString())
                        if(result3.affectedRows!==1) return res.sendRes(0,'更新失败')})
                    
                    if(result1[0].left_eye){
                        const oldPath = path.join(__dirname,'../public/uploads',result1[0].left_eye);
                        fs.unlink(oldPath, (err) => {
                            if (err) {
                                console.error(`Error deleting file ${result1[0].left_eye}: ${err}`);
                            } else {
                                console.error(`success deleting file ${result1[0].left_eye}: ${err}`);
                            }
                        })}
                }
                 if(rightImg){
                    path.join(__dirname,'../public/uploads',rightImg[0].filename);
                    const updateSql2=`UPDATE medical_record SET right_eye=? WHERE record_id=?`
                    db.query(updateSql2,[rightImg[0].filename,record_id],(err,result4)=>{
                        if(err) return res.sendRes(0,err.toString())
                        if(result4.affectedRows!==1) return res.sendRes(0,'更新失败')})
                    if(result1[0].right_eye){
                        const oldPath = path.join(__dirname,'../public/uploads',result1[0].right_eye);
                        fs.unlink(oldPath, (err) => {
                            if (err) {
                                console.error(`Error deleting file ${result1[0].left_eye}: ${err}`);
                            } else {
                                console.error(`success deleting file ${result1[0].left_eye}: ${err}`);
                            }})}
                }
                return res.sendRes(1,'更新成功')
            })
    })
}
    


module.exports={
    fillRecordH,
    getRecordsH,
    deleteRecordH,
    updateRecordH
}