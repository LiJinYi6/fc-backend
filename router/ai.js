const express=require('express')
const router=express.Router()
const aiHandle=require('../router_handler/ai')
router.post('/aiAdvice',aiHandle.aiAdviceH)
module.exports=router