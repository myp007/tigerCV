<template>
	<view class="resume_details" id="main_body">
		<!-- nav -->
		<u-toast ref="uToast"></u-toast>
		<u-navbar class="app_navbar" height="56px" :placeholder="true" leftIconColor="#00328f">
			<view slot="left" class="nav_title">
				<view @click="goBack"><u-icon name="arrow-left" color="#00328f" size="22"></u-icon></view>
			</view>
			<view slot="right" class="nav_right">
				<view @click="goPreview"><u-icon name="checkmark" color="#00328f" size="22"></u-icon></view>

			</view>
		</u-navbar>

		<!-- content -->
		<view class="content_box">
			<view class="right_view" id="contet_right">
				<scroll-view class="scroller" :scroll-into-view="toView" scroll-y="true" scroll-with-animation="true">
					<view id="user" class="content_item">
						<view class="item_title">1.Resume Name</view>
						<view class="item_content">
							<u--input v-model="resume_name" border="bottom"></u--input>
						</view>
					</view>
					<view id="complete" class="content_item">
						<view class="item_title">2.Upload you CV</view>
						<view class="item-photo item-form">
							<!-- <file-choose :file-list="fileList" :config="config" @change-file="changeFile"></file-choose> -->
							<u-button class="guide_button" v-if="!filePDF.name" @click="uploadFile" :loading="loading">
								UPLOAD
							</u-button>
							<view class="file-box" v-else>
								<view>{{filePDF.name}}</view>
								<u-icon class="close_icon" name="close" color="#666" size="16" @click="deleteFile"></u-icon>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>

	</view>
</template>

<script>

import {
	saveResume,
	uploadSaveResume
} from '@/api/resume.js'
import config from '@/common/config.js'
export default {
	data() {
		return {
			loading: false,
			toView: '',
			timeShow: false,
			rid: '',
			filePDF: {id:'',name :''},
			resume_name:'',
			attachment_id:'',
			type:'',
			config: {
					size: 5,//文件限制大小M, 安卓该字段失效
					limit: 1,
					title:'',
					headers: {},
					formData: {},
					automatic: false,//是否自动上传
					fileMediatype: 'all'//文件类型：'视频-video', '图片-image', '文件-file','全部-all'
				},
				fileList: [],
		}
	},
	
	onLoad(query) {
		// 是否携带参数rid
		this.type = query.type || ''
		let dateTime = new Date()
		this.resume_name =  dateTime.getFullYear() + ( dateTime.getMonth()+1 < 10 ? '0' + (dateTime.getMonth()+1) : dateTime.getMonth()+1) + dateTime.getDate() 
	},
	onUnload(){
	 	window.plus &&	plus.globalEvent.removeEventListener('FileChooseResult')
	},
	methods: {

		// 返回上一级
		goBack() {
			console.log(this.type)
			if(this.type == 'index_add'){
				uni.switchTab({
					url: '/pages/index/index'
				})
			}else{
				uni.switchTab({
					url: '/pages/resume/index'
				})
			}
			
		},
		changeFile(file, fileList) {
				this.fileList=fileList;
				for(let i = 0; i < file.length; i++) {
					console.log('此出调用文件上传接口！');
				}
			},
		uploadFile(){
			let that = this
			
			let systemInfo = uni.getSystemInfoSync()
				if(systemInfo.uniPlatform == 'app'){
					if(systemInfo.platform == 'android'){
						let chooseFileModule = uni.requireNativePlugin("Rc-ChosseFile_ChooseFileModule");
						chooseFileModule.openFileBrowse();

						plus.globalEvent.addEventListener('FileChooseResult', (e) => {
							var filePath = 'file://' + e.filePath
							
							that.upload(filePath);
						});
					}else{
						plus.gallery.pick( function(path){
						
							that.upload(path);
						}, function ( e ) {
							console.log( "取消选择图片" );
						}, {filter:"all"} ); 
					}
					
			}else{
				uni.chooseFile({
					count: 1,
					extension:['.pdf','.doc','.png','.jpg'],
					success (res) {
						console.log(res)
						that.upload(res.tempFilePaths[0]);
					},
					fail: () => {}
				})
			}
			
		},
		// 获取上传状态
		upload(file) {
			
			const appinfo = uni.getStorageSync('appinfo');
			let token = appinfo.token
			let that = this
			that.loading = true
			uni.uploadFile({
				url: config.appUrl + '/tool/resume/upload', //仅为示例，非真实的接口地址
				filePath: file,
				header:{
					"user-token": token
				},
				name: 'file',
				formData: {
					
				},
				success: (uploadFileRes) => {
					let res = JSON.parse(uploadFileRes.data)
					if(res.data.id){
						this.filePDF = {
							id:res.data.id,
							name:res.data.file_path,
							url:res.data.file_path,
						}
						uni.$u.toast('Upload successful')
					}
					that.loading = false
				},
				fail: () => {
					that.loading = false
				}
			});
			
		},
		deleteFile(){
			this.filePDF = {}
		},
		// 保存并跳转预览简历
		goPreview() {
			if(!this.resume_name){
				uni.$u.toast('Resume_ Name cannot be empty')
				return
			}
			console.log(this.filePDF.id)
			if(this.filePDF.id == ''){
				uni.$u.toast('Please upload your resume file')
				return
			}
			let querys = {
				resume_name:this.resume_name,
				attachment_id:this.filePDF.id,
			}
			uploadSaveResume(querys).then(res => {
				
				if(this.type == 'index_add'){
					uni.switchTab({
						url: '/pages/index/index'
					})
				}else{
					uni.switchTab({
						url: '/pages/resume/index'
					})
				}
			})
		},

	}
}
</script>

<style lang="scss">
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

.Birthday {
	.u-input {
		background-color: transparent !important;
	}
}

v-deep .uni-select-cy-select {
	border: none !important;
	border-bottom: 1px solid #ccc !important;
}

.resume_details {
	width: 100%;
	height: 100%;
	overflow: hidden;
	background-color: #fff;
	font-family: "Roboto", sans-serif;

	.skeleton_Details {
		padding: 20px;
	}

	.content_box {
		display: flex;
		overflow: hidden;
		padding-left: 20px;

		.left_view {
			width: 54px;
			text-align: center;

			.u-icon {
				margin-left: 16px;
				height: 40px;
			}

			view {
				margin-bottom: 40rpx;
				text-align: center;
			}
		}

		.right_view {
			flex: 1;

			.scroller {
				padding: 0px 10px 20px 0px;
				height: 100vh;

				.content_item {
					.item_title {
						padding-bottom: 20rpx;
						font-size: 22px;
						font-weight: 600;
					}

					.item_content {
						position: relative;
						margin-bottom: 10px;
						margin-left: 6px;
						padding-left: 20px;
						padding-right: 20px;
						padding-top: 1em;
						border-left: 1px solid rgba(0, 0, 0, 0.2);
					}

					.item-form {
						position: relative;
						margin-bottom: 10px;
						margin-left: 6px;
						padding-left: 20px;
						padding-right: 20px;
						padding-top: 1em;
						border-left: 1px solid rgba(000, 000, 000, 0.2);

					}	
				}
			}
		}
	}

	.guide_button {
		padding: 10px 28px !important;
		background-color: #00328f;
		color: #fff;
		width: 100% !important;
	}
	.file-box{
		padding:5px 10px;
		border: 1px solid rgba(0, 0, 0, 0.2);
		display: flex;
		color:#666;
	}
	.close_icon{
		padding-left: 15px;
	}
}
</style>
