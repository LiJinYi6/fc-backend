
const db= require('../db/index');
const {v4:uuidv4}=require('uuid')
const path=require('path')
const formatCurrentTime=require('../utils/getDate')

const fs=require('fs');

const { token } = require('morgan');
const BINCLASS={
    "N":'正常',
    "D":'糖尿病',
    "G":'青光眼',
    "C":'白内障',
    "A":'AMD',
    "H":'高血压',
    "M":'近视',
    "O":'其他疾病/异常',
}
// 在文件顶部添加依赖
const axios = require('axios');
const FormData = require('form-data');
const keys = require('@hapi/joi/lib/types/keys');
const { result } = require('@hapi/joi/lib/base');

// 新增路由处理方法
const getPredict=async (req,res,pairs)=>{
    try {
        const recordList=req.body.recordList
        const form = new FormData();
        pairs.forEach((pair, index) => {
            form.append('files', fs.createReadStream(pair.left), {
                filename: `pair${index}_left.jpg`,
                contentType: 'image/jpeg'
            });
            form.append('files', fs.createReadStream(pair.right), {
                filename: `pair${index}_right.jpg`,
                contentType: 'image/jpeg'
            });
        });
        // 发送请求
        const response = await axios.post('http://localhost:6006/predict', form, {
            headers: form.getHeaders(),
            timeout: 30000
        });     // 处理响应数据
        const getProbable=(predictions)=>{
            let maxProbable=0;
            let maxKey=null;
            for (const [key, value] of Object.entries(predictions)) {
                if (value > maxProbable) {
                    maxProbable = value;
                    maxKey = key;
                }
            }
            return  [BINCLASS[maxKey], maxProbable];
        }
        const results = response.data.map(result => ({
            filenames: result.filenames,
            predictions: Object.entries(result.predictions)
            .map(([key, value]) => [BINCLASS[key], value]),
            confidence_analysis: result.confidence_analysis,
            mostProbable:getProbable(result.predictions),
            combined_image:result.combined_image
        }));
        res.sendRes(1, '预测成功', { 
            results
        });
        if(recordList.length!==results.length)return console.log("数据不匹配")
        results.forEach((item,index)=>{
            const combine_name = `combined_${Date.now()}_${index}.png`;
            const savePath = path.join(__dirname, '../public/uploads', combine_name);
            const base64Data = item.combined_image.replace(/^data:image\/\w+;base64,/, "");
            fs.writeFileSync(savePath, base64Data, 'base64');
            //更新表
            const updateSql="UPDATE medical_record SET combined_image=?, result=? WHERE record_id=?";
            console.log("record_id",recordList[index])
            db.query(updateSql,[combine_name,item.mostProbable[0],recordList[index]],(err,result)=>{
                if(err)console.log(err.toString())
                if(result.affectedRows===0)console.log("保存失败")
                console.log("保存成功")
            })
        })
    } catch (error) {
        console.error('检测失败:', error);
        const message = error.response?.data || error.message;
        return res.sendRes(0, `检测失败: ${message}`);
    }
}
// 初始化上传
const uploadH=(req,res)=>{
    let patient_id=req.params.patient_id;
    if (!req.files?.left_eye || !req.files?.right_eye) {
        return res.sendRes(0,'必须上传左右眼图片');
    }
        else{
            const leftEyeImg=req.files.left_eye[0]
            const rightEyeImg=req.files.right_eye[0]
            //调用大模型接口，拿到诊断结果
            const left_eye = leftEyeImg.filename; 
            const right_eye = rightEyeImg.filename;
            const record_id=uuidv4()
           
            const sql = 'INSERT INTO medical_record (left_eye,right_eye,record_id,record_time,patient_id) VALUES (?,?,?,?,?)';
            db.query(sql, [left_eye,right_eye,record_id,formatCurrentTime(),patient_id],(err2,result)=>{
                if(err2){
                    return res.sendRes(0,err2.toString())
                }
                else if(result.affectedRows !== 1){
                    return res.sendRes(0,'上传失败')
                }else{
                    let leftEyePath=path.join(__dirname,'../public/uploads',left_eye)
                    let rightEyePath=path.join(__dirname,'../public/uploads',right_eye)
                    let leftEyeBase=fs.readFileSync(leftEyePath).toString('base64')
                    let rightEyeBase=fs.readFileSync(rightEyePath).toString('base64')
                    return res.sendRes(1,'上传成功',{
                        record_id:record_id,
                        left_url:`data:image/png;base64,${leftEyeBase}`,
                        right_url:`data:image/png;base64,${rightEyeBase}`
                    })
                }
        })
        }
}
const getResultH=(req,res)=>{
    const recordList=req.body.recordList;
    console.log('recordList',recordList)
    const sql='SELECT * FROM medical_record WHERE record_id IN (?)'
    db.query(sql,[recordList],(err,result)=>{
        if(err)return res.sendRes(0,err.toString())
        else if(result.length<=0)return res.sendRes(0,'识别失败，检查图片是否全部上传成功')
        const pairs=[]
        console.log('result',result)
        result.forEach(item=>{
            const leftPath=path.join(__dirname,'../public/uploads',item.left_eye)
            const rightPath=path.join(__dirname,'../public/uploads',item.right_eye)
            if(!fs.existsSync(leftPath)){
                   res.sendRes(0,'左眼图片不存在，请上传')
            }else if(!fs.existsSync(rightPath)){
                   res.sendRes(0,'右眼图片不存在，请上传')
            }else{
                pairs.push({left:leftPath,right:rightPath})
            }
        })
        console.log(
            'pairs',pairs
        )
        getPredict(req,res,pairs)
    })
}
module.exports={
    uploadH,
    getResultH,
   
}
// const uploadDuzenH = (req, res,err) => {
//     let id = req.auth.id;
//     if (req.files.length === 0) {
//         res.sendRes(0, '未上传文件');
//     } else {
//         let results = [];
//         req.files.forEach(file => {
//             const img_url = file.filename;
//             const img_id = uuidv4();
//             const sql = 'INSERT INTO chart_gallery (img_url, img_id, id) VALUES (?, ?, ?)';
//             db.query(sql, [img_url, img_id, id], (err2, result) => {
//                 if (err2) {
//                     console.log(err2);
//                     res.sendRes(0, err2.toString());
//                 } else if (result.affectedRows !== 1) {
//                     res.sendRes(0, '上传失败');
//                 } else {
//                     let img_path = path.join(__dirname, '../public/uploads', file.filename);
//                     let img_res = fs.readFileSync(img_path).toString('base64');
//                     results.push({
//                         img_id: img_id,
//                         url: `data:image/png;base64,${img_res}`
//                     });
//                     if (results.length === req.files.length) {
//                         res.sendRes(1, '上传成功', results);
//                     }
//                 }
//             });
//         });
//     }
// }


// const getImgH=(req,res)=>{
//     const sql='SELECT * FROM chart_gallery WHERE id=?'
//     db.query(sql,req.auth.id,(err,result)=>{
//         if(err){
//             res.sendRes(0,err.toString())
//         }else{
//             let imgList=result.map(item=>{
//                 let img_path=path.join(__dirname,'../public/uploads',item.img_url)
//                 let imgBase=fs.readFileSync(img_path).toString('base64')
//                 return{
//                     ...item,
//                     url:`data:image/png;base64,${imgBase}`
//                 }
//             })
//             res.sendRes(1,'查询成功',{
//                 imgList
//             })
//         }
//     })
// }

// const deleteImgH=(req,res)=>{
//     const img=req.body.img;
//     const sql='DELETE FROM chart_gallery WHERE img_id=? and id=?'
//     db.query(sql,[img.img_id,req.auth.id],(err,result)=>{
//         if(err){
//             res.sendRes(0,err.toString())
//         }else{
//             if(result.affectedRows !== 1)res.sendRes(0,'删除失败')
//                 const filePath = path.join(__dirname,'../public/uploads',img.img_url); // 假设图片文件名是img_id.jpg
//             fs.unlink(filePath, (err) => {
//                 if (err) {
//                     console.error(`Error deleting file ${img.img_url}: ${err}`);
//                 } else {
//                     console.log(`File ${img.img_url} deleted`);
//                 }
//             })
//             res.sendRes(1,'删除成功')
//         }
//     })
// }

// const deleteDuzenImgH = (req, res) => {
//     const imgList = req.body.imgList; // 假设前端发送的请求体中包含一个img_ids数组
//     const imgIds = imgList.map(item => item.img_id);
//     if (!Array.isArray(imgIds) || imgIds.length === 0) {
//         return res.sendRes(0, 'img_ids must be a non-empty array');
//     }

//     const sql = 'DELETE FROM chart_gallery WHERE img_id IN (?) and id=?';
//     db.query(sql, [imgIds, req.auth.id], (err, result) => {
//         if (err) {
//             res.sendRes(0, err.toString());
//         } else {
//             if (result.affectedRows !== imgIds.length) {
//                 res.sendRes(0, '删除失败,可能部分图片不存在');
//             } else {
//                 imgList.forEach(item => {
//                     const filePath = path.join(__dirname,'../public/uploads',item.img_url); // 假设图片文件名是img_id.jpg
//                     fs.unlink(filePath, (err) => {
//                         if (err) {
//                             console.error(`Error deleting file ${item.img_url}: ${err}`);
//                         } else {
//                             console.log(`File ${item.img_url} deleted`);
//                         }
//                     });
//                 });
//                 res.sendRes(1, '删除成功');
//             }
//         }
//     });// }
