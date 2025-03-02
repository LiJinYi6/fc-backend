const express=require('express')
//跨域
const cors=require('cors')
const app=express()
//表单校验
const joi=require('joi')
const fs = require('fs');
//静态资源
app.use(express.static('./public'))


//日志文件
const morgan = require('morgan');
const path = require('path');
//swagger
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');
//解码
const jwt = require('jsonwebtoken');
//数据库
const db=require('./db/index')

// 创建一个写入日志文件的流
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// 使用morgan中间件，将日志信息写入文件
app.use(morgan('combined', { stream: accessLogStream }));

//配置api文档
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//配置跨域
app.use(cors())
//全局中间件
//用于解析格式为application/x-www-form-urlencoded数据
app.use(express.urlencoded({extended:false}))

//解析JSON格式数据
app.use(express.json())

  

//JWT令牌认证
const expressJwt=require('express-jwt')
//定义一个解析token的中间件
const config=require('./config')
app.use(
    expressJwt.expressjwt
    ({secret:config.jwtSecretKey,algorithms:['HS256']})
    .unless({path:['/user/login']})
)

//权限验证
exports.checkRole = (role) => {
    return (req, res, next) => {
        const token=req.headers.authorization
        jwt.verify(token.replace('Bearer ',''),config.jwtSecretKey,(err,decode)=>{
            if(err) return res.sendRes(0,err.toString())
            let id=decode.id
            console.log(id)
            db.query('select type from user_info where id=?',id,(err2,results)=>{
                if(err2) return res.sendRes(0,err2.toString())
                if(results[0].type!==role) return res.sendRes(0,'身份认证失败')
            })
        })
      next();
    };
};






//对于send的封装中间件
app.use((req,res,next)=>{
    res.sendRes=(ok, message, data) => {
        res.send({
          ok,
          data,
          message
        });
      };
    next()
})

//导入注册路由模块
const userRouter=require('./router/user')
const eye_imgRouter=require('./router/eye_img')
app.use('/user',userRouter)
app.use('/eyeImg',eye_imgRouter)

//定义错误级别的中间件
app.use((err,req,res,next)=>{
    //表单校验错误
    if(err instanceof joi.ValidationError){
        return res.sendRes(0,err)
    }
    if (err.status === 500) {
        return res.status(500).json({ error: '服务器内部错误' });
    }
    // 404 - 资源未找到
    if (err.status === 404) {
        return res.status(404).json({ error: '资源未找到' });
    }
    // 400 - 错误的请求
    if (err.status === 400) {
        return res.status(400).json({ error: '错误的请求' });
    }
    // 401 - 未授权
    if (err.status === 401) {
        return res.status(401).json({ error: '未授权' });
    }
    // 403 - 禁止访问
    if (err.status === 403) {
        return res.status(403).json({ error: '禁止访问' });
    }
    // 其他错误
    return res.status(500).json({ error: '未知错误' });
})
app.listen(80,()=>{
    console.log('sever running at http://127.0.0.1:80')
})