<template>
	<view>
		<u-toast ref="uToast" />
		<common :tips='commonTips'></common>
		<u-overlay z-index="1000" :custom-style="{background: 'rgba(0, 0, 0, 0.1)'}" :show="maskShow" @click="maskClick"></u-overlay>
		<!-- 顶部搜索栏-start -->
		<view class="search">
			<view class="search-box">
				<u-search @search="search()" @custom="search()" v-model="keywords" class="search-box-u-search" shape="square" placeholder="Search is actually very simple" :clearabled="true" :show-action="false"></u-search>
				<view @click="toggleMessageMenu" class="message-menu">
					<u-icon class="message-menu-icon" name="plus" :class="messageMenu.show ? 'im-bg-grey':''" color="#3f3f3f" size="24"></u-icon>
					<view v-if="messageMenu.show" :style="{top: messageMenu.top, left: messageMenu.left}" class="message-menu-box popup-menu">
						<navigator class="popup-menu-item" url="/pages/search/new-contact" open-type="navigate">Add friends/groups</navigator>
						<navigator url="/pages/pick-user/pick-user?action=create-group" open-type="navigate">
							<view class="popup-menu-item">Create group chat</view>
						</navigator>
					</view>
				</view>
			</view>
		</view>
		<!-- 顶部搜索栏-end -->
		<!-- 联系人-start -->
		<view class="address-list">
			<navigator class="address-item" url="/pages/session-info/notice-session-info?service_id=1">
				<image class="address-avatar" src="../../static/img/new_friends.png" mode="widthFix"></image>
				<view class="address-info">New friends</view>
			</navigator>
			<navigator class="address-item" url="/pages/address-list/top-contacts">
				<image class="address-avatar" src="../../static/img/top-contacts.png" mode="widthFix"></image>
				<view class="address-info">Top contacts</view>
			</navigator>
			<navigator class="address-item" url="/pages/address-list/group-chat">
				<image class="address-avatar" src="../../static/img/group.png" mode="widthFix"></image>
				<view class="address-info">Group chat</view>
			</navigator>
		</view>
		<u-index-list :scrollTop="scrollTop" :indexList="indexList">
			<view v-for="(item, index) in indexList" :key="index">
				<u-index-anchor :text="item" />
				<navigator :url="'/pages/center/info?id=' + friend.friend_id" v-for="(friend,friendIdx) in friends[item]" :key="friendIdx" class="address-item">
					<image class="address-avatar" :src="friend.avatar" mode="widthFix"></image>
					<view class="address-info">{{friend.nickname}}</view>
				</navigator>
			</view>
		</u-index-list>
		<!-- 联系人-end -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				keywords: '',
				maskShow: false,
				messageMenu: {
					show: false
				},
				scrollTop: 0,
				indexList: [],
				friends: [],
				commonTips: ''
			}
		},
		onLoad() {
			this.ws.pageFun(this.pageDataLoad, this);
		},
		onShow:function(){
			this.ws.checkNetwork(this)
			if(this.ws.pageRefresh.addressList) {
				// 被其他页面通知刷新此页
				this.ws.pageFun(this.pageDataLoad, this);
				this.ws.pageRefresh.addressList = false
				return ;
			}
		},
		onPullDownRefresh: function () {
			this.ws.pageFun(this.pageDataLoad(true), this);
			this.ws.onMessageCallBack.set('load_contact', (msg) => {
				if (msg.data.data.method == 'all-friend' && msg.data.data.refresh) {
					this.$refs.uToast.show({
						title: 'Refresh succeeded~',
						type: 'success'
					})
					uni.stopPullDownRefresh()
				}
			})
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		methods: {
			pageDataLoad: function (refresh = false) {
				this.ws.send({
					c: 'User',
					a: 'loadContact',
					data: {
						'method': 'all-friend',
						'refresh': refresh
					}
				})
			},
			maskClick: function() {
				this.messageMenu.show && this.toggleMessageMenu()
			},
			toggleMessageMenu: function(e) {
				var that = this
				if (that.messageMenu.show) {
					that.maskShow = false
					that.messageMenu.show = false
					return ;
				}
				that.messageMenu = {
					show: true,
					top: (e.detail.y + 14) + 'px',
					left: (e.detail.x - 120) + 'px'
				}
				that.maskShow = true
			},
			search: function() {
				if (!this.keywords) {
					this.$refs.uToast.show({
						title: 'Please enter keywords~',
						type: 'error'
					})
					return ;
				}
				uni.navigateTo({
					url: '/pages/search/search?keywords=' + this.keywords,
					success: () => {
						this.keywords = ''
					}
				})
			}
		}
	}
</script>

<style lang="scss">
page {
	background: #FFFFFF;
}
.search {
	display: flex;
	align-items: center;
	justify-content: center;
	background: #FFFFFF;
}
.search-box {
	display: flex;
	align-items: center;
	padding: 20rpx 0 10rpx 0;
}
.search-box .search-box-u-search {
	width: 616rpx;
}
.search-box .message-menu {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-left: 20rpx;
}
.message-menu .message-menu-icon {
	padding: 6rpx;
	z-index: 1001;
	border-radius: 4px;
}
.message-menu-box {
	position: absolute;
	background: $--white;
	box-shadow: 0 0 20rpx rgba(0, 0, 0, .1);
	border-radius: 4px;
	padding: 10rpx 20rpx;
	z-index: 1001;
}
.popup-menu .popup-menu-item {
	padding: 20rpx 50rpx;
	text-align: center;
	border-bottom: 1px solid #F3F4F6;
}
.popup-menu .popup-menu-item:last-child {
	border: none;
}
.address-item {
	height: 120rpx;
	display: flex;
	align-items: center;
	padding: 0rpx 4%;
}
.address-avatar {
	height: 80rpx;
	width: 80rpx;
	border-radius: 16rpx;
}
.address-info {
	flex: 1;
	height: 120rpx;
	line-height: 120rpx;
	margin-left: 20rpx;
	font-size: 32rpx;
	border-bottom: 1px solid rgba(241, 241, 241, 0.6);
}
.im-bg-grey {
	background-color: $--grey;
	color: $--white;
}
</style>
