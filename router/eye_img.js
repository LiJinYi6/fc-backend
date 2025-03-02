const express=require('express');
const router=express.Router();
const imgHandle=require('../router_handler/eye_img')
router.post('/uploadImg',imgHandle.uploadH)
router.get('/getImg',imgHandle.getImgH)
module.exports=router