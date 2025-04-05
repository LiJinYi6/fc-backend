const express=require('express')
const router=express.Router()
const {fillRecordSchema,pageSchema,giveDozenResultSchema} =require('../schema/medical_record')
const expressjoi=require('@escook/express-joi')
const recordHandler=require('../router_handler/medical_record')
const { upload } = require('../utils/uploadImg')
const expressJoi = require('@escook/express-joi')

router.post('/fillRecord',expressjoi(fillRecordSchema),recordHandler.fillRecordH)
router.get('/getRecords',expressjoi(pageSchema),recordHandler.getRecordsH)
router.delete('/deleteRecord/:record_id',recordHandler.deleteRecordH)
router.post('/updateRecord',express.json(),upload.fields([{name: 'left_eye'}, {name: 'right_eye'}]),
recordHandler.updateRecordH)
router.post('/giveDozenResult',expressJoi(giveDozenResultSchema),recordHandler.giveDozenResultH)

module.exports=router