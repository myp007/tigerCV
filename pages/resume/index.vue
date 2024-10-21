<template>
    <view class="resume_index" id="main_body">
        <u-modal :show="modalData.show" :content="modalData.content" confirm-text="AGREE" cancel-text="CANCEL"
            :showCancelButton="true" @cancel="modalData.show = false" @confirm="modelConfim"></u-modal>
        <!-- 标题 -->
        <h2 class="resume_title">Tiger Resume</h2>
        <view class="resume_skeleton" v-if="showSkeleton">
            <u-skeleton v-for="item in 10" :key="item" :loading="true" :animate="true" avatar avatarSize="136"
                avatarShape="square" rows="4"></u-skeleton>
        </view>
        <!-- 简历列表 -->
        <template v-if="!showSkeleton && resumelist.length > 0">
            <view class="resume_list">
                <view class="resume_item" v-for="(item, index) in resumelist" :key="index">
                    <view class="left_item" @click="buttonType('preview', item)">
                        <!-- 简历模板 -->
                        <u--image :showLoading="true" :src="item.image_path" :lazy-load="true" width="136px"
                            height="195px"></u--image>
                        <image v-if="item.resume_type == 1 " src="@/static/img/about.png" :lazy-load="true" class="cv_icon">
                        </image>
                        <image v-else
                            src="data:image/svg+xml;base64,CiAgICAgICAgPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgogICAgICAgICAgICA8cGF0aCBzdHlsZT0iZmlsbDojRTJFNUU3OyIgZD0iTTEyOCwwYy0xNy42LDAtMzIsMTQuNC0zMiwzMnY0NDhjMCwxNy42LDE0LjQsMzIsMzIsMzJoMzIwYzE3LjYsMCwzMi0xNC40LDMyLTMyVjEyOEwzNTIsMEgxMjh6Ii8+CiAgICAgICAgICAgIDxwYXRoIHN0eWxlPSJmaWxsOiNCMEI3QkQ7IiBkPSJNMzg0LDEyOGg5NkwzNTIsMHY5NkMzNTIsMTEzLjYsMzY2LjQsMTI4LDM4NCwxMjh6Ii8+CiAgICAgICAgICAgIDxwb2x5Z29uIHN0eWxlPSJmaWxsOiNDQUQxRDg7IiBwb2ludHM9IjQ4MCwyMjQgMzg0LDEyOCA0ODAsMTI4ICIvPgogICAgICAgICAgICA8cGF0aCBzdHlsZT0iZmlsbDpyZ2IoMjI5LDE2MCwxNjgpOyIgZD0iTTQxNiw0MTZjMCw4LjgtNy4yLDE2LTE2LDE2SDQ4Yy04LjgsMC0xNi03LjItMTYtMTZWMjU2YzAtOC44LDcuMi0xNiwxNi0xNmgzNTJjOC44LDAsMTYsNy4yLDE2LDE2IFY0MTZ6Ii8+CiAgICAgICAgICAgIDxwYXRoIHN0eWxlPSJmaWxsOiNDQUQxRDg7IiBkPSJNNDAwLDQzMkg5NnYxNmgzMDRjOC44LDAsMTYtNy4yLDE2LTE2di0xNkM0MTYsNDI0LjgsNDA4LjgsNDMyLDQwMCw0MzJ6Ii8+CiAgICAgICAgICAgIDxnPjx0ZXh0Pjx0c3BhbiB4PSIyMjAiIHk9IjM4MCIgZm9udC1zaXplPSIxMjQiIGZvbnQtZmFtaWx5PSJWZXJkYW5hLCBIZWx2ZXRpY2EsIEFyaWFsLCBzYW5zLXNlcmlmIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UERGPC90c3Bhbj48L3RleHQ+PC9nPgogICAgICAgIDwvc3ZnPg=="
                            :lazy-load="true" class="cv_icon"></image>
                    </view>
                    <view class="right_item">
                        <view class="right-top">
                            <view class="item-title" @click="buttonType('edit', item)">
                                {{ item.resume_name }}
                            </view>
                            <view class="item-date">{{ item.updatetime }}</view>
                        </view>
                        <!-- 操作按钮 -->
                        <view class="right-button">
                            <view class="clearfix button_item" @click="buttonType('edit', item)" v-if="item.resume_type == 1">
                                <u-icon class="l" name="edit-pen-fill" color="#00328f" size="24"></u-icon>
                                <view class="l text">Edit</view>
                            </view>
                            <view class="clearfix button_item" @click="buttonType('share', item)">
                                <u-icon class="l" name="share-square" color="#00328f" size="24"></u-icon>
                                <view class="l text">Share a link</view>
                            </view>
                            <view class="clearfix button_item" @click="buttonType('preview', item)">
                                <u-icon class="l" name="download" color="#00328f" size="24"></u-icon>
                                <view class="l text">Preview</view>
                            </view>
                            <view class="clearfix button_item" v-if="item.resume_type == 1 || item.resume_type == 3" @click="buttonType('delete', item)">
                                <u-icon class="l" name="trash" color="#00328f" size="24"></u-icon>
                                <view class="l text">Delete</view>
                            </view>
                            <!-- <view class="clearfix button_item" v-if="item.resume_type == 1">
                                <u-icon class="l" name="more-dot-fill" color="#00328f" size="24"
                                    @click="buttonType('showmore', item)"></u-icon>
                                <view class="l text" @click="buttonType('showmore', item)">More</view>
                                <view class="setting-layer" v-if="item.showMore" style="left: -40rpx;text-align: right;">
                                    <view class="single" @click="buttonType('delete', item)">
                                        <view>DELETE</view>
                                    </view>
                                </view>
                            </view> -->
                        </view>
                    </view>
                </view>
            </view>
            <!-- 底部操作 -->
            <view class="bottom_cell">
                <view class="clearfix cell_item" @click="buttonType('add')">
                    <view class="l">New Resume</view>
                    <u-icon class="r" name="arrow-right" color="#00328f" size="18"></u-icon>
                </view>
                <view class="clearfix cell_item" @click="buttonType('upload')">
                    <view class="l">Upload Resume</view>
                    <u-icon class="r" name="arrow-right" color="#00328f" size="18"></u-icon>
                </view>
                <view class="clearfix cell_item">
                    <view class="l" @click="buttonType('send')">Send Resume</view>
                    <u-icon class="r" name="arrow-right" color="#00328f" size="18"></u-icon>
                </view>
                <view class="clearfix cell_item" @click="buttonType('record')">
                    <view class="l">History</view>
                    <u-icon class="r" name="arrow-right" color="#00328f" size="18"></u-icon>
                </view>
            </view>
        </template>
        <!-- 新用户引导文案 -->
        <template v-if="!showSkeleton && resumelist.length <= 0">
            <view class="guide_box">
                <p class="tc pb_40" style="font-size: 24px;line-height: 1.5em;">
                    An attractive resume is the beginning of finding a good job.
                </p>
                <p class="fz_14">
                    Are you troubled by how to make a resume? With TigerCV, it's easy.
                </p>
                <view class="fz_14 ft_emoji_bold">
                    Step 1: Choose a template you like
                </view>
                <view class="fz_14 ft_emoji_bold">
                    Step 2: Follow our guide, like a face-to-face interview, to complete
                    your resume.
                </view>
                <p class="fz_14 ft_emoji_bold">
                    Step 3: Use the "Sending" function of the APP to send your resume to
                    the recruiter's mailbox.
                </p>
                <p class="fz_12">
                    You do not need to be an expert in word typography, nor do you need
                    professional aesthetic knowledge. Complete your resume in just 20
                    minutes.
                </p>
            </view>
            <!-- 底部新增简历 -->
            <view class="tc">
                <u-button class="guide_button" @click="buttonType('add')">
                    Create your first resume now !
                </u-button>
            </view>
        </template>
        <!-- 底部导航栏tabbar -->
        <!-- <app-tabbar :selectvalue="selectvalue"></app-tabbar>	 -->
    </view>
</template>

<script>
import { fetchResumeList, fetchResumeDelete } from '@/api/resume'
import jsPDF from 'jspdf'
export default {
    name: 'resume_index',
    data() {
        return {
            urls: "",
            appinfo: {},
            selectvalue: "RESUME",
            resumelist: [],
            showSkeleton: true,
            modalData: {
                show: false,
                content: '',
                type: '',
                params: {}
            }
        }
    },
    onLoad() {

    },
    onShow() {
        // 获取简历列表
        this.getListData()
    },
    methods: {
        // 获取简历列表数据
        getListData() {
            this.showSkeleton = true
            fetchResumeList().then(res => {
                let resData = res
                if (resData !== null && resData && resData.length > 0) {
                    this.resumelist = resData
                } else {
                    this.resumelist = []
                }
                this.showSkeleton = false
            })
        },
        // 删除简历
        modelConfim() {
            if (this.modalData.type == 'delete') {
                const param = {
                    rid: this.modalData.params.id
                }
                fetchResumeDelete(param).then(res => {
                    this.modalData.show = false
                    this.getListData()
                })
            }
        },
        buttonType(type, item) {
            // 简历新建
            if (type == 'add') {
                uni.$u.route({
                    url: 'pages/templates/index',
                    params: {
                        type: 'add'
                    }
                })
            }
            // 简历upload
            else if (type == 'upload') {
                uni.$u.route({
                    url: 'pages/resume/upload',
                    params: {
                        type: 'add'
                    }
                })
                
            }
            // 简历编辑
            else if (type == 'edit') {
                uni.$u.route({
                    url: 'pages/resume/details',
                    params: {
                        id: item.id
                    }
                })
            }
            // 分享链接
            else if (type == 'share') {
                let url = JSON.stringify(item.preview_url)
                uni.setStorageSync('share_url', item.preview_url)
                uni.$u.route({
                    url: 'pages/resume/resumeShare',
                    params: {
                        rid: item.id,
                    }
                })
                // 更多
            } else if (type == 'showmore') {
                let flag = item.showMore ? false : true
                this.$set(item, 'showMore', flag)
                // 删除
            } else if (type == 'delete') {
                this.modalData.show = true
                this.modalData.content = 'Delete current resume.'
                this.modalData.params = item
                this.modalData.type = 'delete'
                item.showMore = false
                // 历史记录
            } else if (type == 'record') {
                uni.$u.route({
                    url: 'pages/resume/record'
                })
            }
            // 发送简历
            else if (type == 'send') {
                uni.$u.route({
                    url: 'pages/resume/resumeSend'
                })
            }
            // 预览简历
            else if (type == 'preview') {
                uni.setStorageSync('templateId', item.template_id)
                if (item.resume_type == 1) {
                    uni.navigateTo({
                        url: '/pages/resume/preview?id=' + item.id
                    })
                } else {
                    let url = item.preview_url
                    // #ifdef MP-WEIXIN || H5
                    window.open(url)
                    // #endif

                    // #ifdef APP-PLUS 
                    if (plus.os.name == 'Android' || plus.os.name == 'iOS') {
                        plus.runtime.openURL(url);
                        return
                    }
                    // #endif 
                    // uni.navigateTo({
                    //     url: '/pages/resume/previewSend?id=' + item.id
                    // }) 
                }


            }
        }
    }
}

</script>

<style lang="scss">
.resume_index {
    width: 100%;
    /* height: 100%;
    overflow: hidden; */
    min-height: 100%;
    font-family: "Roboto", sans-serif;
    background-color: #fff;
    padding: 20px;
    box-sizing: border-box;
    padding-bottom: 60px;
    color: rgba(0, 0, 0, 0.87);

    .resume_title {
        font-size: 24px;
        font-weight: 700;
        margin: 0px;
        color: #00328f;
        font-family: Sitka Small !important;
    }

    .resume_skeleton {
        .u-skeleton {
            margin-top: 20px;
        }
    }

    .resume_list {
        .resume_item {
            border-radius: 10px;
            display: flex;
            margin: 40px 0;
            position: relative;

            .right_item {
                padding-left: 20px;
                max-width: 200px;

                .right-top {
                    .item-title {
                        font-size: 1.2em;
                        font-weight: 600;
                        color: #000;
                        line-height: 1em;
                        margin-bottom: 0.5em;
                        word-wrap: break-word;
                    }

                    .item-date {
                        font-size: 14px;
                        color: gray;
                    }
                }

                .right-button {
                    list-style: none;
                    padding: 2px 0;
                    font-size: 14px;
                    font-weight: 400;

                    .button_item {
                        line-height: 34px;
                        position: relative;

                        .u-icon {
                            margin-top: 4px;
                            margin-right: 10px;
                        }

                        .text {}
                    }
                }
            }

            .left_item {
                width: 136px;
                border: 1px solid rgba(205, 203, 203, 0.4);
                border-radius: 6px;
                overflow: hidden;
                position: relative;

                .cv_icon {
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                }

                .pdf_icon {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    width: 40px;
                    height: 40px;
                }
            }
        }
    }

    .bottom_cell {
        padding: 0 16px;

        .cell_item {
            line-height: 56px;
            font-size: 16px;
        }

        .u-icon {
            margin-top: 20px;
        }
    }

    .guide_box {
        padding: 40px 10px;
    }

    .guide_btn {
        padding: 26px 28px;
    }

    .pb_40 {
        padding-bottom: 80rpx;
    }

    p {
        margin-bottom: 16px;
    }

    .ft_emoji_bold {
        font-family: emoji;
        font-weight: bold;
    }

    .guide_button {
        padding: 18px 28px !important;
        background-color: #00328f;
        color: #fff;
        width: 100% !important;
    }
}

.ft {
    z-index: 9999;
}</style>