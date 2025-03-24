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


//解码
const jwt = require('jsonwebtoken');
//数据库
const db=require('./db/index')

// 创建一个写入日志文件的流
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// 使用morgan中间件，将日志信息写入文件
app.use(morgan('combined', { stream: accessLogStream }));


//配置跨域
app.use(cors())
//全局中间件
//用于解析格式为application/x-www-form-urlencoded数据
app.use(express.urlencoded({extended:false}))

//解析JSON格式数据
app.use(express.json())

  
app.use((req, res, next) => {
  req.body = req.body || {};  // 初始化空对象
  next();
});

//权限验证
exports.checkRole = (role) => {
    return (req, res, next) => {
        const token=req.headers.authorization
        jwt.verify(token.replace('Bearer ',''),config.jwtSecretKey,(err,decode)=>{
            if(err) return res.sendRes(0,err.toString())
            let id=decode.id
            db.query('select type from user_info where id=?',id,(err2,results)=>{
                if(err2) return res.sendRes(0,err2.toString())
                if(results[0].type!==role) return res.sendRes(0,'身份认证失败')
                next();
            })
        })
    };
};

//JWT令牌认证
const expressJwt=require('express-jwt')
//定义一个解析token的中间件
const config=require('./config')
app.use(
    expressJwt.expressjwt
    ({secret:config.jwtSecretKey,algorithms:['HS256']})
    .unless({path:['/user/login']})
)

//对于send的封装中间件
app.use((req,res,next)=>{
  const token=req.headers.authorization
  res.sendRes=(ok, message, data) => {
    res.send({
      ok,
      data,
      message
    });
  };
  if(req.originalUrl!='/user/login')
  {
    if(token){
      jwt.verify(token.replace('Bearer ',''),config.jwtSecretKey,(err,decode)=>{
          if(err) return res.sendRes(0,err.toString())
          req.auth=decode
      })}
  }
  next()
})



//导入注册路由模块
const userRouter=require('./router/user')
const eye_imgRouter=require('./router/eye')
const patientRouter=require('./router/patient')
const manageRouter=require('./router/manage')
const recordRouter=require('./router/medical_record')
const aiRouter=require('./router/ai')
const echartsRouter=require('./router/echarts')
app.use('/record',recordRouter)
app.use('/user',userRouter)
app.use('/manage',manageRouter)
app.use('/eye',eye_imgRouter)
app.use('/patient',patientRouter)
app.use('/ai',aiRouter)
app.use('/echarts',echartsRouter)

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
    return res.status(500).json({ error: err.toString()+'未知错误' });
})
app.listen(80,()=>{
    console.log('sever running at http://127.0.0.1:80')
})