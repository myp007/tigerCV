import { post, get } from './fetch';

// 获取企业基本信息
export const getCompanyDetail = (data) => get('/company/home/getCompanyDetail', data)

// 修改企业基本信息
export const setCompanyDetail = (data, config) => post('/company/home/setCompanyDetail', data, config)

// 获取简历标签统计
export const getResumeMarkCount = (data) => get('/company/job/resumeMarkCount', data)

// 更新企业快捷短语
export const setShortcut = (data, config) => post('/company/home/setShortcut', data, config)

// 获取企业快捷短语
export const getShortcut = (data) => get('/company/home/getShortcut', data)

// 更新企业自定义标签
export const setResumeMark = (data, config) => post('/company/home/setResumeMark', data, config)

// 获取企业自定义标签
export const getResumeMark = (data) => get('/company/home/getResumeMark', data)

// 获取未读消息条数
export const getChatUnread = (data) => get('/company/home/getChatUnread', data)

// 获取未读消息条数
export const getEmailById = (data) => get('/company/home/getEmailById', data)

