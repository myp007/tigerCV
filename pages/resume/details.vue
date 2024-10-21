<template>
  <view class="resume_details" id="main_body">
    <!-- nav -->
    <u-toast ref="uToast"></u-toast>
    <u-navbar
      class="app_navbar"
      height="56px"
      :placeholder="true"
      leftIconColor="#00328f"
    >
      <view slot="left" class="nav_title">
        <view @click="goBack"
          ><u-icon name="arrow-left" color="#00328f" size="22"></u-icon
        ></view>
      </view>
      <view slot="right" class="nav_right">
        <view @click="goPreview"
          ><u-icon name="checkmark" color="#00328f" size="22"></u-icon
        ></view>
      </view>
    </u-navbar>
    <view v-if="loading" class="skeleton_Details">
      <u-skeleton
        style="margin-bottom: 40rpx"
        rows="4"
        title
        loading
        v-for="item in 10"
        :key="item"
      ></u-skeleton>
    </view>
    <!-- content -->
    <view class="content_box" v-if="!loading">
      <view class="left_view">
        <view class="" @click="goLocation('user')">
          <i class="material-icons" style="color: #00328f">person</i>
        </view>
        <view class="" @click="goLocation('school')">
          <i class="material-icons" style="color: #00328f">school</i>
        </view>
        <view class="" @click="goLocation('jobs')">
          <i class="material-icons" style="color: #00328f">work</i>
        </view>
        <view class="" @click="goLocation('work')">
          <i class="material-icons" style="color: #00328f">attach_money</i>
        </view>
        <view class="" @click="goLocation('profile')">
          <i class="material-icons" style="color: #00328f">chair</i>
        </view>
        <view class="" @click="goLocation('information')">
          <i class="material-icons" style="color: #00328f">location_on</i>
        </view>
        <view class="" @click="goLocation('social')">
          <i class="material-icons" style="color: #00328f">facebook</i>
        </view>
        <view class="" @click="goLocation('languages')">
          <i class="material-icons" style="color: #00328f">translate</i>
        </view>
        <view class="" @click="goLocation('skills')">
          <i class="material-icons" style="color: #00328f">handyman</i>
        </view>
        <view class="" @click="goLocation('complete')">
          <i class="material-icons" style="color: #00328f">check_circle</i>
        </view>
      </view>
      <view class="right_view" id="contet_right">
        <scroll-view
          class="scroller"
          :scroll-into-view="toView"
          scroll-y="true"
          scroll-with-animation="true"
        >
          <view id="user" class="content_item">
            <view class="item_title">1.Who are you</view>
            <view class="item_content">
              <u--form
                labelPosition="top"
                labelWidth="auto"
                :model="formData"
                :rules="rules"
                ref="form1"
              >
                <u-form-item
                  label="Resume Name"
                  ref="item1"
                  prop="basics.resume_name"
                >
                  <u--input
                    @blur="onSaveBasic('resume_name')"
                    v-model="formData.basics.resume_name"
                    border="bottom"
                  ></u--input>
                </u-form-item>
                <view style="display: flex">
                  <u-form-item
                    style="padding-right: 10px; flex: 1"
                    label="First Name"
                    ref="item1"
                  >
                    <u--input
                      @blur="onSaveBasic('first_name')"
                      v-model="formData.basics.first_name"
                      border="bottom"
                    ></u--input>
                  </u-form-item>
                  <u-form-item style="flex: 1" label="Last Name">
                    <u--input
                      @blur="onSaveBasic('Last Name')"
                      v-model="formData.basics.last_name"
                      border="bottom"
                    ></u--input>
                  </u-form-item>
                </view>
                <u-form-item label="Gender">
                  <uni-data-select
                    class="form_select"
                    v-model="formData.basics.sex"
                    placeholder=" "
                    :localdata="sexData"
                  ></uni-data-select>
                </u-form-item>
                <u-form-item label="Birthday">
                  <!-- <view @click="openTime('birthdate')" class="Birthday" style="width: 100%;">
										<u--input  v-model="formData.basics.birthdate"
											border="bottom"></u--input>
									</view>	 -->
                  <date-input
                    name="Birthday"
                    keyName="birthdate"
                    placeholder="Birthday"
                    :value="formData.basics.birthdate"
                    @setValue="setValue"
                  ></date-input>
                </u-form-item>
                <!-- <view style="font-size: 12px;color: #00000099;">eg: birthday format 'Month/Year'</view> -->
                <u-form-item label="Birth Place">
                  <u--input
                    @blur="onSaveBasic('birth_city')"
                    v-model="formData.basics.birth_city"
                    border="bottom"
                  ></u--input>
                </u-form-item>
              </u--form>
            </view>
          </view>
          <view id="school" class="content_item">
            <view class="item_title">2.What degree did you get</view>
            <view class="item-form">
              <!-- 有数据循环渲染教育经历 -->
              <view v-if="education.length > 0">
                <view v-for="(item, index) in education" :key="index">
                  <view class="item-show">
                    <view class="show-left" @click="goNext('school')">
                      <view class="show-title">
                        <span>
                          {{
                            item.institution || 'Ateneo de Manila University'
                          }}
                        </span>
                        <span class="show-education">{{ item.education }}</span>
                      </view>
                      <view class="show-msg">
                        <span>{{ item.starttime }} - {{ item.endtime }}</span>
                        <!-- <span>{{item.endtime-item.starttime | settime}} years</span> -->
                        <span>{{
                          computingtime(item.endtime, item.starttime)
                        }}</span>
                      </view>
                    </view>
                  </view>
                  <view
                    v-if="index < education.length - 1"
                    class="form-hr"
                  ></view>
                </view>
              </view>
              <!-- 没有数据展示默认教育模板 -->
              <view v-else>
                <view class="item-show">
                  <view class="show-left" @click="goNext('school')">
                    <view class="show-title">
                      <span class="show-education"
                        >You have not filled in the education information,
                        please click the button at the bottom right to fill
                        in</span
                      >
                    </view>
                  </view>
                </view>
              </view>
              <view class="add-rsm clearfix" @click="goNext('school')">
                <u-icon
                  class="r"
                  style="margin-top: 12px"
                  name="edit-pen-fill"
                  size="22"
                  color="#00328f"
                ></u-icon>
              </view>
            </view>
          </view>
          <view id="jobs" class="content_item">
            <view class="item_title">3.Jobs you've had</view>
            <view class="item-form">
              <!-- 有数据循环渲染工作经历 -->
              <view v-if="work.length > 0">
                <view v-for="(item, index) in work" :key="index">
                  <view class="item-show">
                    <view class="show-left" @click="goNext('job')">
                      <view class="show-title">
                        <span>{{ item.name }}</span>
                        <span class="show-education">{{ item.position }}</span>
                      </view>
                      <view class="show-msg">
                        <span>{{ item.starttime }} - {{ item.endtime }}</span>
                        <span>{{
                          computingtime(item.endtime, item.starttime)
                        }}</span>
                      </view>
                      <view class="show-remarks">{{ item.summary }}</view>
                    </view>
                  </view>
                  <view v-if="index < education.length" class="form-hr"></view>
                </view>
              </view>
              <!-- 没有数据展示默认工作模板 -->
              <view v-else>
                <view class="item-show">
                  <view class="show-left" @click="goNext('job')">
                    <view class="show-title">
                      <span class="show-education"
                        >You have not filled in the job information, please
                        click the button at the bottom right to fill in</span
                      >
                    </view>
                  </view>
                </view>
              </view>

              <view class="add-rsm clearfix" @click="goNext('job')">
                <u-icon
                  class="r"
                  style="margin-top: 12px"
                  name="edit-pen-fill"
                  size="22"
                  color="#00328f"
                ></u-icon>
              </view>
            </view>
          </view>
          <view id="work" class="content_item">
            <view class="item_title">4.Expected Work</view>
            <view class="item_content">
              <u--form
                labelPosition="top"
                labelWidth="auto"
                :model="formData"
                :rules="rules"
              >
                <u-form-item label="Occupation">
                  <view class="w_100">
                    <selectcy
                      :value="formData.basics.occupation"
                      placeholder="Add this as new tag"
                      :options="options.occupation"
                      @change="selectJob"
                      :maxlength="3"
                    ></selectcy>
                    <!-- <multicombox v-model="formData.basics.occupation"
											tag-placeholder="Add this as new tag" placeholder=" "
											:options="options.occupation"></multicombox> -->
                  </view>
                </u-form-item>
                <u-form-item label="City">
                  <u--input
                    @blur="onSaveBasic('position_city')"
                    v-model="formData.basics.position_city"
                    border="bottom"
                  ></u--input>
                </u-form-item>
                <u-form-item label="Salary">
                  <u--input
                    @blur="onSaveBasic('salary')"
                    v-model="formData.basics.salary"
                    border="bottom"
                  ></u--input>
                </u-form-item>
              </u--form>
            </view>
          </view>
          <view id="profile" class="content_item">
            <view class="item_title">5.Profile</view>
            <view class="item_content">
              <u--form
                labelPosition="top"
                labelWidth="auto"
                :model="formData"
                :rules="rules"
              >
                <u-form-item label="">
                  <u--textarea
                    confirmType="done"
                    v-model="formData.basics.amateur"
                    maxlength="800"
                    border="bottom"
                    height="120"
                    placeholder="What are your hobbies or family members? How do you usually get together? Are you single and enjoy watching movies and checking your phone? You can fill in names of your favorite movies, bloggers you follow, etc"
                    count
                  ></u--textarea>
                </u-form-item>
                <u-form-item label="Hobbies">
                  <view class="w_100">
                    <selectcy
                      :value="formData.basics.interests"
                      placeholder="Add this as new tag"
                      :options="options.hobbiesList"
                      @change="selectInterests"
                      :maxlength="3"
                    ></selectcy>
                    <!-- <multicombox v-model="formData.basics.interests"
											tag-placeholder="Add this as new tag" placeholder=" "
											:options="options.occupation" :value="formData.basics.interests"></multicombox> -->
                  </view>
                </u-form-item>
                <view style="font-size: 12px; color: #00000099"
                  >Select and fill in your hobbies</view
                >
              </u--form>
            </view>
          </view>
          <view id="information" class="content_item">
            <view class="item_title">6.Your information</view>
            <view class="item_content">
              <u--form
                labelPosition="top"
                labelWidth="auto"
                :model="formData"
                :rules="rules"
              >
                <u-form-item label="Address">
                  <u--input
                    @blur="onSaveBasic('address')"
                    v-model="formData.basics.address"
                    border="bottom"
                  ></u--input>
                </u-form-item>
                <u-form-item label="City">
                  <u--input
                    @blur="onSaveBasic('city')"
                    v-model="formData.basics.city"
                    border="bottom"
                  ></u--input>
                </u-form-item>
                <u-form-item label="Region">
                  <u--input
                    @blur="onSaveBasic('region')"
                    v-model="formData.basics.region"
                    border="bottom"
                  ></u--input>
                </u-form-item>
                <u-form-item label="E-mail">
                  <view class="common_input w_100">
                    <!-- <view class="input_label">Email</view> -->
                    <!-- <u--input v-model="mail" border="bottom" clearable></u--input> -->
                    <input-autocomplete
                      class="unit-item__input"
                      :value="formData.basics.email"
                      v-model="formData.basics.email"
                      highlightColor="#FF0000"
                      :loadData="loadAutocompleteData"
                    ></input-autocomplete>
                  </view>
                </u-form-item>
                <u-form-item label="Phone Number">
                  <u--input
                    @blur="onSaveBasic('phone')"
                    v-model="formData.basics.phone"
                    border="bottom"
                  ></u--input>
                </u-form-item>
              </u--form>
            </view>
          </view>
          <view id="social" class="content_item">
            <view class="item_title">7.Social</view>
            <view class="item_content">
              <u--form
                labelPosition="top"
                labelWidth="auto"
                :model="formData"
                :rules="rules"
              >
                <u-form-item label="Facebook">
                  <u--input
                    @blur="onSaveBasic('facebook')"
                    v-model="formData.basics.facebook"
                    border="bottom"
                    maxlength="50"
                  >
                  </u--input>
                </u-form-item>
                <u-form-item label="Instagram">
                  <u--input
                    @blur="onSaveBasic('Instagram')"
                    v-model="formData.basics.instagram"
                    border="bottom"
                    maxlength="50"
                  >
                  </u--input>
                </u-form-item>
                <u-form-item label="Twitter">
                  <u--input
                    @blur="onSaveBasic('')"
                    v-model="formData.basics.twitter"
                    border="bottom"
                    maxlength="50"
                  >
                  </u--input>
                </u-form-item>
              </u--form>
            </view>
          </view>
          <view id="languages" class="content_item">
            <view class="item_title">8.Languages</view>
            <view class="item-form">
              <!-- 有数据循环渲染 -->
              <view v-if="languages.length > 0">
                <view v-for="(item, index) in languages" :key="index">
                  <view class="item-show">
                    <view class="show-left" @click="goNext('language')">
                      <view class="show-title">
                        <span>{{ item.name }}</span>
                      </view>
                      <view class="show-msg">
                        <view style="display: flex; align-items: center">
                          <span>Level :</span>
                          <u-rate
                            :readonly="true"
                            :value="item.level_num"
                            active-color="#00328f"
                            inactive-color="#00328f"
                            size="24"
                            gutter="15"
                          ></u-rate>
                          <!-- <v-rating v-model="item.level_num" :dense="true" :value="3">
													</v-rating> -->
                        </view>
                        <span>{{ item.use_time }}</span>
                      </view>
                      <view class="show-remarks">{{ item.summary }}</view>
                    </view>
                  </view>
                  <view class="form-hr"></view>
                </view>
                <view class="add-rsm clearfix" @click="goNext('language')">
                  <u-icon
                    class="r"
                    style="margin-top: 12px"
                    name="edit-pen-fill"
                    size="22"
                    color="#00328f"
                  ></u-icon>
                </view>
              </view>
              <!-- 没有数据展示默认 -->
              <view v-else>
                <view class="item-show">
                  <view class="show-left" @click="goNext('language')">
                    <view class="show-title">
                      <span class="show-education"
                        >You have not filled in the language skills, please
                        click the button at the bottom right to fill in</span
                      >
                    </view>
                  </view>
                </view>

                <view class="add-rsm clearfix" @click="goNext('language')">
                  <u-icon
                    class="r"
                    style="margin-top: 12px"
                    name="edit-pen-fill"
                    size="22"
                    color="#00328f"
                  ></u-icon>
                </view>
              </view>
            </view>
          </view>
          <view id="skills" class="content_item">
            <view class="item_title">9.Other skills</view>
            <view class="item-form">
              <!-- //有数据循环渲染 -->
              <view v-if="skills.length > 0">
                <view v-for="(item, index) in skills" :key="index">
                  <view class="item-show">
                    <view class="show-left" @click="goNext('skill')">
                      <view class="show-title">
                        <span>{{ item.name }}</span>
                      </view>
                      <view class="show-msg">
                        <view style="display: flex; align-items: center">
                          <span>Level :</span>
                          <u-rate
                            :readonly="true"
                            :value="item.level_num"
                            active-color="#00328f"
                            inactive-color="#00328f"
                            size="24"
                            gutter="15"
                          ></u-rate>
                          <!-- <v-rating v-model="item.level_num" :dense="true" :value="3">
													</v-rating> -->
                        </view>
                        <span>{{ item.use_time }}</span>
                      </view>
                      <view class="show-remarks">{{ item.summary }}</view>
                    </view>
                  </view>
                  <view class="form-hr"></view>
                </view>
                <view class="add-rsm clearfix" @click="goNext('skill')">
                  <u-icon
                    class="r"
                    style="margin-top: 12px"
                    name="edit-pen-fill"
                    size="22"
                    color="#00328f"
                  ></u-icon>
                </view>
              </view>
              <!-- 没有数据展示默认 -->
              <view v-else>
                <view class="item-show">
                  <view class="show-left" @click="goNext('skill')">
                    <view class="show-title">
                      <span class="show-education"
                        >You have not filled in the skills, please click the
                        button at the bottom right to fill in</span
                      >
                    </view>
                  </view>
                </view>
                <view class="add-rsm clearfix" @click="goNext('skill')">
                  <u-icon
                    class="r"
                    style="margin-top: 12px"
                    name="edit-pen-fill"
                    size="22"
                    color="#00328f"
                  ></u-icon>
                </view>
              </view>
            </view>
          </view>
          <view id="complete" class="content_item">
            <view class="item_title">10.Will Complete</view>
            <view class="item-photo item-form">
              <view class="photo-title">Upload A Photo</view>
              <view class="photo-msg">
                <p>
                  Let employers see your smile. People always like to work with
                  happy people.
                </p>
                <p>
                  If you have less than 2 years of work experience, uploading a
                  photo will help you get a job.
                </p>
              </view>
              <view v-if="formData.basics.photo" class="pic">
                <u--image
                  v-if="
                    formData.basics.photo.url && formData.basics.photo.url != ''
                  "
                  :src="formData.basics.photo.url"
                  width="100px"
                  height="100px"
                  @click="click"
                >
                </u--image>
                <u--image
                  v-else
                  src="http://192.168.211.195:8001/upload/resource/empty_photo.png"
                  width="100px"
                  height="100px"
                  @click="click"
                ></u--image>
              </view>
              <u-button class="guide_button" @click="uploadAvatar">
                UPLOAD
              </u-button>
              <view class="form-hr" style="margin-top: 20px"></view>
              <view class="photo-title">Resume Template</view>
              <view class="photo-msg">
                <p>Choose a template for your lucky</p>
              </view>
              <view class="rsm-select">
                <u-button class="guide_button" @click="goNext('resumeSelect')">
                  SELECT
                </u-button>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
    <!-- 底部导航栏 -->
    <u-datetime-picker
      :show="timeShow"
      :visibleItemCount="7"
      cancelText="Cancel"
      confirmText="Confirm"
      :itemHeight="44"
      :minDate="minDate"
      :maxDate="maxDate"
      @confirm="confirmSelect"
      @cancel="cancelSelect"
      mode="date"
    ></u-datetime-picker>
  </view>
</template>

<script>
import multicombox from '@/components/multicombox/index';
import selectcy from '@/components/select-cy/select-cy';
import dateInput from '@/components/date-input/date-input';
import { emails, uploadImg } from '@/common/tool';
import { saveResume, fetchEetail } from '@/api/resume.js';
import { getFacebookPosition } from '@/api/facebookTool.js';
export default {
  data() {
    return {
      loading: true,
      toView: '',
      timeShow: false,
      rid: '',
      selectvalue: 'RESUME',
      occupation: [],
      maxDate: new Date().getTime(),
      formData: {
        id: '',
        guid: this.GUID(),
        name: '',
        slug: '',
        editid: '',
        change: '',
        deleteid: '',
        image: '',
        basics: {
          sex: 0,
          id: '',
          name: 'UNTITLE',
          email: uni.getStorageSync('appinfo').email,
          phone: '',
          first_name: '',
          last_name: '',
          facebook: '',
          instagram: '',
          twitter: '',
          website: '',
          salary: '',
          resume_name: 'UNTITLE',
          occupation: [],
          position_city: '',
          amateur: '',
          interests: [],
          birthdate: null,
          birth_city: '',
          template_id: '',
          location: {
            city: '',
            region: '',
            address: '',
            country: '',
            postalCode: '',
          },
          photo: {
            id: '',
            url: '',
          },
        },
        sections: {
          work: [],
          skills: [],
          education: [],
          languages: [],
        },
      },
      options: {
        occupation: [],
        hobbiesList: [
          {
            label: 'Basketball',
            value: 'Basketball',
          },
          {
            label: 'Drink wine',
            value: 'Drink wine',
          },
          {
            label: 'Film',
            value: 'Film',
          },
          {
            label: 'Game',
            value: 'Game',
          },
          {
            label: 'Swimming',
            value: 'Swimming',
          },
          {
            label: 'Study',
            value: 'Study',
          },
          {
            label: 'Read a book',
            value: 'Read a book',
          },
        ], // 兴趣爱好
      },
      resumedetails: {},
      sexData: [
        {
          text: 'Male',
          value: 1,
        },
        {
          text: 'Female',
          value: 2,
        },
      ],
      education: [],
      work: [],
      languages: [],
      skills: [],
      rules: {
        'basics.resume_name': {
          type: 'string',
          required: true,
          message: 'Resume name is required',
          trigger: ['blur'],
        },
      },
    };
  },
  onReady() {
    // 表单校验
    // this.$refs.form1.setRules(this.rules)
  },
  onLoad(query) {
    // 是否携带参数rid
    if (query.id !== undefined) {
      this.rid = query.id;
    }
    this.getCurrentTime();
    // 获取工作岗位列表
    getFacebookPosition().then((res) => {
      res.forEach((item, index) => {
        this.options.occupation.push({
          label: item,
          value: item,
        });
      });
    });
    // 获取简历内容
    this.getresumedetails();
  },
  components: {
    multicombox,
    selectcy,
    dateInput,
  },
  methods: {
    setValue(e) {
      this.formData.basics[e.key] = e.value;
    },
    // 关闭时间组件
    cancelSelect() {
      this.timeShow = false;
    },
    // 获取当前时间往前的100年
    getCurrentTime() {
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
    },
    // 选择时间
    confirmSelect(obj) {
      var date = new Date(obj.value);
      // 年份
      let year = date.getFullYear();
      // 月份
      let month =
        date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1;
      // 天数
      let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      // 时间格式
      this.formData.basics.birthdate = day + '/' + month + '/' + year;
      // 保存简历内容
      this.onSaveBasic('birthdate');
      // 关闭时间组件
      this.timeShow = false;
    },
    // 打开时间组件
    openTime(type) {
      this.timeShow = true;
    },
    // 滚动到指定位置
    goLocation(type) {
      this.toView = '';
      this.$nextTick(() => {
        this.toView = type;
      });
    },
    // 自动填充
    loadAutocompleteData(string) {
      let resList = [];
      if (string != null) {
        var index = string.indexOf('@');
        if (index != -1) {
          string = string.substr(0, index);
        }
      }
      emails.forEach((e) => {
        resList.push(string + e);
      });
      return Promise.resolve(resList);
    },
    // 更新简历头像
    uploadAvatar() {
      uploadImg({
        rid: this.formData.id || 0,
      }).then((res) => {
        let resData = JSON.parse(res);
        this.formData.basics.photo.url = resData.data.file_url;
        this.formData.basics.photo.id = resData.data.file_id;
        console.log(this.formData);
      });
    },
    // 返回上一级
    goBack() {
      // uni.$u.route({
      // 	url:'/pages/resume/index'
      // })
      uni.switchTab({
        url: '/pages/resume/index',
      });
    },
    // 获取简历内容
    getresumedetails() {
      fetchEetail(this.rid || 0).then((res) => {
        if (res != null) {
          this.formData = res;
          // 教育经历
          this.education = [...res.sections.education];
          // 工作经历
          this.work = [...res.sections.work];
          // 语言
          this.languages = [...res.sections.languages];
          // 技术
          this.skills = [...res.sections.skills];

          // 将获取到的数据存储在本地
          uni.setStorageSync('resumedetails', JSON.stringify(this.formData));
          // 模板id
          uni.setStorageSync('templateId', this.formData.basics.template_id);
          // 保存rid
          uni.setStorageSync('rid', res.id);
        }
        this.loading = false;
      });
    },
    // 失去焦点/选中保存简历
    onSaveBasic(type) {
      if (!this.formData.basics.resume_name) {
        this.$refs.form1.validateField('basics.resume_name');
        return;
      }
      this.formData.change = 'basics.' + type;
      this.formData.editid = '';
      this.formData.deleteid = '';
      this.formData.basics.template_id =
        uni.getStorageSync('resumeData').id || 'template1';
      saveResume(this.formData).then((res) => {
        // 修改后的简历数据
        let resData = res;
        this.rid = res.id;
        // 将修改好的简历数据保存到本地
        uni.setStorageSync('resumedetails', JSON.stringify(resData));
        uni.setStorageSync('rid', res.id);
      });
    },
    // 保存并跳转预览简历
    goPreview() {
      if (!this.formData.basics.resume_name) {
        this.$refs.form1.validateField('basics.resume_name');
        return;
      }
      this.formData.editid = '';
      this.formData.deleteid = '';
      this.formData.change = '';
      this.formData.basics.template_id =
        uni.getStorageSync('templateId') || 'template1';
      saveResume(this.formData).then((res) => {
        // 修改后的简历数据
        let resData = res;
        this.rid = res.id;
        uni.setStorageSync('resumedetails', JSON.stringify(resData));
        uni.$u.route({
          url: 'pages/resume/preview?id=' + resData.id,
        });
      });
    },
    // 选中数据
    selectJob(item, value) {
      if (value.length > 3) {
        return;
      }
      console.log(value);
      this.formData.basics.occupation = value;
      this.onSaveBasic('occupation');
    },
    // 选中数据
    selectInterests(item, value) {
      this.formData.basics.interests = value;
      this.onSaveBasic('interests');
    },
    computingtime(start, end) {
      // 计算相差天数
      var date1 = start ? start.split('/') : '';
      // var date1 = start
      // var stime = new Date(date1).getTime()
      var stime = Date.parse(date1[1] + '/' + date1[0]);
      var date2 = end ? end.split('/') : '';
      // var date2 = end
      // var etime = new Date(date2).getTime()
      var etime = Date.parse(date2[1] + '/' + date2[0]);
      let usedTime = stime - etime; // 两个时间戳相隔的毫秒数
      let days = Math.floor(usedTime / (24 * 3600 * 1000)); // 计算相差的天数
      // console.log('相差的天数',days); //相差的时间
      if (days < 30) {
        return days + '' + 'Days';
      } else if (days > 30 && days < 365) {
        return parseInt(days / 30) + '' + 'Months';
      } else {
        return parseInt(days / 365) + '' + 'Years';
      }
    },
    // 跳转对应页面
    goNext(type) {
      if (type == 'resumeSelect') {
        uni.$u.route({
          url: 'pages/templates/index',
          params: {
            type: 'select',
            id: this.rid,
          },
        });
      } else if (type == 'school') {
        uni.$u.route({
          url: 'pages/resume/school',
        });
      } else if (type == 'job') {
        uni.$u.route({
          url: 'pages/resume/job',
        });
      } else if (type == 'language') {
        uni.$u.route({
          url: 'pages/resume/language',
        });
      } else if (type == 'skill') {
        uni.$u.route({
          url: 'pages/resume/skill',
        });
      }
    },
  },
};
</script>

<style lang="scss">
@font-face {
  font-family: 'Material Icons';
  font-style: normal;
  font-weight: 400;
  src: url(@/static/MaterialIcons/MaterialIcons-Regular.eot);
  /* For IE6-8 */
  src: local('Material Icons'), local('MaterialIcons-Regular'),
    url(@/static/MaterialIcons/MaterialIcons-Regular.woff2) format('woff2'),
    url(@/static/MaterialIcons/MaterialIcons-Regular.woff) format('woff'),
    url(@/static/MaterialIcons/MaterialIcons-Regular.ttf) format('truetype');
}

/* meterial icon的设定 */
.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  /* Preferred icon size */
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;
  /* Support for all WebKit browsers. */
  -webkit-font-smoothing: antialiased;
  /* Support for Safari and Chrome. */
  text-rendering: optimizeLegibility;
  /* Support for Firefox. */
  -moz-osx-font-smoothing: grayscale;
  /* Support for IE. */
  font-feature-settings: 'liga';
}
.Birthday {
  .u-input {
    background-color: transparent !important;
  }
}
v-deep .uni-select-cy-select {
  border: none !important;
  border-bottom: 1px solid #ccc !important;
}
.resume_details {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #fff;
  font-family: 'Roboto', sans-serif;
  .skeleton_Details {
    padding: 20px;
  }
  .content_box {
    display: flex;
    overflow: hidden;
    .left_view {
      width: 54px;
      text-align: center;

      .u-icon {
        margin-left: 16px;
        height: 40px;
      }

      view {
        margin-bottom: 40rpx;
        text-align: center;
      }
    }

    .right_view {
      flex: 1;

      .scroller {
        padding: 0px 10px 20px 0px;
        height: 100vh;

        .content_item {
          .item_title {
            padding-bottom: 20rpx;
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
    }
  }

  .guide_button {
    padding: 10px 28px !important;
    background-color: #00328f;
    color: #fff;
    width: 100% !important;
  }
}
</style>
