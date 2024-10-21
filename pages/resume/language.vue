<template>
	<view class="language_index" id="main_body">
		<!-- nav -->
		<u-navbar class="app_navbar" height="56px" :placeholder="true" leftIconColor="#00328f">
			<view slot="left" class="nav_title">
				<u-icon name="arrow-left" color="#00328f" size="22" @click="goBack"></u-icon>
			</view>
			<view slot="right" class="nav_right">
				<u-icon name="checkmark" color="#00328f" size="22" @click="submit"></u-icon>
			</view>
		</u-navbar>
		<view class="right_view">
			<view class="content_item">
				<view class="item_title">1.English</view>
				<view class="item_content">
					<u--form labelPosition="left" labelWidth="100" :labelStyle="{'color': 'gray', 'font-size': '18px'}">
						<u-form-item label="Level">
							<u-rate :value="formData.English.level_num" active-color="#00328f" inactive-color="#00328f"
								size="24" gutter="15" @change="(v) => {rateChange(v, 'English')}"></u-rate>
						</u-form-item>
						<view v-if="formData.English.level_num > 0">{{formData.English.summary}}</view>
					</u--form>
				</view>
			</view>
			<view class="content_item">
				<view class="item_title">2.Japanese</view>
				<view class="item_content">
					<u--form labelPosition="left" labelWidth="100" :labelStyle="{'color': 'gray', 'font-size': '18px'}">
						<u-form-item label="Level">
							<u-rate :value="formData.Japanese.level_num" active-color="#00328f" inactive-color="#00328f"
								size="24" gutter="15" @change="(v) => {rateChange(v, 'Japanese')}"></u-rate>
						</u-form-item>
						<view v-if="formData.Japanese.level_num > 0">{{formData.Japanese.summary}}</view>
					</u--form>
				</view>
			</view>
			<view class="content_item">
				<view class="item_title">3.Filipino</view>
				<view class="item_content">
					<u--form labelPosition="left" labelWidth="100" :labelStyle="{'color': 'gray', 'font-size': '18px'}">
						<u-form-item label="Level">
							<u-rate :value="formData.Filipino.level_num" active-color="#00328f" inactive-color="#00328f"
								size="24" gutter="15" @change="(v) => {rateChange(v, 'Filipino')}"></u-rate>
						</u-form-item>
						<view v-if="formData.Filipino.level_num > 0">{{formData.Filipino.summary}}</view>
					</u--form>
				</view>
			</view>
			<view class="content_item">
				<view class="item_title">4.Chinese</view>
				<view class="item_content">
					<u--form labelPosition="left" labelWidth="100" :labelStyle="{'color': 'gray', 'font-size': '18px'}">
						<u-form-item label="Level">
							<u-rate :value="formData.Chinese.level_num" active-color="#00328f" inactive-color="#00328f"
								size="24" gutter="15" @change="(v) => {rateChange(v, 'Chinese')}"></u-rate>
						</u-form-item>
						<view v-if="formData.Chinese.level_num > 0">{{formData.Chinese.summary}}</view>
					</u--form>
				</view>
			</view>
			<view class="content_item">
				<view class="item_title">5.Korean</view>
				<view class="item_content">
					<u--form labelPosition="left" labelWidth="100" :labelStyle="{'color': 'gray', 'font-size': '18px'}">
						<u-form-item label="Level">
							<u-rate :value="formData.Korean.level_num" active-color="#00328f" inactive-color="#00328f"
								size="24" gutter="15" @change="(v) => {rateChange(v, 'Korean')}"></u-rate>
						</u-form-item>
						<view v-if="formData.Korean.level_num > 0">{{formData.Korean.summary}}</view>
					</u--form>
				</view>
			</view>
			<view class="content_item">
				<view class="item_title">6.Others</view>
				<view class="item_content">
					<u--form labelPosition="left" labelWidth="100" :labelStyle="{'color': 'gray', 'font-size': '18px'}">
						<u-form-item label="Level">
							<u-rate :value="formData.Others.level_num" active-color="#00328f" inactive-color="#00328f"
								size="24" gutter="15" @change="(v) => {rateChange(v, 'Others')}"></u-rate>
						</u-form-item>
						<view v-if="formData.Others.level_num > 0">{{formData.Others.summary}}</view>
					</u--form>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import commonData from '@/common/commonData'
	import {
		fetchLanguageSave
	} from '@/api/resume.js'
	const ITEM = {
		id: '',
		guid: '',
		name: '',
		level_num: 0,
		use_time: '',
		summary: '',
	}
	const ALL_LANGUAGES = {
		English: {},
		Japanese: {},
		Filipino: {},
		Chinese: {},
		Korean: {},
		Others: {}
	}

	export default {
		data() {
			return {
				formData: {
					English: {
						level_num: 0,
						summary: '',
						id: '',
					},
					Japanese: {
						level_num: 0,
						summary: '',
						id: ''
					},
					Filipino: {
						level_num: 0,
						summary: '',
						id: ''
					},
					Chinese: {
						level_num: 0,
						summary: '',
						id: ''
					},
					Korean: {
						level_num: 0,
						summary: '',
						id: ''
					},
					Others: {
						level_num: 0,
						summary: '',
						id: ''
					}
				}
			}
		},
		
		onLoad() {
			let langs = {}
			if (this.languages.length > 0) {
				this.languages.map((v, i) => {
					langs[v.name] = v
				})
			}
			// 数据回写
			Object.keys(ALL_LANGUAGES).forEach((key) => {
				if (langs[key] !== undefined) {
					this.formData[key] = langs[key]
				} else {
					ITEM.guid = this.GUID()
					ITEM.name = key
					this.formData[key] = JSON.parse(JSON.stringify(ITEM))
				}
			})
			this.$forceUpdate()
		},
		computed: {
			languages() {
				return JSON.parse(uni.getStorageSync('resumedetails')).sections.languages
			},
		
			formChangeData() {
				// 兼容默认值
				let formData = JSON.parse(JSON.stringify(this.formData))
				Object.keys(formData).forEach((key) => {
					const index = commonData.Language_level.findIndex(e => {
						return e.id == formData[key].level_num
					})
					if (index != -1) {
						formData[key].summary = commonData.Language_level[index].name
					}
				})
				this.$forceUpdate()
				return formData
			}
		},
		methods: {
			// 保存数据
			submit() {
				const param = {
					data: this.formData,
					rid: JSON.parse(uni.getStorageSync('resumedetails')).id,
				}
				fetchLanguageSave(param).then(res => {
					this.goBack()
				})
			},
			// 返回上一级
			goBack() {
				uni.navigateTo({
					url: '/pages/resume/details?id=' + uni.getStorageSync('rid')
				})
			},
			rateChange(v, prop) {
				this.formData[prop].summary = commonData.Language_level[v - 1].name
				this.formData[prop].level_num = v
			}
		}
	}
</script>

<style lang="scss">
	.language_index {
		background-color: #fff;
		padding: 20px;
		font-family: "Roboto", sans-serif;

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
