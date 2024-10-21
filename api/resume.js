import config from '../common/config';
import { post, get ,upload } from './fetch';

// 简历列表
export const fetchResumeList = (data) => get('/tool/resume/list', data)

// 获取简历内容
export const fetchEetail = (data, config) => post(`/tool/resume/detail?rid=${data}`, data, config)

// 模板列表
export const fetchResumeTemplate = (data) => get('/tool/search/get_templates', data)

// 学校列表
export const getSchoolList = (data) => get('/tool/search/get_school_list', data)

// 保存学校信息
export const fetchEducationSave = (data, config) => post('/tool/resume/educationSave', data, config)

// 职位列表
export const getCompanyPositionList = (data) => get('/tool/search/get_company_position_list', data)

// 保存职位
export const fetchWorkSave = (data, config) => post('/tool/resume/workSave', data, config)

// 保存技能
export const fetchSkillSave = (data, config) => post('/tool/resume/skillSave', data, config)

// 保存语言
export const fetchLanguageSave = (data, config) => post('/tool/resume/languageSave', data, config)

// 公司列表
export const getCompanyList = (data) => get('/tool/search/get_company_list', data)

// 下载简历
export const fetchResumeDownload = (data) => get('/tool/resume/download', data) 

// 保存简历
export const saveResume = (data, config) => post('/tool/resume/save', data, config)

// 删除简历
export const fetchResumeDelete = (data) => get('/tool/resume/delete', data) 

// 简历详情
export const detailResume = (data, config) => post('/tool/resume/detail', data, config)

// 发送详情
export const sendMailDetail = (data, config) => post('/tool/sendmail/detail', data, config)

// 发送记录
export const getResumeSendList = (data) => get('/tool/sendmail/get_list', data) 

// 修改企业基本信息
// export const fetchResumeList = (data, config) => post('/company/home/setCompanyDetail', data, config)

// 公司详情
export const getCompanyInfo = (data, config) => get('/tool/job/getCompanyInfo', data, config)
// 公司详情
export const getJobInfo = (data, config) => get('/tool/job/getJobInfo', data, config)

// 上传文件
export const uploadFile = (data) => upload('/tool/resume/upload', data)

// 上传文件
export const uploadSaveResume = (data) => post('/tool/resume/saveResume', data)

// 上传文件
export const getCompanyJobs = (data) => get('/tool/job/getJobList', data)



