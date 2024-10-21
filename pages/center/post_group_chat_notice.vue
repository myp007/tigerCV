<template>
	<view>
		<u-toast ref="uToast" />
		<common :tips='commonTips'></common>
		<u-form class="post-form">
			<view class="form-item">
				<u-input maxlength="-1" v-model="form.content" name="content" class="post-textarea" placeholder="请输入公告内容" type="textarea" />
				<view>
					<u-upload @on-change="imagesOnChange" :form-data="uploadFormData" :file-list="filesArr" :action="action" ref="uUpload" :size-type="['compressed']" :max-count="10" name="file" width="160" height="160"></u-upload>
				</view>
				<view class="checkbox-group">
					<u-checkbox-group name="checkboxs">
						<u-checkbox v-model="item.checked" v-for="(item, cindex) in checkboxs" :key="cindex" :name="item.title">
							{{ item.title }}
						</u-checkbox>
					</u-checkbox-group>
				</view>
			</view>
			<u-button :loading="submitButtonStatus" :disabled="submitButtonStatus" class="submit-button" type="primary" @click="submit">发布</u-button>
		</u-form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: 0,
				group_id: 0,
				form: {
					content: ''
				},
				action: '',
				filesArr: [],
				checkboxs: [{
					name: 'popup',
					title: '使用弹窗展示公告',
					checked: true
				},
				{
					name: 'receipt',
					title: '需群成员确认收到',
					checked: false
				},
				{
					name: 'top',
					title: '置顶公告',
					checked: false
				}],
				submitButtonStatus: false,
				uploadFormData: new Object(),
				commonTips: ''
			}
		},
		onLoad(query) {
			var that = this
			that.id = query.id
			that.group_id = query.group_id
			let userinfo = uni.getStorageSync('userinfo');
			that.action = that.ws.buildUrl('upload', userinfo.token)
			that.ws.pageFun(that.pageDataLoad, that);
		},
		onShow() {
			this.ws.checkNetwork(this)
		},
		methods: {
			pageDataLoad: function() {
				var that = this
				that.ws.send({
					c: 'ImBase',
					a: 'getUploadMultipart'
				});
				if (that.id) {
					that.ws.send({
						c: 'Message',
						a: 'groupChatNoticeOpt',
						data: {
							id: that.id,
							type: "edit"
						}
					});
					uni.setNavigationBarTitle({
					    title: '编辑公告'
					});
				}
			},
			imagesOnChange: function (res) {
				res = JSON.parse(res.data);
				if (res.code != 1) {
					this.ws.pageFun(() => {
						this.ws.send({
							c: 'ImBase',
							a: 'getUploadMultipart'
						})
					}, this)
					
					this.$refs.uUpload.remove(index);
					
					uni.showModal({
						title: '温馨提示',
						content: res.msg,
						showCancel: false
					})
				}
			},
			submit: function () {
				var that = this
				that.submitButtonStatus = true
				var values = that.form, noticeimages = '', message = '';
				
				for (var i = 0; i < that.$refs.uUpload.lists.length; i++) {
					if (that.$refs.uUpload.lists[i].progress == 100) {
						if (that.$refs.uUpload.lists[i].response) {
							noticeimages += that.$refs.uUpload.lists[i].response.data.fullurl + ','
						} else if (that.$refs.uUpload.lists[i].url) {
							noticeimages += that.$refs.uUpload.lists[i].url + ','
						}
					}
				}
				
				for (var i = 0; i < that.checkboxs.length; i++) {
					values[that.checkboxs[i].name] = that.checkboxs[i].checked ? 1:0
				}
				
				values.group_id = that.group_id
				values.images = noticeimages
				values.method = 'post'
				
				if (that.id) {
					values.id = that.id
					values.type = 'post-edit'
					values.source = 'uni-app'
					message = {c: 'Message', a: 'groupChatNoticeOpt', data: values}
				} else {
					message = {c: 'Message', a: 'groupChatNotice', data: values}
				}
				
				that.ws.pageFun(function() {
					that.ws.send(message);
					that.ws.showMsgCallback = function() {
						setTimeout(function() {
							that.ws.pageRefresh.chatSetting = true
							that.submitButtonStatus = false
							uni.navigateBack({
								delta: 1
							})
						}, 2000)
					}
				}, that);
			}
		}
	}
</script>

<style>
page {
	background: #F8F8F8;
}
.post-form {
	display: block;
	width: 96vw;
	margin: 20rpx auto;
}
.form-item {
	display: block;
	padding: 20rpx;
	border-radius: 12rpx;
	background: #FFFFFF;
}
.post-textarea,.checkbox-group {
	display: block;
	width: 96%;
	margin: 0 auto;
	padding-top: 20rpx;
}
.submit-button {
	width: 60vw;
	display: block;
	margin: 60rpx auto;
}
</style>
