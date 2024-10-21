<template>
  <view class="tiger_message">
    <!-- 消息提示 -->
    <u-toast ref="uToast" />
    <common :tips="commonTips"></common>
    <!-- 遮罩层 -->
    <u-overlay
      z-index="1000"
      :custom-style="{ background: 'rgba(0, 0, 0, 0.1)' }"
      :show="maskShow"
      @click="maskClick"
    ></u-overlay>
    <!-- 操作菜单 -->
    <u-action-sheet
      :list="sessionLongpressList"
      @click="sessionLongpressAction"
      v-model="sessionLongpressShow"
    ></u-action-sheet>
    <!-- 顶部搜索栏-start -->
    <view class="search">
      <view class="search-box">
        <u-search
          @search="search()"
          @custom="search()"
          v-model="keywords"
          class="search-box-u-search"
          shape="square"
          placeholder="Search"
          :clearabled="true"
          :show-action="false"
        ></u-search>
        <!-- <view @click="toggleMessageMenu" class="message-menu">
					<u-icon class="message-menu-icon" name="plus" :class="messageMenu.show ? 'im-bg-grey':''" color="#3f3f3f" size="24"></u-icon>
					<view v-if="messageMenu.show" :style="{top: messageMenu.top, left: messageMenu.left}" class="message-menu-box popup-menu">
						<navigator class="popup-menu-item" url="/pages/search/new-contact" open-type="navigate">Add friends/groups</navigator>
						<navigator url="/pages/pick-user/pick-user?action=create-group" open-type="navigate">
							<view class="popup-menu-item">Create group chat</view>
						</navigator>
					</view>
				</view> -->
      </view>
    </view>
    <!-- 顶部搜索栏-end -->
    <!-- 待办-start -->
    <!-- <u-cell-group class="to-do" :border="false">
			<navigator url="/pages/center/to-do" open-type="navigate">
				<u-cell class="to-do-cell-item" :border-bottom="false" :arrow="true" :title="'Pending • ' + TODOcount">
					<u-icon class="to-do-cell-item-icon" slot="icon" size="32" name="/static/icon/to-do.png"></u-icon>
				</u-cell>
			</navigator>
		</u-cell-group> -->
    <!-- 待办-end -->
    <u-line length="100%" class="session-list-top-line" color="#f2f2f2" />
    <!-- 会话列表-start -->
    <view class="session-list">
      <scroll-view
        :style="{
          height: 'calc(100vh - ' + (navbarHeight + statusBarHeight) + 'px )',
        }"
        scroll-y="true"
        :scroll-top="scrllTop"
        @scrolltolower="lower"
      >
        <view class="filtrate">
          <view class="changeTab">
            <view
              :class="{ checked: checkedIndex == index }"
              v-for="(item, index) in changeTabList"
              :key="index"
              @click="changeTabClick(index)"
            >
              {{ item.name }}
              <span
                v-if="msgTotal.sent && index == 0"
                style="margin-left: 5rpx"
              >
                ({{ msgTotal.sent }})
              </span>
              <span v-if="msgTotal.hr && index == 1" style="margin-left: 5rpx">
                ({{ msgTotal.hr }})
              </span>
              <span class="as-number" v-if="msgTotal.unread && index == 2">{{
                msgTotal.unread > 99 ? '99+' : msgTotal.unread
              }}</span>
            </view>
          </view>
        </view>
        <block v-for="(item, index) in sessionListTop" :key="item.id">
          <session
            @click.native="
              goToSessionInfo(item.id, item.type, item.chat_id, item)
            "
            @longpress.native="sessionLongpress(item.id, item.top)"
            :item="item"
          ></session>
        </block>
        <block v-for="(item, index) in sessionList" :key="index">
          <session
            @click.native="
              goToSessionInfo(item.id, item.type, item.chat_id, item)
            "
            @longpress.native="sessionLongpress(item.id, item.top)"
            :item="item"
          ></session>
        </block>
        <!-- 判断状态是否加载中... -->
        <view v-if="loadStatus == 'Loading'" style="padding: 20px">
          <u-row
            gutter="20"
            v-for="item in 15"
            :key="item"
            style="margin-bottom: 20px"
          >
            <u-col span="9">
              <u-skeleton
                :loading="true"
                class="title_skeleton"
                titleHeight="20"
                rowsHeight="20"
                avatar
                avatarSize="50"
                avatarShape="square"
                rows="1"
              ></u-skeleton>
            </u-col>
            <u-col span="3">
              <u-skeleton
                :loading="true"
                titleHeight="20"
                rowsHeight="20"
                rowsWidth="100%"
                :title="false"
                rows="1"
              ></u-skeleton>
            </u-col>
          </u-row>
        </view>
        <!-- 骨架屏 -->
        <view class="im-data-none" v-if="loadStatus == 'Loading...'">{{
          loadStatus
        }}</view>
        <view
          class="im-data-none"
          v-if="!sessionList.length && loadStatus != 'Loading...'"
          >No messages</view
        >
      </scroll-view>
    </view>

    <!-- 会话列表-end -->
  </view>
</template>

<script>
let systemInfo = uni.getSystemInfoSync();
export default {
  data() {
    return {
      timer: null,
      keywords: '',
      maskShow: false,
      messageMenu: {
        show: false,
      },
      sessionList: [],
      msgTotal: { unread: 0, sent: 0, hr: 0 },
      checkedIndex: 0,
      // changeTabList:["Delivered","Replied"],
      changeTabList: [
        { number: 0, name: 'Sent' },
        { number: 0, name: 'Reply' },
        { number: 0, name: 'UnRead' },
      ],
      sessionListTop: [],
      TODOcount: 0,
      pageDataLoadBool: false,
      sessionLongpressList: [],
      sessionLongpressShow: false,
      loadStatus: 'Loading...',
      commonTips: '',
      selectvalue: 'MESSAGE',
      flag: 0,
      page: 1,
      scrllTop: 0,
      navbarHeight: 44 + 68,
      statusBarHeight: systemInfo.statusBarHeight,
    };
  },
  onHide: function () {
    console.log('onHide===', this.ws.pageRefresh.message);
  },
  onShow: function () {
    // uni.setTabBarBadge({
    //   index: 2,
    //   text: '50',
    // });
    var that = this;
    console.log('onShow===', that.ws.pageRefresh.message);

    if (this.ws.pageRefresh.message) {
      this.sessionList = [];
      // 被其他页面通知刷新会话列表(更新列表中的好友备注等)
      that.ws.pageFun(this.pageDataLoad(true), that);
      that.ws.clearPageRefresh();
      that.ws.pageRefresh.message = false;
      that.ws.pageRefresh.sessionInfo = false;
      // that.ws.messageShow = [] // 已经重载,无需执行messageShow中的方法
      return;
    }
    if (that.ws.messageShow.length) {
      for (let m in this.ws.messageShow) {
        if (typeof this.ws.messageShow[m] == 'function') {
          this.ws.messageShow[m](that);
          this.ws.messageShow[m] = null;
        }
      }
    }

    if (!that.pageDataLoadBool) {
      return;
    }
    that.ws.checkNetwork(that);
    that.ws.pageFun(function () {
      that.ws.send({
        c: 'ImBase',
        a: 'loadTODO',
        data: {
          method: 'get-all-count',
        },
      });
    }, that);
    that.ws.pageFun(function () {
      that.ws.send({
        c: 'User',
        a: 'loadTotal',
        data: {
          platform: 'user',
        },
      });
    }, that);
  },
  onLoad: function (query) {
    console.log('onLoad', this);

    let appinfo = uni.getStorageSync('appinfo');

    if (!appinfo.token) {
      uni.reLaunch({
        url: '/pages/center/login_up',
      });
      return false;
    }
    this.ws.pageFun(this.pageDataLoad(true), this);

    // #ifdef APP-PLUS || H5
    this.navbarHeight = this.navbarHeight ? this.navbarHeight : 44;
    // #endif

    // #ifdef MP
    if (systemInfo.platform == 'ios') {
      var platformHeight = 44;
      defaultWriteHeight = 46;
    } else {
      var platformHeight = 48;
      defaultWriteHeight = 46;
    }
    this.navbarHeight = this.navbarHeight ? this.navbarHeight : platformHeight;
    this.writeHeight = defaultWriteHeight;
    // #endif
  },

  // 下拉
  onPullDownRefresh: function () {
    this.ws.pageFun(this.pageDataLoad(true), this);
    this.ws.onMessageCallBack.set('load_session_list', (msg) => {
      if (msg.data.data.refresh && msg.data.data.method == 'load') {
        this.$refs.uToast.show({
          title: 'Refresh succeeded~',
          type: 'success',
        });
        uni.stopPullDownRefresh();
      }
    });
  },

  methods: {
    lower: function () {
      if (this.sessionList.length <= 0) {
        return;
      }
      if (this.loadStatus == 'loading') {
        return;
      }
      if (this.loadStatus == 'No more sessions...') {
        this.loadStatus = 'loading';
        this.ws.pageFun(this.pageDataLoad, this);
        return;
      }
      this.loadStatus = 'loading';
      this.page++;
      console.log(this.page++);
      this.ws.pageFun(this.pageDataLoad, this);
    },
    changeTabClick: function (index) {
      if (index == this.checkedIndex) {
        return;
      }
      this.sessionList = [];
      this.checkedIndex = index;
      this.flag = index;
      this.pageDataLoad();
    },
    pageDataLoad: function (refresh = false) {
      this.pageDataLoadBool = true;
      this.ws.send({
        c: 'User',
        a: 'loadSessionList',
        data: {
          refresh: refresh,
          page: this.page,
          flag: this.flag,
          platform: 'user',
          pagesize: 500,
        },
      });
      this.ws.send({
        c: 'ImBase',
        a: 'loadTODO',
        data: {
          method: 'get-all-count',
        },
      });
      this.ws.send({
        c: 'User',
        a: 'loadTotal',
        data: {
          platform: 'user',
        },
      });
    },

    //跳转
    goToSessionInfo: function (id, type, chat_id, item) {
      console.log(item);
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        var url =
          '/pages/session-info/session-info?id=' +
          id +
          '&apply_id=' +
          item.apply_id +
          '&talent_id=' +
          item.talent_id +
          '&resume_id=' +
          item.resume_id +
          '&companyname=' +
          item.companyname +
          '&jobname=' +
          item.jobname +
          '&jobid=' + item.jobid + '&type=' + item.type 
        if (type == 'service') {
          if (chat_id != 3) {
            url = '/pages/session-info/notice-session-info?session_id=' + id;
          }
        }
        uni.navigateTo({
          url: url,
        });
      }, 500);
    },

    sessionLongpress: function (id, top) {
      this.sessionLongpressShow = true;
      this.sessionLongpressList = [
        {
          text: top ? 'Cancel Topping' : 'Topping',
          id: id,
        },
        {
          text: 'Remove Session',
          color: '#f74c31',
          id: id,
        },
      ];
    },
    sessionLongpressAction: function (idx) {
      var that = this;
      if (idx == 0) {
        that.ws.pageFun(function () {
          that.ws.send({
            c: 'User',
            a: 'sessionOperation',
            data: {
              id: that.sessionLongpressList[idx].id,
              action: 'session-top',
              source: 'uni-app',
            },
          });
        }, that);
      } else if (idx == 1) {
        that.ws.pageFun(function () {
          that.ws.send({
            c: 'User',
            a: 'sessionOperation',
            data: {
              action: 'session-remove',
              id: that.sessionLongpressList[idx].id,
              source: 'uni-app',
            },
          });
        }, that);
      }
    },
    maskClick: function () {
      this.messageMenu.show && this.toggleMessageMenu();
    },
    toggleMessageMenu: function (e) {
      var that = this;
      // show为true时
      if (that.messageMenu.show) {
        // 重新赋值false
        that.maskShow = false;
        that.messageMenu.show = false;
        return;
      }
      that.messageMenu = {
        show: true,
        top: e.detail.y + 14 + 'px',
        left: e.detail.x - 120 + 'px',
      };
      that.maskShow = true;
    },
    // 根据关键字搜索
    search: function () {
      // keywords为空时
      if (!this.keywords) {
        // 提示,请输入关键字
        this.$refs.uToast.show({
          title: 'Please enter keywords~',
          type: 'error',
        });
        return;
      }
      // 跳转，并携带关键字
      uni.navigateTo({
        url: '/pages/search/search?keywords=' + this.keywords,
        success: () => {
          this.keywords = '';
        },
      });
    },
  },
};
</script>

<style lang="scss">
.tiger_message {
  height: 100%;
}
page {
  background: #ffffff;
}
.search {
  display: flex;
  align-items: center;
  justify-content: center;
}
.search-box {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  width: 100%;
}
.search-box .search-box-u-search {
  width: 616rpx;
}
.search-box .message-menu {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20rpx;
}
.message-menu .message-menu-icon {
  padding: 6rpx;
  z-index: 1001;
  border-radius: 4px;
}
.message-menu-box {
  position: absolute;
  background: #ffffff;
  box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  z-index: 1001;
}
.popup-menu .popup-menu-item {
  padding: 20rpx;
  text-align: center;
  border-bottom: 1px solid #f3f4f6;
}
.popup-menu .popup-menu-item:last-child {
  border: none;
}
.to-do .to-do-cell-item .to-do-cell-item-icon {
  margin-right: 10rpx;
}
.session-list-top-line {
  display: flex;
  align-items: center;
  justify-content: center;
}
.session-list {
  height: calc(100vh - 108rpx);
  .filtrate {
    padding: 10px 16px;
    .changeTab {
      display: flex;
      border: 1px solid #f2f2f2;
      border-radius: 5px;
      font-size: 14px;
      color: #7f7f7f;
    }
    .changeTab > view {
      text-align: center;
      flex: 1;
      padding: 5.5px;
      color: #7f7f7f;
      background-color: #fff;
      position: relative;
    }
    .changeTab > view:first-child {
      border-radius: 5px 0 0 5px;
    }
    .changeTab > view:last-child {
      border-radius: 0 5px 5px 0;
    }
    .as-number {
      position: absolute;
      top: -10px;
      right: -8px;
      width: 16px;
      height: 16px;
      padding: 3px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: #fff;
      background: #f74c31;
    }
    .checked {
      background-color: #aaaaaa !important;
      color: #fff !important;
      transition: 0.3s;
    }
  }
}
.im-bg-grey {
  background-color: $--grey;
  color: $--white;
}
</style>
