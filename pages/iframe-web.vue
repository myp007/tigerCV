<template>
	<view class="iframe-box">
		<iframe height="100%" style="width: 100%; height: 100% ;border: none;background: #fff;" :src="iframeUrl"></iframe>
	</view>
</template>

<script>
	import {loginEmail} from '@/api/user'
	export default {
		data() {
			return {
				isapplogin: true,
				iframeUrl:'https://m.tigercv.cc/#/'
			}
		},
		onLoad(query) {
			
		},
	}


</script>

<style>
.iframe-box{
	max-width: 750px;
	height: 100vh;
	margin: 0 auto;
}
</style>
