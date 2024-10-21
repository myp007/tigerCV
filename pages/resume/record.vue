<template>
    <view class="resume_record">
        <!-- nav -->
        <u-navbar class="app_navbar" height="56px" title="Send History" :title-bold="true" :placeholder="true" leftIconColor="#00328f">
			<view slot="left" class="nav_title">
                <u-icon name="arrow-left" color="#00328f" size="22" @click="goBack"></u-icon>
            </view>
		</u-navbar>
        <!-- content -->
        <view class="record_content">
            <view v-if="loading"  class="record">
                <u-skeleton style="margin-bottom: 40rpx;" rows="4" title loading v-for="item in 10" :key="item"></u-skeleton>
            </view>
            <view v-else class="record">
                <!-- <h1 class="title">Delivery Records</h1> -->
                <view v-if="list.length > 0">
                    <view class="item" v-for="(item, index) in list" :key="index">
                        <view class="content" @click="check(item)">
                            <view class="left">
                                <view class="subject">{{ item.subject }}</view>
                                <view class="email">{{ item.to }}</view>
                                <view class="time">{{ item.create_date }}</view>
                            </view>
                            <view class="right">
                                <view class="check" @click="check(item)">
                                    <!-- 已读 -->
                                    <u-icon v-if="item.is_read == 1" name="email" size="22"></u-icon>
                                    <!-- 发送中 -->
                                    <u-icon v-else-if="item.status == 1" name="rewind-right-fill" size="22"></u-icon>
                                    <!-- 已发送 -->
                                    <u-icon v-else name="email-fill" size="22"></u-icon>
                                </view>
                                <view class="readDate">{{ item.read_date }}</view>
                            </view>
                        </view>
                        <u-line></u-line>
                    </view>
                </view>
                <v-subheader v-else style="justify-content:center">No history</v-subheader>
            </view>
        </view>
        	<!-- 底部导航栏 -->
		<!-- <app-tabbar :selectvalue="selectvalue"></app-tabbar> -->
    </view>
</template>
<script>
import { getResumeSendList } from '@/api/resume'
export default{
    data() {
        return {
            loading: true,
            list: [],
            selectvalue:'RESUME',
            params: {
                page: 1,
                pageSize: 20
            }
        }
    },
    onLoad() {
        this.recordList()
    },
    methods: {
        goBack() {
            uni.switchTab({
				url: '/pages/resume/index'
			})
        },
        check(item) {
            uni.$u.route({
                url: 'pages/resume/recordDetail',
                params: {
                    id: item.id
                }
            })
        },
        recordList () {
            this.loading = true
            getResumeSendList(this.params).then(res => {
                this.list = res
                this.loading = false
            })
        },
    }
}
</script>

<style lang="scss">
.record_content{
    font-family: "Roboto", sans-serif;
    background-color: #fff;
    line-height: 1.5em;
    color: rgba(0, 0, 0, 0.87);
    /* padding: 60rpx; */
    .record {
        /* margin-top: 56px; */
        padding: 60rpx;

        .title {
            text-align: center;
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 30px;
        }

        .item {
            margin-bottom: 20px;

            .content {
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;

                .left {
                    .subject {
                    width: 100%;
                    font-size: 16px;
                    font-weight: 600;
                    text-rendering: optimizeLegibility;
                    -webkit-font-smoothing: antialiased;
                    }
                    .email {
                    width: 100%;
                    font-size: 16px;
                    font-weight: 600;
                    }

                    .time {
                    color: rgba(0, 0, 0, 0.6);
                    font-size: 12px;
                    font-weight: 400;
                    }
                }

                .right {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: flex-end;
                    font-weight: 600;
                    width: 226px;
                    .readDate {
                    color: rgba(31, 7, 7, 0.6);
                    font-size: 12px;
                    font-weight: 400;
                    }
                }
            }
        }
    }
}
</style>