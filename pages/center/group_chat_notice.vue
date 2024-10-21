<template>
	<view>
		<u-toast ref="uToast" />
		<common :tips='commonTips'></common>
		<u-popup width="600" v-model="showNotice" :closeable="true" mode="center" border-radius="12">
			<view class="group-notice-title">群公告</view>
			<view v-if="noticeInfo" class="group-notice-content">
				<view>
					{{noticeInfo.content}}
				</view>
				<view class="im-group-notice-imgs">
					<image v-for="(img, imgindex) in noticeInfo.images" :key="imgindex" :src="img" mode="widthFix"></image>
				</view>
				<view class="group-notice-footer">
					<text>{{noticeInfo.publisher.nickname}}<text v-if="noticeInfo.publisher.remark">({{noticeInfo.publisher.remark}})</text><text class="footer-createtime">发表于{{noticeInfo.createtime}}</text></text>
					<text class="notice-item-footer-text">{{noticeInfo.reading_number}}人已读</text>
				</view>
				<view class="group-notice-button">
					<u-button v-if="noticeInfo.receipt" :type="noticeInfo.receipted ? 'default':'primary'"  @click="receiptNotice(noticeInfo.id, noticeInfo.receipt, noticeInfo.receipted)">{{noticeInfo.receipted ? '您已确认':'确认收到'}}</u-button>
					<u-button v-if="!noticeInfo.receipt" type="default" @click="showNotice = false;">关闭</u-button>
				</view>
			</view>
		</u-popup>
		<u-action-sheet @click="clickOperation" :list="operationList" v-model="showOperation"></u-action-sheet>
		<view v-if="isLeader" class="add-notice-box">
			<u-button type="primary" class="add-notice" @click="post" size="mini">发布公告</u-button>
		</view>
		<view class="notice-list">
			<view v-for="(item, index) in noticeList" :key="index" class="notice-item">
				<view class="notice-item-content">
					<view @click="openNotice(item.id)">
						<view v-if="item.top" class="blue-tag">置顶</view>
						<view v-if="item.popup" class="blue-tag">弹窗展示</view>
						{{item.content}}
						<view class="im-group-notice-imgs">
							<image v-for="(img, imgindex) in item.images" :key="imgindex" :src="img" mode="widthFix"></image>
						</view>
					</view>
					<view class="notice-item-footer">
						<text>{{item.publisher.nickname}}<text v-if="item.remark">({{item.remark}})</text><text class="footer-createtime">发表于{{item.createtime}}</text></text>
						<text @click="gotoPage(item.id, 'read-number')" class="notice-item-footer-text">{{item.reading_number}}人已读</text>
						<text @click="gotoPage(item.id, 'receipted-number')" v-if="(item.receipt && item.receipted)" class="notice-item-footer-text">{{item.receiptedCount}}人已确认</text>
						<view v-if="item.receipt && !item.receipted && !isLeader" @click="receiptNotice(item.id, item.receipt, item.receipted)" class="notice-item-footer-right">确认收到</view>
						<view v-if="isLeader" @click="operation(item.id)" class="notice-item-footer-right">操作</view>
					</view>
				</view>
			</view>
			<view class="im-data-none" v-if="loadStatus">{{loadStatus}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				group_id: 0,
				session_id: 0,
				noticeList: [],
				noticeInfo: null,
				loadGroupChatNotice: [],
				loadStatus: '',
				isLeader: false,
				showOperation: false,
				operationId: 0,
				operationList: [{
					text: '编辑',
					color: '#FF9C4E'
				},
				{
					text: '删除',
					color: '#f74c31'
				}],
				showNotice: false,
				commonTips: ''
			}
		},
		onLoad(query) {
			var that = this
			that.group_id = query.group_id
			that.session_id = query.session_id
		},
		onShow() {
			this.ws.checkNetwork(this)
			this.ws.pageFun(this.pageDataLoad, this);
		},
		onPullDownRefresh: function () {
			this.ws.pageFun(this.pageDataLoad(1, true), this);
			this.ws.onMessageCallBack.set('group_chat_notice', (msg) => {
				if (parseInt(msg.data.data.group_id) == parseInt(this.group_id) && msg.data.data.refresh) {
					this.$refs.uToast.show({
						title: '刷新成功~',
						type: 'success'
					})
					uni.stopPullDownRefresh()
				}
			})
		},
		methods: {
			openNotice: function (id) {
				var that = this
				that.ws.pageFun(function() {
					that.ws.send({
						c: 'Message',
						a: 'groupChatNoticeOpt',
						data: {
							'id': id,
							'type': 'get'
						}
					});
				}, that);
			},
			gotoPage: function (id, name) {
				uni.navigateTo({
					url: '/pages/center/group_chat_notice_users?id=' + id + '&name=' + name
				})
			},
			clickOperation: function (index) {
				var that = this
				if (index == 0) {
					uni.navigateTo({
						url: '/pages/center/post_group_chat_notice?group_id=' + this.group_id + '&id=' + this.operationId
					})
				} else if (index == 1) {
					uni.showModal({
						title:'温馨提示',
						content: '您确认要删除公告吗？',
						success(res) {
							if (res.confirm) {
								that.ws.pageFun(function () {
									that.ws.send({
										c: 'Message',
										a: 'groupChatNoticeOpt',
										data: {
											'id': that.operationId,
											'type': 'del'
										}
									})
								}, that)
							}
						}
					})
				}
			},
			receiptNotice: function (id, receipt, receipted) {
				var that = this
				that.showNotice = false
				if (!receipt || (receipt && receipted)) {
					return false;
				}
				that.ws.pageFun(function() {
					that.ws.send({
						c: 'Message',
						a: 'receiptGroupChatNotice',
						data: {
							'id': id,
							'session_id': that.session_id,
							'type': 'list'
						}
					});
				}, that);
			},
			operation: function(id){
				this.showOperation = true
				this.operationId = id
			},
			pageDataLoad: function (page = 1, refresh = false) {
				var that = this
				this.ws.send({
					c: 'Message',
					a: 'groupChatNotice',
					data: {
						'group_id': that.group_id,
						'method': 'list',
						'page': page,
						'refresh': refresh
					}
				})
			},
			onReachBottom: function () {
				if (this.loadGroupChatNotice) {
					this.pageDataLoad(parseInt(this.loadGroupChatNotice.page)+1)
				}
			},
			post: function () {
				uni.navigateTo({
					url: '/pages/center/post_group_chat_notice?group_id=' + this.group_id
				})
			}
		}
	}
</script>

<style lang="scss">
page {
	background: #F8F8F8;
}
.add-notice-box {
	height: 80rpx;
	padding-top: 20rpx;
}
.add-notice {
	float: right;
	margin-right: 4%;
}
.notice-list {
	width: 94%;
	margin: 20rpx auto;
}
.notice-item {
	border-radius: 12rpx;
	margin-bottom: 20rpx;
	padding: 16rpx;
	background: #FFFFFF;
	padding-bottom: 0;
}
.notice-item-content {
	min-height: 120rpx;
}
.blue-tag {
	display: inline-block;
	line-height: 40rpx;
	color: $--white;
	background: $--blue;
	padding: 0 12rpx;
	border-radius: 8rpx;
	margin-right: 8rpx;
}
.im-group-notice-imgs {
    display: flex;
	flex-wrap: wrap;
	padding-top: 20rpx;
}
.im-group-notice-imgs image {
	width: 130rpx;
	height: 130rpx;
}
.notice-item-footer,.group-notice-footer {
	font-size: 27rpx;
	color: $--gray;
	padding-top: 6rpx;
	padding-bottom: 10rpx;
	height: 70rpx;
	line-height: 70rpx;
}
.group-notice-footer {
	margin-top: 10rpx;
}
.notice-item-footer-text {
	padding-left: 26rpx;
}
.notice-item-footer-right {
	float: right;
	height: 50rpx;
	line-height: 50rpx;
	background: #2979FF;
	padding: 0 20rpx;
	border-radius: 12rpx;
	color: $--white;
}
.footer-createtime {
	padding-left: 10rpx;
}
.group-notice-title {
	padding: 30rpx;
	padding-bottom: 20rpx;
	font-size: 30rpx;
	font-weight: bold;
}
.group-notice-content {
	padding: 0 30rpx;
}
.group-notice-button button {
	width: 280rpx;
	display: block;
	margin: 20rpx auto;
}
</style>
