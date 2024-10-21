<template>
	<view style="background-color: #fff;position: relative;overflow: hidden;" >
		<u-toast ref="uToast" />
		
		<common :tips='commonTips' :navbar-height="navbarHeight + statusBarHeight"></common>
		<u-popup width="600" v-model="showNotice" :closeable="true" mode="center" border-radius="12">
			<view class="group-notice-title">Group Announcement</view>
			<view v-if="noticeInfo" class="group-notice-content">
				<view>
					{{noticeInfo.content}}
				</view>
				<view class="im-group-notice-imgs">
					<image v-for="(img, imgindex) in noticeInfo.images" :key="imgindex" :src="img" mode="widthFix"></image>
				</view>
				<view class="group-notice-footer">
					<text>{{noticeInfo.publisher.nickname}}<text v-if="noticeInfo.publisher.remark">({{noticeInfo.publisher.remark}})</text><text class="footer-createtime">Published on{{noticeInfo.createtime}}</text></text>
					<text class="notice-item-footer-text">{{noticeInfo.reading_number}}People have read</text>
				</view>
				<view class="group-notice-button">
					<u-button v-if="noticeInfo.receipt" :type="noticeInfo.receipted ? 'default':'primary'"  @click="receiptNotice(noticeInfo.id)">{{noticeInfo.receipted ? 'You have confirmed':'Acknowledge receipt'}}</u-button>
					<u-button v-if="!noticeInfo.receipt" type="default" @click="showNotice = false;">Close</u-button>
				</view>
			</view>
		</u-popup>
		<u-popup width="94%" border-radius="16" mode="center" :closeable="true" v-model="LinkPopupShow">
			<view class="link-popup-box">
				<view class="link-popup-title">The website you will visit is:</view>
				<view class="link-popup-url">{{linkPopupUrl}}</view>
				<view class="link-popup-tis">Please confirm whether to continue to visit and pay attention to your account and property security!</view>
				<view class="link-popup-buttons">
					<u-button :custom-style="{padding: '0 2rpx'}" class="link-popup-button-item" hover-class="none" type="primary" size="medium" plain>
						<u-link :href="linkPopupUrl"><text class="link-popup-url-button">Visit</text></u-link>
					</u-button>
					<u-button @click="LinkPopupShow = false" class="link-popup-button-item" type="default" size="medium">Cancel</u-button>
				</view>
			</view>
		</u-popup>
		<u-navbar  :background="navBackground" @leftClick="goback">
			<view class="navbar-title" slot="center">
			<!-- 	<view class="title-content">{{info.sessionUser.nickname + (info.sessionUser.user_count ? '(' + info.sessionUser.user_count + ')':'')}}</view>
				<view class="title-other" v-if="info.sessionUser.status" :class="'user-status-' + info.sessionUser.status.value">{{info.sessionUser.status.chinese}}</view> -->
			    <view class="title_content">
			    	<view class="title-jobname" >{{jobname}}</view>
			    	<view class="title-companyname">{{companyname}}</view>
			    </view>
				
			</view>
		</u-navbar>
		<view  style="margin-top: 50px ;border-bottom: 1px solid #f2f2f2;padding: 0 10px 10px 10px;display: flex; " :style="{ paddingTop: paddingTop + 'px' }">
			
			<view class="flexs" @click="goJob('1')" v-if="this.type == 'group'">
				<u-icon name="file-text" size="26" color="#00328f" style="justify-content: center;"></u-icon>
				<span class="text">Job</span>
			</view>
			<view class="flexs" @click="goJob('2')" v-if="this.type == 'group'">
				<i class="material-icons" style="color:#00328f ;">domain</i>
				<span class="text">Company</span>
			</view>
			<view class="flexs" @click="goJob('3')">
				<image class="report_icon" src="/static/icon/report_icon.png" mode="widthFix"></image>
				<span class="text">Report</span>
			</view>
		</view>
		<!-- mask 目前只用于长按消息菜单显示时 -->
		<view v-if="maskShow" @click="maskClick" :style="maskStyle" class="mask"></view>
		
		<view v-if="messageLongpressAction.length" :style="messageLongpressActionStyle" class="message-longpress-action">
			<view v-for="(item, index) in messageLongpressAction" :key="index" @click="messageLongpressActionClick(index)" class="longpress-action-item">{{item.name}}</view>
			<view class="longpress-action-pin" :style="messageLongpressActionPinStyle">
				<u-icon name="arrow-down-fill" color="#262626" size="30"></u-icon>
			</view>
		</view>
		
		<!-- 正在录音-start -->
		<view v-if="recording" class="recorder-box">
			<view class="recorder-del" id="delrecorder" :style="{opacity: delElOpacity}">
				<image class="recorder-img" src="/static/icon/del.png" mode="widthFix"></image>
				<view class="recorder-text">{{recorderText}}</view>
			</view>
			<view class="recorder">
				<view class="recorder-title">Recording</view>
				<image class="recording" src="/static/icon/recording.gif" mode="widthFix"></image>
				<view v-if="recordingCountDown !== false" class="recorder-content">Can record for {{recordingCountDown}} second</view>
			</view>
		</view>
		<!-- 正在录音-end -->
		
		<!-- 聊天记录-start -->
		<scroll-view
		@scroll="scrollWrapper"
		@scrolltoupper="wrapperScrolltoupper"
		@click="clickWrapper"
		class="wrapper"
		id="wrapper"
		:scroll-y="true"
		:scroll-with-animation="wrapperWithAnimation"
		:scroll-top="wrapperScrollTop"
		:style="{height: 'calc(100vh - ' + (writeHeight+60) + 'px)'}">
		
			<block v-if="messageList.length" v-for="(item, index) in messageList" :key="index">
				<view class="status">
					<text>{{item.datetime}}</text>
				</view>
				<block v-for="(message, m) in item.data" :key="message.id">
					<block v-if="message.type == 'system'">
						<view v-if="message.message.display_user == 'all' || message.message.display_user == userId" class="status">
							<text>{{message.message.message}}</text>
						</view>
					</block>
					<view v-else class="message-item" :class="message.sender">
						<image v-if="(info.type == 'single') || (info.chat_id == 3 && info.type == 'service')"  class="message-avatar" :src="(message.sender == 'you') ? info.sessionUser.avatar:info.user.avatar"></image>
						<image v-if="info.type == 'group'" @click="" class="message-avatar" :src="message.pushUser.avatar"></image>
						<!-- <image v-if="info.type == 'group'" @click="clickAvatar('group', message.pushUser.id)" class="message-avatar" :src="message.pushUser.avatar"></image> -->
						<view class="message-content-box">
							<view v-if="message.pushUser && message.pushUser.nickname" class="chat-record-nickname">{{message.pushUser.nickname}}</view>
							<view :id="'message-' + message.id"  class="message-content" :class="message.pushUser && message.pushUser.nickname ? '':'hide-nickname'">
								<link-message v-if="message.type == 'link'" :value="message" :LinkPopupShow.sync="LinkPopupShow" :linkPopupUrl.sync="linkPopupUrl"></link-message>
								<view v-else-if="message.type == 'video'" @click="playVideo(message)" class="video-message-box">
									<view v-show="!message.play" class="video-message-cover">
										<view class="video-message-cover-play">
											<u-icon name="play-right-fill" size="40" color="#ffffff"></u-icon>
											<view>{{message.currentTime + (message.duration ? ' / ' + message.duration:'')}}</view>
										</view>
									</view>
									<!-- #ifdef MP-WEIXIN -->
									<video @timeupdate="timeUpdate" :style="{width: message.play ? '400rpx':'1rpx'}" @fullscreenchange="fullScreenChange" :id="'video-' + message.id" :ref="'video-' + message.id" class="video-message-wx" :src="message.message" object-fit="contain" controls></video>
									<!-- #endif -->
									<!-- #ifndef MP-WEIXIN -->
									<block v-if="userPlatform == 'ios'">
										<video v-if="message.play" @timeupdate="timeUpdate" @fullscreenchange="fullScreenChange" :id="'video-' + message.id" :ref="'video-' + message.id" class="video-message" :src="message.message" object-fit="contain" controls></video>
									</block>
									<video v-else @timeupdate="timeUpdate" :style="{display: message.play ? 'block':'none'}" @fullscreenchange="fullScreenChange" :id="'video-' + message.id" :ref="'video-' + message.id" class="video-message" :src="message.message" object-fit="contain" controls></video>
									<!-- #endif -->
								</view>
								<view v-else-if="message.type == 'audio'" @click="playAudio(message, index, m)" class="audio-message">
									<u-icon :name="message.play ? 'pause':'play-right-fill'" size="36" color="#999999"></u-icon>
									<text class="audio-message-text">{{message.currentTime + (message.duration ? ' / ' + message.duration:'')}}</text>
								</view>
								<view v-else-if="message.type == 'voice'" @click="playAudio(message, index, m)" class="voice-message">
									<view v-if="message.sender == 'me'" class="voice-duration">{{message.message.duration + '" '}}</view>
									<image class="voice-message-img" :src="message.play ? ('/static/icon/' + message.sender + '-voice.gif'):('/static/icon/' + message.sender + '-voice.png')" mode="widthFix"></image>
									<view v-if="message.sender == 'you'" class="voice-duration">{{'" ' + message.message.duration}}<view v-if="!message.voice_playback" class="unread-voice">•</view></view>
								</view>
								<message v-else :value="message"></message>
							</view>
						</view>
						<view v-if="message.status" class="im-message-status" :class="message.status.statusClass">
							<image v-if="message.status.status == 1 || message.status.status == 5" :src="checkIcon1" mode="widthFix" class="status_icon"></image>
							<image v-if="message.status.status == 6" :src="checkIcon2" mode="widthFix" class="status_icon1"></image>
							<image v-if="message.status.status == 4" :src="checkIcon3" mode="widthFix" class="status_icon"></image>
							
						</view>
					</view>
				</block>
			</block>
			<block v-if="!messageList.length">
				<view class="status">
					<text>No chat record temporarily...</text>
				</view>
			</block>
		</scroll-view>
		<!-- 聊天记录-end -->
		
		<!-- 消息输入-start -->
		<view class="im-write" id="im-write" :style="{'bottom': writeBottom  + 'px'}">
			<view class="im-top" v-show="showImTop">
				<view class="im-shortcut">
					<view class="shortcut-item" @click="openResume">Send Resume</view>
					<view class="shortcut-item" @click="showReply = true">Quick Reply</view>
					<view class="shortcut-item" @click="clickMoreTool('image')" >Send Picture</view>
					<view class="shortcut-item" @click="clickMoreTool('attachment')">Send Files</view>
				</view>
			</view>
			
			<!-- @群成员-start -->
			<view v-if="showAtSelect && atUsers.length > 0 " class="at-select-box">
				<view class="at-select-users" :style="{bottom: (imWriteHeight / 2) + 'px'}">
					<view @click="hideAtUser" class="close-at-select">Close</view>
					<scroll-view scroll-y="true" class="at-select-list">
						<view @click="insertAtUser(item)" class="at-select-item" v-for="(item, index) in atUsers" :key="index">
							<image :src="item.avatar" mode="widthFix"></image>
							<text>{{item.nickname + (item.remark ? '(' + item.remark + ')':'')}}</text>
						</view>
						<view v-if="!atUsers.length" class="fastim-data-none">No more...</view>
					</scroll-view>
				</view>
			</view>
			<!-- @群成员-end -->
			
			<!-- <image class="toolbar-icon voice" @click="showVoice" :src="showVoiceBool ? '/static/icon/keyboard.png':'/static/icon/voice.png'" mode="widthFix"></image> -->
			<view class="write-textarea">
				<textarea v-if="!showVoiceBool" :disabled="messageContenteditable"  :adjust-position="false"  :show-confirm-bar="false" :fixed="true" :focus="imMessageFocusBool" confirm-type="send"
				 :auto-height="true" @keyup.ctrl.enter.exact='keyLineFeed' @keyup.enter.exact='sendButtonConfirm' @confirm="sendMessage(imMessage, 'default')"  maxlength="-1" @blur="imMessageBlur" @input="imMessageInput"
				 @focus="imMessageFocus"  v-model="imMessage" class="im-message" :class="messageContenteditable ? 'disabled':''"></textarea>
				<view v-else class="voice-input" hover-class="voice-input-hover" @touchstart="startRecorder" @touchmove="moveRecorder" @touchend="endRecorder">Hold to talk</view>
			</view>
			<view class="write-right" >
				<image class="toolbar-icon emoji" src="/static/icon/emoji.png" @click="clickMore('emoji')" mode="widthFix"></image>
				
				<image class="send-icon" src="@/static/icon/send-icon.png" @click="sendMessage(imMessage, 'default')" v-if="showSendButton"></image>
				
			</view>
		</view>
		<!-- 消息输入-end -->
		
		<view v-if="showTool" class="footer-tool">
			<!-- 表情-start -->
			<view v-if="showTool == 'emoji'">
				<view v-for="(item, index) in emoji" :key="index" class="emoji-img" hover-class="emoji-img-hover">
					<image :src="item.image" @click="selectEmoji(index)"></image>
				</view>
			</view>
			<!-- 表情-end -->
			<!-- 快捷回复-start -->
			<view v-if="showTool == 'reply'" class="reply-list">
				<view v-for="(item, index) in fastReply" :key="index" @click="sendMessage(item.content, 'default')" class="reply-item">{{item.title}}</view>
			</view>
			<!-- 快捷回复-end -->
			<!-- 更多-start -->
			<view v-if="showTool == 'more'" class="toolbar">
				<!-- <view @click="clickTool('reply')" class="toolbar-item" hover-class="toolbar-item-hover"> -->
				<view @click="showReply = true" class="toolbar-item" hover-class="toolbar-item-hover">
					<image src="/static/icon/reply.png"></image>
					<view>Quick Reply</view>
				</view>
				<view @click="clickMoreTool('image')" class="toolbar-item" hover-class="toolbar-item-hover">
					<image src="/static/icon/image.png"></image>
					<view>Send Picture</view>
				</view>
				<view @click="clickMoreTool('attachment')" class="toolbar-item" hover-class="toolbar-item-hover">
					<!-- #ifdef H5 -->
					<image src="/static/icon/attachment.png"></image>
					<view>Send Files</view>
					<!-- #endif -->
					<!-- #ifndef H5-->
					<image src="/static/icon/video.png"></image>
					<view>Send Video</view>
					<!-- #endif -->
				</view>
				
			</view>
			<!-- 更多-end -->
		</view>
		
		<u-popup :show="showReply" class="chat_message_popup" mode="center" closeOnClickOverlay @close="showReply = false">
			<view class="v_card drag_box" v-drag="'greet'" v-show="showReply">
				<u-cell-group class="reply_group">
					<u-cell :title="item.title" v-for="(item, index) in fastReply" :key="index" @click="cellSendMessage(item)"></u-cell>
				</u-cell-group>
			</view>
		</u-popup>
		<u-popup :show="showResume" class="chat_message_popup" mode="center" closeOnClickOverlay @close="showResume = false">
			<view class="v_card drag_box" v-drag="'greet'" v-show="showResume">
				<u-cell-group class="reply_group">
					<u-cell :title="item.resume_name" v-for="(item, index) in pickResume" :key="index" @click="onSelectChange(item)"></u-cell>
				</u-cell-group>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import config from "@/common/config.js";
	import {base64encode,} from '@/common/tool';
	import permision from "@/js_sdk/wa-permission/permission.js"
	import { getShortcut } from '@/api/home'
	import { getJobInfo } from '@/api/resume'
	import { getResumeList, sendEmail, fetchEetail } from '@/api/deliver'
	import { globalData } from '@/api/common.js'
	let systemInfo = uni.getSystemInfoSync();
	var recordingTime = null, recordingSecond = 0, recordingMoveY = 0, delRecorder = null, stopDelRecorder = false, recorderValid = false, cursor = 0, atUsersEd = [], defaultWriteHeight = 46
	export default {
		data() {
			return {
				hideNav: true,
				showReply: false,
				navTiter:'',
				// id: 0,
				loadRecordsData: null,
				info: {
					sessionUser: {
						nickname: '加载中...',
						status: {
							chinese: '未知',
							value: 0
						}
					}
				},
				companyname:'',
				jobname:'',
				userId: 0,
				apply_id: '',
				talent_id : '',
				resume_id : '',
				platform : '',
				type:'group',
				navBackground: {
					backgroundColor: '#F5F6F7'
				},
				emoji:[],
				navbarHeight: 0,
				writeHeight: defaultWriteHeight,
				writeBottom: 0,
				wrapperWithAnimation: true,
				wrapperScrollTop: 0,
				wrapperScrollHeight: 0,
				statusBarHeight: systemInfo.statusBarHeight,
				messageList: [],
				imMessageFocusBool: true,
				imMessageFocusCursor: 0,
				showSendButton: false,
				showTool: false,
				imMessage: '',
				messageContenteditable: false,
				sessionUserInputStatus: false,
				LinkPopupShow: false,
				linkPopupUrl: '',
				maskShow: false,
				maskStyle: '',
				messageLongpressAction: [],
				messageLongpressActionStyle: "",
				messageLongpressActionPinStyle: "",
				sendButtonType: 'send',
				userType: '',
				fastReply: [
					{ title: 'Hi', content: 'Hi' },
					{ title: 'Hello', content: 'Hello' },
				],
				uploadFormData: new Object(),
				userPlatform: '',
				showVoiceBool: false,
				recording: false,
				showNotice: false,
				noticeInfo: null,
				recordingCountDown: false,
				recorderText: '取消',
				delElOpacity: '0',
				showAtSelect: false,
				imWriteHeight: 0,
				atUsers: [],
				commonTips: '',
				paddingTop:0,
				scrollHeight: 0,
				checkIcon1:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAWRJREFUWEftlqtSw1AQhv/lHRgiESiQiDauD0GZqcFgMBgMspsZVA2iGBAIEDDhIajL6QPgeICT4SGWaS6QwklzcjeNzpnv2/9cdgk9f9QzH1uB3hJweDjSrBadCzg8OAToCcCxgB46FYjgtOND5Cg9/J0JmOCdJWCCQ+RNe8vT1hPYBF9tQ6sCRfBWBWzgrQnYwlsRKAOPBPY8d0IiJ0JYhFM1r9OcysIjAWc68EE0TsCvmtWkikQVeCzAw3cAo18oPWsOzspIVIXHAp47hoi/DqRHzcG5jUQd+M8hNEkI5D7k5cUmibrwtVtgTgJ3mtWlSaIJ+L9raE4CtyGrq6xEU3DjO5CTxEyzul4taBKe+xDlJHFDkJe//TztajYH1vRPbjMyJkH0kR0m6sILn+Kc7YgLSfp51cqtJyKjREPwwgRSy0RiBmC/qcqtE8hGvMvuwRcHn3Vjz65vdSKyEd0K9J7AN7wRANHGdbKtAAAAAElFTkSuQmCC',
				checkIcon2:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAgCAYAAACPb1E+AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjYwNUJCODUwMDVFMTFFRTlEOUNFMUQ4RDM0Qjg2NUQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjYwNUJCODYwMDVFMTFFRTlEOUNFMUQ4RDM0Qjg2NUQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2NjA1QkI4MzAwNUUxMUVFOUQ5Q0UxRDhEMzRCODY1RCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2NjA1QkI4NDAwNUUxMUVFOUQ5Q0UxRDhEMzRCODY1RCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtKcngkAAAPcSURBVHja7JhbSFRBGMdn1qUkNyLIXNFIoiLUCruoqwUbUQ/RTU1LSYgIfKgeeuttj0YPBRUhRXSh6C19CKKXLtAalZpBRGSRFSSKGnTFS2Tu9Jvdo+7qWU1X3aIO/M/MfDOH8z//me/7Zo5USok//bKJv+D6K0jax/tgYoVLiOClImVoW8iATV/KF37cwBg1+NyggFIJ2WeXUkZFHaeR7W436rxOIytAdID8AFkntyWgW049uaxUCFyluhKVzkvhK7NQdBmG9ZT7GfNcTjlBaauCSNqgVckhU7+cShlj1lBfCprt0SToV7KfolIxYBZES2nlgzngJ4QbbFFTUKnqDqO2zJxeG/6yFoJ7YL6FdgL2PtBM72V7tAi2l9cXBbUdENyHaqtpLKD9HWs1aBDC98wedYJCZnJLR8FtqOkwjU3gDHgtlfxmjyZBwlAKCu7FvoKmg7ILPMZ2RxMEnyMK5pETzNJxsADkgbmmuR4cZ+yrfoLavexRIVierZXbwPsL/ASV6qVsQ0G9Dh+CnpC0mFDuKpZK7SBaeTs8dZVToGAsBWFGbqYzmX7CjLgOaqjfpewclrulz5fHF+STJPNZIzmkquLJIIh6kvYqf6pTYjNOstAMPx3gCqgFXda7ICnjg9q7nIbr6uSEGTGbd+3mlQdo6TCjp1Q7yAXwHHwBveFIng01qVKIXprgKU6h2MQUF6NgprnDeQdOg4v+9TjCFdPpbWl0rJvXSL0wyJ4R505K7PK23pwAJ1mAECV+L5YyXfh8Wq1m6lVmwG4P2vqE3/S2e2qreahIhOwGZRlrtHIEgmkQvD6KgjMCeZhYKEWuuQbvm2HmGmM/jWlnbkWU60CCkX1yBAUXBxG8FewkjEmHXB4abTXXYKw/WAfCTLUZrMd+fLBWVBxC0WMWBFODCPbw3Gw+aJHpJNNp7wQH9dLxx0EldHg5R72Gj/kIfvwuyZihhjBrNDfOnWyf6U7qsFiDPshMo5YE5jvcyU3EGj7Adpgv1PtB3aen9Qi4Ad531rT29T/O+FFJht30OstdhRCoCh0tXwwh+ABbBrVY84P1dD7lTEPss5FNtILqLbZ7lEdRr3XYezxZ4z8tWq7R4U6ylpoHtACtThz2TNTebjqszsGnsF20IjghR9owzhTixWSoExQGeAt++Kc3sMvuNqdXp7wXkaTb3zrjmFN/nGqKJthm1BUlVuQMHVZCnz5UaYd6SV3vaK6BJ5FuWsZ0EIs3XAs/eB69CZy7cywEFhuZ5D6bUPNpeM1M0hPxz4Ex/gt6M0r/bX3D3WdB9OtEbf/k/x9W/xLJXwIMAIi584FWLuyCAAAAAElFTkSuQmCC',
				checkIcon3:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAMhJREFUWEftljEKwkAQRf9XMcQjaLSy8haewM5DeAnjXezsPEEOoZWdWW0sBUMEM5JIIPVENs1sv7y3bxkYouPDjvloLSBjjHjHS/sQtUA+wwLCcwWmrIMrDhoJtUAWIe6R2xJaiOxCh9gErIAVsAJWwApYASvgtYBEmL/JSwntQ1aDFEevAjVMIoR0yDTwapvTXvzXPRNoVSCf8kTg8fltxYnmW9QCzbWcQDJMZelVoB5DEk8pZBM47L0KNMZwQoebBm5jWBb4AphyoiEYqtzyAAAAAElFTkSuQmCC',
				pickResume:[],
				showResume:false,
				showImTop:false,
				eailmIndex: '',
				eliverTemplateContent: '',
				jobInfo:{},
			}
		},
		props:{
			initId: ''
		},
		onLoad: function (query) {
			
			// #ifdef APP-PLUS || H5
			this.navbarHeight = this.navbarHeight ? this.navbarHeight : 44;
			this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight
			this.paddingTop = this.paddingTop + this.statusBarHeight
			
			// #endif
			
			// #ifdef MP
			if (systemInfo.platform == 'ios') {
				var platformHeight = 44;
				defaultWriteHeight = 70;
			} else {
				var platformHeight = 48;
				defaultWriteHeight = 46;
			}
			this.navbarHeight = this.navbarHeight ? this.navbarHeight : platformHeight;
			this.writeHeight = defaultWriteHeight
			
			// #endif
			this.scrollHeight = uni.getSystemInfoSync().windowHeight
			this.id = query.id ? query.id : 0;
			this.apply_id = query.apply_id ? query.apply_id : 0;
			this.talent_id = query.talent_id ? query.talent_id : 0;
			this.resume_id = query.resume_id ? query.resume_id : 0;
			this.platform = query.platform ? query.platform : '';
			this.companyname = query.companyname ? query.companyname : ''
			this.jobname = query.jobname ? query.jobname : '' 
			this.jobid = query.jobid ? query.jobid : ''
			this.type = query.type ? query.type : 'group'
			this.navTiter = this.companyname + ' / ' + this.jobname
			this.ws.pageFun(this.pageDataLoad, this);
			
			if(query.type == 'group'){
				this.getDetail()
			}
			this.ws.getEmoji().then(res => {
				this.emoji = res
			}).catch(res => {
				this.$refs.uToast.show({
					title: 'Failed to load the emoticon pack. Please try again!',
					type: 'error'
				})
			})
			
			// 申请录音权限
			// #ifndef APP-PLUS || H5
			uni.authorize({
				scope: 'scope.record'
			})
			// #endif
			
			// APP检查权限
			// #ifdef APP-PLUS
			if(this.ws.userPlatform == 'android' && !this.requestAndroidPermission('android.permission.RECORD_AUDIO')) {
				that.recorderAuthModal()
			}
			// #endif
			this.getShortcut()
			if (query.hideNav) {
				this.hideNav = false
			}
		},
		onShow:function(){
			this.ws.checkNetwork(this)
			if (this.ws.collectionSelected) {
				for (let c in this.ws.collectionSelected) {
					this.sendMessage(this.ws.collectionSelected[c].message, this.ws.collectionSelected[c].type)
				}
				this.ws.collectionSelected = []
			}
			
			if (this.ws.pageRefresh.sessionInfo) {
				this.ws.pageFun(this.pageDataLoad, this);
				this.ws.pageRefresh.sessionInfo = false
			}
		},
		onReady() {
			// let systemInfo = uni.getSystemInfoSync();
			// if (systemInfo.deviceType == 'pc') {
			// 	this.isMobile = false
			// }
		},
		created() {
			this.getShortcut()
			this.getResumeList()
			this.initMessage(this.initId)
			this.ws.checkNetwork(this)
			if (this.ws.collectionSelected) {
				for (let c in this.ws.collectionSelected) {
					this.sendMessage(this.ws.collectionSelected[c].message, this.ws.collectionSelected[c].type)
				}
				this.ws.collectionSelected = []
			}
			
			if (this.ws.pageRefresh.sessionInfo) {
				this.ws.pageFun(this.pageDataLoad, this);
				this.ws.pageRefresh.sessionInfo = false
			}
		},
		onHide: function (){
			this.ws.pauseAudio('hide', this, 'session')
		},
		onUnload: function () {
			this.ws.pauseAudio('unload', this, 'session')
			window.plus &&	plus.globalEvent.removeEventListener('FileChooseResult')
		},
		mounted() {
			this.$nextTick(function(){
				const query = uni.createSelectorQuery().in(this);
				query.select('#im-write').boundingClientRect(data=>{
					this.writeHeight = data.height
				})
			})
		},
		methods: {
			rightClick(){
				
				
			},
			getDetail() {
				getJobInfo({id:this.jobid}).then(res => {
					this.jobInfo = res
				})
			},
			// 简历列表
			getResumeList() {
				
				getResumeList().then(resData => {
					
					this.pickResume = resData
				})
			},
			openResume(){
				if(this.pickResume.length > 0){
					this.showResume = true
				}else{
					uni.showModal({
						title: 'tips',
						content: "You don't have a resume yet. Would you like to upload it?",
						cancelText: 'No',
						confirmText: 'Yes',
						success(res) {
							if (res.confirm) {
								uni.navigateTo({
									url:'/pages/resume/upload'
								})
							}
						}
					})
				}
				
			},
			// 选择简历
			onSelectChange(row) {
				this.sendMessage({
					filename:row.filename,
					url: row.filepath,
					size: row.filesize,
					suffix: row.filesuffix
				}, 'file');
				this.showResume = false
				uni.$u.toast('Successfully sent')
			},
			goJob(type){
				console.log(type)
				if(type == '1'){
					uni.navigateTo({
						url:'/pages/resume/jobDetail?id=' + this.jobid
					})
				}else if (type == '2'){
					// uni.navigateTo({
					// 	url:'/pages/resume/companyDetail?id=' + this.jobid
					// })
					uni.navigateTo({
						url:'/pages/index/companyJobs?id=' + this.jobInfo.company_id
					})
				}else if (type == '3'){
					this.openUrl()
				}
			},
			openUrl(){
				let rid = base64encode( '10000' + this.resume_id)
				let url = config.hcUrl + 'index/complaint/index?rid=' + rid
				// #ifdef H5
				window.open(url)
				// #endif

				// #ifdef APP-PLUS
				plus.runtime.openURL( url, function(res) {  
                    console.log(res);  
                }); 
				// #endif

			},
			keyLineFeed(){
				this.imMessage = this.imMessage + '\n'
				this.imMessageFocusBool = true
			},
			setKeyboard(e){
				console.log(e)
				// #ifdef APP-PLUS
				uni.onKeyboardHeightChange(res => {
						this.writeBottom = res.height || e.detail.height || 0
						
						uni.offKeyboardHeightChange(() => {})
					})
				// #endif
				// #ifdef H5
				uni.onKeyboardHeightChange(res => {
						this.writeBottom = res.height || e.detail.height || 0
						
						uni.offKeyboardHeightChange(() => {})
					})
				// #endif
			},
			initMessage(id) {
				if (!id) {
					return
				}
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
				this.writeHeight = defaultWriteHeight
				// #endif
				
				this.id = id ? id : 0
				this.ws.pageFun(this.pageDataLoad, this);
				
				this.ws.getEmoji().then(res => {
					this.emoji = res
				}).catch(res => {
					this.$refs.uToast.show({
						title: 'Failed to load the emoticon pack. Please try again!',
						type: 'error'
					})
				})
				
				// 申请录音权限
				// #ifndef APP-PLUS || H5
				uni.authorize({
					scope: 'scope.record'
				})
				// #endif
				
				// APP检查权限
				// #ifdef APP-PLUS
				if(this.ws.userPlatform == 'android' && !this.requestAndroidPermission('android.permission.RECORD_AUDIO')) {
					that.recorderAuthModal()
				}
				// #endif
			},
			insertAtUser: function (item) {
				item.nickname += '  '
				atUsersEd.push({
					id: item.id,
					nickname: item.nickname
				})
				this.hideAtUser()
				
				// 找到用户输入的搜索词，删除
				// 将当前@的用户全称输入至输入框
				let atSearchIdx = -1;
				let beforeCursor = this.imMessage.substr(0, cursor)
				for (let i = (beforeCursor.length - 1); i >= 0; i--) {
					if (beforeCursor[i] == ' ' && beforeCursor[i + 1] == ' ') {
						break;
					} else if (beforeCursor[i] == '@') {
						atSearchIdx = (i + 1)
					}
				}
				let delContent = beforeCursor.substr(atSearchIdx)
				this.imMessage = this.imMessage.substring(0, atSearchIdx) + item.nickname + this.imMessage.substring(atSearchIdx + delContent.length)
				
				// 聚焦到指定字符后
				this.imMessageFocusCursor = (cursor - delContent.length) + item.nickname.length
				
				setTimeout(() => {
					this.imMessageFocusBool = true
				}, 100)
			},
			receiptNotice: function (id) {
				var that = this
				that.showNotice = false
				if (!that.noticeInfo.receipt || (that.noticeInfo.receipt && that.noticeInfo.receipted)) {
					return false;
				}
				that.ws.pageFun(function() {
					that.ws.send({
						c: 'Message',
						a: 'receiptGroupChatNotice',
						data: {
							'id': id,
							'session_id': that.id
						}
					});
				}, that);
			},
			recorderAuthModal: function () {
				uni.showModal({
					title: 'reminder',
					content: 'No recording permission, unable to send voice~',
					cancelText: 'close',
					confirmText: 'De authorization',
					success(res) {
						if (res.confirm) {
							permision.gotoAppPermissionSetting()
						}
					}
				})
			},
			async requestAndroidPermission(permisionID) {
				var result = await permision.requestAndroidPermission(permisionID)
				if (result == 1) {
					return true;
				} else {
					return false;
				}
			},
			startRecorder: function (e) {
				if (this.recording) {
					return false;
				}
				var that = this, lastErrTime = 0;
				that.recording = true
				
				recordingMoveY = e.changedTouches[0].clientY
				delRecorder = uni.createSelectorQuery().select('#delrecorder');
				recordingSecond = 0
				stopDelRecorder = false
				recorderValid = false
				if (recordingTime) {
					clearInterval(recordingTime)
				}
				
				// 计时
				setTimeout(() => {
					recorderValid = true
				}, 500)
				recordingTime = setInterval(() => {
					if (!that.recording) {
						that.recordingCountDown = false
						clearInterval(recordingTime)
						return false;
					}
					recordingSecond++
					if (recordingSecond >= 50) {
						that.recordingCountDown = (60 - recordingSecond)
					}
				}, 1000);
				
				this.ws.recorder.start({
					format: 'wav',
					duration: 60000
				});
				
				this.ws.recorder.onStop(res => {
					// 上传wav文件，发送wav文件
					that.recording = false
					that.delElOpacity = '0'
					if (!recorderValid || !res.tempFilePath) {
						that.$refs.uToast.show({
							title: 'Recording time is too short!',
							type: 'info'
						})
						return false;
					}
					if (stopDelRecorder) {
						that.$refs.uToast.show({
							title: 'Sending voice canceled~',
							type: 'info'
						})
						return false;
					}
					let uploadFileCallBack = function (res, file) {
						that.sendMessage({
							url: res.data.fullurl,
							duration: (recordingSecond == 0) ? 1:recordingSecond
						}, 'voice');
					}
					that.upload({path: res.tempFilePath}, uploadFileCallBack);
				})
				this.ws.recorder.onError(res => {
					that.recording = false
					that.delElOpacity = '0'
					let ctime = new Date().getTime()
					if (ctime - lastErrTime < 600) {
						return false;
					}
					lastErrTime = new Date().getTime()
					
					if (this.ws.userPlatform == 'ios' && !permision.judgeIosPermission("record")) {
						that.recorderAuthModal()
						return false;
					}
					
					uni.showModal({
						title: 'Recording error',
						content: res.errMsg ? res.errMsg:'unknown error',
						showCancel: false,
						success: () => {
							// #ifdef MP
							if (res.errMsg == 'operateRecorder:fail auth deny') {
								uni.openSetting({
									complete() {}
								});
							}
							// #endif
						}
					})
				})
			},
			endRecorder: function (e) {
				var that = this,touche = e.changedTouches[0]
				if (!that.recording) {
					return false;
				}
				
				delRecorder.fields({
					rect: true
				}, data => {
					if (data && touche.clientY >= data.top && touche.clientY <= data.bottom && touche.clientX >= data.left && touche.clientX <= data.right) {
						stopDelRecorder = true
					}
					that.ws.recorder.stop();
				}).exec();
				
				that.recording = false
				that.delElOpacity = '0'
			},
			moveRecorder: function (e) {
				var that = this, touche = e.changedTouches[0]
				let delElOpacity = parseInt((recordingMoveY - e.changedTouches[0].clientY) / 20)
				if (delElOpacity > 1) {
					delElOpacity = (delElOpacity < 10) ? '0.' + delElOpacity:'1'
					if (this.delElOpacity != delElOpacity) {
						this.delElOpacity = delElOpacity
						delRecorder.fields({
							rect: true
						}, data => {
							if (data && touche.clientY >= data.top && touche.clientY <= data.bottom && touche.clientX >= data.left && touche.clientX <= data.right) {
								that.recorderText = 'Release Cancel'
							} else {
								that.recorderText = 'Cancel'
							}
						}).exec();
					}
				}
			},
			timeUpdate: function (e) {
				this.ws.playVideoItem.duration = this.ws.sToHs(Math.floor(e.detail.duration))
				this.ws.playVideoItem.currentTime = this.ws.sToHs(Math.floor(e.detail.currentTime))
			},
			fullScreenChange: function (e) {
				if (!e.detail.fullScreen) {
					var videoContext = uni.createVideoContext('video-' + this.ws.playVideoItem.id, this)
					videoContext.pause()
					this.ws.playVideoItem.play = false
				}
			},
			playVideo: function(item){
				this.ws.playVideo(item, this, 'session')
			},
			playAudio: function(item, index, m) {
				if (item.type == 'voice' && !item.voice_playback && item.sender == 'you') {
					this.messageList[index].data[m].voice_playback = true
					this.ws.pageFun(res => {
						this.ws.send({c: 'User', a: 'changeVoiceStatus', data: {'id': this.messageList[index].data[m].id}});
					}, this)
				}
				this.ws.playAudio(item, index, m, this)
			},
			sendButtonConfirm: function () {
				if (this.sendButtonType == 'send') {
					this.sendMessage(this.imMessage, 'default')
				}
			},
		   sendMessage: function (message, type = 'default') {
				var that = this
				if (!message) {
					that.$refs.uToast.show({
						title: 'Please enter the message content~',
						type: 'error'
					})
					return false;
				}
				if (that.messageContenteditable) {
					that.$refs.uToast.show({
						title: 'The administrator has prohibited speaking!',
						type: 'error'
					})
					return false;
				}
				
				if (type == 'default') {
					// 处理表情
					var reg = /\[(.+?)\]/g; // [] 中括号
					var regMatch = message.match(reg);
					if (regMatch) {
						for (let i in regMatch) {
							var emojiItem = that.findEmoji(regMatch[i]);
							message = message.replace(emojiItem.code, '<img draggable="false" class="emoji" title="' + emojiItem.name + '" src="' + emojiItem.image + '" />');
						}
					}
				}
				
				for (let u in atUsersEd) {
					atUsersEd[u].nickname = atUsersEd[u].nickname.substring(0, atUsersEd[u].nickname.length - 1);
				}
				
				var messageId = new Date().getTime() + that.info.id + Math.floor(Math.random() * 10000); // 临时消息ID
				that.ws.pageFun(function(){
					that.ws.send({
						c: 'Message',
						a: 'sendMessage',
						data: {
							message: message,
							type: type,
							platform: that.platform ? that.platform : "default" ,
							session_id: that.info.id,
							apply_id: that.apply_id,
							talent_id: that.talent_id,
							resume_id: that.resume_id,
							tokens: that.ws.initializeData ? that.ws.initializeData.tokens : false, // 发消息时检测用户登录态是否过期
							message_id: messageId,
							identity: that.ws.initializeData.userinfo.identity,
							at_users: (that.info.type == 'group') ? atUsersEd:[]
						}
					})
				}, that)
				atUsersEd = []
				
				let messageObj = {
					id: messageId,
					message: message,
					pushUser: {
						avatar: that.ws.imgUrl(that.ws.initializeData.userinfo.avatar),
						id: that.ws.initializeData.userinfo.id
					},
					read_number: 0,
					sender: 'me',
					type: type,
					status: {
						status: '',
						statusClass: ''
					}
				}
				that.imMessage = ''
				that.imMessageChange()
				let messageListIndex = that.messageList.length - 1
				if (that.messageList[messageListIndex]) {
					that.messageList[messageListIndex].data.push(that.ws.buildMessage(messageObj));
				} else {
					that.messageList = that.messageList.concat({
						datetime: 'just',
						data: [that.ws.buildMessage(messageObj)]
					});
				}
				
				that.ws.messageShow.push(function(mThat) {
					that.ws.imSession({
						sessionInfo: {
							id: that.info.id,
							top: that.info.top
						},
						lastMessage: {
							last_time: that.getHoursMinutes(),
							last_message: that.ws.formatMessage(messageObj)
						},
						unreadMessagesNumber: 0
					}, mThat)
				});
				that.inputStatus(false)
				that.scrollIntoFooter(300, 99992)
			},
			findEmoji: function(emojiCode) {
				for (let i in this.emoji) {
					if (this.emoji[i].code == emojiCode) {
						return this.emoji[i];
					}
				}
				return false;
			},
			maskClick: function () {
				this.maskShow = false
				this.hideAtUser()
				this.messageLongpressAction = []
			},
			messageLongpressActionClick: function (index) {
				var that = this, messageId = that.messageLongpressAction[index].id, action = that.messageLongpressAction[index].action
				if (action == 'forward') {
					// 转发
					that.maskClick()
					uni.navigateTo({
						url: '/pages/pick-user/pick-user?action=message-forward&forward_type=message&message_id=' + messageId + '&sessionId=' + that.id
					})
				} else {
					that.ws.pageFun(() => {
						that.ws.send({
							c: 'Message',
							a: 'messageOperation',
							data: {
								id: messageId,
								action: 'message-' + action,
								source: 'uni-app'
							}
						});
					}, that)
				}
			},
			longpressMessage: function(e) {
				var that= this, action = []
				let message = uni.createSelectorQuery().select('#message-' + e.id);
				message.fields({
					rect: true,
					size: true
				}, data => {
					// 各种消息类型一个一个设置，确保菜单顺序
					if (e.type == 'default') {
						action = [
							{id: e.id, name: '复制', action: 'copy'},
							{id: e.id, name: '转发', action: 'forward'},
							{id: e.id, name: '收藏', action: 'collection'},
							{id: e.id, name: '待办', action: 'to-do'}
						]
					} else if (e.type == 'file' || e.type == 'link') {
						action = [
							{id: e.id, name: '复制', action: 'copy'},
							{id: e.id, name: '转发', action: 'forward'},
							{id: e.id, name: '收藏', action: 'collection'},
							{id: e.id, name: '删除', action: 'delete'}
						]
					} else {
						action = [
							{id: e.id, name: '转发', action: 'forward'},
							{id: e.id, name: '收藏', action: 'collection'}
						]
					}
					
					if (that.info.type == 'single') {
						action.push({id: e.id, name: '删除', action: 'delete'})
					}
					
					if (e.sender == 'me') {
						let actionWidth = action.length * 40, missWidth = (actionWidth - data.width) + 20, left = (missWidth > 0) ? (data.left - missWidth):data.left
						that.messageLongpressActionStyle = 'top: ' + (data.top - 46) + 'px;left: ' + left + 'px';
					} else {
						that.messageLongpressActionStyle = 'top: ' + (data.top - 46) + 'px;left: ' + data.left + 'px';
					}
					that.maskShow = true
					that.messageLongpressAction = action
					that.messageLongpressActionPinStyle = 'top: ' + (data.top - 16) + 'px;left: ' + (data.left + 6) + 'px';
				}).exec()
			},
			getHoursMinutes: function() {
				var dateObj = new Date();
				var hours = dateObj.getHours();
				hours = hours < 10 ? '0' + hours : hours;
				var minutes = dateObj.getMinutes();
				minutes = minutes < 10 ? '0' + minutes : minutes;
				return hours + ':' + minutes;
			},
			selectEmoji: function(idx) {
				if (this.messageContenteditable) {
					this.$refs.uToast.show({
						title: 'The administrator has prohibited speaking!',
						type: 'error'
					})
					return false;
				}
				this.imMessage += this.emoji[idx].code
				this.imMessageChange();
				this.imMessageFocusBool = true
			},
			sessionMenu: function () {
				uni.navigateTo({
					url: '/pages/session-info/chat-setting?id=' + this.id
				})
			},
			clickAvatar: function (type, id) {
				if (type == 'single') {
					uni.navigateTo({
						url: '/pages/center/info?id=' + (id == 'you' ? this.info.sessionUser.id:this.info.user.id)
					})
				} else if (type == 'group') {
					uni.navigateTo({
						url: '/pages/center/info?id=' + id
					})
				} else if (type == 'service') {
					uni.navigateTo({
						url: '/pages/center/info?id=' + (id == 'you' ? this.info.chat_id:this.info.user.id) + (id == 'you' ? '&type=service':'')
					})
				}
			},
			pageDataLoad: function () {
				var that = this
				let message = {
					c: 'User',
					a: 'loadSession',
					data: {
						'session_id': that.id,
						'page': 1,
						'apply_id': that.apply_id,
						'talent_id': that.talent_id,
						'resume_id': that.resume_id
					}
				}
				that.ws.send(message);
				that.userType = that.ws.initializeData.userinfo.type
				// that.fastReply = that.ws.initializeData.config.fast_reply
				that.userPlatform = that.ws.userPlatform
			},
			scrollWrapper: function() {
				this.maskShow && this.maskClick()
			},
			wrapperScrolltoupper: function () {
				if (!this.loadRecordsData) {
					return ;
				}
				var that = this
				that.loadRecordsData.page++;
				that.wrapperWithAnimation = false
				let wrapper = uni.createSelectorQuery().select('#wrapper');
				wrapper.fields({
					scrollOffset: true
				}, data => {
					that.wrapperScrollHeight = data.scrollHeight
				}).exec()
				
				that.ws.pageFun(function(){
					that.ws.send({ c: 'User', a: 'loadSession', data: that.loadRecordsData });
					that.loadRecordsData = null
				}, that)
			},
			clickWrapper: function () {
				this.clickTool(false)
				this.imMessageBlur()
			},
			showVoice: function () {
				// #ifdef H5
				uni.showModal({
					title: 'Tips',
					content: 'If you want to use the voice record,please download the TigerCV app to Play Stores',
					showCancel: false
				})
				return false;
				// #endif
				this.showVoiceBool = !this.showVoiceBool
			},
			clickTool: function (value) {
				
				if (!value || (value == this.showTool)) {
					this.showTool = false;
					this.writeBottom = 0;
					this.writeHeight = defaultWriteHeight;
				} else {
					this.showTool = value;
					this.writeBottom = 170;
					this.writeHeight = 216;
					this.showVoiceBool = false;
					this.scrollIntoFooter();
				}
			},
			clickMore(type){ //
				if(this.showTool == type){
					this.writeBottom = 0;
					this.showVoiceBool = false;
					this.showTool = false;
					this.writeHeight = defaultWriteHeight;
					this.scrollIntoFooter();
					return
				}
				if(type == 'emoji'){
					this.showTool = 'emoji';
					this.writeBottom = 170;
					this.writeHeight = 216;
					this.showVoiceBool = false;
					this.scrollIntoFooter();
					return;
				}else if(type == 'more'){
					this.showTool = 'more';
					this.writeBottom = 170;
					this.writeHeight = 216;
					this.showVoiceBool = false;
					this.scrollIntoFooter();
					return;
				}
			},
			clickMoreTool: function (name) {
				var that = this
				if (name == 'image') {
					that.ws.pageFun(() => {
						that.ws.send({
							c: 'ImBase',
							a: 'getUploadMultipart'
						});
					}, that)
					uni.chooseImage({
					    count: 1,
					    sizeType: ['original', 'compressed'],
					    sourceType: ['album', 'camera'],
					    success: function (res) {
							that.upload(res.tempFiles[0], function (res, file) {
								that.sendMessage(res.data.fullurl, 'image');
							});
						},
						fail: () => {}
					});
				} else if (name == 'attachment') {
					that.ws.pageFun(() => {
						that.ws.send({
							c: 'ImBase',
							a: 'getUploadMultipart'
						});
					}, that)
					var uploadFileCallBack = function (res, file) {
						let fileName = res.data.url.split('.');
						let fileSuffix = fileName[fileName.length - 1];
						let imgSuffix = ['png', 'jpg', 'gif', 'jpeg', 'bmp'];
						let audioSuffix = ['mp3', 'mpeg', 'wav', 'acc'];
						let videoSuffix = ['mp4', 'ogg', 'webm'];
						
						if (imgSuffix.includes(fileSuffix)) {
							that.sendMessage(res.data.fullurl, 'image');
						} else if (audioSuffix.includes(fileSuffix)) {
							that.sendMessage(res.data.fullurl, 'audio');
						} else if (videoSuffix.includes(fileSuffix)) {
							that.sendMessage(res.data.fullurl, 'video');
						} else {
							let fileSize = file.size ? (file.size / 1024).toFixed(2):0
							if (fileSize > 0) {
								fileSize = fileSize > 1024 ? (fileSize / 1024).toFixed(2) + 'Mb' : fileSize + 'Kb'
							}
							that.sendMessage({
								url: res.data.fullurl,
								size: fileSize,
								suffix: fileSuffix
							}, 'file');
						}
					}
					
					// #ifdef H5
					uni.chooseFile({
						count: 1,
						success (res) {
							that.upload(res.tempFiles[0], uploadFileCallBack);
						},
						fail: () => {}
					})
					// #endif
					
					// #ifndef H5
					// uni.chooseVideo({
					// 	count: 1,
					// 	sourceType: ['camera', 'album'],
					// 	success: function (res) {
					// 		let path = {
					// 			path: res.tempFilePath,
					// 			size: res.size ? res.size:0
					// 		}
					// 		that.upload(path, uploadFileCallBack);
					// 	},
					// 	fail() {}
					// });
					// #endif

					// #ifndef App
					let systemInfo = uni.getSystemInfoSync()
					if(systemInfo.uniPlatform == 'app'){
						if(systemInfo.platform == 'android'){
							let chooseFileModule = uni.requireNativePlugin("Rc-ChosseFile_ChooseFileModule");
							chooseFileModule.openFileBrowse();

							plus.globalEvent.addEventListener('FileChooseResult', (e) => {
								var filePath = 'file://' + e.filePath
								uni.showModal({
									title: 'Tips',
									content: JSON.stringify(e),
									showCancel:false,
									confirmText:'Ok',
									success: function (res) {
										if (res.confirm) {
											console.log('用户点击确定');
										}
									}
								});
								let path = {
										path: filePath,
										size: e.fileSize
									}
								that.upload(path, uploadFileCallBack);
							});
						}else{
							plus.gallery.pick( function(res){
								console.log(res)
								let path = {
									path: res,
									size: 0
								}
								that.upload(path, uploadFileCallBack);
							}, function ( e ) {
								console.log( "取消选择图片" );
							}, {filter:"all"} ); 
						}
							
					}
					
					// #endif
				} else if (name == 'collection') {
					uni.navigateTo({
						url: '/pages/center/collection?action=send'
					})
				}
			},
			upload: function (path, callBack) {
				var that = this
				uni.showLoading({
					title: 'Uploading...'
				})
				
				const uploadTask = uni.uploadFile({
					url: that.ws.buildUrl('upload', that.ws.initializeData.tokens.im_tourists_token),
					// #ifdef APP-PLUS || H5
					file: path,
					// #endif
					filePath: path.path,
					name: 'file',
					formData: that.uploadFormData,
					success: (uploadFileRes) => {
						uni.hideLoading()
						let res = JSON.parse(uploadFileRes.data);
						if (res.code == 1) {
							callBack(res, path)
						} else {
							uni.showModal({
								title: 'reminder',
								content: res.msg,
								showCancel: false
							})
						}
					},
					fail: res => {
						uni.hideLoading()
						uni.showModal({
							title: 'reminder',
							content: 'Upload failed, please try again~',
							showCancel: false
						})
					},
					complete: res => {
						uni.hideLoading()
					}
				});
				
				// #ifndef APP-PLUS
				uploadTask.onProgressUpdate((res) => {
					uni.showLoading({
						title: res.progress + '%'
					})
				});
				// #endif
			},
			imMessageBlur() {
				this.imMessageFocusBool = false
				setTimeout(() => {
				if (!this.showTool) {
					uni.hideKeyboard();
						this.writeBottom = 0;
					this.writeHeight = defaultWriteHeight;
				}else{
						this.writeBottom = 170;
				}
			}, 100)
				
				this.inputStatus(false)
			},
			imMessageFocus(e) {
				// this.clickTool(false)
				this.showImTop = true
				let writeHeight = () => {
					this.writeBottom = e.detail.height || 0
					this.writeHeight = (parseInt(this.writeBottom) + defaultWriteHeight);
				}

				if (this.ws.userPlatform == 'ios') {
					// #ifdef APP-PLUS
					uni.onKeyboardHeightChange(res => {
						this.writeBottom = res.height || e.detail.height || 0
						this.writeHeight = (parseInt(this.writeBottom) + defaultWriteHeight);
						uni.offKeyboardHeightChange(() => {})
					})
					// #endif

					// #ifndef APP-PLUS
					writeHeight()
					// #endif
				} else {
					// writeHeight()
					// #ifdef APP-PLUS
					uni.onKeyboardHeightChange(res => {
						this.writeBottom =  res.height || e.detail.height || 0
						
						this.writeHeight = (parseInt(this.writeBottom) + defaultWriteHeight);
						uni.offKeyboardHeightChange(() => {})
					})
					// #endif
					// #ifdef H5
					this.writeBottom =  75
					this.writeHeight =  defaultWriteHeight;
					// #endif
				}

				this.scrollIntoFooter(0, 99993)
			},
			imMessageInput: function (e) {
				cursor = e.detail.cursor || e.detail.value.length
				// 从光标位置向前搜索@和空格符号
				let atSearchIdx = -1;
				let beforeCursor = e.detail.value.substr(0, cursor)
				for (let i = (beforeCursor.length - 1); i >= 0; i--) {
					if (beforeCursor[i] == ' ' && beforeCursor[i + 1] == ' ') {
						break;
					} else if (beforeCursor[i] == '@') {
						atSearchIdx = i
					}
				}
				if(atSearchIdx !== -1) {
					this.atUser(beforeCursor.substr(atSearchIdx + 1));
				} else if (this.showAtSelect) {
					this.hideAtUser()
				}
				
				this.imMessage = e.detail.value;
				this.imMessageChange()
				this.inputStatus()
			},
			atUser: function (keywords = '') {
				var that = this
				that.showAtSelect = true
				that.maskShow = true
				that.maskStyle = 'background:rgba(0, 0, 0, 0.1)';
				
				// 获得输入框高度
				let imWrite = uni.createSelectorQuery().select('.im-write');
				imWrite.fields({
					size: true
				}, data => {
					that.imWriteHeight = data.height
				}).exec()
				
				that.ws.pageFun(function(){
					that.ws.send({
						c: 'Message',
						a: 'groupChatAt',
						data: {
							'session_id': that.id,
							'method': 'get-all',
							'keywords': keywords
						}
					});
				}, that)
			},
			hideAtUser: function () {
				this.maskShow = false
				this.maskStyle = ''
				this.showAtSelect = false
			},
			// 显示/隐藏发送按钮-调整消息记录框高度
			imMessageChange: function() {
				var that = this
				that.showSendButton = (that.imMessage == '') ? false : true;
			},
			inputStatus: function (type = true) {
				var that = this
				if (that.info.type == 'single' && parseInt(this.ws.initializeData.config.user_config.input_status) == 1) {
					if (type && !that.inputStatusNotice) {
						var message = {
							c: 'Message',
							a: 'inputStatusNotice',
							data: {
								'session_id': that.info.id
							}
						};
						that.inputStatusNotice = true
					} else if (!type && that.inputStatusNotice) {
						var message = {
							c: 'Message',
							a: 'inputStatusNotice',
							data: {
								'end_input_session_id': that.info.id
							}
						}
						that.inputStatusNotice= false
					}
					that.ws.pageFun(function(){
						that.ws.send(message);
					}, that)
				}
			},
			scrollIntoFooter: function (timeout = 0, scrollTop = 0) {
				var that = this
				if (scrollTop) {
					setTimeout(function() {
						that.wrapperScrollTop = (that.wrapperScrollTop >= 99990) ? that.wrapperScrollTop + 200 : scrollTop
					}, timeout)
					return;
				}
				let messageScroll = uni.createSelectorQuery().select('#wrapper');
				messageScroll.fields({
					scrollOffset: true
				}, data => {
					setTimeout(function() {
						that.wrapperScrollTop = data.scrollHeight
					}, timeout)
				}).exec()
			},
			getShortcut() {
				getShortcut().then(res => {
					if(res.length>0){
						this.fastReply = res.shortcut.split('\n').map(o => {
							return {
								title: o,
								content: o
							}
						})
					}
				})
			},
			goback(params) {
				if(this.platform== 'link'){
					 uni.switchTab({
						url:'/pages/message/message'
					})
				}else{
					const pages = getCurrentPages()
					if (pages.length === 1) {
						if (typeof params === 'number') {
							history.go(-params)
						} else {
							history.back()
						}
					} else {
						uni.navigateBack()
					}
				}
                this.ws.pageRefresh.message = true
				
            },
			cellSendMessage(item) {
				this.showReply = false
				this.sendMessage(item.content, 'default')
			}
		}
	}
</script>

<style lang="scss">
@font-face {
		font-family: 'Material Icons';
		font-style: normal;
		font-weight: 400;
		src: url(@/static/MaterialIcons/MaterialIcons-Regular.eot);
		/* For IE6-8 */
		src: local('Material Icons'),
			local('MaterialIcons-Regular'),
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
.navbar-title{
	display: flex;
	justify-content: center;
	width: 80%;
}
.title_content{
	text-align: center;
    width: 90%;
}
.title-jobname{
	width: 100%;
	font-size: 36rpx;
	padding-top: 6rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space:nowrap;
}
.title-companyname{
	width: 100%;
	position: relative;
	top: -4rpx;
	font-size: 24rpx;
	color: #999;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space:nowrap;
}
.menu-wrap {
	display: flex;
	align-items: center;
	padding: 12rpx;
	border-radius: 50%;
	margin-right: 20rpx;
	margin-top: -10rpx;
}
.navbar-title {
   
}
.navbar-title .title-other {
	font-size: 22rpx;
	margin-left: 10rpx;
}
.title-content {
	display: block;
	overflow: hidden;
	text-overflow:ellipsis;
	white-space: nowrap;
	max-width: 300rpx;
}
.wrapper {
	position: relative;
	overflow: hidden;
	box-sizing: border-box;
	padding-bottom: 80px;
}
.wrapper .status {
	display: block;
	width: 100%;
	align-items: center;
	justify-content: center;
	padding: 32rpx 20rpx;
	text-align: center;
}

.wrapper .status text {
	font-size: 24rpx;
	display: inline-block;
	background: #ccc;
	color: #fff;
	border-radius: 10rpx;
	padding: 6rpx 20rpx;
	line-height: 28rpx;
}
.message-item .message-avatar {
	width: 80rpx;
	height: 80rpx;
	min-width: 80rpx;
	min-height: 80rpx;
	border-radius: 50%;
}
.wrapper .message-item {
	display: flex;
	padding: 10px;
	flex: 1;
	align-items: flex-start;
}
.wrapper .message-item.me {
	flex-direction: row-reverse;
	display: flex;
}
.chat-record-nickname {
    color: $--gray;
    font-size: 24rpx;
    padding: 4rpx 0;
}
.you .chat-record-nickname {
    text-align: left;
}
.me .chat-record-nickname {
    text-align: right;
}
.video-message-box {
	position: relative;
	min-height: 400rpx;
	min-width: 400rpx;
	overflow: hidden;
}
.video-message {
	width: 400rpx;
	height: 400rpx;
}
.video-message-wx {
	width: 400rpx;
	height: 400rpx;
	position: absolute;
}
.video-message-cover {
	height: 400rpx;
	width: 400rpx;
	background: $--black;
	color: $--white;
	display: flex;
	align-items: center;
	justify-content: center;
}
.video-message-cover-play {
	text-align: center;
	font-size: 30rpx;
}
.voice-duration {
	font-size: 28rpx;
}
.unread-voice {
	position: absolute;
	top: 35rpx;
	right: 8rpx;
	font-size: 28rpx;
	color: $--red;
}
.voice-message {
	display: flex;
}
.voice-message-img {
	width: 40rpx;
	height: 40rpx;
}
.audio-message {
	display: flex;
	align-items: center;
	font-size: 30rpx;
	color: $--gray;
}
.audio-message-text {
	padding-left: 20rpx;
}
.message-content-box {
	position: relative;
	max-width: 66%;
	margin: 0 20rpx;
}
.wrapper .message-content {
	padding: 26rpx;
	font-size: 32rpx;
	display: block;
	vertical-align: top;
	border-radius: 10rpx;
	word-wrap: break-word;
	word-break: break-word;
}
.wrapper .message-item.me .message-content {
	color: $--white;
	background-color: #00b0ff;
}
.wrapper .message-item.you .message-content {
	color: #181818;
	background-color: #F3F3F3;
}
.wrapper .message-item .message-content:before {
	position: absolute;
	top: 48rpx;
	display: block;
	width: 16rpx;
	height: 12rpx;
	content: '\00a0';
	-webkit-transform: rotate(29deg) skew(-35deg);
	transform: rotate(29deg) skew(-35deg);
}
.message-content.hide-nickname:before {
	top: 30rpx !important;
}
.wrapper .message-item.you .message-content:before {
	left: -6rpx;
	background-color: #fff;
}

.wrapper .message-item.me .message-content:before {
	right: -6rpx;
	background-color: #00b0ff;
}
.wrapper .message-item.me .file-name {
    color: $--white;
}
.wrapper .message-item.me .file-size {
    color: $--grey;
}
.im-message-status {
	// min-width: 62rpx;
	align-self: flex-end;
    font-size: 12px;
    color: $--gray;
}
.at-select-box {
	position: relative;
}
.at-select-users {
	position: absolute;
	background: #FFFFFF;
	width: 100vw;
	box-sizing: border-box;
	border-top-left-radius: 16rpx;
	border-top-right-radius: 16rpx;
	z-index: 9992;
}
.close-at-select {
	font-size: 26rpx;
	float: right;
	color: #999999;
	padding: 20rpx;
}
.at-select-list {
	clear: both;
	max-height: 700rpx;
}
.fastim-data-none {
	text-align: center;
	font-size: 30rpx;
	line-height: 80rpx;
	height: 80rpx;
	color: #999999;
}
.at-select-item {
	display: flex;
	align-items: center;
	height: 90rpx;
	padding-left: 20rpx;
}
.at-select-item image {
	height: 60rpx;
	width: 60rpx;
	border-radius: 16rpx;
}
.at-select-item text {
	padding-left: 10rpx;
}
.im-write {
	background-color: #f7f7f7;
	box-shadow: 0 -2rpx 0 #e5e5e5;
	width: 100%;
	left: 0;
	padding: 8rpx 0;
	display: flex;
	align-items: center;
	position: fixed;
	bottom: 0;
	box-sizing: border-box;
	z-index: 9993;
}
.write-textarea {
	flex: 1;
	background-color: $--white;
	margin-left:10px;
}
.voice-input {
	height: 76rpx;
	border-radius: 8rpx;
	padding: 18rpx;
	line-height: 40rpx;
	font-size: 30rpx;
	color: #181818;
	text-align: center;
}
.voice-input-hover {
	background: #EBEBEB;
}
.recorder-box {
	position: fixed;
	z-index: 9999;
	bottom: 410rpx;
	left: calc(25% - 110rpx);
}
.recorder-del {
	
}
.recorder-img {
	display: block;
	width: 90rpx;
	height: 90rpx;
	margin: 0 auto;
}
.recorder-text {
	padding-top: 10rpx;
	font-size: 28rpx;
	color: #EC3A4E;
	text-align: center;
}
.recorder {
	position: fixed;
	bottom: 380rpx;
	width: 220rpx;
	left: calc(50% - 110rpx);
	background: rgba(0, 0, 0, 0.2);
	border-radius: 20rpx;
}
.recorder-title {
	color: #fff;
	width: 100%;
	text-align: center;
	padding: 30rpx;
	padding-bottom: 0;
	font-weight: bold;
}
.recording {
	display: block;
	width: 120rpx;
	height: auto;
	margin: 0 auto;
}
.recorder-content {
	font-size: 26rpx;
	text-align: center;
	color: $--white;
	padding-bottom: 20rpx;
	margin-top: -6rpx;
}
.im-message {
	overflow-y: auto;
	width: calc(100% - 36rpx);
	max-height: 356rpx ;
	outline: none;
	border: none;
	resize: none;
	border-radius: 8rpx;
	padding: 18rpx;
	-webkit-user-select: text !important;
	-moz-user-select: text !important;
	-ms-user-select: text !important;
	user-select: text !important;
	line-height: 40rpx;
	font-size: 32rpx;
	color: #181818;
}
.im-message.disabled {
	background-color: $--bg-color;
	color: $--gray;
	font-size: 28rpx;
	text-align: center;
}
.im-message::-webkit-scrollbar {
	width: 4rpx;
}
.im-message::-webkit-scrollbar-track {
	background-color: $--white;
	-webkit-border-radius: 2em;
	-moz-border-radius: 2em;
	border-radius: 2em;
}
.im-message::-webkit-scrollbar-thumb {
	background-color: #e6e6e6;
	-webkit-border-radius: 2em;
	-moz-border-radius: 2em;
	border-radius: 2em;
}
.write-right {
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	padding-right: 12rpx;
}
.im-write .toolbar-icon {
	display: inline-block;
	cursor: pointer;
	vertical-align: middle;
	width: 56rpx;
	height: 56rpx;
	content: '';
	margin-left: 16rpx;
}
.toolbar-icon.voice {
	margin: 0 12rpx;
}

.send-icon{
	margin-left: 24rpx;
	width:60rpx;
	height: 60rpx;
}
.footer-tool {
	position: fixed;
	bottom: 0rpx;
	box-shadow: 0 8rpx 10rpx rgba(0, 0, 0, .1);
	width: 100%;
	background-color: #fff;
	animation: show-footer-tool .1s;
	animation-fill-mode: forwards;
	padding: 10rpx;
	box-sizing: border-box;
	height:  170px;
	overflow-y: auto;
	overflow-x: hidden;
}
@keyframes show-footer-tool {
	from {
		height: 0;
	}

	to {
		height: 170px;
	}
}
.footer-tool .emoji-img {
	display: inline-block;
	height: 72rpx;
	width: 72rpx;
	padding: 10rpx;
}
.footer-tool .emoji-img image{
	height: 52rpx;
	width: 52rpx;
}
.footer-tool .emoji-img-hover {
	background: #F2F3F4;
}
.toolbar {
	display: flex;
	flex-wrap: wrap;
	padding: 10rpx;
}
.toolbar-item {
	width: 25%;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	padding: 10rpx;
	box-sizing: border-box;
}
.toolbar-item-hover {
	background-color: #F2F3F4;
}
.toolbar-item image {
	width: 50rpx;
	height: 50rpx;
	padding: 10rpx 0;
}
.toolbar-item view {
	display: block;
	width: 100%;
	font-size: 28rpx;
	line-height: 34rpx;
	text-align: center;
}
.fastim-color-blue {
	color: $--blue;
}
.fastim-color-red {
	color: $--red;
}
.session-user-input-status-box {
	position: relative;
}
.session-user-input-status {
	position: absolute;
    color: $--blue;
    width: 220rpx;
	padding-left: 12rpx;
}
.link-popup-box {
	padding: 80rpx 20rpx 20rpx 20rpx;
	text-align: center;
	font-size: 28rpx;
}
.link-popup-title {
	font-weight: bold;
	font-size: 30rpx;
}
.link-popup-url {
	display: block;
	width: 90%;
	margin: 0 auto;
	color: $--blue;
	padding: 20rpx 0;
	word-break: break-word;
	word-wrap: break-word;
}
.link-popup-tis {
	color: $--gray;
}
.link-popup-buttons {
	padding-top: 20rpx;
	display: flex;
	height: 160rpx;
	align-items: center;
	justify-content: center;
}
.link-popup-button-item {
	margin-right: 40rpx;
}
.link-popup-url-button {
	display: inline-block;
	height: 70rpx;
	line-height: 70rpx;
	padding: 0 80rpx;
}
.wrapper .message-item.me .link-message {
	color: $--red;
}
.message-longpress-action {
	position: fixed;
	top: 400rpx;
	left: 200rpx;
	background: #262626;
	color: #BDBDBD;
	font-size: 28rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9999;
	border-radius: 16rpx;
}
.longpress-action-item {
	display: block;
	padding: 20rpx 24rpx;
	border-left: 1px solid #5E5E5E;
}
.longpress-action-item:first-child{
	border: none;
}
.longpress-action-pin {
	position: fixed;
	top: 466rpx;
	left: 219rpx;
}
.mask {
	z-index: 9990;
	position: fixed;
	top: 0;
	width: 100vw;
	height: 100vh;
}
.reply-list {
	padding: 0 20rpx;
}
.reply-item {
	display: block;
	font-size: 28rpx;
	border-bottom: 1px solid #F2F2f2;
	padding: 20rpx 0;
	overflow:hidden;
	text-overflow:ellipsis;
	display:-webkit-box;
	-webkit-box-orient:vertical;
	-webkit-line-clamp:2;
}
.reply-item:last-child {
	border-bottom: none;
}
.group-notice-title {
	padding: 30rpx;
	padding-bottom: 20rpx;
	font-size: 30rpx;
	font-weight: bold;
}
.group-notice-content {
	padding: 0 30rpx;
}
.group-notice-button button {
	width: 280rpx;
	display: block;
	margin: 20rpx auto;
}
.im-group-notice-imgs {
    display: flex;
	flex-wrap: wrap;
	padding-top: 20rpx;
}
.im-group-notice-imgs image {
	width: 130rpx;
	height: 130rpx;
}
.group-notice-footer {
	font-size: 27rpx;
	color: $--gray;
	padding-top: 6rpx;
	padding-bottom: 10rpx;
	display: flex;
	align-items: center;
	margin-top: 10rpx;
}
.footer-createtime {
	padding-left: 10rpx;
}
.notice-item-footer-text {
	padding-left: 26rpx;
}
.reply_group{
	min-width: 300px;
	max-height: 600px;
	overflow: hidden;
}
.flexs{
	flex: 1;
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
	.text{
		font-size: 24rpx;
	}
}
.report_icon{
	width:20px;
	height:20px;
}

.feature_i1{
	
    width: 14px;
    height: 6px;
    display: inline-block;
    border: 1px solid #23b8ff;
    border-width: 0 0 2px 2px;
    transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    -moz-transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg); 
    -o-transform: rotate(-45deg);
    vertical-align: baseline;
}
.feature_iall{
    width:8px;
	height:16px;
	border-width:0 2px 2px 0;
	border-style:solid;
	border-color:red;
	transform:rotate(45deg)
}	
.status_icon{
	width:15px;
	height:15px;
}	
.status_icon1{
	width:20px;
	height:15px;
}
.im-top{
	position: relative;
}
.im-shortcut{
	position: absolute;
	bottom:25px;
	left:0;
	width:100vw;
	z-index: 9993;
	display: flex;
	background: #fff;
    border-top: 1px solid #e5e5e5;
    padding: 5px 0;
}
.shortcut-item{
	font-size:12px;
	color:#00b0ff;
	border:1px solid #00b0ff;
	padding:3px 5px;
	margin-left: 10px;
    border-radius: 5px;
}
</style>
