const { checkRole } = require('../app');
const { login_schema } = require('../schema/user');
const express = require('express');
const router = express.Router();
const expressjoi = require('@escook/express-joi');
const manageHandler = require('../router_handler/manage');
/**
 * @swagger
 * /manage/createUser:
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
router.post('/createUser', expressjoi(login_schema), checkRole(1), manageHandler.createUser);


module.exports = router;