<template>
    <view class="resume_share">
        <u-navbar class="app_navbar" height="56px" :placeholder="true" leftIconColor="#00328f">
			<view slot="left" class="nav_title">
                <u-icon name="arrow-left" color="#00328f" size="22" @click="goBack"></u-icon>
            </view>
		</u-navbar>
        <view style="padding: 100rpx 40rpx;">
            <view>Share link address:</view>
            <view   @click="copyUrl" style="color: #00328f;margin-top: 20rpx; word-wrap: break-word;">{{data.preview_url}}</view>
        </view>
        <view style="text-align: center;width: 100%;">
            <u-button class="guide_button" @click="copyUrl">
            Copy Share link
            </u-button>
        </view>
    </view>
</template>

<script>
import { detailResume } from '@/api/resume'
import config from '@/common/config'
export default {
    data() {
        return{
            data: {
                preview_url: '',

            }
        }
    },
    onLoad(query) {
        // detailResume({
        //     rid: query.rid
        // }).then(res => {
		// 	// 分享链接
        //     this.data.preview_url = config.appUrl + `/tool/preview/index?sign=${res.sign}|${res.basics.template_id}&_t=${Math.random()}`
		// 	console.log(res)
        // })
        this.data.preview_url = uni.getStorageSync('share_url');
    },
    methods: {
        goBack() {
            
            uni.$u.route({
                type: 'navigateBack',
            })
        },
        copyUrl() {
            uni.setClipboardData({
                data: this.data.preview_url, //要被复制的内容
                success: () => { //复制成功的回调函数
                    uni.$u.toast('Copy Success!')
                }
            });
        }
    }
}
</script>

<style lang="scss">
.resume_share{
    height: 100%;
    background-color: #fff;
    font-family: "Roboto", sans-serif;
    .guide_button{
        // padding: 10px 60rpx !important;
        width: 50%;
        text-align: center;
        height: 38px;
        line-height: 38px;
        background-color: #00328f;
        color: #fff;
        width: auto !important;
        display: inline-block;
        border-radius: 5px;
    }

}
</style>