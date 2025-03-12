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

 Date: 08/03/2025 22:20:25
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for medical_record
-- ----------------------------
DROP TABLE IF EXISTS `medical_record`;
CREATE TABLE `medical_record`  (
  `result` varchar(5000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `advice` varchar(5000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `cost` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `record_time` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `cure_state` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `record_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `patient_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `check_items` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `left_eye` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `right_eye` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`record_id`) USING BTREE,
  INDEX `FK_Relationship_7`(`patient_id`) USING BTREE,
  CONSTRAINT `FK_Relationship_7` FOREIGN KEY (`patient_id`) REFERENCES `patient_user` (`patient_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of medical_record
-- ----------------------------
INSERT INTO `medical_record` VALUES (NULL, '这是一个修改测试', NULL, NULL, NULL, '98f22518-6aa3-4768-b34b-3e353bfac78e', '7ff8d35c-b9e1-486f-b748-48721bbc1d6d', NULL, 'left_eye-1741438712930.jpg', 'right_eye-1741438743989.jpg');
INSERT INTO `medical_record` VALUES ('轻度近视', '建议配镜', '200', '2023-03-01 09:00', '已完成', 'MR202303001', 'P001', '视力检查', '1.0', '0.8');
INSERT INTO `medical_record` VALUES ('健康', '定期复查', '150', '2023-03-02 10:30', '已完成', 'MR202303002', 'P002', '眼底检查', '正常', '正常');
INSERT INTO `medical_record` VALUES ('高度近视', '激光手术建议', '500', '2023-03-03 14:00', '进行中', 'MR202303003', 'P003', '验光检查', '2.5', '2.0');
INSERT INTO `medical_record` VALUES ('早期症状', '药物治疗', '300', '2023-03-04 15:30', '进行中', 'MR202303004', 'P004', '青光眼筛查', '0.6', '0.5');
INSERT INTO `medical_record` VALUES ('角膜炎', '抗生素治疗', '250', '2023-03-05 16:45', '已完成', 'MR202303005', 'P005', '角膜检查', '正常', '发炎');

-- ----------------------------
-- Table structure for patient_user
-- ----------------------------
DROP TABLE IF EXISTS `patient_user`;
CREATE TABLE `patient_user`  (
  `patient_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `patient_name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `patient_phone` char(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `patient_address` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `patient_sex` smallint(0) NULL DEFAULT NULL,
  `patient_age` decimal(8, 0) NULL DEFAULT NULL,
  PRIMARY KEY (`patient_id`) USING BTREE,
  INDEX `FK_Relationship_8`(`id`) USING BTREE,
  CONSTRAINT `FK_Relationship_8` FOREIGN KEY (`id`) REFERENCES `user_info` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of patient_user
-- ----------------------------
INSERT INTO `patient_user` VALUES ('7ff8d35c-b9e1-486f-b748-48721bbc1d6d', '16aa2000-fed4-4144-9bad-d9f59e1caee4', '成', '12345678901', '长沙', 1, 12);
INSERT INTO `patient_user` VALUES ('P001', 'U004', '陈芳', '13566778899', '深圳福田', 0, 28);
INSERT INTO `patient_user` VALUES ('P002', 'U005', '赵敏', '13455667788', '杭州西湖', 0, 35);
INSERT INTO `patient_user` VALUES ('P003', 'U001', '刘波', '13344556677', '南京鼓楼', 1, 42);
INSERT INTO `patient_user` VALUES ('P004', 'U002', '孙丽', '13233445566', '成都锦江', 0, 50);
INSERT INTO `patient_user` VALUES ('P005', 'U003', '吴勇', '13122334455', '武汉武昌', 1, 38);

-- ----------------------------
-- Table structure for user_info
-- ----------------------------
DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info`  (
  `name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `username` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `password` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` smallint(0) NULL DEFAULT NULL,
  `phone` char(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `email` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `address` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sex` smallint(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_info
-- ----------------------------
INSERT INTO `user_info` VALUES ('lijinyi', 'ljy', '$2a$10$3K/0NJf3Xffy45.uwvpL6e8sbwrxDXhgrbEDlBMcme1XHhMOKuXx6', '16aa2000-fed4-4144-9bad-d9f59e1caee4', NULL, '15273861602', 'sdf@qq.com', '娄底市', 0);
INSERT INTO `user_info` VALUES ('admin', 'admin', 'a1234567', 'dd', 1, '', NULL, NULL, NULL);
INSERT INTO `user_info` VALUES ('张伟', 'zhangwei', 'pass123', 'U001', 0, '13812345678', 'zhang@clinic.com', '北京朝阳', 1);
INSERT INTO `user_info` VALUES ('李娜', 'lina', 'linapwd', 'U002', 0, '13987654321', 'lina@clinic.com', '上海浦东', 0);
INSERT INTO `user_info` VALUES ('王强', 'wangqiang', 'wq12345', 'U003', 0, '13611223344', 'wang@clinic.com', '广州天河', 1);
INSERT INTO `user_info` VALUES ('陈芳', 'chenfang', 'cf5678', 'U004', 0, '13566778899', 'chen@patient.com', '深圳福田', 0);
INSERT INTO `user_info` VALUES ('赵敏', 'zhaomin', 'zm2023', 'U005', 0, '13455667788', 'zhao@patient.com', '杭州西湖', 0);

SET FOREIGN_KEY_CHECKS = 1;
