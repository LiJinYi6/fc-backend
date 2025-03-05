const express = require('express');
const userHandler = require('../router_handler/user');
const { update_user_schema, update_pwd_schema } = require('../schema/user');
const router = express.Router();
const expressjoi = require('@escook/express-joi');
const { login_schema } = require('../schema/user');
const { checkRole } = require('../app');

/**
 * @swagger
 * /user/createUser:
 *   post:
 *     summary: 创建一个医生
 *     tags:
 *       - 用户管理
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 format: alphanumeric
 *                 minLength: 2
 *                 maxLength: 10
 *                 example: "doctor123"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               phone:
 *                 type: string

 *                 example: "13812345678"
 *     responses:
 *       '200':
 *         description: 成功创建医生
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.post('/createUser', expressjoi(login_schema), checkRole(1), userHandler.createUser);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: 登录
 *     tags:
 *       - 用户管理
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 format: alphanumeric
 *                 minLength: 2
 *                 maxLength: 10
 *                 example: "doctor123"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       '200':
 *         description: 登录成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserInfo'
 */
router.post('/login', expressjoi(login_schema), userHandler.login);

/**
 * @swagger
 * /user/getUserinfo:
 *   get:
 *     summary: 获取用户信息
 *     tags:
 *       - 用户管理
 *     responses:
 *       '200':
 *         description: 成功获取用户信息
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserInfo'
 */
router.get('/getUserinfo', userHandler.getUserInfo);

/**
 * @swagger
 * /user/updateUser:
 *   post:
 *     summary: 更新用户信息
 *     tags:
 *       - 用户管理
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               phone:
 *                 type: string
 *                 example: "13812345678"
 *               sex:
 *                 type: string
 *                 enum: [0, 1]
 *                 example: 1
 *               address:
 *                 type: string
 *                 example: "123 Main St"
 *     responses:
 *       '200':
 *         description: 成功更新用户信息
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.post('/updateUser', expressjoi(update_user_schema), userHandler.updateUser);

/**
 * @swagger
 * /user/updatePwd:
 *   post:
 *     summary: 更新密码
 *     tags:
 *       - 用户管理
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPwd:
 *                 type: string
 *                 example: "password123"
 *               newPwd:
 *                 type: string
 *                 example: "newpassword123"
 *     responses:
 *       '200':
 *         description: 成功更新密码
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.post('/updatePwd', expressjoi(update_pwd_schema), userHandler.updatePwd);

// router.post('/updateAvatar', expressjoi(update_avatar_schema), userHandler.updateAvatar);

module.exports = router;
