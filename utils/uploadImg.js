const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

// 设置存储引擎
// 创建一个multer存储引擎
const storage = multer.diskStorage({
  // 设置文件存储路径
  destination: './public/uploads/',
  // 设置文件名
  filename: function(req, file, cb){
    // 使用当前时间戳作为文件名
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// 初始化上传
// 使用multer中间件，设置存储方式为storage，文件大小限制为1000000字节，文件过滤器为checkFileType，只接受一个名为file的文件
exports.upload = multer({
  storage: storage,
  limits:{fileSize: 1024*1024*5,files:5},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
});

// 检查文件类型
function checkFileType(file, cb){
  // 允许的文件扩展名
  const filetypes = /jpeg|jpg|png|gif/;
  // 获取文件扩展名
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // 获取文件MIME类型
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}


