<template>
	<view>
		<block v-if="value.type == 'default'">
			<u-parse :show-with-animation="true" :tag-style="{img:'width:30px;height:30px;'}" :selectable="true" 
			:content="value.message.replace(/\n/g,'<br/>').replace(/\\/g,'')"></u-parse>
		</block>
		<block v-else-if="value.type == 'image'">
			<image @click="preimage(value.message)" class="image-message" :src="value.message" mode="widthFix"></image>
		</block>
		<block v-else-if="value.type == 'file'">
			<view class="file-message" @click="goUrl(value.message.url, 'The link')">
				<image class="file-suffix" :src="value.suffixImg"></image>
				<view class="file-message-box">
					<view class="file-name text-ofh">{{value.message.filename}}</view>
					<view class="file-size">{{value.message.size}}</view>
				</view>
				<view class="down-file">
					<u-button type="primary" @click="goUrl(value.message.url, 'Download address')" size="mini" icon="arrow-downward" color="#3c9cff"></u-button>
					<!-- <u-button type="primary" @click="goUrl(value.message.url, 'The link')" size="mini">下载</u-button> -->
				</view>
			</view>
		</block>
		<block v-else-if="value.type == 'kbs_list'">
			
			<view class="fastim-kbs">
				<view class="kbs-title">{{value.message.title}}</view>
					<view class="csr-message-box">
					
						<block v-if="value.message.type == 'distribution-group-select'">
							<view v-if="value.message.csr_group.length" v-for="(item, index) in value.message.csr_group" :key="index">
								<view @click="distributionGroupSelect(item.id)" class="fastim-color-blue">
									<text>{{item.name}}({{item.csr_count}})</text>
								</view>
							</view>
							<view v-if="!value.message.csr_group.length" class="csr-group-none">没有可以选择的客服代表分组,请联系管理员添加！</view>
						</block>
						<block v-else-if="value.message.type == 'csrs'">
							<view v-for="(item, index) in value.message.csrs" :key="index">
								<view class="csr-group-name">{{item.name ? item.name:'无分组'}}</view>
								<view @click="openSession(user.id)" v-for="(user,idx) in item.csrs" :key="idx">
									<text class="csr-message-i-el">{{idx + 1}}、</text><text class="fastim-color-blue">{{user.nickname}}</text>
								</view>
							</view>
						</block>
						<block v-else-if="value.message.type == 'included'">
							<view class="kbs-items">
								<view v-for="(item, index) in value.message.kbs" :key="index">
									<view @click="kbsClick(item.id)" class="kbs-item">
										<text>{{index + 1}}、</text>
										<text class="kbs-item-title fastim-color-blue">{{item.title}}</text>
									</view>
								</view>
							</view>
						</block>
						<!-- <block v-else-if="value.message.type == 'not-included'">
							<view @click="manualCsr" class="fastim-color-blue not-included">联系人工客服</view>
						</block> -->
						<block v-else-if="value.message.type == 'not-included'">
							<view @click="manualCsr" class="fastim-color-blue not-included">Contact manual customer service</view>
						</block>
				
				</view>
			</view>
		</block>
		<!-- <block v-else-if="value.type == 'group_chat_notice'">
			<view @click="showNotice(value.message.id)">
				<view class="group-chat-notice-title">群公告</view>
				<view class="group-chat-notice-content">{{value.message.content}}</view>
				<view class="group-chat-notice-button">查看详情</view>
			</view>
		</block> -->
		<block v-else-if="value.type == 'group_chat_notice'">
			<view @click="showNotice(value.message.id)">
				<view class="group-chat-notice-title">Group Announcement</view>
				<view class="group-chat-notice-content">{{value.message.content}}</view>
				<view class="group-chat-notice-button">View details</view>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		name: "message",
		props: {
			value: {
				type: Object,
				required: true
			}
		},
		methods: {
			preimage: function (url) {
				uni.previewImage({
					urls: [url],
					fail: function() {
						uni.showToast({
							title: '预览图片失败,请重试!',
							icon: 'none'
						})
					}
				});
			},
			goUrl: function (url, title = 'The link') {
				// #ifdef H5
				window.open(url);
				return;
				// #endif
				
			//    #ifdef  APP-PLUS
			//    uni.setClipboardData({
			// 	    data: url,
			// 	    success: function () {
			// 			uni.showToast({
			// 				title: title + ' has been copied to the clipboard, please open it in your browser',
			// 				icon: 'none'
			// 			})
			// 	    }
			// 	});
			// 	#endif
				// #ifdef APP-PLUS
				uni.downloadFile({
				        url: url,
						success: res => {
				          if (res.statusCode === 200) {
							uni.saveFile({
								tempFilePath: res.tempFilePath,
								success: function (res) {
									uni.showToast({
										title: "The file has been downloaded.",
										icon: "none",
									})
									setTimeout(()=>{
										uni.openDocument({
											filePath: res.savedFilePath,
											showMenu: true,
											success: function () {
												console.log("file-success")
											}
										})
									},500)
								},
								fail: function() {
									uni.showToast({
										title: "Save failed, please try again later.",
										icon: "none"
									})
								}
							})
				          }
				        }
				      })		
				
				// #endif
			},
			distributionGroupSelect: function(id) {
				var that = this
				that.ws.pageFun(function(){
					that.ws.send({
						c: 'Message',
						a: 'distributionCsr',
						data: {
							group_id: id
						}
					})
				})
			},
			openSession: function(id) {
				this.ws.pageFun(() => {
					this.ws.send({ c: 'Message', a: 'openSession', data: { 'id': id, 'type': 'user' } })
				})
			},
			kbsClick: function(id) {
				this.ws.pageFun(() => {
					this.ws.send({
						c: 'Message',
						a: 'loadKbs',
						data: {
							id: id
						}
					})
				})
			},
			manualCsr: function() {
				this.ws.pageFun(() => {
					this.ws.send({
						c: 'Message',
						a: 'distributionCsr',
						data: {}
					})
				})
			},
			showNotice: function (id) {
				this.ws.pageFun(() => {
					this.ws.send({
						c: 'Message',
						a: 'groupChatNoticeOpt',
						data: {
							'id': id,
							'type': 'get'
						}
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.image-message {
	display: block;
	width: 320rpx;
	margin: -10rpx;
}
.file-suffix {
	width: 100rpx !important;
	height: 100rpx !important;
	padding: 8rpx;
}
.file-message {
	height: 100rpx;
	display: flex;
	align-items: center;
}
.file-message view {
	margin: 6px 0 0 6px;
	font-size: 28rpx;
}
.file-message .file-name {
    font-weight: bold;
    margin: 0;
    color: $--black;
	max-height: 40px;
	overflow: hidden;
	text-overflow: ellipsis;
}
.file-message .file-size {
    margin: 0;
    color: $--gray;
}
.wrapper .message-item.me .file-name {
    color: $--white;
}
.wrapper .message-item.me .file-size {
    color: $--grey;
}
.file-message .down-file {
    font-size: 12px;
    padding: 0 10px;
}
.fastim-kbs {
	font-size: 30rpx;
}
.csr-group-none {
	font-weight: bold;
	font-size: 28rpx;
	margin-top: 20rpx;
}
.csr-group-name {
	padding-top: 18rpx;
	font-weight: bold;
	font-size: 28rpx;
}
.kbs-items, .not-included {
	padding-top: 20rpx;
}
.fastim-color-blue {
    color: $--blue !important;
}
.group-chat-notice-title {
	color: $--gray;
	font-size: 28rpx;
	font-weight: bold;
}
.group-chat-notice-content {
	padding-top: 10rpx;
	padding-bottom: 16rpx;
	border-bottom: 1px solid $--grey;
}
.group-chat-notice-button {
	min-width: 300rpx;
	color: $--black;
	font-size: 28rpx;
	font-weight: bold;
	display: flex;
	align-items: center;
	justify-content: center;
	padding-top: 20rpx;
}
</style>
