/*
 * author: nancyzeng
 * date:2019/4/26
 */

import axios from 'axios'
import qs from "Qs";

// console.log(456)

var instance

// 添加读取build之后的代码
// axios.get('./../../static/serverConfig.json').then((result) => {
// axios.get('serverConfig.json').then((result)=>{
    
    // 创建axios的一个实例
    instance = axios.create({
        baseURL: 'http://wap.huoba.net:8080/apis',
        //baseURL: 'http://frontapi.huoba.dev.zxw',
        // baseURL: 'http://wap.huoba.net/api',
        // baseURL: result.data.baseUrl,
        timeout: 6000,
    })
    // console.log(123, result);

    // 一、请求拦截器 忽略
    instance.interceptors.request.use(function (config) {
        config.credentials = true;
        return config;
    }, function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    });
    
    // 二、响应拦截器 忽略
    instance.interceptors.response.use(function (response) {
        // console.log(response)
        return response.data;
    }, function (error) {
        // 对响应错误做点什么
        return Promise.reject(error);
    });

// }).catch((error) => {
//     console.log(error)
// })



/**
* 使用es6的export default导出了一个函数，导出的函数代替axios去帮我们请求数据，
* 函数的参数及返回值如下：
* @param {String} method  请求的方法：get、post、delete、put
* @param {String} url     请求的url:
* @param {Object} data    请求的参数
* @returns {Promise}     返回一个promise对象，其实就相当于axios请求数据的返回值
*/

export default function (method, url, data = null) {
    method = method.toLowerCase();
    if (method === 'post') {
        return instance.post(url, qs.stringify(data));
    } else if (method === 'get') {
        return instance.get(url, qs.stringify(data));
    } else if (method === 'delete') {
        return instance.delete(url, qs.stringify(data));
    } else if (method === 'put') {
        return instance.put(url, qs.stringify(data));
    } else {
        console.error('未知的method' + method);
        return false;
    }
}
