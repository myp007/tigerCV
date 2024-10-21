<template>
	<view class="center_index_page">
		<u-navbar class="app_navbar" :placeholder="true" leftIconColor="#00328f" @leftClick="leftClick" title="About">
		</u-navbar>
		<u-toast ref="uToast" />
		<!-- <common :tips='commonTips'></common> -->
		<u-modal :show="logoutShow" :show-cancel-button="true" @cancel="logoutShow = false" @confirm="logout()"
			cancel-text="cancel" confirm-text="cancellation" content="Are you sure you want to sign out?"></u-modal>
		<u-modal :show="destroyShow" :show-cancel-button="true" @cancel="destroyShow = false" @confirm="destroy()"
			cancel-text="cancel" confirm-text="cancellation"
			content="If you destroy your account , all your resume and application records will be completely cleared ?"></u-modal>
		<!-- <navigator url="/pages/center/info">
			<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30 u-p-t-30 " style="padding: 20px 15px;">
				<view class="u-m-r-10 mr_10">
					<u-avatar :src="info.avatar" size="80"></u-avatar>
				</view>
				<view class="line-status" style="display: flex;align-items: center; width: calc(100% - 90px);">
					<view class="u-flex-1">
						<view class="u-font-18 u-p-b-20">{{appIno.email}}</view>
					</view>
					<view class="u-m-l-10 u-p-10 user-status" :class="'user-status-' + info.status.value">•<text style="white-space:nowrap">{{info.status.chinese}}</text></view>
					<view class="u-m-l-10 u-p-10" >
						<u-icon name="arrow-right"   color="#00328f" style="position:relative;top: 2px;" size="20"></u-icon>
					</view>
				</view>
			</view>
		</navigator> -->
		<!-- <navigator :url="`/pages/center/edit-info?id=${info.id}&type=user`">
			<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30 u-p-t-30 " style="padding: 20px 15px;">
				<view class="u-m-r-10 mr_10" style="position: relative;border: 1px solid #eee;border-radius: 50%;">
					<u-avatar :src="userInfo.avatar" size="80"></u-avatar>
					
				</view>
				<view class="line-status" style="display: flex;align-items: center; width: calc(100% - 90px);">
					<view class="u-flex-1">
						<view class="u-font-18 u-p-b-20 nickname">
							<span>{{ userInfo.nickname }}</span>
							<u--image class="l sex"  src="/static/icon/man_icon.png" width="12px" height="12px" v-if="userInfo.gender == 'male'"></u--image>
					<u--image class="l sex"  src="/static/icon/woman_icon.png" width="10px" height="10px" v-else-if="userInfo.gender == 'female'"></u--image>
						</view>
						<view class="birthday">{{ userInfo.birthday }}</view>
					</view>
					<view class="user-status">
						{{userInfo.resigned_status}}
					</view>
					<view class="u-m-l-10 u-p-10">
						<u-icon name="arrow-right" color="#00328f" style="position:relative;top: 2px;" size="20"></u-icon>
					</view>
				</view>
			</view>
		</navigator> -->

		<view class="u-m-t-20 to-do">
			<u-cell-group>
				<!-- <navigator url="/pages/center/primecard">
					
					<u-cell class="cell_text" :border-top="false" :isLink="true" title="Prime Card"></u-cell>
				</navigator>
				<navigator url="/pages/center/recommendation">
					
					<u-cell class="cell_text" :border-top="false" :isLink="true" title="Recommendation"></u-cell>
				</navigator> -->
				<!-- <navigator url="/pages/center/to-do"> -->
				<!-- <navigator :url="`/pages/center/questionnaire?id=${info.id}&type=user`">

					<u-cell class="cell_text" :border-top="false" :isLink="true" title="Privacy settings"></u-cell>
				</navigator> -->
				<!-- 关于 -->
				<navigator url="/pages/center/about">
					<u-cell class="cell_text" :border-top="false" :isLink="true" title="About"></u-cell>
				</navigator>

				<!-- </navigator> -->
				<!-- 退出 -->
				<u-cell class="cell_text" :border-top="false" :isLink="true" title="Exit" @click="logoutConfirm"></u-cell>
			</u-cell-group>
			<!-- 销毁账户 -->
		</view>
		<view class="destroy_box">
			<view class="destroy">
				<view @click="destroyConfirm" class="destroy_text"> Destroy Account</view>
				<view class="destroy_icon" @click="destroyConfirm"> <u-icon name="arrow-right" color="rgb(151, 147, 147)"
						size="14"></u-icon></view>
				<!-- <u-cell class="Destroy cell_text" :border-top="false" :isLink="true" title="Destroy Account" ></u-cell> -->
			</view>
		</view>
	</view>
</template>

<script>
import { deleteUser, logout, getUser } from "@/api/user";
export default {
	data() {
		return {
			info: {},
			appInfo: {},
			TODOCount: 0,
			collectionCount: 0,
			logoutShow: false,
			destroyShow: false,
			commonTips: '',
			selectvalue: 'PERSONAL',
			fdFlag: null,
			userInfo: {}
		}
	},
	onLoad() {
		this.info = uni.getStorageSync('userinfo');// 防止需要在pageDataLoad使用到用户ID
		this.appIno = uni.getStorageSync('appinfo');
		if (!this.appIno.token) {
			uni.reLaunch({
				url: '/pages/center/login_up'
			})
			return false;
		}
		this.info.avatar = this.ws.imgUrl(this.info.avatar)
		this.info.status = { chinese: 'Loading', value: 0 }
		
		// this.getUserInfo()
	},
	onShow: function () {
		this.ws.checkNetwork(this)
		this.ws.pageFun(this.pageDataLoad, this);
		this.getUserInfo()
	},
	onPullDownRefresh: function () {
		this.ws.pageFun(this.pageDataLoad(true), this);
		this.ws.onMessageCallBack.set('center', (msg) => {
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
		
		getUserInfo() {
			let query = {
				id: this.info.id,
				type: 'user'
			}
			console.log(query)
			getUser( query ).then(res => {
				this.userInfo = res
			})
		},
		pageDataLoad: function (refresh = false) {
			var that = this
			this.ws.send({
				c: 'User',
				a: 'center',
				data: {
					'id': that.info.id,
					'refresh': refresh
				}
			})
		},
		logoutConfirm: function () {
			this.logoutShow = true
		},
		destroyConfirm() {
			this.destroyShow = true
		},
		destroy() {
			deleteUser().then(res => {
				this.logout()
			})
		},
		leftClick() {
			console.log('leftClick')
			// uni.switchTab({
			// 	url: '/pages/center/index'
			// })
			uni.switchTab({
				url: '/pages/center/questionnaire'
			})
		},
		logout: function () {
			var that = this
			clearTimeout(this.fdFlag)
			this.fdFlag = setTimeout(() => {
				logout().then(res => {
					// #ifdef APP-PLUS
					if (!this.ws.socketOpen || parseInt(that.ws.initializeData.config.uni_push_switch) == 0) {
						that.ws.logout()
					} else {
						that.ws.pushCid('logout')
					}
					// #endif

					// #ifndef APP-PLUS
					that.ws.logout()
					// #endif
				}, 1000)
				this.fdFlag = null
			})

		}
	}
}
</script>

<style lang="scss">
.center_index_page {
	background-color: #fff;
	height: 100%;

	.cell_text {
		font-size: 16px;
		font-weight: 900;
	}
}

page {
	background-color: #ededed;
}

.user-box,
.to-do {
	background-color: $--white;
}

.user-status {
	font-size: 24rpx;
	color:#999;
}

.user-status text {
	padding-left: 10rpx;
}

.to-do u-cell u-icon {
	margin-right: 10rpx;
}

.to-do-title {
	display: flex;
	align-items: center;
}

.to-do-icon {
	width: 28rpx;
	margin: 0 12rpx 0 6rpx;
}

.mr_10 {
	margin-right: 10px;
}

.line-status {
	.u-flex-1 {
		width: calc(100% - 85px);

		.u-font-18 {
			width: 100%;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

	}
}

.destroy_box {
	.destroy {
		position: fixed;
		display: flex;
		padding: 0 15px;
		width: calc(100% - 30px);
		align-items: center;
		bottom: 150px;
		color: rgb(151, 147, 147);
		//  transform: scale(0.7);
		background-color: #fff;

		.destroy_text {
			font-size: 12px;
			margin-right: 10px;
		}

		.destroy_icon {
			position: relative;
			top: 1px;
		}
	}
}
.nickname{
	display: flex;
	align-items: center;
	font-size: 30rpx;
	margin-bottom: 15rpx;
}
.birthday{
	color: #999;
	font-size: 12px;
}
.sex{
	// position: absolute;
	// right: 15rpx;
	// top: 15rpx;
	display: inline-block;
	margin-left: 10rpx;
}
</style>
