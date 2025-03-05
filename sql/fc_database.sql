/*
 Navicat Premium Data Transfer

 Source Server         : LJY
 Source Server Type    : MySQL
 Source Server Version : 80037
 Source Host           : localhost:3306
 Source Schema         : fc_database

 Target Server Type    : MySQL
 Target Server Version : 80037
 File Encoding         : 65001

 Date: 03/03/2025 21:29:58
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for chart_gallery
-- ----------------------------
DROP TABLE IF EXISTS `chart_gallery`;
CREATE TABLE `chart_gallery`  (
  `img_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `patient_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `img_url` varchar(5000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`img_id`) USING BTREE,
  INDEX `FK_Relationship_3`(`patient_id`) USING BTREE,
  INDEX `FK_Relationship_4`(`id`) USING BTREE,
  CONSTRAINT `FK_Relationship_3` FOREIGN KEY (`patient_id`) REFERENCES `patient_user` (`patient_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_Relationship_4` FOREIGN KEY (`id`) REFERENCES `user_info` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of chart_gallery
-- ----------------------------
INSERT INTO `chart_gallery` VALUES ('2001', '1001', '1', 'http://example.com/img1.jpg');
INSERT INTO `chart_gallery` VALUES ('2002', '1002', '2', 'http://example.com/img2.jpg');
INSERT INTO `chart_gallery` VALUES ('2003', '1003', '3', 'http://example.com/img3.jpg');
INSERT INTO `chart_gallery` VALUES ('2004', '1004', '4', 'http://example.com/img4.jpg');
INSERT INTO `chart_gallery` VALUES ('2005', '1005', '5', 'http://example.com/img5.jpg');
INSERT INTO `chart_gallery` VALUES ('2006', '1006', '6', 'http://example.com/img6.jpg');
INSERT INTO `chart_gallery` VALUES ('2007', '1007', '7', 'http://example.com/img7.jpg');
INSERT INTO `chart_gallery` VALUES ('2008', '1008', '8', 'http://example.com/img8.jpg');
INSERT INTO `chart_gallery` VALUES ('2009', '1009', '9', 'http://example.com/img9.jpg');
INSERT INTO `chart_gallery` VALUES ('2010', '1010', '10', 'http://example.com/img10.jpg');
INSERT INTO `chart_gallery` VALUES ('4b2a3f17-cfd1-4437-b0fe-053819b6c4b5', NULL, 'dd', 'files-1741004787584.jpg');
INSERT INTO `chart_gallery` VALUES ('6261b3da-7a0b-41d4-a9f7-36d6d1e6e0cf', NULL, 'dd', 'file-1741004617274.jpg');
INSERT INTO `chart_gallery` VALUES ('e61be800-8c00-46d4-95fe-cbbe394a91d4', NULL, 'dd', 'files-1741004787584.jpg');

-- ----------------------------
-- Table structure for patient_user
-- ----------------------------
DROP TABLE IF EXISTS `patient_user`;
CREATE TABLE `patient_user`  (
  `patient_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `patient_name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `patient_phone` char(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `patient_address` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `patient_sex` smallint(0) NOT NULL,
  `patient_age` smallint(0) NOT NULL,
  `curestate` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `result` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `cureadvice` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `cost` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`patient_id`) USING BTREE,
  INDEX `FK_Relationship_2`(`id`) USING BTREE,
  CONSTRAINT `FK_Relationship_2` FOREIGN KEY (`id`) REFERENCES `user_info` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of patient_user
-- ----------------------------
INSERT INTO `patient_user` VALUES ('1001', '1', '张三', '13800138000', '北京市', 1, 30, '治疗中', '良好', '建议继续治疗', '1000元');
INSERT INTO `patient_user` VALUES ('1002', '2', '李四', '13900139000', '上海市', 0, 25, '治疗中', '良好', '建议继续治疗', '2000元');
INSERT INTO `patient_user` VALUES ('1003', '3', '王五', '13700137000', '广州市', 1, 35, '治疗中', '良好', '建议继续治疗', '3000元');
INSERT INTO `patient_user` VALUES ('1004', '4', '赵六', '13600136000', '深圳市', 0, 28, '治疗中', '良好', '建议继续治疗', '4000元');
INSERT INTO `patient_user` VALUES ('1005', '5', '钱七', '13500135000', '成都市', 1, 32, '治疗中', '良好', '建议继续治疗', '5000元');
INSERT INTO `patient_user` VALUES ('1006', '6', '孙八', '13400134000', '杭州市', 0, 27, '治疗中', '良好', '建议继续治疗', '6000元');
INSERT INTO `patient_user` VALUES ('1007', '7', '周九', '13300133000', '武汉市', 1, 31, '治疗中', '良好', '建议继续治疗', '7000元');
INSERT INTO `patient_user` VALUES ('1008', '8', '吴十', '13200132000', '南京市', 0, 26, '治疗中', '良好', '建议继续治疗', '8000元');
INSERT INTO `patient_user` VALUES ('1009', '9', '郑十一', '13100131000', '天津市', 1, 29, '治疗中', '良好', '建议继续治疗', '9000元');
INSERT INTO `patient_user` VALUES ('1010', '10', '王十二', '13000130000', '重庆市', 0, 33, '治疗中', '良好', '建议继续治疗', '10000元');

-- ----------------------------
-- Table structure for user_info
-- ----------------------------
DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info`  (
  `name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `username` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` smallint(0) UNSIGNED NULL DEFAULT 0,
  `phone` char(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `address` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sex` smallint(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_info
-- ----------------------------
INSERT INTO `user_info` VALUES ('张三', 'zhangsan', '123456', '1', 0, '13800138000', 'zhangsan@example.com', '北京市', 1);
INSERT INTO `user_info` VALUES ('王十二', 'wangshier', '123456', '10', 0, '13000130000', 'wangshier@example.com', '重庆市', 0);
INSERT INTO `user_info` VALUES ('李四', 'lisi', '123456', '2', 0, '13900139000', 'lisi@example.com', '上海市', 0);
INSERT INTO `user_info` VALUES ('王五', 'wangwu', '123456', '3', 0, '13700137000', 'wangwu@example.com', '广州市', 1);
INSERT INTO `user_info` VALUES ('赵六', 'zhaoliu', '123456', '4', 0, '13600136000', 'zhaoliu@example.com', '深圳市', 0);
INSERT INTO `user_info` VALUES ('test', 'test', '$2a$10$mekV/2K7Z1QflfF3..pYaOBSjzMz9KTJ9m/Hvyf54vS9ejY7O621S', '47b114f7-437f-4a44-89fa-a0f3b1a6f569', 0, NULL, NULL, NULL, NULL);
INSERT INTO `user_info` VALUES ('钱七', 'qianqi', '123456', '5', 0, '13500135000', 'qianqi@example.com', '成都市', 1);
INSERT INTO `user_info` VALUES ('孙八', 'sunba', '123456', '6', 0, '13400134000', 'sunba@example.com', '杭州市', 0);
INSERT INTO `user_info` VALUES ('tes3', 'test8', '$2a$10$qsWkEzdiU4.GiFiAWJunPeRKN.ymAte9jp6OUQvBssJZgULmbceti', '6c7925e6-5d9a-4acf-9739-806f4d91e55e', 0, NULL, NULL, NULL, NULL);
INSERT INTO `user_info` VALUES ('周九', 'zhoujiu', '123456', '7', 0, '13300133000', 'zhoujiu@example.com', '武汉市', 1);
INSERT INTO `user_info` VALUES ('ljy', 'ljy', '$2a$10$oN7.2nr5kA7AYelX6KvBqenOE/bogaJSUDSR/qUZu76kjkRf295D.', '75fc09b4-92d6-4c2c-a017-919d7f41381a', 0, NULL, NULL, NULL, NULL);
INSERT INTO `user_info` VALUES ('吴十', 'wushi', '123456', '8', 2, '13200132000', 'wushi@example.com', '南京市', 0);
INSERT INTO `user_info` VALUES ('郑十一', 'zhengshiyi', '123456', '9', 0, '13100131000', 'zhengshiyi@example.com', '天津市', 1);
INSERT INTO `user_info` VALUES ('doctor1', 'doctor1', '$2a$10$O63.PyNY3Ie3dzLFfHtXoeaJRAluFvGqLqfDIt74Cg6AQ.giFSvMi', '9daae5b5-693d-4e79-9e9c-c6288bcde115', 0, NULL, NULL, NULL, NULL);
INSERT INTO `user_info` VALUES ('tes3', 'test3', '$2a$10$nAj0ZzuRDXjJy./iSB6hquzzQJBpgW/t7OYvkc9GWY.KtWpX6RIIm', '9ec1065b-92c2-4838-9d8d-bdc6ab09566e', 0, NULL, NULL, NULL, NULL);
INSERT INTO `user_info` VALUES ('tes3', 'test5', '$2a$10$Ce5GQbqeOQwCWhgmprs1feeYoZ.n8oWRiLZ3gq5g7fY6QMz6ZkFNG', 'bdf75edc-0413-4375-8d1b-17585003d45a', 0, NULL, NULL, NULL, NULL);
INSERT INTO `user_info` VALUES ('李', 'admin', '$2a$10$Nsml2quk8LjpfBf3Y2D1PuBOT1Pv.MgVGDZFPwlpBc/5xJqya4vTW', 'dd', 1, '13874670511', '343400@qq.com', '长沙市', 0);
INSERT INTO `user_info` VALUES ('tes2', 'test2', '$2a$10$H3NuNaK6B.0yEo/tFbPkquM6yAB1PzPQyZ8htLKPmLnVGgwM3K3b2', 'e657809e-c998-4dd1-a532-f1c8fc87aa4d', 0, NULL, NULL, NULL, NULL);

SET FOREIGN_KEY_CHECKS = 1;
