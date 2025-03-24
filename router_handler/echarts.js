const db = require('../db/index');

const handleGetPieDate = (req,res) => {
    const sql = `SELECT result AS name, COUNT(*) AS value 
                FROM medical_record 
                WHERE result IS NOT NULL
                GROUP BY result`;
    
    db.query(sql, (err, results) => {
        if (err) return res.sendRes(0, err.message);  // 改为传递错误消息
        if (results.length === 0) return res.sendRes(0, '暂无数据');
        // 转换数据格式适配echarts
        const pieData = results.map(item => ({
            name: item.name,
            value: item.value
        }));
        
        // 修正参数顺序：状态码、消息、数据
        res.sendRes(1, '数据获取成功', pieData);  
    });
};
const handleGetBarData = (req, res) => {
    const sql = `
        SELECT 
            mr.result AS disease,
            CASE pu.patient_sex 
                WHEN 1 THEN '男' 
                WHEN 0 THEN '女' 
            END AS gender,
            COUNT(*) AS count
        FROM medical_record mr
        INNER JOIN patient_user pu ON mr.patient_id = pu.patient_id
        WHERE mr.result IS NOT NULL AND pu.patient_sex IS NOT NULL
        GROUP BY mr.result, pu.patient_sex
    `;

    db.query(sql, (err, results) => {
        if (err) return res.sendRes(0, err.message);
        if (results.length === 0) return res.sendRes(0, '暂无数据');

        // 过滤无效性别并转换格式
        const barData = results
            .filter(item => item.gender)  // 排除性别为NULL的记录
            .map(item => ({
                gender: item.gender,
                disease: item.disease,
                count: item.count
            }));

        res.sendRes(1, '数据获取成功', barData);
    });
};
const handleGetPlotData = (req, res) => {
    const sql = `
        SELECT 
            CAST(pu.patient_age AS UNSIGNED) AS age,
            mr.result AS disease
        FROM medical_record mr
        INNER JOIN patient_user pu ON mr.patient_id = pu.patient_id
        WHERE mr.result IS NOT NULL
    `;

    db.query(sql, (err, results) => {
        if (err) return res.sendRes(0, err.message);
        if (results.length === 0) return res.sendRes(0, '暂无数据');

        // 转换数字类型并过滤无效年龄
        const formattedData = results
            .filter(item => item.age > 0)
            .map(item => ({
                age: Number(item.age),
                disease: item.disease
            }));

        res.sendRes(1, '数据获取成功', formattedData);
    });
};
const handleGetRegionData = (req, res) => {
    const sql = `
        SELECT 
            pu.patient_address AS address,
            mr.result AS disease,
            COUNT(*) AS count
        FROM medical_record mr
        INNER JOIN patient_user pu ON mr.patient_id = pu.patient_id
        WHERE mr.result IS NOT NULL 
          AND pu.patient_address IS NOT NULL
        GROUP BY pu.patient_address, mr.result
    `;

    db.query(sql, (err, results) => {
        if (err) return res.sendRes(0, err.message);
        if (results.length === 0) return res.sendRes(0, '暂无数据');

        const regionData = results.map(item => ({
            address: item.address,
            disease: item.disease,
            count: item.count
        }));
        res.sendRes(1, '数据获取成功', regionData);
    });
};

module.exports = {
    handleGetPieDate,
    handleGetBarData,
    handleGetPlotData,
    handleGetRegionData
}