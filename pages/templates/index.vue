<template>
	<view class="templates_index" id="main_body">
		<!-- nav -->
		<u-navbar class="app_navbar" height="56px" :placeholder="true" leftIconColor="#00328f">
			<view slot="left" class="nav_title">
                <u-icon name="arrow-left" color="#00328f" size="22" @click="goBack"></u-icon>
            </view>
			<view slot="right" class="nav_right">
                <u-icon name="checkmark" color="#00328f" size="22" @click="submit"></u-icon>
			</view>
		</u-navbar>
        <!-- content -->
        <view class="resume-select" v-show="!showCarousel">
            <view class="rsm-title">Select your resume template</view>
            <view class="clearfix">
                <view
                    class="template-item l"
                    v-for="(item, index) in rsmModles"
                    :key="item.id"
                >
                    <view class="imgclass">
                        <u--image
                            v-if="item.is_vip == 1"
                            class="oneimg"
                            src="../../assets/VIP.png"
                            alt=""
                        ></u--image>
                        <u--image :class=" item.id == resumeData.id
                                ? 'item-img isImgSelected'
                                : 'item-img'
                            "
                            @click="selcetImg(item, index)"
                            :showLoading="true" :src="item.picUrl" :lazy-load="true" width="308rpx" height="444rpx"
                        >
                        </u--image>
                    </view>
                    <view class="template-title">{{ item.title }}</view>
                </view>
            </view>
        </view>
        <!-- 轮播选择 -->
        <view v-show="showCarousel">
            <view class="tc fz_28 swiper_title">{{resumeData.title}}</view>
            <u-swiper
                :current="current"
                :list="rsmModles"
                keyName="picUrl"
                previousMargin="30"
                nextMargin="30"
                :circular="true"
                :autoplay="false"
                radius="5"
                bgColor="#ffffff"
                imgMode="aspectFill"
                height="415px"
                @change="swiperChange"
            ></u-swiper>
        </view>
        <!-- 底部导航栏 -->
        <!-- <app-tabbar :selectvalue="selectvalue"></app-tabbar> -->
	</view>
</template>

<script>
    import { fetchResumeTemplate } from '@/api/resume'

	export default {
		data() {
			return {
                selectvalue:'RESUME',
                current: 0,
                showCarousel: false,
                rsmModles: [],
                resumeData: {
                    title: ''
                },
				resumeId:'',
                queryData: {}
            }
		},
		computed: {

		},
		onLoad(query) {
            this.queryData = query
			// 获取模板列表
            fetchResumeTemplate().then(res => {
			   this.rsmModles = res
            })
		},
		onShow() {
		},
		onReady() {
		},
		mounted() {
		},
		methods: {
			// 点击获取选中模板信息
            selcetImg(item, index) {
                if (!this.showCarousel) {
                    this.current = index
                    this.showCarousel = true
                }
				// 记录选中的模板id
                this.resumeId = item.id
				console.log(item.id)
            },
			// 
            swiperChange(data) {
				console.log(data)
                this.resumeData = this.rsmModles[data.current]
				// 记录选中的模板id
				this.resumeId = this.rsmModles[data.current].id
				
            },
            goBack() {
                if (this.showCarousel) {
                    this.showCarousel = false
                    return
                }
                uni.$u.route({
                    type: 'navigateBack',
                    // url: 'pages/resume/index'
                })
            },
            submit() {
				// 新建简历
                if (this.queryData.type == 'add') {
					// 将选中模板信息存储到本地
					uni.setStorageSync('templateId',this.resumeId)
					// 将携带的信息跳转到下一页
                    uni.$u.route({
                        type: 'redirectTo',
                        url: 'pages/resume/details',
                        params: {
                            type: this.queryData.type,
                        }
                    })
                }
				if(this.queryData.type=='select'){
					uni.$u.route({
					    type: 'redirectTo',
					    url: 'pages/resume/preview',
					    params: {
					        type: this.queryData.type,
							id : this.queryData.id,
							templateId:this.resumeId
					    }
					})
				}
            }
		}
	}
</script>
<style lang="scss" scoped="scoped">
.templates_index{
    min-height: 100%;
    background-color: #fff;
    padding: 0 40rpx;
    .resume-select{
        width: 100;
        height: 100vh;
        overflow: scroll;
        .rsm-title {
            width: 100%;
            font-weight: 600;
            font-size: 20px;
            margin: 10px 0 20px 4px;
    }
        .template-item {
            margin-right: 14rpx;
            &:nth-of-type(2n) {
                margin-right: 0;
            }
            .imgclass {
                position: relative;
                .oneimg {
                    position: absolute;
                    top: 0;
                    right: 0;
                    z-index: 99;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background-color: #fff;
                }
            }
            .item-img {
                width: 100%;
                height: 100%;
                border-radius: 6px;
                border: 5px solid rgba(000, 000, 000, 0.1);
            }
            .isImgSelected {
                border: 5px solid #00328f;
            }
            .template-title {
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 10px;
                text-align: center;
            }
        }
    }
    .fz_28{
        font-size: 28px;
    }
    .swiper_title{
        padding: 80rpx 0;
    }
}
</style>