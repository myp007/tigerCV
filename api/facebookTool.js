import { post, get } from './fetch';
// fb群列表
export const getGroup = (data) => get('/company/job/getGroup', data)

// 岗位
export const getPostion = (data) => get('/company/job/getPosition', data)

// 新增岗位
export const saveJob = (data) => post('/company/job/save', data)

// 岗位列表
export const getJobList = (data) => post('/company/job/getList', data)

// 简历收件箱列表
export const getHomeList = (data) => post('/company/home/getList', data)

// 简历投递记录
export const getInfoByEmail = (data) => get('/company/home/getInfoByEmail', data)

// 岗位发布记录
export const getJobRecord = (data) => get('/company/job/getRecordByJobId', data)

// 简历预览，并标记记录已读
export const previewResume = (data) => get('/company/home/showResume', data)

// 标记简历
export const checkedMarkResume = (data, config) => post('/company/home/markResume', data, config)

// 标记记录
export const getMarkRecordById = (data) => get('/company/home/getMarkRecordById', data)

// facebook 信息列表
export const getFacebookJobList = (data) => get('/tool/job/list', data)

// facebook分组
export const getFacebookGroup = (data) => get('/tool/job/getGroup', data)

// facebook职位
export const getFacebookPosition = (data) => get('/tool/job/getPosition', data)

// 加入小组内公告 今日新增职位 总投递量
export const posCountByToday = (data) => get('/tool/job/posCountByToday', data)

// 单个记录添加设为虚假信息功能
export const facebookChangePos = (data, config) => post('/tool/job/changePos', data, config)

// 单个记录 记录是否投递过 并且可以重复投递 只能三次
export const posDeliverBySelf = (data, config) => post('/tool/job/posDeliverBySelf', data, config)

// 搜索关键字
export const getJobSearchKeyWord = (data) => get('/tool/job/getSearch', data)

// 群组新增数量
export const getGroupCount = (data) => get('/tool/job/getGroupCount', data)

// 添加组
export const addGroup = (data, config) => post('/tool/job/addGroup', data, config)

// 广场会话
export const getChat = (data) => get('/tool/job/getChat', data)

// 广场未登录会话
export const chatStart = (data) => post('/tool/chat/start', data)

// 热搜标签
export const getJobCategory = (data, config) => get('/tool/job/getJobCategory', data, config)

// 顶级分类
export const getTopdirectory = (data, config) => get('/tool/job/top_directory', data, config)

// 岗位列表
export const jobList = (data, config) => get('/tool/job/list', data, config) 

// 收藏岗位登录
export const categoryList = (data, config) => get('/tool/category/getUserCollect', data, config) 


// 收藏岗位登录
export const allCategoryList = (data, config) => get('/tool/category/getList', data, config) 

// 收藏岗位登录
export const categorySave = (data, config) => post('/tool/category/save', data, config)

// stickStatus
export const stickStatus = (data) => get('/tool/stick/status', data)