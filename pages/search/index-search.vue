<template>
	<view class="inde_search_box" id="main_body">
        <u-navbar
            title="Job Search"
            @leftClick="leftClick"
            :placeholder="true"
            :fixed="true"
            :titleStyle="{'font-size': '18px','font-weight': '900','text-align':'center','padding':'5px 0'}"
        >
        </u-navbar>
        <view class="v_card p_10">
            <u-row>
                <u-col span="12">
                    <view class="p_0_10 common_input">
                        <view class="input_label">Job NO</view>
                        <input-autocomplete
                            class="unit-item__input"
                            :value="searchForm.job_no"
                            v-model="searchForm.job_no"
                            highlightColor="#FF0000"
                        ></input-autocomplete>
                    </view>
                    <view class="p_0_10 common_input">
                        <view class="input_label">Location</view>
                        <input-autocomplete
                            class="unit-item__input"
                            :value="searchForm.location"
                            v-model="searchForm.location"
                            highlightColor="#FF0000"
                            :loadData="loadAutocompleteDataLocation"
                        ></input-autocomplete>
                    </view>
                    <view class="p_0_10 common_input">
                        <view class="input_label">Search Criteria</view>
                        <input-autocomplete
                            class="unit-item__input"
                            :value="searchForm.keyWord"
                            v-model="searchForm.keyWord"
                            highlightColor="#FF0000"
                            :loadData="loadAutocompleteDataKeyword"
                            v-on:selectItem="keywordChange"
                            v-on:inputBlur="keywordBlur"
                        ></input-autocomplete>
                    </view>
                </u-col>
                <!-- <u-col span="1">
                    <u-icon name="search" size="24" @click="search"></u-icon>
                </u-col> -->
            </u-row>
            <view style="max-height: 300px;overflow: auto;padding: 0px 10px; height: 33px;">
                <u-tag class="dib" v-for="(item, index) in keyWord" :key="index" :text="item.keyword" size="mini" closable @close="closeKeyword(index)"></u-tag>
            </view>
            
            <u-button class="guide_button" @click="search">
                Search
            </u-button>
            <view style="font-size: 12px; color:#00000099;font-weight: 900;padding: 0px 10px;">Type keywords to search your matching jobs, using  commas and new line to separate different keywords.</view>
        </view>
        <!-- <view class="text_db mt_10">We already searched information for you from all groups below, you don't have to follow these groups</view>
        
        <view class="v_card p_10">
            <view class="search">
                <u-row>
                    <u-col span="11">
                        <view class="p_0_10 common_input">
                            <input-autocomplete
                                class="unit-item__input"
                                :value="name"
                                v-model="name"
                                highlightColor="#FF0000"
                                :loadData="loadAutocompleteDataName"
                            ></input-autocomplete>
                        </view>
                    </u-col>
                    <u-col span="1">
                        <u-icon name="plus" size="20" @click="openDialogForm"></u-icon>
                    </u-col>
                </u-row>
            </view>
            <u-skeleton v-show="showSkeleton" class="p_10 mt_10" :loading="true" rows="1" v-for="item in 6" key="item"></u-skeleton>
            <u-list class="mt_10" :preLoadScreen="listData.length/10">
                <u-list-item v-for="(item, index) in listData" :key="index">
                    <u-cell :title="item.groups_name" @click="showDetail(item)">
                        <u-icon slot="icon" name="facebook-circle-fill" size="19" color="#00328f"></u-icon>
                    </u-cell>
                </u-list-item>
            </u-list>
        </view> -->

        <u-popup class="v_card" :show="dialogDetail.show" @close="dialogDetail.show = false" mode="center">
            <view class="p_20" style="max-width: 300px;">
                <view class="fz_20 fw_bold"><u-icon class="dib" color="#00328f" name="facebook-circle-fill" size="22"></u-icon>{{dialogDetail.groups_name}}</view>
                <view style="line-height: 14px;" @click="copyUrl">
                    <u--text v-if="dialogDetail.url" mode="link" :text="dialogDetail.url" :href="dialogDetail.url" suffixIcon="share-square"></u--text>
                    <u--text v-else="dialogDetail.url" mode="link" :text="`https://www.facebook.com/groups/{{dialogDetail.groups_id}}`" :href="`https://www.facebook.com/groups/{{dialogDetail.groups_id}}`" suffixIcon="share-square"></u--text>
                </view>
                <u-divider></u-divider>
                <view style="padding-bottom: 0px;">
                    <div class="my-4 color_black fm_no">
                        <span style="display: inline-block;width: 100px;text-align: right;padding-right: 5px;">Today Posts :</span>  {{dialogDetail.today_count}}
                    </div>
                    <div class="my-4 color_black fm_no mt_10">
                        <span style="display: inline-block;width: 100px;text-align: right;padding-right: 5px;">3 Days Posts :</span> {{dialogDetail.three_count}}
                    </div>
                    <div class="my-4 color_black fm_no mt_10">
                        <span style="display: inline-block;width: 100px;text-align: right;padding-right: 5px;">Total Posts :</span> {{dialogDetail.all_count}}
                    </div>
                </view>

                <u-divider></u-divider>

                <view>
                    <view class="fz_14 color_grey pt_10 fm_no">
                        <u--text prefixIcon="clock-fill" iconStyle="font-size: 19px" text="Last Update Time :"></u--text>
                        <view class="pl_30 dib">{{dialogDetail.last_time}}</view>
                    </view>
                </view>
            </view>
		</u-popup>

        <u-popup class="v_card" :show="dialogFrom.show" @close="dialogFrom.show = false" mode="center">
            <view class="p_10" style="max-width: 300px;">
                <view style="font-size: 20px; font-weight: 900;padding: 10px;">Add New Group</view>
                <view class="p_0_10 common_input">
                    <view class="input_label">Group Url</view>
                    <u--textarea v-model="dialogFrom.groupUrl" border="bottom"></u--textarea>
                    <view style="font-size: 12px; color:#00000099;font-weight: 900;margin-top: 5px;">If the group you follow has not been collected by us, please attach the URL of the group below. We will collect it within 24 hours.</view>
                </view>
                <view class="clearfix tr">
                    <u-button @click="onSaveDialogFrom" class="app_btn">
                        SUBMIT
                    </u-button>
                </view>
            </view>
		</u-popup>
    </view>
</template>

<script>
    import { getFacebookGroup, getJobSearchKeyWord, getGroupCount, addGroup } from '@/api/facebookTool'

	export default {
		data() {
			return {
                showSkeleton: false,
                searchForm: {
                    location: '',
                    keyWord: ''
                },
                keyWord: [],
                name: '',
                jobList: [],
                listData: [],
                groups: [],
                keyWordList: [
                    // {
                    //     keyword: "architectural engineer",
                    //     value: "architectural engineer",
                    // },
                    // {
                    //     keyword: "accounting",
                    //     value: "accounting,Accountant,audit"
                    // }
                ],
                dialogDetail: {
                    show: false,
                    groups_name: '',
                    all_count: '',
                    last_time: '',
                    three_count: '',
                    today_count: '',
                    url: '',
                },
                dialogFrom: {
                    groupName: '',
                    groupUrl: '',
                    show: false
                },
			}
		},
		onShow() {
            this.showSkeleton = true
            this.init()
            let queryData = uni.getStorageSync('jobQuery');
            if (queryData) {
                this.searchForm.location = queryData.location
                this.searchForm.job_no = queryData.job_no
                this.keyWord = queryData.keyWord || []
            }
		},
		methods: {
            init() {
                // getFacebookGroup().then(res => {
                //     this.showSkeleton = false
                //     if (res) {
                //         // let res = [
                //         //     {groups_name: "Bulacan job hiring", groups_id: "1019205764835682", mark_no_count: "100"},
                //         //     {groups_name: "job 2", groups_id: "1019205764835682", mark_no_count: "100"},
                //         //     {groups_name: "job 3", groups_id: "1019205764835682", mark_no_count: "100"},
                //         //     {groups_name: "job 4", groups_id: "1019205764835682", mark_no_count: "100"},
                //         //     {groups_name: "job 5", groups_id: "1019205764835682", mark_no_count: "100"},
                //         //     {groups_name: "job 6", groups_id: "1019205764835682", mark_no_count: "100"}
                //         // ]
                //         this.listData = res
                //         this.jobList = res
                //         this.groups = res.map(o => { return o.groups_name})
                //     }
                // })
                // 搜索关键字
                getJobSearchKeyWord().then(res => {
                    if (res) {
                        this.keyWordList = res
                    }
                })
            },
            loadAutocompleteDataLocation(string) {
                return Promise.resolve([]);
            },
            loadAutocompleteDataKeyword(string) {
                let list = []
                list = this.keyWordList.map( o => {
                    return o. keyword
                })
                return Promise.resolve(list);
            },
            keywordChange(v){
                let index = this.keyWord.findIndex(o => { return o.keyword == v});
                if (index == -1) {
                    let i = this.keyWordList.findIndex(o => { return o.keyword == v});
                    this.keyWord.push(this.keyWordList[i])
                }
                this.searchForm.keyWord = ''
                console.log(1)
            },
            keywordBlur() {
                let v = this.searchForm.keyWord
                if (!v) {
                    return
                }
                console.log(2)
                let index = this.keyWord.findIndex(o => { return o.keyword == v});
                if (index == -1) {
                    this.keyWord.push({
                        keyword: v,
                        value: v
                    })
                }
                setTimeout(() => {
                    this.searchForm.keyWord = ''
                }, 100);
            },
            closeKeyword(i) {
				this.keyWord.splice(i, 1)
			},
            loadAutocompleteDataName(string) {
                return Promise.resolve(this.groups);
            },
            showDetail(item) {
                this.dialogDetail.groups_name = item.groups_name
                this.dialogDetail.groups_id = item.groups_id
                getGroupCount({groupId: item.groups_id}).then(res => {
                    // let res = {
                    //     groups_name: 'Bulacan job hiring',
                    //     all_count: '100',
                    //     last_time: '10/09/2022',
                    //     three_count: '0',
                    //     today_count: '0',
                    //     url: 'https://www.facebook.com/groups/1019205764835682',
                    // }
                    if (typeof(res) == 'object') {
                        for (let key in res) {
                            this.dialogDetail[key] = res[key]
                        }
                        // this.dialogDetail.show = true
						if(item.groups_name == 'All'){
							uni.removeStorageSync('groups_id')
							uni.removeStorageSync('groups_name')
							uni.switchTab({
							    url: '/pages/index/index' 
							})
						}
						else{
							uni.setStorageSync('groups_id', item.groups_id)
							uni.setStorageSync('groups_name', item.groups_name)
							uni.switchTab({
							    url: '/pages/index/index' 
							})
						}
						
						
                    }
                })
            },
            copyUrl() {
                let text = this.dialogDetail.groups_url ? this.dialogDetail.url : `https://www.facebook.com/groups/${this.dialogDetail.groups_id}`;
                uni.setClipboardData({
                    data: text,
                    success: function () {
                        console.log('success');
                    }
                }); 
            },
            openDialogForm() {
                this.dialogFrom.show = true
                this.dialogFrom.groupUrl = ''
            },
            onSaveDialogFrom() {
                if (this.dialogFrom.groupUrl) {
                    uni.showLoading({ title: 'login....', mask: true });
                    addGroup({
                        groupName: 'user add',
                        groupUrl: this.dialogFrom.groupUrl,
                    }).then(res => {
                        uni.hideLoading();
                        if (res.length > 0) {
                            uni.$u.toast('SAVE SUCCESS')
                            this.dialogFrom.show = false
                            this.init()
                        }
                    })
                } else {
                    uni.$u.toast('GroupUrl is Request')
                }
            },
            search() {
                let that = this
                setTimeout(()=>{
					let jsonData = {
                        location: that.searchForm.location,
                        job_no:that.searchForm.job_no,
                        keyWord: that.keyWord
                    }
                    uni.setStorageSync('jobQuery', jsonData)
                    
                    uni.switchTab({
                        url: '/pages/index/index' 
                    })					
				},500)
                
            },
            leftClick() {
                uni.switchTab({
                    url: '/pages/index/index' 
                })
            }
        }
	}
</script>

<style lang="scss">
/* page {
	background: #FFFFFF;
} */
.inde_search_box{
    padding: 20rpx;
    .text_db{
        font-size: 14px;
        padding: 0 10px;
        font-weight: 900;
    }
    .pl_30{
        padding-left:20px;
    }
    .u-popup__content{
        border-radius: 4px;
    }
}.guide_button{
        width: 100% !important;
        margin:20rpx auto;
        text-align: center;
        height: 38px;
        line-height: 38px;
        background-color: #00328f;
        color: #fff;
        display: inline-block;
        border-radius: 5px;
    }
</style>
