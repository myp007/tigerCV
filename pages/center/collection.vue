<template>
	<view>
		<u-toast ref="uToast" />
		<common :tips='commonTips'></common>
		<u-popup width="94%" border-radius="16" mode="center" :closeable="true" v-model="LinkPopupShow">
			<view class="link-popup-box">
				<view class="link-popup-title">你将要访问的网址是：</view>
				<view class="link-popup-url">{{linkPopupUrl}}</view>
				<view class="link-popup-tis">请确认是否继续访问，并注意您的账户和财产安全！</view>
				<view class="link-popup-buttons">
					<u-button :custom-style="{padding: '0 2rpx'}" class="link-popup-button-item" hover-class="none" type="primary" size="medium" plain>
						<u-link :href="linkPopupUrl"><text class="link-popup-url-button">访问</text></u-link>
					</u-button>
					<u-button @click="LinkPopupShow = false" class="link-popup-button-item" type="default" size="medium">取消</u-button>
				</view>
			</view>
		</u-popup>
		
		<u-action-sheet :list="actionList" @click="clickSwipeAction" v-model="actionShow"></u-action-sheet>
		<u-modal :show="modelShow" :mask-close-able="true" :show-cancel-button="true" @cancel="modelShow = false" @confirm="delConfirm" :content="modelContent"></u-modal>
		
		<view class="search-box">
			<u-search @search="search()" @custom="search()" v-model="keywords" class="search-box-u-search" shape="square" placeholder="搜索收藏" :clearabled="true" :animation="true"></u-search>
		</view>
		<view class="tabs-box">
			<u-tabs :list="tabs" :is-scroll="true" :current="tabCurrent" @change="tabChange"></u-tabs>
		</view>
		
		<u-checkbox-group>
			<view
			:index="index"
			v-for="(item, index) in collections"
			:key="item.id"
			class="collection-llst">
				<view @longpress="openSwipeAction(index)" class="collection-item">
					<u-checkbox v-if="action == 'send'" @change="collectionSelect" shape="circle" v-model="item.checked" :name="index">
						<view class="collection-wrap">
							<link-message v-if="item.type == 'link'" :value="item" :LinkPopupShow.sync="LinkPopupShow" :linkPopupUrl.sync="linkPopupUrl"></link-message>
							<view v-else-if="item.type == 'video'" @click="playVideo(item)" class="video-message-box">
								<view v-show="!item.play" class="video-message-cover">
									<view class="video-message-cover-play">
										<u-icon name="play-right-fill" size="40" color="#ffffff"></u-icon>
										<view>{{item.currentTime + (item.duration ? ' / ' + item.duration:'')}}</view>
									</view>
								</view>
								<!-- #ifdef MP-WEIXIN -->
								<video @timeupdate="timeUpdate" :style="{width: item.play ? '400rpx':'1rpx'}" @fullscreenchange="fullScreenChange" :id="'video-' + item.id" :ref="'video-' + item.id" class="video-message-wx" :src="item.message" object-fit="contain" controls></video>
								<!-- #endif -->
								<!-- #ifndef MP-WEIXIN -->
								<video @timeupdate="timeUpdate" :style="{display: item.play ? 'block':'none'}" @fullscreenchange="fullScreenChange" :id="'video-' + item.id" :ref="'video-' + item.id" class="video-message" :src="item.message" object-fit="contain" controls></video>
								<!-- #endif -->
							</view>
							<view v-else-if="item.type == 'audio'" @click="playAudio(item, index)" class="audio-message">
								<u-icon :name="item.play ? 'pause':'play-right-fill'" size="36" color="#999999"></u-icon>
								<text class="audio-message-text">{{item.currentTime + (item.duration ? ' / ' + item.duration:'')}}</text>
							</view>
							<message v-else :value="item"></message>
							<view class="collection-footer">{{ item.createtime + ' | ' + item.from}}</view>
						</view>
					</u-checkbox>
					<block v-else>
						<view class="collection-wrap">
							<link-message v-if="item.type == 'link'" :value="item" :LinkPopupShow.sync="LinkPopupShow" :linkPopupUrl.sync="linkPopupUrl"></link-message>
							<view v-else-if="item.type == 'video'" @click="playVideo(item)" class="video-message-box">
								<view v-show="!item.play" class="video-message-cover">
									<view class="video-message-cover-play">
										<u-icon name="play-right-fill" size="40" color="#ffffff"></u-icon>
										<view>{{item.currentTime + (item.duration ? ' / ' + item.duration:'')}}</view>
									</view>
								</view>
								<!-- #ifdef MP-WEIXIN -->
								<video @timeupdate="timeUpdate" :style="{width: item.play ? '400rpx':'1rpx'}" @fullscreenchange="fullScreenChange" :id="'video-' + item.id" :ref="'video-' + item.id" class="video-message-wx" :src="item.message" object-fit="contain" controls></video>
								<!-- #endif -->
								<!-- #ifndef MP-WEIXIN -->
								<block v-if="userPlatform == 'ios'">
									<video @timeupdate="timeUpdate" v-if="item.play" @fullscreenchange="fullScreenChange" :id="'video-' + item.id" :ref="'video-' + item.id" class="video-message" :src="item.message" object-fit="contain" controls></video>
								</block>
								<video v-else @timeupdate="timeUpdate" :style="{display: item.play ? 'block':'none'}" @fullscreenchange="fullScreenChange" :id="'video-' + item.id" :ref="'video-' + item.id" class="video-message" :src="item.message" object-fit="contain" controls></video>
								<!-- #endif -->
							</view>
							<view v-else-if="item.type == 'audio'" @click="playAudio(item, index)" class="audio-message">
								<u-icon :name="item.play ? 'pause':'play-right-fill'" size="36" color="#999999"></u-icon>
								<text class="audio-message-text">{{item.currentTime + (item.duration ? ' / ' + item.duration:'')}}</text>
							</view>
							<message v-else :value="item"></message>
							<view class="collection-footer">{{ item.createtime + ' | ' + item.from}}</view>
						</view>
					</block>
				</view>
			</view>
		</u-checkbox-group>
		<view v-if="!collections.length" class="im-data-none">没有更多了~</view>
		
		<view v-if="action == 'send'" class="send-btn">
			<u-button @click="send" shape="square" size="medium" type="primary" :disabled="sendBtnDisabled">{{sendBtn}}</u-button>
		</view>
		
		<view v-if="action == 'send'" class="seat"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				action: '',
				keywords: '',
				tabs: [],
				tabCurrent: 0,
				collections: [],
				loadGroup: false,
				collectionSelected: new Set(),
				collectionSelectData: [],
				sendBtn: '发送收藏',
				sendBtnDisabled: true,
				LinkPopupShow: false,
				linkPopupUrl: '',
				actionList: [{
					text: '转发'
				},
				{
					text: '删除',
					color: '#f74c31'
				}],
				actionShow: false,
				actionIndex: 0,
				modelShow: false,
				modelContent: '',
				userPlatform: '',
				commonTips: ''
			}
		},
		onLoad:function(query){
			this.action = query.action ? query.action:'browse'
			this.ws.pageFun(this.pageDataLoad, this);
			
			if (this.action == 'send') {
				uni.setNavigationBarTitle({
					title: '请选择收藏'
				})
			}
		},
		onShow() {
			this.ws.checkNetwork(this)
		},
		onPullDownRefresh: function () {
			this.ws.pageFun(this.pageDataLoad(true), this);
			this.ws.onMessageCallBack.set('get_groups', (msg) => {
				if (msg.data.data.type == 'collection' && msg.data.data.refresh) {
					this.$refs.uToast.show({
						title: '刷新成功~',
						type: 'success'
					})
					uni.stopPullDownRefresh()
				}
			})
		},
		onReachBottom: function () {
			if (this.loadGroup) {
				this.loadCollection(this.loadGroup.id, parseInt(this.loadGroup.page)+1)
			}
		},
		onHide: function (){
			this.ws.pauseAudio('hide', this, 'collection')
		},
		onUnload: function () {
			this.ws.pauseAudio('unload', this, 'collection')
		},
		methods: {
			timeUpdate: function (e) {
				this.ws.playVideoItem.duration = this.ws.sToHs(Math.floor(e.detail.duration))
				this.ws.playVideoItem.currentTime = this.ws.sToHs(Math.floor(e.detail.currentTime))
			},
			fullScreenChange: function (e) {
				if (!e.detail.fullScreen) {
					var videoContext = uni.createVideoContext('video-' + this.ws.playVideoItem.id, this)
					videoContext.pause()
					this.ws.playVideoItem.play = false
				}
			},
			playVideo: function(item){
				this.ws.playVideo(item, this, 'collection')
			},
			playAudio: function(item, index) {
				this.ws.playAudio(item, index, 0, this, 'collection')
			},
			pageDataLoad: function (refresh = false) {
				let message = {
					c: 'ImBase',
					a: 'getGroups',
					data: {
						'type': 'collection',
						'refresh': refresh
					}
				}
				this.ws.send(message);
				this.userPlatform = this.ws.userPlatform
			},
			loadCollection: function (id, page, keywords = '') {
				var that = this
				that.ws.pageFun(function(){
					that.ws.send({
						c: 'User',
						a: 'loadGroup',
						data: {
							id: id,
							page: page,
							keywords: keywords,
							method: 'load-collection'
						}
					})
				}, that)
			},
			search: function(value) {
				this.loadCollection(this.tabs[this.tabCurrent].id, 1, value)
			},
			tabChange (item) {
				let index = item.index
				this.ws.pauseAudio('unload', this, 'collection')
				this.tabCurrent = index
				this.loadCollection(this.tabs[index].id, 1)
			},
			openSwipeAction (index) {
				this.actionIndex = index
				this.actionShow = true
			},
			delConfirm: function () {
				var that = this, item = that.collections[that.actionIndex]
				that.ws.pageFun(function(){
					let message = {
						c: 'User',
						a: 'collection',
						data: {
							id: item.id,
							action: 'del',
							index: that.actionIndex
						}
					}
					that.ws.send(message);
				}, that)
			},
			clickSwipeAction (index) {
				var that = this
				if(index == 1) {
					that.modelShow = true
					that.modelContent = '确定删除收藏吗?'
				} else if (index == 0) {
					uni.navigateTo({
						url: '/pages/pick-user/pick-user?action=message-forward&forward_type=collection&message_id=' + that.collections[that.actionIndex].id
					})
				}
			},
			collectionSelect: function (e) {
				var that = this, collection = that.collections[e.name]
				if (e.value) {
					that.collectionSelected.add(collection.id)
					that.collectionSelectData.push(collection)
				} else {
					that.collectionSelected.delete(collection.id)
				}
				that.sendBtn = '发送收藏(' + that.collectionSelected.size + ')';
				that.sendBtnDisabled = that.collectionSelected.size ? false:true
			},
			send: function () {
				var selected = []
				for (let c of this.collectionSelected) {
					for (let pc in this.collectionSelectData) {
						if (this.collectionSelectData[pc].id == c) {
							selected.push(this.collectionSelectData[pc])
						}
					}
				}
				this.ws.collectionSelected = selected
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style lang="scss">
.search-box {
	display: flex;
	align-items: center;
	padding: 20rpx 4vw;
	background: #fff;
}
.search-box .search-box-u-search {
	flex: 1;
}
.collection-wrap {
	padding: 0 20rpx;
}
.collection-llst {
	background: #FFFFFF;
}
.collection-item {
	font-size: 30rpx;
	display: flex;
	width: 100vw;
	align-items: center;
	padding: 20rpx;
	border-bottom: 1px solid #F2F3F4;
}
.collection-image {
	max-width: 200rpx;
	max-height: 200rpx;
	margin-left: 20rpx;
}
.collection-footer {
	font-size: 28rpx;
	color: #999999;
	margin-top: 20rpx;
}
.send-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100rpx;
	width: 100vw;
	position: fixed;
	bottom: 0;
	z-index: 9999;
}
.seat {
	height: 100rpx;
	width: 100vw;
}

.link-popup-box {
	padding: 80rpx 20rpx 20rpx 20rpx;
	text-align: center;
	font-size: 28rpx;
}
.link-popup-title {
	font-weight: bold;
	font-size: 30rpx;
}
.link-popup-url {
	display: block;
	width: 90%;
	margin: 0 auto;
	color: $--blue;
	padding: 20rpx 0;
	word-break: break-all;
	word-wrap: break-word;
}
.link-popup-tis {
	color: $--gray;
}
.link-popup-buttons {
	padding-top: 20rpx;
	display: flex;
	height: 160rpx;
	align-items: center;
	justify-content: center;
}
.link-popup-button-item {
	margin-right: 40rpx;
}
.link-popup-url-button {
	display: inline-block;
	height: 70rpx;
	line-height: 70rpx;
	padding: 0 80rpx;
}
.video-message-box {
	position: relative;
	min-height: 400rpx;
	min-width: 400rpx;
	overflow: hidden;
}
.video-message {
	width: 400rpx;
	height: 400rpx;
}
.video-message-wx {
	width: 400rpx;
	height: 400rpx;
	position: absolute;
}
.video-message-cover {
	height: 400rpx;
	width: 400rpx;
	background: $--gray;
	color: $--white;
	display: flex;
	align-items: center;
	justify-content: center;
}
.video-message-cover-play {
	text-align: center;
	font-size: 30rpx;
}
.audio-message {
	display: flex;
	align-items: center;
	font-size: 30rpx;
	color: $--gray;
	border: 1px solid $--grey;
	border-radius: 16rpx;
	padding: 20rpx;
}
.audio-message-text {
	padding-left: 20rpx;
}
</style>
