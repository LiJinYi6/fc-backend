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

 Date: 07/04/2025 22:38:43
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for medical_record
-- ----------------------------
DROP TABLE IF EXISTS `medical_record`;
CREATE TABLE `medical_record`  (
  `result` varchar(5000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `advice` varchar(5000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `cost` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `record_time` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `cure_state` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `record_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `patient_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `check_items` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `left_eye` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `right_eye` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `combined_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`record_id`) USING BTREE,
  INDEX `FK_Relationship_7`(`patient_id`) USING BTREE,
  CONSTRAINT `FK_Relationship_7` FOREIGN KEY (`patient_id`) REFERENCES `patient_user` (`patient_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for patient_user
-- ----------------------------
DROP TABLE IF EXISTS `patient_user`;
CREATE TABLE `patient_user`  (
  `patient_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `patient_name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `patient_phone` char(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `patient_address` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `patient_sex` smallint(0) NULL DEFAULT NULL,
  `patient_age` decimal(8, 0) NULL DEFAULT NULL,
  `cure_advice` varchar(5000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '就诊建议',
  PRIMARY KEY (`patient_id`) USING BTREE,
  INDEX `FK_Relationship_8`(`id`) USING BTREE,
  CONSTRAINT `FK_Relationship_8` FOREIGN KEY (`id`) REFERENCES `user_info` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for user_info
-- ----------------------------
DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info`  (
  `name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `username` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `password` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `type` smallint(0) NULL DEFAULT NULL,
  `phone` char(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `email` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `address` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `sex` smallint(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Procedure structure for InsertData
-- ----------------------------
DROP PROCEDURE IF EXISTS `InsertData`;
delimiter ;;
CREATE PROCEDURE `InsertData`()
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE patient_uuid VARCHAR(50);
    DECLARE record_uuid VARCHAR(50);
    DECLARE province VARCHAR(20);
    DECLARE full_name VARCHAR(20);
    
    WHILE i <= 50 DO
        -- 生成真实姓名（姓氏+单双名）
        SET full_name = CONCAT(
            SUBSTRING_INDEX(SUBSTRING_INDEX(@surnames, ',', FLOOR(RAND()*20+1)), ',', -1),
            CASE WHEN RAND() > 0.3 THEN 
                SUBSTRING_INDEX(SUBSTRING_INDEX(@given_names, ',', FLOOR(RAND()*20+1)), ',', -1)
            ELSE
                CONCAT(
                    SUBSTRING_INDEX(SUBSTRING_INDEX(@given_names, ',', FLOOR(RAND()*20+1)), ',', -1),
                    SUBSTRING_INDEX(SUBSTRING_INDEX(@given_names, ',', FLOOR(RAND()*20+1)), ',', -1)
                )
            END
        );

        -- 随机选择省份
        SET province = SUBSTRING_INDEX(SUBSTRING_INDEX(@provinces, ',', FLOOR(RAND()*34+1)), ',', -1);
        
        -- 插入患者
        SET patient_uuid = UUID();
        INSERT INTO patient_user VALUES (
            patient_uuid,
            '0a3a01cc-32f7-4fcc-a87b-e2e74321d7cd',
            full_name,
            CONCAT('1', FLOOR(RAND()*9000000000 + 1000000000)), -- 符合手机号规范
            province, -- 省份地址
            FLOOR(RAND()*2),
            FLOOR(RAND()*80 + 18), -- 年龄18-97岁
            CONCAT('建议-', LEFT(UUID(),8))
        );
        -- 插入5条病历
        SET @j = 1;
        WHILE @j <= 10 DO
            INSERT INTO medical_record VALUES (
                CONCAT(ELT(FLOOR(RAND()*8+1), 'AMD', '近视', '白内障', '青光眼', '高血压','糖尿病','其他疾病/异常','正常')),
                CONCAT('建议', ELT(FLOOR(RAND()*4+1), '定期复查', '配镜矫正', '手术治疗', '药物治疗')),
                ROUND(RAND()*800 + 200, 2), -- 费用200-1000元
                DATE_FORMAT(NOW() - INTERVAL FLOOR(RAND()*365) DAY, '%Y-%m-%d %H:%i:%s'),
                ELT(FLOOR(RAND()*3+1), '治疗中', '已康复', '随访观察'),
                UUID(),
                patient_uuid,
                ELT(FLOOR(RAND()*3+1), '视力检查', '眼压检测', '眼底照相'),
                CONCAT('视力', ROUND(RAND()*0.5 + 0.5, 1)),
                CONCAT('视力', ROUND(RAND()*0.5 + 0.5, 1))
            );
            SET @j = @j + 1;
        END WHILE;
        
        SET i = i + 1;
    END WHILE;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for InsertRealisticData
-- ----------------------------
DROP PROCEDURE IF EXISTS `InsertRealisticData`;
delimiter ;;
CREATE PROCEDURE `InsertRealisticData`()
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE patient_uuid VARCHAR(50);
    DECLARE record_uuid VARCHAR(50);
    DECLARE province VARCHAR(20);
    DECLARE full_name VARCHAR(20);
		
		 -- 定义姓氏和名字的变量
    SET @surnames = '赵,钱,孙,李,周,吴,郑,王,冯,陈,褚,卫,蒋,沈,韩,杨,朱,秦,尤,许,何,吕,施,张,孔,曹,严,华,金,魏,陶,姜,戚,谢,邹,喻,柏,水,窦,章,云,苏,潘,葛,奚,范,彭,郎,鲁,韦,昌,马,苗,凤,花,方,俞,任,袁,柳,酆,鲍,史,唐,费,廉,岑,薛,雷,贺,倪,汤,滕,殷,罗,毕,郝,邬,安,常,乐', -- 常见姓氏
        @given_names = '伟,芳,娜,秀英,敏,静,丽,强,磊,军,洋,勇,艳,杰,娟,涛,明,超,秀兰,霞,平,刚,桂英,鹏,红,玉,龙,斌,伟,强,军,霞,婷,勇,涛,明,超,秀娟,霞,平,刚,桂英,鹏,红,玉,龙'; -- 常见名字

    -- 定义省份的变量
    SET @provinces = '北京,天津,河北,山西,内蒙古,辽宁,吉林,黑龙江,上海,江苏,浙江,安徽,福建,江西,山东,河南,湖北,湖南,广东,广西,海南,重庆,四川,贵州,云南,西藏,陕西,甘肃,青海,宁夏,新疆,台湾,香港,澳门'; 
    
    WHILE i <= 50 DO
        -- 生成真实姓名（姓氏+单双名）
        SET full_name = CONCAT(
            SUBSTRING_INDEX(SUBSTRING_INDEX(@surnames, ',', FLOOR(RAND()*20+1)), ',', -1),
            CASE WHEN RAND() > 0.3 THEN 
                SUBSTRING_INDEX(SUBSTRING_INDEX(@given_names, ',', FLOOR(RAND()*20+1)), ',', -1)
            ELSE
                CONCAT(
                    SUBSTRING_INDEX(SUBSTRING_INDEX(@given_names, ',', FLOOR(RAND()*20+1)), ',', -1),
                    SUBSTRING_INDEX(SUBSTRING_INDEX(@given_names, ',', FLOOR(RAND()*20+1)), ',', -1)
                )
            END
        );

        -- 随机选择省份
        SET province = SUBSTRING_INDEX(SUBSTRING_INDEX(@provinces, ',', FLOOR(RAND()*34+1)), ',', -1);
        
        -- 插入患者
        SET patient_uuid = UUID();
        INSERT INTO patient_user VALUES (
            patient_uuid,
            '0a3a01cc-32f7-4fcc-a87b-e2e74321d7cd',
            full_name,
            CONCAT('1', FLOOR(RAND()*9000000000 + 1000000000)), -- 符合手机号规范
            province, -- 省份地址
            FLOOR(RAND()*2),
            FLOOR(RAND()*80 + 18), -- 年龄18-97岁
            CONCAT('建议-', LEFT(UUID(),8))
        );

        -- 插入5条病历
        SET @j = 1;
        WHILE @j <= 10 DO
            INSERT INTO medical_record VALUES (
                CONCAT(ELT(FLOOR(RAND()*8+1), 'AMD', '近视', '白内障', '青光眼', '高血压','糖尿病','其他疾病/异常','正常')),
                CONCAT('建议', ELT(FLOOR(RAND()*4+1), '定期复查', '配镜矫正', '手术治疗', '药物治疗')),
                ROUND(RAND()*800 + 200, 2), -- 费用200-1000元
                DATE_FORMAT(NOW() - INTERVAL FLOOR(RAND()*365) DAY, '%Y-%m-%d %H:%i:%s'),
                ELT(FLOOR(RAND()*3+1), '治疗中', '已康复', '随访观察'),
                UUID(),
                patient_uuid,
                ELT(FLOOR(RAND()*3+1), '视力检查', '眼压检测', '眼底照相'),
                CONCAT('视力', ROUND(RAND()*0.5 + 0.5, 1)),
                CONCAT('视力', ROUND(RAND()*0.5 + 0.5, 1)),
								CONCAT('视力', ROUND(RAND()*0.5 + 0.5, 1))
								
            );
            SET @j = @j + 1;
        END WHILE;
        
        SET i = i + 1;
    END WHILE;
END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
