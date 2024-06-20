import axios from "axios";


const req = axios.create({
    baseURL: 'http://localhost:8000/api'
})
req.interceptors.response.use(
    function(response) {
      // 对响应数据做处理，这里我们只返回data部分
      if (response.status >= 200 && response.status < 300) {
        return response.data; // 直接返回data
      } else {
        // 如果状态码不是成功的范围，可以根据需要处理错误
        return Promise.reject(new Error('Unexpected response status'));
      }
    },
    function(error) {
      // 对响应错误做点什么，比如错误处理
      return Promise.reject(error);
    }
  );
export default req

