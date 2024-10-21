<template>
	<view>
		<u-toast ref="uToast" />
		<common :tips='commonTips'></common>
		<u-modal :show="modelShow" @cancel="modelShow = false" :mask-close-able="true" :show-cancel-button="true" @confirm="blockConfirm" :content="modelContent"></u-modal>
		<view class="message-user-info">
			<image class="message-avatar" :src="userInfo.avatar" mode="widthFix"></image>
			<view class="user-info-box">
				<view class="user-info-title">
					<block v-for="(titleItem, idx) in userInfo.title" :key="idx">
						<view v-if="titleItem.type == 'text'">{{titleItem.content}}</view>
						<view v-if="titleItem.type != 'text'" hover-class="text-hover" class="color-blue" @click="navUserInfo(titleItem.type, titleItem.id)">{{titleItem.nickname}}</view>
					</block>
				</view>
				<view class="user-info-other">
					<image :src="userInfo.gender" mode="widthFix"></image>
					<text>{{userInfo.other}}</text>
				</view>
			</view>
		</view>
		<view class="message-footer" v-if="info.message && info.message.source">
			<view class="message-footer-title">来源</view>
			<view class="message-footer-content">{{info.message.source}}</view>
		</view>
		<view class="message-footer">
			<view class="message-footer-title">附加消息</view>
			<view class="message-footer-content" v-if="info.message && info.message.note">{{info.message.note}}</view>
		</view>
		<view class="message-footer-buttons">
			<u-button @click="refuse()" v-if="userInfo.option" :custom-style="footerButtonStyle" type="default">拒绝</u-button>
			<u-button @click="agree()" v-if="userInfo.option" :custom-style="footerButtonStyle" type="primary">同意</u-button>
			<view v-if="userInfo.result" class="message-result">{{userInfo.result}}</view>
		</view>
		
		<view v-if="pageFooter" class="page-footer-box">
			<view class="page-footer">
				<text @click="pageFooterButton('block')" class="page-footer-text">{{info.shield ? '解除拉黑':'拉黑该用户'}}</text>|<text @click="pageFooterButton('report')" class="page-footer-text">举报用户</text>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: 0,
				footerButtonStyle: {
					width: '260rpx'
				},
				info: [],
				userInfo: {
					id: 0,
					nickname: '加载中...'
				},
				pageFooter: false,
				modelShow: false,
				modelContent: '',
				commonTips: ''
			}
		},
		onLoad:function(query){
			var that = this
			that.id = query.id ? query.id:0
			that.pageDataLoad()
		},
		onShow:function(){
			this.ws.checkNetwork(this)
			if (this.ws.pageRefresh.addContact) {
				this.pageDataLoad()
				this.ws.pageRefresh.addContact = false
			}
		},
		methods: {
			pageDataLoad: function () {
				var that = this
				that.ws.pageFun(function() {
					that.ws.send({
						c: 'Message',
						a: 'loadNoticeInfo',
						data: {
							id: that.id
						}
					})
				}, that)
			},
			navUserInfo: function (type, id) {
				uni.navigateTo({
					url: '/pages/center/info?id=' + id + '&type=' + type
				})
			},
			optionCallback: function () {
				this.pageDataLoad()
				this.ws.pageRefresh.noticeSessionInfo = true
			},
			agree: function () {
				var that = this
				if (that.info.type == 'friend_apply') {
					if (that.info.friendship) {
						// 可以直接完成同意操作
						that.ws.pageFun(function () {
							let message = {
								c: 'User',
								a: 'createNewContact',
								data: {
									'id': that.info.userInfo.id,
									'type': 'friends',
									'message_id': that.id,
									'method': 'get',
									'action': 'pre-agree'
								}
							}
							that.ws.send(message);
							that.ws.showMsgCallback = function () {
								that.pageDataLoad()
								setTimeout(function(){
									that.ws.pageRefresh.noticeSessionInfo = true
									uni.navigateBack({
										delta: 1
									})
								}, 2000)
							}
						}, that)
					} else {
						uni.navigateTo({
							url: '/pages/search/add-contact?type=user&message_id=' + that.id + '&id=' + that.info.userInfo.id + '&action=pre-agree'
						})
					}
				} else if (that.info.type == 'group_apply') {
					that.ws.pageFun(function(){
						that.ws.send({
							c: 'User',
							a: 'joinGroupOption',
							data: {
								id: that.info.id,
								action: 'agree'
							}
						});
						that.ws.showMsgCallback = that.optionCallback
					}, that)
				} else if (that.info.type == 'group_invitation') {
					that.ws.pageFun(function(){
						that.ws.send({
							c: 'Message',
							a: 'invitationjoinGroupOption',
							data: {
								id: that.info.id,
								action: 'agree'
							}
						});
						that.ws.showMsgCallback = that.optionCallback
					}, that)
				}
			},
			refuse: function () {
				var that = this
				if (that.info.type == 'friend_apply') {
					that.ws.pageFun(function(){
						that.ws.send({
							c: 'User',
							a: 'newFriendsOption',
							data: {
								'id': that.id,
								'action': 'refuse'
							}
						});
						that.ws.showMsgCallback =  that.optionCallback
					}, that)
				} else if (that.info.type == 'group_apply') {
					that.ws.pageFun(function(){
						that.ws.send({
							c: 'User',
							a: 'joinGroupOption',
							data: {
								id: that.info.id,
								action: 'refuse'
							}
						});
						that.ws.showMsgCallback =  that.optionCallback
					}, that)
				} else if (that.info.type == 'group_invitation') {
					that.ws.pageFun(function(){
						that.ws.send({
							c: 'Message',
							a: 'invitationjoinGroupOption',
							data: {
								id: that.info.id,
								action: 'refuse'
							}
						});
						that.ws.showMsgCallback = that.optionCallback
					}, that)
				}
			},
			blockConfirm: function() {
				var that = this
				that.ws.pageFun(function(){
					that.ws.send({
						c: 'User',
						a: 'shieldSession',
						data: {
							session_id: that.info.user_session_id,
							method: that.info.shield ? 'relieve':'shield'
						}
					})
				}, that)
			},
			pageFooterButton: function(type) {
				if (type == 'block') {
					this.modelShow = true
					this.modelContent = '确定拉黑该用户?'
				} else if (type == 'report') {
					uni.navigateTo({
						url: '/pages/center/report?title=举报&type=user&id=' + this.info.user_session_id
					})
				}
			}
		},
		watch: {
			info: function (message) {
				var that = this
				var userInfo = {};
				if (message.type == 'friend_apply') {
					
					userInfo = that.ws.serviceMessageInfo({
						messageData: message
					}, 'new_friends_message', {
						userInfo: message.userInfo
					});
					
					userInfo.gender = that.ws.imgUrl('/assets/addons/fastim/icon/' + message.userInfo.gender.value + '.png')
					userInfo.other = message.userInfo.status.chinese
					that.pageFooter = true
				} else if (message.type == 'group_apply' || message.type == 'group_notice' || message.type == 'group_invitation') {					
					userInfo = that.ws.serviceMessageInfo({
						messageData: message
					}, 'group_notice', {
						userInfo: message.userInfo,
						groupChatInfo: message.groupChatInfo
					});
					
					userInfo.gender = that.ws.imgUrl('/assets/addons/fastim/icon/group.png')
					userInfo.other = message.groupChatInfo.user_count + '/' + message.groupChatInfo.max_user_count
					that.pageFooter = false
				}
				
				that.userInfo = userInfo
			}
		}
	}
</script>

<style lang="scss">
page {
	background-color: $--bg-color;
}
.message-user-info {
	display: flex;
	align-items: center;
	padding: 10rpx 20rpx 0 20rpx;
	background-color: $--white;
}
.message-avatar {
	height: 120rpx;
	width: 120rpx;
}
.user-info-box {
	width: 90%;
	padding-left: 20rpx;
}
.user-info-title {
	display: flex;
	align-items: center;
	font-size: 28rpx;
	font-weight: bold;
	line-height: 36rpx;
}
.color-blue {
	color: $--blue;
}
.text-hover {
	background-color: $--grey;
}
.user-info-other {
	font-size: 26rpx;
	color: $--gray;
	display: flex;
	align-items: center;
}
.user-info-other image {
	height: 26rpx;
	width: 26rpx;
	margin-right: 10rpx;
}
.user-info-id {
	font-size: 30rpx;
	color: $--gray;
	max-width: 200rpx;
	display: flex;
	align-items: center;
	padding-left: 6rpx;
}
.user-info-id-content {
	display: block;
	overflow: hidden;
	text-overflow:ellipsis;
	white-space: nowrap;
}
.user-info-item {
	color: $--gray;
	display: block;
	overflow:hidden;
	text-overflow:ellipsis;
	display:-webkit-box;
	-webkit-box-orient:vertical;
	-webkit-line-clamp:2;
}
.arrow-right-icon {
	margin-left: auto;
}
.message-footer {
	display: flex;
	width: 100vw;
	padding: 20rpx;
	align-items: center;
	background-color: $--white;
}
.message-footer-buttons {
	display: flex;
	align-items: center;
	justify-content: space-around;
	margin-top: 40rpx;
}
.message-footer-title {
	flex: 3;
	font-size: 28rpx;
	color: $--gray;
}
.message-footer-content {
	flex: 9;
	font-size: 28rpx;
	color: $--dark;
}
.message-result {
	font-size: 30rpx;
	color: $--dark;
}
.page-footer-box {
	position: fixed;
	bottom: 20rpx;
	text-align: center;
	width: 100vw;
}
.page-footer {
	display: flex;
	align-items: center;
	justify-content: center;
}
.page-footer-text {
	font-size: 30rpx;
	color: $--blue;
}
.agree-apply-model {
	width: 100vw;
	padding: 20rpx;
}
.agree-apply-model .message-footer-buttons {
	padding: 10rpx 0 40rpx 0;
}
</style>
