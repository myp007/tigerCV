<template>
	<view>
		<u-toast ref="uToast" />
		<common :tips='commonTips'></common>
		<view class="search-box">
				<u-search @search="search()" @custom="search()"  actionText="Search" v-model="keywords" class="search-box-u-search" shape="square" placeholder="Search is actually very simple" :clearabled="true" :animation="true" ></u-search>
			<!-- <u-search @search="search()" @custom="search()"   actionText="Search" v-model="keywords" class="search-box-u-search" shape="square" placeholder="Search is actually very simple" :clearabled="true" :animation="true"></u-search> -->
		</view>
		<view class="search-res">
			<view v-if="friends.length > 0" class="search-res-title">Friends</view>
			<navigator :url="'/pages/center/info?id=' + item.id" v-for="(item,index) in friends" :key="index" v-if="index <= (showAll.friends ? 999:4)" hover-class="search-res-item-hover" class="search-res-item">
				<image class="search-res-avatar " :src="item.avatar" mode="widthFix"></image>
				<view class="search-res-info-right">
					<view class="search-res-info-item search-res-info-name">{{item.nickname}}</view>
					<view class="search-res-info-item">From Grouping:{{item.groupname}}</view>
				</view>
			</navigator>
			<view @click="loadResMore('friends')" v-if="friends.length > 5 && !showAll.friends" class="search-res-loadmore">
				<view>Show All</view>
				<u-icon name="arrow-right"></u-icon>
			</view>
			
		<!-- 	<view v-if="group_chat.length > 0" class="search-res-title">Group chat</view> -->
			<navigator 
			:url="'/pages/session-info/session-info?id=' + item.session_id + '&talent_id='+item.talent_id+
			'&apply_id='+item.apply_id+'&resume_id='+item.rid+
			'&jobname='+item.jobname+'&companyname='+item.companyname"
			 v-for="(item,index) in group_chat" :key="index" v-if="index <= (showAll.group_chat ? 999:4)" hover-class="search-res-item-hover" class="search-res-item">
		  <!--  <view v-for="(item,index) in group_chat" :key="index" v-if="index <= (showAll.group_chat ? 999:4)" hover-class="search-res-item-hover" class="search-res-item"> -->
		      	
		
				<image class="search-res-avatar " :src="item.avatar" mode="widthFix"></image>
				<view class="search-res-info-right">
					<view class="search-res-info-item search-res-info-name">{{item.nickname}}</view>
					<view class="search-res-info-item">From Grouping:{{item.groupname}}</view>
				</view>
			<!-- </view> -->
			</navigator>
			<view @click="loadResMore('group_chat')" v-if="group_chat.length > 5 && !showAll.group_chat" class="search-res-loadmore">
				<view>Show All</view>
				<u-icon name="arrow-right"></u-icon>
			</view>
			
			<view v-if="lately_session.length > 0" class="search-res-title">Recent Sessions</view>
			<!-- <view @click="goToSessionInfo(item.sessionInfo.id, item.sessionInfo.type, item.sessionInfo.chat_id)" v-for="(item,index) in lately_session" :key="index" v-if="index <= (showAll.lately_session ? 999:4)" hover-class="search-res-item-hover" class="search-res-item"> -->
				<view @click="" v-for="(item,index) in lately_session" :key="index" v-if="index <= (showAll.lately_session ? 999:4)" hover-class="search-res-item-hover" class="search-res-item">
				<image class="search-res-avatar " :src="item.avatar" mode="widthFix"></image>
				<view class="search-res-info-right">
					<view class="search-res-info-item search-res-info-name">{{item.nickname}}</view>
					<view class="search-res-info-item">{{item.last_time}}</view>
				</view>
			</view>
			<view @click="loadResMore('lately_session')" v-if="lately_session.length > 5 && !showAll.lately_session" class="search-res-loadmore">
				<view>Show All</view>
				<u-icon name="arrow-right"></u-icon>
			</view>
			
			<view class="im-none-data" v-if="!friends.length && !group_chat.length && !lately_session.length">No search results~</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				keywords: '',
				friends: [],
				group_chat: [],
				lately_session: [],
				showAll: {
					friends: false,
					group_chat: false,
					lately_session: false
				},
				commonTips: ''
			}
		},
		onLoad:function(query){
			this.keywords = query.keywords ? query.keywords:''
			this.ws.pageFun(this.pageDataLoad, this);
		},
		onShow() {
			this.ws.checkNetwork(this)
		},
		methods: {
			loadResMore: function (name) {
				this.showAll[name] = true
			},
			pageDataLoad: function () {
				this.ws.send({
					c: 'User',
					a: 'search',
					data: {
						'keyword': this.keywords,
						'method': 'friends|lately-session|group-chat',
						'type': 'all'
					}
				})
			},
			search: function() {
                
				this.ws.pageFun(this.pageDataLoad, this);
			},
			goToSessionInfo: function(id, type, chat_id) {
				var url = '/pages/session-info/session-info?id=' + id
				if (type == 'service') {
					if (chat_id != 3) {
						url = '/pages/session-info/notice-session-info?session_id=' + id
					}
				}
				uni.navigateTo({
					url: url
				})
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
}
.search-box .search-box-u-search {
	flex: 1;
	
}
::v-deep .u-search__action--active{
		width: 50px !important;
}
.search-res-title {
	display: block;
	width: 92vw;
	margin: 0 auto;
	padding: 10rpx 0;
	border-bottom: 1px solid #EBEBEB;
}
.search-res-item {
	padding: 24rpx 4%;
	display: flex;
	align-items: center;
	overflow: hidden;
}
.search-res-item-hover {
	background-color: #EBEBEB;
}
.search-res-avatar {
	height: 100rpx;
	width: 100rpx;
	border-radius: 50%;
}
.search-res-info-right {
	padding-left: 20rpx;
	flex: 1;
	overflow: hidden;
}
.search-res-info-item {
	width: 100%;
	font-size: 30rpx;
	height: 48rpx;
	line-height: 48rpx;
	justify-content: space-between;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	color: #999999;
}
.search-res-info-name {
	font-size: 32rpx;
	color: #181818;
}
.search-res-loadmore {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 80rpx;
}
.search-res-loadmore view {
	padding-right: 10rpx;
}
.im-none-data {
	height: 100rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
