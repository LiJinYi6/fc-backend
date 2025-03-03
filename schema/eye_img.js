const joi=require('joi')

const img_url=joi.string().required()
const img_id=joi.string().required()

const img=joi.object({
    img_url,
    img_id
})

exports.img_delete_schema={
    body:{
        img
    }
}

exports.img_deleteDuzon_schema={
    body:{
        imgList:joi.array().items(img).required()
    }
}

