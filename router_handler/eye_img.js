
const db= require('../db/index');
const {v4:uuidv4}=require('uuid')
const {upload}=require('../utils/uploadImg')
const path=require('path')
const fs=require('fs');
const { get } = require('http');
// 初始化上传
const uploadH=(req,res)=>{
    let id=req.query.id;
    upload(req,res,(err)=>{
        
        if(err){
            res.sendRes(0,err.toString())
        }else{
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
                            id:img_id,
                            url:`data:image/png;base64,${img_res}`
                        })
                    }
            })
            }
        }
    })
}

const getImgH=(req,res)=>{
    let id=req.query.id;
    const sql='SELECT * FROM chart_gallery WHERE id=?'
    db.query(sql,id,(err,result)=>{
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


module.exports={
    uploadH,
    getImgH
}