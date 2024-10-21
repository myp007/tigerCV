<template>
	<view class="skill_index" id="main_body">
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
			<view class="content_item" v-for="(item, index) in formData" :key="index">
				<view class="item_title">{{index+1}}.Skill One</view>
				<view class="item_content">
					<u--form labelWidth="auto">
						<u-form-item label="Skill name" labelPosition="top">
							<u--input v-model="item.name" border="bottom"></u--input>
						</u-form-item>
						<template v-if="item.name != ''">
							<u-form-item label="Level" labelPosition="left" labelWidth="65"
								:labelStyle="{'color': 'gray', 'font-size': '18px'}">
								<u-rate :value="item.level_num" active-color="#00328f" inactive-color="#00328f"
									size="24" gutter="15" @change="(v) => {rateChange(v, index)}"></u-rate>
							</u-form-item>
							<view>{{item.summary}}</view>
						</template>
					</u--form>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import commonData from '@/common/commonData'
	import {fetchSkillSave} from '@/api/resume.js'
	const ITEM = {
		name: '',
		summary: 'Interest (Interested or self-taught)',
		level_num: 1,
		id: '',
		guid: '',
		use_time: ''
	}
	export default {
		data() {
			return {
				formData: []
			}
		},
		computed: {
			skill() {
				return JSON.parse(uni.getStorageSync('resumedetails')).sections.skills
			},
			// formChangeData() {
			// 	// 兼容默认值
			// 	let formData = JSON.parse(JSON.stringify(this.formData))
			// 	formData.forEach((val) => {
			// 		const index = commonData.skill_level.findIndex(e => {
			// 			return e.id == val.level_num
			// 		})
			// 		if (index != -1) {
			// 			val.summary = commonData.skill_level[index].name
			// 		}
			// 	})
			// 	this.$forceUpdate()
			// 	return formData
			// }
		},
		onLoad() {
			if (this.skill.length > 0) {
				this.formData = [...this.skill]
			} 
			if(this.skill.length<3){
				for(let i =0;i<3-this.skill.length;i++){
					let tmp = ITEM
					tmp.guid = this.GUID()
					this.formData.push({...tmp})
				}
			}
			this.$forceUpdate()
		},
		methods: {
			submit() {
				const param = {
					data: this.formData,
					rid: uni.getStorageSync('rid')
				}
				fetchSkillSave(param).then(res => {
					this.goBack()
				})

			},
			goBack() {
				uni.navigateTo({
					url: '/pages/resume/details?id=' + JSON.parse(uni.getStorageSync('resumedetails')).id
				})
			},
			rateChange(v, prop) {
				this.formData[prop].summary = commonData.skill_level[v - 1].name
				this.formData[prop].level_num = v
			}
		}
	}
</script>

<style lang="scss">
	.skill_index {
		background-color: #fff;
		padding: 20px;
		height: 100%;
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
