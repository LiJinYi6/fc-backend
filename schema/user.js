const joi=require('joi')


//用户表单验证规则
//字符，数字都要有（最少2位，最大10位）
const username=joi
.string()
.alphanum()
.min(2).max(10).required()

const password=joi
.string()
.pattern(/^\S{6,12}$/)
.required()

const name=joi.string()
const email=joi.string().email()
const phone=joi.string().pattern(/^1[3-9]\d{9}$/)
const sex=joi.string().valid(0,1)
const address=joi.string()

//定义验证对象
exports.login_schema={
    body:{
        username,
        password,
        name,
        email,
        phone,

    }
}
//更新用户信息表单验证
exports.update_user_schema={
    body:{
        
        name,
        email,
        phone,
        sex,
        address,
    }
}
//更新密码表单验证
exports.update_pwd_schema={
    body:{
        oldPwd:password,
        newPwd:joi.not(joi.ref('oldPwd')).concat(password)
    }
}
