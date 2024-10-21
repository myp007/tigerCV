<template>
	<view>
		<common :tips='commonTips'></common>
		<u-modal :show="modelShow" @cancel="modelShow = false" :content="modelContent"></u-modal>
		<image class="login-bg" src="../../static/img/login-bg.png" mode="widthFix"></image>
		<view class="register-box">
			<u-form :model="form" class="login-form" label-width="150" :label-style="{textAlign: 'justify', textAlignLast: 'justify', display: 'inline-block', paddingRight:'10px'}" ref="uForm">
				<u-form-item label="账　　号" prop="username">
					<u-input v-model="form.username" placeholder="请输入登录名" name="username" />
				</u-form-item>
				<u-form-item label="密　　码" prop="password">
					<u-input v-model="form.password" :password-icon="true" placeholder="请输入密码" type="password" name="password" />
				</u-form-item>
				<u-form-item label="确认密码" prop="rePassword">
					<u-input v-model="form.rePassword" :password-icon="true" placeholder="请输入确认密码" type="password" name="rePassword" />
				</u-form-item>
				<u-form-item label="手机号码" prop="mobile">
					<u-input v-model="form.mobile" placeholder="请输入手机号" type="number" name="mobile" />
				</u-form-item>
				<u-form-item label="验证码" prop="captcha">
					<u-input placeholder="请输入验证码" v-model="form.captcha" type="text"></u-input>
					<u-button slot="right" type="primary" size="mini" @click="getCode">{{codeTips}}</u-button>
				</u-form-item>
				<u-button :custom-style="registerFormButtonStyle" :ripple="true" :disabled="registerFormButtonDisabled" ripple-bg-color="rgba(45,211,232, 0.8)" shape="circle" @click="submit">注册</u-button>
				<!-- <u-verification-code seconds="60" ref="uCode" @change="codeChange"></u-verification-code> -->
			</u-form>
			
			<view class="login-footer-box">
				<view @click="goLogin" class="login-footer-box-left">返回登录</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					username: '',
					mobile: '',
					password: '',
					rePassword: '',
				},
				rules: {
					mobile: [
						{
							required: true, 
							message: '请输入手机号',
							trigger: ['change', 'blur']
						},
						{
							validator: (rule, value, callback) => {
								return this.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							trigger: ['blur'],
						}
					],
					username: [
						{
							required: true, 
							message: '请输入账号',
							trigger: ['change', 'blur']
						}
					],
					password: [
						{
							required: true,
							min: 6, 
							message: '请输入正确的密码', 
							trigger: 'blur'
						}
					],
					rePassword: [
						{
							required: true,
							message: '请重新输入密码',
							trigger: ['change','blur'],
						},
						{
							validator: (rule, value, callback) => {
								return value === this.form.password;
							},
							message: '两次输入的密码不相等',
							trigger: ['change','blur'],
						}
					]
				},
				registerFormButtonStyle: {
					backgroundImage: "linear-gradient(to bottom right, #34E4E8, #1FAEE8)",
					border: 'none',
					color: '#ffffff',
					outline: 'none',
					marginTop: '80rpx',
					height: '90rpx'
				},
				registerFormButtonDisabled: false,
				modelShow: false,
				modelContent: '',
				codeTips: '获取验证码',
				commonTips: ''
			}
		},
		methods: {
			getCode: function () {
				var that = this
				if (!that.form.mobile) {
					that.$u.toast('请输入手机号');
					return ;
				}
				if(that.$refs.uCode.canGetCode) {
					uni.showLoading({
						title: '正在获取验证码',
						mask: true
					});
					that.$u.post('/api/sms/send', {
						event: 'register',
						mobile: that.form.mobile
					}).then(res => {
						if (res.code == 1) {
							uni.hideLoading();
							that.$u.toast('验证码已发送');
							that.$refs.uCode.start();
						} else {
							that.modelContent = res.msg
							that.modelShow = true
						}
					}).catch(res => {
						that.$u.toast('请求失败，请重试！');
					})
				} else {
					that.$u.toast('倒计时结束后再发送');
				}
			},
			codeChange(text) {
				this.codeTips = text;
			},
			goLogin: function() {
				uni.redirectTo({
					url: '/pages/center/login'
				})
			},
			submit: function(e) {
				var that = this
				that.$refs.uForm.validate(valid => {
					if (valid) {
						that.registerFormButtonDisabled = true
						that.$u.post('/addons/fastim/api.user/register', that.form).then(res => {
							that.registerFormButtonDisabled = false
							if (res.code == 1) {
								uni.setStorageSync('userinfo', res.data.userinfo);
								that.ws.init(res.data.userinfo.token, res.data.userinfo.auth_token)
								uni.switchTab({
									url: '/pages/message/message'
								})
							} else {
								that.modelContent = res.msg
								that.modelShow = true
							}
						}).catch(res => {
							that.registerFormButtonDisabled = false
							that.$u.toast('请求失败，请重试！');
						})
					}
				});
			},
			onReady() {
				this.$refs.uForm.setRules(this.rules);
			},
		}
	}
</script>

<style lang="scss">
page {
	background-color: $--bg-color;
}
.login-bg {
	width: 100vw;
}
.login-form {
	display: block;
	width: 78vw;
	padding-top: 40rpx;
	margin: 0 auto;
}
.login-footer-box {
	display: flex;
	padding-top: 30rpx;
	width: 78vw;
	margin: 0 auto;
}
.login-footer-box-left {
	text-decoration: underline;
	font-size: 28rpx;
	color: $--blue;
}
.register-box {
	background-color: $--white;
	position: relative;
	top: -200rpx;
	left: 5vw;
	width: 90vw;
	border-radius: 16rpx;
	padding-bottom: 60rpx;
	box-shadow: 0 0 10px rgba(0, 0, 0, .2);
}
</style>
