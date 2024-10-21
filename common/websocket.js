import imConfig from "./config.js"; // 本地配置数据
import language from './language.js'; // 词库
import { createNotify } from './tool'

var ws = {
	that: null,
	pageThat: null,
	socketTask: null,
	socketOpen: false,
	ready: false,
	needReconnect: true,
	sessionId: 0,
	timer: null, // 全局计时器
	reconnecting: false,
	errorMsg: [], // 发送失败的消息
	maxReconnectCount: 5, // 最大重连次数
	currentReconnectCount: 0,
	initializeData: false, // 初始化请求来的基础数据
	initializeEmoji: false,
	connectSuccess: null,
	showMsgCallback: null,
	messageShow: [],
	pageRefresh: {
		message: false,
		addressList: false
	},
	authToken: '',
	userPlatform: null,
	innerAudioContext: null,
	recorder: null,
	onMessageCallBack: new Map(),
	init: function(token, auth_token = '') {
		var that = this
		if (this.socketTask && this.socketOpen) {
			// console.log('无需链接 ws')
			return false;
		}
		
		that.authToken = auth_token ? auth_token:that.authToken
		if (!this.initializeData) {
			// 发送初始化请求
			this.that.$u.http.get(this.buildUrl('initialize', token), {}).then(res => {
				
				if (res.code == 401 || res.code == 402) {
					// uni.clearStorageSync()
					// that.pageRefresh.message = true
					// uni.reLaunch({
					// 	url: '/pages/center/login'
					// })
					// return false;
				} else if (res.code != 1) {
					uni.showModal({
						title: language.reminder[language.type],
						content: language.initError[language.type],
						showCancel: false
					})
					return false;
				}
				that.initializeData = {
					config: res.data.config,
					tokens: res.data.tokens,
					userinfo: res.data.userinfo
				}
				
				// 来信提示音初始化
				that.innerAudioContext = uni.createInnerAudioContext();
				that.innerAudioContext.src = that.buildUrl('message_prompt', that.initializeData.tokens.im_tourists_token);
				
				that.recorder = uni.getRecorderManager();
				
				that.connect()
			})
			
			this.userPlatform = uni.getSystemInfoSync().platform
		} else {
			that.connect()
		}
	},
	connect: function() {
		var that = this
		if (imConfig.httpsSwitch && parseInt(that.initializeData.config.wss_switch) != 1) {
			uni.showModal({
				title: language.reminder[language.type],
				content: that.initializeData.config.im_name + ' https下须创建wss服务才能连接网络，请参考文档!',
				showCancel: false
			})
			return false;
		}

		// 开始链接 ws
		that.socketTask = uni.connectSocket({
			url: that.buildUrl('ws'),
			header: {
				'content-type': 'application/json'
			},
			complete: res => {}
		});

		that.socketTask.onOpen(function(res) {
			console.log('链接已打开')
			that.socketOpen = true
			that.currentReconnectCount = 0;
			that.needReconnect = true;
			if (that.pageThat) {
				that.pageThat.commonTips = ''
			}

			if (that.timer != null) {
				clearInterval(that.timer);
			}

			that.timer = setInterval(function() {
				that.send({
					c: 'ImBase',
					a: 'ping'
				})
			}, 28000); //定时发送心跳
		});

		that.socketTask.onMessage(function(res) {
			let msg = JSON.parse(res.data)
			that.onMessage(msg);
		});

		that.socketTask.onError(function(res) {
			that.socketOpen = false;
			that.reconnecting = false;
			console.log('链接出错', res)
			
			if (that.timer != null) {
				clearInterval(that.timer);
			}
			
			that.pageThat.commonTips = language.networkError && language.networkError[language.type]
			
			that.reconnect(); // 重连
		});

		// 链接关闭
		that.socketTask.onClose(function(res) {
			console.log('链接已关闭', res)
			that.socketOpen = false;
			that.reconnecting = false;
			if (that.timer != null) {
				clearInterval(that.timer);
			}
			
			that.pageThat.commonTips = language.networkError && language.networkError[language.type]
			
			if (typeof that.closeCallback == 'function') {
				that.closeCallback()
				that.closeCallback = null
			}

			that.reconnect(); // 重连
		});
	},
	reconnect: function() {
		if (!this.needReconnect || this.reconnecting) {
			return false;
		}
		this.reconnecting = true
		var that = this

		if (this.currentReconnectCount < this.maxReconnectCount) {
			this.currentReconnectCount++;
			if (this.currentReconnectCount == 1) {
				that.init();
				console.log('正在重连 WebSocket 第' + this.currentReconnectCount + '次');
			} else {
				console.log('6秒后重连 WebSocket 第' + this.currentReconnectCount + '次');
				this.timer = setTimeout(function() {
					that.init();
					console.log('正在重连 WebSocket 第' + that.currentReconnectCount + '次');
				}, 6000)
			}
		} else {
			if (this.timer != null) {
				clearInterval(this.timer);
			}
			console.log('18秒后将再次尝试重连 WebSocket')
			this.timer = setTimeout(() => {
				console.log('正在重连...')
				that.init()
			}, 18000); //每18秒重新连接一次
		}
	},
	send: function(message) {
		var that = this
		if (!message) {
			return;
		}

		let noNeedLogin = [
			'ImBaselogin'
		];

		if (!noNeedLogin.includes(message.c + message.a) && !that.ready) {
			// uni.showToast({
			// 	title: 'Please try again after the network connection is successful~',
			// 	icon: 'none',
			// 	mask: true
			// })
			return;
		}

		if (that.socketTask && that.socketOpen) {
			that.socketTask.send({
				data: JSON.stringify(message),
				fail: res => {
					console.log('消息发送出错', message, res)
					that.errorMsg.push(message);
				}
			});
		} else {
			console.log('消息发送出错-ws链接异常', message, that.socketTask, that.socketOpen)
			that.errorMsg.push(message);
		}
	},
	sendMessage: function(message, type, sessionId) {
		var messageId = new Date().getTime() + sessionId + Math.floor(Math.random() * 10000), that = this
		that.send({
			c: 'Message',
			a: 'sendMessage',
			data: {
				message: message,
				type: type,
				session_id: sessionId,
				tokens: that.initializeData ? that.initializeData.tokens : false, // 发消息时检测用户登录态是否过期
				message_id: messageId,
				identity: that.initializeData.userinfo.identity
			}
		})
	},
	formatMessage: function(data) {
		var message = ''
		if (data.type == 'image') {
			message = '[图片]';
		} else if (data.type == 'audio') {
			message = '[音频]';
		} else if (data.type == 'voice') {
			message = '[语音消息]';
		} else if (data.type == 'video') {
			message = '[视频]';
		} else if (data.type == 'file') {
			message = '[文件]';
		} else if (data.type == 'link') {
			message = '[链接]';
		} else if (data.type == 'kbs_list') {
			message = data.message.title;
		} else {
			message = data.message.replace(/<img.*?title="(.+?)".*?>/g, "[$1]");
			message = message.replace(/<img.*?src="(.+?)".*?>/g, "[图片]");
		}
		return message;
	},
	imSession: function(data, pageThat, moveTop = true) {
		// message页数据保障
		var currentSessionIndex = -1;
		if (data.sessionInfo.top) {
			for (let m in pageThat.sessionListTop) {
				if (pageThat.sessionListTop[m].id == data.sessionInfo.id) {
					currentSessionIndex = m;
					pageThat.sessionListTop[m].unreadMessagesNumber = (data.unreadMessagesNumber !== false) ? data.unreadMessagesNumber:pageThat.sessionListTop[m].unreadMessagesNumber
					if (data.unreadMessagesNumber === 0) {
						pageThat.sessionListTop[m].unread_fixed_msg = ''
					}
					if (data.lastMessage) {
						pageThat.sessionListTop[m].last_time = data.lastMessage.last_time
						pageThat.sessionListTop[m].last_message = data.lastMessage.last_message
						pageThat.sessionListTop[m].unread_fixed_msg = data.lastMessage.unread_fixed_msg ? data.lastMessage.unread_fixed_msg.message:''
					}
					break;
				}
			}
		} else {
			for (let m in pageThat.sessionList) {
				if (pageThat.sessionList[m].id == data.sessionInfo.id) {
					currentSessionIndex = m;
					pageThat.sessionList[m].unreadMessagesNumber = (data.unreadMessagesNumber !== false) ? data.unreadMessagesNumber:pageThat.sessionList[m].unreadMessagesNumber
					if (data.unreadMessagesNumber === 0) {
						pageThat.sessionList[m].unread_fixed_msg = ''
					}
					if (data.lastMessage) {
						pageThat.sessionList[m].last_time = data.lastMessage.last_time
						pageThat.sessionList[m].last_message = data.lastMessage.last_message
						pageThat.sessionList[m].unread_fixed_msg = data.lastMessage.unread_fixed_msg ? data.lastMessage.unread_fixed_msg.message:''
					}
					break;
				}
			}
		}
		
		// 使用 `splice` 操作数组，会造成数据渲染异常/重复
		// 改用 `filter`、`unshift`来调整会话顺序
		
		if (currentSessionIndex !== -1) {
			
			if (moveTop) {
				if (data.sessionInfo.top) {
					let currentSessionTemp = pageThat.sessionListTop[currentSessionIndex]
					pageThat.sessionListTop = pageThat.sessionListTop.filter(item => {
						return item.id != data.sessionInfo.id;
					})
					pageThat.sessionListTop.unshift(currentSessionTemp);
				} else {
					let currentSessionTemp = pageThat.sessionList[currentSessionIndex]
					pageThat.sessionList = pageThat.sessionList.filter(item => {
						return item.id != data.sessionInfo.id;
					})
					pageThat.sessionList.unshift(currentSessionTemp);
				}
			}
		} else {
			// 组装会话资料,建立会话
			let sessionItem = {}
			if (data.sessionInfo.type == 'single') {
				if (data.sessionInfo.pushUser.status) {
					let statusValue = parseInt(data.sessionInfo.pushUser.status.value)
					if (statusValue == 0) {
						sessionItem.avatar_gray = 'im-img-gray'
						sessionItem.user_status = '[离线]'
					} else if (statusValue == 2) {
						sessionItem.avatar_gray = ''
						sessionItem.user_status = '[忙碌]'
					} else {
						sessionItem.avatar_gray = ''
						sessionItem.user_status = ''
					}
				}
			}
			
			sessionItem.id = data.sessionInfo.id
			sessionItem.type = data.sessionInfo.type
			sessionItem.chat_id = data.sessionInfo.chat_id
			sessionItem.avatar = this.imgUrl(data.sessionInfo.pushUser.avatar)
			sessionItem.nickname = data.sessionInfo.pushUser.nickname
			sessionItem.top = data.sessionInfo.top ? 'session-top' : ''
			sessionItem.last_time = data.lastMessage.last_time
			sessionItem.last_message = data.lastMessage.last_message
			sessionItem.shield = data.shield
			sessionItem.unreadMessagesNumber = data.unreadMessagesNumber
			
			if (data.sessionInfo.top) {
				pageThat.sessionListTop.unshift(sessionItem);
			} else {
				// 将会话移动到非置顶会话的第一位
				pageThat.sessionList.unshift(sessionItem);
			}
			
			this.pageRefresh.addressList = true
		}
	},
	newMessageNotice: function(nickname, lastMessage, noticeAvatar, ringing = true){
		// 新消息通知
		var that = this
		
		// 震动
		if (parseInt(that.initializeData.config.user_config.new_message_shake) == 1) {
			uni.vibrateLong({
			    success: function () {}
			});
		}
		
		// 铃声
		if (ringing && parseInt(that.initializeData.config.user_config.new_message_sound) == 1) {
			that.newMessageRinging()
		}
		
		// 谷歌消息推送
		createNotify("new Message", {
			body: lastMessage ,
			icon: "",
			data: ""
		});
	},
	newMessageRinging: function() {
		if (this.innerAudioContext) {
			this.innerAudioContext.play();
			setTimeout(() => {
				this.innerAudioContext.stop();
			}, 1500)
		} else {
			console.error('来信提示音播放失败！');
		}
	},
	pushCid: function(type = 'save'){
		if (parseInt(this.initializeData.config.uni_push_switch) == 0) {
			return false;
		}
		// #ifdef APP-PLUS
		var callBack = (info) => {
			this.send({
				c: 'User',
				a: 'pushCid',
				data: {
					clientid: info.clientid,
					platform: this.userPlatform,
					type: type
				}
			});
		}
		
		let info = plus.push.getClientInfo();
		if (info && info.clientid) {
			callBack(info)
		} else {
			var obtainingCIDTimer = setInterval(() => {
				info = plus.push.getClientInfo();
				if (info && info.clientid) {
					callBack(info)
					clearInterval(obtainingCIDTimer);
				}
			}, 50)
		}
		// #endif
	},
	onMessage: function(msg) {
		var that = this
		var commonCallback = function() {
			if (msg.data && msg.data.msg && that.pageThat) {
				that.pageThat.$refs.uToast.show({
					title: msg.data.msg,
					type: 'default'
				})
			}
			if (typeof that.showMsgCallback == 'function') {
				that.showMsgCallback()
				that.showMsgCallback = null
				return ;
			}
			that.pageRefresh.message = true
			that.pageRefresh.addressList = true
			setTimeout(function() {
				uni.navigateBack({
					delta: 1
				})
			}, 2000)
		}

		var msgFun = new Map([
			['open', () => {
				that.initializeData.tokens.auth_token = that.authToken
				let message = {
					c: 'ImBase',
					a: 'login',
					data: {
						'tokens': that.initializeData.tokens,
						'identity': that.initializeData.userinfo.identity,
						'platform': that.userPlatform
					}
				}
				that.send(message);
			}],
			['login_success', () => {
				// 标记连接成功
				that.ready = true;
				if (that.pageThat) {
					that.pageThat.commonTips = ''
				}
				typeof that.connectSuccess == 'function' && that.connectSuccess()
				that.connectSuccess = null
				
				// 重新发送所有出错的消息
				for (let i in that.errorMsg) {
					that.send(that.errorMsg[i]);
				}
				that.errorMsg = [];
				
				// 单设备重复在线检测(IOS微信小程序重连后会有单实例多个连接的情况,且在同一句柄上无法关闭)
				// #ifdef MP-WEIXIN
				if (that.userPlatform == 'ios') {
					that.send({
						c: 'ImBase',
						a: 'equipmentInspection',
						data: {
							type: 'check',
							time: Date.now()
						}
					});
				}
				// #endif
				
				that.pushCid()
			}],
			['pong', () => {}],
			['logout', () => {
				console.log('准备退出了')
				that.logout()
			}],
			['equipment-inspection', () => {
				let time = msg.data.time.toString()
				if (that.equipmentLastInspectionTime == time) {
					that.send({
						c: 'ImBase',
						a: 'equipmentInspection',
						data: {
							type: 'close',
							fd: msg.data.fd
						}
					});
				}
				that.equipmentLastInspectionTime = time
			}],
			['show_msg', () => {
				if (msg.data && that.pageThat.$refs.uToast) {
					if (Object.prototype.toString.call(msg.data) === '[object Object]') {
						that.pageThat.$refs.uToast.show({
							title: msg.data.msg,
							type: (msg.data.type == 'tips') ? 'info' : msg.data.type
						})
					} else {
						that.pageThat.$refs.uToast.show({
							title: msg.data,
							type: 'default'
						})
					}
				} else {
					uni.showToast({
						title: (Object.prototype.toString.call(msg.data) === '[object Object]') ? msg.data.msg:msg.data,
						icon: 'none'
					})
				}
				if (msg.close) {
					console.log('收服务端要求禁止自动重新连接ws！');
					that.needReconnect = false;
				}
				typeof that.showMsgCallback == 'function' && that.showMsgCallback()
				that.showMsgCallback = null
			}],
			['user_all_fast_reply', () => {
				that.initializeData.config.fast_reply = msg.data
			}],
			['forward_message', () => {
				var reloadRecord = false
				for (var i = 0; i < msg.data.session_ids.length; i++) {
					reloadRecord = (reloadRecord || (msg.data.session_ids[i] == parseInt(msg.data.data.session_id))) ? true:false
					for (var y = 0; y < msg.data.message.length; y++) {
						that.sendMessage(msg.data.message[y].message, msg.data.message[y].type, msg.data.session_ids[i])
					}
				}
				
				that.pageThat.$refs.uToast.show({
					title: (msg.data.data.type == 'collection' ? '收藏':'消息') + '已转发~',
					type: 'success'
				})
				
				that.pageRefresh.message = true
				setTimeout(res => {
					uni.navigateBack({
						delta: 1
					})
					if (reloadRecord) {
						that.pageRefresh.sessionInfo = true
					}
				}, 2000)
			}],
			['message_operation', () => {
				if (msg.data.method == 'show_msg') {
					that.pageThat.$refs.uToast.show({
						title: msg.data.msg,
						type: (msg.data.type == 'tips') ? 'info' : msg.data.type
					})
				} else {
					if (msg.data.data.action == 'message-copy') {
						uni.setClipboardData({
							data: msg.data.messageInfo.messageText,
							success: function () {
								that.pageThat.$refs.uToast.show({
									title: language.copySuccsess[language.type],
									type: 'success'
								})
								uni.hideToast()
							},
							fail: function () {
								that.pageThat.$refs.uToast.show({
									title: language.copyError[language.type],
									type: 'error'
								})
							}
						});
					} else if (msg.data.data.action == 'message-delete') {
						// 删除消息
						for (let d in that.pageThat.messageList) {
							let index = that.pageThat.messageList[d].data.findIndex(e => {
								return e.id == parseInt(msg.data.data.id);
							})
							if (index !== -1) {
								that.pageThat.messageList[d].data.splice(index, 1)
								// 修改会话列表中的最后消息
								that.messageShow.push((pageThat = that.pageThat) => {
									that.imSession({
										sessionInfo: {
											id: that.pageThat.info.id,
											top: that.pageThat.info.top
										},
										lastMessage: {
											last_time: msg.data.messageInfo.last_time,
											last_message: msg.data.messageInfo.last_message
										},
										unreadMessagesNumber: false
									}, pageThat, false)
								})
								break;
							}
						}
					}
				}
				that.pageThat.maskClick()
			}],
			['load_session_list', () => {
				var session = msg.data.session
				if (msg.data.data.method == 'load') {
					if (session.length) {
						var sessionList = [], sessionListTop = []
						for (var i = 0; i < session.length; i++) {
							let sessionItem = {}
							if (session[i].sessionInfo.pushUser.status) {
								let statusValue = parseInt(session[i].sessionInfo.pushUser.status.value)
								if (statusValue == 0) {
									sessionItem.avatar_gray = 'im-img-gray'
									sessionItem.user_status = '[off-line]'
								} else if (statusValue == 2) {
									sessionItem.avatar_gray = ''
									sessionItem.user_status = '[be busy]'
								} else {
									sessionItem.avatar_gray = ''
									sessionItem.user_status = ''
								}
							}
							
							sessionItem.id = session[i].sessionInfo.id
							sessionItem.type = session[i].sessionInfo.type
							sessionItem.chat_id = session[i].sessionInfo.chat_id
							sessionItem.shield = session[i].sessionInfo.shield ? session[i].sessionInfo.shield:false
							sessionItem.avatar = that.imgUrl(session[i].sessionInfo.pushUser.avatar)
							sessionItem.nickname = session[i].sessionInfo.pushUser.nickname
							sessionItem.top = session[i].sessionInfo.top ? 'session-top' : ''
							sessionItem.unreadMessagesNumber = session[i].unreadMessagesNumber
							sessionItem.last_time = session[i].lastMessage.last_time
							sessionItem.last_message = session[i].lastMessage.last_message
							sessionItem.unread_fixed_msg = session[i].lastMessage.unread_fixed_msg ? session[i].lastMessage.unread_fixed_msg.message:''
							sessionItem.apply_id =  session[i].sessionInfo.apply_id
							sessionItem.talent_id =  session[i].sessionInfo.talent_id
							sessionItem.resume_id =  session[i].sessionInfo.rid
							sessionItem.platform = session[i].sessionInfo.platform
							sessionItem.companyname = session[i].sessionInfo.companyname
							sessionItem.jobname = session[i].sessionInfo.jobname
							sessionItem.jobid = session[i].sessionInfo.jobid
							// sessionItem.userType = session[i].sessionInfo.userInfo.role
							if (!sessionItem.top) {
								sessionList.push(sessionItem)
							} else {
								sessionListTop.push(sessionItem)
							}
						}
						// 合并数据
			            that.pageThat.sessionList = that.pageThat.sessionList.concat(sessionList)
			            that.pageThat.sessionListTop =  that.pageThat.sessionListTop.concat(sessionListTop)
						
						// 去重
						const sessMap = new Map()
						that.pageThat.sessionList = that.pageThat.sessionList.filter(item=>{
							return !sessMap.has(item["id"]) && sessMap.set(item["id"],1)
						})
						that.pageThat.loadStatus = false;
						if(session.length<500){
							that.pageThat.loadStatus = 'No more sessions...'
						}
					} else {
						that.pageThat.loadStatus = 'No more sessions...'
					}
				}
				
				if (typeof that.messageReady == 'function') {
					setTimeout(() => {
						that.messageReady()
						that.messageReady = null
					}, 200)
				}
			}],
			['load_total', () => {
				that.pageThat.msgTotal = {
					reply:msg.data.reply || 0,
					sent:msg.data.sent || 0,
					unread:msg.data.unread || 0
				}
				let badge = msg.data.unread || 0
				if(badge > 0){
					badge = badge > 99 ? '99+' : badge + ''
					uni.setTabBarBadge({
						index: 2,
						text: badge
					  })
				}else{
					uni.removeTabBarBadge({
						index: 2,
					  })
				}
				
			}],
			['user_search', () => {
				if (msg.data.data.type == 'all') {
					for (var i = 0; i < msg.data.friends.length; i++) {
						msg.data.friends[i].avatar = that.imgUrl(msg.data.friends[i].avatar)
						if (msg.data.friends[i].remark) {
							msg.data.friends[i].nickname = msg.data.friends[i].remark + ' (' + msg
								.data.friends[i].nickname_origin + ')';
						}
					}
					that.pageThat.friends = msg.data.friends

					for (var i = 0; i < msg.data.group_chat.length; i++) {
						msg.data.group_chat[i].avatar = that.imgUrl(msg.data.group_chat[i].avatar)
					}
					that.pageThat.group_chat = msg.data.group_chat

					for (var i = 0; i < msg.data.lately_session.length; i++) {
						msg.data.lately_session[i].id = msg.data.lately_session[i].sessionInfo
							.pushUser.id
						msg.data.lately_session[i].avatar = that.imgUrl(msg.data.lately_session[i]
							.sessionInfo.pushUser.avatar)
						msg.data.lately_session[i].nickname = msg.data.lately_session[i].sessionInfo
							.pushUser.nickname
						msg.data.lately_session[i].last_time = msg.data.lately_session[i]
							.lastMessage.last_time
					}
					that.pageThat.lately_session = msg.data.lately_session
					console.log(msg)
				} else if (msg.data.data.type == 'pick-user') {
					// 已经选择的用户
					var userIds = []
					for (var i in that.pageThat.friends) {
						for (let y in that.pageThat.friends[i]) {
							if (that.pageThat.friends[i][y].checked) {
								userIds.push(that.pageThat.friends[i][y].friend_id)
							}
						}
					}

					that.pageThat.showSearchPopup = true
					for (var i = 0; i < msg.data.friends.length; i++) {
						msg.data.friends[i].checked = userIds.includes(msg.data.friends[i].id);
						msg.data.friends[i].avatar = that.imgUrl(msg.data.friends[i].avatar)
					}
					that.pageThat.searchRes = msg.data.friends
				}
			}],
			['load_contact', () => {
				that.pageThat.indexList = msg.data.res.initialPinyinIndex

				for (let item in msg.data.res.initialPinyinArr) {
					for (var i = 0; i < msg.data.res.initialPinyinArr[item].length; i++) {
						if (that.pageThat.preselection && msg.data.res.initialPinyinArr[item][i].friend_id == that.pageThat.preselection) {
							msg.data.res.initialPinyinArr[item][i].checked = true
						} else {
							msg.data.res.initialPinyinArr[item][i].checked = false
						}
						msg.data.res.initialPinyinArr[item][i].avatar = that.imgUrl(msg.data.res
							.initialPinyinArr[item][i].avatar)
					}
				}
				that.pageThat.friends = msg.data.res.initialPinyinArr
			}],
			['create_new_contact', () => {
				var buttons = [],
					showEl = {
						group: true,
						remark: true,
						note: true,
						tis: false
					};
				msg.data.info.avatar = that.imgUrl(msg.data.info.avatar)

				if (msg.data.data.type == 'friends') {
					msg.data.info.icon = that.imgUrl('/assets/addons/fastim/icon/' + msg.data.info
						.gender.value + '.png');

					if (parseInt(msg.data.info.temp_session) == 1) {
						// 添加直接聊天的按钮
						buttons.push({
							type: 'user',
							action: 'open-session',
							btype: 'error',
							title: language.chatOnly[language.type],
						})
					}

					// 预同意
					if (msg.data.data.action && msg.data.data.action == 'pre-agree') {
						msg.data.info.id = msg.data.data.message_id
						showEl.note = false
						buttons.push({
							type: 'user',
							action: 'submit-new-contact-form',
							btype: 'primary',
							opt: 'agree-friends',
							title: language.consentApplication[language.type]
						})
					} else if (parseInt(msg.data.info.verify_method) == 1) {
						showEl.note = false
						showEl.tis = 'Add TA as a friend without verification'
						buttons.push({
							type: 'user',
							action: 'submit-new-contact-form',
							btype: 'success',
							opt: 'apply',
							title: language.addFriend[language.type]
						})
					} else if (parseInt(msg.data.info.verify_method) == 0) {
						buttons.push({
							type: 'user',
							action: 'submit-new-contact-form',
							btype: 'primary',
							opt: 'apply',
							title: language.sendRequest[language.type]
						})
					}
				} else if (msg.data.data.type == 'group') {
					msg.data.info.icon = that.imgUrl('/assets/addons/fastim/icon/group.png')
					msg.data.info.other = '群账号:' + msg.data.info.id
					showEl.remark = false
					if (parseInt(msg.data.info.add_mode) == 0) {
						// 需要验证
						buttons.push({
							type: 'group',
							action: 'submit-new-contact-form',
							btype: 'primary',
							opt: 'apply',
							title: language.joinGroup[language.type]
						})
					} else if (parseInt(msg.data.info.add_mode) == 1) {
						// 无需验证
						showEl.note = false
						showEl.tis = '加入该群无需管理员验证'
						buttons.push({
							type: 'group',
							action: 'submit-new-contact-form',
							btype: 'success',
							opt: 'apply',
							title: language.ApplyJoinGroup[language.type]
						})
					}
				}

				that.pageThat.showEl = showEl
				that.pageThat.buttons = buttons
				that.pageThat.info = msg.data.info
			}],
			['info-detail', () => {
				msg.data.info.avatar = that.imgUrl(msg.data.info.avatar)
				if (msg.data.data.method == 'user-edit') {
					// 编辑用户资料
					var occupationData = []
					for (var i = 0; i < msg.data.info.occupationData.length; i++) {
						occupationData.push({
							value: i,
							label: msg.data.info.occupationData[i],
							extra: '7'
						})
					}

					var genderValue = [{
							value: 'secrecy',
							label: '保密',
							extra: '2'
						},
						{
							value: 'male',
							label: '男',
							extra: '2'
						},
						{
							value: 'female',
							label: '女',
							extra: '2'
						}
					];

					var genderValueIndex = 0;
					for (var i = 0; i < genderValue.length; i++) {
						if (genderValue[i].value == msg.data.info.gender.value) {
							genderValueIndex = i
						}
					}

					that.pageThat.showAvatarUpload = true
					that.pageThat.avatarFileList = [{
						url: msg.data.info.avatar
					}]
					if (!msg.data.info.birthday) {
						var date = new Date();
						msg.data.info.birthday = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
					}
					that.pageThat.detail = [{
						// 昵称
							title: 'Nickname',
							placeholderTitle: 'nickname',
							type: 'input',
							name: 'nickname',
							value: msg.data.info.nickname
						},
						{
							// 签名
							title: 'Bio',
							placeholderTitle: 'bio',
							type: 'textarea',
							name: 'bio',
							value: msg.data.info.bio
						},
						{
							// 性别
							title: 'Gender',
							type: 'select',
							name: 'gender',
							data: genderValue,
							value: [genderValueIndex],
							show: false
						},
						{
							// 生日
							title: 'Birthday',
							placeholderTitle: 'birthday',
							type: 'date',
							value: msg.data.info.birthday,
							name: 'birthday',
							show: false
						},
						{
							// 邮箱
							title: 'Email',
							placeholderTitle: 'email',
							type: 'input',
							name: 'email',
							value: msg.data.info.email
						},
						{
							// 手机
							title: 'Mobile',
							placeholderTitle: 'mobile',
							type: 'input',
							name: 'mobile',
							value: msg.data.info.mobile
						}
						// {
						// 	title: '公　　司',
						// 	placeholderTitle: '公司',
						// 	type: 'input',
						// 	name: 'company',
						// 	value: msg.data.info.company
						// },
						// {
						// 	title: '职　　业',
						// 	type: 'select',
						// 	name: 'occupation',
						// 	data: occupationData,
						// 	value: [msg.data.info.occupation],
						// 	show: false
						// }
					]
				} else if (msg.data.data.method == 'group-edit') {
					// 编辑群组资料
					that.pageThat.showAvatarUpload = true
					that.pageThat.avatarFileList = [{
						url: msg.data.info.avatar
					}]

					var addModeValueIndex = 0,
						inviteJoinGroupIndex = 0,
						historyMessageIndex = 0,
						speakIndex = 0,
						retrievalIndex= 0;

					uni.setNavigationBarTitle({
						title: pageTitle
					});

					// 加群模式
					var addModeValue = [{
							value: '0',
							label: '需管理员审核',
							extra: '2'
						},
						{
							value: '1',
							label: '无需审核',
							extra: '2'
						}
					];
					for (var i = 0; i < addModeValue.length; i++) {
						if (addModeValue[i].value == msg.data.info.add_mode) {
							addModeValueIndex = i
						}
					}

					// 邀请免审
					var inviteJoinGroup = [{
							value: '0',
							label: '成员邀请好友需审核',
							extra: '3'
						},
						{
							value: '1',
							label: '成员邀请好友免审核',
							extra: '3'
						},
					];
					for (var i = 0; i < inviteJoinGroup.length; i++) {
						if (inviteJoinGroup[i].value == msg.data.info.invite_join_group) {
							inviteJoinGroupIndex = i
						}
					}

					// 历史消息
					var historyMessage = [{
							value: '0',
							label: '不允许新入群用户查看',
							extra: '4'
						},
						{
							value: '1',
							label: '允许新入群用户查看',
							extra: '4'
						},
					];
					for (var i = 0; i < historyMessage.length; i++) {
						if (historyMessage[i].value == msg.data.info.history_message) {
							historyMessageIndex = i
						}
					}

					// 成员发言
					var speak = [{
							value: '0',
							label: '允许发言',
							extra: '5'
						},
						{
							value: '1',
							label: '禁止发言',
							extra: '5'
						},
					];
					for (var i = 0; i < speak.length; i++) {
						if (speak[i].value == msg.data.info.speak) {
							speakIndex = i
						}
					}
					
					// 检索设置
					var retrieval = [{
						value: '0',
						label: '禁用搜素加群',
						extra: '6'
					},
					{
						value: '1',
						label: '允许被搜素到',
						extra: '6'
					}];
					for (var i = 0; i < retrieval.length; i++) {
						if (parseInt(retrieval[i].value) == msg.data.info.retrieval_settings) {
							retrievalIndex = i
						}
					}

					that.pageThat.detail = [{
							title: '群　　名',
							placeholderTitle: '群名',
							type: 'input',
							name: 'nickname',
							value: msg.data.info.nickname
						},
						{
							title: '群聊简介',
							type: 'textarea',
							name: 'bio',
							value: msg.data.info.bio
						},
						{
							title: '加群模式',
							type: 'select',
							name: 'add_mode',
							data: addModeValue,
							value: [addModeValueIndex],
							show: false
						},
						{
							title: '邀请免审',
							type: 'select',
							name: 'invite_join_group',
							data: inviteJoinGroup,
							value: [inviteJoinGroupIndex],
							show: false
						},
						{
							title: '历史消息',
							type: 'select',
							name: 'history_message',
							data: historyMessage,
							value: [historyMessageIndex],
							show: false
						},
						{
							title: '成员发言',
							type: 'select',
							name: 'speak',
							data: speak,
							value: [speakIndex],
							show: false
						},
						{
							title: '检索设置',
							type: 'select',
							name: 'retrieval_settings',
							data: retrieval,
							value: [retrievalIndex],
							show: false
						}
					];
				} else {
					// 查看资料
					if (msg.data.data.method == 'get-new-info') {
						that.pageRefresh.message = true
						that.pageRefresh.addressList = true
					}

					var pageTitle = '查看资料'
					if (msg.data.data.type == 'user') {
						// 用户资料
						if (msg.data.info.remark) {
							msg.data.info.nickname = msg.data.info.nickname_origin
						}

						that.pageThat.detail = [{
								title: '账号',
								value: msg.data.info.id,
								name: 'Id'
							},
							{
								title: '个人',
								value:  msg.data.info.gender.chinese,
								name:'Gender'
							},
							{
								title: '生日',
								value: msg.data.info.birthday,
								name:'Birthday'
							},
							{
								title: '邮箱',
								value: msg.data.info.email,
								name:'Email'
							},
							{
								title: '手机',
								value: msg.data.info.mobile,
								name:'Mobile'
							}
							// {
							// 	title: '公司',
							// 	value: msg.data.info.company
							// },
							// {
							// 	title: '职业',
							// 	value: msg.data.info.occupation
							// }
						]

						for (let d in that.pageThat.detail) {
							that.pageThat.detail[d].value = that.pageThat.detail[d].value ? that
								.pageThat.detail[d].value : '-'
						}

						if (parseInt(msg.data.data.requestor) == parseInt(msg.data.info.id)) {
							// 我的资料
							pageTitle = 'My information';
							that.pageThat.buttons = [{
								action: 'userinfo-opt',
								type: 'user',
								data: msg.data.info.id,
								btype: 'default',
								opt: 'edit',
								// 编辑资料
								name: 'Edit'
							}];
						} else if (msg.data.info.friend) {
							// 发送消息
							that.pageThat.buttons = [{
									action: 'open-session',
									type: 'user',
									data: msg.data.info.id,
									btype: 'success',
									name: '发送消息'
								},
								{
									action: 'del-contact',
									type: 'user',
									data: msg.data.info.id,
									btype: 'error',
									name: '删除好友'
								}
							];
						} else {
							that.pageThat.buttons = [{
								action: 'add-friends',
								type: 'user',
								data: msg.data.info.id,
								btype: 'primary',
								name: language.addFriend[language.type]
							}];
						}
						msg.data.info.oldRemark = msg.data.info.remark
						that.pageThat.info = msg.data.info
					} else if (msg.data.data.type == 'group') {
						// 群组资料
						msg.data.info.avatar = that.imgUrl(msg.data.info.avatar)
						pageTitle = '群聊资料';
						msg.data.info.other = '群账号:' + msg.data.info.id
						msg.data.info.type = 'group'
						that.pageThat.info = msg.data.info

						var detail = [];
						if (msg.data.info.leader) {
							msg.data.info.leader.avatar = that.imgUrl(msg.data.info.leader.avatar)
							detail.push({
								title: '群主',
								type: 'leader',
								leader: msg.data.info.leader
							})
						}

						detail.push({
							title: '群人数',
							type: 'text',
							value: msg.data.info.user_count + '/' + msg.data.info
								.max_user_count
						})

						if (typeof msg.data.info.add_mode != 'undefined') {
							detail.push({
								title: '加群模式',
								value: (parseInt(msg.data.info.add_mode) == 0) ? '需管理员审核' :
									'无需审核'
							})
						}
						if (typeof msg.data.info.invite_join_group != 'undefined') {
							detail.push({
								title: '邀请模式',
								value: (parseInt(msg.data.info.invite_join_group) == 0) ?
									'成员邀请好友需要审核' : '成员邀请好友无需审核'
							})
						}
						if (typeof msg.data.info.history_message != 'undefined') {
							detail.push({
								title: '历史消息',
								value: (parseInt(msg.data.info.history_message) == 0) ?
									'不允许新入群用户查看' : '允许新入群用户查看'
							})
						}
						detail.push({
							title: '成员发言',
							value: (parseInt(msg.data.info.speak) == 0) ? '允许发言' : '禁止发言'
						}, {
							title: '创建时间',
							value: msg.data.info.createtime
						})
						that.pageThat.detail = detail

						if (msg.data.info.isLeader) {
							if (msg.data.info.deletetime) {
								return;
							}
							that.pageThat.buttons = [{
									action: 'userinfo-opt',
									type: 'group',
									data: msg.data.info.id,
									btype: 'default',
									opt: 'edit',
									name: '编辑资料'
								},
								{
									action: 'del-contact',
									type: 'dissolution-group',
									data: msg.data.info.id,
									btype: 'error',
									name: '解散群聊'
								},
							];
						} else if (!msg.data.info.groupMember) {
							// 加入群聊
							that.pageThat.buttons = [{
								action: 'userinfo-opt',
								type: 'group',
								data: msg.data.info.id,
								btype: 'primary',
								opt: 'join',
								name: '加入群聊'
							}];
						} else {
							that.pageThat.buttons = [{
									action: 'open-session',
									type: 'group',
									data: msg.data.info.id,
									btype: 'success',
									name: '发送消息'
								},
								{
									action: 'del-contact',
									type: 'group',
									data: msg.data.info.id,
									btype: 'error',
									name: '退出群聊'
								},
							];
						}
					} else if (msg.data.data.type == 'service') {
						// 服务号资料
						msg.data.info.avatar = that.imgUrl(msg.data.info.avatar)
						pageTitle = '服务号资料';
						msg.data.info.other = '服务号'
						msg.data.info.type = 'service'
						that.pageThat.info = msg.data.info
						
						var detail = [];
						detail.push({
							title: '个人',
							type: 'text',
							value: '-'
						}, {
							title: '邮箱',
							type: 'text',
							value: '-'
						}, {
							title: '手机',
							type: 'text',
							value: '-'
						})
						that.pageThat.detail = detail
						
						that.pageThat.buttons = [{
							action: 'close',
							btype: 'default',
							name: '　关闭　',
							plain: true
						}];
					}
					uni.setNavigationBarTitle({
						title: pageTitle
					});
				}
			}],
			['center', () => {
				msg.data.info.avatar = that.imgUrl(msg.data.info.avatar)
				that.pageThat.info = msg.data.info
				that.pageThat.TODOCount = msg.data.TODOCount
				that.pageThat.collectionCount = msg.data.collectionCount
			}],
			['change_status', () => {
				that.pageThat.info.status = {
					value: parseInt(msg.data.status),
					chinese: msg.data.status_chinese
				}
			}],
			['read_message', () => {
				var that = this
				let pages = getCurrentPages(), page = pages[pages.length - 1]
				if (page.route == 'pages/session-info/session-info') {
					if (msg.data.sessionType == 'group') {
						for (let m in that.pageThat.messageList) {
							for (let y in that.pageThat.messageList[m].data) {
								if (that.pageThat.messageList[m].data[y].id == msg.data.message_id) {
									that.pageThat.messageList[m].data[y].status = that.messageStatus(msg.data.status, msg.data.message_id, msg.data.read_number)
									break;
								}
							}
						}
					} else if (parseInt(msg.data.session_id) == parseInt(that.pageThat.id)) {
						for (let m in that.pageThat.messageList) {
							for (let y in that.pageThat.messageList[m].data) {
								if (that.pageThat.messageList[m].data[y].sender == 'me' && that.pageThat.messageList[m].data[y].status.status != '已读') {
									that.pageThat.messageList[m].data[y].status = that.messageStatus(1, 'all');
								}
							}
						}
					}
				}
			}],
			['update_status', () => {
				// 更新好友的状态
				var that = this
				let pages = getCurrentPages(), page = pages[pages.length - 1]
				var statusText = '', status = parseInt(msg.data.status);
				if (status == 0) {
					statusText = '离线'
				} else if (status == 2) {
					statusText = '忙碌'
				}
				
				var messageShow = function (pageThat = that.pageThat) {
					statusText = (status == 1) ? '':statusText
					statusText = statusText ? '[' + statusText + ']':''
					for (let s in pageThat.sessionList) {
						if (pageThat.sessionList[s].id == msg.data.session_id) {
							pageThat.sessionList[s].user_status = statusText
							pageThat.sessionList[s].avatar_gray = (msg.data.status == 0) ? 'im-img-gray':''
							break;
						}
					}
				}
				
				if (page.route == 'pages/session-info/session-info') {
					that.pageThat.info.sessionUser.status = {
						chinese: statusText,
						value: msg.data.status
					}
					that.messageShow.push(messageShow)
				} else if (page.route == 'pages/message/message') {
					messageShow(that.pageThat)
					messageShow = null
				}
			}],
			['del-contact', commonCallback],
			['open_session', () => {
				that.pageRefresh.message = true
				uni.redirectTo({
					url: '/pages/session-info/session-info?id=' + msg.data.sessionInfo.id
				})
			}],
			['new_friends_option', commonCallback],
			['get_groups', () => {
				if (msg.data.data.type == 'collection') {
					that.pageThat.tabs = msg.data.res.collection
					that.pageThat.loadCollection(msg.data.res.collection[0].id, 1)
				}
			}],
			['load_group', () => {
				if (msg.data.data.method == 'load-collection') {
					that.pageThat.loadGroup = msg.data.nextpage ? msg.data.data : false
					
					for (let c in msg.data.res) {
						msg.data.res[c].checked = that.pageThat.collectionSelected.has(msg.data.res[c].id) ? true:false
						msg.data.res[c] = that.buildMessage(msg.data.res[c], 'collection')
					}
					if (parseInt(msg.data.data.page) <= 1) {
						that.pageThat.collections = msg.data.res
					} else {
						that.pageThat.collections = that.pageThat.collections.concat(msg.data.res)
					}
				}
			}],
			['del-collection', () => {
				that.pageThat.collections.splice(msg.data.data.index, 1);
				that.pageThat.$refs.uToast.show({
					title: '收藏已删除~',
					type: 'success'
				})
			}],
			['fast_reply', () => {
				if (msg.data.data.method == 'edit') {
					msg.data.info.status = parseInt(msg.data.info.status) == 0 ? false : true
					that.pageThat.form = msg.data.info
					return;
				} else if (msg.data.data.method == 'opt-done') {
					that.pageThat.$refs.uToast.show({
						title: msg.data.data.msg,
						type: 'success'
					})
					setTimeout(function() {
						that.pageThat.submitButtonStatus = false
						uni.navigateBack({
							delta: 1
						})
					}, 2000)
					return;
				}
				if (msg.data.data.nextpage) {
					that.pageThat.loadFastReply = msg.data.data;
					that.pageThat.loadFastReply.method = 'get'
				} else {
				}

				if (parseInt(msg.data.data.page) == 1) {
					that.pageThat.quickReply = msg.data.fast_reply_list
				} else {
					that.pageThat.quickReply = that.pageThat.quickReply.concat(msg.data
						.fast_reply_list)
				}
			}],
			['report', () => {
				that.pageThat.type = (msg.data.type == 'single') ? 'user' : msg.data.type
				that.pageThat.describePlaceholder = '请详细描述被举报对象的恶意行为'
				uni.setNavigationBarTitle({
					title: '举报' + msg.data.sessionUser.nickname
				});
			}],
			['search_new_contact', () => {
				that.pageThat.newContactData = msg.data.nextpage ? msg.data.data : false;
				if (msg.data.res.length) {
					for (var i = 0; i < msg.data.res.length; i++) {
						msg.data.res[i].avatar = that.imgUrl(msg.data.res[i].avatar)
						if (msg.data.data.type == 'group') {
							msg.data.res[i].type = 'group'
							msg.data.res[i].gender_icon = that.imgUrl(
								'/assets/addons/fastim/icon/group.png');
							msg.data.res[i].status = msg.data.res[i].user_count + '/' + msg.data
								.res[i].max_user_count
							if (msg.data.res[i].is_group_user) {
								msg.data.res[i].button = {
									action: 'open-session',
									opt: false,
									text: '发消息'
								}
							} else {
								msg.data.res[i].button = {
									action: 'userinfo-opt',
									opt: 'join',
									text: '加入'
								}
							}
						} else {
							msg.data.res[i].type = 'user'
							msg.data.res[i].gender_icon = that.imgUrl(
								'/assets/addons/fastim/icon/' + msg.data.res[i].gender.value +
								'.png');
							msg.data.res[i].status = msg.data.res[i].status.chinese
							if (msg.data.res[i].is_friend) {
								// 发送消息
								msg.data.res[i].button = {
									action: 'open-session',
									opt: false,
									text: '发消息'
								}
							} else {
								// 加为好友
								msg.data.res[i].button = {
									action: 'add-friends',
									opt: false,
									text: '加好友'
								}
							}
						}
					}

					if (parseInt(msg.data.data.page) == 1) {
						that.pageThat.res = msg.data.res
					} else {
						that.pageThat.res = that.pageThat.res.concat(msg.data.res)
					}

					if (!msg.data.nextpage) {
						that.pageThat.loadStatus = 'nomore'
					}
				} else {
					if (parseInt(msg.data.data.page) == 1) {
						that.pageThat.res = []
					}
					that.pageThat.loadStatus = 'nomore'
				}
			}],
			['service_session', () => {
				that.pageFun(function() {
					that.send({
						c: 'User',
						a: 'loadSession',
						data: {
							'session_id': msg.data.service_info.id,
							'page': 1,
							'refresh': msg.data.data.refresh ? true:false
						}
					});
				}, that.pageThat)
			}],
			['send_message', () => {
				
				if (msg.data.sendToYourself) {
					/**
					 * sendToYourself:是否是发送给自己的
					 * 发送给自己的任然需推送给自己的其他在线设备
					 * 此处做标记以在前端删除可能存在的原消息:`message_id`
					 */
					if (that.pageThat && that.pageThat.messageList) {
						var find = true;
						for (var i = (that.pageThat.messageList.length - 1); i >= 0; i--) {
							for (var y = (that.pageThat.messageList[i].data.length - 1); y >= 0; y--) {
								that.pageThat.messageList[i].data = that.pageThat.messageList[i].data.filter(item => {
									let findTemp = (item.id != msg.data.message_id);
									if (!findTemp) {
										find = false;
									}
									return findTemp;
								})
								if (find === false) {
									break;
								}
							}
						}
					}
					return ;
				}
				
				// 倒序循环-最快速度找到刚发送的消息
				if (that.pageThat && that.pageThat.messageList) {
					for (var i = (that.pageThat.messageList.length - 1); i >= 0; i--) {
						for (var y = (that.pageThat.messageList[i].data.length - 1); y >= 0; y--) {
							if (that.pageThat.messageList[i].data[y].id == msg.data.message_id) {
								that.pageThat.messageList[i].data[y].id = msg.data.new_message_id
								that.pageThat.messageList[i].data[y].status = that.messageStatus(msg.data.status, msg.data.message_id)
							}
						}
					}
				}
			}],
			['reload_session_list', () => {
				let pages = getCurrentPages(), page = pages[pages.length - 1]
				let messageShow = (pageThat = that.pageThat) => {
					pageThat.pageDataLoad()
				}
				if (page.route == 'pages/message/message') {
					messageShow()
					messageShow = null
				} else {
					that.messageShow.push(messageShow)
				}
			}],
			['group_chat_notice', () => {
				if (msg.data.data.method == 'list') {
					that.pageThat.isLeader = msg.data.isLeader
					that.pageThat.loadGroupChatNotice = msg.data.nextpage ? msg.data.data : false;
					if (msg.data.list.length) {
						if (parseInt(msg.data.data.page) == 1) {
							that.pageThat.noticeList = msg.data.list
						} else {
							that.pageThat.noticeList = that.pageThat.noticeList.concat(msg.data.list)
						}
						if (!msg.data.nextpage) {
							that.pageThat.loadStatus = '没有更多了...'
						}
					} else {
						if (parseInt(msg.data.data.page) == 1) {
							that.pageThat.noticeList = []
						}
						that.pageThat.loadStatus = '没有更多了...'
					}
				}
			}],
			['group-notice-users', () => {
				 that.pageThat.loadGroupNoticeUsers = msg.data.nextpage ? msg.data.data : false;
				 if (msg.data.users.length) {
					for (var i = 0; i < msg.data.users.length; i++) {
						msg.data.users[i].avatar = that.imgUrl(msg.data.users[i].avatar)
					}
				 	if (parseInt(msg.data.data.page) == 1) {
				 		that.pageThat.users = msg.data.users
				 	} else {
				 		that.pageThat.users = that.pageThat.users.concat(msg.data.users)
				 	}
				 	if (!msg.data.nextpage) {
				 		that.pageThat.loadStatus = '没有更多了...'
				 	}
				} else {
				 	if (parseInt(msg.data.data.page) == 1) {
				 		that.pageThat.users = []
				 	}
				 	that.pageThat.loadStatus = '没有更多了...'
				}
			}],
			['group_chat_notice_info', () => {
				if (msg.data.data.type == 'edit') {
					that.pageThat.form.content = msg.data.info.content
					var images = []
					for (var i = 0; i < msg.data.info.images.length; i++) {
						images.push({
							url: msg.data.info.images[i]
						})
					}
					that.pageThat.filesArr = images
					that.pageThat.checkboxs[0].checked = (parseInt(msg.data.info.popup) == 1) ? true:false
					that.pageThat.checkboxs[1].checked = (parseInt(msg.data.info.receipt) == 1) ? true:false
					that.pageThat.checkboxs[2].checked = (parseInt(msg.data.info.top) == 1) ? true:false
				} else if (msg.data.data.type == 'get') {
					that.pageThat.showNotice = true
					that.pageThat.noticeInfo = msg.data.info
				}
			}],
			['receipt_group_chat_notice', () => {
				that.pageThat.$refs.uToast.show({
					title: msg.data.msg,
					type: 'success'
				})
				that.pageThat.pageDataLoad()
			}],
			['group_chat_at', () => {
				if (msg.data.group_member.length) {
					for (let u in msg.data.group_member) {
						msg.data.group_member[u].avatar = that.imgUrl(msg.data.group_member[u].avatar)
					}
					that.pageThat.atUsers = msg.data.group_member
				} else {
					that.pageThat.atUsers = []
				}
			}],
			['new_message', () => {
				let pages = getCurrentPages(), page = pages[pages.length - 1]
				var sessionType = msg.data.sessionInfo.type, pushNickname = '', pushAvatar = ''
				if (sessionType == 'group') {
					// 群聊-不理会发送给特定用户的系统消息
					if (msg.data.messageData.type == 'system' && (msg.data.messageData.message.display_user != that.initializeData.userinfo.id && msg.data.messageData.message.display_user != 'all')) {
						return;
					}
					
					let messageShow = (pageThat = that.pageThat) => {
						that.imSession({
							lastMessage: msg.data.lastMessage,
							sessionInfo: {
								id: msg.data.sessionInfo.id,
								top: msg.data.sessionInfo.top,
								type: msg.data.sessionInfo.type,
								chat_id: msg.data.sessionInfo.chat_id,
								pushUser: msg.data.sessionInfo.sessionUser
							},
							unreadMessagesNumber: msg.data.unreadMessagesNumber,
							shield: msg.data.shield
						}, pageThat);// 会话列表会话
					}
					if (page.route == 'pages/message/message') {
						messageShow()
						messageShow = null
					} else if (page.route == 'pages/session-info/session-info') {
						that.messageShow.push(messageShow)
						if (msg.data.messageData.type == 'group_chat_notice' && parseInt(msg.data.messageData.message.popup) == 1) {
							// 弹窗公告
							that.pageThat.showNotice = true
							that.pageThat.noticeInfo = msg.data.messageData.message
						}
					} else {
						that.messageShow.push(messageShow)
					}
					
					pushAvatar = that.imgUrl(msg.data.sessionInfo.sessionUser.avatar)
					pushNickname = msg.data.sessionInfo.sessionUser.nickname;
				} else {
					pushAvatar = that.imgUrl(msg.data.sessionInfo.pushUser.avatar)
					pushNickname = msg.data.sessionInfo.pushUser.nickname;
					if (page.route == 'pages/message/message') {
						that.imSession(msg.data, that.pageThat);
					} else {
						that.messageShow.push((pageThat = that.pageThat) => {
							that.imSession(msg.data, pageThat);
						})
					}
				}
				
				var readMessage = function() {
					let message = {
						c: 'Message',
						a: 'readMessage',
						data: {
							'session_id': msg.data.sessionInfo.id
						}
					}
					that.send(message);
					
					that.messageShow.push((pageThat = that.pageThat) => {
						that.imSession({
							sessionInfo: {
								id: msg.data.sessionInfo.id,
								top: msg.data.sessionInfo.top
							},
							lastMessage: false,
							unreadMessagesNumber: 0
						}, pageThat)
					})
					
					!msg.data.shield && that.newMessageNotice(pushNickname, msg.data.lastMessage.last_message, pushAvatar, false);
				}
				
				if ((page.route == 'pages/session-info/session-info') && (msg.data.sessionInfo.id == that.pageThat.info.id) && (sessionType == 'single' || sessionType == 'group' || (sessionType == 'service' && msg.data.sessionInfo.chat_id == 3))) {
					if (msg.data.messageData.type != 'system') {
						msg.data.messageData.sender = (msg.data.sessionInfo.pushUser.id == that.initializeData.userinfo.id) ? 'me' : 'you'
						msg.data.messageData = that.buildMessage(msg.data.messageData)
						msg.data.messageData.status = that.messageStatus(3, msg.data.messageData.id)
						if (sessionType == 'group') {
							msg.data.messageData.pushUser = {
								id: msg.data.sessionInfo.pushUser.id,
								avatar: that.imgUrl(msg.data.sessionInfo.pushUser.avatar),
								nickname: (msg.data.messageData.sender == 'me') ? '':msg.data.sessionInfo.pushUser.nickname
							}
						}
					}
					
					let messageListIndex = that.pageThat.messageList.length - 1
					if (that.pageThat.messageList[messageListIndex]) {
						that.pageThat.messageList[messageListIndex].data.push(msg.data.messageData);
					} else {
						that.pageThat.messageList = that.pageThat.messageList.concat({
							datetime: '刚刚',
							data: [msg.data.messageData]
						});
					}
					that.pageThat.scrollIntoFooter(800, 99994)
					readMessage()
				} else if ((page.route == 'pages/session-info/notice-session-info') && (msg.data.sessionInfo.id == parseInt(that.pageThat.session_id)) && (sessionType == 'service') && (msg.data.sessionInfo.chat_id == 2 || msg.data.sessionInfo.chat_id == 1)) {
					that.pageThat.pageDataLoad()
					readMessage()
				} else {
					!msg.data.shield && that.newMessageNotice(pushNickname, msg.data.lastMessage.last_message, pushAvatar, true);
				}
			}],
			['load_session', () => {
				that.messageShow.push((pageThat = that.pageThat) => {
					that.imSession({
						sessionInfo: {
							id: msg.data.info.id,
							top: msg.data.info.top
						},
						lastMessage: false,
						unreadMessagesNumber: 0
					}, pageThat, false)
				})
				
				if (parseInt(that.initializeData.config.user_config.send_message_key) == 0) {
					// 回车键发送
					that.pageThat.sendButtonType = 'send';
				}
				
				if (msg.data.info.windowType == 'fake_tourist') {
					// uni-app端无需游客概念
					that.pageThat.$refs.uToast.show({
						title: '抱歉,加载异常,请重新登录~',
						type: 'error'
					})
					setTimeout(res => {
						that.logout()
					}, 2000)
					return ;
				} else if (msg.data.info.windowType == 'message' || msg.data.info.windowType == 'csr_message') {
					msg.data.info.user.avatar = that.imgUrl(msg.data.info.user.avatar)
					msg.data.info.sessionUser.avatar = that.imgUrl(msg.data.info.sessionUser.avatar)
					that.pageThat.userId = that.initializeData.userinfo.id
					that.pageThat.info = msg.data.info
					that.pageThat.loadRecordsData = msg.data.nextpage ? msg.data.data : false
					
					if (msg.data.info.type == 'group' && msg.data.unreadFixedMsg && parseInt(msg.data.unreadFixedMsg.popup) == 1) {
						that.pageThat.showNotice = true
						that.pageThat.noticeInfo = msg.data.unreadFixedMsg
					}
					
					for (var i = 0; i < msg.data.message.length; i++) {
						for (var y = 0; y < msg.data.message[i].data.length; y++) {
							if (msg.data.message[i].data[y].type != 'system') {
								
								msg.data.message[i].data[y] = that.buildMessage(msg.data.message[i].data[y])
								
								if (msg.data.info.type == 'group') {
									msg.data.message[i].data[y].pushUser = {
										id: msg.data.message[i].data[y].userInfo.id,
										avatar: that.imgUrl(msg.data.message[i].data[y].userInfo.avatar)
									}
									if (msg.data.message[i].data[y].sender_id == that.initializeData.userinfo.id) {
										if (msg.data.message[i].data[y].read_number >= (msg.data.info.sessionUser.user_count - 1)) {
											msg.data.message[i].data[y].status = that.messageStatus(6, msg.data.message[i].data[y].id);
										} else if (msg.data.message[i].data[y].read_number > 0) {
											msg.data.message[i].data[y].status = that.messageStatus(5, msg.data.message[i].data[y].id, msg.data.message[i].data[y].read_number)
										} else {
											msg.data.message[i].data[y].status = that.messageStatus(msg.data.message[i].data[y].status, msg.data.message[i].data[y].id)
										}
										
									} else {
										msg.data.message[i].data[y].pushUser.nickname = msg.data.message[i].data[y].userInfo.nickname
									}
									
								} else if (msg.data.info.type == 'single' || (msg.data.info.type == 'service' && msg.data.info.chat_id == 3)) {
									if (msg.data.message[i].data[y].sender == 'me') {
										msg.data.message[i].data[y].status = that.messageStatus(msg.data.message[i].data[y].status, msg.data.message[i].data[y].id)
									} else {
										msg.data.message[i].data[y].status = that.messageStatus(3, msg.data.message[i].data[y].id)
									}
								}
							}
						}
					}
					if (parseInt(msg.data.data.page) == 1) {
						that.pageThat.messageList = msg.data.message
						that.pageThat.scrollIntoFooter(300, 99990);
					} else {
						for (let i = msg.data.message.length - 1; i >= 0; i--) {
							msg.data.message[i].data.reverse()
							that.pageThat.messageList.unshift(msg.data.message[i]);
						}
						
						setTimeout(function() {
							let wrapper = uni.createSelectorQuery().select('#wrapper');
							wrapper.fields({
								scrollOffset: true
							}, data => {
								that.pageThat.wrapperScrollTop = data.scrollHeight - that.pageThat.wrapperScrollHeight
								that.pageThat.wrapperWithAnimation = true
							}).exec()
						}, 300)
					}
					
					if (msg.data.info.sessionUser.speak && parseInt(msg.data.info.sessionUser.speak) == 1) {
						// 禁止发言
						that.pageThat.imMessage = '管理员已禁止发言'
						that.pageThat.messageContenteditable = true;
					} else {
						that.pageThat.messageContenteditable = false;
					}
				} else if (msg.data.info.windowType == 'new_friends_message' || msg.data.info
					.windowType == 'group_notice') {
					uni.setNavigationBarTitle({
						title: msg.data.info.sessionUser.nickname
					})
					that.pageThat.serviceMessageData = msg.data.nextpage ? msg.data.data : false

					if (msg.data.message.length) {
						var res = [];
						for (var i = 0; i < msg.data.message.length; i++) {
							for (var y = 0; y < msg.data.message[i].data.length; y++) {
								if (msg.data.info.windowType == 'group_notice') {
									res.push(that.serviceMessageInfo({
										messageData: msg.data.message[i].data[y]
									}, 'group_notice', {
										userInfo: msg.data.message[i].data[y].userInfo,
										groupChatInfo: msg.data.message[i].data[y]
											.groupChatInfo
									}))
								} else {
									res.push(that.serviceMessageInfo({
										messageData: msg.data.message[i].data[y]
									}, 'new_friends_message', {
										userInfo: msg.data.message[i].data[y].userInfo
									}))
								}
							}
						}

						if (parseInt(msg.data.data.page) <= 1) {
							that.pageThat.messages = res
						} else {
							that.pageThat.messages = that.pageThat.messages.concat(res)
						}
						if (!msg.data.nextpage) {
							that.pageThat.loadStatus = 'nomore'
						}
					} else {
						that.pageThat.loadStatus = 'nomore'
					}
				}
			}],
			['session-setting', () => {
				msg.data.session_info.sessionUser.avatar = that.imgUrl(msg.data.session_info.sessionUser.avatar)
				if (msg.data.session_info.type == 'group') {
					msg.data.session_info.oldnickname = msg.data.session_info.nickname
					that.pageFun(function(){
						that.send({
							c: 'Message',
							a: 'groupChatMember',
							data: {
								'id': msg.data.session_info.sessionUser.id,
								'method': 'get',
								'limit': 11
							}
						});
					}, that.pageThat)
				}
				that.pageThat.info = msg.data.session_info
			}],
			['group_chat_member', () => {
				if (msg.data.data.lettersort && !msg.data.data.keywords) {
					// 按字母排序
					var initialPinyinArr = msg.data.group_member.initialPinyinArr
					that.pageThat.indexList = msg.data.group_member.initialPinyinIndex
					for (let i in initialPinyinArr) {
						for (let u in initialPinyinArr[i]) {
							initialPinyinArr[i][u].avatar = that.imgUrl(initialPinyinArr[i][u].avatar)
						}
					}
					that.pageThat.users = initialPinyinArr
					msg.data.group_member.leader.avatar = that.imgUrl(msg.data.group_member.leader.avatar)
					that.pageThat.leader = [msg.data.group_member.leader]
					
					that.pageThat.showSearchRes = msg.data.data.keywords ? true:false
					return ;
				}
				
				for (let gm in msg.data.group_member) {
					msg.data.group_member[gm].avatar = that.imgUrl(msg.data.group_member[gm].avatar)
				}
				that.pageThat.groupChatMember = msg.data.group_member
				that.pageThat.showSearchRes = msg.data.data.keywords ? true:false
			}],
			['notice_info', () => {
				that.pageThat.info = msg.data.info
			}],
			['create_group', () => {
				that.pageRefresh.message = true
				that.pageThat.$refs.uToast.show({
					title: '群聊已创建~',
					type: 'success'
				})
				that.showMsgCallback = null
				setTimeout(function(){
					that.pageThat.submitButtonStatus = false
					uni.switchTab({
						url: '/pages/message/message'
					})
				}, 2000)
			}],
			['user-shield', () => {
				that.pageThat.loadData = msg.data.nextpage ? msg.data.data : false
				for (let u in msg.data.shield_users) {
					msg.data.shield_users[u].avatar = that.imgUrl(msg.data.shield_users[u].avatar)
				}
				if (parseInt(msg.data.data.page) == 1) {
					that.pageThat.users = msg.data.shield_users
				} else {
					that.pageThat.users = that.pageThat.users.concat(msg.data.shield_users)
				}
			}],
			['shield_session', () => {
				that.pageThat.users = []
				that.pageThat.pageDataLoad()
			}],
			['input_status', () => {
				let pages = getCurrentPages(), page = pages[pages.length - 1]
				if (page.route == 'pages/session-info/session-info' && that.pageThat.info.id == msg.data.session_id) {
					if (msg.data.status == 'start') {
						that.pageThat.sessionUserInputStatus = true
						// 获得输入框高度
						let imWrite = uni.createSelectorQuery().select('.im-write');
			
						imWrite.fields({
							size: true
						}, data => {
							that.pageThat.imWriteHeight = data.height + 10
						}).exec()
					} else {
						that.pageThat.sessionUserInputStatus = false
					}
				}
			}],
			['del-group-member', () => {
				if (msg.data.member_id) {
					that.pageThat.$refs.uToast.show({
						title: '已删除群成员~',
						type: 'success'
					})
					that.pageFun(that.pageThat.pageDataLoad, that.pageThat);
				}
			}],
			['session-operation-tips', () => {
				that.pageThat.$refs.uToast.show({
					title: msg.data.msg,
					type: msg.data.type
				})
				
				let pages = getCurrentPages(), page = pages[pages.length - 1]
				var messageShow = function (pageThat = that.pageThat) {
					pageThat.ws.pageFun(pageThat.pageDataLoad, pageThat);
				}
				if (page.route == 'pages/message/message') {
					messageShow()
					messageShow = null
				} else {
					that.messageShow.push(messageShow)
				}
			}],
			['upload_multipart', () => {
				if (msg.data.multipart) {
					that.initializeData.config.upload.multipart = msg.data.multipart
					let mu = new Object();
					for (let i in msg.data.multipart) {
						mu[i] = msg.data.multipart[i]
					}
					that.pageThat.uploadFormData = mu
				}
			}],
			['default', () => {
				console.log('收到新的ws消息')
			}]
		]);
		
		let onMessageCallBackAction = this.onMessageCallBack.get(msg.event)
		if (onMessageCallBackAction) {
			onMessageCallBackAction.call(that, msg);
			this.onMessageCallBack.delete(msg.event)
		}

		let action = msgFun.get(msg.event) || msgFun.get('default')
		return action.call(that);
	},
	buildMessage: function(data, buildType = 'record') {
		var that = this
		if (data.type == 'file') {
			data.message.size = data.message.size ? data.message.size : '未知大小';
			data.suffixImg = that.buildUrl('suffix', that.initializeData.tokens.im_tourists_token, data.message.suffix)
		} else if (data.type == 'audio') {
			data.play = false
			data.duration = false
			data.currentTime = '00:00'
		} else if (data.type == 'voice') {
			data.play = false
		} else if(data.type == 'video') {
			data.play = false
			data.duration = false
			data.currentTime = '00:00'
		} else if (data.type == 'link') {
			if (buildType == 'collection') {
				data.message.link_name = (data.message.link_name ? data.message.link_name + ' ': '') + data.message.link_url
			}
			data.message.link_name = data.message.link_name ? data.message.link_name : data.message.link_url
		}
		return data;
	},
	playVideo: function(item, pageThat, page = 'session') {
		var videoContext = uni.createVideoContext('video-' + item.id, pageThat)
		if (!item.play) {
			this.pauseAudio('hide', pageThat, page)
			item.play = true
			videoContext.play()
			setTimeout(() => {
				videoContext.requestFullScreen({direction:0}) // 自动全屏
			}, 300)
		} else {
			item.play = false
			videoContext.pause()
		}
		this.playVideoItem = item
	},
	playAudioInit: function (data) {
		var that = this
		
		that.playAudioContext = uni.createInnerAudioContext();
		that.playAudioContextId = data.id
		that.playAudioContext.autoplay = true;
		that.playAudioContext.src = data.message.url ? data.message.url:data.message
		
		that.playAudioContext.onPlay(() => {
			if (that.playAudioContext.currentTime) {
				data.currentTime = that.sToHs(Math.floor(that.playAudioContext.currentTime))
			}
		})
		
		that.playAudioContext.onTimeUpdate(function() {
			data.currentTime = that.sToHs(Math.floor(that.playAudioContext.currentTime))
			if (!data.duration && that.playAudioContext.duration > 0 && that.playAudioContext.duration != Infinity) {
				data.duration = that.sToHs(Math.floor(that.playAudioContext.duration))
			}
		});
		
		that.playAudioContext.onEnded(() => {
			data.play = false
			data.currentTime = '00:00'
		});
		
		that.playAudioContext.onError((e) => {
			console.log(e)
			// data.play = false
			/* uni.showToast({
				title: '播放失败,请重试~',
				icon: 'none'
			}) */
		})
	},
	// 播放音频,全局只播放一个音频文件
	// 独立于新消息通知的音频播放
	playAudio: function (data, index, m, pageThat, page = 'session') {
		var that = this
		
		// IOS低端机不能直接通过data更新数据
		// 在此处保存要更新数据的 index
		var obj = {
			index: index,
			id: data.id,
			m: m
		}

		// 记录播放
		if (that.playAudioObj) {
			var exist = false
			for (let a in that.playAudioObj) {
				if (that.playAudioObj[a].id == data.id) {
					exist = a
					break;
				}
			}
			if (exist === false) {
				that.playAudioObj.push(obj)
			}
		} else {
			that.playAudioObj = [obj]
		}
		
		for (let a in that.playAudioObj) {
			let item = that.playAudioObj[a]
			// 有正在播放的音频
			if (page == 'session') {
				if (pageThat.messageList[item.index].data[item.m].play) {
					pageThat.messageList[item.index].data[item.m].play = false;
					if (pageThat.messageList[item.index].data[item.m].id == data.id) {
						// 暂停
						that.playAudioContext.pause()
						return false;
					} else {
						// 停止
						pageThat.messageList[item.index].data[item.m].currentTime = '00:00'
						that.playAudioContext.destroy();
					}
					break;
				}
			} else if (page == 'collection') {
				if (pageThat.collections[item.index].play) {
					pageThat.collections[item.index].play = false;
					if (pageThat.collections[item.index].id == data.id) {
						// 暂停
						that.playAudioContext.pause()
						return false;
					} else {
						// 停止
						pageThat.collections[item.index].currentTime = '00:00'
						that.playAudioContext.destroy();
					}
					break;
				}
			}
		}
		
		data.play = true
		
		if (that.playAudioContext && that.playAudioContextId && that.playAudioContextId == data.id) {
			// 播放上次播放的音频
			that.playAudioContext.play()
		} else {
			that.playAudioInit(data)
		}
	},
	pauseAudio: function (type, pageThat, page = 'session') {
		var that = this
		// 正在播放的音频
		if (that.playAudioObj && that.playAudioContext) {
			
			if (type == 'unload') {
				that.playAudioContext.destroy();
				that.playAudioContext = null
			}
			
			for (let a in that.playAudioObj) {
				let item = that.playAudioObj[a]
				// 有正在播放的音频
				if (page == 'session') {
					// IOS低端机不能直接通过data更新数据
					// 此处保存有需更新数据的 index
					if (pageThat.messageList[item.index].data[item.m].play) {
						pageThat.messageList[item.index].data[item.m].play = false;
						if (type == 'unload') {
							break;
						} else {
							// 暂停
							that.playAudioContext.pause()
							break;
						}
					}
				} else if (page == 'collection') {
					if (pageThat.collections[item.index].play) {
						pageThat.collections[item.index].play = false;
						if (type == 'unload') {
							break;
						} else {
							// 暂停
							that.playAudioContext.pause()
							break;
						}
					}
				}
			}
		}
		that.playAudioObj = null
	},
	sToHs: function (s) {
		let h;
		h = Math.floor(s / 60);
		s = s % 60;
		h += '';
		s += '';
		h = (h.length === 1) ? '0' + h : h;
		s = (s.length === 1) ? '0' + s : s;
		return h + ':' + s;
	},
	serviceMessageInfo: function(info, type, extendData = false) {
		var that = this,
			messageItem = {},
			userObj = {}
		var resultObj = {
			agree: '已同意',
			refuse: '已拒绝',
			autoagree: '已自动同意'
		};

		messageItem.id = info.messageData.id
		messageItem.note = info.messageData.message.note
		messageItem.source = (info.messageData.message.source ? '来自' + info.messageData.message.source : '')

		if (extendData.userInfo) {
			userObj = {
				type: 'user',
				id: extendData.userInfo.id,
				nickname: extendData.userInfo.nickname
			};
		}

		if (type == 'new_friends_message') {
			messageItem.avatar = that.imgUrl(extendData.userInfo.avatar)
			messageItem.avatar_type = 'user'
			messageItem.avatar_user = extendData.userInfo.id
			messageItem.friendship = info.messageData.friendship
			
			if (info.messageData.message.method == 'notice') {
				if (info.messageData.message.result == 'refuse') {
					if (info.messageData.sender_id == that.initializeData.userinfo.id) {
						messageItem.title = [{
								type: 'text',
								content: '你已经拒绝了'
							},
							userObj,
							{
								type: 'text',
								content: '的好友申请。'
							}
						];
					} else {
						messageItem.title = [
							userObj,
							{
								type: 'text',
								content: '拒绝了你的好友申请。'
							}
						];
					}
				} else {
					messageItem.title = [
						{
							type: 'text',
							content: info.messageData.message.msg
						}
					];
				}
				messageItem.result = ' '
			} else if (info.messageData.message.method == 'apply') {
				// 对 result 进行处理
				if (info.messageData.message.result) {
					if (resultObj[info.messageData.message.result]) {
						messageItem.result = resultObj[info.messageData.message.result]
					} else if (info.messageData.sender_id == that.initializeData.userinfo.id) {
						messageItem.result = '等待验证'
					} else {
						messageItem.result = false
					}
				} else {
					messageItem.result = false
				}
				
				if (info.messageData.sender_id == that.initializeData.userinfo.id) {
					messageItem.title = [{
							type: 'text',
							content: '申请添加'
						},
						userObj,
						{
							type: 'text',
							content: '为好友'
						}
					];
				} else {
					messageItem.title = [
						userObj,
						{
							type: 'text',
							content: '申请添加你为好友'
						}
					]
				}
			}
		} else if (type == 'group_notice') {
			messageItem.type = info.messageData.type
			messageItem.avatar = that.imgUrl(extendData.groupChatInfo.avatar)
			messageItem.avatar_type = 'group'
			messageItem.avatar_user = extendData.groupChatInfo.id

			var groupObj = {
				type: 'group',
				id: extendData.groupChatInfo.id,
				nickname: extendData.groupChatInfo.nickname
			};

			// 对 result 进行处理
			if (info.messageData.message.result) {
				if (resultObj[info.messageData.message.result]) {
					messageItem.result = resultObj[info.messageData.message.result]
				} else if (info.messageData.sender_id == that.initializeData.userinfo.id) {
					messageItem.result = '等待管理员验证'
				} else {
					messageItem.result = false
				}
			} else {
				messageItem.result = false
			}

			// 申请入群
			if (info.messageData.type == 'group_apply') {
				if (info.messageData.sender_id == that.initializeData.userinfo.id) {
					messageItem.title = [{
							type: 'text',
							content: '申请加入群聊'
						},
						groupObj
					]
				} else {
					messageItem.title = [
						userObj,
						{
							type: 'text',
							content: '申请加入群聊'
						},
						groupObj
					]
				}
			} else if (info.messageData.type == 'group_invitation') {
				// 入群邀请
				var invitationUserObj = {
					type: 'user',
					id: info.messageData.invitationUser.id,
					nickname: info.messageData.invitationUser.nickname
				}

				var leader_result = parseInt(info.messageData.message.leader_result),
					user_result = parseInt(info.messageData.message.user_result);
				
				messageItem.result = false
				if (info.messageData.message.identity == 'admin') {
					// xx邀请xx加入群聊xx
					let invitedUserObj = {
						type: 'user',
						id: info.messageData.invitedUser.id,
						nickname: info.messageData.invitedUser.nickname
					}
					
					messageItem.title = [
						invitationUserObj,
						{
							type:'text',
							content: '邀请'
						},
						invitedUserObj,
						{
							type:'text',
							content: '加入群聊'
						},
						groupObj
					];

					if (leader_result == 3) {
						messageItem.result = '失效'
					} else if (leader_result == 1 && user_result == 1) {
						messageItem.result = '已同意'
					} else if (leader_result == 2) {
						messageItem.result = '已拒绝'
					} else if (user_result == 2) {
						messageItem.result = '用户已拒绝'
					} else if (leader_result == 1 && user_result == 0) {
						messageItem.result = '等待被邀请人验证'
					} else if (leader_result == 0) {
						messageItem.result = false
					}
				} else if (info.messageData.message.identity == 'user') {
					// xx邀请你加入群聊xx
					if (user_result == 3) {
						messageItem.result = '失效'
					} else if (leader_result == 1 && user_result == 1) {
						messageItem.result = '已同意'
					} else if (leader_result == 2) {
						messageItem.result = '群管理员已拒绝'
					} else if (user_result == 2) {
						messageItem.result = '已拒绝'
					} else if (leader_result == 0 && user_result == 1) {
						messageItem.result = '等待管理员验证'
					} else if (user_result == 0) {
						messageItem.result = false
					}
					messageItem.title = [
						invitationUserObj,
						{
							type:'text',
							content: '邀请你加入群聊'
						},
						groupObj
					];
				}
			} else if (info.messageData.type == 'group_notice') {
				messageItem.result = ' '
				if (info.messageData.message.action && info.messageData.message.action == 'dismiss') {
					messageItem.title = [
						groupObj
					]
					messageItem.note = info.messageData.message.notice
				} else if (info.messageData.message.action && info.messageData.message.action == 'quit') {
					messageItem.title = [
						userObj,
						{
							type: 'text',
							content: '退出了群聊'
						},
						groupObj
					]
				} else if (info.messageData.message.action && info.messageData.message.action == 'propose') {
					messageItem.title = [
						{
							type: 'text',
							content: '管理员已将你请出群聊'
						},
						groupObj
					]
				} else if (info.messageData.message.action && info.messageData.message.action == 'refuse') {
					var leader = parseInt(extendData.groupChatInfo.leader); // 群管理
					var sender = parseInt(info.messageData.sender_id); // 执行拒绝操作的用户
					if (that.initializeData.userinfo.id == parseInt(info.messageData.message.refuse_user)) {
						if (sender == leader) {
							messageItem.title = [
								{
									type: 'text',
									content: '管理员拒绝你加入群聊'
								},
								groupObj
							]
						} else if (sender == that.initializeData.userinfo.id) {
							messageItem.title = [
								{
									type: 'text',
									content: '你拒绝加入群聊'
								},
								groupObj
							]
						}
					} else if (that.initializeData.userinfo.id == leader) {
						if (sender == leader) {
							messageItem.title = [
								{
									type: 'text',
									content: '你拒绝了'
								},
								userObj,
								{
									type: 'text',
									content: '加入群聊'
								},
								groupObj
							]
						} else {
							messageItem.title = [
								userObj,
								{
									type: 'text',
									content: '拒绝加入群聊'
								},
								groupObj
							]
						}
					} else {
						if (sender == leader) {
							messageItem.title = [
								{
									type: 'text',
									content: '管理员拒绝了'
								},
								userObj,
								{
									type: 'text',
									content: '加入群聊'
								},
								groupObj
							]
						} else {
							messageItem.title = [
								userObj,
								{
									type: 'text',
									content: '拒绝加入群聊'
								},
								groupObj
							]
						}
					}
				}
			}
		}

		messageItem.option = (messageItem.result && messageItem.result != 'pending') ? false : true;
		return messageItem;
	},
	getEmoji: function() {
		var that = this
		return new Promise(function(resolve, reject) {
			if (that.initializeEmoji) {
				return resolve(that.initializeEmoji)
			}
			
			var token = ''
			if (that.initializeData.tokens) {
				token = that.initializeData.tokens.im_tourists_token
			} else {
				let info = uni.getStorageSync('userinfo');
				token = info.token
			}
			that.that.$u.http.get(that.buildUrl('emoji', token), {}).then(res => {
				if (res.code == 1) {
					that.initializeEmoji = res.data.emoji
					return resolve(res.data.emoji)
				} else {
					return reject()
				}
			})
		})
	},
	clearPageRefresh: function() {
		for (let p in this.pageRefresh) {
			this.pageRefresh[p] = false
		}
	},
	messageStatus: function (status, messageId, readNumber = 0) {
		var statusClass = '';
		// switch (status) {
		// 	case 0:
		// 		status = 'Unread', statusClass = 'fastim-color-blue';
		// 		break;
		// 	case 1:
		// 		status = 'Read', statusClass = '';
		// 		break;
		// 	case 4:
		// 		status = 'fail', statusClass = 'fastim-color-red send-message-fail fail-message-' + messageId;
		// 		break;
		// 	case 5:
		// 		status = readNumber + 'person has read', statusClass = '';
		// 		break;
		// 	case 6:
		// 		status = 'All read', statusClass = '';
		// 		break;
		// 	default:
		// 		status = '', statusClass = 'fastim-hidden';
		// 		break;
		// }
		switch (status) {
			case 0:
				status = '0', statusClass = '';
				break;
			case 1:
				status = '1', statusClass = '';
				break;
			case 4:
				status = '4', statusClass = '';
				break;
			case 5:
				status = '5', statusClass = '';
				break;
			case 6:
				status = '6', statusClass = '';
				break;
			default:
				status = '0', statusClass = '';
				break;
		}
		return {
			status: status,
			statusClass: statusClass
		}
	},
	imgUrl: function(url) {
		var ret = /^http(s)?:\/\//;
		var retDataImage = /^data:image/;
		if (ret.test(url) || retDataImage.test(url)) {
			return url;
		} else {
			if (this.initializeData.config && this.initializeData.config.__CDN__) {
				return this.initializeData.config.__CDN__ + url;
			} else {
				return this.buildUrl('default') + url;
			}
		}
	},
	buildUrl: function(type, token = false, data = null) {
		var that = this
		var protocol = imConfig.httpsSwitch ? 'https://' : 'http://';
		var port = imConfig.httPort ? ':' + imConfig.httPort : '';

		var buildFun = new Map([
			['initialize', () => {
				return protocol + imConfig.baseUrl + port +
					'/addons/fastim/index/initialize?referrer=uni-app&im_tourists_token=' + token;
			}],
			['ws', () => {
				let protocol = parseInt(that.initializeData.config.wss_switch) == 1 ? 'wss://' :
					'ws://';
				return protocol + imConfig.baseUrl + '/' + that.initializeData.config
				.websocket_port;
			}],
			['upload', () => {
				if (that.initializeData.config && that.initializeData.config.upload.uploadurl) {
					return that.initializeData.config.upload.uploadurl + '?im_tourists_token=' +
						token;
				}
				return protocol + imConfig.baseUrl + port +
					'/addons/fastim/index/upload?im_tourists_token=' + token;
			}],
			['get-config-item-data', () => {
				return protocol + imConfig.baseUrl + port +
					'/addons/fastim/index/getConfigItemData?im_tourists_token=' + token;
			}],
			['suffix', () => {
				return protocol + imConfig.baseUrl + port +
					'/addons/fastim/index/icon/suffix/' + data + '?im_tourists_token=' + token;
			}],
			['emoji', () => {
				return protocol + imConfig.baseUrl + port +
					'/addons/fastim/index/getEmoji?im_tourists_token=' + token;
			}],
			['message_prompt', () => {
				if (that.initializeData.config && that.initializeData.config.upload.cdnurl) {
					return that.initializeData.config.upload.cdnurl + that.initializeData.config.ringing;
				}
				return protocol + imConfig.baseUrl + port + '/addons/fastim/index/loadMessagePrompt?im_tourists_token=' + token;
			}],
			['default', () => {
				return protocol + imConfig.baseUrl + port
			}]
		]);

		let action = buildFun.get(type) || buildFun.get('default')
		return action.call(this);
	},
	logout: function () {
		var that = this
		try {
			that.closeCallback = res => {
				console.log(res,'退出成功')
				uni.hideToast()
				that.initializeData = false
				uni.reLaunch({
					url: '/pages/center/login_up'
				})
			}
			that.needReconnect = false
			if (that.socketTask && that.socketOpen) {
				that.socketTask.close()
			} else {
				that.closeCallback()
				that.closeCallback = null
			}
		    uni.clearStorageSync()
			that.pageRefresh.message = true
		} catch (e) {
			console.log(e)
			uni.showToast({
				title: '注销失败,请重试!',
				icon: 'none'
			})
		}
	},
	pageFun: function(fun, pageThat = null) {
		
		this.pageThat = pageThat ? pageThat:this.pageThat
		if (this.ready) {
			typeof fun == 'function' && fun()
		} else {
			this.connectSuccess = fun
		}
	},
	checkNetwork: function (pageThat = null) {
		this.pageThat = pageThat ? pageThat:this.pageThat
		if (!this.socketOpen || !this.ready) {
			this.pageThat.commonTips = language.networkError[language.type]
		} else if (this.pageThat.commonTips) {
			this.pageThat.commonTips = ''
		}
	}
};

export default {
	ws
}
