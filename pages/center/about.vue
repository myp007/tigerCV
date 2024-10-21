<template>
	<view>
		<u-navbar class="app_navbar" :placeholder="true" leftIconColor="#00328f" @leftClick="leftClick" title="About">
		</u-navbar>
		<view class="mian">
			<view class="container">
				<view class="aboutImg">
				<!-- 	<u--image src="https://cdn.uviewui.com/uview/album/1.jpg"  width="260rpx"
						height="260rpx"></u--image> -->
					<image src="@/static/img/about.png" mode="" class="Img" ></image>
				</view>
				<section>
					<h2 class="fz_20">We Help People Find Right Jobs</h2>
					<p class="pt-10 fz_14 color_grey mb_0">If you have any advices or any interest in cooperation,
						please reach out</p>
					<view class="link_text">
						<a style="color: #000;font-weight: 1000;">support@tigercc.com</a>
					</view>
					<p class="pt-10">Current Version: {{version}}</p>
					<p style="margin-bottom: 16px;" class="" class="pt-10">Released on 08/08/2022</p>
					<p v-if="!versionUrl" class="fz_14 color_grey">It is already the latest version</p>
					<p v-if="versionUrl">
						<view v-if="versionUrl" style="color: #000000 !important;font-weight: 1000;padding-bottom: 16rpx;">New Version:
							{{ globalDataVersion }}</view>
						<a :href="versionUrl" class="fz_14 link_url line_feed" v-if="deviceInfo.platform !== 'ios'"
							style="color: #00328f;font-weight: 1000;font-size: 32rpx;">{{ versionUrl }}</a>
						<!-- <v-icon class="ml_10" @click="copyUrl">mdi-content-copy</v-icon> -->
					</p>
				</section>
			</view>

		</view>
	</view>
	</view>
</template>

<script>
    import {globalData} from '@/api/common.js'
	export default {
		name: "about",
		data() {
			return {
				version:'',
				versionUrl: '',
				globalDataVersion: '',
				deviceInfo:{
					platform:'android'
				},
			}
		},
		methods: {
			leftClick() {
				// uni.switchTab({
				// 	url: '/pages/center/index'
				// })
				uni.navigateBack()
			},
		},
		onLoad() {
			
			// 获取版本号
			// #ifdef APP-PLUS
			 plus.runtime.getProperty(plus.runtime.appid,(info)=>{
			 	this.version = info.version
			})
			this.deviceInfo = uni.getDeviceInfo()
			// #endif
           // if (getApp().globalData.GlobalData) {
           //   if (getApp().globalData.GlobalData.version) {
           //     if (getApp().globalData.GlobalData.version != this.version) {
           //       this.versionUrl =  getApp().globalData.GlobalData.versionUrl
           //       this.globalDataVersion = getApp().globalData.GlobalData.version
           //     }
           //   }
           // }
		   globalData().then(res=>{
			   if(res.version){
				   if(res.version!=this.version){
					   this.versionUrl = res.versionUrl
					   this.globalDataVersion = res.version
				   }
			   }
		   })
		   
		},
		mounted() {
			
		}
	}
</script>

<style lang="scss">
	.mian {
		width: 100vw;
		height: 100vh;
		font-family: Roboto, sans-serif !important;

		.container {
			padding: 0 10vw;

			.aboutImg {
				padding: 10vh 0;	
				.Img {
					position: relative;
					left: 50%;
					transform: translateX(-50%);
					width: 260rpx;
					height: 260rpx;
				}
			}

			.fz_20 {
				font-size: 36rpx;
				font-family: Roboto, sans-serif;
			}

			.pt-10 {
				font-family: Roboto, sans-serif;
				color: rgba(0, 0, 0, .6);
				font-weight: 600;
			}

			.color_grey {
				padding-top: 10vh !important;
			}

			.link_text {
				font-size: 14px;
				text-decoration: underline;

				font-weight: 1500;
				padding: 5vh 0;
				font-family: Roboto, sans-serif;
			}
		}
	}
</style>
