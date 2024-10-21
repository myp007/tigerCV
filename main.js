import Vue from 'vue'
import App from './App'
import directives from './directives/index'
// import 'material-design-icons-iconfont/dist/material-design-icons.css'
// import GUID from '@/common/guid.js'
// import '@/static/font/font.css' // 本地引入谷歌Roboto-font字體
Object.keys(directives).forEach(k => Vue.directive(k, directives[k]))

Vue.config.productionTip = false

App.mpType = 'app'

// 引入全局uView
import uView from 'uview-ui'
import htmlToPdf from '@/common/htmlToPdf.js'
Vue.use(uView);
Vue.use(htmlToPdf)

Vue.prototype.$getRect = function(selector, all) {
    return new Promise(resolve => {
        uni.createSelectorQuery().
        in(this)[all ? 'selectAll' : 'select'](selector)
            .boundingClientRect(rect => {
                if (all && Array.isArray(rect) && rect.length) {
                    resolve(rect)
                }
                if (!all && rect) {
                    resolve(rect)
                }
            })
            .exec()
    })
}
    Vue.prototype.GUID = function () {
        var d = new Date().getTime()//Timestamp
        var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16;//random number between 0 and 16
            if(d > 0){//Use timestamp until depleted
                r = (d + r)%16 | 0;
                d = Math.floor(d/16);
            } else {//Use microseconds since page-load if supported
                r = (d2 + r)%16 | 0;
                d2 = Math.floor(d2/16);
            }
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    };

const app = new Vue({
    ...App
})

// console.log = function(){}

// import httpInterceptor from '@/common/http.interceptor.js'
// Vue.use(httpInterceptor, app)
require('@/common/http.interceptor.js')(app)

import webSocket from '@/common/websocket.js'
webSocket.ws.that = app
Vue.prototype.ws = webSocket.ws

app.$mount()