<!-- <script src="http://127.0.0.1:5500/uni_global.js"></script> -->
<script>
	var iosSessionId = 0;
	import Vue from 'vue'
	
	var v = new Date().getTime();
	export default {
		globalData:{
			// GlobalData : GlobalData
			isLogin:true
		},
		onLaunch: function() {
			uni.setLocale('en')
			var that = this
			let systemInfo = uni.getSystemInfoSync()
			
			// if(systemInfo.uniPlatform == 'web' && systemInfo.model == "PC"){
			// 	uni.navigateTo({
			// 		url: '/pages/iframe-web' 
			// 	})
			// }
			// #ifdef APP-PLUS
			plus.push.addEventListener('click', function(msg) {
				// console.log('用户点击了', msg)
				// 安卓离线通知被点击可能会触发两次click,第一次的msg.payload为莫名obj
				if ((msg.payload && Object.prototype.toString.call(msg.payload) !== '[object Object]') || iosSessionId) {
					let messageShow = () => {
						let sessionId = (iosSessionId ? iosSessionId:msg.payload)
						if (parseInt(sessionId) == 0) {
							uni.switchTab({
								url: '/pages/message/message'
							})
							return ;
						}
						uni.navigateTo({
							url: '/pages/session-info/session-info?id=' + sessionId
						})
					}
					let pages = getCurrentPages(), page = pages[pages.length - 1]
					if (page && page.route == 'pages/message/message') {
						messageShow()
					} else {
						that.ws.messageReady = messageShow
					}
				}
			}, false)
			
			let platform = that.ws.userPlatform ? that.ws.userPlatform:uni.getSystemInfoSync().platform
			if (platform == 'ios') {
				plus.push.addEventListener("receive", function(msg) {
					if ('ignore' == msg.payload) {
						
					} else {
						//接收透传消息
						iosSessionId = msg.payload;
						plus.push.createMessage(msg.content, 'ignore', {
							title: msg.title,
							cover: false
						});
					}
				}, false);
			}
			// #endif
			
			uni.onNetworkStatusChange(function (res) {
			    if (res.isConnected) {
					const userinfo = uni.getStorageSync('userinfo');
					if (userinfo) {
						that.ws.init(userinfo.token, userinfo.auth_token)
					}
				} else {
					that.ws.socketTask.close()
					that.ws.socketOpen = false
					that.ws.checkNetwork()
				}
			});
		},
		onShow: function(query) {
			
			// #ifdef APP-PLUS
			plus.runtime.setBadgeNumber(0);
			// #endif
			if (query.path != 'pages/center/login' && query.path != 'pages/center/register' && query.path != 'pages/center/login_up' && query.path != 'pages/index/index') {
				this.ws.pageRefresh.message = true
				this.ws.pageRefresh.sessionInfo = true
				this.checkLogin()
			}
		},
		
		methods: {
			checkLogin: function () {
				const userinfo = uni.getStorageSync('userinfo');
				var valid = true;
				if (!userinfo || !userinfo.token) {
					valid = false;
				} else {
					let token = userinfo.token.split('|');
					let time = Date.parse(new Date()).toString();
					time = time.substr(0,10);
					// 减去一秒,防止刚好到时间造成发送了错误的请求
					if ((parseInt(token[2]) - 2) < parseInt(time)) {
						valid = false;
					}
				}
				let pages = getCurrentPages()
					
				if (!valid && pages[pages.length-1]) {
					
					setTimeout(() => {
						if(pages[pages.length-1].route!='pages/center/login' && pages[pages.length-1].route!='pages/index/job-list' && pages[pages.length-1].route!='pages/index/index'){
							this.ws.logout()
						}
						
					}, 300)
				} else {
					this.ws.init(userinfo.token, userinfo.auth_token)
				}
			}
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	@import "@/static/font/font.css";
	
	.user-status-0 {
	    color: $--gray !important;
	}
	.user-status-1 {
	    color: #21E589 !important;
	}
	.user-status-2 {
	    color: #FF647E !important;
	}
	.user-status-3 {
	    color: #FF9C4E !important;
	}
	.im-data-none {
		display: block;
		line-height: 100rpx;
		text-align: center;
		font-size: 28rpx;
		color: $--gray;
	}
</style>
