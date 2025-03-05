const express=require('express');
const router=express.Router();
const expressjoi=require('@escook/express-joi');
const { patientSchema }=require('../schema/patient');
const { addPatientH }=require('../router_handler/patient') 
router.post('/addPatient',expressjoi(patientSchema),addPatientH);
// router.delete('/deletePatient/:patient_id',deletePatientH);
// router.post('/updatePatient',updatePatientH);



module.exports=router;