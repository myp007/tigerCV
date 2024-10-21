<template>
	<view>
		<u-navbar class="app_navbar" :placeholder="true" leftIconColor="#00328f" @leftClick="leftClick" title="Tiger Report">
		</u-navbar>
		<view class="mian">
			<web-view style="top:50px" :webview-styles="webviewStyles" :src="webUrl"></web-view>
		</view>
	</view>
</template>

<script>
	import config from "@/common/config.js";
	import {base64encode,} from '@/common/tool';
    var wv;//计划创建的webview
	export default {
		name: "report",
		data() {
			return {
				webviewStyles: {
					progress: {
						color: '#3246d2'
					}
				},
				webUrl:'',
			}
		},
		methods: {
			leftClick(params) {
				
				const pages = getCurrentPages()
					if (pages.length === 1) {
						if (typeof params === 'number') {
							history.go(-params)
						} else {
							history.back()
						}
					} else {
						uni.navigateBack()
					}
			},
		},
		onLoad(e) {
			let rid = base64encode( '10000' + e.rid)
			this.webUrl = config.hcUrl + 'index/complaint/index?rid=' + rid
			
		},
		onReady() {
		// #ifdef APP-PLUS
		var currentWebview = this.$scope.$getAppWebview() //此对象相当于html5plus里的plus.webview.currentWebview()。在uni-app里vue页面直接使用plus.webview.currentWebview()无效
			setTimeout(function() {
				wv = currentWebview.children()[0]
				wv.setStyle({top:50})
			}, 1000); //如果是页面初始化调用时，需要延时一下
			// #endif
		},
		mounted() {
			
		}
	}
</script>

<style lang="scss">
	.mian {
		width: 100vw;
		height: 100%;
		font-family: Roboto, sans-serif !important;
		padding: 10px;
	}
</style>
