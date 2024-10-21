<template>
	<view class="preview_index" id="main_body">
		<u-toast ref="uToast"></u-toast>
		<u-navbar class="app_navbar" height="56px" :placeholder="true" leftIconColor="#00328f">
			<view slot="left" class="nav_title">
				<u-icon name="arrow-left" color="#00328f" size="22" @click="goBack"></u-icon>
			</view>
			<view slot="right" class="nav_right">
				<u-icon name="checkmark" color="#00328f" size="22" v-if="!saveLoading" @click="save"></u-icon>
				<u-loading-icon mode="circle" v-if="saveLoading" color="#00328f" size="22"></u-loading-icon>
			</view>
		</u-navbar>
		<view class="main" style="padding:0 0 50px;height: 94vh;background: #f2f2f2;overflow: hidden;">
			<!-- <view class="resumepreview"   style="width: 21cm;height:29.7cm;position:relative;transform: scale(0.442068) 
					translate(-473.343px, -669.562px);" id="Preview" ref="Preview"> 
				
				<iframe style="transform: translate(-57%, -27%);" :src="preview_iframe_url" id="previewIframe" ref="previewIframe" scrolling="no"
					:allowfullscreen="false" frameborder="0" width="100%" height="2000">
				</iframe>
			</view> -->
			<movable-area>
					<movable-view :x="x" :y="y" direction="all" @change="onChange" :out-of-bounds="true" scale-min="0.5" scale-max="5" :scale-value="movableScale" :scale="true" >
						<view class="moveFill"  >
							<iframe  :src="preview_iframe_url"  style="width: 21cm;height:29.7cm;z-index: -999;position: absolute;transform: scale(0.4)"
							:allowfullscreen="false"  scrolling="no">
					    	</iframe>
						</view>
					</movable-view>
			</movable-area>

		</view>
		<view class="save_btn">
			<u-button type="primary" :loading="saveLoading" loadingText="Loading" :text="saveText" @click="save" class="btnSave"   iconColor="#00328f"></u-button>
		</view>
		<view class="footer">
			<view class="f_btn" v-for="(item,index) in iconList" :key="index" @tap="goEvent(item)" @click="goEvent(item)">
				<i class="material-icons clo" v-if="!item.loading">{{item.name}}</i>
				<u-loading-icon mode="circle" v-if="item.loading"></u-loading-icon>
			</view>
		</view>
		<!-- <app-tabbar :selectvalue="selectvalue"></app-tabbar> -->
	</view>
</template>

<script>
	// import Panzoom from '@panzoom/panzoom'
	import {
		fetchEetail,
		fetchResumeDownload
	} from '@/api/resume.js'
	import config from '@/common/config.js'
	export default {
		data() {
			return {
				saveLoading:false,
				timer:null,
				saveText:'SAVE',
				// 简历模板
				templateId:'',
				preview_iframe_url: '',
				rid: '',
				x: 0,
				y: 0,
				old: {
				    x: 0,
				    y: 0
				},
				selectvalue:"RESUME",
				movableScale:1,
				filename: '', //文件名
				iconList: [
					{
						name: 'edit',
						event: 'edit',
						loading:false,
					},
					{
						name: 'add',
						event: 'add',
						loading:false,
					},
					{
						name: 'remove',
						event: 'remove',
						loading:false,
					},
					{
						name: 'cached',
						event: 'cached',
						loading:false,
					},
					{
						name: 'download',
						event: 'download',
						loading:false,
					},
					{
						name: 'outgoing_mail',
						event: 'outgoing_mail',
						loading:false,
					}
				],
				panzoomDom: null,
				resumeContent: {
					basics: {
						amateur: '',
						birth_city: '',
						birthdate: '',
						email: '',
						facebook: '',
						first_name: '',
						id: '',
						instagram: '',
						last_name: '',
						location: {
							address: '',
							country: '',
							postalCode: '',
							region: ''
						},
						name: '',
						occupation: '',
						phone: '',
						photo: {
							id: 0,
							url: ''
						},
						position_city: '',
						salary: '',
						twitter: '',
						website: ''
					},
					sections: {
						education: [],
						languages: [],
						skills: []
					},
					share_url: '',
					slug: '',
					updatedAt: '',
					user: {
						createdAt: '',
						email: '',
						id: 0,
						name: '',
						provider: '',
						updatedAt: '',
						username: ''
					}
				},
				screenWidth: uni.getSystemInfoSync().windowWidth, // 屏幕宽度
				screenHeight: uni.getSystemInfoSync().windowHeight // 屏幕高度
			}
		},
		onLoad(query) {
			if(query.templateId){
				this.templateId = query.templateId	
			}
			this.rid = query.id
			// 初始化简历内容
			this.getData()
		},
		computed: {
		},
		methods: {
			toJSON() {

			},
			// 返回上一级
			goBack() {
				uni.$u.route({
					type: 'navigateBack'
				})
			},
			goEvent(item) {
				if (item.event == "edit") {
					this.goEdit()
				} else if (item.event  == "add") {
					if(this.movableScale>=5){
						return
					}
				    this.movableScale += 0.1
				} else if (item.event  == "remove") {
					if(this.movableScale<=0.5){
						return
					}
					this.movableScale -= 0.1
				} else if (item.event  == "cached") {
					this.x = this.old.x
				    this.y = this.old.y
					this.$nextTick(function(){
						this.x = 0
						this.y = 0
						this.movableScale = 1
					})
				} else if (item.event  == "download") {
					if(item.loading) return
					item.loading = true
					this.downloadPdf(item)
				} else if (item.event  == "outgoing_mail") {
					if(item.loading) return
					item.loading = true
					this.goDeliver(item)
				}
			},
			// 编辑简历
			goEdit() {
				this.iconList[0].loading = false
				uni.navigateTo({
					url: '/pages/resume/details?id=' +  this.resumeContent.id
				})
			},
			// 发送简历
			goDeliver(item) {
				const param = {	
					rid:  this.resumeContent.id,
					name: this.resumeContent.basics.template_id
				}
				fetchResumeDownload(param).then(res => {
					item.loading = false
					uni.navigateTo({
						url: '/pages/resume/resumeSend?rid=' + this.resumeContent.id
					})
				})
			},
			// 初始化
			initPreview() {
				const _this = this
				// #ifdef H5
				const elem = document.getElementById('Preview')
				// #endif
				// #ifdef APP-PLUS
				//#endif			
			},
			// 获取简历内容
			getData() {
				fetchEetail(this.rid).then(res => {
					if(res){
						// 简历内容
						this.resumeContent = res
						if (this.templateId) {
							this.resumeContent.basics.template_id = this.templateId
						}
						// 简历模板路径
						this.preview_iframe_url = config.appUrl +
							`/tool/preview/index?sign=${this.resumeContent.sign}|${this.resumeContent.basics.template_id}&_t=${Math.random()}`
			     	}		
				})
			},
			onLoadIframe(e) {
				const parent = document.getElementById('Preview')
				let iframe = document.getElementById('previewIframe')
				iframe.width = parent.offsetWidth
				iframe.height = 2000; //parent.offsetHeight
			},
			save() {
                let that = this
				if(that.saveLoading) return
				that.saveLoading = true
				that.saveText = ''
				clearTimeout(that.timer)
				that.timer = setTimeout(() => {
					const param = {
						rid: this.resumeContent.id,
						name: this.resumeContent.basics.template_id
					}
					fetchResumeDownload(param).then(() => {
						that.saveLoading = false
						that.saveText = 'SAVE'
						uni.switchTab({
							url: '/pages/resume/index'
						})
					})
				},500)
			
			},
			downloadPdf(item){
				let url = encodeURI(config.imgUrl + `/upload/tool/file/${this.resumeContent.id}_${this.resumeContent.basics.resume_name}.pdf`) 
				// #ifdef APP-PLUS
				      uni.downloadFile({
				        url: url,
						success: res => {
				          if (res.statusCode === 200) {
							uni.saveFile({
								tempFilePath: res.tempFilePath,
								success: function (res) {
									uni.showToast({
										title: "The file has been downloaded.",
										icon: "none",
									})
									item.loading = false
									setTimeout(()=>{
										uni.openDocument({
											filePath: res.savedFilePath,
											showMenu: true,
											success: function () {
												console.log("file-success")
											}
										})
									},500)
								},
								fail: function() {
									uni.showToast({
										title: "Save failed, please try again later.",
										icon: "none"
									})
									item.loading = false
								}
							})
				          }
				        }
				      })		
				
				// #endif
				// #ifdef H5
                    // let url = config.imgUrl + `/upload/tool/file/${this.resumeContent.id}_${this.resumeContent.basics.resume_name}.pdf`
				    item.loading = false
					window.open(url)
				// #endif
			},

	
			tap: function(e) {
				this.x = this.old.x
				this.y = this.old.y
				this.$nextTick(function() {
					this.x = 0
					this.y = 0
				})
			},
			onChange: function(e) {
				this.old.x = e.detail.x
				this.old.y = e.detail.y
			}
		}
	}
</script>

<style scoped="scoped" lang="scss">
	@font-face {
		font-family: 'Material Icons';
		font-style: normal;
		font-weight: 400;
		src: url(@/static/MaterialIcons/MaterialIcons-Regular.eot);
		/* For IE6-8 */
		src: local('Material Icons'),
			local('MaterialIcons-Regular'),
			url(@/static/MaterialIcons/MaterialIcons-Regular.woff2) format('woff2'),
			url(@/static/MaterialIcons/MaterialIcons-Regular.woff) format('woff'),
			url(@/static/MaterialIcons/MaterialIcons-Regular.ttf) format('truetype');
	}

	/* meterial icon的设定 */
	.material-icons {
		font-family: 'Material Icons';
		font-weight: normal;
		font-style: normal;
		font-size: 24px;
		/* Preferred icon size */
		display: inline-block;
		line-height: 1;
		text-transform: none;
		letter-spacing: normal;
		word-wrap: normal;
		white-space: nowrap;
		direction: ltr;
		/* Support for all WebKit browsers. */
		-webkit-font-smoothing: antialiased;
		/* Support for Safari and Chrome. */
		text-rendering: optimizeLegibility;
		/* Support for Firefox. */
		-moz-osx-font-smoothing: grayscale;
		/* Support for IE. */
		font-feature-settings: 'liga';
	}
	movable-view {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100vw;
		height:calc(100vh - 56px);
		position: relative;
        left: 100vw;
		top: calc(100vh - 56px);
		.moveFill{
			width: 100%;
			height:100%;
			background-color:transparent;
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
	
	movable-area {
		height: 300vh;
		width: 300vw;
		background: rgb(242, 242, 242);
		overflow: hidden;
		position:relative;
		left: -100vw;
		top: -100vh;
	}

	.resumepreview {
		.content {
			box-shadow: 6px -1px 20px 0px #545050;
			// # 如果按照a4纸的大小设置，点击进入页面后简历就会被放大
			width: 210mm;
			height: 297mm;
			display: flex;

			// 左侧样式
			.left {
				padding: 42px 7px;
				// width: 160px;
				flex: 1;
				font-size: 12px;
				background-color: #335384;
				color: #fff;
				display: flex;
				flex-direction: column;
				// justify-content: space-around;
				align-items: center;
				display: flex;

				.avatar {
					margin: 10px 0;
					text-align: center;
				}

				.contact_info,
				.skills,
				.languages {
					margin: 35px 0;
					padding: 45px 10px;

					.title {
						margin-bottom: 10px;
						font-size: 16px !important;
					}

					.item {
						margin-bottom: 10px;
						display: flex;
						align-items: center;
						font-size: 12px;

						.v-icon {
							font-size: 12px;
							margin-right: 5px;
						}
					}
				}
			}

			// 右侧样式
			.right {
				flex: 2;
				background-color: rgb(255, 255, 255);
				padding: 1px 25px;

				.r-content {
					display: flex;
					flex-direction: column;

					.title1 {
						color: #345484;
						font-weight: 700;
						font-size: 25px;
						margin-bottom: 20px;
					}

					.divider {
						width: 50px;
						height: 1px;
						background-color: #7e7e7a;
						margin-bottom: 20px;
					}

					.position {
						color: #62aed6;
						font-weight: 600;
						font-size: 14px;
						margin-bottom: 20px;
					}

					.title2 {
						color: #6db7dd;
						font-weight: 700;
						font-size: 12px;
						margin-bottom: 20px;
					}

					.title3 {
						color: #8e8889;
						font-weight: 700;
						font-size: 12px;
					}

					.time {
						color: #8e8889;
						font-weight: 400;
						font-size: 13px;
						margin-bottom: 20px;
					}

					.profile {
						font-size: 12px;
						margin-bottom: 20px;
					}
				}
			}
		}
	}

	.save_btn {
		position: fixed;
		bottom: 240rpx;
		width: 100%;
		text-align: center;

		.btnSave{
			width: 375rpx !important;
			height: 72rpx !important;
			line-height: 72rpx !important;
			border-radius:7rpx !important;
			padding: 5px 0;
			background-color: #00328f !important;
			display: flex !important;
			align-items: center;
			::v-deep .u-button__text{
				font-weight: 700;
			}
			::v-deep .u-loading-icon{
				margin-right: 5px;
			}
		}
	}

	.footer {
		width: 100%;
		position: fixed;
		bottom: 60rpx;
		display: flex;
		justify-content: center;
		z-index: 99;
		left: 0px;
		right: 0px;
		bottom: 60px;

		.f_btn {
			background-color: #00328f;
			border-radius: 50%;
			margin: 0 10rpx;
            z-index: 999;
            width: 64rpx;
			height: 64rpx;
			display: flex;
			align-items: center;
			justify-content:center;
			.clo {
				color: #fff;
				font-size: 32rpx;
				padding: 10rpx;
			}
		}
	}
	
</style>
