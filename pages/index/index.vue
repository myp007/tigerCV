<template>
	<view class="tiger_cv_index" id="main_body">
    <!-- nav -->

    <!-- content -->
    <view class="content_box job_list">
      <u-skeleton
        v-if="showSkeleton"
        class="p_10 mt_10"
        :loading="true"
        rows="3"
        v-for="(item, i) in 4"
        :key="i"
        :rowsHeight="[10, 10, 30]"
      ></u-skeleton>

      <!-- <view class="dropdown-box" v-if="!showSkeleton">
				<view class="l" style=" display: flex; flex-direction: row;" @click="dropdownTop">
					<span class="dropdown-tit">{{ positionInfo.jobname ? positionInfo.jobname : 'Please select position' }}</span>
					<u-icon v-show="dropdownShow" name="arrow-up" size="16"></u-icon>
					<u-icon v-show="!dropdownShow" name="arrow-down" size="16"></u-icon>
				</view>
			</view> -->
      <u-list
        v-if="!showSkeleton"
        @scrolltolower="scrolltolower"
        @scroll="scrollPosition"
        class="card_item white_bj mb_10"
        style="height: 100%"
        :preLoadScreen="listData.length"
      >
        <view class="topClass">
          <view
            class="topItem"
            :class="{ topactive: i.id == directoryInfo.id }"
            @click="topTap(i)"
            v-for="(i, index) in topPosition"
            :key="index" >
            {{ i.name || i.jobname }}
            <block v-if="i.count > 0">({{ i.count || 0 }})</block>
          </view>
          <view class="top_Add" @click="openCalss"> + </view>
		 
        </view>
        <!-- <view class="topClass">
          <view
            class="topItem"
            :class="{ topactive: i.id == directoryInfo.id }"
            @click="topTap(i)"
            v-for="(i, index) in locationList"
            :key="index" >
            {{ i.text }}
          </view>
        </view> -->
        <view class="jobgr">
          <view class="job_ct">
            <view class="top_input">
              <!-- <view class="left_input">
            <uni-data-select
              class="input_select"
              :clear="false"
              v-model="searchParams.location"
              :localdata="locationList"
              @change="locationChange"
            ></uni-data-select>
          </view> -->
              <input
                class="uni-input"
                placeholder="Job code,keyword or company"
                placeholder-style="font-size:14px;"
                v-model="searchParams.keyWord"
                @confirm="search"
              />

              <u-icon
                name="search"
                color="#666"
                size="24"
                class="search_icon"
                @click="search"
              ></u-icon>
            </view>
          </view>
        </view>
        
				<view class="results">
					<view>
						<span style="font-weight: 800;padding-right: 5px;">{{ totalCount }} </span>
						<span>Job Openings </span>
						<span v-if="queryData.job_no || queryData.location || queryData.keyWord.length > 0"
							style="padding:0 5px">results for</span>
						<span v-if="queryData.job_no"> Job NO:{{ queryData.job_no }} {{ queryData.keyWord.length > 0 ||
							queryData.location ? ', ' : '' }}</span>
						<span v-if="queryData.location"> Location:{{ queryData.location }} {{ queryData.keyWord.length > 0 ? ', '
							: '' }}</span>
						<span v-if="queryData.keyWord.length > 0"> Search Criteria:<span v-for="(k, i) in queryData.keyWord">{{
							k.value }}</span></span>
						<span  class="reset"
							@click="resetSearch"> Reset</span>  
					</view>
					<image v-if="isLogin && expresInfo.stick_status == 1" src="@/static/icon/job-express-icon.png" class="express_icon" mode="aspectFit" @click="expressTap"  lazy-load="false"></image>
				</view>
				
				<u-list-item v-for="(item, index) in listData" :key="index" class="job_list_item">

					<block v-if="item.data_type == 'ad'">
						<view class="job_item_fb" >
							<view class="header_top">
								<view class="header_box m">
									<image :src="item.avatars[0] || defaultAvatar"  class="header_avatar" mode="aspectFit" lazy-load="false"></image>
								</view>
								<view class="header_right">
									<view class="title1 text-ofh">
										{{item.companyname}}
									</view>
									<view class="job_city">
										<span>{{item.city}} {{item.format_time}}</span>
										<image src="@/static/icon/earth.png" class="earth_icon" mode="aspectFit"   lazy-load="false"></image>
									</view>
								</view>
							</view>
						<view class="content mb_20 fz_12">
							<view :ref="`card_box_${index}`" @click="$u.debounce(operation(item, 'selected', index), 500)"
								:class="{ 'line_three_break': !item.showMore }"
								class="content_box over_auto jbo_content jbo_content_item" style="margin-bottom: 10px;">
								<u-read-more ref="uReadMore" :shadowStyle="shadowStyle" showHeight="80" color="#00328f"
									fontSize="12px" :class="{ 'line_three_break': !item.showMore }"
									class="content_box over_auto jbo_content jbo_content_item" closeText="See more"
									textIndent="0rem">
									<view class="content_item"  >
										<view v-html="item.content"></view>
									</view>
								</u-read-more>
							</view>
						</view>
						<u-album style="padding-top:30px;margin:0 auto;width:100%" v-if="item.images.length >0" :urls="item.images" keyName="url" multipleSize="100" singleSize="350"></u-album>
						<view class="job_info">
							<u-read-more ref="uReadMore" :shadowStyle="shadowStyle" showHeight="140" color="#999999"
									fontSize="28px"  class="job_more" closeText=""
									textIndent="0rem">
								<view class="job_row" v-for="(v ,i ) in item.jobs" :key="i">
									<view class="job_name text-ofh">{{v.jobname}}</view>
									<view class=" fz_12  tr fw_bold check_but_fb" @click="checkApply(v)">
											<span class="check-icon">
												<span v-if="checkList.some(i => i.id == v.id)"
													style="margin-right:5rpx ;display: inherit">[<u-icon name="checkmark"
														color="#444950" size="14"></u-icon>] </span>
												<span v-else style="margin-right:5rpx ;display: inherit">[<span
														style="width: 24rpx;"></span>] </span>
												Apply
											</span>
										</view>
									
								</view>
							</u-read-more>
						</view>
						
					</view>
					<view style="margin-bottom: 10px;padding: 0 22px 0 20px;display: flex;align-items: center;">
						<!-- 邮箱 -->
						<view class="publisher_date" style="width: 70%;color:#999">
							<span>{{item.hr_email[0] || ''}}</span>
								<image src="@/static/icon/chat1_icon.png" class="chat_icon" mode="aspectFit"  @click="goChat(item.jobs[0])"
										lazy-load="false"></image>
						</view>
						<view  style=" width: 30%;  display: flex; align-items: center;justify-content: flex-end">
							<view  class="line_feed">
								<view class="avatar_group">
									<image v-for="(a ,i) in item.jobs" :key="i" v-if="i<3" @click="goChat(a)" :src="a.avatar || defaultAvatar" :style="{'z-index': 10 -i}" class="avatar1" mode="aspectFit" lazy-load="false"></image>
								</view>
							</view>
						</view>
					</view>
					</block>
					
					<block v-else>
							<view class="job_item"
							style="">
							<view class="title">
								{{ item.jobname || '-' }}
							</view>
							<view class="time">
								<view class="grey_text" style="color: #00328f;" @click="goCompany(item)">
									{{ item.companyname }}
								</view>
							</view>
							<view class="content mb_20 mt_20 fz_12">
								<view :ref="`card_box_${index}`" @click="$u.debounce(operation(item, 'selected', index), 500)"
									:class="{ 'line_three_break': !item.showMore }"
									class="content_box over_auto jbo_content jbo_content_item" style="margin-bottom: 10px;">
									<u-read-more ref="uReadMore" :shadowStyle="shadowStyle" showHeight="120" color="#00328f"
										fontSize="12px" :class="{ 'line_three_break': !item.showMore }"
										class="content_box over_auto jbo_content jbo_content_item" closeText="See more"
										textIndent="0rem">
										<view class="content_item"><span class="icon">📪</span> {{ item.job_no }}</view>
										<view class="content_item"><span class="icon">💳</span> {{ item.salary }}</view>
										<view class="content_item"><span class="icon">🏢</span> {{ item.address || '-' }}</view>
										<view class="content_item" style="margin-bottom: 20px;"><span class="icon">⏲</span>
											{{ item.work_time_remark }}</view>
										<view class="content_item" style="margin-bottom: 20px;" v-if="item.content">
											<view class="title"><span class="icon">📄</span>Job Description:</view>
											<view v-html="item.content"></view>
										</view>
										<view class="content_item" v-if="item.requirement">
											<view class="title"><span class="icon">📄</span>Job Requirement:</view>
											<view v-html="item.requirement"></view>
										</view>
									</u-read-more>
								</view>
							</view>
						</view>
						<view style="margin-bottom: 10px;padding: 0 22px 0 20px;display: flex;align-items: center;">
							<!-- 邮箱 -->
							<view class="publisher_date" style="width: 50%;color:#999">
								<span>{{ item.format_time }}</span>
								<image src="@/static/icon/chat1_icon.png" class="chat_icon" mode="aspectFit"  @click="goChat(item)"
										lazy-load="false"></image>
							</view>
							
							<view 
								style=" width: 50%;  display: flex; align-items: center;justify-content: flex-end">

              
                <view class="line_feed">
                  <!-- /**@tap="$u.debounce(operation(item, 'delivery',index),500)"**/ searchinfo.some(item => item.key =="999")-->

									<image :src="item.avatar || defaultAvatar" class="avatar" mode="aspectFit"
										lazy-load="false"></image>
									<view class=" fz_12  tr fw_bold check_but_fb" @click="checkApply(item)">
										<span class="check-icon">
											<span v-if="checkList.some(i => i.id == item.id)"
												style="margin-right:5rpx ;display: inherit">[<u-icon name="checkmark"
													color="#444950" size="12"></u-icon>] </span>
											<span v-else style="margin-right:5rpx ;display: inherit">[<span
													style="width: 24rpx;"></span>] </span>
											Apply
										</span>
									</view>
								</view>
							</view>
						</view>
					</block>
				
				</u-list-item>
				<u-loadmore v-show="loadmoreStatus" loadingText='loading...' nomoreText='no more'
					:status="loadmoreStatus" />
			</u-list>

		</view>
		<view class="foote" v-if="checkList.length > 0" :style="{ 'bottom': footeBottom + 'px' }">
			<view class="but" @click="sendApply">Apply Now [{{ checkList.length || 0 }}] & Chat Now</view>
		</view>
		<!-- 举报表单 -->
		<!-- <u-popup class="popup_card" :show="shamForm.show" mode="center" @close="shamForm.show = false">
			<view class="v_card p_20" style="max-width: 650rpx;">
				<view class="text-h5"> Tips </view>
				<view class="popup_text">
					Whether to include the current position information in junk information, your feedback will help more
					people find jobs, thank you!
					<u-radio-group v-model="shamForm.status" placement="column">
						<u-radio style="margin-top: 5px;" label="End of recruitment" :name="2"></u-radio>
						<u-radio style="margin-top: 5px;" label="False message" :name="3"></u-radio>
						<u-radio style="margin-top: 5px;" label="Fraud" :name="4"></u-radio>
					</u-radio-group>
				</view>
				<view class="clearfix tr">
					<u-divider></u-divider>
					<u-button class="white_bt green_text fw_bold" text="Agree" @click="submitSham"></u-button>
					<u-button class="white_bt green_text fw_bold" text="Disagree" @click="shamForm.show = false"></u-button>
				</view>
			</view>
		</u-popup> -->

    <!-- 投递表单 -->
    <!-- <view class="asb_mask" v-show="dropdownShow" style="top:90px" @click="dropdownShow = false"></view> -->
    <view
      class="dropdown_abs"
      v-if="dropdownShow"
      :style="{ top: topPosition.length > 3 ? '110px' : '80px' }"
    >
      <scroll-view
        scroll-y="true"
        style="height: calc(100% - 150px)"
        class="scroll"
      >
        <view
          class="dropdown_item"
          :class="{ dropdown_active: item.jobcode == positionInfo.jobcode }"
          v-for="(item, index) in listPosition"
          :key="index"
          @click="dropdownChang(item)"
        >
          {{ item.jobname }}
          <block v-if="item.job_count > 0">({{ item.job_count || 0 }})</block>
        </view>
      </scroll-view>
    </view>
    <!-- //分类 -->
    <view class="applybox" v-if="calssShow">
      <view class="top_nav">
        <u-icon
          class="leftIcon"
          name="arrow-left"
          size="20"
          @click="closeClass"
        ></u-icon>
        <view class="c_title">Select Job</view>
        <!-- <view  class="right_but" @click="jobEdit">{{isEdit ? 'Save' : 'Edit'}}</view> -->
      </view>
      <scroll-view scroll-y="true" style="height: 100%" class="c_scroll">
        <view class="c_tit">
          <view class="left_border"></view>
          <view class="h">My Jobs </view>
          <!-- <span class="span">Click to enter the position</span> -->
        </view>
        <view class="tag_list">
          <u-tag
            v-for="(item, i) in userCategoryList"
            :key="i"
            :text="item.jobname"
            :closable="isEdit && item.id != 0"
            :style="{ 'margin-top': item.id == 0 ? '10px' : '0px' }"
            @close="closeTag(i)"
            class="tag_but"
            size="mini"
            type="warning"
          ></u-tag>
        </view>
        <view v-for="(item, i) in allPosition" :key="i">
          <view class="c_tit">
            <view class="left_border"></view>
            <view class="h">{{ item.companyname }} </view>
            <span class="span">Click to add position</span>
          </view>
          <view class="tag_list">
            <u-tag
              class="tag_but"
              :icon="
                userCategoryList.some((i) => i.id == c.id)
                  ? 'checkbox-mark'
                  : 'plus'
              "
              v-for="(c, j) in item.child"
              :key="j"
              :text="c.jobname"
              @click="tapTag(c)"
              :plain="userCategoryList.some((i) => i.id == c.id) ? false : true"
              size="mini"
              type="warning"
            ></u-tag>
          </view>
        </view>
      </scroll-view>
    </view>
    <view class="asb_mask" v-show="applyShow" @click="applyShow = false"></view>
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

            <navigator url="/pages/resume/upload?type=index_add" class="link_upload">
              Upload new resume
            </navigator>
            <view class="but-box">
              <u-button
                class="but"
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
              <u-button class="but" @click="jobSubmit" :loading="deliverLoading"
                >Submit & Chat Now</u-button
              >
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
    <view
      class="v_card p_0_10 btm_form_view"
      v-show="showDeliver"
      style="padding-bottom: 20px"
    >
      <u-icon
        class="closeIcon"
        name="close"
        size="20"
        @click="
          showDeliver = false;
          eailmIndex = '';
        "
      ></u-icon>

      <view style="max-height: 300px; overflow: auto; margin-top: 15px">
        <u-tag
          class="dib"
          v-for="(name, index) in deliverForm.hr_email"
          :key="index"
          :text="name"
          size="mini"
          :show="true"
          @close="closeHremail(index)"
        ></u-tag>
      </view>
      <u-row>
        <u-col span="11">
          <u--form>
            <u-form-item borderBottom @click="showPickResume = true">
              <view
                style="max-height: 300px; overflow: auto; padding-left: 10px"
              >
                <view>{{
                  deliverForm.resumeName
                    ? deliverForm.resumeName
                    : 'your Resume *'
                }}</view>
              </view>
              <u-icon slot="right" name="arrow-down"></u-icon>
            </u-form-item>
          </u--form>
        </u-col>
        <u-col span="1">
          <u-icon
            class="pl_10"
            name="rewind-right-fill"
            size="20"
            @click="$u.debounce(deliverFromSubmit('send'), 500)"
          ></u-icon>
        </u-col>
      </u-row>
    </view>
    <multiple-select
      v-model="showEmail"
      :data="emailActions"
      :default-selected="deliverForm.hr_email"
      @confirm="
        (v) => {
          confirm(v, 'group');
        }
      "
    ></multiple-select>
    <u-action-sheet
      title="select resume"
      :actions="pickResume"
      :closeOnClickOverlay="true"
      :closeOnClickAction="true"
      :show="showPickResume"
      @close="showPickResume = false"
      @select="
        (o) => {
          onSelectChange(o.value);
        }
      "
    ></u-action-sheet>
	<u-modal class="expres" :show="expresShow" :show-cancel-button="true" @cancel="expresShow = false" 
			cancel-text="Ok" :show-confirm-button="false" title="Automatic delivery in progress..." :content="expresInfo.content" content-style="text-align: center;"></u-modal>
  </view>
</template>

<script>
import { stickStatus, facebookChangePos, posDeliverBySelf, getChat,chatStart, getJobCategory, jobList, getTopdirectory , categoryList ,allCategoryList ,categorySave} from '@/api/facebookTool';
import { getResumeList, sendEmail, fetchEetail ,getCityList} from '@/api/deliver'
import {loginEmail} from '@/api/user'
import { globalData } from '@/api/common.js'
import uImage from '../../uni_modules/uview-ui/components/u--image/u--image.vue';
import config from '@/common/config.js'

export default {
	components: { uImage },
	data() {
		return {
			scrollListTop: 0,
			showSkeleton: false,
			eailmIndex: '',
			eliverTemplateContent: '',
			eliverKey: '',
			// shadowStyle: {
			// 	// #ifndef APP-NVUE
			// 	backgroundImage: "linear-gradient(-180deg, rgba(255, 255, 255, 0) 0%, #fff 80%)",
			// 	// #endif
			// 	// #ifdef APP-NVUE
			// 	// nvue上不支持设置复杂的backgroundImage属性
			// 	backgroundImage: "linear-gradient(to top, #fff, rgba(255, 255, 255, 0.5))",
			// 	// #endif
			// 	paddingTop: "28px",
			// 	marginTop: "-28px",
			// },
			queryData: {
				keyWord: []
			},
			searchParams: {
				location: 'All City',
				keyWord: '',
				job_no: '',
				groups_name: '',
				hr_email: '',
				position: '',
				category_id: '',
				page: 0,
				pageSize: 20,
			},
			selectvalue: 'JOBS',
			totalCount: '',
			listData: [],
			loadmoreStatus: '',
			shamForm: {
				show: false,
				status: '',
				id: ''
			},
			fdFlag: null,
			emailActions: [],
			showEmail: false,
			showDeliver: false,
			showPickResume: false,
			pickResume: [],
			hr_email: '',
			requestStatus: false,
			dialogDetail: {
				show: false,
				groups_name: '',
				all_count: '',
				last_time: '',
				three_count: '',
				today_count: '',
				url: '',
			},
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
				dear3: ''
			},
			defaultAvatar: 'data:image/jpg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QMraHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjREMEQwRkY0RjgwNDExRUE5OTY2RDgxODY3NkJFODMxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjREMEQwRkY1RjgwNDExRUE5OTY2RDgxODY3NkJFODMxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NEQwRDBGRjJGODA0MTFFQTk5NjZEODE4Njc2QkU4MzEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NEQwRDBGRjNGODA0MTFFQTk5NjZEODE4Njc2QkU4MzEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAAGBAQEBQQGBQUGCQYFBgkLCAYGCAsMCgoLCgoMEAwMDAwMDBAMDg8QDw4MExMUFBMTHBsbGxwfHx8fHx8fHx8fAQcHBw0MDRgQEBgaFREVGh8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx//wAARCADIAMgDAREAAhEBAxEB/8QAcQABAQEAAwEBAAAAAAAAAAAAAAUEAQMGAgcBAQAAAAAAAAAAAAAAAAAAAAAQAAIBAwICBgkDBQAAAAAAAAABAhEDBCEFMVFBYXGREiKBscHRMkJSEyOh4XLxYjNDFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A/fAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHbHFyZ/Dam+yLA+Z2L0Pjtyj2poD4AAAAAAAAAAAAAAAAAAAAAAAAKWFs9y6lcvvwQeqj8z9wFaziY1n/HbUX9XF97A7QAGXI23EvJ1goyfzR0YEfN269jeZ+a03pNe0DIAAAAAAAAAAAAAAAAAAAACvtO3RcVkXlWutuL9YFYAAAAAOJRjKLjJVi9GmB5/csH/mu1h/in8PU+QGMAAAAAAAAAAAAAAAAAAaMDG/6MmMH8C80+xAelSSVFolwQAAAAAAAHVlWI37ErUulaPk+hgeYnCUJuElSUXRrrQHAAAAAAAAAAAAAAAAABa2Oz4bM7r4zdF2ICmAAAAAAAAAg7zZ8GX41wuJP0rRgYAAAAAAAAAAAAAAAAAD0m2R8ODaXU33tsDSAAAAAAAAAlb9HyWZcnJd9PcBHAAAAAAAAAAAAAAAAAPS7e64Vn+KA0AAAAAAAAAJm+v8Ftf3ewCKAAAAAAAAAAAAAAAAAX9muqeGo9NttP06+0DcAAAAAAAAAjb7dTu2ra+VOT9P8AQCWAAAAAAAAAAAAAAAAAUNmyPt5Ltv4bui/kuAF0AAAAAAADiUlGLlJ0SVW+oDzOXfd/Ind6JPRdS0QHSAAAAAAAAAAAAAAAAAE2nVaNcGB6Lbs6OTao9LsF51z60BrAAAAAABJ3jOVHjW3r/sa9QEgAAAAAAAAAAAAAAAAAAAPu1duWriuW34ZR4MC9hbnZyEoy8l36XwfYBsAAADaSq9EuLAlZ+7xSdrGdW9Hc5dgEdtt1erfFgAAAAAAAAAAAAAAAAADVjbblX6NR8MH80tEBRs7HYivyzlN8lovaBPzduvY0m6eK10TXtAyAarO55lpJK54orolr+4GqO/Xaea1FvqbXvA+Z77kNeW3GPbV+4DJfzcm/pcm3H6Vou5AdAFLC2ed2Pjv1txa8sV8T6wOL+yZEKu1JXFy4MDBOE4ScZxcZLinoB8gAAAAAAAAAAAB242LeyJ+C3GvN9C7QLmJtePYpKS+5c+p8F2IDYAANJqj1T4oCfk7Nj3G5Wn9qXJax7gJ93Z82D8sVNc4v30A6Xg5i42Z+iLfqARwcyT0sz9MWvWBps7LlTf5Grce9/oBTxdtxseklHxT+uWr9AGoAB138ezfj4bsFJdD6V2MCPm7RdtJzs1uW1xXzL3gTgAAAAAAAAADRhYc8q74I6RWs5ckB6GxYtWLat21SK731sDsAAAAAAAAAAAAAAAASt021NO/YjrxuQXT1oCOAAAAAAABzGLlJRSq26JAelwsWONYjbXxcZvmwO8AAAAAAAAAAAAAAAAAAef3TEWPkVivx3NY9T6UBiAAAAAABo2+VmGXblddIJ8eivRUD0oAAAAAAAAAAAAAAAAAAAYt4tKeFKVNYNSXfRgefAAAAAAAAr7VuSSWPedKaW5v1MCsAAAAAAAAAAAAAAAAAAIe6bj96Ts2n+JPzSXzP3ATgAAAAAAAAFbbt1UUrOQ9FpC4/UwK6aaqtU+DAAAAAAAAAAAAAAA4lKMIuUmoxWrb4ARNx3R3q2rLpa4Sl0y/YCcAAAAAAAAAAANmFud7G8r89r6X0dgFvGzLGRGtuWvTF6NAdwAAAAAAAAAAAy5W442PVN+K59EePp5ARMvOv5MvO6QXCC4AZwAAAAAAAAAAAAAcxlKLUotprg1owN+PvORborq+7Hnwl3gUbO74VzRydt8pKn68ANcJwmqwkpLmnUDkAAAAfNy9atqtyagut0AxXt5xIV8Fbj6lRd7Am5G65V6qUvtwfyx94GMAAAAAAAAAAAAAAAAAAAOU2nVOj5gdsc3LiqRvTpyqwOxbnnrhdfpSfrQB7pnv/AGvuS9gHXPMy5/Fem1yq0v0A6W29XqwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf//Z',
			listPosition: [

			],
			positionInfo: {},
			checkList: [],
			applyShow: false,
			dropdownShow: false,
			footeBottom: 48,
			topPosition: [],
			directoryInfo: {
				count: 0,
				id: '',
				name: 'All'
			},
			deliverLoading:false,
			showSucces:false,
            isLogin:false,
            formJob:{},
            filePDF:[],
            locationList:[],
			calssShow:false,
			allPosition:[],
			userCategoryList:[],
			isEdit:true,
			shadowStyle: {
				backgroundImage: "none",
				paddingTop: "0",
				marginTop: "0"
			},
			expresShow:false,
			expresInfo:{
				title:' Automatic delivery in progress...',
				content:'Expiration:06/28/2023'
			},
		}
	},
	
	onLoad() {
		
		this.init()
       
		// #ifdef H5
		this.footeBottom = 88
		// #endif
	},
	
	onShow(){
		this.getResume()
	},
	onPullDownRefresh() {
		this.showSkeleton = true
		this.getListData('reset')
	},
	methods: {
		init() {
			this.getTopCategory()
			this.getlocationList()
		},
		goCompany(item){
			uni.navigateTo({
				url:'/pages/index/companyJobs?id=' + item.comid
			})
		},
		search(){
			this.getListData('reset')
		},
		locationChange(e){
			this.searchParams.location = e
			this.getListData('reset')
		},
		openCalss(){
			categoryList().then(res => {
				this.userCategoryList = res	
			})

			allCategoryList().then(res => {
				this.allPosition = res
				})
			this.calssShow = true
			this.isEdit = true
		},
		closeClass(){
			this.calssShow = false
			this.isEdit = true
		},
		jobEdit(){
			let appinfo = uni.getStorageSync('appinfo');
			
            this.isLogin = appinfo.token ? true : false
			if(!this.isLogin){
				
				uni.reLaunch({
					url: '/pages/center/login_up'
				})
			}
			if(this.isEdit){
				let categoryids = []
				this.userCategoryList.map((item) =>{
					if(item.id > 0){
						categoryids.push(item.id)
					}
				})
				categorySave({categoryids:categoryids},).then(res => {
					this.topPosition = this.userCategoryList
					
				})
			}
		},
		closeTag(i){
			this.userCategoryList.splice(i, 1)
			this.jobEdit()
		},
		tapTag(item){
			if(!this.isEdit) return;
			if (this.userCategoryList.findIndex((e) => e.id === item.id) !== -1) {
				this.userCategoryList.map((c, i) => {
					if (item.id == c.id) {
						this.userCategoryList.splice(i, 1)
					}
				})
			} else {
				this.userCategoryList.push(item)
			}
			this.jobEdit()
		},
        getResume(){
            let appinfo = uni.getStorageSync('appinfo');
			
            this.isLogin = appinfo.token ? true : false
			let systemInfo = uni.getSystemInfoSync()
			
			if(systemInfo.uniPlatform == 'app' && !this.isLogin){
				uni.reLaunch({
					url: '/pages/center/login_up'
				})
				return;
			}
            globalData().then(res => {
                if (res) {
                    this.eliverTemplateContent = res.eliverTemplate
                    this.eliverKey = res.eliverKey
                    if(this.isLogin){
                        this.getResumeList()
                        // uni.reLaunch({
						// 	url: '/pages/index/index'
						// })
						stickStatus().then(res => {
							let content = 'Expiration:' + res.deadline.split(" ")[0]
							res.content = content
							this.expresInfo = res
						})
                    }
                }
            })
			
        },
		
		seeMore(i) {
			this.listData[i].showMore = false
		},
		load() {
			this.$refs.uReadMore.init();
		},
		scrollPosition(e) {
			// console.log(e)
			this.scrollListTop = e
		},
        select(e) {
            this.filePDF = e.tempFiles
        },
        deleteFile(){
            this.filePDF = []
        },
        openUrl(type){
				let url = ''
                if(type == '1'){
                    url = 'https://www.hirechat.ph/terms-of-use'
                }else if(type == '2'){
                    url = 'https://www.hirechat.ph/privacy-policy'
                }
				// #ifdef H5
				window.open(url)
				// #endif

				// #ifdef APP-PLUS
				plus.runtime.openURL( url, function(res) {  
                    console.log(res);  
                }); 
				// #endif

			},
		closeApply(){
			this.applyShow = false; 
			this.eailmIndex = '' ;
			this.showSucces = false ; 
			this.deliverLoading = false;
			this.checkList=[]
		},
		checkApply(item) {
			
			if (this.checkList.findIndex((e) => e.id === item.id) !== -1) {
				this.checkList.map((c, i) => {
					if (item.id == c.id) {
						this.checkList.splice(i, 1)
					}
				})
			} else {
				this.checkList.push(item)
			}
		},
		applyRemove(index) {
			
			this.checkList.splice(index, 1)
		},
		sendApply() {
			if (this.checkList.length == 0) {
				uni.$u.toast('Please select the position to be delivered')
				return
			}
			this.dropdownShow = false
			this.applyShow = true
		},
		expressTap(){
			this.expresShow = true
			
		},
		resetSearch() {
			this.queryData = {
				keyWord: []
			},
				this.positionInfo = {}
				this.directoryInfo = {
				count: 0,
				id: '',
				name: 'All'
			}
			this.searchParams = {
				location: 'All City',
				keyWord: '',
				job_no: '',
				groups_name: '',
				hr_email: '',
				category_id: '',
				position: '',
				page: 0,
				pageSize: 20,
			}
			uni.setStorageSync('jobQuery', null)
			this.showSkeleton = true
			this.getListData('reset')
		},
		getTopCategory() {
			let appinfo = uni.getStorageSync('appinfo');
			this.isLogin = appinfo.token ? true : false
			if(this.isLogin){
				categoryList().then(res => {
					if (res.length > 0) {
						this.topPosition = res
						this.directoryInfo = res[0]
						this.showSkeleton = false
					}
					this.listPosition = []
					this.getListData('reset')
				})
			}else{
				getTopdirectory().then(res => {
					if (res.length > 0) {
						this.topPosition = res
						this.directoryInfo = res[0]
						this.showSkeleton = false
					}
					this.listPosition = []
					this.getListData('reset')
				})
			}
			

		},
		topTap(obj) {
			this.directoryInfo = obj
			this.dropdownShow = false
			this.applyShow = false
			this.positionInfo = {}
			this.checkList = []
			this.getJobCategory()
		},
		dropdownTop(){
			this.dropdownShow = !this.dropdownShow 
			this.applyShow = false
		},
		getJobCategory() {
			getJobCategory({ pid: this.directoryInfo.id }).then(res => {
				if (res.length > 0) {
					this.listPosition = res
				}
				this.getListData('reset')
			})
		},
		dropdownChang(item) {
			this.positionInfo = item
			this.dropdownShow = false
			this.getListData('reset')
		},
		// 跳转聊天框
		goChat(item) {
			uni.showLoading({
				title: ''
			});
            if(this.isLogin){
                
                chatStart({ jobid: item.id }).then(res => {
                    uni.navigateTo({
                        url: '/pages/session-info/session-info?id='
                            + res.session_id + '&resume_id=' + res.resume_id
                            + '&talent_id=' + res.talent_id + '&apply_id=' + res.apply_id +
                            '&companyname=' + item.companyname + '&jobname=' + item.jobname + '&jobid=' + item.id
                    })

                    uni.hideLoading()
                }).catch(err => {
                    uni.hideLoading()
                })
            }else{
                uni.setStorageSync('chatInfo',item);
                uni.redirectTo({
                    url: '/pages/center/login_up' 
                })
            }

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
		emailCopyUrl(text) {
			uni.setClipboardData({
				data: text,
				success: function () {
					console.log('success');
				}
			});
		},
		clickShowMore(index) {
			this.$set(this.listData[index], 'showMore1', true)
		},
		scrolltolower() {
			if (this.loadmoreStatus == 'loading' || this.loadmoreStatus == 'nomore') {
				return
			}
			this.getListData('scroll')
		},
		scrolltoupper() {
			this.showSkeleton = true
			this.getListData('reset')
		},
		
		// 列表
		getListData(type) {
			let self = this;
			if (type == 'reset') {
				this.searchParams.page = 0
				this.scrollListTop = 0
				this.listData = []
				this.checkList = []
			}
			this.loadmoreStatus = "loading"
			this.searchParams.page++

			// this.searchParams.category_id = this.positionInfo.id
			this.searchParams.pid = this.directoryInfo.id 
			
			let jsonData = JSON.parse(JSON.stringify(this.searchParams))
			jsonData.location = this.searchParams.location == 'All City' ? '' :this.searchParams.location
			// 信息列表
			jobList(jsonData).then(res => {
				this.showSkeleton = false
				if (res) {
					let resData = res.list
					this.totalCount = res.count
					
					let str = "\n"
					resData = resData.map((item, i) => {
						
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
					this.listData = this.listData.concat(resData)
					
					this.loadmoreStatus = ''
					if (resData.length == 0) {
						this.loadmoreStatus = 'nomore'
					}
					// 不符合分页
					if (resData.length < this.searchParams.pageSize) {
						this.loadmoreStatus = 'nomore'
					}

					uni.stopPullDownRefresh()
				}
			})
		},
		// 操作
		operation(item, type, index) {
			// 高阶函数
			return () => {
				if (type == 'delivery') {
					// 投递
					posDeliverBySelf({ id: item.id }).then(resData => {

						if (resData < 3 && item.self_count < 3) {
							// this.showDeliver = true
							this.showPickResume = true
							this.eailmIndex = index
							this.deliverForm.permalinkid = item.permalinkid
							this.deliverForm.id = item.id
							if (item.hr_email) {
								this.deliverForm.hr_email = [item.hr_email]
							}

						} else {
							uni.$u.toast('Each position can only be delivered 3 times')
						}
					}).catch(err => {
						uni.$u.toast('Each position can only be delivered 3 times')
					})

				} else if (type == 'sham') {
					// 举报
					this.shamForm.show = true
					this.shamForm.id = item.id
					this.shamForm.index = index
				} else if (type == 'selected') {
					this.$set(this.listData[index], 'showMore', true)
					// 关闭表单
					this.showDeliver = false
					// 点击选中 没有投递过的职位
					if (item.self_count >= 3) {
						return
					}
					if (typeof (item.selected) == 'undefined' || !item.selected) {
						this.$set(this.listData[index], 'selected', true)
					} else {
						item.selected = false
					}
				} else if (type == 'batchDelivery') {
					// 批量投递
					let deliverys = this.listData.filter(o => { return o.selected == true })
					let queryData = deliverys.map(o => {
						return {
							id: o.id,
							permalinkid: o.permalinkid,
							hr_email: o.hr_email
						}
					})

				}
			}

		},
		// 举报
		submitSham() {
			uni.showLoading({ title: 'login....', mask: true });
			facebookChangePos(this.shamForm).then(res => {
				uni.hideLoading();
				if (res) {
					this.listData[this.shamForm.index].status = this.shamForm.status
					uni.$u.toast('Reported successfully')
					this.shamForm.show = false
				}
			})
		},
		// 图片预览
		previewImg(imgs) {
			if (imgs.length > 0) {
				uni.previewImage({ urls: imgs });
			}
			
		},
		getlocationList(){
			getCityList().then(resData => {
				
				this.locationList = resData.map((item) =>{
					let obj = {
						text: item,
						value: item,
					}
					return obj
				})
				this.locationList.push({
						text: 'All City',
						value: 'All City',
				})
			})
		},
		// 简历列表
		getResumeList() {
			getResumeList().then(resData => {
				if (!resData) {
					return
				}
				// let resData = this.pickResume
				resData.forEach((v, index) => {
					if (v.is_export == 0) {
						v.disabled = true
					}
					v.value = v.value + ''
					if (v.occupation) {
						v.name = v.text + ` - ${v.occupation}`
					} else {
						v.name = v.text
					}
				});
				this.pickResume = resData

				// 设置默认简历 
				this.getLasetResume()
			})
		},
		// 设置默认简历
		getLasetResume() {
			for (let i = this.pickResume.length - 1; i >= 0; i--) {
				let item = this.pickResume[i];
				if (item['is_export'] != 0) {
					// 最后一份有模板的简历
					this.deliverForm.rid = item.value
				}
			}
			this.onSelectChange(this.deliverForm.rid)
		},
		// 选择简历
		onSelectChange(e) {
			let id = ''
			if (e.split) {
				id = e.split('_')[0];
			} else {
				id = e
			}
			let row = this.pickResume.filter(item => item.value === e)[0];
			if (!row) {
				return
			}
			this.deliverForm.first_name = row.first_name + ' ' + row.last_name
			this.deliverForm.resumeName = row.resume_name
			// 点击后获取简历内容
			fetchEetail(id).then(resData => {
				if (!resData) {
					return
				}
				let eliverData = {
					occupation: row.occupation,
					phone: resData.basics.phone,
					email: resData.basics.email,
					username: resData.basics.first_name + ' ' + resData.basics.last_name,
					facebook: resData.basics.facebook,
					salary: resData.basics.salary,
					age: resData.basics.age,
					position_city: resData.basics.position_city
				}

				// let content = window.GlobalData ? window.GlobalData.eliverTemplate : '';
				// let replaceKeys = window.GlobalData ? window.GlobalData.eliverKey : []
				let replaceKeys = this.eliverKey || []
				let content = this.eliverTemplateContent || ''
				replaceKeys.forEach(key => {
					content = content.replace(new RegExp(`【${key}】`, 'gm'), eliverData[key])
				});
				this.deliverForm.content = content
				if (row.image_path != '') {
					this.deliverForm.img = row.image_path
				}
				this.deliverForm.original_img_path = row.original_img_path
				this.deliverForm.is_export = row.is_export
				if (row.is_export == 0) {
					this.$toasted.error('Resume not exported after update', {
						icon: 'alert-circle-outline '
					})
				}
				row.age = resData.basics.age
				row.sex = resData.basics.sex
				this.setSubject(row)
			})
		},
		setSubject(row) {
			//姓名 | 工作年限，应聘 岗位 | 地点薪资K
			let subject = ''

			if (row.occupation != '' && row.occupation != null && row.occupation.length > 0) {
				subject += row.occupation
			}

			if (row.salary != '') {
				subject += ' | ₱' + row.salary
			}

			if (row.age != '') {
				subject += ' | age ' + row.age
			}

			if (row.sex != '') {
				subject += ' | sex ' + row.sex
			}
			subject += ' |  ' + row.first_name + ' ' + row.last_name

			// if (row.salary != '') {
			//   subject += ' Salary $' + row.salary
			// }
			this.deliverForm.subject = subject
			// this.jobDelivery()
		},
		closeSuccess(){
			this.checkList = []
				
				this.applyShow = false
				
				this.showSucces = false
				this.ws.pageRefresh.message = true
				this.ws.pageRefresh.sessionInfo = true
                if(!this.isLogin){

                }
				uni.switchTab({
					url: '/pages/message/message'
				})
		},
        jobSubmit(){
            let {formJob,filePDF,checkList} = this
            let that = this
            if (checkList.length <= 0) {
				uni.$u.toast('Your application is empty')
				return
			}
            if(!filePDF[0] || !filePDF[0].file){
                uni.$u.toast('Please upload the resume attachment')
				return
            }
            let apply_ids = checkList.map((item,i) =>{
                return item.id
            })
            let fromData = new FormData()
            if(filePDF[0] && filePDF[0].file){
                let file = filePDF[0].file 
			    fromData.append('file',file)
            }
            // fromData.append('email',formJob.email || '')
            // fromData.append('phone',formJob.phone || '')
            fromData.append('apply_ids',apply_ids)
           
            let token = ''
            uni.showLoading({ title: 'Upload...', mask: true});
            const xhr = new XMLHttpRequest()
            xhr.open('POST', config.appUrl + '/tool/chat/apply')
            xhr.setRequestHeader("user-token", token);
            xhr.send(fromData)
            xhr.onreadystatechange = function () {
                console.log(xhr)
                if (xhr.readyState === 4 && xhr.status === 200) {
					that.checkList = []
                    uni.hideLoading();
                    uni.$u.toast('Upload Successful')
                    setTimeout(() => {
						that.showSucces = true
                        that.deliverLoading = false
                        let res = JSON.parse(xhr.response)

                        uni.setStorageSync('reginfo', res.data);
                        uni.redirectTo({
                            url: '/pages/center/login_up' 
                        })
					}, 500)
                    
                }

            }
            
        },
       
		jobDelivery() {
			

			if (this.checkList.length <= 0) {
				uni.$u.toast('Your application is empty')
				return
			}
			if (!this.deliverForm.rid) {
				uni.$u.toast('Please select resume')
				return
			}
			
			let recipients = []
			let hr_email = []
			this.checkList.map(v => {
				hr_email.push(v.hr_email)
				let arr = {
					id: v.id,
					hr_email: v.hr_email
				}
				recipients.push(arr)
			});
			this.deliverForm.hr_email = hr_email
			this.deliverForm.recipients = recipients
			
			let jsonData = JSON.parse(JSON.stringify(this.deliverForm))
			jsonData.rid = jsonData.rid.split('_')[0]
			jsonData.from = uni.getStorageSync('appinfo').email;
			this.deliverLoading = true
			sendEmail(jsonData).then(res => {
				
				if(res.code == 510){
					this.deliverLoading = false
					
					
					return;
				}
				this.showSucces = true
				this.deliverLoading = false
			})
		},
		emailInputChange(v) {
			if (!v) {
				return
			}
			let reg = /^[a-zA-Z0-9]+([-_.][A-Za-zd]+)*@([a-zA-Z0-9]+[-.])+[A-Za-zd]{2,5}$/;
			if (!reg.test(v)) {
				return
			}
			if (this.deliverForm.hr_email.findIndex(o => { return o == v }) == -1) {
				this.deliverForm.hr_email.push(v)
				this.hr_email = ''
			}
		},
		closeHremail(i) {
			this.deliverForm.hr_email.splice(i, 1)
		},
		// 投递
		deliverFromSubmit(type) {
			
			return () => {
				// if (!this.deliverForm.hr_email ) {
				// 	uni.$u.toast('Please select email')
				// 	return
				// }
				if (type == 'send') {
					this.deliverLoading = true
					let recipients = []
					this.deliverForm.hr_email = map(v => {
						return v.hr_email
					});
					this.deliverForm.recipients = this.checkList;
					let jsonData = JSON.parse(JSON.stringify(this.deliverForm))
					jsonData.rid = jsonData.rid.split('_')[0]
					jsonData.from = uni.getStorageSync('appinfo').email;
					sendEmail(jsonData).then(res => {
						uni.$u.toast('Maill send Successful')
						this.$set(this.listData[this.eailmIndex], 'self_count', ((this.listData[this.eailmIndex].self_count * 1) + 1))
						this.$set(this.listData[this.eailmIndex], 'is_chat', '1')
						this.eailmIndex = ''
						this.deliverLoading = false
						this.showDeliver = false
					})
				} else if (type == 'edit') {
					let queryData = []
					this.deliverForm.hr_email.forEach(v => {
						queryData.push({
							id: this.deliverForm.id,
							permalinkid: this.deliverForm.permalinkid,
							hr_email: v
						})
					});
				}
			}
		},
		// 提交投递
		submitResume(type) {
			if (type == 'submit') {
				if (!this.isBigScreen) {
					this.showResume = false
				}
			} else if (type == 'close') {
				this.showResume = false
			}
		},
		rightClick(type) {
			if (type == 'search') {
				uni.redirectTo({
					url: '/pages/search/index-search'
				})
			}
		}
	}
}
</script>
<style lang="scss" scoped="scoped">
.tiger_cv_index {
	width: 100%;
	height: 100%;
	overflow: hidden;
	background-color: #fff;
	position: relative;

	.app_navbar {
		::v-deep .u-navbar__content__left {
			padding-left: 20px !important;
		}
	}

	.jobgr {
		height: 50px;
		position: relative;
		background-color: #fff;

		.job_ct {
			// position: fixed;
			width: 100%;
			top: 0;
			z-index: 10;
			background-color: #fff;
		}
		.top_input{
			display: flex;
			height: 35px;
			border:1px solid #eee;
			border-radius: 17px;
			padding:0 10px;
			margin:10px 10px;
			box-sizing: border-box;
			font-size:14px;
			.left_input{
				flex-shrink: 0;
			}
			.input_select{
				
				font-size:12px;
				
			}
			.uni-input{
				flex:1;
				padding:4px 10px;
			}
			.search_icon{
				margin:4px 5px
			}
		}

	}

	.job_clear {
		position: relative;
		background-color: #fff;
		height: 149px !important;
	}

	.job_ht::after {
		content: "";
		clear: both;
		display: block;
		height: 0;
	}

	.backyingyin {
		position: absolute;
		bottom: -6px;
		width: 100%;
		box-sizing: border-box;
		height: 7px;
		z-index: 8;
		left: 0;
		right: 0;
		background-size: 1px 7px;
		background-repeat: repeat-x;
		background-image: url('@/static/img/yingyin.png');
	}

	/* overflow: hidden; */
	.job_total {
		display: flex;
		padding: 0 20px;
		background-color: #fff;
		padding-bottom: 10px;

	}

	.nav_title {
		width: 550rpx;
	}

	.jobUrl {
		display: flex;
		padding: 10px 20px;
		border-top: 1px solid #f2f2f2;
		border-bottom: 1px solid #f2f2f2;
		align-items: center;

		.urls {
			width: calc(100% - 18px);
			color: #00328f;
		}

		.copyicon {
			position: relative;
			top: 3px;
		}
	}

	.posts {
		display: flex;
		padding: 5px 20px;

		.dayposts {
			flex: 1;
			text-align: center;

			.postsNum {
				font-weight: 800;
			}

			.postsName {
				font-size: 12px;
			}
		}
	}

	.emailDelivery {
		width: 85% !important;

	}

	.content_box {
		background-color: #fff;
		position: relative;

		.ad_space {
			margin-top: 10px;
			width: 100%;
			color: #828282;

			img {
				width: 100%;
				object-fit: cover;
			}
		}

	}

	.notice {
		font-weight: 900;
		position: fixed !important;
		top: 44px;
		z-index: 99;

		.card_item_text {
			font-size: 12px;
			color: #a5a4a4;
		}

		.total {
			color: #576b95;
			font-size: 18px;
			cursor: pointer;
		}
	}

	::v-deep .jbo_content {
		font-size: 14px !important;

	}

	::v-deep .jbo_content .u-read-more__toggle__icon {
		display: none;
	}

	::v-deep .jbo_content div>span,
	::v-deep .job_list_item .content .jbo_content,
	::v-deep .jbo_content div>p {
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
		margin-bottom: 0 !important;
		height: calc(100%);
		position: relative;
		.job_list_item {
			margin-top: 20rpx;
			word-wrap: break-word;
			border-bottom: 5px solid #f2f2f2;
			.job_item{
				background-color: #fff;
				padding: 20px;border-bottom: 1px solid #f2f2f2;
				margin-bottom: 10px;
			}
			.job_item_fb{
				background-color: #fff;
				padding: 0 20px;
				border-bottom: 1px solid #f2f2f2;
				margin-bottom: 10px;
			}
			.header_top{
				margin-bottom: 10px;
				display: flex;
			}
			.header_box{
				width:48px;
				height: 48px;
				border-radius: 50%;
				overflow: hidden;
				margin-right:10px;
				flex-shrink: 0;
				image{
					width:48px;
					height: 48px;
				}
			}
			.header_right{
				flex: 1;
			}
			.title {
				font-size: 16px;
				font-weight: 900;
				padding-right: 5px;
				color:#050505;
				width:100%;
			}
			.title1 {
				font-size: 16px;
				font-weight: 900;
				padding-right: 5px;
				color:#050505;
				width:100%;
				max-width: 300px;
			}
			.job_city{
				color:#8a8d91;
				font-size:12px;
				line-height:16px;
				display: flex;
				align-items: flex-end;
				span{
					margin-right:5px;
					float: left;
				}
				.earth_icon{
					width:12px;
					height: 12px;
				}
			}
			.job_info{
				border-top:1px solid #f2f2f2;
				margin-top:20px;
			}
			.job_row{
				display: flex;
				justify-content: space-between;
				color:#333;
				font-weight: bold;
				padding: 10px 0;
				height:auto;
				min-height:40px;
			}
			.job_more{
				font-weight: 600;
				padding-bottom:10px;
			}
			.jbo_content_img {
				position: relative;
				top: 10px;
				z-index: 100;
			}

			.v-badge__badge span {
				background-color: transparent !important;
				border-color: #F44336 !important;
				color: #F44336;
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

			.nopl {
				padding-left: 0;
			}

			.content {
				// padding-left: 60px;
				font-family: initial;
				position: relative;

				.content_item {
					font-size: 14px;
					color: #606266;

					.icon {
						color: #00328f;
						margin-right: 5px;
					}
				}

			}

			.grey_text {
				font-size: 14px;
			}
		}
	}

	.publisher_date {
        display: flex;
        align-items: center;
		font-size: 14px;
		color: #999;
	}
    .chat_center{
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .chat_icon{
        width:20px;
        height:20px;
        margin: 0 10px;
		flex-shrink: 0;
    }
	
	.avatar {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		margin-right: 10px;
	}
	.avatar_group{
		display: flex;
		.avatar1{
			margin-right: -5px;
			width: 20px;
			height: 20px;
			border-radius: 50%;
			border:2px solid #fff;
		}
	}
	.avatar_text {
		font-size: 14px;
		color: rgb(0, 50, 143);
		font-weight: bold;
		padding-left: 10rpx;
	}

	.job_list_two {
		height: calc(100% - 199px) !important;
	}

	.color_error {
		color: #e93636;
	}

	.groupNameCls {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-left: 9px;
	}

	.btm_form_view {
		position: fixed !important;
		bottom: 0;
		left: 0;
		width: 100%;
		z-index: 10000;


	}

	.closeIcon {
		position: absolute;
		right: 1px;
		top: 1px;
		padding: 5px;
		z-index: 99;
		color: #999 !important;
	}

	.hidShowMore {
		max-height: 170px;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 10;
		-webkit-box-orient: vertical
	}

	.clear::after {
		content: "020";
		display: block;
		height: 97px;
		clear: both;
		visibility: hidden;
	}
}

.dropdown-box {
	position: relative;
	padding: 0 20px;
	width: 100%;
	
}
.dropdown_abs {
		position: fixed;
		background: #fff;
		width: 100%;
		top: 80px;
		left:0;
		height: 100vh;
		z-index: 10;
	}
	.dropdown-tit {
		font-weight: 400;
		font-size: 14px;
		line-height: 30px;
		margin-right: 10px;
	}
.dropdown_item {
	display: flex;
	height: 40px;
	line-height: 40px;
	padding: 0 20px;
	// border-top: 1px solid rgb(242, 242, 242);
	color: #333,
}

.dropdown_active {
	background: #f8f8fa;
	color: rgb(0, 50, 143);
}

.line_feed {
	display: flex;
	align-items: center;
}

.results {
	font-size: 24rpx;
	color: #999;
	padding: 0 20px;
	margin-top: 10px;
	display: flex;
	justify-content: space-between;
	.express_icon{
		width:107px;
		height: 20px;
	}
	.reset {
		color: #00328f;
		padding-left: 10px;
	}
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
	white-space: nowrap;
	text-decoration: none;
	text-size-adjust: none;
	border: 1px solid #444950;
    color: #444950;
	border-radius: 4px;
	font-size: 24rpx;
	padding: 10rpx 20rpx;
	display: inline-block;
	font-family: Poppins, sans-serif;
	font-weight: bold;
	font-style: normal;
	line-height: 19rpx;
	width: auto;
	text-align: center;
	flex-shrink: 0;
}
.check_but_fb {
	border: 1px solid #444950;
    color: #444950;
	border-radius: 4px;
	font-size: 12px;
    line-height: 12px;
	height: 24px;
    margin: 0;
    overflow: hidden;
	flex-shrink: 0;
    padding: 5px 8px;
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
	height: calc(100%) ;
	position: fixed;
	left: 0;
	bottom: 0;
	border-top: 1px solid #eee;
	z-index: 999;
	.apply_info {

		padding: 10px 15px;

		.h {
			margin-bottom: 10px;
            font-weight: bold;
            position: relative;
            padding-left:10px;
		}
        .h::after{
            position: absolute;
            width: 4px;
            top: 2px;
            height: 15px;
            content: '';
            left: 0;
            border-radius: 10px;
            background-color: #606266;
        }
		.success_h{
			font-size: 30px;
			margin-top: 20px;
			margin-bottom:40px;
		}
		.success_text{
			border-bottom:1px solid #eee;
			margin-bottom:40px;
			padding-bottom:20px;
			.text1{
				font-size:20px;
				padding-bottom:10px;
			}
			.text2{
				font-size:16px;
				
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
					color: #90949c
				}
			}

			.right_but {
				
			}
		}
	}
}

.scroll-y {
	max-height: 90vh;
}

.but-box {
	margin-top: 60px;
	width: 100%;
	display: flex;
    flex-direction: column;
}
.but-text{
    padding:20px 0;
    font-size:10px;
    color:#999;
}
.scroll-view_H{
	width:100%;
}
.topClass {
	padding:0 10px;
	padding-bottom: 15rpx;
	display: flex;
	color: #333;
	font-size: 12px;
    flex-wrap: wrap;
	.topItem {
		margin-right:10px;
		margin-top: 5px;
		padding: 8rpx 20rpx;
		border-radius: 5px;
		border: 1px solid #eee;
		cursor: pointer;
		background: #fff;
        min-width:90px;
        text-align: center;
	}
	.top_Add{
		margin-right:10px;
		margin-top: 5px;
		padding: 0rpx 20rpx;
		line-height:23px;
		border-radius: 5px;
		border: 1px solid #eee;
		cursor: pointer;
		background: #fff;
        text-align: center;
		font-size:20px;
	}
	.top_login{
		margin-right:10px;
		margin-top: 5px;
		padding: 0rpx 20rpx;
		line-height:23px;
		border-radius: 5px;
		border: 1px solid #eee;
		cursor: pointer;
		background: #fff;
        text-align: center;
		font-size:12px;
	}
	.topItem:last-child{
		margin-right: 0 !important;
	}
	.topactive {
		color: rgb(230, 145, 56);
		border: 1px solid rgb(230, 145, 56);
		background-color: #fff;
	}
}
.asb_mask{
	position: absolute;
    z-index: 9;
    background: rgba(0,0,0,.3);
    width: 100%;
    left: 0;
    top: 0;
    bottom: 0;
}
.avatar_list{
    height:50px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom:40px;
    margin-top:10px;
    
    .avatar{
        width:40px;
        height:40px;
        border-radius: 50%;
        border:1px solid #cccccc60;
    }
    .avatar_box{
        border:5px solid #fff;
        margin-left:-23px;
        border-radius: 50%;
        background: #fff;
    }
}
.input-item{
    font-size:14px;
    color:#333;
    margin-bottom: 10px;
    padding:0 10px;
    .input-lable{
        margin: 10px 0;
    }
    
}
.label_name{
    width:120px;

}
.upload_button{
    background: rgb(230, 145, 56);
    color: #fff;
    display: inline-block;
    line-height: 2.3;
    font-size: 12px;
    padding: 0 1.34em;
    border-radius: 5px;
}
.link_url{
    color:#e69138;
    font-weight: bold;
    padding:0 5px;
    text-decoration:underline ;
}
.upload_tit{
    
    padding-top:10px;
    display: flex;
}
.job_tit{
    display: flex;
    justify-content: space-between;
}
.link_upload{
    padding:  10px;
    color: #3246D2;
    font-size: 12px;
    text-decoration:underline ;
}
.leftIcon{
    color:#00328f;
    margin: 10px 10px;
}
.top_nav{
	
	margin: 10px 10px;
	color:#00328f;
	display: flex;
	.leftIcon{
		margin: 0;
	}
	.c_title{
		flex:1;
		font-size:28rpx;
		font-weight: 500;
		text-align: center;
	}
	.right_but{
		width: 50px;
		height: 25px;
		line-height: 25px;
		background: #00328f;
		color: #fff;
		font-size: 14px;
		text-align: center;
		border-radius: 3px
	}
}
.c_scroll{
	padding: 0 10px;
	padding-bottom:150rpx;
	box-sizing: border-box;
}
.c_tit{
	display: flex;
	align-items: center;
	padding: 10px 0;s
	.h{
		font-size:14px;
		color:#333;
		font-weight: bold;
		
	}
	.left_border{
		height:15px;
		width:4px;
		background: #333;
		border-radius: 3px;
		margin-right:8px;
	}
	.span{
		color:#999;
		font-size:12px;
		padding-left:10px;
	}
}
.tag_list{
	display: flex;
	flex-wrap: wrap;
	margin-bottom:10px;
	.tag_but{
		margin-right:10px;
		margin-top:10px;
		
		uni-text{
			font-size:12px !important;
		}
	}
}
</style>