const http = uni.$u.http
import imConfig from "@/common/config.js"; // 本地配置数据

const post = (url, data, config = {}) => {
    
    return new Promise((resolve, reject) => {
        http.post(imConfig.appUrl+url, data).then(res => {
            resolve(res.data);
            if(config.showMessage) {
                uni.showToast({
                    title: String(res.message),
                    icon: 'success',
                    duration: 2000
                })
            }
        }).catch((error) => {
            reject(error)
            if(config.showMessage) {
                uni.showToast({
                    title: String(error.message),
                    icon: 'error',
                    duration: 2000
                })
            }
        })
    })
}


const get = (url, data, config = {}) => {
    return new Promise((resolve, reject) => {
        http.get(imConfig.appUrl+url, {params:data}).then(res => {
            resolve(res.data);
            if(config.showMessage) {
                uni.showToast({
                    title: String(res.message),
                    icon: 'success',
                    duration: 2000
                })
            }
        }).catch((error) => {
            reject(error)
            if(config.showMessage) {
                uni.showToast({
                    title: String(error.message),
                    icon: 'error',
                    duration: 2000
                })
            }
        })
    })
}

const global = (url, data, config = {}) => {
    return new Promise((resolve, reject) => {
        http.get(imConfig.globalUrl+url, {params:data}).then(res => {
            resolve(res.data);
            if(config.showMessage) {
                uni.showToast({
                    title: String(res.message),
                    icon: 'success',
                    duration: 2000
                })
            }
        }).catch((error) => {
            reject(error)
            if(config.showMessage) {
                uni.showToast({
                    title: String(error.message),
                    icon: 'error',
                    duration: 2000
                })
            }
        })
    })
}

const upload = (url, data) => {
    return new Promise((resolve, reject) => {
        http.upload(imConfig.appUrl+url, data).then(res => {
            resolve(res.data);
        }).catch((error) => {
            reject(error)
        })
    })
}

export {
    get,
    post,
    upload,
	global
}