<template>
	<view>
		<u-toast ref="uToast" />
		<common :tips='commonTips'></common>
		<u-action-sheet @click="clickLongpressAction" :list="longPressActionList" v-model="longPressActionShow"></u-action-sheet>
		<view class="search-box">
			<u-search bg-color="#ffffff" @search="search()" v-model="keywords" class="search-box-u-search" shape="square" placeholder="搜索其实很简单" :clearabled="true" :show-action="false"></u-search>
			<view @click="search(false)" v-if="showSearchRes" class="search-button">取消</view>
			<view @click="search(true)" v-else class="search-button">搜索</view>
		</view>
		<view v-if="!showSearchRes" class="group-chat-users">
			<navigator :url="'/pages/center/info?id=' + user.id" v-for="(user, userIdx) in leader" :key="userIdx" class="user-item">
				<image class="user-avatar" :src="user.avatar" mode="widthFix"></image>
				<view class="user-info"><u-tag class="leader-tag" text="群主" size="mini" shape="circle" type="warning" />{{user.nickname ? user.nickname_origin + '(' + user.nickname + ')':user.nickname_origin}}</view>
				<u-button v-if="!user.is_friend" @click.stop="addFriend(user.id)" size="mini" class="user-button">加好友</u-button>
			</navigator>
			<u-index-list :scrollTop="scrollTop" :indexList="indexList">
				<view v-for="(item, index) in indexList" :key="index">
					<u-index-anchor :index="item" />
					<navigator @longpress="longpressUser(user.id, user.nickname ? user.nickname_origin + '(' + user.nickname + ')':user.nickname_origin)" :url="'/pages/center/info?id=' + user.id" v-for="(user, userIdx) in users[item]" :key="userIdx" class="user-item">
						<image class="user-avatar" :src="user.avatar" mode="widthFix"></image>
						<view class="user-info">{{user.nickname ? user.nickname_origin + '(' + user.nickname + ')':user.nickname_origin}}</view>
						<u-button v-if="!user.is_friend" @click.stop="addFriend(user.id)" size="mini" class="user-button">加好友</u-button>
					</navigator>
				</view>
			</u-index-list>
		</view>
		<view v-if="showSearchRes" class="search-res">
			<navigator @longpress="longpressUser(user.id, user.nickname ? user.nickname_origin + '(' + user.nickname + ')':user.nickname_origin)" :url="'/pages/center/info?id=' + user.id" v-for="(user, userIdx) in groupChatMember" :key="userIdx" class="user-item">
				<image class="user-avatar" :src="user.avatar" mode="widthFix"></image>
				<view class="user-info">{{user.nickname ? user.nickname_origin + '(' + user.nickname + ')':user.nickname_origin}}</view>
				<u-button v-if="!user.is_friend" @click.stop="addFriend(user.id)" size="mini" class="user-button">加好友</u-button>
			</navigator>
			<view v-if="!groupChatMember.length" class="im-data-none">没有搜索结果~</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: 0,
				keywords: '',
				scrollTop: 0,
				indexList: [],
				users: [],
				leader: [],
				showSearchRes: false,
				groupChatMember: [],
				longPressActionID: 0,
				longPressActionShow: false,
				longPressActionList: [],
				commonTips: ''
			}
		},
		onLoad:function(query){
			this.id = query.id ? query.id:0
			this.ws.pageFun(this.pageDataLoad, this);
		},
		onShow() {
			this.ws.checkNetwork(this)
		},
		onPullDownRefresh: function () {
			this.ws.pageFun(this.pageDataLoad(true), this);
			this.ws.onMessageCallBack.set('group_chat_member', (msg) => {
				if (parseInt(msg.data.data.id) == parseInt(this.id) && msg.data.data.refresh) {
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
				that.ws.send({
					c: 'Message',
					a: 'groupChatMember',
					data: {
						'id': this.id,
						'method': 'get',
						'lettersort': 'lettersort',
						'refresh': refresh
					}
				});
			},
			onPageScroll(e) {
				this.scrollTop = e.scrollTop;
			},
			search: function (show = true) {
				var that = this
				if (!show) {
					that.groupChatMember = []
					that.showSearchRes = false
					return ;
				}
				if (!that.keywords) {
					that.$refs.uToast.show({
						title: '请输入关键词~',
						type: 'error'
					})
					return ;
				}
				that.ws.pageFun(function(){
					that.ws.send({
						c: 'Message',
						a: 'groupChatMember',
						data: {
							'id': that.id,
							'method': 'get',
							'keywords': that.keywords
						}
					})
				}, that)
			},
			addFriend: function (id) {
				uni.navigateTo({
					url: '/pages/search/add-contact?type=user&id=' + id
				})
			},
			longpressUser: function (id, username) {
				this.longPressActionID = id
				this.longPressActionShow = true
				this.longPressActionList = [{
					text: '删除成员',
					color: '#f74c31',
					subText: username
				}]
			},
			clickLongpressAction: function (index) {
				var that = this
				if (index == 0) {
					that.ws.pageFun(function(){
						that.ws.pageRefresh.chatSetting = true
						that.ws.pageRefresh.sessionInfo = true
						that.ws.send({
							c: 'Message',
							a: 'delGroupMember',
							data: {
								'id': that.id,
								'member_id': that.longPressActionID
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
	background: #F8F8F8;
}
.search-box {
	display: flex;
	align-items: center;
	padding: 20rpx 4vw;
}
.search-box .search-box-u-search {
	flex: 1;
}
.search-button {
	padding-left: 30rpx;
}
.user-item {
	display: flex;
	align-items: center;
	background: #FFFFFF;
	height: 100rpx;
	padding: 20rpx;
}
.user-avatar {
	height: 90rpx;
	width: 90rpx;
	margin-right: 20rpx;
	border-radius: 16rpx;
}
.user-info {
	display: flex;
	font-size: 30rpx;
	width: 62%;
	overflow: hidden;
}
.leader-tag {
	margin-right: 10rpx;
}
.user-button {
	margin-left: auto;
	margin-right: 30rpx;
}
</style>
