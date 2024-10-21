<template>
	<view>
		<u-toast ref="uToast" />
		<common :tips='commonTips'></common>
		<u-modal :show="delModelShow" :mask-close-able="true" :show-cancel-button="true" cancelText="cancel" confirmText="confirm" @cancel="delModelShow = false" @confirm="delConfirm" :content="delModelContent"></u-modal>
		<u-form :model="info" ref="uForm">
			<u-cell-group>
				<view @click="goToUserInfo()">
					<u-cell :title="info.sessionUser.nickname">
						<image class="user-avatar" slot="icon" :src="info.sessionUser.avatar" mode="aspectFill"></image>
					</u-cell>
				</view>
				<navigator v-if="info.type == 'single' && info.friend" :url="'/pages/pick-user/pick-user?action=create-group&preselection=' + info.sessionUser.id">
					<u-cell title="Create group chat" :arrow="false">
						<view class="greate-group-chat" slot="icon">
							<u-icon name="plus"></u-icon>
						</view>
					</u-cell>
				</navigator>
			</u-cell-group>

			<view v-if="info.type == 'group'" class="u-m-t-20 fff-bg-item">
				<navigator :url="'/pages/center/group_chat_notice?group_id=' + info.sessionUser.id + '&session_id=' + id">
					<u-cell title="Group Announcement" :value="info.notice"></u-cell>
				</navigator>
				<navigator :url="'/pages/center/group_chat_users?id=' + info.sessionUser.id">
					<u-cell title="Group chat members" :value="info.sessionUser.user_count + 'people'"></u-cell>
				</navigator>
				<view class="group-chat-users">
					<navigator :url="'/pages/center/info?type=user&id=' + item.id" v-for="(item,index) in groupChatMember" :key="index" class="chat-user-item">
						<image class="chat-user-avatar" :src="item.avatar"></image>
						<view class="chat-user-nickname">{{item.nickname ? item.nickname:item.nickname_origin}}</view>
					</navigator>
					<view @click="invitation" class="chat-user-item">
						<view class="chat-user-avatar-plus" slot="icon">
							<u-icon name="plus"></u-icon>
						</view>
						<view class="chat-user-nickname">invitation</view>
					</view>
				</view>
			</view>

			<view class="u-m-t-20 form-item">
				<u-form-item label="Set as top" label-width="160">
					<u-switch slot="right" @change="infoSwitchChange('top')" v-model="info.top"></u-switch>
				</u-form-item>
				<u-form-item v-if="info.type == 'single'" label="Top contacts" label-width="160">
					<u-switch slot="right" @change="infoSwitchChange('top_contacts')" v-model="info.top_contacts"></u-switch>
				</u-form-item>
				<u-form-item v-if="info.type == 'group'" label="Don't disturb me" label-width="160">
					<u-switch slot="right" @change="infoSwitchChange('block_messages')" v-model="info.block_messages"></u-switch>
				</u-form-item>
				<u-form-item v-if="info.type == 'single'" label="Mask session" label-width="160">
					<u-switch slot="right" @change="infoSwitchChange('shield')" v-model="info.shield"></u-switch>
				</u-form-item>

				<u-form-item v-if="info.type == 'group'" label="My group chat notes" label-width="260">
					<view slot="right">
						<u-input @blur="saveRemark" placeholder="Please enter comments" :clearable="false" input-align="right"
							type="text" v-model="info.nickname" :border="false" />
					</view>
				</u-form-item>
			</view>

			<view v-if="info.type == 'single'" @click="friendButton" class="u-m-t-20 fff-bg-item color-red">
				<view class="form-button">{{info.friend ? 'Delete friends':'Add as friend'}}</view>
			</view>
			<view v-if="info.type == 'group'" @click="groupButton('exit')" class="u-m-t-20 fff-bg-item color-red">
				<view class="form-button">{{info.isLeader ? 'Dismiss group chat':'Quit group chat'}}</view>
			</view>
			<view v-if="info.type == 'group' || info.type == 'single'" @click="report" class="u-m-t-20 fff-bg-item color-yellow">
				<view class="form-button">report</view>
			</view>
			<view v-if="info.type == 'service'" @click="delSession" class="u-m-t-20 fff-bg-item color-red">
				<view class="form-button">Remove Session</view>
			</view>
		</u-form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: 0,
				info: {
					sessionUser: {
						nickname: 'loading...'
					}
				},
				groupChatMember: [],
				delModelShow: false,
				delModelContent: '',
				commonTips: ''
			}
		},
		onLoad: function(query) {
			this.id = query.id ? query.id : 0
			this.ws.pageFun(this.pageDataLoad, this);
		},
		onShow:function(){
			this.ws.checkNetwork(this)
			if (this.ws.invitationGroupmemberSelected) {
				this.ws.pageFun(res => {
					this.ws.send({
						c: 'Message',
						a: 'invitationGroupmember',
						data: {
							pickuser: this.ws.invitationGroupmemberSelected,
							id: this.info.sessionUser.id
						}
					})
				}, this)
				this.ws.invitationGroupmemberSelected = null
			}
			
			if (this.ws.pageRefresh.chatSetting) {
				this.ws.pageFun(this.pageDataLoad, this);
				this.ws.pageRefresh.chatSetting = false
			}
		},
		methods: {
			pageDataLoad: function() {
				var that = this
				let message = {
					c: 'User',
					a: 'sessionSetting',
					data: {
						'session_id': that.id
					}
				}
				that.ws.send(message);
			},
			friendButton() {
				var that = this
				if (that.info.type == 'single' && that.info.friend) {
					that.delContact('user')
				} else {
					uni.navigateTo({
						url: '/pages/search/add-contact?id=' + that.info.sessionUser.id + '&type=user'
					})
				}
			},
			groupButton: function (type) {
				if (type == 'exit') {
					this.delContact('group')
				}
			},
			delContact: function (type) {
				if (type == 'user') {
					this.delModelContent = 'Are you sure you want to delete this friend?';
				} else if (type == 'group') {
					if (this.info.isLeader) {
						this.delModelContent = 'Are you sure you want to dismiss group chat?';
					} else {
						this.delModelContent = 'Are you sure you want to quit group chat?';
					}
				}
				this.delModelShow = true
			},
			delConfirm () {
				var that = this
				if (that.info.type == 'service') {
					// 移除会话
					that.ws.pageFun(function(){
						that.ws.send({
							c: 'User',
							a: 'sessionOperation',
							data: {
								action: "session-remove",
								id: that.info.id,
								source: 'uni-app'
							}
						});
					}, that)
					return ;
				}
				that.ws.pageFun(function(){
					let message = {
						c: 'User',
						a: 'delContact',
						data: {
							'id': that.info.sessionUser.id,
							'type': (that.info.type == 'single') ? 'user':'group'
						}
					}
					that.ws.send(message);
					that.ws.showMsgCallback = function(){
						that.ws.pageRefresh.message = true
						that.ws.pageRefresh.addressList = true
						setTimeout(function(){
							uni.switchTab({
								url: '/pages/message/message'
							})
						}, 2000)
					}
				}, that)
			},
			report: function () {
				uni.navigateTo({
					url: '/pages/center/report?title=report&type=user&id=' + this.id
				})
			},
			infoSwitchChange: function (name) {
				var that = this
				if (name == 'top') {
					that.ws.pageFun(function(){
						that.ws.send({
							c: 'User',
							a: 'sessionOperation',
							data: {
								id: that.id,
								action: 'session-top',
								source: 'uni-app'
							}
						})
					}, that)
				} else if (name == 'top_contacts') {
					that.ws.pageFun(function(){
						var new_group = 'common'
						if (that.info.sessionUser.group == 'common') {
							new_group = 'all_friends'
						}
						that.ws.send({
							c: 'User',
							a: 'updateFriendInfo',
							data: {
								id: that.info.sessionUser.id,
								new_group: new_group,
								method: 'update_group',
								source: 'uni-app'
							}
						});
						that.info.top_contacts = (new_group == 'common') ? true:false;
					}, that)
				} else if (name == 'shield') {
					that.ws.pageFun(function(){
						that.ws.send({
							c: 'User',
							a: 'shieldSession',
							data: {
								session_id: that.id,
								method: that.info.shield ? 'shield':'relieve'
							}
						})
					}, that)
				} else if (name == 'block_messages') {
					that.ws.pageFun(function(){
						that.ws.send({
							c: 'User',
							a: 'sessionOperation',
							data: {
								id: that.id,
								action: 'session-block-groupmessage',
								source: 'uni-app'
							}
						})
					}, that)
				}
			},
			saveRemark: function(val) {
				var that = this
				if (val != that.info.oldnickname) {
					that.ws.send({
						c: 'Message',
						a: 'groupChatMember',
						data: {
							id: that.info.sessionUser.id,
							new_nickname: val,
							method: 'save-groupmember-nickname'
						}
					});
				}
			},
			invitation: function () {
				uni.navigateTo({
					url: '/pages/pick-user/pick-user?action=invitation-groupmember'
				})
			},
			goToUserInfo: function () {
				var url = '/pages/center/info?type=' + (this.info.type == 'single' ? 'user':this.info.type) + '&id=' + this.info.sessionUser.id
				uni.navigateTo({
					url: url
				})
			},
			delSession: function () {
				this.delModelContent = 'Are you sure you want to remove this session?';
				this.delModelShow = true
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: $--bg-color;
	}

	.user-avatar {
		height: 100rpx;
		width: 100rpx;
		margin-right: 20rpx;
		border-radius: 16rpx;
	}

	.form-item {
		background: $--white;
		padding: 0 6vw;
	}

	.fff-bg-item {
		background: $--white;
	}

	.form-button {
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 30rpx;
	}

	.greate-group-chat {
		display: flex;
		align-items: center;
		justify-content: center;
		background: $--grey;
		height: 100rpx;
		width: 100rpx;
		margin-right: 20rpx;
		border-radius: 16rpx;
	}

	.color-blue {
		color: $--blue;
	}

	.color-red {
		color: $--red;
	}
	
	.color-yellow {
		/* color: $u-type-warning; */
	}

	.group-chat-users {
		padding-left: 20rpx;
		padding-bottom: 10rpx;
		display: flex;
		flex-wrap: wrap;
		width: 100vw;
	}

	.chat-user-item {
		width: 120rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		margin-top: 20rpx;
	}

	.chat-user-item .chat-user-avatar {
		height: 100rpx;
		width: 100rpx;
		border-radius: 16rpx;
	}

	.chat-user-avatar-plus {
		height: 100rpx;
		width: 100rpx;
		border-radius: 16rpx;
		background: #F4F5F6;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.chat-user-nickname {
		font-size: 26rpx;
		padding-top: 10rpx;
		width: 100rpx;
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-align: center;
	}
</style>
