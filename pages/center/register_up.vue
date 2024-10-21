<template>
	<view class="register-box" id="main_body">
		<!-- 提示 -->
		<u-toast ref="uToast"></u-toast>
		<u-navbar class="app_navbar" :placeholder="true" leftIconColor="#00328f" >
			<view slot="left"></view>

			<view slot="right" class="nav_right" @click="goLogin">
				<view style="color: #3246D2;" class="r fz_14">Log  in</view>
			</view>
		</u-navbar>
		<view class="mian">
			<view class="mian_content">
				<uni-view data-v-7be3dab0="" style="font-size: 28px; font-weight: 600;margin-bottom: 40rpx;">Register</uni-view>
				<u--form :model="form" class="login-form" style="padding-top: 0; padding-bottom: 100px;"
					label-width="auto" ref="uForm">
					<!-- 邮箱 -->
					<u-form-item prop="email" label="Email  :">
						<view class="common_input w_100">
							<input-autocomplete class="unit-item__input" :value="form.email" v-model="form.email"
								highlightColor="#FF0000" :loadData="loadAutocompleteData"></input-autocomplete>
						</view>
					</u-form-item>
					<!-- 密码 -->
					<u-form-item prop="password" label="Password  :">
						<u-input v-show="!form.showPassword" class="login_input" v-model="form.password" border="none"
							type="text" maxlength="20">
							<template slot="suffix">
								<u-icon name="eye" size="24"  class="cus_p" @click="eye"></u-icon>
							</template>
						</u-input>
						<u-input v-show="form.showPassword" class="login_input" v-model="form.password" border="none"
							type="password" maxlength="20">
							<template slot="suffix">
								<u-icon name="eye-fill" size="24"  class="cus_p" @click="eye"></u-icon>
							</template>
						</u-input>
					</u-form-item>
					<view style="color: #3246D2; font-size: 24rpx;">Use 8 or more characters with a mix of letters, numbers </view>

					<!-- 获取验证码 -->
					<view class="clearfix"
						style="font-style: normal;font-size: 14px;line-height: 30px; margin-top: 20px;margin-bottom: 10px;height: 30px;">
						Verification Code
						<view class="tr r">
							<u-code :seconds="60" ref="uCode" startText="Get Verify Code" changeText="X seconds"
								endText="Reacquire" @change="codeChange"></u-code>
							<u-button style="margin: 0;" class="get_code" type="primary" size="mini" @click="getCode">
								{{codeTips}}</u-button>
						</view>
					</view>

					<!-- 验证码框 -->
					<view>
						<u-form-item prop="code" label="Code  :">
							<u--input class="login_input" v-model="form.code" border="none" type="number" maxlength="4">
							</u--input>
						</u-form-item>
					</view>
					<view class="check_view">
						<checkbox-group @change="checkChange">
							<checkbox color="#3c9cff" style="transform:scale(0.7)" :checked="registerCheck" />
						</checkbox-group>
						Selecting means agreeing
						<view class="link" @click="goAgree">User Agreement</view>
					</view>
					<!-- submit按钮 -->
					<view class="tc" style="margin-top: 60rpx;">
						<u-button class="Register_submit"
							@click="submit" :ripple="true" :disabled="loginFormButtonDisabled">
							Register
						</u-button>
						<!-- <view class="clearfix">
							<view style="color: #3246D2;" class="r fz_14 cus_p mt_10" @click="goLogin">Log  in</view>
							<u--image class="cus_p r" style="margin-top: 7px; margin-right: 5px;" :showLoading="true"
								src="/static/icon/right_icon.png" width="24px" height="24px" @click="goLogin">
							</u--image>
						</view> -->
					</view>

				</u--form>
			</view>
		</view>
	</view>
</template>

<script>
	import {emails,ruleData} from '@/common/tool';
	import { getCode , loginEmail} from '@/api/user'
	export default{
		data(){
			return{
				// 表单数据
				form:{
					email: '',
					password: '',
					showPassword: true,
					code:'',
					showPassword:true,
				},
				timer:null,
				// 获取验证码
				codeTips: 'Get Verify Code',
				// 注册按钮禁用
				loginFormButtonDisabled:false,
				registerCheck:false,
			}
		},
		
		// 方法
		methods:{
			leftClick() {
				uni.navigateBack()
			},
			// 验证码发生变化时
			codeChange(text){
				this.codeTips = text;
			},
			eye(){
				this.form.showPassword = !this.form.showPassword
			},
			goAgree(){
				uni.navigateTo({
					url: '/pages/center/agree'
				})
			},
			goLogin(){
				uni.$u.route({
					url:'/pages/center/login'
				})
			},
			// 获取验证码
			getCode(){
				var that = this
				clearTimeout(that.timer)
				that.timer = setTimeout(()=>{
					if (!that.form.email) {
						this.$refs.uToast.show({
							type:'default',
							message:'Please enter email'
						})
						return ;
					}
					if (!ruleData.email.test(that.form.email)) {
						that.$u.toast('Please enter the correct email address');
						return ;
					}
					uni.showLoading({
						title: 'Getting verification code',
						mask: true
					});
					getCode({
						utype: '2',
						email: that.form.email
					}).then(res => {
						uni.hideLoading();
						that.$u.toast('Verification code has been sent');
						that.$refs.uCode.start();
					}).catch(res => {
						that.$u.toast('Request failed, please try again！');
						uni.hideLoading();
					})
				},1000)
			},
			checkChange(){
				this.registerCheck = !this.registerCheck
			},
			// 注册账号
			submit(){
				var that = this
				clearTimeout(that.timer)
				that.timer = setTimeout(()=>{
					if (!that.form.email) {
						this.$refs.uToast.show({
							type:'default',
							message:'Pleace enter the email'
						})
						return
					}
					if (!ruleData.email.test(that.form.email)) {
						this.$refs.uToast.show({
							type:'default',
							message:'Please enter the correct email address'
						})
						return ;
					}
					if (!that.form.password) {
						this.$refs.uToast.show({
							type:'default',
							message:'Pleace enter the password'
						})
						return
					}
					if (that.form.password.length < 8) {
						this.$refs.uToast.show({
							type:'default',
							message:'Password is too short'
						})
						return
					}
					if (!that.form.code) {
						this.$refs.uToast.show({
							type:'default',
							message:'Pleace enter the code'
						})
						return
					}
					if(!that.registerCheck){
						this.$refs.uToast.show({
							type:'default',
							message:'Please read and tick the agreement'
						})
						return
					}
					uni.showLoading({
						title: 'Loading...',
						mask: true
					});
					let jsonData = {}
					jsonData = {
						email: that.form.email,
						utype: 2,
						password: that.form.password,
						code: that.form.code
					}
					jsonData.tab = 3
					loginEmail(jsonData).then(res => {
						that.loginFormButtonDisabled = false
						let imInfo = res.im_info
						uni.setStorageSync('userinfo', imInfo);
						uni.setStorageSync('appinfo', res);
						that.ws.init(imInfo.token, imInfo.auth_token)
						uni.reLaunch({
							url: '/pages/index/index'
						})
						uni.hideLoading()
					}).catch(res => {
						setTimeout(() => {
							that.loginFormButtonDisabled = false
							uni.hideLoading()
						}, 500);
					})
				},1000)
			},
			// 自动补充邮箱后缀
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
		},
	}
</script>

<style lang="scss" scoped="scoped">
	.register-box {
		width: 100vw;
		height: 100vh;
		background-color: $--bg-color;
		.mian {
			width: 100%;
			// height: 100%;
			display: flex;
			// align-items: center;
			margin-top: 60rpx;
			justify-content: center;
			.mian_content{
				padding: 0 20px;
				width: 100%;
			
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
				.Register_submit{
					border-color: #00328e;
					background-color: #00328e;
					color: #fff;
					font-size: 28rpx;
					font-weight: 900;
					width: 100% !important;
					padding: 16rpx 32rpx !important;
				}
				.get_code{
					border-color: #00328e !important;
					background-color: #00328e !important;
					color: #fff;
					letter-spacing: 0px !important;
				}
				::v-deep .u-form-item__body__left__content__label{
					font-weight: 600;
				}
				.check_view{
					display: flex;
					align-items: center;
					padding: 15px 0;
					color: #999;
					font-size: 24rpx;
					.link{
						color: rgb(50, 70, 210);
						text-decoration:underline;
						padding-left:5px;
					}
				}
			}
		}
	}
</style>
