<template>
  <view class="givingRecords" id="main_body">
      <u-navbar class="app_navbar" placeholder="true" leftIconColor="#00328f" @leftClick="leftClick" title="Prime Card Usage History" :titleStyle="{'font-size': '16px','font-weight': '900'}"></u-navbar>

      <u-skeleton v-show="showSkeleton" class="p_10 mt_10" :loading="true" rows="1" v-for="item in 6" key="item"></u-skeleton>
      <view v-if="!loading && !showSkeleton" class="records">
        <view v-if="records.length !== 0" style="padding-top: 10px;">
          <view class="record-list mb_10 v_card p_10" max-width="400" tile v-for="(item, index) in records" :key="index">
            <view style="margin-bottom:10px;font-size: 16px; font-weight: 900;">{{ item.invite_time | getDate  }}</view>
            <view style="margin-bottom:10px;font-size: 14px; font-weight: 900;color: #00000099;">{{  item.invite_time | getTime  }} inviting {{  item.email }} </view>
          </view>
        </view>
        <view v-else style="justify-content:center">No Donation Records</view>
      </view>
  </view>
</template>

<script>
import { inviteRecord } from '@/api/user'
export default {
  data() {
    return {
      records: [
        {
          // invite_time: '2020-12-10 23:59:59',
          // email: '123@qq.com',
        }
      ],
      showSkeleton: false
    }
  },
  created() {
    this.showSkeleton = true
    this.getData()
  },
  onPullDownRefresh() {
    this.showSkeleton = true
    this.getData()
  },
  methods: {
    onRefresh () {
      this.getData()
    },
    async getData() {
      const resData = await inviteRecord({
        page: 1,
        pageSize: 999
      })
      if (resData) {
        this.records = resData
      }
      this.showSkeleton = false
      uni.stopPullDownRefresh()
    },
    leftClick() {
      uni.redirectTo({
          url: '/pages/center/recommendation'
      })
    },
  },
  // 日期过滤器
  filters: {
    getDate(value) {
      return value.slice(0, 10) + ''.indexOf("-") != -1 ? value.slice(0, 10) + ''.replace(/\//g, "/") : ''
    },
    // 时间过滤器
    getTime(value) {
      return value.slice(10)
    }
  }
}
</script>

<style lang="scss" scoped>
.givingRecords {
  height: 100%;
  background-color: #fff;
  .flex1 {
    font-weight: 700;
    height: 100%;
    width: 100%;
    display: flex;
    vertical-align: bottom;
    justify-content: space-between;
    align-items: center;


    i {
      height: 100%;
      width: 100%;
      font-size: 30px;
    }
  }

  .records {
    // margin-top: 56px;
    padding: 0 5px;

    .v-cards {
      margin-bottom: 100px;

      .v-list-item .v-list-item__title {
        margin-bottom: 20px;
      }
    }
  }
}
</style>
