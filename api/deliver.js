import { post, get } from './fetch';

// 简历列表
export const getResumeList = (data) => get('/tool/resume/get_resume_list', data)

// 投递
export const sendEmail = (data, config) => post('/tool/sendmail/send', data, config)

// 简历内容接口
export const fetchEetail = (data, config) => post(`/tool/resume/detail?rid=${data}`, data, config)

// 城市列表
export const getCityList = (data) => get('/company/job_ad/get_city', data)



