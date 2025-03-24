const express = require('express');
const router = express.Router();
const expressjoi = require('@escook/express-joi');
const handleEcharts=require('../router_handler/echarts')

router.get('/getPieData',handleEcharts.handleGetPieDate)
router.get('/getBarData',handleEcharts.handleGetBarData)
router.get('/getPlotData',handleEcharts.handleGetPlotData)
router.get('/getRegionData',handleEcharts.handleGetRegionData)
module.exports=router