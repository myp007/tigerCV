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
					<u-form-item v-if="item.type == 'select'" label-position="top" :label="item.title">
						<u-picker :default-value="item.value" :show="item.show" mode="single-column" :columns="[item.data]" keyName="label" @confirm="(v)=>{confirmSelect(v,item)}"></u-picker>
						<view @click="openSelect(index)">{{item.data[item.value[0]].label}}</view>
					</u-form-item>
					
					<u-form-item v-if="item.type == 'text' || item.type == 'textarea'" label-position="top" :label="item.title">
						<u-input :type="item.type" v-model="item.value" :placeholder="'Please enter' + item.title" />
					</u-form-item>
					
					<u-form-item :border-bottom="item.name == 'input_status' ? false:true" v-if="item.type == 'radio'" label-position="top" :label="item.title">
						<u-radio-group v-model="item.value">
							<u-radio v-for="(item, indexr) in item.content" :key="indexr" :label="item" :name="indexr"></u-radio>
						</u-radio-group>
					</u-form-item>
					
					<u-form-item v-if="item.type == 'checkbox'" label-position="top" :label="item.title">
						<u-checkbox-group>
							<u-checkbox v-model="item.checked" v-for="(item, cindex) in item.contents" :key="cindex" :label="item.name" :name="item.name"></u-checkbox>
						</u-checkbox-group>
					</u-form-item>
					
					<view v-if="item.name == 'input_status'" class="box20rpx"></view>
				</view>
			</block>
			<!-- <u-cell-group :border="false" v-if="form.length">
				<navigator url="/pages/center/user-shield">
					<u-cell :border-bottom="false" title="黑名单管理"></u-cell>
				</navigator>
			</u-cell-group> -->
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
		onShow() {
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
					} else if (that.form[i].type == 'checkbox') {
						var checkboxStr = '';
						for (var y = 0; y < that.form[i].contents.length; y++) {
							checkboxStr += that.form[i].contents[y].checked ? (that.form[i].contents[y].id + ','):''
						}
						values[that.form[i].name] = checkboxStr
					} else {
						values[that.form[i].name] = that.form[i].value
					}
				}
				
				that.ws.pageFun(function() {
					var message = { c: 'ImBase', a: 'updateUserConfig', data: values }
					that.ws.send(message);
					that.ws.showMsgCallback = function () {
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
			confirmSelect (value, item) {
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
					var general = res.data.imConfigGroup.privacy.list;
					
					for (let g = 0; g < general.length; g++) {
						
						if (general[g].name == 'send_message_key' || general[g].name == 'ecs_exit') {
							general[g].type = 'hidden'
						}
						
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
						} else if(general[g].type == 'checkbox') {
							var contents = []
							for (var i = 0; i < general[g].content.length; i++) {
								contents.push({
									id: i,
									name: general[g].content[i],
									checked: general[g].value.indexOf(i.toString()) === -1 ? false:true
								})
							}
							general[g].contents = contents
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
