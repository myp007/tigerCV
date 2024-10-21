import { post, get } from './fetch';

// 验证码
export const getCode = (data, config = {}) => post('/member/sendmail/code', data, config)

// 登录
export const loginEmail = (data, config = {}) => post('/member/login/email', data, config)

// 退出
export const logout = (data, config = {}) => post('/member/login/logout', data, config)

// 注销
export const deleteUser = (data) => get('/member/account/delete', data)

// 用户信息
export const getUserInfo = (data) => post('/member/account/index', data)

// 赠送vip卡接口
export const vipGive = (data, config = {}) => post('/tool/elite/give', data, config);

// 赠卡记录
export const getVipRecord = (data) => get('/tool/elite/vip_record', data)

// 邀请好友
export const inviteFriends = (data, config = {}) => post('/tool/elite/invite', data, config);

// 邀请记录
export const inviteRecord = (data) => get('/tool/elite/invite_record', data)

// im 用户资料
export const getUser = (data) => get('/tool/fast/infoDetail', data)

// 更新用户资料
export const saveInfo = (data,config = {}) => post('/tool/fast/saveinfoDetail', data , config)

// 手机号获取验证码
export const sendsmsCode = (data, config = {}) => post('/member/sendsms/code', data, config)

// 手机号登录
export const loginMobile = (data, config = {}) => post('/member/login/mobile', data, config)