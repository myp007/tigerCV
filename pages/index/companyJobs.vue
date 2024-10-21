<template>
  <view class="job_detail">
    <u-navbar
      class="app_navbar"
      height="56px"
      :title="dataInfo.companyname"
      :title-bold="true"
      :placeholder="true"
      leftIconColor="#00328f"
    >
      <view slot="left" class="nav_title">
        <u-icon
          name="arrow-left"
          @click="goBack"
          color="#00328f"
          size="22"
        ></u-icon>
      </view>
    </u-navbar>
    <view v-if="loading" class="skeleton_detail">
      <u-skeleton
        style="margin-bottom: 40rpx"
        rows="4"
        title
        loading
        v-for="item in 10"
        :key="item"
      ></u-skeleton>
    </view>
    <view v-if="!loading">
      <view class="job_detail_content">
        <view class="content_info">
          <u-swiper
            v-if="dataInfo.images && dataInfo.images.length > 0"
            :list="dataInfo.images"
            keyName="url"
          ></u-swiper>
          <view class="p">
            <u-icon
              name="home"
              color="#00328f"
              size="20"
              style="margin-right: 10rpx"
            ></u-icon>
            <text>{{ dataInfo.address }}</text>
          </view>
          <view class="p"
            ><u-icon
              name="share"
              color="#00328f"
              size="20"
              style="margin-right: 10rpx"
            ></u-icon>
            <a :href="dataInfo.googlema">{{ dataInfo.googlemap }}</a></view
          >
          <view class="content_text" v-if="dataInfo.content">
            {{ dataInfo.content }}
          </view>
        </view>
        <view class="job_list">
          <view v-for="(item, i) in list" :key="i" style="margin-bottom: 10px">
            <view class="job_item">
              <view class="title">
                {{ item.jobname || '-' }}
              </view>
              <view class="time">
                <view class="grey_text" style="color: #00328f">
                  {{ item.companyname }}
                </view>
              </view>
              <view class="content mb_20 mt_20 fz_12">
                <view
                  :class="{ line_three_break: !item.showMore }"
                  class="content_box over_auto jbo_content jbo_content_item"
                  style="margin-bottom: 10px"
                >
                  <u-read-more
                    ref="uReadMore"
                    showHeight="120"
                    color="#00328f"
                    fontSize="12px"
                    :class="{ line_three_break: !item.showMore }"
                    class="content_box over_auto jbo_content jbo_content_item"
                    closeText="See more"
                    textIndent="0rem"
                  >
                    <view class="content_item"
                      ><span class="icon">📪</span> {{ item.job_no }}</view
                    >
                    <view class="content_item"
                      ><span class="icon">💳</span> {{ item.salary }}</view
                    >
                    <view class="content_item"
                      ><span class="icon">🏢</span>
                      {{ item.address || '-' }}</view
                    >
                    <view class="content_item" style="margin-bottom: 20px"
                      ><span class="icon">⏲</span>
                      {{ item.work_time_remark }}</view
                    >
                    <view
                      class="content_item"
                      style="margin-bottom: 20px"
                      v-if="item.content"
                    >
                      <view class="title"
                        ><span class="icon">📄</span>Job Description:</view
                      >
                      <view v-html="item.content"></view>
                    </view>
                    <view class="content_item" v-if="item.requirement">
                      <view class="title"
                        ><span class="icon">📄</span>Job Requirement:</view
                      >
                      <view v-html="item.requirement"></view>
                    </view>
                  </u-read-more>
                </view>
              </view>
            </view>
            <view class="but_bottm">
              <!-- 邮箱 -->
              <view class="publisher_date" style="width: 50%; color: #999">
                <span>{{ item.format_time }}</span>
                <image
                  src="@/static/icon/chat_icon.png"
                  class="chat_icon"
                  mode="aspectFit"
                  @click="goChat(item)"
                  lazy-load="false"
                ></image>
              </view>

              <view
                style="
                  width: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: flex-end;
                "
              >
                <view class="line_feed">
                  <image
                    :src="item.avatar || defaultAvatar"
                    class="avatar"
                    mode="aspectFit"
                    lazy-load="false"
                  ></image>
                  <view
                    class="fz_12 tr fw_bold check_but"
                    @click="checkApply(item)"
                  >
                    <span class="check-icon">
                      <span
                        v-if="checkList.some((i) => i.id == item.id)"
                        style="margin-right: 5rpx; display: inherit"
                        >[<u-icon
                          name="checkmark"
                          color="#e69138"
                          size="12"
                        ></u-icon
                        >]
                      </span>
                      <span v-else style="margin-right: 5rpx; display: inherit"
                        >[<span style="width: 24rpx"></span>]
                      </span>
                      Apply
                    </span>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="foote" v-if="checkList.length > 0">
      <view class="but" @click="sendApply"
        >Apply Now [{{ checkList.length || 0 }}] & Chat Now</view
      >
    </view>
    <view class="applybox" v-if="applyShow">
      <u-icon
        class="leftIcon"
        name="arrow-left"
        size="20"
        @click="closeApply"
      ></u-icon>

      <view class="apply_info" v-if="showSucces">
        <view class="success_h">Success</view>
        <view class="success_text">
          <view class="text1">Tell us your experience:</view>
          <view class="text2"
            >Taking the initiative to communicate directly with HR, will greatly
            increase the other party's attention to you.</view
          >
        </view>
        <scroll-view scroll-y="true" class="scroll-y">
          <view class="avatar_list">
            <view style="width: 15px"></view>
            <view
              class="avatar_box"
              :style="{ 'z-index': i + 1 }"
              v-for="(item, i) in checkList"
              :key="i"
              @click="topAvatar(item)"
              v-if="i < 8"
            >
              <image
                :src="item.avatar || defaultAvatar"
                mode="aspectFill"
                class="avatar"
              ></image>
            </view>
          </view>
        </scroll-view>

        <view class="" style="margin-top: 20px; text-align: center"
          >Chat with HR right away.</view
        >
        <view class="but-box" style="margin-top: 20px">
          <u-button class="but" @click="closeSuccess" :loading="deliverLoading"
            >Start Conversation</u-button
          >
        </view>
      </view>
      <view class="apply_info" v-else>
        <view class="h">You Applied for</view>
        <scroll-view scroll-y="true" class="scroll-y">
          <view class="apply_item" v-for="(item, i) in checkList" :key="i">
            <view class="left">
              <view class="title"> {{ i + 1 }}.{{ item.jobname || '-' }} </view>
              <view class="companyname">
                {{ item.companyname }}
              </view>
            </view>
            <view class="right_but" @click="applyRemove(i)"
              ><u-icon class="l" name="trash" color="#00328f" size="24"></u-icon
            ></view>
          </view>
          <view v-if="isLogin">
            <view class="job_tit h" style="margin-top: 20px"
              >Select resume
            </view>
            <uni-data-select
              class="form_select"
              v-model="deliverForm.rid"
              :value="deliverForm.rid"
              placeholder=" "
              :localdata="pickResume"
            >
            </uni-data-select>
            <!-- <view class="job_tit h" style="margin-top:20px;">Upload resume </view> -->

            <navigator url="/pages/resume/upload" class="link_upload">
              Upload new resume
            </navigator>
            <view class="but-box">
              <u-button
                class="submit_but"
                @click="jobDelivery"
                :loading="deliverLoading"
                >Submit & Chat Now</u-button
              >
            </view>
          </view>
          <view v-else>
            <view class="h" style="margin: 20px 0px"
              >Your application : <span class="but-text">(Required)</span></view
            >
            <u-form :model="formJob" ref="uForm">
              <!-- <u-form-item label="Email Address :" :border-bottom="true" label-width="120"><u-input v-model="formJob.email"  :border="'false'"/></u-form-item>
                            <u-form-item label="Mobile Number :" :border-bottom="true" label-width="120"><u-input v-model="formJob.phone"  :border="'false'" type="number"/></u-form-item> -->
              <u-form-item
                label=""
                :required="true"
                :border-bottom="true"
                label-width="0"
              >
                <span class="label_name"> Upload you CV :</span>
                <uni-file-picker
                  mode="list"
                  :sizeType="['compressed']"
                  @select="select"
                  @delete="deleteFile"
                  :auto-upload="false"
                  return-type="object"
                  :sourceType="['album']"
                  v-model="filePDF"
                  file-mediatype="all"
                >
                  <view slot="default">
                    <view class="upload_button" v-if="!filePDF[0]">Upload</view>
                  </view>
                </uni-file-picker>
              </u-form-item>
            </u-form>

            <view class="but-box">
              <view class="but-text">
                By clicking the "Submit & Chat now" button, you agree to our
                <span class="link_url" @click="openUrl('1')">User Terms</span>
                and have read and acknowledge the
                <span class="link_url" @click="openUrl('2')"
                  >Privacy Policy Statement</span
                >
              </view>
              <u-button
                class="submit_but"
                @click="jobSubmit"
                :loading="deliverLoading"
                >Submit & Chat Now</u-button
              >
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
import { getCompanyJobs } from '@/api/resume';
import { chatStart } from '@/api/facebookTool';
import {
  getResumeList,
  sendEmail,
  fetchEetail,
  getCityList,
} from '@/api/deliver';
import { globalData } from '@/api/common.js';
import imConfig from '@/common/config.js'; // 本地配置数据
export default {
  data() {
    return {
      params: {},
      dataInfo: {},
      defaultAvatar:
        'data:image/jpg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QMraHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjREMEQwRkY0RjgwNDExRUE5OTY2RDgxODY3NkJFODMxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjREMEQwRkY1RjgwNDExRUE5OTY2RDgxODY3NkJFODMxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NEQwRDBGRjJGODA0MTFFQTk5NjZEODE4Njc2QkU4MzEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NEQwRDBGRjNGODA0MTFFQTk5NjZEODE4Njc2QkU4MzEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAAGBAQEBQQGBQUGCQYFBgkLCAYGCAsMCgoLCgoMEAwMDAwMDBAMDg8QDw4MExMUFBMTHBsbGxwfHx8fHx8fHx8fAQcHBw0MDRgQEBgaFREVGh8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx//wAARCADIAMgDAREAAhEBAxEB/8QAcQABAQEAAwEBAAAAAAAAAAAAAAUEAQMGAgcBAQAAAAAAAAAAAAAAAAAAAAAQAAIBAwICBgkDBQAAAAAAAAABAhEDBCEFMVFBYXGREiKBscHRMkJSEyOh4XLxYjNDFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A/fAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHbHFyZ/Dam+yLA+Z2L0Pjtyj2poD4AAAAAAAAAAAAAAAAAAAAAAAAKWFs9y6lcvvwQeqj8z9wFaziY1n/HbUX9XF97A7QAGXI23EvJ1goyfzR0YEfN269jeZ+a03pNe0DIAAAAAAAAAAAAAAAAAAAACvtO3RcVkXlWutuL9YFYAAAAAOJRjKLjJVi9GmB5/csH/mu1h/in8PU+QGMAAAAAAAAAAAAAAAAAAaMDG/6MmMH8C80+xAelSSVFolwQAAAAAAAHVlWI37ErUulaPk+hgeYnCUJuElSUXRrrQHAAAAAAAAAAAAAAAAABa2Oz4bM7r4zdF2ICmAAAAAAAAAg7zZ8GX41wuJP0rRgYAAAAAAAAAAAAAAAAAD0m2R8ODaXU33tsDSAAAAAAAAAlb9HyWZcnJd9PcBHAAAAAAAAAAAAAAAAAPS7e64Vn+KA0AAAAAAAAAJm+v8Ftf3ewCKAAAAAAAAAAAAAAAAAX9muqeGo9NttP06+0DcAAAAAAAAAjb7dTu2ra+VOT9P8AQCWAAAAAAAAAAAAAAAAAUNmyPt5Ltv4bui/kuAF0AAAAAAADiUlGLlJ0SVW+oDzOXfd/Ind6JPRdS0QHSAAAAAAAAAAAAAAAAAE2nVaNcGB6Lbs6OTao9LsF51z60BrAAAAAABJ3jOVHjW3r/sa9QEgAAAAAAAAAAAAAAAAAAAPu1duWriuW34ZR4MC9hbnZyEoy8l36XwfYBsAAADaSq9EuLAlZ+7xSdrGdW9Hc5dgEdtt1erfFgAAAAAAAAAAAAAAAAADVjbblX6NR8MH80tEBRs7HYivyzlN8lovaBPzduvY0m6eK10TXtAyAarO55lpJK54orolr+4GqO/Xaea1FvqbXvA+Z77kNeW3GPbV+4DJfzcm/pcm3H6Vou5AdAFLC2ed2Pjv1txa8sV8T6wOL+yZEKu1JXFy4MDBOE4ScZxcZLinoB8gAAAAAAAAAAAB242LeyJ+C3GvN9C7QLmJtePYpKS+5c+p8F2IDYAANJqj1T4oCfk7Nj3G5Wn9qXJax7gJ93Z82D8sVNc4v30A6Xg5i42Z+iLfqARwcyT0sz9MWvWBps7LlTf5Grce9/oBTxdtxseklHxT+uWr9AGoAB138ezfj4bsFJdD6V2MCPm7RdtJzs1uW1xXzL3gTgAAAAAAAAADRhYc8q74I6RWs5ckB6GxYtWLat21SK731sDsAAAAAAAAAAAAAAAASt021NO/YjrxuQXT1oCOAAAAAAABzGLlJRSq26JAelwsWONYjbXxcZvmwO8AAAAAAAAAAAAAAAAAAef3TEWPkVivx3NY9T6UBiAAAAAABo2+VmGXblddIJ8eivRUD0oAAAAAAAAAAAAAAAAAAAYt4tKeFKVNYNSXfRgefAAAAAAAAr7VuSSWPedKaW5v1MCsAAAAAAAAAAAAAAAAAAIe6bj96Ts2n+JPzSXzP3ATgAAAAAAAAFbbt1UUrOQ9FpC4/UwK6aaqtU+DAAAAAAAAAAAAAAA4lKMIuUmoxWrb4ARNx3R3q2rLpa4Sl0y/YCcAAAAAAAAAAANmFud7G8r89r6X0dgFvGzLGRGtuWvTF6NAdwAAAAAAAAAAAy5W442PVN+K59EePp5ARMvOv5MvO6QXCC4AZwAAAAAAAAAAAAAcxlKLUotprg1owN+PvORborq+7Hnwl3gUbO74VzRydt8pKn68ANcJwmqwkpLmnUDkAAAAfNy9atqtyagut0AxXt5xIV8Fbj6lRd7Am5G65V6qUvtwfyx94GMAAAAAAAAAAAAAAAAAAAOU2nVOj5gdsc3LiqRvTpyqwOxbnnrhdfpSfrQB7pnv/AGvuS9gHXPMy5/Fem1yq0v0A6W29XqwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf//Z',
      list: [],
      loading: true,
      checkList: [],
      applyShow: false,
      deliverLoading: false,
      showSucces: false,
      isLogin: false,
      formJob: {},
      filePDF: [],
      deliverForm: {
        hr_email: [],
        resumeId: '',
        resumeName: '',
        id: '',
        permalinkid: '',
        first_name: '',
        subject: '',
        recipients: [{ hr_email: '', id: '', permalinkid: '' }],
        from: '',
        rid: '',
        img: '',
        original_img_path: '',
        image_path: '',
        content: '',
        tos: '',
        is_export: '',
        form: '',
        template_id: '',
        dear3: '',
      },
    };
  },
  onLoad(query) {
    this.params.comid = query.id;
    this.getDetail();
    this.getResume();
  },
  methods: {
    getResume() {
      let appinfo = uni.getStorageSync('appinfo');

      this.isLogin = appinfo.token ? true : false;
      let systemInfo = uni.getSystemInfoSync();

      if (systemInfo.uniPlatform == 'app' && !this.isLogin) {
        uni.reLaunch({
          url: '/pages/center/login_up',
        });
        return;
      }
      globalData().then((res) => {
        if (res) {
          this.eliverTemplateContent = res.eliverTemplate;
          this.eliverKey = res.eliverKey;
          if (this.isLogin) {
            this.getResumeList();
            // uni.reLaunch({
            // 	url: '/pages/index/index'
            // })
          }
        }
      });
    },
    select(e) {
      this.filePDF = e.tempFiles;
    },
    deleteFile() {
      this.filePDF = [];
    },
    // 跳转聊天框
    goChat(item) {
      uni.showLoading({
        title: '',
      });
      if (this.isLogin) {
        chatStart({ jobid: item.id })
          .then((res) => {
            uni.navigateTo({
              url:
                '/pages/session-info/session-info?id=' +
                res.session_id +
                '&resume_id=' +
                res.resume_id +
                '&talent_id=' +
                res.talent_id +
                '&apply_id=' +
                res.apply_id +
                '&companyname=' +
                item.companyname +
                '&jobname=' +
                item.jobname +
                '&jobid=' +
                item.id,
            });

            uni.hideLoading();
          })
          .catch((err) => {
            uni.hideLoading();
          });
      } else {
        uni.setStorageSync('chatInfo', item);
        uni.redirectTo({
          url: '/pages/center/login_up',
        });
      }
    },
    openUrl(type) {
      let url = '';
      if (type == '1') {
        url = 'https://www.hirechat.ph/terms-of-use';
      } else if (type == '2') {
        url = 'https://www.hirechat.ph/privacy-policy';
      }
      // #ifdef H5
      window.open(url);
      // #endif

      // #ifdef APP-PLUS
      plus.runtime.openURL(url, function (res) {
        console.log(res);
      });
      // #endif
    },
    closeApply() {
      this.applyShow = false;
      this.eailmIndex = '';
      this.showSucces = false;
      this.deliverLoading = false;
      this.checkList = [];
    },
    checkApply(item) {
      if (this.checkList.findIndex((e) => e.id === item.id) !== -1) {
        this.checkList.map((c, i) => {
          if (item.id == c.id) {
            this.checkList.splice(i, 1);
          }
        });
      } else {
        this.checkList.push(item);
      }
    },
    applyRemove(index) {
      this.checkList.splice(index, 1);
    },
    sendApply() {
      if (this.checkList.length == 0) {
        uni.$u.toast('Please select the position to be delivered');
        return;
      }
      this.dropdownShow = false;
      this.applyShow = true;
    },
    getDetail() {
      getCompanyJobs(this.params).then((res) => {
        this.dataInfo = res.company_info;
        let str = "\n"
        res.list = res.list.map((item, i) => {
						
						if(item.data_type == 'ad'){
							let images =item.images.length >0 && item.images.map(i =>{
								return i.url
							})

							item.urls = images
						}
						if (!item.content && !item.requirement){
							
							item.showMore = true
						}
						item.requirement = item.requirement.replace(new RegExp(str,'g'),'<br/>')
						item.content = item.content.replace(new RegExp(str,'g'),'<br/>')
						return item;
					})
        this.list = res.list;
        this.loading = false;
      });
    },
    // 简历列表
    getResumeList() {
      getResumeList().then((resData) => {
        if (!resData) {
          return;
        }
        // let resData = this.pickResume
        resData.forEach((v, index) => {
          if (v.is_export == 0) {
            v.disabled = true;
          }
          v.value = v.value + '';
          if (v.occupation) {
            v.name = v.text + ` - ${v.occupation}`;
          } else {
            v.name = v.text;
          }
        });
        this.pickResume = resData;

        // 设置默认简历
        this.getLasetResume();
      });
    },
    // 设置默认简历
    getLasetResume() {
      for (let i = this.pickResume.length - 1; i >= 0; i--) {
        let item = this.pickResume[i];
        if (item['is_export'] != 0) {
          // 最后一份有模板的简历
          this.deliverForm.rid = item.value;
        }
      }
      this.onSelectChange(this.deliverForm.rid);
    },
    // 选择简历
    onSelectChange(e) {
      let id = '';
      if (e.split) {
        id = e.split('_')[0];
      } else {
        id = e;
      }
      let row = this.pickResume.filter((item) => item.value === e)[0];
      if (!row) {
        return;
      }
      this.deliverForm.first_name = row.first_name + ' ' + row.last_name;
      this.deliverForm.resumeName = row.resume_name;
      // 点击后获取简历内容
      fetchEetail(id).then((resData) => {
        if (!resData) {
          return;
        }
        let eliverData = {
          occupation: row.occupation,
          phone: resData.basics.phone,
          email: resData.basics.email,
          username: resData.basics.first_name + ' ' + resData.basics.last_name,
          facebook: resData.basics.facebook,
          salary: resData.basics.salary,
          age: resData.basics.age,
          position_city: resData.basics.position_city,
        };

        // let content = window.GlobalData ? window.GlobalData.eliverTemplate : '';
        // let replaceKeys = window.GlobalData ? window.GlobalData.eliverKey : []
        let replaceKeys = this.eliverKey || [];
        let content = this.eliverTemplateContent || '';
        replaceKeys.forEach((key) => {
          content = content.replace(
            new RegExp(`【${key}】`, 'gm'),
            eliverData[key]
          );
        });
        this.deliverForm.content = content;
        if (row.image_path != '') {
          this.deliverForm.img = row.image_path;
        }
        this.deliverForm.original_img_path = row.original_img_path;
        this.deliverForm.is_export = row.is_export;
        if (row.is_export == 0) {
          this.$toasted.error('Resume not exported after update', {
            icon: 'alert-circle-outline ',
          });
        }
        row.age = resData.basics.age;
        row.sex = resData.basics.sex;
        this.setSubject(row);
      });
    },
    setSubject(row) {
      //姓名 | 工作年限，应聘 岗位 | 地点薪资K
      let subject = '';

      if (
        row.occupation != '' &&
        row.occupation != null &&
        row.occupation.length > 0
      ) {
        subject += row.occupation;
      }

      if (row.salary != '') {
        subject += ' | ₱' + row.salary;
      }

      if (row.age != '') {
        subject += ' | age ' + row.age;
      }

      if (row.sex != '') {
        subject += ' | sex ' + row.sex;
      }
      subject += ' |  ' + row.first_name + ' ' + row.last_name;

      // if (row.salary != '') {
      //   subject += ' Salary $' + row.salary
      // }
      this.deliverForm.subject = subject;
      // this.jobDelivery()
    },
    closeSuccess() {
      this.checkList = [];

      this.applyShow = false;

      this.showSucces = false;
      this.ws.pageRefresh.message = true;
      this.ws.pageRefresh.sessionInfo = true;
      if (!this.isLogin) {
      }
      uni.switchTab({
        url: '/pages/message/message',
      });
    },
    jobSubmit() {
      let { formJob, filePDF, checkList } = this;
      let that = this;
      if (checkList.length <= 0) {
        uni.$u.toast('Your application is empty');
        return;
      }
      if (!filePDF[0] || !filePDF[0].file) {
        uni.$u.toast('Please upload the resume attachment');
        return;
      }
      let apply_ids = checkList.map((item, i) => {
        return item.id;
      });
      let fromData = new FormData();
      if (filePDF[0] && filePDF[0].file) {
        let file = filePDF[0].file;
        fromData.append('file', file);
      }
      // fromData.append('email',formJob.email || '')
      // fromData.append('phone',formJob.phone || '')
      fromData.append('apply_ids', apply_ids);

      let token = '';
      uni.showLoading({ title: 'Upload...', mask: true });
      const xhr = new XMLHttpRequest();
      xhr.open('POST', config.appUrl + '/tool/chat/apply');
      xhr.setRequestHeader('user-token', token);
      xhr.send(fromData);
      xhr.onreadystatechange = function () {
        console.log(xhr);
        if (xhr.readyState === 4 && xhr.status === 200) {
          that.checkList = [];
          uni.hideLoading();
          uni.$u.toast('Upload Successful');
          setTimeout(() => {
            that.showSucces = true;
            that.deliverLoading = false;
            let res = JSON.parse(xhr.response);

            uni.setStorageSync('reginfo', res.data);
            uni.redirectTo({
              url: '/pages/center/login_up',
            });
          }, 500);
        }
      };
    },

    jobDelivery() {
      if (this.checkList.length <= 0) {
        uni.$u.toast('Your application is empty');
        return;
      }
      if (!this.deliverForm.rid) {
        uni.$u.toast('Please select resume');
        return;
      }

      let recipients = [];
      let hr_email = [];
      this.checkList.map((v) => {
        hr_email.push(v.hr_email);
        let arr = {
          id: v.id,
          hr_email: v.hr_email,
        };
        recipients.push(arr);
      });
      this.deliverForm.hr_email = hr_email;
      this.deliverForm.recipients = recipients;
      console.log(this.deliverForm);
      let jsonData = JSON.parse(JSON.stringify(this.deliverForm));
      jsonData.rid = jsonData.rid.split('_')[0];
      jsonData.from = uni.getStorageSync('appinfo').email;
      this.deliverLoading = true;
      sendEmail(jsonData).then((res) => {
        if (res.code == 510) {
          this.deliverLoading = false;
          return;
        }
        // uni.$u.toast('Maill send Successful')
        this.showSucces = true;
        this.deliverLoading = false;
      });
    },
    goBack(params) {
      const pages = getCurrentPages();
      if (pages.length === 1) {
        if (typeof params === 'number') {
          history.go(-params);
        } else {
          history.back();
        }
      } else {
        uni.navigateBack();
      }
    },
  },
};
</script>

<style lang="scss">
.job_detail {
  .skeleton_detail {
    padding: 20px;
  }

  .interested {
    font-size: 16px;
    font-family: roboto-bold;
  }

  .job_detail_content {
    margin-top: 5rpx;
    background-color: #fff;
    padding: 20rpx 0;

    .job_top {
      display: flex;
      padding-bottom: 20rpx;
      align-items: center;
      border-bottom: 1px solid #eee;

      .logo {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        border: 1px solid #eee;
        margin-right: 20rpx;
      }
    }

    .p {
      font-size: 24rpx;
      margin: 10rpx 0;

      display: flex;
      align-items: flex-start;
    }

    .content_info {
      padding: 0 20rpx;
      color: #666;

      .content_text {
        margin-bottom: 30rpx;
      }

      .img {
        min-width: 670rpx;
        height: 350rpx;
        width: auto;
        margin: 0 auto;
      }
    }
  }

  ::v-deep .jbo_content {
    font-size: 14px !important;
  }

  ::v-deep .jbo_content .u-read-more__toggle__icon {
    display: none;
  }

  ::v-deep .jbo_content div > span,
  ::v-deep .job_list_item .content .jbo_content,
  ::v-deep .jbo_content div > p {
    font-size: 14px !important;
    padding: 0 !important;
  }

  ::v-deep .u-read-more__toggle {
    position: relative;
    height: 12px !important;
  }

  ::v-deep .jbo_content .u-read-more__toggle__text {
    position: absolute;
    botttom: 0;
    left: 0;
    height: 12px !important;
    color: #606266 !important;
  }

  ::v-deep .jbo_content .u-read-more__toggle__text span {
    color: #606266 !important;
  }

  ::v-deep .u-action-sheet {
    padding-bottom: 30px;
  }

  .job_list {
    padding-top: 1px;
    // background-color: #f2f2f2;
    // padding-bottom: 80px;
  }

  .job_item {
    background-color: #fff;
    padding: 20px;
    border-bottom: 1px solid #f2f2f2;
  }

  .title {
    margin-bottom: 10rpx;
    font-size: 16px;
    font-weight: 900;
    padding-right: 5px;
  }

  .job_city {
    color: #3246d2;

    span {
      margin-right: 5px;
      float: left;
    }
  }

  .job_info {
    border-top: 1px solid #f2f2f2;
    margin-top: 20px;
  }

  .job_row {
    display: flex;
    justify-content: space-between;
    color: #333;
    font-weight: bold;
    padding: 10px 0;
  }

  .job_more {
    font-weight: 600;
  }

  .jbo_content_img {
    position: relative;
    top: 10px;
    z-index: 100;
  }

  .v-badge__badge span {
    background-color: transparent !important;
    border-color: #f44336 !important;
    color: #f44336;
  }

  .v-btn {
    min-width: 30px;
    padding: 0;
  }

  .top {
    position: relative;
    padding-left: 60px;

    .title {
      min-height: 30px;
      // padding-right: 30px;
      position: relative;
    }

    .head_img {
      position: absolute;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      left: 0;
      top: 0;
    }

    .more_btn {
      position: absolute;
      right: 0;
      top: 0;
    }

    .time {
      font-size: 12px;
      color: #90949c;
    }
  }

  .line_feed {
    display: flex;
    align-items: center;
  }

  .nopl {
    padding-left: 0;
  }

  .content {
    // padding-left: 60px;
    font-family: initial;
    position: relative;

    .content_item {
      margin-bottom: 10rpx;
      font-size: 14px;
      color: #606266;

      .icon {
        color: #00328f;
        margin-right: 5px;
      }
    }
  }

  .link_upload {
    padding: 10px;
    color: #3246d2;
    font-size: 12px;
    text-decoration: underline;
  }

  .leftIcon {
    color: #00328f;
    margin: 10px 10px;
  }

  .grey_text {
    margin-bottom: 10rpx;
    font-size: 14px;
  }

  .publisher_date {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #999;
  }

  .chat_center {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .chat_icon {
    width: 17px;
    height: 17px;
    margin: 0 10px;
  }

  .avatar {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .foote {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 48px;
    display: flex;
    align-items: center;
  }

  .but {
    text-decoration: none;
    text-size-adjust: none;
    color: rgb(255, 255, 255);
    font-size: 26rpx;
    padding: 30rpx 40rpx !important;
    display: inline-block;
    background: rgb(230, 145, 56);
    border-radius: 40rpx;
    font-family: Poppins, sans-serif;
    font-weight: normal;
    font-style: normal;
    line-height: 26rpx;
    width: auto;
    text-align: center;
    margin: 0 auto;
    width: 80% !important;
  }

  .check-icon {
    margin-right: 10rpx;
    display: flex;
    height: 12px;
  }

  .check_but {
    border: 1px solid #444950;
    color: #444950;
	border-radius: 4px;
	font-size: 12px;
    line-height: 22px;
	height: 24px;
    margin: 0;
    overflow: hidden;
	flex-shrink: 0;
    padding: 1px 8px;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .chat_but {
    padding: 10rpx 20rpx;
    line-height: 19rpx;
    display: inline-block;
    border: 1px solid #00328f;
    color: #00328f;
    border-radius: 30rpx;
    font-weight: bold;
  }

  .applybox {
    background: #fff;
    width: 100%;
    height: calc(100%);
    position: fixed;
    left: 0;
    bottom: 0;
    border-top: 1px solid #eee;
    z-index: 9999;

    .apply_info {
      padding: 10px 15px;

      .h {
        margin-bottom: 10px;
        font-weight: bold;
        position: relative;
        padding-left: 10px;
      }

      .h::after {
        position: absolute;
        width: 4px;
        top: 2px;
        height: 15px;
        content: '';
        left: 0;
        border-radius: 10px;
        background-color: #606266;
      }

      .success_h {
        font-size: 30px;
        margin-top: 20px;
        margin-bottom: 40px;
      }

      .success_text {
        border-bottom: 1px solid #eee;
        margin-bottom: 40px;
        padding-bottom: 20px;

        .text1 {
          font-size: 20px;
          padding-bottom: 10px;
        }

        .text2 {
          font-size: 16px;
        }
      }

      .apply_item {
        border-bottom: 1px solid #eee;
        padding: 10px;
        display: flex;
        align-items: center;

        .left {
          flex: 1;

          .companyname {
            color: #90949c;
          }
        }

        .right_but {
        }
      }
    }
  }
}

.input-item {
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
  padding: 0 10px;

  .input-lable {
    margin: 10px 0;
  }
}

.label_name {
  width: 120px;
}

.upload_button {
  background: rgb(230, 145, 56);
  color: #fff;
  display: inline-block;
  line-height: 2.3;
  font-size: 12px;
  padding: 0 1.34em;
  border-radius: 5px;
}

.link_url {
  color: #e69138;
  font-weight: bold;
  padding: 0 5px;
  text-decoration: underline;
}

.upload_tit {
  padding-top: 10px;
  display: flex;
}

.but-box {
  margin-top: 60px;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.but-text {
  padding: 20px 0;
  font-size: 10px;
  color: #999;
}

.submit_but {
  text-decoration: none;
  text-size-adjust: none;
  color: rgb(255, 255, 255) !important;
  font-size: 26rpx;
  padding: 30rpx 40rpx !important;
  display: inline-block;
  background: rgb(230, 145, 56) !important;
  border-radius: 40rpx;
  font-family: Poppins, sans-serif;
  font-weight: normal;
  font-style: normal;
  width: auto;
  text-align: center;
  margin: 0 auto;
  width: 80% !important;
  line-height: 6px;
}

.but_bottm {
  padding: 10px 20rpx;
  display: flex;
  align-items: center;
  background-color: #fff;
}

.avatar_list {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  margin-top: 10px;

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid #cccccc60;
  }

  .avatar_box {
    border: 5px solid #fff;
    margin-left: -23px;
    border-radius: 50%;
    background: #fff;
  }
}
</style>
