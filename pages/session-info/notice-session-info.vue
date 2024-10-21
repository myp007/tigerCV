<template>
	<view>
		<u-toast ref="uToast" />
		<common :tips='commonTips'></common>
		<view class="message-item" v-for="(item, index) in messages" :key="index">
			<navigator hover-class="none" :url="'/pages/session-info/notice-message-info?id=' + item.id">
				<image class="message-avatar" :src="item.avatar" mode="widthFix"></image>
			</navigator>
			<view hover-class="none" class="item-info-box">
				<view :class="item.type == 'group_invitation' ? 'message-username-invitation':'message-username'">
					<block v-for="(titleItem, idx) in item.title" :key="idx">
						<view v-if="titleItem.type == 'text'">
							<navigator :url="'/pages/session-info/notice-message-info?id=' + item.id">{{titleItem.content}}</navigator>
						</view>
						<view hover-class="text-hover" class="color-blue" @click="navUserInfo(titleItem.type, titleItem.id)" v-if="titleItem.type != 'text'">{{titleItem.nickname}}</view>
					</block>
				</view>
				<navigator :url="'/pages/session-info/notice-message-info?id=' + item.id">
					<view class="message-info-item">{{item.note}}</view>
					<view class="message-info-item">{{item.result.length >= 6 ? item.result:item.source}}</view>
				</navigator>
			</view>
			<view class="item-right-button">
				<u-button @click="agree(item.avatar_type, item.id, item.avatar_user, item.type, item.friendship)" v-if="item.option" :custom-style="itemRightButtonStyle" type="default" size="mini">agree</u-button>
				<view v-else class="item-right-text">{{item.result.length >= 6 ? '':item.result}}</view>
			</view>
		</view>
		
		<u-loadmore margin-top="20" margin-bottom="20" loadmoreText="No more" :status="loadStatus" :icon="false" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userinfo: [],
				service_id: 0,
				session_id: 0,
				itemRightButtonStyle: {
					width: '100rpx'
				},
				serviceMessageData: null,
				loadStatus: 'nomore',
				messages: [],
				commonTips: ''
			}
		},
		onLoad: function(query) {
			var that = this
			that.session_id = query.session_id ? query.session_id : 0
			that.service_id = query.service_id ? query.service_id : 0
			that.userinfo = uni.getStorageSync('userinfo');
			that.pageDataLoad()
		},
		onShow: function () {
			this.ws.checkNetwork(this)
			if (this.ws.pageRefresh.noticeSessionInfo) {
				this.pageDataLoad()
				this.ws.pageRefresh.noticeSessionInfo = false
			}
		},
		onPullDownRefresh: function () {
			this.pageDataLoad(true)
			this.ws.onMessageCallBack.set('load_session', (msg) => {
				if (msg.data.data.refresh) {
					this.$refs.uToast.show({
						title: '刷新成功~',
						type: 'success'
					})
					uni.stopPullDownRefresh()
				}
			})
		},
		methods: {
			pageDataLoad: function(refresh = false) {
				var that = this
				if (that.session_id) {
					that.loadStatus = 'loadmore'
					that.ws.pageFun(function(){
						that.ws.send({
							c: 'User',
							a: 'loadSession',
							data: {
								page: 1,
								session_id: that.session_id,
								refresh: refresh
							}
						});
					}, that)
				}
				
				if (that.service_id) {
					that.loadStatus = 'loadmore'
					that.ws.pageFun(function() {
						that.ws.send({
							c: 'User',
							a: 'getServiceSession',
							data: {
								service_id: that.service_id,
								refresh: refresh
							}
						})
					}, that)
				}
			},
			navUserInfo: function (type, id) {
				uni.navigateTo({
					url: '/pages/center/info?id=' + id + '&type=' + type
				})
			},
			onReachBottom: function () {
				var that = this
				if (that.serviceMessageData) {
					that.serviceMessageData.page++
					that.ws.pageFun(function(){
						that.ws.send({
							c: 'User',
							a: 'loadSession',
							data: that.serviceMessageData
						});
					}, that)
				}
			},
			agree: function (type, message_id, user_id, message_type = false, friendship = false) {
				var that = this
				if (type == 'user') {
					if (friendship) {
						// 可以直接完成同意操作
						that.ws.pageFun(function () {
							let message = {
								c: 'User',
								a: 'createNewContact',
								data: {
									'id': user_id,
									'type': 'friends',
									'message_id': message_id,
									'method': 'get',
									'action': 'pre-agree'
								}
							}
							that.ws.send(message);
							that.ws.showMsgCallback = function () {
								that.pageDataLoad()
							}
						}, that)
					} else {
						uni.navigateTo({
							url: '/pages/search/add-contact?type=user&message_id=' + message_id + '&id=' + user_id + '&action=pre-agree'
						})
					}
				} else if (message_type == 'group_apply') {
					that.ws.pageFun(function(){
						that.ws.send({
							c: 'User',
							a: 'joinGroupOption',
							data: {
								id: message_id,
								action: 'agree'
							}
						});
						that.ws.showMsgCallback = function () {
							that.pageDataLoad()
						}
					}, that)
				} else if (message_type == 'group_invitation') {
					that.ws.pageFun(function(){
						that.ws.send({
							c: 'Message',
							a: 'invitationjoinGroupOption',
							data: {
								id: message_id,
								action: 'agree'
							}
						});
						that.ws.showMsgCallback = function () {
							that.pageDataLoad()
						}
					}, that)
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: $--bg-color;
	}

	.message-item {
		display: flex;
		padding: 20rpx;
		align-items: center;
		background-color: $--white;
	}

	.message-avatar {
		height: 120rpx;
		width: 120rpx;
		border-radius: 16rpx;
	}

	.item-info-box {
		width: 60%;
		height: 140rpx;
		padding: 0 0 0 14rpx;
	}

	.message-username {
		font-size: 26rpx;
		font-weight: bold;
		line-height: 50rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: flex;
		align-items: center;
	}
	
	.message-username-invitation {
		font-size: 26rpx;
		font-weight: bold;
		display: block;
		word-wrap: break-word;
		word-break: break-all;
	}
	
	.message-username-invitation view {
		display: inline-block;
	}

	.message-info-item {
		font-size: 28rpx;
		color: $--gray;
		line-height: 42rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.item-right-button {
		margin-left: auto;
	}
	.item-right-text {
		display: block;
		font-size: 26rpx;
		color: $--gray;
	}
	.color-blue {
		color: $--blue;
	}
	.text-hover {
		background-color: $--grey;
	}
</style>
