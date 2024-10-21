<template>
	<view class="bg_white">
		<u-toast ref="uToast" />
		<common :tips='commonTips'></common>
		<u-modal :show="modelShow" @cancel="modelShow = false" :mask-close-able="true" :show-cancel-button="true" @confirm="delConfirm" :content="modelContent"></u-modal>
		<u-action-sheet v-if="type == 'user'" :list="userStatusList" :safe-area-inset-bottom="true" @click="changeUserStatus" v-model="userStatusBool"></u-action-sheet>
		<view class="user-box">
			<image :src="info.avatar" class="user-avatar" mode="aspectFill"></image>
			<view class="user-right">
				<view class="user-right-item user-name">
					<text class="nickname-text">{{info.nickname_origin ? info.nickname_origin:info.nickname}}</text>
					<text v-if="info.remark">(<text class="nickname-text">{{info.remark}}</text>)</text>
				</view>
				<view class="user-right-item" style="color: #999;">{{info.bio}}</view>
				<view v-if="type == 'user'" @click="setuserStatusBool" :class="'user-status-' + info.status.value" class="user-right-item user-status"> • {{info.status.chinese}}</view>
				<view v-if="type == 'group' || type == 'service'" class="user-right-item user-status">{{info.other}}</view>
			</view>
			<view v-if="info.friend && (info.id != userinfo.id)" class="collection-user">
				<u-icon @click="collectionUser" color="#6388fb" :name="(info.group == 'common') ? 'star-fill':'star'"></u-icon>
			</view>
		</view>
		<u-cell-group v-if="(type == 'group' && !info.deletetime) || type == 'user' || type == 'service'" :border="false" class="user-info-box">
			
			<block v-for="(item,index) in detail" :key="index">
				<!-- 在u-cell内的v-if失效了？ -->
				<u-cell v-if="item.type && item.type == 'leader'" hover-class="none" :border-top="false" :border-bottom="false" :arrow="false" :title="item.title">
					<navigator :url="'/pages/center/info?type=user&id=' + item.leader.id" class="leader-avatar-box" slot="right-icon">
						<image :src="item.leader.avatar" class="leader-avatar" mode="widthFix"></image>
						<u-icon name="arrow-right"></u-icon>
					</navigator>
				</u-cell>
				<u-cell v-else-if="item.name == 'Id'" @click="clipboardId(item.value)" hover-class="none" :border-top="false" :border-bottom="false" :arrow="false" :title="item.name">
					<view slot="right-icon">{{item.value}}</view>
				</u-cell>
				<u-cell v-else-if="item.name !='Email' && item.name !='Mobile' " hover-class="none" :border-top="false" :border-bottom="false" :arrow="false" :title="item.name">
					<view slot="right-icon">{{item.value}}</view>
				</u-cell>
			</block>
			
			<navigator v-if="type == 'group'" :url="'/pages/center/group_chat_notice?group_id=' + info.id">
				<u-cell hover-class="none" :border-top="false" :border-bottom="false" title="Group Announcement"></u-cell>
			</navigator>
			<navigator v-if="type == 'group'" :url="'/pages/center/group_chat_users?id=' + info.id">
				<u-cell hover-class="none" :border-top="false" :border-bottom="false" title="Group list"></u-cell>
			</navigator>
			
			<u-cell v-if="(type == 'user') && info.friend && (info.id != userinfo.id)" hover-class="none" :border-bottom="false" :border-top="false" :arrow="true" title="remarks">
				<view slot="right-icon">
					<u-input @blur="saveRemark" placeholder="Please enter comments" :clearable="false" input-align="right" type="text" v-model="info.remark" :border="false" />
				</view>
			</u-cell>
		</u-cell-group>
		<view class="im-data-none" v-if="type == 'group' && info.deletetime">Group chat has been dismissed~</view>
		<!-- 编辑资料 -->
		<view class="user-buttons">
			<u-button @click="userAction(item.action, item.data, item.type, item.opt)" v-for="(item,index) in buttons" :key="index" :type="item.btype">{{item.name}}</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: 0,
				type: '',
				userStatusBool: false,
				userStatusList: [{
					text: 'on-line',
					color: '#21E589'
				}, {
					text: 'be busy',
					color: '#FF647E'
				}, {
					text: 'Stealth',
					color: '#FF9C4E'
				}],
				info: {
					status: {
						value: 0,
						chinese: 'Loading'
					}
				},
				detail: [],
				buttons: [],
				userinfo: [],
				modelShow: false,
				modelContent: '',
				commonTips: ''
			}
		},
		onLoad:function(query){
			this.id = query.id ? query.id:0
			this.type = query.type ? query.type:'user'
			this.userinfo = uni.getStorageSync('userinfo');// 防止需要在pageDataLoad使用到用户ID
			console.log(query,this.userinfo )
			this.ws.pageFun(this.pageDataLoad, this);
			this.appIno = uni.getStorageSync('appinfo');
		},
		onShow() {
			this.ws.checkNetwork(this)
			if (this.ws.pageRefresh.centerInfo) {
				this.ws.pageRefresh.centerInfo = false
				this.ws.pageFun(this.pageDataLoad, this);
			}
		},
		onPullDownRefresh: function () {
			this.ws.pageFun(this.pageDataLoad(true), this);
			this.ws.onMessageCallBack.set('info-detail', (msg) => {
				if (msg.data.data.refresh) {
					this.$refs.uToast.show({
						title: 'Refresh succeeded~',
						type: 'success'
					})
					uni.stopPullDownRefresh()
				}
			})
		},
		methods: {
			pageDataLoad: function (refresh = false) {
				var that = this
				this.ws.send({
					c: 'User',
					a: 'infoDetail',
					data: {
						'method': 'get',
						'type': that.type,
						'id': that.id ? that.id:that.userinfo.id,
						'requestor': that.userinfo.id,
						'refresh': refresh
					}
				})
			},
			setuserStatusBool(){
				this.userStatusBool = this.info.id == this.userinfo.id ? true:false
			},
			changeUserStatus: function (index) {
				var that = this
				that.ws.pageFun(function () {
					that.ws.send({ c: 'ImBase', a: 'changeStatus', data: { 'status': (index + 1) } });
				}, that);
			},
			userAction: function (action, data, type, opt) {
				if (action == 'del-contact') {
					switch (type) {
						case 'user':
							this.modelContent = 'Are you sure you want to delete this friend?';
							break;
						case 'group':
							this.modelContent = 'Are you sure you want to quit group chat?';
							break;
						case 'dissolution-group':
							this.modelContent = 'Are you sure you want to dismiss group chat?';
							type = 'group';
							break;
					}
					this.modelShow = true
					this.info.delType = type
				} else if(action == 'open-session') {
					let message = { c: 'Message', a: 'openSession', data: { 'id': data, 'type': type } }
					this.ws.send(message);
				} else if(action == 'add-friends') {
					uni.navigateTo({
						url: '/pages/search/add-contact?id=' + data + '&type=' + type
					})
				} else if(action == 'userinfo-opt') {
					if (opt == 'edit') {
						uni.navigateTo({
							url: '/pages/center/edit-info?id=' + data + '&type=' + type
						})
					} else if(opt == 'join') {
						uni.navigateTo({
							url: '/pages/search/add-contact?id=' + data + '&type=' + type
						})
					}
				} else if (action == 'close') {
					uni.navigateBack({
						delta: 1
					})
				}
			},
			delConfirm: function () {
				var that = this
				that.ws.pageFun(function(){
					let message = {
						c: 'User',
						a: 'delContact',
						data: {
							'id': that.info.id,
							'type': that.info.delType
						}
					}
					that.ws.send(message);
				}, that)
			},
			saveRemark: function (value) {
				if (value != this.info.oldRemark) {
					let message = {
						c: 'User',
						a: 'updateFriendInfo',
						data: {
							id: this.info.id,
							new_remark: value,
							method: 'update_remark'
						}
					}
					this.ws.send(message);
				}
			},
			collectionUser: function () {
				var that = this
				that.ws.pageFun(function(){
					var new_group = 'common'
					if (that.info.group == 'common') {
						new_group = 'all_friends'
					}
					let message = {
						c: 'User',
						a: 'updateFriendInfo',
						data: {
							id: that.info.id,
							new_group: new_group,
							method: 'update_group',
							source: 'uni-app'
						}
					}
					that.ws.send(message);
					that.info.group = new_group
					that.ws.showMsgCallback = function () {
						that.ws.pageRefresh.addressList = true
					}
				}, that)
			},
			clipboardId: function(id) {
				var that = this
				uni.setClipboardData({
					data: id.toString(),
					success: function () {
						uni.hideToast()
						that.$refs.uToast.show({
							title: 'Account copied~',
							type: 'success'
						})
					}
				});
			}
		}
	}
</script>

<style lang="scss">
page {
	background-color: $--bg-color;
}
.user-box {
	display: flex;
	padding: 20rpx 4vw;
	align-items: center;
}
.user-avatar {
	height: 170rpx;
	width: 170rpx;
	border-radius: 50%;
}
.collection-user {
	display: flex;
	align-items: center;
	justify-content: center;
}
.user-right {
	width: 70%;
	padding-left: 20rpx;
}
.user-right-item {
	display: block;
	line-height: 32rpx;
}
.user-name {
	line-height: 35rpx;
	font-size: 30rpx;
}
.nickname-text {
	display: inline-flex;
	max-width: 100%;
	word-wrap: break-word;
	word-break: break-all;
}
.nickname-text > span{
	max-width: 100%;
	white-space: normal;
	word-wrap: break-word;
	word-break: break-all;
}
.user-status {
	color: $--gray;
	line-height: 46rpx;
}
.user-info-box {
	display: block;
	width: 92vw;
	margin: 0 auto;
	padding-top: 10rpx;
}
.user-buttons {
	padding: 40rpx 0;
	display: flex;
	align-items: center;
	justify-content: space-around;
}
.leader-avatar-box {
	display: flex;
	align-items: center;
}
.leader-avatar {
	height: 80rpx;
	width: 80rpx;
	margin-right: 10rpx;
}
.im-data-none {
	display: block;
	line-height: 100rpx;
	text-align: center;
	font-size: 28rpx;
	color: $--gray;
}
.bg_white{
	background-color: #fff;
}
</style>
