<template>
	<view class="login_box" id="main_body">
		<u-navbar class="app_navbar" :placeholder="true" leftIconColor="#00328f" >
			<view slot="left"></view>

			<view slot="right" class="nav_right" @click="goRegister">
				<view style="color: #3246D2;" class="r fz_14 ">Register</view>
			</view>
		</u-navbar>
		<view  class="mian">
	         <view class="mian_content">
	         	 <view class="">
	         	 	<uni-view data-v-7be3dab0="" style="font-size: 28px; font-weight: 600;">Login Method</uni-view>
	         	 </view>
	         	 <view class="login_type clearfix mt_20" style="padding: 10px 0;margin-bottom: 20px;" v-if="form.type != 3">
	         	 	<view class="l fz_14 cus_p"  style="margin-right: 30rpx;" :class="{'active_type': form.type == 2}" @click="tabFormType(2)">Password
	         	 	</view>
	         	 	<view class="l fz_14 cus_p ml_20" :class="{'active_type': form.type == 1}" @click="tabFormType(1)">
	         	 		Verification Code
					</view>
	         	 </view>
	         	 <u--form :model="form" class="login-form" style="padding-top: 0; padding-bottom: 100px;" label-width="auto"
	         	 	ref="uForm">
	         	 	<!-- 邮箱 -->
	         	 	<u-form-item prop="email" label="Email  :">
	         	 		<view class="common_input w_100">
	         	 			<input-autocomplete class="unit-item__input" :value="form.email" v-model="form.email"
	         	 				highlightColor="#FF0000" :loadData="loadAutocompleteData"></input-autocomplete>
	         	 		</view>
	         	 	</u-form-item>
	         	 	<!-- 验证码登录 -->
	         	 	<template v-if="form.type == 1">
							<!-- code 验证码 -->
							<u-form-item prop="code" label="Code  :">
								<view class="code_box">
									<view class="common_input w_100 " style="display: flex;align-items: center;">
										<u--input v-model="form.code" border="none" clearable type="number" maxlength="4" style="flex:1"
											:customStyle="{'font-size': '18px', 'color': '#000'}"></u--input>
											
									</view>
									<u-button class="get_code fz_12" type="primary" size="mini" @click="getCode"
									style="position: absolute;">{{codeTips}}</u-button>
								</view>
							</u-form-item>
							<!-- 获取验证码登录 -->
							<!-- <view class="tr" style="width: 100px; ">
								<u-button class="get_code fz_12" type="primary" size="mini" @click="getCode"
									style="position: absolute;">{{codeTips}}</u-button>
							</view> -->
	         	 	</template>
	         	 	<!-- 密码登录 -->
	         	 	<template v-if="form.type == 2">
	         	 		<u-form-item prop="password" label="Password  :">
	         	 			<view class="common_input w_100" v-show="!form.showPassword">
								<!-- #ifndef APP-NVUE -->
								<u-input class="login_input" v-model="form.password" border="none"
	         	 					type="text" maxlength="20">
								<!-- #endif -->
								<!-- #ifdef APP-NVUE -->
								<u--input class="login_input" v-model="form.password" border="none"
								type="text"  maxlength="20">
								<!-- #endif -->
									<template slot="suffix">
										<u-icon name="eye" size="24" class="cus_p"  @click="eye"></u-icon>
									</template>
								<!-- #ifndef APP-NVUE -->
								</u-input>
								<!-- #endif -->
								<!-- #ifdef APP-NVUE -->
								</u--input>
								<!-- #endif -->
	         	 			</view>
							  <view class="common_input w_100" v-show="form.showPassword">
								<!-- #ifndef APP-NVUE -->
								<u-input class="login_input" v-model="form.password" border="none"
	         	 					type="password" maxlength="20">
								<!-- #endif -->
								<!-- #ifdef APP-NVUE -->
								<u--input class="login_input" v-model="form.password" border="none"
								type="password"  maxlength="20">
								<!-- #endif -->
									<template slot="suffix">
	         	 						<u-icon name="eye-fill" size="24"  class="cus_p"  @click="eye"></u-icon>
									</template>
								<!-- #ifndef APP-NVUE -->
								</u-input>
								<!-- #endif -->
								<!-- #ifdef APP-NVUE -->
								</u--input>
								<!-- #endif -->
	         	 			</view>
	         	 		</u-form-item>
	         	 	</template>
					
	         	 	<!-- submit按钮 -->
	         	 	<view class="tc" style="margin-top: 40rpx;">
						
	         	 		<u-button class="login_submit"
	         	 			@click="submit" :ripple="true" :disabled="loginFormButtonDisabled">
	         	 			Login
	         	 		</u-button>
	         	 		<!-- <view class="clearfix">
	         	 			<view style="color: #3246D2;" class="r fz_14 cus_p mt_10" @click="goRegister">Register</view>
	         	 			<u--image class="cus_p r" style="margin-top: 7px; margin-right: 5px;" :showLoading="true"
	         	 				src="/static/icon/right_icon.png" width="24px" height="24px" @click="goRegister"></u--image>
	         	 		</view> -->
						  <view class="no_phone">No email to log in with <navigator url="/pages/center/login_up" class="link_phone">phone number</navigator></view>
	         	 	</view>
	         	 <u-code seconds="60" class="fz_12 " ref="uCode" start-text="Get Verify Code" endText="Reacquire"
	         	 	change-text="X seconds" @change="codeChange"></u-code>
	         	 </u--form>
	         </view>
		</view>
		<view class='app_modal' v-if="isapplogin">
			<u-loading-icon size="36"></u-loading-icon>
		</view>
	</view>
</template>

<script>
	import {getCode,loginEmail} from '@/api/user';
	import inputAutocomplete from '@/components/input-autocomplete/input-autocomplete.vue';
	import {emails,ruleData} from '@/common/tool';

	export default {
		data() {
			return {
				tabIndex: 1,
				isapplogin: false,
				isLogin: true,
				form: {
					email: '',
					username: '',
					password: '',
					type:1,
					showPassword:true
				},
				codeTips: 'Get Verify Code',
				loginFormButtonDisabled:false,
			}
		},
		components: {
			inputAutocomplete
		},

		onLoad(query) {
			
		},
		methods: {
			leftClick() {
				uni.navigateBack()
			},
			tabFormType(type){
				this.form.type = type
			},
			tab: function(index) {
				this.tabIndex = index
			},
			leftClick: function() {
				this.isLogin = true;
				uni.removeStorageSync('isLogin');
			},
			eye(){
				this.form.showPassword = !this.form.showPassword
			},
			tabFormType(v) {
				if (v == this.form.type) {
					return
				}
				this.form.type = v
				this.form.password = ''
				this.form.showPassword = false
				this.form.verify_password = ''
				this.form.showVerifyPassword = false
				this.form.code = ''
			},
			getCode: function() {
				console.log('11111')
				var that = this
				if (!that.form.email) {
					that.$u.toast('Please enter email');
					return ;
				}
				if (!ruleData.email.test(that.form.email)) {
					that.$u.toast('Please enter the correct email address');
					return ;
				}
				if(that.$refs.uCode.canGetCode) {
					uni.showLoading({
						title: 'Getting verification code',
						mask: true
					});
					getCode({
						utype: '1',
						email: that.form.email
					}).then(res => {
						uni.hideLoading();
						that.$u.toast('Verification code has been sent');
						that.$refs.uCode.start();
					}).catch(res => {
						that.$u.toast('Request failed, please try again！');
					})
				} else {
					that.$u.toast('Send after countdown');
				}
			},
			codeChange(text) {
				this.codeTips = text;
			},
			submit() {
				var that = this
				if (!ruleData.email.test(that.form.email)) {
					that.$u.toast('Please enter the correct email address');
					return ;
				}
				if (!that.form.email) {
					that.$u.toast('Pleace enter the email');
					return
				}
				if (this.form.type == 1) {
					if (!that.form.code) {
						that.$u.toast('Pleace enter the code');
						return
					}
					if (that.form.code.length !== 4) {
						that.$u.toast('The length of verification code is less than 4 digits');
						return
					}
				} 
				else if(this.form.type == 2){
					if (!that.form.password) {
						that.$u.toast('Pleace enter the password');
						return
					}
					if (that.form.password.length<8) {
						that.$u.toast('Password is too short');
						return
					}
				}
				let jsonData = {}
				if (this.form.type == 1) {
					jsonData = {
						email: that.form.email,
						utype: 2,
						code: that.form.code
					}
				} else if (this.form.type == 2) {
					jsonData = {
						email: that.form.email,
						utype: 2,
						password: that.form.password
					}
				}
				uni.showLoading({ title: 'Login...', mask: true});
				jsonData.tab = this.form.type
					loginEmail(jsonData).then(res => {
						that.loginFormButtonDisabled = false
						let imInfo = res.im_info
						uni.setStorageSync('userinfo', imInfo);
						uni.setStorageSync('appinfo', res);
						that.ws.init(imInfo.token, imInfo.auth_token)
						uni.reLaunch({
							url: '/pages/index/index'
						})
						uni.hideLoading();
					}).catch(res => {
						setTimeout(() => {
							that.loginFormButtonDisabled = false
							uni.hideLoading();
						}, 500);
					})
			},
			goRegister: function() {
				uni.navigateTo({
					url: '/pages/center/register_up'
				})
			},
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

<style lang="scss">
	.login_box {
		margin: 0 auto;
		background-color: $--bg-color;
		width: 100%;
		height: 100%;
        .mian{
			width: 100%;
			// height: 100%;
			display: flex;
			// align-items: center;
			margin-top: 60rpx;
			justify-content: center;
			.mian_content{
				padding: 0 20px;
				width: 100%;
			}
			.login-form {
				display: block;
				padding-top: 140rpx;
				margin: 0 auto;
			}
			.u-form-item{
				border-bottom: 1px solid #DDDDDD;
			}
			.login-bg-xl {
				width: 100%;
			}
			::v-deep .uni-input-input{
				border-bottom-style: none !important;
			}
			.u-form-item{
				border-bottom: 1px solid #DDDDDD;
			}
			.login_submit{
				margin-top: 30rpx;
				border-color: #00328e;
				background-color: #00328e;
				color: #fff;
				font-size: 28rpx;
				font-weight: 900;
				width: 100% !important;
				padding: 16rpx 32rpx !important;
			}
			.get_code{
				margin-top: 10rpx;
				background-color: transparent !important;
				color: #000 !important;
				position: relative !important;
    			flex-shrink: 0;
				letter-spacing: 0px !important;
				// right: 15%;
				z-index: 99;
				
			}
		}
		.code_box{
			width:100%;
			display: flex;
			justify-content: space-between;
		}
		.active_type{
			position: relative;
			color: #3246D2;
			&:before{
				position: absolute;
				content: '';
				width: 60%;
				height: 2px;
				background-color: #3246D2;
				bottom: -4px;
				left: 50%;
				transform: translate(-50%);
	        }
	
        }
		::v-deep .u-form-item__body__left__content__label{
			font-weight: 600;
		}
    }
	.no_phone{
		color:#999;
		font-size: 12px;
		margin-top:5px;
		display: flex;
	}
	.link_phone{
		padding: 0 5px;
		color: #3246D2;
		text-decoration: underline;
	}
</style>
