/*
 * author: nancyzeng
 * date:2019/4/26
 */

import req from './http.js'

// 个人中心首页
export const USER_HOMEPAGE = params => req('post', '/user/homePage', params);

// 定义我的评论接口
export const USER_COMMENT = params => req('post', '/user/comment/gets', params);

// 历史
export const USER_HISTORY = params => req('post', '/user/history/gets', params);
export const USER_HISTORY_CANCEL = params => req('post', '/user/history/delete', params);

//我的余额
export const USER_REMAIN_INFO = params => req('post', '/user/wallet/info', params);
// 我的余额-明细
export const USER_REMAIN_DETAILS = params => req('post', '/user/wallet/details', params);
