<template>
	<view>
		<u-toast ref="uToast" />
		<common :tips='commonTips'></common>
		<view class="users">
			<view class="user-item">
				<view class="user-info">
					<text class="head">昵称</text>
				</view>
				<view class="createtime">{{createtimeText}}</view>
			</view>
			<view v-for="(item, index) in users" :key="index" class="user-item user-item-box">
				<view class="user-info">
					<image class="avatar" :src="item.avatar" mode="widthFix"></image>
					<text class="nickname">{{item.nickname}}</text>
				</view>
				<view class="createtime">{{item.createtime}}</view>
			</view>
		</view>
		<view class="im-data-none" v-if="loadStatus">{{loadStatus}}</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: 0,
				name: '',
				createtimeText: '',
				users: [],
				loadStatus: '',
				commonTips: ''
			}
		},
		onLoad(query) {
			var that = this
			that.id = query.id
			that.name = query.name
			if (this.name == 'receipted-number') {
				uni.setNavigationBarTitle({
				    title: '已确认用户列表'
				});
				that.createtimeText = '确认时间'
			} else {
				uni.setNavigationBarTitle({
				    title: '已阅读用户列表'
				});
				that.createtimeText = '阅读时间'
			}
			that.ws.pageFun(that.pageDataLoad, that);
		},
		onShow() {
			this.ws.checkNetwork(this)
		},
		onPullDownRefresh: function () {
			this.ws.pageFun(this.pageDataLoad(1, true), this);
			this.ws.onMessageCallBack.set('group-notice-users', (msg) => {
				if (parseInt(msg.data.data.id) == parseInt(this.id) && msg.data.data.refresh) {
					this.$refs.uToast.show({
						title: '刷新成功~',
						type: 'success'
					})
					uni.stopPullDownRefresh()
				}
			})
		},
		onReachBottom: function () {
			if (this.loadGroupNoticeUsers) {
				this.pageDataLoad(parseInt(this.loadGroupNoticeUsers.page)+1)
			}
		},
		methods: {
			pageDataLoad: function(page = 1, refresh = false) {
				var that = this
				that.ws.send({
					c: 'Message',
					a: 'groupChatNoticeOpt',
					data: {
						'id': that.id,
						'method': that.name,
						'page': page,
						'type': 'get-users',
						'refresh': refresh
					}
				});
			},
		}
	}
</script>

<style>
page {
	background: #F8F8F8;
}
.users {
	display: block;
	width: 94%;
	margin: 0 auto;
}
.head {
	margin-left: 40rpx;
}
.user-item {
	display: flex;
	align-items: center;
	justify-content: center;
}
.user-item-box {
	margin-top: 10rpx;
	padding: 10rpx;
	padding-right: 0;
}
.user-info {
	display: flex;
	align-items: center;
	flex: 8;
}
.createtime {
	flex: 4;
	text-align: center;
}
.avatar {
	height: 60rpx;
	width: 60rpx;
}
.nickname {
	margin-left: 6rpx;
}
</style>
