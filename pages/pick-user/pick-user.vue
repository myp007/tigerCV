<template>
	<view>
		<u-toast ref="uToast" />
		<common :tips='commonTips'></common>
		<!-- 顶部搜索栏-start -->
		<view class="search-box">
			<u-search @search="search()" v-model="keywords" @custom="search()" class="search-box-u-search"
				shape="square" placeholder="Search is actually very simple" :clearabled="true" :show-action="false"></u-search>
			<view @click="searchButton" class="search-button">{{showSearchPopup ? 'close':'search'}}</view>
		</view>
		<!-- 顶部搜索栏-end -->

		<!-- 联系人-start -->
		<u-checkbox-group v-if="!showSearchPopup" v-model="userIds">
			<u-index-list :scrollTop="scrollTop" :indexList="indexList">
				<view v-for="(item, index) in indexList" :key="index">
					<u-index-anchor :text="item"></u-index-anchor>
					<view v-for="(friend,friendIdx) in friends[item]" :key="friendIdx" class="address-item">
						<u-checkbox shape="circle" v-model="friend.checked" :name="friend.friend_id"></u-checkbox>
						<view class="address-checkbox">
							<image class="address-avatar" :src="friend.avatar" mode="widthFix"></image>
							<view class="address-info">{{friend.nickname}}</view>
						</view>
					</view>
				</view>
			</u-index-list>
		</u-checkbox-group>
		<!-- 联系人-end -->

		<u-checkbox-group v-if="showSearchPopup">
			<view v-for="(friend, friendIdx) in searchRes" :key="friendIdx" class="address-item">
				<u-checkbox @change="searchFriendChange" shape="circle" v-model="friend.checked" :name="friend.id">
					<view class="address-checkbox">
						<image class="address-avatar" :src="friend.avatar" mode="widthFix"></image>
						<view class="address-info">{{friend.nickname}}</view>
					</view>
				</u-checkbox>
			</view>
		</u-checkbox-group>

		<view class="footer-box"></view>

		<view class="pick-done">
			<u-button @click="pickDone" type="primary">Submit</u-button>
		</view>
	</view>
</template>

<script>
	var sessionId = 0
	export default {
		data() {
			return {
				action: '',
				keywords: '',
				scrollTop: 0,
				indexList: [],
				friends: [],
				searchRes: [],
				showSearchPopup: false,
				preselection: 0,
				messageId: 0,
				forwardType: '',
				commonTips: '',
				userIds: []
			}
		},
		onLoad(query) {
			var that = this
			that.action = query.action ? query.action : ''
			that.preselection = query.preselection ? query.preselection:0
			that.messageId = query.message_id ? query.message_id:0
			that.forwardType = query.forward_type ? query.forward_type:'message'
			sessionId = query.sessionId ? query.sessionId:0

			var title = 'Select friends'
			switch (that.action) {
				case 'create-group':
					title = 'Select friends to create group chat'
					break;
				case 'invitation-groupmember':
					title = 'Invite friends to join the group chat'
					break;
				case 'message-forward':
					title = 'Select friends to forward messages'
					break;
			}
			
			uni.setNavigationBarTitle({
				title: title
			});
			this.ws.pageFun(this.pageDataLoad, this);
		},
		onShow() {
			this.ws.checkNetwork(this)
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		methods: {
			searchButton: function() {
				if (this.showSearchPopup) {
					this.showSearchPopup = false
				} else {
					this.search()
				}
			},
			pageDataLoad: function() {
				this.ws.send({
					c: 'User',
					a: 'loadContact',
					data: {
						'method': 'all-friend'
					}
				})
			},
			search: function() {
				var that = this
				if (!that.keywords) {
					that.showSearchPopup = false
					return;
				}
				that.ws.pageFun(function() {
					that.ws.send({
						c: 'User',
						a: 'search',
						data: {
							'keyword': that.keywords,
							'method': 'friends',
							'type': 'pick-user'
						}
					})
				}, that)
			},
			searchFriendChange(e) {
				for (let i in this.friends) {
					for (let y in this.friends[i]) {
						if (this.friends[i][y].friend_id == e.name) {
							this.friends[i][y].checked = e.value
						}
					}
				}
			},
			pickDone: function() {
				var that = this, userIdStr = ''
				// for (var i in that.friends) {
				// 	for (let y in that.friends[i]) {
				// 		if (that.friends[i][y].checked) {
				// 			userIdStr += that.friends[i][y].friend_id + ','
				// 		}
				// 	}
				// }
				userIdStr = this.userIds.join(',')
				if (!userIdStr) {
					that.$refs.uToast.show({
						title: '请选择好友~',
						type: 'error'
					})
					return false;
				}
				
				if (that.action == 'create-group') {
					uni.navigateTo({
						url: '/pages/center/edit-info?type=create-group&ids=' + userIdStr
					})
				} else if (that.action == 'invitation-groupmember') {
					that.ws.invitationGroupmemberSelected = userIdStr
					uni.navigateBack({
						delta: 1
					})
				} else if (that.action == 'message-forward') {
					if (!that.messageId) {
						that.$refs.uToast.show({
							title: '要转发的消息找不到啦,请重试~',
							type: 'error'
						})
						return false;
					}
					
					that.ws.pageFun(function(){
						that.ws.send({
							c: 'Message',
							a: 'forward',
							data: {
								pickuser: userIdStr,
								message_ids: that.messageId,
								type: that.forwardType,
								session_id: sessionId
							}
						})
					}, that)
				}
			}
		}
	}
</script>

<style>
	page {
		background: #FFFFFF;
	}
	.search-box {
		display: flex;
		align-items: center;
		padding: 20rpx 4vw;
		background: #FFFFFF;
	}

	.search-box .search-box-u-search {
		flex: 1;
	}

	.search-button {
		font-size: 30rpx;
		padding-left: 30rpx;
	}

	.address-item {
		height: 120rpx;
		display: flex;
		align-items: center;
		padding: 0rpx 4vw;
	}

	.address-checkbox {
		display: flex;
		align-items: center;
		width: 620rpx;
		padding-left: 10rpx;
	}

	.address-avatar {
		height: 80rpx;
		width: 80rpx;
		border-radius: 16rpx;
	}

	.address-info {
		height: 120rpx;
		line-height: 120rpx;
		margin-left: 20rpx;
		font-size: 32rpx;
	}

	.footer-box {
		display: block;
		height: 140rpx;
		width: 100vw;
	}

	.pick-done {
		display: flex;
		align-items: center;
		justify-content: center;
		background: #F2F3F4;
		position: fixed;
		bottom: 0;
		width: 100vw;
		padding: 20rpx;
	}

	.pick-done button {
		display: block;
		width: 300rpx;
	}
	.u-button{
		line-height: 40px;
	}
</style>
