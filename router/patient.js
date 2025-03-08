const express=require('express');
const router=express.Router();
const expressjoi=require('@escook/express-joi');
const { patientSchema,pageSchema, updatePatientSchema }=require('../schema/patient');
const { addPatientH,deletePatientH,getPatientH,updatePatientH }=require('../router_handler/patient') 
router.post('/addPatient',expressjoi(patientSchema),addPatientH);
router.delete('/deletePatient/:patient_id',deletePatientH);
router.get('/getPatient',expressjoi(pageSchema),getPatientH);
router.post('/updatePatient',expressjoi(updatePatientSchema),updatePatientH);



module.exports=router;