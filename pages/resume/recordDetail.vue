<template>
  <view class="record_detail">
     <u-navbar class="app_navbar" height="56px" title="Send History" :title-bold="true" :placeholder="true"
        leftIconColor="#00328f">
        <view slot="left" class="nav_title" >
          <u-icon name="arrow-left" @click="goBack" color="#00328f" size="22" ></u-icon>
        </view>
        <view slot="right" class="nav_right" >
          <u-icon name="edit-pen-fill" v-if="!loading" @click="goEdit" color="#00328f" size="22"></u-icon>
          <u-loading-icon mode="circle" v-if="loading" color="#00328f" size="22"></u-loading-icon>
        </view>
      </u-navbar>
    <view v-if="loading"  class="skeleton_detail">
      <u-skeleton style="margin-bottom: 40rpx;" rows="4" title loading v-for="item in 10" :key="item"></u-skeleton>
    </view>
    <view v-if="!loading">
      <view class="record_detail_content">
        <view class="home">
          <view class="Resume">{{ row.subject }}</view>
          <view v-if="row.is_read == 1" class="status">
            【 Resume has been read on {{ row.read_date }}】
          </view>
          <view class="from">From:&nbsp;&nbsp;{{ row.system_email }}</view>
          <view class="to">To:&nbsp;&nbsp;{{ row.to }}</view>
          <view class="time">Time: {{ row.create_date }}</view>
          <br />
          <view class="qingai" v-html="row.content"></view>
          <view class="jianli">
            <u--image :showLoading="true" :src="row.img" width="200px" height="283px"></u--image>
          </view>
          <br />
          <view class="interested">
            If any interest, please call me directly or contact me by email, I
            will reply to you as soon as possible.
          </view>
          <br />
        </view>
      </view> 
    </view>
    <!-- <app-tabbar :selectvalue="selectvalue"></app-tabbar> -->
  </view>
</template>

<script>
import { sendMailDetail } from '@/api/resume'
import imConfig from "@/common/config.js"; // 本地配置数据
export default {
  data() {
    return {
      params: {},
      row: {
        img: '',
        recipients: {}
      },
      base_url: '',
      selectvalue: 'RESUME',
      loading:true,
    }
  },
  onLoad(query) {
    this.params.id = query.id
    this.getDetail()
    this.base_url = imConfig.imgUrl
  },
  methods: {
    getDetail() {
      sendMailDetail(this.params).then(res => {
        this.row = res
        this.row.img = this.base_url + this.row.original_img_path
        this.loading = false
      })
    },
    goBack() {
      uni.navigateTo({
					url: '/pages/resume/record'
			})
    },
    		// 编辑简历
		goEdit() {
				uni.navigateTo({
					url: '/pages/resume/resumeSend?rid=' +  this.row.rid
				})
		},
  }
}
</script>

<style lang="scss">
.record_detail {
  background-color: #fff;
  .skeleton_detail{
    padding: 20px;
  }
  .interested {
    font-size: 16px;
    font-family: roboto-bold;
  }

  .Resume {
    font-size: 18px;
    margin-bottom: 5px;
  }

  .from {
    margin-bottom: 5px;
    font-family: roboto-bold;
  }

  .to {
    width: 250px;
    margin-bottom: 5px;
    font-family: roboto-bold;
  }

  .time {
    font-family: roboto-bold;
  }

  .status {
    font-family: roboto-bold;
  }

  .btn-upload {
    display: block;
    width: 100%;
    height: 2rem;
    padding-left: 10px;
    text-align: left;
    border: 2px solid seashelly;
  }

  .jianli {
    width: 200px;
    height: auto;
    text-align: center;
    margin: 20px auto;
  }

  .dear3 {
    width: 200px;
    height: 200px;
  }

  .qingai {
    font-size: 16px;

    ::v-deep p {
      margin-bottom: 10px !important;
      color: #333333;
      font-weight: 700;
    }

    ::v-deep div {
      color: #333333;
      font-weight: 700;
    }

    ::v-deep span {
      font-size: 12px !important;
    }
  }

  .home {
    padding: 40px 27px;
  }
}</style>