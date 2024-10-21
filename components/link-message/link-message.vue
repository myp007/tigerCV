<template>
	<view>
		<!-- #ifdef APP-PLUS || H5 -->
		<view class="link-message" @click="showLinkPopup(value.message.link_url)">{{value.message.link_name ? value.message.link_name:value.message.link_url}}</view>
		<!-- #endif -->
		<!-- #ifdef MP -->
		<u-link :color="value.sender == 'me' ? '#f74c31':'#6388fb'" :href="value.message.link_url">{{value.message.link_name ? value.message.link_name:value.message.link_url}}</u-link>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		name: "link-message",
		props: {
			value: {
				type: Object,
				required: true
			},
			LinkPopupShow: {
				default: false
			},
			linkPopupUrl: {
				default: ''
			}
		},
		methods: {
			showLinkPopup: function (url) {
				this.$emit('update:LinkPopupShow', true)
				this.$emit('update:linkPopupUrl', url)
			}
		}
	}
</script>

<style lang="scss" scoped>
.wrapper .message-item.me .link-message {
	color: $--red;
}
.link-message {
	font-size: 30rpx;
	color: $--blue;
}
</style>
