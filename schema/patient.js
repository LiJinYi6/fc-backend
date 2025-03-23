const joi= require('joi');

exports. patientSchema = joi.object({
    patient_name:joi.string().required(),
    patient_age:joi.number().required(),
    patient_address:joi.string().required(),
    patient_sex:joi.number().required(),
    patient_phone:joi.string()
})
exports.updatePatientSchema=joi.object({
    patient_name:joi.string(),
    patient_age:joi.number(),
    patient_address:joi.string(),
    patient_sex:joi.number(),
    patient_phone:joi.string(),
    patient_id:joi.string().required(),
    cure_advice:joi.string(),
})

exports.pageSchema=joi.object({
    page:joi.number(),
    size:joi.number(),
    name:joi.string()
})