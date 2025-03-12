const {getToken,createAssistant}=require('../utils/glm');
const aiAdviceH=async(req,res)=>{
    let tokenRes=await getToken()
    createAssistant({
        prompt:req.body.prompt
    },tokenRes.result.access_token,res)
}
module.exports={
    aiAdviceH
}