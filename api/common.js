import { data } from 'uview-ui/libs/mixin/mixin';
import { upload,global} from './fetch';

// 上传图片
export const uploadImg = (data) => upload('/company/job/upload', data)

// 版本信息
export const globalData = (data) => global('static/uni_global.json',data)
