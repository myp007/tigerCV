<template>
	<view>
		<u-toast ref="uToast" />
		<common :tips='commonTips'></common>
		<view v-if="loadingShow" class="u-loading">
			<u-loading-icon color="#6388fb" mode="circle"></u-loading-icon>
		</view>
		<u--form ref="uForm" labelPosition="top" label-width="200">
			<block v-for="(item, index) in form" :key="index">
				<view class="form-item-box">
					<u-form-item :border-bottom="item.borderBottom" v-if="item.type == 'select'" label-position="top" :label="item.title">
						<u-picker :default-value="item.value" :show="item.show" mode="single-column" :columns="[item.data]" keyName="label" @confirm="(v)=>{confirmSelect(v,item)}"></u-picker>
						<view @click="openSelect(index)">{{item.data[item.value[0]].label}}</view>
					</u-form-item>
					
					<u-form-item :border-bottom="item.name == 'busy_reply' ? false:true" v-if="item.type == 'text' || item.type == 'textarea'" label-position="top" :label="item.title">
						<u-input :type="item.type" v-model="item.value" :placeholder="'Please enter' + item.title" />
					</u-form-item>
					
					<view v-if="item.name == 'busy_reply'" class="box20rpx"></view>
					
					<u-form-item :border-bottom="item.borderBottom" v-if="item.type == 'radio'" label-position="top" :label="item.title">
						<u-radio-group v-model="item.value">
							<u-radio v-for="(item, indexr) in item.content" :key="indexr" :name="indexr" :label="item"></u-radio>
						</u-radio-group>
					</u-form-item>
				</view>
			</block>
			<u-button v-if="form.length" :loading="submitButtonStatus" :disabled="submitButtonStatus" class="submit-button" type="primary" @click="submit">SAVE</u-button>
		</u--form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userinfo: [],
				form: {
					
				},
				openSelectName: false,
				submitButtonStatus: false,
				loadingShow: true,
				commonTips: ''
			}
		},
		onLoad:function(){
			this.userinfo = uni.getStorageSync('userinfo');
			this.pageDataLoad()
		},
		onShow: function () {
			this.ws.checkNetwork(this)
		},
		methods: {
			submit: function () {
				var  that = this
				that.submitButtonStatus = true
				var values = {};
				for (var i = 0; i < that.form.length; i++) {
					if (that.form[i].type == 'select') {
						values[that.form[i].name] = that.form[i].data[that.form[i].value[0]].value
					} else {
						values[that.form[i].name] = that.form[i].value
					}
				}
				
				that.ws.pageFun(function() {
					var message = { c: 'ImBase', a: 'updateUserConfig', data: values }
					that.ws.send(message);
					that.ws.showMsgCallback = function () {
						that.ws.initializeData.config.user_config.new_message_shake = values.new_message_shake
						that.ws.initializeData.config.user_config.new_message_sound = values.new_message_sound
						that.ws.initializeData.config.user_config.send_message_key = values.send_message_key
						setTimeout(function(){
							that.submitButtonStatus = false
							uni.navigateBack({
								delta: 1
							})
						}, 2000)
					}
				}, that)
			},
			openSelect: function(index, name = false){
				this.form[index].show = true
				this.openSelectName = name ? name:false
			},
			confirmSelect(value, item) {
				var valueIndex = 0, data = this.form[value.value[0].extra].data;
				for (var i = 0; i < data.length; i++) {
					if (data[i].value == value.value[0].value) {
						valueIndex = i
					}
				}
				this.form[value.value[0].extra].value = [valueIndex]
				item.show = false
			},
			pageDataLoad: function () {
				var that = this
				uni.$u.http.get(that.ws.buildUrl('get-config-item-data', that.userinfo.token), {}).then(res => {
					
					that.loadingShow = false
					var general = res.data.imConfigGroup.general.list, lastGeneral = (general.length - 1);
					
					for (let g = 0; g < general.length; g++) {
						
						if (general[g].name == 'send_message_key') {
							general[g].content[1] = 'Send key'
						}
						if (general[g].name == 'login_status') {
							general[g].title = 'Status after login'
						}
						
						general[g].borderBottom = (g == lastGeneral) ? false:true
						
						if (general[g].type == 'select') {
							general[g].show = false
							general[g].data = []
							
							for (let i = 0; i < general[g].content.length; i++) {
								general[g].data.push({ value: i, label: general[g].content[i], extra: g });
								if (parseInt(general[g].value[0]) == i) {
									general[g].value = [i]
								}
							}
						} else if(general[g].type == 'text') {
							general[g].type = 'textarea'
						} else if(general[g].type == 'string') {
							general[g].type = 'text'
						}
					}
					
					that.form = general
				})
			},
		}
	}
</script>

<style lang="scss">
page{
	background-color: $--bg-color;
}
.form-item-box {
	width: 100vw;
	background-color: $--white;
	padding: 0 5vw;
	box-sizing: border-box;
}
.form-item {
	border-bottom: 1px solid red;
}
.box20rpx {
	height: 20rpx;
	width: 100vw;
	background-color: $--bg-color;
	margin-left: -5vw;
}
.submit-button {
	width: 60vw;
	display: block;
	margin: 40rpx auto;
}
.u-loading {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 60rpx;
}
.u-button{
	line-height: 40px;
}
.u-loading-icon{
	margin-top: 10px;
}
</style>
