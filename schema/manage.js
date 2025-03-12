const joi= require('joi');
const getDoctor_schema=joi.object({
    page:joi.number(),
    size:joi.number(),
    name:joi.string(),
})
const updateDoctor_schema=joi.object({
    id:joi.string().required(),
    name:joi.string(),
    sex:joi.string(),
    phone:joi.string(),
    address:joi.string(),
    email:joi.string().email(),
    type:joi.number(),
})

module.exports={
    getDoctor_schema,
    updateDoctor_schema
}