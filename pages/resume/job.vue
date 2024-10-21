<template>
  <view class="job_index" id="main_body">
    <!-- nav -->
    <u-navbar
      class="app_navbar"
      height="56px"
      :placeholder="true"
      leftIconColor="#00328f"
    >
      <view slot="left" class="nav_title">
        <u-icon
          name="arrow-left"
          color="#00328f"
          size="22"
          @click="goBack"
        ></u-icon>
      </view>
      <view slot="right" class="nav_right">
        <u-icon
          name="checkmark"
          color="#00328f"
          size="22"
          @click="submit"
        ></u-icon>
      </view>
    </u-navbar>
    <view class="right_view">
      <view class="content_item" v-for="(item, index) in formData" :key="index">
        <view class="item_title">{{ index + 1 }}.Work Experience</view>
        <view class="item_content">
          <u--form labelPosition="top" labelWidth="auto">
            <u-form-item label="Corporate Name">
              <view class="common_input w_100">
                <input-autocomplete
                  class="unit-item__input"
                  :value="item.name"
                  v-model="item.name"
                  highlightColor="#FF0000"
                  :loadData="loadAutocompleteData"
                ></input-autocomplete>
              </view>
            </u-form-item>
            <template v-if="item.name !== ''">
              <u-form-item label="Position">
                <view class="common_input w_100">
                  <!-- <input-autocomplete class="unit-item__input" :value="item.position"
										v-model="item.position" highlightColor="#FF0000"
										:loadData="loadAutocompletePosition"></input-autocomplete> -->
                  <str-autocomplete
                    :importvalue="item.position"
                    :list="comPositionList"
                    :formDataIndex="index"
                    @change="changePosition"
                    highlightColor="#FF0000"
                  ></str-autocomplete>
                </view>
              </u-form-item>
              <view style="display: flex">
                <view style="padding-right: 10px; padding-bottom: 10px; flex: 1">
                  <u-form-item label="Hire date">
                    <!-- <view class="" @click="openTime(item,'starttime',index)" style="width: 100%;">
											
										</view> -->
                    <!-- <u--input  v-model="item.starttime" border="bottom"></u--input> -->
                    <date-input
                      name=""
                      type="2"
                      :keyName="index.toString()"
                      placeholder="Hire"
                      :value="item.starttime"
                      @setValue="setHireValue"
                      :isError="errorBol[index]['starttime']"
                    ></date-input>
                  </u-form-item>
                  <!-- <view style="font-size: 12px;color: #00000099;">eg: format 'Month/Year'</view> -->
                </view>
                <view style="padding-right: 10px; padding-bottom: 10px; flex: 1">
                  <u-form-item style="flex: 1" label="Leave date">
                    <!-- <view class="" @click="openTime(item,'endtime',index)" style="width: 100%;">
												
											</view>			 -->
                    <!-- <u--input   v-model="item.endtime" border="bottom"></u--input> -->
                    <date-input
                      name=""
                      type="2"
                      :keyName="index.toString()"
                      placeholder="Leave"
                      :value="item.endtime"
                      @setValue="setLeaveValue"
                      :isError="errorBol[index]['endtime']"
                    ></date-input>
                  </u-form-item>
                  <!-- <view style="font-size: 12px;color: #00000099;">eg: format 'Month/Year'</view> -->
                </view>
              </view>
              <u-form-item label="City">
                <u--input v-model="item.city" border="bottom"></u--input>
              </u-form-item>
              <view class="textarea-form">
                <u-form-item label="Job description">
                  <u--textarea
                    v-model="item.summary"
                    confirm-type="done"
                    maxlength="800"
                    count
                    border="bottom"
                    height="120"
                  >
                  </u--textarea>
                </u-form-item>
                <view class="textarea-form--tip"
                  >eg: Maximum 800 characters</view
                >
              </view>
            </template>
          </u--form>
        </view>
      </view>
    </view>
    <u-datetime-picker
      :show="timeShow"
      :visibleItemCount="7"
      cancelText="Cancel"
      confirmText="Confirm"
      :itemHeight="44"
      v-model="currentTime"
      :minDate="minDate"
      :maxDate="maxDate"
      @confirm="confirmSelect"
      @cancel="cancelSelect"
      mode="year-month"
    ></u-datetime-picker>
  </view>
</template>

<script>
import { getCompanyList, fetchWorkSave } from '@/api/resume';
import strAutocomplete from '@/components/str-autocomplete/str-autocomplete.vue';
import dateInput from '@/components/date-input/date-input';
import { getDateByMMYYYY } from '@/libs/util/date';

const ITEM = {
  id: '',
  guid: '',
  name: '',
  position: '',
  starttime: '',
  endtime: '',
  summary: '',
  city: '',
};
export default {
  components: { strAutocomplete, dateInput },
  data() {
    return {
      currentTime: '',
      currentIndex: 0,
      minTime: '',
      minDate: '',
      timeShow: false,
      maxDate: new Date().getTime(),
      formData: [],
      companyData: [],
      currentMinDate: '',
      // 公司位置列表
      comPositionList: [],
      //
      importString: '',
      errorBol: {},
    };
  },
  onLoad() {
    let dateTime = new Date();
    this.currentTime =
      dateTime.getFullYear() +
      '/' +
      (dateTime.getMonth() + 1 < 10
        ? '0' + (dateTime.getMonth() + 1)
        : dateTime.getMonth() + 1);
    let year = dateTime.getFullYear() - 100;
    let month = '01';
    this.minTime = Date.parse(year + '/' + month);
    this.minDate = this.minTime;
    if (this.work.length > 0) {
      this.formData = [...this.work];
    }
    if (this.work.length < 5) {
      for (let i = 0; i < 5 - this.work.length; i++) {
        let tmp = ITEM;
        tmp.guid = this.GUID();
        this.formData.push({ ...tmp });
      }
    }
    this.formData.forEach((f, i) => {
      this.errorBol[i] = {
        starttime: false,
        endtime: false,
      };
    });
    this.getCompanyList();
  },
  computed: {
    work() {
      return JSON.parse(uni.getStorageSync('resumedetails')).sections.work;
    },
  },
  methods: {
    cancelSelect() {
      this.pickertype = '';
      this.timeShow = false;
    },
    setHireValue(e) {
      let i = Number(e.key);
      this.formData[i].starttime = e.value;
      console.log('e ===>', e);
      console.log('this.errorBol===>', this.errorBol);
      this.errorBol[i].starttime = getDateByMMYYYY(e.value).isAfter(
        getDateByMMYYYY(this.formData[i].endtime)
      );
      let strArr = e.value.split('/')
      this.errorBol[i].starttime = strArr[0] > 12 ? true: false
    },
    setLeaveValue(e) {
      let i = Number(e.key);
      this.formData[i].endtime = e.value;
      this.errorBol[i].endtime = getDateByMMYYYY(e.value).isBefore(
        getDateByMMYYYY(this.formData[i].starttime)
      );
      let strArr = e.value.split('/')
      this.errorBol[i].endtime = strArr[0] > 12 ? true: false
    },
    confirmSelect(obj) {
      var date = new Date(obj.value);
      // 年份
      let year = date.getFullYear();
      // 月份
      let month =
        date.getMonth() + 1 < 10
          ? '' + (date.getMonth() + 1)
          : date.getMonth() + 1;
      if (this.currentType == 'starttime') {
        this.formData[this.currentIndex].starttime = month + '/' + year;

        if (!this.formData[this.currentIndex].endtime) {
          this.formData[this.currentIndex].endtime =
            this.formData[this.currentIndex].starttime;
        } else {
          let arr = this.formData[this.currentIndex].endtime.split('/');
          let endtime = Date.parse(arr[1] + '/' + arr[0]);
          if (endtime < obj.value) {
            this.formData[this.currentIndex].endtime =
              this.formData[this.currentIndex].starttime;
          }
        }
      }
      if (this.currentType == 'endtime') {
        this.formData[this.currentIndex].endtime = month + '/' + year;
      }
      this.timeShow = false;
    },
    openTime(item, type, index) {
      this.minDate = this.minTime;
      this.currentType = type;
      if (type == 'endtime') {
        if (item.starttime == '') {
          return;
        } else {
          let arr = item.starttime.split('/');
          this.minDate = Date.parse(arr[1] + '/' + arr[0]);
        }
      }
      this.currentIndex = index;
      this.timeShow = true;
    },
    loadAutocompleteData(string) {
      let resList = [];
      this.companyData.forEach((e) => {
        if (e.indexOf(string) > -1) {
          resList.push(string + e);
        }
      });
      return Promise.resolve(resList);
    },
    loadAutocompletePosition(string) {
      // getCompanyPositionList({
      // 	keyword: string
      // }).then(res => {
      // 	return Promise.resolve(res);
      // })
      let that = this.$root;
      that.getCompanyPositionList(string);
    },

    submit() {
      const param = {
        data: this.formData,
        rid: JSON.parse(uni.getStorageSync('resumedetails')).id,
      };
      fetchWorkSave(param).then((res) => {
        this.goBack();
      });
    },
    goBack() {
      uni.navigateTo({
        url:
          '/pages/resume/details?id=' +
          JSON.parse(uni.getStorageSync('resumedetails')).id,
      });
    },
    getCompanyList() {
      getCompanyList().then((res) => {
        this.companyData = res;
      });
    },
    selectPosition(str, index) {},
    changePosition(str, index) {
      let that = this;
      that.comPositionList = [];
      that.formData[index].position = str;
      console.log(that.formData);
    },
  },
};
</script>

<style lang="scss">
.job_index {
  background-color: #fff;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
  .right_view {
    margin-bottom: 150px;
  }
  .u-input {
    background-color: transparent !important;
  }
  .content_item {
    .item_title {
      padding: 10px 0;
      font-size: 22px;
      font-weight: 600;
    }

    .item_content {
      position: relative;
      margin-bottom: 10px;
      margin-left: 6px;
      padding-left: 20px;
      padding-right: 20px;
      padding-top: 1em;
      border-left: 1px solid rgba(0, 0, 0, 0.2);
    }

    .item-form {
      position: relative;
      margin-bottom: 10px;
      margin-left: 6px;
      padding-left: 20px;
      padding-right: 20px;
      padding-top: 1em;
      border-left: 1px solid rgba(000, 000, 000, 0.2);

      .form-hr {
        width: 100%;
        height: 1px;
        background-color: rgba(118, 118, 118, 1);
        margin-bottom: 10px;
      }

      .name {
        display: flex;
        justify-content: space-between;

        .name-middle {
          width: 16px;
        }
      }

      .item-show {
        padding: 0px 0 10px;
        display: flex;
        align-items: center;

        .show-left {
          flex: 1;

          .show-title {
            font-size: 16px;
            font-weight: 600;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;

            .show-education {
              width: 100%;
              color: rgba(0, 0, 0, 0.6);
              font-size: 12px;
              font-weight: 400;
            }
          }

          .show-msg {
            margin-top: 4px;
            font-size: 13px;
            color: gray;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .show-remarks {
            margin-top: 4px;
            font-size: 16px;
            color: gray;
            white-space: pre-line;
          }
        }

        .show-right {
          width: 50px;
        }
      }

      .add-rsm {
        height: 40px;
        line-height: 40px;
        text-align: right;
      }
    }

    .item-photo {
      padding-bottom: 10px;

      .photo-title {
        margin: 20px 0 10px 0;
        font-size: 16px;
        font-weight: 600;
      }

      .photo-msg {
        color: gray;
        font-size: 14px;
        margin-bottom: 10px;

        p {
          line-height: 22px;
          margin: 0%;
          font-style: italic;
        }
      }

      .pic {
        width: 100px;
        height: 100px;
        overflow: hidden;
        border-radius: 50%;
        position: relative;
        margin: 0 auto;
        margin-bottom: 20px;
        margin-top: 20px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .rsm-select {
        width: 100%;
        display: flex;
        padding-bottom: 127px;
      }
    }
  }
}
</style>
