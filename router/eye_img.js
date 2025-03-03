const express=require('express');
const router=express.Router();
const imgHandle=require('../router_handler/eye_img')
const expressJoi=require('@escook/express-joi')
const {upload}=require('../utils/uploadImg')
const {img_deleteDuzon_schema, img_delete_schema,img_upload_schema}=require('../schema/eye_img')

/**
 * @swagger
 * /uploadImg:
 *   post:
 *     summary: 上传图片
 *     description: 上传单个图片
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         description: 要上传的图片
 *         required: true
 *         type: file
 *     responses:
 *       200:
 *         description: 上传成功
 *       500:
 *         description: 上传失败
 */
router.post('/uploadImg', upload.single('file'), imgHandle.uploadH);

/**
 * @swagger
 * /uploadDuzenImg:
 *   post:
 *     summary: 批量上传图片
 *     description: 批量上传多个图片
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: files
 *         description: 要上传的图片
 *         required: true
 *         type: array
 *         items:
 *           type: file
 *     responses:
 *       200:
 *         description: 上传成功
 *       500:
 *         description: 上传失败
 */
router.post('/uploadDuzenImg', upload.array('files', 12), imgHandle.uploadDuzenH);

/**
 * @swagger
 * /getImg:
 *   get:
 *     summary: 获取图片
 *     description: 获取所有图片
 *     responses:
 *       200:
 *         description: 图片列表
 *       500:
 *         description: 获取失败
 */
router.get('/getImg', imgHandle.getImgH);

/**
 * @swagger
 * /api/deleteImg:
 *   delete:
 *     summary: 删除图片
 *     description: 删除指定图片
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               img:
 *                 type: object
 *                 properties:
 *                   img_url:
 *                     type: string
 *                     description: 图片URL
 *                     example: 'http://example.com/image.jpg'
 *                   img_id:
 *                     type: string
 *                     description: 图片ID
 *                     example: '1234567890'
 *     responses:
 *       200:
 *         description: 删除成功
 *       500:
 *         description: 删除失败
 */
router.delete('/deleteImg', expressJoi(img_delete_schema), imgHandle.deleteImgH);

/**
 * @swagger
 * /api/deleteDuzenImg:
 *   delete:
 *     summary: 批量删除图片
 *     description: 批量删除指定图片
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imgList:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     img_url:
 *                       type: string
 *                       description: 图片URL
 *                       example: 'http://example.com/image.jpg'
 *                     img_id:
 *                       type: string
 *                       description: 图片ID
 *                       example: '1234567890'
 *     responses:
 *       200:
 *         description: 删除成功
 *       500:
 *         description: 删除失败
 */
router.delete('/deleteDuzenImg', expressJoi(img_deleteDuzon_schema), imgHandle.deleteDuzenImgH);


// router.post('/updateImg',imgHandle.updateImgH)
module.exports=router