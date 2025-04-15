const db = require('../db/index');
// 定义省份与城市的映射
const provinces = {
    '北京': ['北京市'],
    '上海': ['上海市'],
    '天津': ['天津市'],
    '重庆': ['重庆市'],
    '河北': ['石家庄市', '唐山市', '保定市', '邯郸市'],
    '山西': ['太原市', '大同市', '长治市', '晋中市'],
    '辽宁': ['沈阳市', '大连市', '鞍山市', '抚顺市'],
    '吉林': ['长春市', '吉林市', '四平市', '通化市'],
    '黑龙江': ['哈尔滨市', '齐齐哈尔市', '大庆市', '牡丹江市'],
    '江苏': ['南京市', '苏州市', '无锡市', '徐州市'],
    '浙江': ['杭州市', '宁波市', '温州市', '绍兴市'],
    '安徽': ['合肥市', '芜湖市', '蚌埠市', '淮南市'],
    '福建': ['福州市', '厦门市', '泉州市', '漳州市'],
    '江西': ['南昌市', '赣州市', '九江市', '宜春市'],
    '山东': ['济南市', '青岛市', '烟台市', '潍坊市'],
    '河南': ['郑州市', '洛阳市', '开封市', '安阳市'],
    '湖北': ['武汉市', '宜昌市', '襄阳市', '荆州市'],
    '湖南': ['长沙市', '株洲市', '衡阳市', '岳阳市'],
    '广东': ['广州市', '深圳市', '珠海市', '东莞市'],
    '广西': ['南宁市', '柳州市', '桂林市', '北海市'],
    '海南': ['海口市', '三亚市', '三沙市', '儋州市'],
    '四川': ['成都市', '绵阳市', '德阳市', '宜宾市'],
    '贵州': ['贵阳市', '遵义市', '六盘水市', '安顺市'],
    '云南': ['昆明市', '曲靖市', '玉溪市', '大理市'],
    '陕西': ['西安市', '宝鸡市', '咸阳市', '渭南市'],
    '甘肃': ['兰州市', '天水市', '酒泉市', '张掖市'],
    '青海': ['西宁市', '海东市', '格尔木市', '玉树市'],
    '内蒙古': ['呼和浩特市', '包头市', '赤峰市', '鄂尔多斯市'],
    '宁夏': ['银川市', '石嘴山市', '吴忠市', '固原市'],
    '新疆': ['乌鲁木齐市', '克拉玛依市', '吐鲁番市', '哈密市'],
    '台湾': ['台北市', '高雄市', '台中市', '台南市'],
    '香港': ['香港市'],
    '澳门': ['澳门市']
};

// 疾病列表
const diseases = ['AMD', '近视', '白内障', '青光眼', '高血压', '糖尿病', '其他疾病/异常', '正常'];

// 生成随机数工具
const getRandomValue = () => Math.floor(Math.random() * (1000 - 50 + 1)) + 50;
const getRandomItem = arr => arr[Math.floor(Math.random() * arr.length)];
// 定义省份与城市的映射（修正版）


// 生成工具函数
const getRandomValue1 = () => Math.floor(Math.random() * 951) + 50;
const getRandomItem1 = arr => arr[Math.floor(Math.random() * arr.length)];

// 生成按省份分组的500条数据
const generateProvinceData = () => {
    const data = {};
    const provinceList = Object.keys(provinces);

    for (let i = 0; i < 500; i++) {
        const province = getRandomItem1(provinceList);
        const city = getRandomItem1(provinces[province]);
        const entry = {
            name: city,
            value: getRandomValue1(),
            disease: getRandomItem1(diseases)
        };

        if (!data[province]) data[province] = [];
        data[province].push(entry);
    }
    return data;
};



// 生成500条数据
const generateData = () => {
    const data = [];
    const provinceList = Object.keys(provinces);
    
    for (let i = 0; i < 500; i++) {
        const province = getRandomItem(provinceList);
        const city = getRandomItem(provinces[province]);
        const disease = getRandomItem(diseases);
        
        data.push({
            name: city,
            value: getRandomValue(),
            disease: disease,
            province: province
        });
    }
    return data;
};
const handleGetProvince2=(req,res)=>{
    res.sendRes(1,'获取成功',generateProvinceData())
}
const handleGetProvince=(req,res)=>{
    res.sendRes(1,'获取成功',generateData())
}

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
    handleGetRegionData,
    handleGetProvince,
    handleGetProvince2
}