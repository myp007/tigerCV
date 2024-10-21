<template>
	<view class="preview_index" id="main_body">
		<u-toast ref="uToast"></u-toast>
		<u-navbar class="app_navbar" height="56px" :placeholder="true" leftIconColor="#00328f">
			<view slot="left" class="nav_title">
				<u-icon name="arrow-left" color="#00328f" size="22" @click="goBack"></u-icon>
			</view>
		</u-navbar>
		<view class="main_box">
			<!-- 骨架屏 -->
			<view v-if="loading"
				style="background-color: #fff;position: absolute;z-index: 999;left: 0; top: 0;padding: 40px;overflow: hidden;"
				class="w_100 h_100">
				<u-skeleton class="pdf_avatar" :loading="true" avatar avatarSize="150" rows="2" titleHeight="40"
					rowsHeight="30"></u-skeleton>
				<u-row style="padding-top: 20px;" v-for="item in 5" :key="item">
					<u-col span="2">
						<u-skeleton :loading="true" :animate="true" :title="false" rows="3" rowsHeight="20"></u-skeleton>
					</u-col>
					<u-col span="1">
					</u-col>
					<u-col span="9">
						<u-skeleton :loading="true" :animate="true" :title="false" rows="3" rowsHeight="20"></u-skeleton>
					</u-col>
				</u-row>
			</view>
			<!-- 骨架屏 -->
			<view v-else>
				<view v-if="!resumeContent.preview_url" class="nofile">NO File</view>
				<view v-else class="h5view">
					<view id="pdfView"></view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
// import Panzoom from '@panzoom/panzoom'
import {
	fetchEetail,
	fetchResumeDownload
} from '@/api/resume.js'
import config from '@/common/config.js'
import Pdfh5 from "pdfh5";
import axios from 'axios';
export default {
	data() {
		return {
			loading: false,

			resumeContent: {
				basics: {
					amateur: '',
					birth_city: '',
					birthdate: '',
					email: '',
					facebook: '',
					first_name: '',
					id: '',
					instagram: '',
					last_name: '',
					location: {
						address: '',
						country: '',
						postalCode: '',
						region: ''
					},
					name: '',
					occupation: '',
					phone: '',
					photo: {
						id: 0,
						url: ''
					},
					position_city: '',
					salary: '',
					twitter: '',
					website: ''
				},
				sections: {
					education: [],
					languages: [],
					skills: []
				},
				share_url: '',
				slug: '',
				updatedAt: '',
				user: {
					createdAt: '',
					email: '',
					id: 0,
					name: '',
					provider: '',
					updatedAt: '',
					username: ''
				}
			},
			screenWidth: uni.getSystemInfoSync().windowWidth, // 屏幕宽度
			screenHeight: uni.getSystemInfoSync().windowHeight // 屏幕高度
		}
	},
	onLoad(query) {

		this.rid = query.id
		// 初始化简历内容
		this.getData()
	},

	methods: {

		// 返回上一级
		goBack() {
			uni.$u.route({
				type: 'navigateBack'
			})
		},

		// 获取简历内容
		getData() {
			this.loading = true
			fetchEetail(this.rid).then(res => {
				if (res) {
					//简历内容
					this.resumeContent = res
					if(res.preview_url){
					axios
					.get(res.preview_url, {
					    responseType: 'arraybuffer'
					})
					.then(e => {
						console.log(e.data)
					    this.pdfh5 = new Pdfh5('#pdfView', {
					        data: e.data
					    });
					});
					}
				}
				this.loading = false
			})
		},

	}
}
</script>

<style scoped="scoped" lang="scss">
.main_box {
	height: 90vh;
	background: #f2f2f2;
	overflow: hidden;

}

.nofile {
	width: 100%;
	height: 80vh;
	display: flex;
	align-items: center;
	justify-content: center;
}</style>
