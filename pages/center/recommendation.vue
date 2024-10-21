<template>
    <view class="recommendation_index" id="main_body">
        <u-navbar class="app_navbar" :placeholder="true" leftIconColor="#00328f" @leftClick="leftClick" @rightClick="rightClick">
            <view slot="right"><u-icon name="file-text-fill" color="#00328f" size="24"></u-icon></view>
        </u-navbar>
        <view class="recommendation_content">
            <view>
                <view class="p_0_10" style="font-size:1.5rem;font-weight: 900;">Recommendation</view>
                <view class="text_text mt_20">Please invite your friends who are looking for a job.
                Everytime 2 people are invited successfully, you will be rewarded by a FREE prime Card</view>
                <view class="text_text mt_20">Please fill in your frineds' email addresses as below and they will receive a guide email.</view>
                <view class="p_0_10 common_input">
                    <view class="input_label">Please fill in a email address</view>
                    <input-autocomplete
                        class="unit-item__input"
                        :value="email1"
                        v-model="email1"
                        highlightColor="#FF0000"
                        :loadData="loadAutocompleteData"
                    ></input-autocomplete>
                </view>
                <view class="p_10 common_input">
                    <view class="input_label">Please fill in a email address</view>
                    <input-autocomplete
                        class="unit-item__input"
                        :value="email2"
                        v-model="email2"
                        highlightColor="#FF0000"
                        :loadData="loadAutocompleteData"
                    ></input-autocomplete>
                </view>
                <view class="p_10 common_input">
                    <view class="input_label">Please fill in a email address</view>
                    <input-autocomplete
                        class="unit-item__input"
                        :value="email3"
                        v-model="email3"
                        highlightColor="#FF0000"
                        :loadData="loadAutocompleteData"
                    ></input-autocomplete>
                </view>
                <view class="p_10 common_input">
                    <view class="input_label">Please fill in a email address</view>
                    <input-autocomplete
                        class="unit-item__input"
                        :value="email4"
                        v-model="email4"
                        highlightColor="#FF0000"
                        :loadData="loadAutocompleteData"
                    ></input-autocomplete>
                </view>
                <view class="p_10 common_input">
                    <view class="input_label">Please fill in a email address</view>
                    <input-autocomplete
                        class="unit-item__input"
                        :value="email5"
                        v-model="email5"
                        highlightColor="#FF0000"
                        :loadData="loadAutocompleteData"
                    ></input-autocomplete>
                </view>
                <view class="p_10 mt_20 tc">
                    <u-button @click="onClickDonate" class="app_btn" :loading="loading"> INVITE </u-button>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import { inviteFriends } from '@/api/user'
    import inputAutocomplete from '@/components/input-autocomplete/input-autocomplete.vue';
    import { emails } from '@/common/tool';

    export default {
        name: 'recommendation',
        data() {
            return {
                loading: false,
                email1: '',
                email2: '',
                email3: '',
                email4: '',
                email5: '',
            }
        },
        components: {
            inputAutocomplete
        },
        onShow() {

        },
        methods: {
            onClickDonate() {
                let arr = [
                    this.email1,
                    this.email2,
                    this.email3,
                    this.email4,
                    this.email5
                ]
                let list = arr.filter(item => item !== '')
                // 如果数组的长度为0，就弹框提示
                // 如果不为0，就显示loading效果，然后调用接口
                if (list.length > 0) {
                    this.loading = true
                    inviteFriends({ email: list }, {showMessage: true}).then(res => {
                        if (res) {
                            this.email1 = ''
                            this.email2 = ''
                            this.email3 = ''
                            this.email4 = ''
                            this.email5 = ''
                        }
                        this.loading = false
                    })
                } else {
                    this.$toasted.error('Please input at least one email', {
                        icon : 'alert-circle-outline '
                    })
                    this.$u.toast('Please input at least one email');
                }
            },
            loadAutocompleteData(value) {
                let resList = [];
                emails.forEach(e => {
                    resList.push(value+e)
                });
                return Promise.resolve(resList);
            },
            leftClick() {
                uni.navigateBack()
            },
            rightClick() {
                uni.redirectTo({
                    url: '/pages/center/invitingRecords'
                })
            },
        }
    }
</script>

<style lang="scss">
    .recommendation_index{
        height: 100%;
        background-color: #fff;
        .recommendation_content{
            padding: 20rpx;
            padding-top: 60rpx;
            .text_1{
                padding: 0 20rpx;
                color: #00000099;
                min-height: 60px;
                line-height: 50px;
                font-weight: 900;
            }
            .text_title{
                padding: 0 20rpx;
                line-height: 30px;
                font-weight: 900;
            }
            .text_text{
                padding: 0 20rpx;
                color: #00000099;
                min-height: 60px;
                font-weight: 900;
            }
        }
    }
</style>