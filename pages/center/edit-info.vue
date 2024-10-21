<template>
	<view>
		<u-toast ref="uToast"></u-toast>
		<common :tips='commonTips'></common>
		<u-navbar class="app_navbar" :placeholder="true" leftIconColor="#00328f" @leftClick="leftClick" :title="'Tiger Edit information'">
		</u-navbar>
		<u--form class="info-form">
			<!-- 头像 -->
			<u-form-item label-width="120" label="Head portrait">
				<view>
					<u-upload :fileList="avatarFileList" @afterRead="avatarOnChange" width="160" height="160"
						@delete="avatarOnRemove" multiple :maxCount="1"></u-upload>
				</view>
			</u-form-item>
			<u-form-item label-width="120" label="Nickname">
				<u-input v-model="userInfo.nickname" :placeholder="'Please enter nickname'" border="bottom" />
			</u-form-item>
			<!-- 性别 -->
			<!-- <u-form-item  label-width="120" label="Gender">
				<view class="item">
					<u-picker :show="sexShow" mode="selector" :default-selector="[0]" cancelText="Cancel" confirmText="Confirm"  :columns="[sexColumns]" keyName="value" @confirm="confirmSex" @cancel="cancelSex"></u-picker>
				<view @click="sexShow = true">{{userInfo.gender}}</view>
				</view>
				
			</u-form-item> -->
			<u-form-item label-width="120" label="Gender">
				<uni-data-select class="form_select" v-model="userInfo.gender" placeholder=" "
					:localdata="sexColumns"></uni-data-select>

			</u-form-item>
			<!-- 生日 -->
			<u-form-item label-width="120" label="Birthday">
				<date-input keyName="birthday" placeholder="Please enter birthday" :value="userInfo.birthday" @setValue="setValue"></date-input>	
			</u-form-item>
			<!-- <block v-for="(item, index) in detail" :key="index">
				<u-form-item v-if="item.type == 'input' && item.title !='Email'&& item.title !='Mobile'" label-width="120"
					:label="item.title">
					<u-input :type="item.type" v-model="item.value" :placeholder="'Please enter ' + (item.placeholderTitle ? item.placeholderTitle:item.title)" />
				</u-form-item>
				<u-form-item v-if="item.type == 'select'" label-width="120" :label="item.title">
					<u-picker :show="item.show" cancelText="cancel" confirmText="confirm"  :columns="[item.data]" keyName="value" @confirm="(v)=>{confirmSelect(v,item)}" @cancel="()=>{cancelSelect(item)}"></u-picker>
					<view @click="openSelect(index)">{{item.data[item.value[0]].value}}</view>
				</u-form-item>
				<u-form-item v-if="item.type == 'date'" label-width="120" :label="item.title">
					<u-datetime-picker cancelText="cancel" confirmText="confirm" :closeOnClickOverlay="true" :minDate="17524800000" :maxDate="1786778555000" :show="item.show" mode="date" @confirm="(v)=>{confirmData(v, item)}" @cancel="()=>{cancelSelect(item)}"></u-datetime-picker>
					<view @click="openSelect(index, index)">
						{{item.value[0] + '-' + item.value[1] + '-' + item.value[2]}}
					</view>
				</u-form-item>
			</block> -->
			<u-button :loading="submitButtonStatus" :disabled="submitButtonStatus" class="but" type="primary"
				@click="saveSubmit">{{ submitButtonText }}</u-button>
		</u--form>
	</view>
</template>

<script>
import { getUser, saveInfo } from "@/api/user";
import dateInput from '@/components/date-input/date-input'
var userIdsStr = ''
export default {
	data() {
		return {
			id: 0,
			type: '',
			detail: [],
			openSelectName: false,
			showAvatarUpload: false,
			uploadAction: '',
			uploadFormData: new Object(),
			avatarFileList: [],
			userToken: '',
			avatarFileNumber: 2,
			newAvatar: false,
			submitButtonStatus: false,
			// 保存
			submitButtonText: 'Save',
			commonTips: '',
			userInfo: {},
			sexColumns: [{
				value: 'male',
				text: 'Male'
			}, {
				value: 'female',
				text: 'Female'
			}, {

				value: 'secrecy',
				text: 'Secrecy'
			}],
			sexShow: false,
			birthday:'',
			defaultAvatar: 'data:image/jpg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QMraHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjREMEQwRkY0RjgwNDExRUE5OTY2RDgxODY3NkJFODMxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjREMEQwRkY1RjgwNDExRUE5OTY2RDgxODY3NkJFODMxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NEQwRDBGRjJGODA0MTFFQTk5NjZEODE4Njc2QkU4MzEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NEQwRDBGRjNGODA0MTFFQTk5NjZEODE4Njc2QkU4MzEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAAGBAQEBQQGBQUGCQYFBgkLCAYG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',
		}
	},
	onLoad: function (query) {
		this.id = query.id ? query.id : 0
		this.type = query.type ? query.type : 'user'
		userIdsStr = query.ids ? query.ids : ''
		let userinfo = uni.getStorageSync('userinfo');
		this.userToken = userinfo.token
		this.getUserInfo()
	},
	components: {
		dateInput
	},
	onShow() {
		// this.ws.checkNetwork(this)
	},
	onReady: function (query) {
		var that = this
		that.uploadAction = that.ws.buildUrl('upload', that.userToken)
		// if (this.type == 'create-group') {
		// 	uni.setNavigationBarTitle({
		// 		title: '创建群聊'
		// 	});
		// 	that.showAvatarUpload = true
		// 	that.detail = [{
		// 		title: '群　　名',
		// 		placeholderTitle: '群名',
		// 		type: 'input',
		// 		name: 'nickname',
		// 		value: ''
		// 	},
		// 	{
		// 		title: '群聊简介',
		// 		type: 'textarea',
		// 		name: 'bio',
		// 		value: ''
		// 	},
		// 	{
		// 		title: '加群模式',
		// 		type: 'select',
		// 		name: 'add_mode',
		// 		data: [{
		// 				value: '0',
		// 				name: '需管理员审核',
		// 				extra: '2'
		// 			},
		// 			{
		// 				value: '1',
		// 				name: '无需审核',
		// 				extra: '2'
		// 			}
		// 		],
		// 		value: [0],
		// 		show: false
		// 	},
		// 	{
		// 		title: '邀请免审',
		// 		type: 'select',
		// 		name: 'invite_join_group',
		// 		data: [{
		// 				value: '0',
		// 				label: '成员邀请好友需审核',
		// 				extra: '3'
		// 			},
		// 			{
		// 				value: '1',
		// 				label: '成员邀请好友免审核',
		// 				extra: '3'
		// 			},
		// 		],
		// 		value: [0],
		// 		show: false
		// 	},
		// 	{
		// 		title: '历史消息',
		// 		type: 'select',
		// 		name: 'history_message',
		// 		data: [{
		// 				value: '0',
		// 				label: '不允许新入群用户查看',
		// 				extra: '4'
		// 			},
		// 			{
		// 				value: '1',
		// 				label: '允许新入群用户查看',
		// 				extra: '4'
		// 			},
		// 		],
		// 		value: [0],
		// 		show: false
		// 	},
		// 	{
		// 		title: '成员发言',
		// 		type: 'select',
		// 		name: 'speak',
		// 		data: [{
		// 				value: '0',
		// 				label: '允许发言',
		// 				extra: '5'
		// 			},
		// 			{
		// 				value: '1',
		// 				label: '禁止发言',
		// 				extra: '5'
		// 			},
		// 		],
		// 		value: [0],
		// 		show: false
		// 	},
		// 	{
		// 		title: '检索设置',
		// 		type: 'select',
		// 		name: 'retrieval_settings',
		// 		data: [{
		// 			value: '0',
		// 			label: '禁用搜素加群',
		// 			extra: '6'
		// 		},
		// 		{
		// 			value: '1',
		// 			label: '允许被搜素到',
		// 			extra: '6'
		// 		}],
		// 		value: [0],
		// 		show: false
		// 	}]

		// 	that.submitButtonText = '创建群聊'

		// 	this.ws.pageFun(() => {
		// 		this.ws.send({
		// 			c: 'ImBase',
		// 			a: 'getUploadMultipart'
		// 		});
		// 	}, this)
		// } else {
		// 	// time需要在ready赋值
		// 	this.ws.pageFun(this.pageDataLoad, this);
		// }
		// console.log(this.detail)
	},
	methods: {
		leftClick() {
			uni.switchTab({
				url: '/pages/center/questionnaire'
			})
		},
		cancelSex(e) {
			this.sexShow = false
		},
		confirmSex(e) {
			console.log(e)
			this.sexShow = false
			this.userInfo.gender = e.value[0].value
		},
		setValue(e) {
			this.userInfo[e.key] = e.value
		},
		getUserInfo() {
			let query = {
				id: this.id,
				type: 'user'
			}
			getUser(query).then(res => {
				
				this.userInfo = res

				this.avatarFileList = [{
					url: res.avatar || this.defaultAvatar
				}]
				this.avatarFileNumber = 1
				console.log(this.userInfo)
			})
		},
		saveSubmit() {
			let that = this
			let userInfo = this.userInfo

			if (that.newAvatar) {
				userInfo.avatar = that.newAvatar
			}
			if (!userInfo.nickname) {
				that.$refs.uToast.show({
					title: '',
					message: 'Please enter nickname',
					type: 'error'
				})
				return;
			}
			let query = {
				id: userInfo.id,
				avatar: userInfo.avatar,
				nickname: userInfo.nickname,
				gender: userInfo.gender,
				birthday: userInfo.birthday

			}
			that.submitButtonStatus = true
			saveInfo(query, { showMessage: true }).then(res => {
				that.submitButtonStatus = false
				
			})
			
		},
		openSelect: function () {
			this.openSelect = true

		},
		confirmData: function (value, item) {
			let time = uni.$u.timeFormat(value.value, 'yyyy-mm-dd');
			console.log(time)
			this.detail[this.openSelectName].value = time.split('-')
			item.show = false
			// this.detail[this.openSelectName].value = [
			// 	value.year,
			// 	value.month,
			// 	value.day
			// ]
		},
		confirmSelect: function (value, item) {
			var valueIndex = 0, data = this.detail[value.value[0].extra].data;
			for (var i = 0; i < data.length; i++) {
				if (data[i].value == value.value[0].value) {
					valueIndex = i
				}
			}
			this.detail[value.value[0].extra].value = [valueIndex]
			item.show = false
		},
		cancelSelect: function (item) {
			item.show = false
		},
		pageDataLoad: function () {
			var that = this
			let message = {
				c: 'User',
				a: 'infoDetail',
				data: {
					id: that.id,
					type: that.type,
					method: that.type + '-edit'
				}
			}
			that.ws.send(message);

			that.ws.send({
				c: 'ImBase',
				a: 'getUploadMultipart'
			});
		},
		avatarOnSuccess: function (data) {
			this.newAvatar = this.ws.imgUrl(data.data.fullurl)
			if (this.avatarFileNumber >= 2) {
				this.$refs.uUpload.clear();
				this.avatarFileList = [{
					url: this.newAvatar
				}]
				this.avatarFileNumber = 1
			}
		},
		async avatarOnChange(event) {
			let lists = [].concat(event.file)
			let fileListLen = this.avatarFileList.length
			lists.map((item) => {
				this.avatarFileList.push({
					...item,
					status: 'uploading',
					message: '上传中'
				})
			})
			for (let i = 0; i < lists.length; i++) {
				const result = await this.uploadFilePromise(lists[i].url)
				let item = this.avatarFileList[fileListLen]
				this.avatarFileList.splice(fileListLen, 1, Object.assign(item, {
					status: 'success',
					message: '',
					url: result
				}))
				fileListLen++
			}
			// console.log(res, index, lists)
			// res = JSON.parse(res.data);
			// if (res.code == 1) {
			// 	this.avatarOnSuccess(res)
			// } else {
			// 	this.ws.pageFun(() => {
			// 		this.ws.send({
			// 			c: 'ImBase',
			// 			a: 'getUploadMultipart'
			// 		})
			// 	}, this)

			// 	this.$refs.uUpload.remove(index);

			// 	uni.showModal({
			// 		title: '温馨提示',
			// 		content: res.msg,
			// 		showCancel: false
			// 	})
			// }
		},
		uploadFilePromise(url) {
			return new Promise((resolve, reject) => {
				let a = uni.uploadFile({
					url: this.uploadAction, // 仅为示例，非真实的接口地址
					filePath: url,
					name: 'file',
					formData: {
						user: 'test'
					},
					success: (res) => {
						let resData = JSON.parse(res.data)
						this.newAvatar = resData.data.fullurl
						setTimeout(() => {
							resolve(res.data.data)
						}, 1000)
					}
				});
			})
		},
		avatarOnRemove() {
			this.avatarFileList = []
			this.newAvatar = ''
		},
		submit: function () {
			// 邮箱格式
			var emailReg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
			var that = this
			var values = {};
			for (var i = 0; i < that.detail.length; i++) {
				if (that.detail[i].type == 'date') {
					values[that.detail[i].name] = that.detail[i].value[0] + '-' + that.detail[i].value[1] + '-' +
						that.detail[i].value[2]
				} else if (that.detail[i].type == 'select') {
					values[that.detail[i].name] = that.detail[i].data[that.detail[i].value[0]].value
				} else {
					values[that.detail[i].name] = that.detail[i].value
				}
			}

			if (that.newAvatar) {
				values.avatar = that.newAvatar
			}

			var nicknameErrorTip = '', message = {}
			if (that.type == 'user') {
				nicknameErrorTip = '请输入正确的昵称~'
				values.method = 'post-user-edit'
				values.type = 'user'
				values.id = that.id
				message = {
					c: 'User',
					a: 'infoDetail',
					data: values
				}
			} else if (that.type == 'group') {
				nicknameErrorTip = '请输入正确的群聊名称~'
				values.method = 'post-group-edit'
				values.type = 'group'
				values.id = that.id
				message = {
					c: 'User',
					a: 'infoDetail',
					data: values
				}
			} else if (that.type == 'create-group') {
				nicknameErrorTip = '请输入正确的群聊名称~'
				message = {
					c: 'Message',
					a: 'createGroup',
					data: {
						pickuser: userIdsStr,
						data: values
					}
				}
			}

			if (!values['nickname']) {
				that.$refs.uToast.show({
					title: nicknameErrorTip,
					message: 'Please enter nickname',
					type: 'error'
				})
				return;
			}
			if (values['email']) {
				if (!emailReg.test(values['email'])) {
					that.$refs.uToast.show({
						title: nicknameErrorTip,
						message: 'Please enter the correct email address',
						type: 'error'
					})
					return;
				}
			}
			if (values['mobile']) {
				if (values['mobile'].length > 30) {
					that.$refs.uToast.show({
						title: nicknameErrorTip,
						message: 'Please enter the correct mobile phone number',
						type: 'error'
					})
					return;
				}
			}
			that.submitButtonStatus = true
			that.ws.pageFun(function () {
				that.ws.send(message);
				that.ws.showMsgCallback = function () {
					if (that.type != 'create-group') {
						setTimeout(function () {
							that.submitButtonStatus = false
							that.ws.pageRefresh.centerInfo = true
							uni.navigateBack({
								delta: 1
							})
						}, 2000)
					}
					that.$refs.uToast.show({
						title: nicknameErrorTip,
						message: 'Edit successfully',
						type: 'success'
					})
				}
			}, that)

		}
	}
}
</script>

<style>
page {
	background: #FFFFFF;
}

.info-form {
	display: block;
	width: 92vw;
	margin: 0 auto;
}

.submit-button {
	width: 60vw;
	display: block;
	margin: 40rpx auto;
}

.u-button {
	line-height: 40px;
}

.but {
	width: 50%;
	text-align: center;
	height: 38px;
	line-height: 38px;
	background-color: #00328f;
	color: #fff;
	border-radius: 5px;
	margin: 40rpx auto;
	border: none;
}

.item {
	width: 100%;
	border-bottom: 1px solid #dadbde;
}
</style>
