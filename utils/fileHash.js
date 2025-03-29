// 在文件顶部添加crypto依赖
const crypto = require('crypto');

// 新增文件哈希计算函数
function calculateFileHash(filePath, prefixLength = 8) {
    try {
        const hash = crypto.createHash('md5');
        const fileBuffer = fs.readFileSync(filePath);
        hash.update(fileBuffer);
        const fullHash = hash.digest('hex');
        
        // 返回包含原始文件名和哈希片段的对象
        const { name, ext } = path.parse(filePath);
        return {
            fullHash,
            hashedName: `${name}_${fullHash.slice(0, prefixLength)}${ext}` // 示例：file_abc12345.jpg
        };
    } catch (error) {
        console.error(`文件处理失败: ${filePath}`, error);
        return null;
    }
}
module.exports={
    calculateFileHash
}