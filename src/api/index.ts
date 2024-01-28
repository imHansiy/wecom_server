import axios, {AxiosResponse} from "axios";
import {RequestInfo} from "@cloudflare/workers-types/2021-11-03/index";

const myAxios = axios.create({
    baseURL: "https://qyapi.weixin.qq.com",
    timeout: 5000,
})



export default myAxios;