//用户路由对象
const express=require('express')
const expressJoi=require('@escook/express-joi')
const userHandler=require('../router_handler/user')
const {update_user_schema, update_pwd_schema, update_avatar_schema}=require('../schema/user')
//创建路由对象
const router=express.Router()
//表单校验
const expressjoi=require('@escook/express-joi')
//表单校验规则
const {login_schema}=require('../schema/user')
//权限验证
const {checkRole}=require('../app')

//创建一个医生
router.post('/createUser',expressjoi(login_schema),checkRole(1),userHandler.createUser)
//登陆
router.post('/login',expressjoi(login_schema),userHandler.login)
router.get('/getUserinfo',userHandler.getUserInfo)
//表单校验中间件（expressJoi）
router.post('/updateUser',expressJoi(update_user_schema),userHandler.updateUser)
router.post('/updatePwd',expressJoi(update_pwd_schema),userHandler.updatePwd)
// router.post('/updateAvatar',expressJoi(update_avatar_schema),userHandler.updateAvatar)

module.exports=router