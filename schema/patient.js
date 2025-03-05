const joi= require('joi');

exports. patientSchema = joi.object({
    patient_name:joi.string().required(),
    patient_age:joi.number().required(),
    patient_address:joi.string().required(),
    patient_sex:joi.number().required(),
})