<template>
  <view class="school_index" id="main_body">
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
    <scroll-view
      class=""
      scroll-x="false"
      scroll-y="false"
      upper-threshold="50"
      lower-threshold="50"
      scroll-top="0"
      scroll-left="0"
      scroll-into-view=""
      scroll-with-animation="false"
      enable-back-to-top="false"
      class="right_view"
    >
      <view class="content_item">
        <view class="item_title">1.Elementary School</view>
        <view class="item_content">
          <u--form
            labelPosition="top"
            labelWidth="auto"
            :model="formData"
            :rules="rules"
          >
            <u-form-item label="School name">
              <view class="common_input w_100">
                <input-autocomplete
                  class="unit-item__input"
                  confirm-type="done"
                  :value="formData.primary_school.institution"
                  v-model="formData.primary_school.institution"
                  highlightColor="#FF0000"
                  :loadData="loadAutocompleteData"
                ></input-autocomplete>
              </view>
            </u-form-item>
            <template v-if="formData.primary_school.institution !== ''">
              <view style="display: flex">
                <view style="padding-right: 10px; padding-bottom: 10px; flex: 1">
                  <u-form-item label="Admission time">
                    <!-- <view class="" @click="openTime('primarystarttime')" style="width: 100%;">
											
										</view> -->
                    <!-- <u--input  v-model="formData.primary_school.starttime" border="bottom">
											</u--input> -->
                    <date-input
                      name=""
                      type="2"
                      keyName="starttime"
                      placeholder="starttime"
                      :value="formData.primary_school.starttime"
                      @setValue="setprimaryValue"
                      :isError="errorBol.primary_school_starttime"
                    ></date-input>
                  </u-form-item>
                  <!-- <view style="font-size: 12px;color: #00000099;">eg: format 'Month/Year'</view> -->
                </view>
                <view style="padding-right: 10px; padding-bottom: 10px; flex: 1">
                  <u-form-item style="flex: 1" label="Graduation time">
                    <!-- <view class="" @click="openTime('primaryendtime')" style="width: 100%;">
											
										</view>	 -->
                    <!-- <u--input v-model="formData.primary_school.endtime" border="bottom"></u--input>	 -->
                    <date-input
                      name=""
                      type="2"
                      keyName="endtime"
                      placeholder="endtime"
                      :value="formData.primary_school.endtime"
                      @setValue="setprimaryValue"
                      :isError="errorBol.primary_school_endtime"
                    ></date-input>
                  </u-form-item>
                  <!-- <view style="font-size: 12px;color: #00000099;">eg: format 'Month/Year'</view> -->
                </view>
              </view>
              <u-form-item label="City">
                <u--input
                  v-model="formData.primary_school.area"
                  border="bottom"
                ></u--input>
              </u-form-item>
              <view class="textarea-form">
                <u-form-item label="Remarks">
                  <u--textarea
                    confirmType="done"
                    v-model="formData.primary_school.summary"
                    confirm-type="done"
                    maxlength="200"
                    count
                    border="bottom"
                    height="120"
                  ></u--textarea>
                </u-form-item>
                <view class="textarea-form--tip"
                  >eg: Maximum 200 characters</view
                >
              </view>
            </template>
          </u--form>
        </view>
      </view>
      <view class="content_item">
        <view class="item_title">2.Secondary School</view>
        <view class="item_content">
          <u--form
            labelPosition="top"
            labelWidth="auto"
            :model="formData"
            :rules="rules"
          >
            <u-form-item label="School name">
              <view class="common_input w_100">
                <input-autocomplete
                  class="unit-item__input"
                  confirm-type="done"
                  :value="formData.middle_school.institution"
                  v-model="formData.middle_school.institution"
                  highlightColor="#FF0000"
                  :loadData="loadAutocompleteData"
                ></input-autocomplete>
              </view>
            </u-form-item>
            <template v-if="formData.middle_school.institution !== ''">
              <view style="display: flex">
                <view style="padding-right: 10px; padding-bottom: 10px; flex: 1">
                  <u-form-item label="Admission time">
                    <!-- <view class="" @click="openTime('middleschoolstarttime')" style="width: 100%;">
											   
											</view>	 -->
                    <!-- <u--input v-model="formData.middle_school.starttime" border="bottom"></u--input> -->
                    <date-input
                      name=""
                      type="2"
                      keyName="starttime"
                      placeholder="starttime"
                      :value="formData.middle_school.starttime"
                      @setValue="setmiddleValue"
                      :isError="errorBol.middle_school_starttime"
                    ></date-input>
                  </u-form-item>
                  <!-- <view style="font-size: 12px;color: #00000099;">eg: format 'Month/Year'</view> -->
                </view>
                <view style="padding-right: 10px; padding-bottom: 10px; flex: 1">
                  <u-form-item style="flex: 1" label="Graduation time">
                    <!-- <view class="" @click="openTime('middleschoolendtime')" style="width: 100%;">
											
										</view> -->
                    <!-- <u--input v-model="formData.middle_school.endtime" border="bottom"></u--input> -->
                    <date-input
                      name=""
                      type="2"
                      keyName="endtime"
                      placeholder="endtime"
                      :value="formData.middle_school.endtime"
                      @setValue="setmiddleValue"
                      :isError="errorBol.middle_school_endtime"
                    ></date-input>
                  </u-form-item>
                  <!-- <view style="font-size: 12px;color: #00000099;">eg: format 'Month/Year'</view> -->
                </view>
              </view>
              <u-form-item label="City">
                <u--input
                  v-model="formData.middle_school.area"
                  border="bottom"
                ></u--input>
              </u-form-item>
              <view class="textarea-form">
                <u-form-item label="Remarks">
                  <u--textarea
                    v-model="formData.middle_school.summary"
                    maxlength="200"
                    count
                    confirm-type="done"
                    border="bottom"
                    height="120"
                  ></u--textarea>
                </u-form-item>
                <view class="textarea-form--tip"
                  >eg: Maximum 200 characters</view
                >
              </view>
            </template>
          </u--form>
        </view>
      </view>
      <view class="content_item">
        <view class="item_title">3.College</view>
        <view class="item_content">
          <u--form
            labelPosition="top"
            labelWidth="auto"
            :model="formData"
            :rules="rules"
          >
            <u-form-item label="School name">
              <view class="common_input w_100">
                <input-autocomplete
                  confirm-type="done"
                  class="unit-item__input"
                  :value="formData.university.institution"
                  v-model="formData.university.institution"
                  highlightColor="#FF0000"
                  :loadData="loadAutocompleteData"
                ></input-autocomplete>
              </view>
            </u-form-item>
            <template v-if="formData.university.institution !== ''">
              <view style="display: flex">
                <view style="padding-right: 10px; padding-bottom: 10px; flex: 1">
                  <u-form-item label="Admission time">
                    <!-- <view class="" @click="openTime('universitystarttime')" style="width: 100%;">
											<u--input  :disabled="true" v-model="formData.university.starttime" border="bottom"></u--input>
										</view>		 -->
                    <date-input
                      name=""
                      type="2"
                      keyName="starttime"
                      placeholder="starttime"
                      :value="formData.university.starttime"
                      @setValue="setuniversityValue"
                      :isError="errorBol.university_starttime"
                    ></date-input>
                  </u-form-item>
                  <!-- <view style="font-size: 12px;color: #00000099;">eg: format/ 'Month/Year'</view> -->
                </view>
                <view style="padding-right: 10px; padding-bottom: 10px; flex: 1">
                  <u-form-item style="flex: 1" label="Graduation time">
                    <!-- <view class=""  :disabled="true" @click="openTime('universityendtime')" style="width: 100%;">
											<u--input v-model="formData.university.endtime" border="bottom"></u--input>
										</view>		 -->
                    <date-input
                      name=""
                      type="2"
                      keyName="endtime"
                      placeholder="endtime"
                      :value="formData.university.endtime"
                      @setValue="setuniversityValue"
                      :isError="errorBol.university_endtime"
                    ></date-input>
                  </u-form-item>
                  <!-- <view style="font-size: 12px;color: #00000099;">eg: format 'Month/Year'</view> -->
                </view>
              </view>
              <u-form-item label="City">
                <u--input
                  v-model="formData.university.area"
                  border="bottom"
                ></u--input>
              </u-form-item>
              <view class="textarea-form">
                <u-form-item label="Remarks">
                  <u--textarea
                    confirm-type="done"
                    v-model="formData.university.summary"
                    maxlength="200"
                    count
                    border="bottom"
                    height="120"
                  ></u--textarea>
                </u-form-item>
                <view class="textarea-form--tip"
                  >eg: Maximum 200 characters</view
                >
              </view>
            </template>
          </u--form>
        </view>
      </view>
    </scroll-view>
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
import { getSchoolList, fetchEducationSave } from '@/api/resume';
import dateInput from '@/components/date-input/date-input';
import { getDateByMMYYYY } from '@/libs/util/date';
import dayjs from 'dayjs';
const EDUCATION = {
  primary_school: {},
  middle_school: {},
  university: {},
  // graduate_student: {},
  // doctor: {},
  // post_doctoral: {}
};
const EDU_ITEM = {
  guid: '',
  id: '',
  url: '',
  area: '',
  score: '',
  degree: '',
  courses: '',
  summary: '',
  institution: '',
  starttime: '',
  endtime: '',
  major: '',
  education: '',
};
export default {
  data() {
    return {
      maxDate: new Date().getTime(),
      minDate: '',
      currentTime: '',
      minTime: '',
      primarystarttime: '',
      middleschoolstarttime: '',
      universitystarttime: '',
      timeShow: false,
      formData: {
        primary_school: {
          institution: '',
          starttime: '',
          endtime: '',
          area: '',
          summary: '',
          id: '',
          guid: this.GUID(),
        },
        middle_school: {
          institution: '',
          starttime: '',
          endtime: '',
          area: '',
          summary: '',
          id: '',
          guid: this.GUID(),
        },
        university: {
          institution: '',
          starttime: '',
          endtime: '',
          area: '',
          summary: '',
          id: '',
          guid: this.GUID(),
        },
      },
      errorBol: {
        primary_school_starttime: false,
        primary_school_endtime: false,
        middle_school_starttime: false,
        middle_school_endtime: false,
        university_starttime: false,
        university_endtime: false,
      },
      rules: {
        'primary_school.endtime': {
          type: 'string',
          required: true,
          message: 'end date cannot be than start date',
        },
      },
      schoolData: [],
    };
  },
  components: {
    dateInput,
  },
  computed: {
    education() {
      return JSON.parse(uni.getStorageSync('resumedetails')).sections.education;
    },
    formChangeData() {
      return JSON.parse(JSON.stringify(this.formData));
    },
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
    console.log(this.minDate);
    // this.maxDate = this.minTime
    // 获取学校数据列表
    this.getSchoolList();
    // 初始化数据
    this.initData();
  },
  methods: {
    setprimaryValue(e) {
      
      this.formData.primary_school[e.key] = e.value;
      if (e.key === 'starttime') {
        this.errorBol[`primary_school_${e.key}`] = getDateByMMYYYY(
          e.value
        ).isAfter(getDateByMMYYYY(this.formData.primary_school.endtime));
      } else {
        this.errorBol[`primary_school_${e.key}`] = getDateByMMYYYY(e.value ).isBefore(getDateByMMYYYY(this.formData.primary_school.starttime));
      }
      let strArr = e.value.split('/')
      this.errorBol[`primary_school_${e.key}`] = strArr[0] > 12 ? true: false
    },
    setmiddleValue(e) {
      
      this.formData.middle_school[e.key] = e.value;
      if (e.key === 'starttime') {
        this.errorBol[`middle_school_${e.key}`] = getDateByMMYYYY(
          e.value
        ).isAfter(getDateByMMYYYY(this.formData.middle_school.endtime));
      } else {
        this.errorBol[`middle_school_${e.key}`] = getDateByMMYYYY(
          e.value
        ).isBefore(getDateByMMYYYY(this.formData.middle_school.starttime));
      }
      let strArr = e.value.split('/')
      this.errorBol[`middle_school_${e.key}`] = strArr[0] > 12 ? true: false
    },
    setuniversityValue(e) {
      this.formData.university[e.key] = e.value;
      if (e.key === 'starttime') {
        this.errorBol[`university_${e.key}`] = getDateByMMYYYY(e.value).isAfter(
          getDateByMMYYYY(this.formData.university.endtime)
        );
      } else {
        this.errorBol[`university_${e.key}`] = getDateByMMYYYY(
          e.value
        ).isBefore(getDateByMMYYYY(this.formData.university.starttime));
      }
      let strArr = e.value.split('/')
      this.errorBol[`university_${e.key}`] = strArr[0] > 12 ? true: false
    },
    openTime(type) {
      this.pickertype = type;
      this.minDate = this.minTime;
      if (type == 'primaryendtime') {
        if (this.formData.primary_school.starttime == '') {
          return;
        } else {
          let arr = this.formData.primary_school.starttime.split('/');
          this.minDate = Date.parse(arr[1] + '/' + arr[0]);
        }
      }
      if (type == 'middleschoolendtime') {
        if (this.formData.middle_school.starttime == '') {
          return;
        } else {
          let arr = this.formData.middle_school.starttime.split('/');
          this.minDate = Date.parse(arr[1] + '/' + arr[0]);
        }
      }
      if (type == 'universityendtime') {
        if (this.formData.university.starttime == '') {
          return;
        } else {
          let arr = this.formData.university.starttime.split('/');
          this.minDate = Date.parse(arr[1] + '/' + arr[0]);
        }
      }
      this.timeShow = true;
    },
    confirmSelect(obj) {
      console.log(obj);
      var date = new Date(obj.value);
      // 年份
      let year = date.getFullYear();
      // 月份
      let month =
        date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1;

      if (this.pickertype == 'primarystarttime') {
        // this.primarystarttime = Date.parse(this.formData.primary_school.starttime)
        this.formData.primary_school.starttime = month + '/' + year;
        if (!this.formData.primary_school.endtime) {
          this.formData.primary_school.endtime =
            this.formData.primary_school.starttime;
        } else {
          let arr = this.formData.primary_school.endtime.split('/');
          let endtime = Date.parse(arr[1] + '/' + arr[0]);
          if (endtime < obj.value) {
            this.formData.primary_school.endtime =
              this.formData.primary_school.starttime;
          }
        }
        this.pickertype = '';
      }
      if (this.pickertype == 'primaryendtime') {
        this.formData.primary_school.endtime = month + '/' + year;
        this.pickertype = '';
      }
      if (this.pickertype == 'middleschoolstarttime') {
        // this.middleschoolstarttime = obj.value
        this.formData.middle_school.starttime = month + '/' + year;
        if (!this.formData.middle_school.endtime) {
          this.formData.middle_school.endtime =
            this.formData.middle_school.starttime;
        } else {
          let arr = this.formData.middle_school.endtime.split('/');
          let endtime = Date.parse(arr[1] + '/' + arr[0]);
          if (endtime < obj.value) {
            this.formData.middle_school.endtime =
              this.formData.middle_school.starttime;
          }
        }
        this.pickertype = '';
      }
      if (this.pickertype == 'middleschoolendtime') {
        this.formData.middle_school.endtime = month + '/' + year;
        this.pickertype = '';
      }
      if (this.pickertype == 'universitystarttime') {
        // this.universitystarttime = obj.value
        this.formData.university.starttime = month + '/' + year;
        if (!this.formData.university.endtime) {
          this.formData.university.endtime = this.formData.university.starttime;
        } else {
          let arr = this.formData.university.endtime.split('/');
          let endtime = Date.parse(arr[1] + '/' + arr[0]);
          if (endtime < obj.value) {
            this.formData.university.endtime =
              this.formData.university.starttime;
          }
        }
        this.pickertype = '';
      }
      if (this.pickertype == 'universityendtime') {
        this.formData.university.endtime = month + '/' + year;
        this.pickertype = '';
      }
      this.timeShow = false;
    },
    cancelSelect() {
      this.pickertype = '';
      this.timeShow = false;
    },
    initData() {
      let education = {};
      if (this.education.length > 0) {
        this.education.map((v, i) => {
          education[v.education] = v;
        });
      }

      let formData = {};
      Object.keys(EDUCATION).forEach((key) => {
        if (education[key] !== undefined) {
          this.formData[key] = education[key];
        } else {
          var tmp = EDU_ITEM;
          tmp.guid = this.GUID();
          tmp.education = key;
          this.formData[key] = JSON.parse(JSON.stringify(tmp));
        }
      });
      this.$forceUpdate();
    },
    // 自动回写数据
    loadAutocompleteData(string) {
      let resList = [];
      this.schoolData.forEach((e) => {
        if (e.indexOf(string) > -1) {
          resList.push(string + e);
        }
      });
      return Promise.resolve(resList);
    },
    // 保存数据
    submit() {
      const param = {
        data: this.formChangeData,
        rid: JSON.parse(uni.getStorageSync('resumedetails')).id,
      };
      console.log(this.formChangeData);

      fetchEducationSave(param).then((res) => {
        console.log(res);
        this.goBack();
      });
    },
    // 获取学校列表数据
    getSchoolList() {
      getSchoolList().then((res) => {
        this.schoolData = res;
      });
    },
    // 返回上一级
    goBack() {
      uni.navigateTo({
        url: '/pages/resume/details?id=' + uni.getStorageSync('rid'),
      });
    },
    // checkStartTimeRange(key, { val, callback }) {
    //   callback(
    //     getDateByMMYYYY(val).isAfter(
    //       getDateByMMYYYY(this.formData[key].endtime)
    //     )
    //   );
    // },
    // checkEndTimeRange(key, { val, callback }) {
    //   callback(
    //     getDateByMMYYYY(val).isBefore(
    //       getDateByMMYYYY(this.formData[key].starttime)
    //     )
    //   );
    // },
  },
};
</script>

<style lang="scss">
.school_index {
  height: 100% !important;
  font-family: 'Roboto', sans-serif;

  .right_view {
    padding: 20px;
    width: 100%;
    box-sizing: border-box;
    overflow: auto;
    background-color: #fff;
  }
  .u-input {
    background-color: transparent !important;
  }
  .content_item {
    &:last-child {
      margin-bottom: 400rpx;
    }
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
