import imConfig from "./config.js"; // 本地配置数据
var httpConfig = {
	// baseURL: imConfig.baseUrl, // (imConfig.httpsSwitch ? 'https://':'http://') + imConfig.baseUrl, // 请求的域名
	// method: 'POST',
	// // 设置为json，返回后会对数据进行一次JSON.parse()
	// dataType: 'json',
	// showLoading: true, // 是否显示请求中的 loading
	// loadingText: '稍等片刻...', // 请求loading中的文字提示
	// loadingTime: 800, // 在此时间内，请求还没回来的话，就显示加载中动画，单位ms
	// originalData: false, // 是否在拦截器中返回服务端的原始数据
	// loadingMask: true, // 展示loading的时候，是否给一个透明的蒙层，防止触摸穿透
	// custom: {auth: true},
	// // 配置请求头信息
	// header: {
	// 	'content-type': 'application/json;charset=UTF-8'
	// },

	baseUrl: imConfig.baseUrl, // (imConfig.httpsSwitch ? 'https://':'http://') + imConfig.baseUrl, // 请求的域名
    header: {
		'content-type': 'application/json;charset=UTF-8'
	},
    method: 'GET',
    dataType: 'json',
    // #ifndef MP-ALIPAY
    responseType: 'text',
    // #endif
    // 注：如果局部custom与全局custom有同名属性，则后面的属性会覆盖前面的属性，相当于Object.assign(全局，局部)
    custom: {},// 全局自定义参数默认值
    // #ifdef H5 || APP-PLUS || MP-ALIPAY || MP-WEIXIN
    timeout: 60000,
    // #endif
    // #ifdef APP-PLUS
    sslVerify: false,
    // #endif
    // #ifdef H5
    // 跨域请求时是否携带凭证（cookies）仅H5支持（HBuilderX 2.6.15+）
    withCredentials: false,
    // #endif
    // #ifdef APP-PLUS
    firstIpv4: false, // DNS解析时优先使用ipv4 仅 App-Android 支持 (HBuilderX 2.8.0+)
    // #endif
    // 局部优先级高于全局，返回当前请求的task,options。请勿在此处修改options。非必填
    // getTask: (task, options) => {
    // 相当于设置了请求超时时间500ms
    //   setTimeout(() => {
    //     task.abort()
    //   }, 500)
    // },
    // 全局自定义验证器。参数为statusCode 且必存在，不用判断空情况。
    validateStatus: (statusCode) => { // statusCode 必存在。此处示例为全局默认配置
        return statusCode >= 200 && statusCode < 300
    }
}

// const install = (Vue, vm) => {
// 	console.log(config)
// 	Vue.prototype.$u.http.setConfig((res) => {
// 		return config
// 	});
	
// 	Vue.prototype.$u.http.interceptor.request = (config) => {
// 		const userinfo = uni.getStorageSync('userinfo');
// 		if (!imConfig.noNeedLogin.includes(config.url)) {
// 			if (userinfo) {
// 				config.header.token = userinfo.token;
// 			} else {
// 				return false;// 不再请求，app.vue内有延时的登录跳转
// 			}
// 		}
// 		return config;
// 	}
// }

module.exports = (vm) => {
    // 初始化请求配置
    uni.$u.http.setConfig((config) => {
		// config = Object.assign(config, httpConfig)
		// console.log(config)
        return config
    })
	
	// 请求拦截
	uni.$u.http.interceptors.request.use((config) => { // 可使用async await 做异步操作
	    // 初始化请求拦截器时，会执行此方法，此时data为undefined，赋予默认{}
	    config.data = config.data || {}
		// if (appUrl) {
		// 	config
		// }
		// 根据custom参数中配置的是否需要token，添加对应的请求头
		const appinfo = uni.getStorageSync('appinfo');
		if(appinfo.token) {
			// 可以在此通过vm引用vuex中的变量，具体值在vm.$store.state中
			config.header['user-token'] = appinfo.token
		}
	    return config 
	}, config => { // 可使用async await 做异步操作
	    return Promise.reject(config)
	})
	
	// 响应拦截
	uni.$u.http.interceptors.response.use((response) => { /* 对响应成功做点什么 可使用async await 做异步操作*/
		const data = response.data
		// 自定义参数
		const userinfo = uni.getStorageSync('userinfo');
		const custom = response.config?.custom
		if (data.code == 500) { 
			// 如果没有显式定义custom的toast参数为false的话，默认对报错进行toast弹出提示
			if (custom.toast !== false) {
				uni.$u.toast(data.message)
			}

			// 如果需要catch返回，则进行reject
			if (custom?.catch) {
				return Promise.reject(data)
			} else {
				// 否则返回一个pending中的promise，请求不会进入catch中
				return new Promise(() => { })
			}
		} else if (data.code == 50010) {
			// 登录验证失败
			uni.$u.toast(data.message)
			uni.redirectTo({
				url: '/pages/center/login_up' 
			})
		} else if (data.code == 510) {
			
			uni.showModal({
				title: 'Tips',
				content: data.message,
				showCancel:false,
				confirmText:'Ok',
				success: function (res) {
					if (res.confirm) {
						console.log('用户点击确定');
					}
				}
			});
			// uni.showToast({
			// 	title: String(data.message),
			// 	icon: 'none',
			// 	duration: 2000
			// })
			return response 
		}

		return data === undefined ? {} : data
	}, (response) => { 
		console.log(response)
		// 对响应错误做点什么 （statusCode !== 200）
		return Promise.reject(response)
	})
}