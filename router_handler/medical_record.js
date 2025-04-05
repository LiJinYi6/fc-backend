const db = require('../db/index') // 修正路径引用
const formatCurrentTime=require("../utils/getDate")
const path=require("path")
const fs=require("fs")
const e = require('express')

const giveDozenResultH = (req, res) => {
    const recordUpdates = req.body; // 重命名变量更清晰
    if (!Array.isArray(recordUpdates)) {
        return res.sendRes(0, '请求体格式错误，需要数组格式');
    }
    // 创建Promise数组用于批量处理
    const updatePromises = recordUpdates.map(({ record_id, result }) => {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE medical_record 
                        SET result = ?, 
                            record_time = ? 
                        WHERE record_id = ?`;
            db.query(sql, [result, formatCurrentTime(), record_id], (err, results) => {
                err ? reject({ record_id, error: err }) : resolve(results);
            });
        });
    });

    // 并行执行所有更新
    Promise.all(updatePromises)
        .then(results => {
            const failedUpdates = results.filter(r => r.affectedRows !== 1);
            if (failedUpdates.length > 0) {
                return res.sendRes(0, `部分更新失败，影响记录数：${failedUpdates.length}`);
            }
            res.sendRes(1, `成功更新${results.length}条记录`);
        })
        .catch(error => {
            res.sendRes(0, `记录ID ${error.record_id} 更新失败: ${error.error.toString()}`);
        });
}

const fillRecordH = (req, res) => {
    const { record_id, ...updateFields } = req.body;
    
    // 查询当前记录值
    const querySql = `SELECT * FROM medical_record WHERE record_id = ?`;
    db.query(querySql, [record_id], (queryErr, queryResults) => {
        if (queryErr) return res.sendRes(0, '查询失败: ' + queryErr.message);
        if (queryResults.length === 0) return res.sendRes(0, '记录不存在');

        const currentRecord = queryResults[0];
        
        // 构建更新参数（使用传入值或当前值）
        const updateParams = {
            advice: updateFields.advice ?? currentRecord.advice,
            cost: updateFields.cost ?? currentRecord.cost,
            cure_state: updateFields.cure_state ?? currentRecord.cure_state,
            check_items: updateFields.check_items ?? currentRecord.check_items,
            result: updateFields.result ?? currentRecord.result,
            record_time: formatCurrentTime()  // 更新时间始终使用当前时间
        };

        const sql = `
            UPDATE medical_record 
            SET advice = ?,
                cost = ?,
                cure_state = ?,
                check_items = ?,
                result = ?,
                record_time = ?
            WHERE record_id = ?
        `;

        db.query(sql, [
            updateParams.advice,
            updateParams.cost,
            updateParams.cure_state,
            updateParams.check_items,
            updateParams.result,
            updateParams.record_time,
            record_id
        ], (err, results) => {
            if (err) return res.sendRes(0, '更新失败: ' + err.message);
            if (results.affectedRows !== 1) return res.sendRes(0, '更新失败');
            return res.sendRes(1, '记录更新成功');
        });
    });
}

const getRecordsH = (req, res) => {
    const { page, size, patient_id } = req.query;
    // 参数转换优化 ↓
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const pageSize = Math.max(parseInt(size, 10) || 10, 1);
    const offset = (pageNum - 1) * pageSize;
    // 分页查询SQL（包含总数统计）
    const dataSql = `
        SELECT *
        FROM medical_record WHERE patient_id=?
        ORDER BY record_time DESC 
        LIMIT ? OFFSET ?
    `;
    // 并行查询数据和总数
    db.query(dataSql, [patient_id,pageSize, offset], (dataErr, records) => {
        if (dataErr) return res.sendRes(0, dataErr.toString());
        let recordList=records.map(item=>{
            const leftPath=path.join(__dirname,'../public/uploads',item.left_eye)
            const rightPath=path.join(__dirname,'../public/uploads',item.right_eye)
            let combinePath=null
            if(item.combined_image)
            combinePath=path.join(__dirname,'../public/uploads',item.combined_image)
            let leftBase=null
            let rightBase=null
            let combinedBase=null
                if(!fs.existsSync(leftPath)){
                    leftBase=null
                }else if(!fs.existsSync(rightPath)){
                    rightBase=null
                }
                else if(!fs.existsSync(combinePath)){
                    combinedBase=null
                }
                else{
                    leftBase=fs.readFileSync(leftPath).toString('base64')
                    rightBase=fs.readFileSync(rightPath).toString('base64')
                    combinedBase=fs.readFileSync(combinePath).toString('base64')
                }
            return {
                ...item,
                left_eye:leftBase?`data:image/png;base64,${leftBase}`:null,
                right_eye:rightBase?`data:image/png;base64,${rightBase}`:null,
                combined_image:combinedBase?`data:image/png;base64,${combinedBase}`:null
            }
            
        })
        const countSql = `SELECT COUNT(*) AS total FROM medical_record where patient_id=?`;
        db.query(countSql,[patient_id], (countErr, countResult)=>{
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
    updateRecordH,
    giveDozenResultH
}