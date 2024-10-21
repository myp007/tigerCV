<template>
	<view>
		<u-toast ref="uToast" />
		<common :tips='commonTips'></common>
		<view class="user-box">
			<image :src="info.avatar" class="user-avatar" mode="widthFix"></image>
			<view class="user-right">
				<view class="user-right-item user-name">{{info.nickname}}</view>
				<view class="user-right-item">{{info.bio}}</view>
				<view v-if="type == 'user'" :class="'user-status-' + info.status.value" class="user-right-item user-status"> • {{info.status.chinese}}</view>
				<view v-if="type == 'group'" class="user-right-item user-status">{{info.other}}</view>
			</view>
		</view>
		<view class="add-contact-form">
			<u-form :model="form" ref="uForm">
				<u-form-item v-if="info.add_note" :border-bottom="false" label-width="180" label="验证消息">
					<text>{{info.add_note}}</text>
				</u-form-item>
				<u-form-item v-if="showEl.remark" label-position="top" label-width="180" label="设置备注">
					<u-input placeholder="请输入备注名称" type="text" v-model="form.new_contact_remark" />
				</u-form-item>
				<u-form-item v-if="showEl.note" :border-bottom="false" label-position="top" label-width="180" label="验证消息">
					<u-input placeholder="请输入验证消息" type="textarea" v-model="form.new_contact_note" />
				</u-form-item>
				<u-form-item v-if="showEl.tis" :border-bottom="false" label-width="180" label="提示">
					<text>{{showEl.tis}}</text>
				</u-form-item>
			</u-form>
		</view>
		
		<view class="user-buttons">
			<u-button :loading="submitButtonStatus" :disabled="submitButtonStatus" @click="submit(item.action, item.type, item.opt, info.id)" v-for="(item,index) in buttons" :key="index" :type="item.btype">{{item.title}}</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: 0,
				type: '',
				form: {
					new_contact_note: '',
					new_contact_remark: ''
				},
				showEl: {
					remark: true,
					note: true,
					tis: false
				},
				buttons: [],
				info: {
					status: {
						value: 0,
						chinese: '加载中'
					}
				},
				submitButtonStatus: false,
				commonTips: ''
			}
		},
		onLoad:function(query){
			var that = this
			that.id = query.id ? query.id:0
			that.type = query.type ? query.type:'user'
			uni.setNavigationBarTitle({
			    title: (that.type == 'user') ? '添加好友':'加入群聊'
			});
			
			that.ws.pageFun(function () {
				let message = {
					c: 'User',
					a: 'createNewContact',
					data: {
						'id': that.id,
						'type': (that.type == 'user') ? 'friends':'group',
						'message_id': query.message_id ? query.message_id:0,
						'method': 'get',
						'action': query.action ? query.action:'getinfo'
					}
				}
				that.ws.send(message);
			}, that)
		},
		onShow() {
			this.ws.checkNetwork(this)
		},
		methods: {
			submit: function (action, type, opt, id) {
				var that = this
				if (action == 'open-session') {
					that.ws.pageFun(function(){
						let message = { c: 'Message', a: 'openSession', data: { 'id': that.id, 'type': type } }
						that.ws.send(message);
					}, that)
				} else if (action == 'submit-new-contact-form') {
					if (opt == 'apply') {
						that.submitButtonStatus = true
						that.form.id = id
						that.form.type = (type == 'user') ? 'friends':'group'
						that.form.action = opt
						that.form.method = 'post'
						that.ws.pageFun(function(){
							var message = { c: 'User', a: 'createNewContact', data: that.form }
							that.ws.send(message);
							that.ws.showMsgCallback = function () {
								that.submitButtonStatus = false
								setTimeout(function(){
									uni.navigateBack({
										delta: 1
									})
								}, 2000)
							}
						}, that)
					} else if (opt == 'agree-friends') {
						that.ws.pageFun(function(){
							that.ws.send({
								c: 'User',
								a: 'newFriendsOption',
								data: {
									'id': that.info.id,
									'action': 'agree',
									'data': that.form
								}
							});
							that.ws.showMsgCallback = function () {
								that.ws.pageRefresh.addContact = true
								that.ws.pageRefresh.noticeSessionInfo = true
								setTimeout(function(){
									uni.navigateBack({
										delta: 1
									})
								}, 2000)
							}
						}, that)
					}
				}
			},
		}
	}
</script>

<style lang="scss">
page {
	background-color: $--bg-color;
}
.user-box {
	display: flex;
	padding: 20rpx 4vw;
	align-items: center;
}
.user-avatar {
	height: 170rpx;
	width: 170rpx;
}
.user-right {
	width: 76%;
	padding-left: 20rpx;
}
.user-right-item {
	display: block;
	line-height: 32rpx;
}
.user-name {
	line-height: 46rpx;
	font-size: 30rpx;
	overflow: hidden;
	text-overflow:ellipsis;
	white-space: nowrap;
}
.user-status {
	color: $--gray;
	line-height: 46rpx;
}
.add-contact-form {
	width: 92vw;
	background: $--white;
	margin: 0 auto;
	padding: 0 20rpx;
	overflow:hidden;
}
.add-contact-form-button {
	display: block;
	width: 300rpx;
	margin: 60rpx auto;
}
.user-buttons {
	padding: 40rpx 0;
	display: flex;
	align-items: center;
	justify-content: space-around;
}
</style>
