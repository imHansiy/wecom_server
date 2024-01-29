import axios from 'axios'

const request = axios.create({
    baseURL: 'https://qyapi.weixin.qq.com',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})
export default request