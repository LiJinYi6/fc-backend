const joi= require('joi');
const fillRecordSchema=joi.object({
    record_id:joi.string().required()

})
const pageSchema=joi.object({
    size:joi.number(),
    page:joi.number(),
    patient_id:joi.string().required()
})
const updateRecordSchema=joi.object({
    record_id:joi.string().required(),
    result:joi.string(),
    cure_state:joi.string(),
    advice:joi.string(),
    cost:joi.string(),
    check_items:joi.string(),
})
module.exports={
    fillRecordSchema,
    pageSchema
}