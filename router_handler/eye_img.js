
const db= require('../db/index');
const {v4:uuidv4}=require('uuid')
const {upload}=require('../utils/uploadImg')
const path=require('path')
const fs=require('fs');
const { get } = require('http');
// 初始化上传
const uploadH=(req,res)=>{
    let id=req.auth.id;
        if(req.file==undefined){
            res.sendRes(0,'未上传文件')
        }
        else{
            const img_url = req.file.filename; 
            const img_id=uuidv4()
            const sql = 'INSERT INTO chart_gallery (img_url,img_id,id) VALUES (?,?,?)';
            db.query(sql, [img_url,img_id,id],(err2,result)=>{
                if(err2){
                    console.log(err2)
                    res.sendRes(0,err2.toString())
                }
                else if(result.affectedRows !== 1){
                    res.sendRes(0,'上传失败')
                }else{
                    
                    let img_path=path.join(__dirname,'../public/uploads',req.file.filename)
                    let img_res=fs.readFileSync(img_path).toString('base64')
                    res.sendRes(1,'上传成功',{
                        img_id:img_id,
                        url:`data:image/png;base64,${img_res}`
                    })
                }
        })
        }
}

const uploadDuzenH = (req, res,err) => {
    let id = req.auth.id;
    if (req.files.length === 0) {
        res.sendRes(0, '未上传文件');
    } else {
        let results = [];
        req.files.forEach(file => {
            const img_url = file.filename;
            const img_id = uuidv4();
            const sql = 'INSERT INTO chart_gallery (img_url, img_id, id) VALUES (?, ?, ?)';
            db.query(sql, [img_url, img_id, id], (err2, result) => {
                if (err2) {
                    console.log(err2);
                    res.sendRes(0, err2.toString());
                } else if (result.affectedRows !== 1) {
                    res.sendRes(0, '上传失败');
                } else {
                    let img_path = path.join(__dirname, '../public/uploads', file.filename);
                    let img_res = fs.readFileSync(img_path).toString('base64');
                    results.push({
                        img_id: img_id,
                        url: `data:image/png;base64,${img_res}`
                    });
                    if (results.length === req.files.length) {
                        res.sendRes(1, '上传成功', results);
                    }
                }
            });
        });
    }
}


const getImgH=(req,res)=>{
    const sql='SELECT * FROM chart_gallery WHERE id=?'
    db.query(sql,req.auth.id,(err,result)=>{
        if(err){
            res.sendRes(0,err.toString())
        }else{
            let imgList=result.map(item=>{
                let img_path=path.join(__dirname,'../public/uploads',item.img_url)
                let imgBase=fs.readFileSync(img_path).toString('base64')
                return{
                    ...item,
                    url:`data:image/png;base64,${imgBase}`
                }
            })
            res.sendRes(1,'查询成功',{
                imgList
            })
        }
    })
}

const deleteImgH=(req,res)=>{
    const img=req.body.img;
    const sql='DELETE FROM chart_gallery WHERE img_id=? and id=?'
    db.query(sql,[img.img_id,req.auth.id],(err,result)=>{
        if(err){
            res.sendRes(0,err.toString())
        }else{
            if(result.affectedRows !== 1)res.sendRes(0,'删除失败')
                const filePath = path.join(__dirname,'../public/uploads',img.img_url); // 假设图片文件名是img_id.jpg
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Error deleting file ${img.img_url}: ${err}`);
                } else {
                    console.log(`File ${img.img_url} deleted`);
                }
            })
            res.sendRes(1,'删除成功')
        }
    })
}

const deleteDuzenImgH = (req, res) => {
    const imgList = req.body.imgList; // 假设前端发送的请求体中包含一个img_ids数组
    const imgIds = imgList.map(item => item.img_id);
    if (!Array.isArray(imgIds) || imgIds.length === 0) {
        return res.sendRes(0, 'img_ids must be a non-empty array');
    }

    const sql = 'DELETE FROM chart_gallery WHERE img_id IN (?) and id=?';
    db.query(sql, [imgIds, req.auth.id], (err, result) => {
        if (err) {
            res.sendRes(0, err.toString());
        } else {
            if (result.affectedRows !== imgIds.length) {
                res.sendRes(0, '删除失败,可能部分图片不存在');
            } else {
                imgList.forEach(item => {
                    const filePath = path.join(__dirname,'../public/uploads',item.img_url); // 假设图片文件名是img_id.jpg
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.error(`Error deleting file ${item.img_url}: ${err}`);
                        } else {
                            console.log(`File ${item.img_url} deleted`);
                        }
                    });
                });
                res.sendRes(1, '删除成功');
            }
        }
    });
}




module.exports={
    uploadH,
    getImgH,
    deleteImgH,
    deleteDuzenImgH ,
    uploadDuzenH 
}