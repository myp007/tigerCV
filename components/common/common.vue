<template>
	<view>
		<view v-if="tips" :style="{position: navbarHeight ? 'fixed':'absolute', top: navbarHeight + 'px'}" class="tips">
		
		<image style="width:40rpx;height:40rpx" class="network" src="./../../static/icon/icon-network.png"></image>
		</view>
	</view>
</template>

<script>
	export default {
		name:"common",
		props: {
			tips: {
				type: String,
				default: ''
			},
			navbarHeight: {
				type: [String, Number],
				default: 0
			}
		}
	}
</script>

<style>
.tips {
	position: fixed;
	right:0;
	// width: 100%;
	min-height: 40rpx;
	// background-color: rgba(0, 0, 0, 0.2);
	color: rgba(247, 76, 49, 0.9);
	font-size: 28rpx;
	display: flex;
	align-items: center;
    justify-content: flex-end;
    box-sizing: border-box;
	padding: 10rpx 30rpx;
	z-index: 99999;
	
}
</style>
