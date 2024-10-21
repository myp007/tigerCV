<template>
	<view class="send_index" id="main_body">
		<!-- 提示 -->
		<u-toast ref="uToast"></u-toast>
		<!-- 顶部导航栏start -->
		<u-navbar class="app_navbar" height="56px" :placeholder="true" leftIconColor="#00328f">
			<view slot="left" class="nav_title">
				<u-icon name="arrow-left" color="#00328f" size="22" @click="goBack"></u-icon>
			</view>
			<view slot="right" class="nav_right" @click="goHistroy"
			    style="padding-right: 10px;color: #00328f;font-size: 16px;">
				HISTORY
			</view>
		</u-navbar>
		<!-- 顶部导航栏end -->
		<view v-if="skeletonLoading"  class="skeleton_detail">
		    <u-skeleton style="margin-bottom: 40rpx;" rows="4" title loading v-for="item in 10" :key="item"></u-skeleton>
		</view>
		<view v-if="!skeletonLoading">
			<view>
				<!-- 主体内容start -->
				<view class="right_view" v-if="!dialog2">
					<view class="content_item">
						<view class="item_title">Send To :</view>
						<view class="item_content">
							<u--form labelPosition="top" labelWidth="auto" :model="row" :rules="rules" ref="form1">
								<!-- 企业者邮箱 -->
								<u-form-item label="Recipient" v-for="(item, index) in row.recipients" :key="index"
									ref="item1" :prop="recipients[index]">
									<view class="common_input w_100">
										<input-autocomplete class="unit-item__input" :value="item.hr_email"
											v-model="item.hr_email" :loadData="loadAutocompleteData"
											highlightColor="#FF0000">
										</input-autocomplete>
									</view>
								</u-form-item>
								<!-- 下拉选择简历列表 -->
								<u-form-item label="Please choose a resume">
									<!-- 下拉选择简历 -->
									<uni-data-select class="form_select" v-model="row.rid" placeholder=" "
										:localdata="resumes" emptyText="No data" @change="onSelectChange"></uni-data-select>
								</u-form-item>
								<!--  岗位-->
								<u-form-item label="Subject:" prop="row.subject" ref="item1">
									<view class="common_input w_100">
										<input-autocomplete class="unit-item__input" :value="row.subject"
											v-model="row.subject" highlightColor="#FF0000"></input-autocomplete>
									</view>
								</u-form-item>
							</u--form>
						</view>
					</view>
					<!-- 简历内容 富文本 -->
					<!-- <view class="container">
						<mpHtml :content="row.content" :editable="editable" ></mpHtml>
						<view v-html="row.content"></view>
						<image :src="row.img" mode="" class="rowimg"></image>
					</view> -->
					
					<!-- <view style="display: flex;justify-content: flex-end;padding: 10px 28px;">
						<view style="border: 2px solid red;border-radius: 50%;opacity: 0.4;" @click="showTip = true">
							<u-icon name="question" style="margin: auto;" color="red"></u-icon>
						</view>
					</view> -->
					<view class="common_input w_100">
						<label for="">Body:</label>
						<textarea height="300" type="textarea" v-model="row.content"  class="textarea w_100"></textarea>
					</view>
					<view style="display: flex;justify-content: flex-end;">
						<view style="border: 2px solid red;border-radius: 50%;opacity: 0.4;" @click="showTip = true">
							<u-icon name="question" style="margin: auto;" color="red"></u-icon>
						</view>
					</view>
					<view class="common_input w_100">
						<label for="">Sender:</label>
						<u--input v-model="row.from" border="bottom"></u--input>
					</view>
				</view>
				<!-- 主体内容end -->

				<!-- 发送成功start -->
				<deliverSuccess v-if="dialog2"></deliverSuccess>
				<!-- 发送成功end -->

				<!-- 提交按钮 start-->
				<view class="sendbtn" @click="submit" v-if="!dialog2">
					<u-button text="SEND" class="custom-style" size="large "></u-button>
				</view>
				<!-- 提交按钮end -->
				
			</view>
			<u-popup :show="showTip" :round="4" mode="center" @close="closeTip" :closeOnClickOverlay="true">
				<view>
					<sendTip :closeTip="closeTip"></sendTip>
				</view>
			</u-popup>
		</view>
        <!-- <app-tabbar :selectvalue="selectvalue"></app-tabbar> -->
	</view>
</template>

<script>
import { getResumeList, sendEmail, fetchEetail } from '@/api/deliver'
import { emails } from '@/common/tool';
import { globalData } from '@/api/common.js'
import mpHtml from '@/components/mp-html/mp-html'
import config from '@/common/config.js'
import { getUserInfo } from '@/api/user.js'
import deliverSuccess from '@/components/deliverSuccess/deliverSuccess'
import sendTip from './popTip/sendTip.vue';
export default {
	components: { mpHtml, deliverSuccess, sendTip },
	data() {
		return {
			skeletonLoading:true,
			showTip: false,
			selectvalue: 'RESUME',
			appinfo: {},
			editable: true,
			select: '',
			dialog2: false,
			resumes: [],
			recipients: ['recipients.hr_email1', 'recipients.hr_email2'],
			row: {
				first_name: '',
				subject: '',
				recipients: [{
					hr_email: '',
					id: ''
				}, {
					hr_email: '',
					id: ''
				}],
				from: '',
				rid: '',
				img: 'https://concat.lietou-static.com/fe-www-pc/v5/images/pages/landingpage/resume-template/resume/3-1.169476d2.png',
				original_img_path: '',
				image_path: '',
				content: '',
				tos: '',
				is_export: '',
				template_id: 'about',
				dear3: 'If you are interested in me, please call me directly or contact me by email. I will reply to you as soon as possible'
			},
			formData: {},
			content: '',
			eliverKey: [],
			rid: '',
			rules: {
				'recipients.hr_email': {
					type: 'string',
					required: true,
					message: 'E-mail is required',
					trigger: ['blur']
				},
				'row.subject': {
					required: true,
					message: "subjuce is required",
					trigger: ['blur']
				}
			}
		}
	},
	onLoad(query) {
		// 判断传过来是否有参数
		if (query) {
			this.rid = query.rid
		}
		this.initData()

	},

	methods: {
		// 初始化代码
		initData() {
			// 获取app本地缓存信息
			this.appinfo = uni.getStorageSync('appinfo')
			// tokne不为真，跳转回登录界面
			if (!this.appinfo.token) {
				uni.redirectTo({
					url: '/pages/center/login'
				})
			}

			// 获取app版本信息/简历默认内容
			this.globalData()
			// 获取用户信息
			getUserInfo({ tonken: this.appinfo.token }).then(res => {
				this.row.from = res.system_email
			})
			this.content = uni.getStorageSync('EmailContent')
		},

		closeTip() {
			this.showTip = false
		},
		// 返回上一页
		goBack() {
			// uni.$u.route({
			// 	type: 'navigateBack',
			// })
			uni.switchTab({
				url: '/pages/resume/index'
			})
		},
		// 跳转历史发送简历记录
		goHistroy() {
			uni.$u.route({
				url: 'pages/resume/record'
			})
		},
		// 获取版本信息
		globalData() {
			globalData().then(res => {
				// 默认富文本简历初始化信息
				if (res) {
					// 简历默认内容
					// this.content = res.eliverTemplate || []
					// 简历默认参数
					this.eliverKey = [...res.eliverKey]
					this.getResumeList()
				}
			})
		},

		// 发送简历
		submit() {
			let reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
			if (this.row.recipients[0].hr_email == '') {
				this.$refs.uToast.show({
					type: 'default',
					message: "E-mail is required"
				})
				return
			}
			if ( !reg.test(this.row.recipients[0].hr_email)) {
				this.$refs.uToast.show({
					type: 'default',
					message: "Incorrect email format"
				})
				return
			}
			if (this.row.recipients[1].hr_email && !reg.test(this.row.recipients[1].hr_email)) {
				this.$refs.uToast.show({
					type: 'default',
					message: "Incorrect email format"
				})
				return
			}
			if (this.row.recipients[0].hr_email == this.row.recipients[1].hr_email) {
				this.$refs.uToast.show({
					type: 'default',
					message: "E-mail is duplicate"
				})
				return
			}
			let jsonData = JSON.parse(JSON.stringify(this.row))
			jsonData.rid = jsonData.rid.split ? jsonData.rid.split('_')[0] : jsonData.rid;
			sendEmail(jsonData).then(res => {
				uni.setStorageSync('EmailContent',jsonData.content)
				this.dialog2 = true
			})
		},
		// 获取简历列表,下拉操作选择简历列表,选择默认简历
		getResumeList() {
			getResumeList().then(res => {
				console.log(res)
				if (res) {
					// 对获取回来数组数据进行修改
					res.forEach((v, index) => {
						// 为0禁用选中
						if (v.is_export == 0) {
							v.disable = true
						}
						// 选中值
						v.value = v.value + '_' + index
						if (v.occupation) {
							// 显示文本
							v.text = v.text + ` - ${v.occupation}`
						}
					});
					// 赋值
					this.resumes = res
					if (this.rid) {
						this.onSelectChange(this.rid)
					} else {
						this.getLasetResume()
					}
				}
				// 强制组件重新渲染
				this.$forceUpdate()

				// this.getLasetResume()
			})
		},
		onSelectChange(e) {
			if (!e) {
				return
			}
			let id = ''
			let row = ''
			e.split ? id = e.split('_')[0] : id = e
			if (e.indexOf('_') == -1) {
				let selectRid = ''
				row = this.resumes.filter(item => {
					return item.value.split('_')[0] === e
				})[0]
				this.row.rid = row.value
			} else {
				row = this.resumes.filter(item => {
					return item.value === e
				})[0]

			}


			if (!row || row.is_export == 0) return
			this.row.first_name = row.first_name + ' ' + row.last_name
			fetchEetail(id).then(res => {
				let resData = res
				let eliverData = {
					occupation: resData.basics.occupation,
					phone: resData.basics.phone,
					email: resData.basics.email,
					username: resData.basics.first_name + ' ' + resData.basics.last_name,
					facebook: resData.basics.facebook,
					salary: resData.basics.salary,
					age: resData.basics.age,
					position_city: resData.basics.position_city
				}
				let content = this.content
				this.row.is_export = resData.basics.is_export
				let replaceKeys = this.eliverKey || []
				replaceKeys.forEach(key => {
					content = content.replace(new RegExp(`【${key}】`, 'gm'), eliverData[key])
				});
				this.row.content = content
				this.row.img = config.imgUrl + '/upload/tool/resume/' + resData.basics.template_id + '.png'
				if (row.image_path != '') {
					this.row.img = row.image_path
				}
				this.row.original_img_path = row.original_img_path
				this.row.is_export = row.is_export
				// 报错
				if (row.is_export == 0) {
					this.$refs.uToast.show({
						type: 'default',
						message: 'Resume not exported after update'
					})
				}
				row.age = resData.basics.age
				row.sex = resData.basics.sex
				this.skeletonLoading = false
				this.setSubject(row)
			})
		},
		// 岗位
		setSubject(row) {
			//岗位，期望工资，年龄，性别，姓名
			let subject = ''
			if (row.occupation != '' && row.occupation !== null) {
				subject += row.occupation
			}

			if (row.salary != '') {
				subject += ' | ₱' + row.salary
			}

			if (row.age != '') {
				subject += ' | age ' + row.age
			}

			if (row.sex != '') {
				subject += ' | sex ' + (row.sex == 1 ? 'Male' : 'Female');
			}
			subject += ' |  ' + row.first_name + ' ' + row.last_name
			this.row.subject = subject
		},
		// 默认简历模板
		getLasetResume() {
			for (let i = this.resumes.length - 1; i >= 0; i--) {
				let item = this.resumes[i];
				// 判断是否导出
				if (item['is_export'] != 0) {
					// 最后一份有模板的简历
					this.row.rid = item.value
					this.onSelectChange(item.value)
					return
				}
			}
		},
		// 邮箱格式  自动填充后缀
		loadAutocompleteData(string) {
			let resList = [];
			if (string != null) {
				var index = string.indexOf('@')
				if (index != -1) {
					string = string.substr(0, index)
				}
			}
			emails.forEach(e => {
				resList.push(string + e)
			});
			return Promise.resolve(resList);
		},
	}
}
</script>

<style lang="scss" scoped="scoped">
.send_index {
	background-color: #fff;
	font-family: "Roboto", sans-serif;
    .skeleton_detail{
		padding: 20px;
	}
	.sendbtn {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 56px;
		z-index: 999;
		background-color: #fff;

		.u-button {
			width: 100% !important;
			height: 56px;
			line-height: 56px;
			border-radius: 0 !important;
		}
	}

	.custom-style {
		width: 100%;
		height: 100%;
		color: #fff;
		background-color: #00328f;
	}

	.app_navbar {
		position: relative;

		::v-deep .u-navbar__content__left {
			padding: 0 20px !important;

		}
	}

	::v-deep .uni-select__selector {
		z-index: 9999;
	}

	.right_view {
		padding: 20px 25px;
		overflow-y: auto;
		background-color: #fff;
		margin-bottom: 80px;
	}

	.content_item {
		.item_title {
			padding: 10px 0;
			font-size: 22px;
			font-weight: 600;
		}

		.item_content {
			position: relative;
			margin-bottom: 10px;
			padding-top: 1em;
		}

		.item-form {
			position: relative;
			margin-bottom: 10px;
			margin-left: 6px;
			padding-left: 20px;
			padding-right: 20px;
			padding-top: 1em;
			border-left: 1px solid rgba(000, 000, 000, 0.2);

			.form-hr {
				width: 100%;
				height: 1px;
				background-color: rgba(118, 118, 118, 1);
				margin-bottom: 10px;
			}

			.name {
				display: flex;
				justify-content: space-between;

				.name-middle {
					width: 16px;
				}
			}

			.item-show {
				padding: 0px 0 10px;
				display: flex;
				align-items: center;

				.show-left {
					flex: 1;

					.show-title {
						font-size: 16px;
						font-weight: 600;
						display: flex;
						flex-wrap: wrap;
						justify-content: space-between;
						align-items: center;

						.show-education {
							width: 100%;
							color: rgba(0, 0, 0, 0.6);
							font-size: 12px;
							font-weight: 400;
						}
					}

					.show-msg {
						margin-top: 4px;
						font-size: 13px;
						color: gray;
						display: flex;
						justify-content: space-between;
						align-items: center;
					}

					.show-remarks {
						margin-top: 4px;
						font-size: 16px;
						color: gray;
						white-space: pre-line;
					}
				}

				.show-right {
					width: 50px;
				}
			}

			.add-rsm {
				height: 40px;
				line-height: 40px;
				text-align: right;
			}
		}

		.item-photo {
			padding-bottom: 10px;

			.photo-title {
				margin: 20px 0 10px 0;
				font-size: 16px;
				font-weight: 600;
			}

			.photo-msg {
				color: gray;
				font-size: 14px;
				margin-bottom: 10px;

				p {
					line-height: 22px;
					margin: 0%;
					font-style: italic;
				}
			}

			.pic {
				width: 100px;
				height: 100px;
				overflow: hidden;
				border-radius: 50%;
				position: relative;
				margin: 0 auto;
				margin-bottom: 20px;
				margin-top: 20px;

				img {
					width: 100%;
					height: 100%;
				}
			}

			.rsm-select {
				width: 100%;
				display: flex;
				padding-bottom: 127px;
			}
		}
	}

	.container {
		position: relative;
		padding: 2em 1em;
		width: calc(100% - 50px);
		height: auto;
		min-height: 200px;
		text-align: center;
		margin-bottom: 20px;
		box-shadow: 0px 0px 25px #888888;
		padding-top: 15px;
		margin: 0 25px;

		.rowimg {
			width: calc(100% - 50px) !important;
			margin-top: 5px;
		}

		::v-deep p {
			margin-bottom: 10px !important;
			color: #333333;
			font-weight: 700;
		}

		::v-deep div {
			color: #333333;
			font-weight: 700;
		}

		::v-deep span {
			font-size: 12px !important;
		}
	}

	#editor {
		width: 100%;
		height: 300px;
	}


}
.textarea{
	border:1px solid #dadbde;
	padding:10rpx;
	margin: 20rpx auto;
	box-sizing: border-box;
}
</style>
