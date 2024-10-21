<template>
    <view class="primecard_index" id="main_body">
        <u-navbar class="app_navbar" :placeholder="true" leftIconColor="#00328f" @leftClick="leftClick" @rightClick="rightClick">
            <view slot="right"><u-icon name="file-text-fill" color="#00328f" size="24"></u-icon></view>
        </u-navbar>
        <view class="primecard_content">
            <view>
                <u--image class="dib" src="/static/img/VIP.png" v-for="(item, index) in 4" :key="index" v-if="index < 4" width="60px" height="36px"></u--image>
                <view class="r mr_20">x<span class="fz_30">{{vip_num}}</span></view>
                <view class="text_1">You Have {{vip_num}} Prime Cards Available</view>
                <view class="text_title">What can you do with a Prime Card ?</view>
                <view class="text_text">You can get more beautiful resume templates</view>
                <view class="text_title">How to get a Prime Card ?</view>
                <view class="text_text">
                    1.Make a purchase for 1USD/PC<br/>
                    2.You will get a free Prime Card when inviting
                    others to download Tiger CV successfully
                </view>
                <view class="p_0_10 mt_20">
                    <u-button @click="inviteNow" class="app_btn"> INVITE NOW </u-button>
                </view>
                <view class="text_title mt_20">Give or sell your Prime Cards to others</view>
                <view class="text_text" style="margin-top:10px;">*The official price for a Prime Card is 1USD/PC<br /> You can negotiate with the buyers about the price and method of payment.</view>
                <view class="p_0_10 common_input">
                    <view class="input_label">Email address</view>
                    <!-- <u--input v-model="mail" border="bottom" clearable></u--input> -->
                    <input-autocomplete
                        class="unit-item__input"
                        :value="mail"
                        v-model="mail"
                        highlightColor="#FF0000"
                        :loadData="loadAutocompleteData"
                    ></input-autocomplete>
                </view>
                <view class="p_0_10 common_input">
                    <view class="input_label">Quantity</view>
                    <u--input v-model="num" border="bottom" clearable></u--input>
                </view>
                <view class="p_0_10 mt_20">
                    <u-button @click="onClickDonate" class="app_btn" :loading="loading"> CONFIRM </u-button>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import { getUserInfo, vipGive } from "@/api/user";
    import inputAutocomplete from '@/components/input-autocomplete/input-autocomplete.vue';
    import { emails } from '@/common/tool';

    export default {
        name: 'primecard',
        data() {
            return {
                vip_num: 0,
                mail: "", // 需要赠与的账号
                num: "", // 需要赠与的数量
                loading: false
            }
        },
        onShow() {
            this.initData()
        },
        components: {
            inputAutocomplete
        },
        methods: {
            async initData() {
                const resData = await getUserInfo();
                console.log((resData));
                if (resData) {
                    this.vip_num = resData.vip_num ? resData.vip_num * 1 : 0;
                }
            },
            async onClickDonate() {

                this.loading = true;
                let data = {
                    num: this.num,
                    email: this.mail,
                    time: new Date().getTime()
                };
               try {
                    const resData = await vipGive(data, { showMessage: true });
                    if (resData) {
                        this.$u.toast('Successful');
                        this.num = '';
                        this.mail = '';
                        this.initData();
                    } else {
                        this.$u.toast(resData.message);
                    }
                    this.loading = false;
               } catch (error) {
                    this.loading = false;
               }
               this.loading = false;
            },
            loadAutocompleteData(value) {
                let resList = [];
                emails.forEach(e => {
                    resList.push(value+e)
                });
                return Promise.resolve(resList);
            },
            leftClick() {
                uni.switchTab({
                    url: '/pages/center/index'
                })
            },
            rightClick() {
                uni.redirectTo({
                    url: '/pages/center/donationRecords'
                })
            },
            inviteNow() {
                uni.redirectTo({
                    url: '/pages/center/recommendation'
                })
            }
        }
    }
</script>

<style lang="scss">
    .primecard_index{
        background-color: #fff;
        .primecard_content{
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