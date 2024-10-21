<template>
	<view>
		<view hover-class="session-item-hover" :class="item.top" class="session-item">
			<view style="position: relative;">
				<image class="session-avatar" :class="item.avatar_gray" :src="item.avatar" mode="aspectFill"></image>
				<view class="session-unread-count" :style="{'border-radius': item.unreadMessagesNumber < 10 ? '50%':'10px'}" v-if="item.unreadMessagesNumber > 0" :class="item.shield ? 'session-shield':''">{{item.unreadMessagesNumber>99?'99+':item.unreadMessagesNumber}}</view>
			</view>
		
			<view class="session-info-right">
				<view class="session-info-item">
					<view class="session-info-name">
						<view class="session-info-top">
							<view style="font-size:14px ;color:#999">{{item.companyname}}</view>
							<view >{{item.jobname}}</view>
						</view>
						<view class="session-info-time im-color-gray">{{item.last_time}}</view>
					</view>
					
				</view>
				<view class="session-info-item">
					<view class="session-last-message">
						<text class="session-user-status">{{(item.user_status ? item.user_status:'')}}</text>
						<text v-if="item.unread_fixed_msg" class="unread_fixed_msg">[{{item.unread_fixed_msg}}]</text>
						{{item.last_message}}
					</view>
					
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "session",
		props: {
			item: {
				type: Object,
				required: true
			}
		},
		data() {
			return {

			};
		},
		created(){
			// console.log(this.item)
		}
	}
</script>

<style lang="scss">
.session-item {
	padding: 24rpx 4%;
	display: flex;
	align-items: center;
	overflow: hidden;
}
.session-avatar {
	height: 100rpx;
	width: 100rpx;
	border-radius: 50%;
}
.session-info-right {
	margin-left: 20rpx;
	flex: 1;
	overflow: hidden;
}
.session-info-item {
	display: flex;
	height: auto;
	line-height: 48rpx;
	justify-content: space-between;
}
.session-info-top{
	flex:1;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	margin-right:10rpx;
	width:calc(100% - 90px) !important;
}
.session-info-top view{
	width:100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.session-info-name {
	display: flex;
	align-items: center;
	font-size: 32rpx;
	box-sizing: border-box;
    width: 100%;
	justify-content: space-between;
	// max-width: 300rpx;
}
.session-info-time {
	overflow: hidden;
	width:130rpx;
	word-break:word-wrap;
	flex-shrink: 0;
	text-align: right;
}
.im-color-gray {
	font-size: 12px;
	color: $--gray !important;
}
.session-last-message {
	font-size: 28rpx;
	color: #585858;
	display: inline-block;
	width: 80%;
	overflow: hidden;
	white-space: nowrap;
	vertical-align: middle;
	text-overflow: ellipsis;
}
.session-unread-count {
    font-size: 12px;
    position: absolute;
    top: 0px;
    right: -7px;
    height: 18px;
    margin-top: 1px;
    padding: 0 5px;
    background: #f74c31;
    text-align: center;
    line-height: 16px;
    color: #ffffff;
}
.im-img-gray {
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    filter: grayscale(100%);
    filter: gray;
}
.session-shield {
    background: #D0CFD1 !important;
}
.session-top {
    background: #F8F9F9 !important;
}
.session-item-hover {
	background: #EDEDED !important;
}
.unread_fixed_msg {
	color: #000;
	font-size: 14px;
}
</style>
