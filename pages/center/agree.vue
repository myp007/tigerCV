<template>
	<view>
		<u-navbar class="app_navbar" :placeholder="true" leftIconColor="#00328f" @leftClick="leftClick" title="">
		</u-navbar>
		<view class="mian">
			<web-view style="top:50px" :webview-styles="webviewStyles" src="https://www.hirechat.ph/privacy-policy"></web-view>
		</view>
	</view>
</template>

<script>
    var wv;//计划创建的webview
	export default {
		name: "agree",
		data() {
			return {
				webviewStyles: {
					progress: {
						color: '#3246d2'
					}
				}
			}
		},
		methods: {
			leftClick() {
				uni.navigateBack()
			},
		},
		onLoad() {
			
		   
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
