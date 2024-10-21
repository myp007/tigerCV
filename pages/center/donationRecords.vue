<template>
  <view class="donationRecords" id="main_body">
    <u-navbar class="app_navbar" placeholder="true" leftIconColor="#00328f" @leftClick="leftClick" title="Prime Card Usage History" :titleStyle="{'font-size': '16px','font-weight': '900'}"></u-navbar>
    <view v-if="loading"  class="records">
      <view v-for="i in 6" :key="i" class="mt_10">
        <u-skeleton
          rows="2"
          title
          loading
        ></u-skeleton>
      </view>
    </view>

    <view v-else class="records">
      <!-- <view class="username" >Prime Card Usage History</view> -->
      <view v-if="records.length !== 0">
        <view class="record-list"
          v-for="(item, index) in records"
          :key="index"
        >
        <u-row>
          <u-col span="10">
            <view style="font-size:18px;font-weight: 900;"> {{item.platform}} </view>
            <view style="font-size:18px;font-weight: 900;">{{item.remark}}</view>
            <view style="font-family:none;margin-top:10px">{{item.create_time}}</view>
          </u-col>
          <u-col span="2">
            <view class="tr" style="margin-top:-13px">{{item.symbol}}{{item.num}}</view>
          </u-col>
        </u-row>
        </view>
      </view>
      <view v-else style="justify-content:center">No Donation Records</view>
    </view>
  </view>
</template>

<script>
import { getVipRecord } from '@/api/user'
export default {
  data () {
    return {
      records: [
        // {
        //   create_time:'2020-12-10 23:59:59',
        //   symbol:'-',
        //   num:'1',
        //   platform:'No Donation Records',
        //   remark:'No Donation Records',
        // }
      ],
      loading: false
    }
  },

  created () {
    this.loading = true
    this.getData()
  },
  onPullDownRefresh() {
    this.loading = true
    this.getData()
  },
  methods: {
    async getData () {
      this.loading = true
      const resData = await getVipRecord({
        page: 1,
        pageSize: 9999
      })
      this.loading = false
      if (resData) {
        this.records = resData
      }
      uni.stopPullDownRefresh()
    },
    leftClick() {
      uni.redirectTo({
          url: '/pages/center/primecard'
      })
    },
  },
  // 日期过滤器
  filters: {
    getDate (value) {
      return value.slice(0, 10)
    },
    // 时间过滤器
    getTime (value) {
      return value.slice(10)
    }
  }
}
</script>

<style lang="scss" scoped>
.donationRecords {
  /* height: 100%; */
  padding: 20px;
  background-color: #fff;
  .flex1 {
    font-weight: 700;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    i {
      height: 100%;
      width: 100%;
      font-size: 30px;
    }
  }

  .records {
    /* margin-top: 56px; */
    .username{
      font-size: 25px;
      font-weight: 900;
      padding-top: 60px;
      padding-bottom: 60px;
    }
    .v-cards {
      margin-bottom: 100px;
      .v-list-item .v-list-item__title {
        margin-bottom: 20px;
      }
    }
  }
}
</style>
