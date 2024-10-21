<template>
	<view class="login_box" id="main_body">
		<u-navbar class="app_navbar" :placeholder="true" leftIconColor="#00328f">
			<view slot="left"></view>

			<!-- <view slot="right" class="nav_right" @click="goRegister">
				<view style="color: #3246D2;" class="r fz_14 ">Register</view>
			</view> -->
		</u-navbar>
		<view  class="mian">
	         <view class="mian_content">
	         	 <view class="">
	         	 	<uni-view data-v-7be3dab0="" style="font-size: 28px; font-weight: 600;">Login / Register</uni-view>
	         	 </view>
	         	 <u--form :model="form" class="login-form" style="padding-top: 0; padding-bottom: 100px;" label-width="auto"
	         	 	ref="uForm">
	         	 	<u-form-item prop="mobile" label="Mobile  :">
	         	 		<view class="common_input w_100">
							<span class="area">+(63)</span>
							<u-input ref="inputref" v-model="form.mobile" border="none" clearable type="number" @focus="focus" :focus="focusInput" style="flex:1"
										:customStyle="{'font-size': '18px', 'color': '#000'}"></u-input>
	         	 		</view>
	         	 	</u-form-item>
					<!-- code 验证码 -->
					<u-form-item prop="code" label="Code  :">
						<view class="code_box">
						<view class="common_input w_100 ">
							<u--input v-model="form.code" border="none" clearable type="number" maxlength="4" style="flex:1"
								:customStyle="{'font-size': '18px', 'color': '#000'}"></u--input>
								
						</view>
						<u-button class="get_code fz_12" type="primary" size="mini" @click="getCode"
							style="position: absolute;">{{codeTips}}</u-button>
						</view>
					</u-form-item>
	         	 	
	         	 	<!-- submit按钮 -->
	         	 	<view class="tc" style="margin-top: 40rpx;">
						
	         	 		<u-button class="login_submit"
	         	 			@click="submit" :ripple="true" :disabled="loginFormButtonDisabled" :loading="loginFormButtonDisabled">
	         	 			Login
	         	 		</u-button>
						<view class="no_phone">  <navigator url="/pages/center/login"> Log in to email</navigator></view>
	         	 	</view>
					<view class="footer">
						Sign in and agree to the <navigator url="/pages/center/agree" class="link_phone">user agreement</navigator> 
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
	import {sendsmsCode,loginMobile} from '@/api/user';
	import { chatStart} from '@/api/facebookTool';
	import inputAutocomplete from '@/components/input-autocomplete/input-autocomplete.vue';
	import {emails,ruleData} from '@/common/tool';

	export default {
		data() {
			return {
				tabIndex: 1,
				isapplogin: false,
				isLogin: true,
				form: {
					mobile: '',
					utype:2,
					code:'',
				},
				codeTips: 'Get Verify Code',
				loginFormButtonDisabled:false,
				focusInput:true,
			}
		},
		components: {
			inputAutocomplete
		},

		onLoad(query) {
			
		},
		onReady(){
			this.$nextTick(() => {
				
					this.$refs.inputref.onFocus();
					this.focusInput = true
					
			})
		},
		
		methods: {
			focus(){
				this.$nextTick(() => {
					// this.$refs.inputref.focus()
					this.focusInput = true
				})
			},
			getCode: function() {
				console.log('11111',this.form)
				var that = this
				if (!that.form.mobile) {
					that.$u.toast('Please enter mobile');
					return ;
				}
				let phoneRule = /^(9|09|\+36)\d{8,9}$/
				if (!phoneRule.test(that.form.mobile)) {
					that.$u.toast('Please enter the correct phone number');
					return ;
				}
				if(that.$refs.uCode.canGetCode) {
					uni.showLoading({
						title: 'Getting verification code',
						mask: true
					});
					sendsmsCode({
						utype: '2',
						mobile: that.form.mobile
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
				let phoneRule = /^(9|09|\+36)\d{8,9}$/
				if (!phoneRule.test(that.form.mobile)) {
					that.$u.toast('Please enter the correct phone number');
					return ;
				}
				if (!that.form.code) {
					that.$u.toast('Pleace enter the code');
					return
				}
				if (that.form.code.length !== 4) {
					that.$u.toast('The length of verification code is less than 4 digits');
					return
				}	
				let reginfo = uni.getStorageSync('reginfo')
				let chatinfo = uni.getStorageSync('chatInfo');
				if(reginfo){
					that.form.uid = reginfo.uid
				}
				that.loginFormButtonDisabled = true
				loginMobile(that.form).then(res => {
					
					let imInfo = res.im_info
					uni.setStorageSync('userinfo', imInfo);
					uni.setStorageSync('appinfo', res);
					that.ws.init(imInfo.token, imInfo.auth_token)
					uni.setStorageSync('reginfo', '');
					if(chatinfo){
						that.goChat(chatinfo)
					}else{
						that.loginFormButtonDisabled = false
						uni.reLaunch({
							url: '/pages/index/index'
						})
					}
					uni.hideLoading();
				}).catch(res => {
					setTimeout(() => {
						that.loginFormButtonDisabled = false
						uni.hideLoading();
					}, 500);
				})
			},
			goChat(item) {
				uni.showLoading({
					title: ''
				});
				chatStart({ jobid: item.id }).then(res => {
					this.loginFormButtonDisabled = false
					uni.navigateTo({
						url: '/pages/session-info/session-info?id='
							+ res.session_id + '&resume_id=' + res.resume_id
							+ '&talent_id=' + res.talent_id + '&apply_id=' + res.apply_id +
							'&companyname=' + item.companyname + '&jobname=' + item.jobname + '&jobid=' + item.id + '&platform=link'
					})
					uni.setStorageSync('chatInfo', '');
					uni.hideLoading()
				}).catch(err => {
					uni.hideLoading()
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
		color:#909399;
		font-size: 12px;
		margin-top:5px;
		display: flex;
	}
	.footer{
		padding: 8px 0;
		font-size: 8px;
		color: #909399;
		position: fixed;
		bottom: 20px;
	}
	.link_phone{
		
		padding: 0 5px;
		color: #3246D2;
		text-decoration: underline;
		display: inline;
	}
	.common_input{
		display: flex;
		align-items: center;
		.area{
			margin-right: 10px;
		}
	}
</style>
