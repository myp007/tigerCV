<template>
	<view>
		<!-- title=反馈&举报&id=224&type=user -->
		<!-- 举报时：id为会话ID，type当举报时可固定为user -->
		<!-- 反馈时：仅需传递title=反馈 -->
		<common :tips='commonTips'></common>
		<u-toast ref="uToast" />
		<u-form class="quick-reply" :model="form" ref="uForm" label-width="120">
			<u-form-item :label="formTitle + 'details'" label-position="top" prop="describe">
				<u-input type="textarea" :placeholder="describePlaceholder" v-model="form.describe" />
			</u-form-item>
			<u-form-item label="contact information" label-position="top" prop="mobile">
				<u-input placeholder="Please enter the contact information" v-model="form.mobile" />
			</u-form-item>
			<u-form-item label="Photo evidence" label-position="top">
				<view>
					<u-upload @on-change="avatarOnChange" :form-data="uploadFormData" ref="uUpload" :size-type="['compressed']" name="file" :max-count="4" :show-tips="false" :action="uploadAction" :file-list="fileList" ></u-upload>
				</view>
			</u-form-item>
			<u-button class="quick-reply-button" :loading="submitButtonStatus" :disabled="submitButtonStatus" type="primary" @click="submit">提交</u-button>
		</u-form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: 0,
				type: 'user',
				userToken: '',
				form: {
					describe: '',
					mobile: '',
					reportimage: ''
				},
				formTitle: 'feedback',
				uploadAction: '',
				uploadFormData: new Object(),
				fileList: [],
				rules: {
					describe: [{
						required: true,
						message: 'Please enter details',
						trigger: ['change', 'blur']
					}],
					mobile: [{
						required: true,
						message: 'Please enter the contact information',
						trigger: ['change', 'blur']
					}]
				},
				describePlaceholder: '',
				submitButtonStatus: false,
				commonTips: ''
			}
		},
		onLoad(data) {
			this.id = data.id ? data.id:0
			this.type = data.type ? data.type:'feedback'
			let userinfo = uni.getStorageSync('userinfo');
			this.userToken = userinfo.token
			
			this.formTitle = data.title ? data.title:this.formTitle
			this.describePlaceholder = 'Please enter' + this.formTitle + 'details'
			uni.setNavigationBarTitle({
			    title: this.formTitle
			});
			
			this.ws.pageFun(this.pageDataLoad, this)
		},
		onShow() {
			this.ws.checkNetwork(this)
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			pageDataLoad: function () {
				var that = this				
				if (that.id) {
					let message = {
						c: 'ImBase',
						a: 'report',
						data: {
							session_id: that.id,
							type: 'user',
							method: 'get'
						}
					}
					this.ws.send(message);
				}
				
				that.ws.send({
					c: 'ImBase',
					a: 'getUploadMultipart'
				});
				
				that.uploadAction = this.ws.buildUrl('upload', that.userToken)
			},
			avatarOnChange: function (res, index, lists) {
				res = JSON.parse(res.data);
				if (res.code == 0) {
					
					this.ws.pageFun(() => {
						this.ws.send({
							c: 'ImBase',
							a: 'getUploadMultipart'
						});
					}, this)
					
					uni.showModal({
						title: 'reminder',
						content: res.msg,
						showCancel: false
					})
					
					this.$refs.uUpload.remove(index);
					return false;
				}
			},
			submit: function () {
				var that = this
				this.$refs.uForm.validate(valid => {
					if (valid) {
						var files = '';
						for (let f in that.$refs.uUpload.lists) {
							if (that.$refs.uUpload.lists[f].progress == 100) {
								files += that.ws.imgUrl(that.$refs.uUpload.lists[f].response.data.fullurl) + ','
							}
						}
						if (!files) {
							that.$refs.uToast.show({
								title: 'Please upload evidence pictures~',
								type: 'error'
							})
							return;
						}
						that.submitButtonStatus = true
						that.form.type = that.type
						that.form.reportimage = files
						that.form.session_id = that.id
						that.form.method = 'post'
						
						that.ws.pageFun(function() {
							let message = { c: 'ImBase', a: 'report', data: that.form }
							that.ws.send(message);
							that.ws.showMsgCallback = function () {
								that.form.describe = ''
								that.form.mobile = ''
								that.$refs.uUpload.clear();
								setTimeout(function(){
									that.submitButtonStatus = false
									uni.navigateBack({
										delta: 1
									})
								}, 2000)
							}
						}, that)
					}
				})
			}
		}
	}
</script>

<style>
page {
	background: #FFFFFF;
}
.quick-reply {
	display: block;
	width: 92vw;
	margin: 0 auto;
}
.quick-reply-button {
	width: 60vw;
	display: block;
	margin: 0 auto;
	margin-top: 200rpx;
}
.u-button{
	line-height: 40px;
}
</style>
