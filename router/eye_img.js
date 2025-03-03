const express=require('express');
const router=express.Router();
const imgHandle=require('../router_handler/eye_img')
const expressJoi=require('@escook/express-joi')
const {upload}=require('../utils/uploadImg')
const {img_deleteDuzon_schema, img_delete_schema,img_upload_schema}=require('../schema/eye_img')
router.post('/uploadImg',upload.single('file'),imgHandle.uploadH)
router.post('/uploadDuzenImg',upload.array('files',12),imgHandle.uploadDuzenH)
router.get('/getImg',imgHandle.getImgH)
router.delete('/deleteImg',expressJoi(img_delete_schema),imgHandle.deleteImgH)
router.delete('/deleteDuzenImg',expressJoi(img_deleteDuzon_schema),imgHandle.deleteDuzenImgH)
// router.post('/updateImg',imgHandle.updateImgH)
module.exports=router