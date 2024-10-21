<template>
	<view class="email_login">
		<view class='app_modal' v-if="isapplogin">
			<u-loading-icon size="36" style="margin-top: 200px;"></u-loading-icon>
		</view>
	</view>
</template>

<script>
	import {loginEmail} from '@/api/user'
	export default {
		data() {
			return {
				isapplogin: true
			}
		},
		onLoad(query) {
			let appinfo = uni.getStorageSync('appinfo');
			
			if(appinfo.token){
				uni.reLaunch({
					url: '/pages/index/index'
				})
				return false;
			}else{
				let systemInfo = uni.getSystemInfoSync()
				console.log(systemInfo)
				if(systemInfo.uniPlatform == 'app'){
					uni.reLaunch({
						url: '/pages/center/login_up'
					})
				}else{
					
					uni.reLaunch({
						url: '/pages/index/index'
					})
				}
				
			}
		},
	}


</script>

<style>
</style>
