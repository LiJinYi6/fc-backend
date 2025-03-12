const api_key="2e0bf300b6c72226"
const api_secret="30586c4d60920228ce4489c2ef292462"
const url="https://chatglm.cn/chatglm/assistant-api/v1/"
const assistant_id="67ce7d89835f0a7d07b025af"
const axios = require('axios');

// 创建带超时的实例
const http = axios.create({
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json'
  },
  baseURL:url
});
//sse连接代理
const createAssistant=async (data, token,clientRes)=>{
    try {
      const response = await http.post('/stream',
        {
            assistant_id,
            ...data
        }, {
        headers: { Authorization: `Bearer ${token}` ,
                  'Accept':'text/event-stream'},
        responseType: 'stream'
      });
      clientRes.setHeader('Content-Type', 'text/event-stream');
      clientRes.setHeader('Cache-Control', 'no-cache');
      clientRes.setHeader('Connection','keep-alive')
      response.data.pipe(clientRes);
      clientRes.on('close',()=>{
        console.log('close')
        response.data.destroy()
      })
    } catch (error) {
      throw new Error(`会话调用失败: ${error.message}`);
    }
  }
const getToken=async ()=>{
    try {
      const response = await http.post("/get_token", {api_key,api_secret});
      return response.data
    } catch (error) {
      throw new Error(`token获取失败: ${error.message}`);
    }
  }
module.exports = {
    getToken,
    createAssistant
};