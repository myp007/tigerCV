<template>
	<view>
		<!-- <u-navbar class="app_navbar" :isBack="false" :placeholder="true" :leftIcon="null" leftIconColor="#00328f" @leftClick="leftClick" :title="'Privacy settings'">
		</u-navbar> -->
		<u-navbar class="app_navbar" :placeholder="true" leftIconColor="#00328f" :title="'Personal'">
			<view slot="left"></view>

			<view slot="right" class="nav_right" @click="rightClick">
				<u-icon name="list-dot" size="24"></u-icon>
			</view>
		</u-navbar>
		<u-modal :show="logoutShow" :show-cancel-button="true" @cancel="logout()" @confirm="logoutShow = false "
			cancel-text="Log out" confirm-text="Cancel" content="Are you sure you want to log out?"></u-modal>
		<u-modal :show="destroyShow" :show-cancel-button="true" @cancel="destroy()" @confirm="destroyShow = false "
			cancel-text="Delete" confirm-text="cancel"
			content="If you want to delete your account, all resume and application records will be complete deleted."></u-modal>
		<view class="mian" @click="showUserSetting = false">
			<view class="setting-layer" v-if="showUserSetting" style="top: 0;left: auto;right: 5px;">
				<view class="single" @click="goAbout">
						<view>About</view>
				</view>
				<view class="single" @click="logoutConfirm">
					<view>Exit</view>
				</view>
				<view class="single" @click="destroyConfirm">
					<view> Destroy Account</view>
				</view>
			</view>
			<view class="header">
				<navigator :url="`/pages/center/edit-info?id=${userInfo.id}&type=user`">
					<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30 u-p-t-30 " style="padding: 20px 15px;">
						<view class="u-m-r-10 mr_10" style="position: relative;border: 1px solid #eee;border-radius: 50%;">
							<u-avatar :src="userInfo.avatar" size="80"></u-avatar>

						</view>
						<view class="line-status" style="display: flex;align-items: center; width: calc(100% - 90px);">
							<view class="u-flex-1">
								<view class="u-font-18 u-p-b-20 nickname">
									<span>{{ userInfo.nickname }}</span>
									<u--image class="l sex" src="/static/icon/man_icon.png" width="12px" height="12px"
										v-if="userInfo.gender == 'male'"></u--image>
									<u--image class="l sex" src="/static/icon/woman_icon.png" width="10px" height="10px"
										v-else-if="userInfo.gender == 'female'"></u--image>
								</view>
								<view class="birthday">{{ userInfo.birthday }}</view>
							</view>
							<view class="user-status" v-if="userInfo.resigned_status">
								{{ userInfo.resigned_status }}
							</view>
							<view class="u-m-l-10 u-p-10">
								<u-icon name="arrow-right" color="#00328f" style="position:relative;top: 2px;"
									size="20"></u-icon>
							</view>
						</view>
					</view>
				</navigator>
			</view>
			<view class="box" v-for="(i, j) in list" :key="j">
				<view class="title">
					{{ i.name || '' }}
				</view>
				<view class="cell_text" v-for="(item, index) in i.value" :key="index" @click="tap(j, item.id)">
					<view class="text">{{ item.text }}</view>
					<u-icon v-show="i.check == item.id" color="#00328f" size="18" name="checkmark"></u-icon>
				</view>
			</view>
			<view class="but-box">
				<!-- <u-button  :loading="submitLoading" :disabled="submitLoading" class="but" type="primary" @click="submit">Save</u-button> -->
			</view>
		</view>
	</view>
</template>

<script>
import { getUser, saveInfo ,deleteUser ,logout} from "@/api/user";
export default {
	name: "questionnaire",
	data() {
		return {
			title: '',
			list: [{
				name: 'Are you working or in a higher job status', key: 'resigned', check: '1', value: [
					{ text: 'I am in the job, but I am looking for a new job', id: '1' },
					{ text: "I have left my job", id: '2' },
					{ text: "I'm not looking for a job anymore, but HR can send me an email", id: '3' },
				]
			},
			{
				name: 'Resume protection', key: 'set_privacy', check: '1', value: [
					{ text: 'Please remove my personal information (phone number, name, email address, etc.), when HR wishes to contact me, please obtain my consent through TigerCV', id: '1' },
					{ text: "I don't need privacy protection, please show my complete resume to HR", id: '2' },
				]
			},
			{
				name: 'Whether to allow TigerCV to recommend you to a suitable company, even if you have not applied', key: 'set_viewpermission', check: '1', value: [
					{ text: 'Yes, please recommend me to more companies', id: '1' },
					{ text: 'No, I hope I apply for every position by myself', id: '2' },
				]
			},
			{
				name: 'When is it convenient to answer the phone?', key: 'set_answeringtime', check: '4', value: [
					{ text: '9:00-12:00', id: '1' },
					{ text: '14:00-18:00', id: '2' },
					{ text: '20:00-22:00', id: '3' },
					{ text: 'Anytime', id: '4' },
				]
			},],

			// list:[
			// 	{name:'你是工作或离职状态',check:'1',value:[
			// 	{text:'我在职，但在找新的工作',id:'1'},
			// 	{text:'我已经离职',id:'2'},
			// 	{text:'我没有找工作了，但HR可以给我发邮件',id:'3'},
			// ]},
			// {name:'简历保护',check:'1',value:[
			// 	{text:'请移除我的个人信息（电话，姓名，邮箱等），当HR希望联系我时，请通过TigerCV征得我的同意' ,id:'1'},
			// 	{text:"我不需要隐私保护，请展示我的完整简历给HR"},
			// ]},{name:'是否允许TigerCV将你推荐给合适的企业，即使你没有申请过这些岗位',check:'1',value:[
			// 	{text:'是的，请将我推荐给更多企业' ,id:'1'},
			// 	{text:'不是，我希望我自己申请每一个岗位'},
			// ]},
			// {name:'什么时候方便接电话',check:'1',value:[
			// 	{text:'9:00-12:00' ,id:'1'},
			// 	{text:'14:00-18:00'},
			// 	{text:'20:00-22:00'},
			// 	{text:'随时都可以'},
			// ]},
			// ],
			quesList: [],
			submitLoading: false,
			activeIndex: 0,
			id: '',
			userInfo: {},
			showUserSetting: false,
			logoutShow:false,
			destroyShow:false
		}
	},
	methods: {
		rightClick() {
			// uni.navigateTo({
			// 	url: '/pages/center/index'
			// })
			this.showUserSetting = !this.showUserSetting
		},
		tap(i, id) {
			this.list[i].check = id

			let query = {
				id: this.id,
				type: 'user'
			}
			this.list.map((item) => {
				query[item.key] = item.check
			})
			
			saveInfo(query).then(res => {
				
			})
		},
		submit() {
			let query = {
				id: this.id,
				type: 'user'
			}
			this.list.map((item) => {
				query[item.key] = item.check
			})
			this.submitLoading = true
			saveInfo(query).then(res => {
				this.submitLoading = false
			})
		},
		getUserInfo() {
			let query = {
				id: this.id,
				type: 'user'
			}
			getUser(query, { showMessage: true }).then(res => {
				this.userInfo = res
				this.list = this.list.map((item) => {
					item.check = this.userInfo[item.key] > 0 ? this.userInfo[item.key] : item.check
					return item
				})
			})
		},
		goAbout(){
			this.showUserSetting = false
			uni.navigateTo({
				url: '/pages/center/about'
			})
		},
		logoutConfirm: function () {
			this.logoutShow = true
			this.showUserSetting = false
		},
		destroyConfirm() {
			this.destroyShow = true
			this.showUserSetting = false
		},
		destroy() {
			deleteUser().then(res => {
				this.logout()
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
	},
	onLoad: function (query) {
		let info = uni.getStorageSync('userinfo');
		this.id = info.id
		
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
	onShow: function () {
		this.ws.checkNetwork(this)
		this.ws.pageFun(this.pageDataLoad, this);
		this.getUserInfo()
	},
}
</script>

<style lang="scss">
.mian {
	width: 100vw;
	height: 100vh;
	position: relative;
	.box {
		margin-top: 10px;
		background: #fff;
		padding: 20rpx 40rpx 0 40rpx;

		.cell_text {
			display: flex;
			justify-content: space-between;
			padding: 30rpx 20rpx;
			border-bottom: 1px solid #eee;
			color: #333;
			font-size: 26rpx;

			.text {
				max-width: calc(100% - 30px);
			}
		}

		.title {
			font-weight: 600;
		}
	}

	.but-box {
		width: 100%;
		padding: 20px;
		box-sizing: border-box;
		padding-bottom: 50px;
	}

	.but {
		width: 50%;
		text-align: center;
		height: 38px;
		line-height: 38px;
		background-color: #00328f;
		color: #fff;
		border-radius: 5px;
		margin: 0 auto;
	}
}

.header {
	background: #fff;
	margin-top: 1px;

	.mr_10 {
		margin-right: 10px;
	}

	.nickname {
		display: flex;
		align-items: center;
		font-size: 30rpx;
		margin-bottom: 15rpx;

	}

	.birthday {
		color: #999;
		font-size: 12px;
	}

	.sex {
		// position: absolute;
		// right: 15rpx;
		// top: 15rpx;
		display: inline-block;
		margin-left: 10rpx;
	}
}</style>
