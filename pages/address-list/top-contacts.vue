<template>
	<view>
		<common :tips='commonTips'></common>
		<view class="search-box">
			<u-search @search="search()" @custom="search()" v-model="keywords" class="search-box-u-search" shape="square" placeholder="搜索其实很简单" :clearabled="true" :animation="true"></u-search>
		</view>
		<u-toast ref="uToast" />
		<view class="address-list">
			<u-index-list :scrollTop="scrollTop" :indexList="indexList">
				<view v-for="(item, index) in indexList" :key="index">
					<u-index-anchor :index="item" />
					<navigator :url="'/pages/center/info?id=' + friend.friend_id" v-for="(friend,friendIdx) in friends[item]" :key="friendIdx" class="address-item">
						<image class="address-avatar" :src="friend.avatar" mode="widthFix"></image>
						<view class="address-info">{{friend.nickname}}</view>
					</navigator>
				</view>
			</u-index-list>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				scrollTop: 0,
				indexList: [],
				friends: [],
				keywords: '',
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
				return ;
			}
		},
		onPullDownRefresh: function () {
			this.ws.pageFun(this.pageDataLoad(true), this);
			this.ws.onMessageCallBack.set('load_contact', (msg) => {
				if(msg.data.data.method == 'top-friend' && msg.data.data.refresh) {
					this.$refs.uToast.show({
						title: '刷新成功~',
						type: 'success'
					})
					uni.stopPullDownRefresh()
				}
			})
		},
		methods: {
			pageDataLoad: function (refresh = false) {
				this.ws.send({
					c: 'User',
					a: 'loadContact',
					data: {
						'method': 'top-friend',
						'refresh': refresh
					}
				})
			},
			onPageScroll(e) {
				this.scrollTop = e.scrollTop;
			},
			search: function () {
				uni.navigateTo({
					url: '/pages/search/search?keywords=' + this.keywords
				})
			}
		}
	}
</script>

<style>
.search-box {
	display: flex;
	align-items: center;
	padding: 20rpx 4vw;
	background: #FFFFFF;
}
.search-box .search-box-u-search {
	flex: 1;
}
.address-list {
	background: #FFFFFF;
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
</style>
