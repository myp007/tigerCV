<template>
	<view class="search-hd">
		<view class="iconfont iconsousuo search-icon"></view>
		<input class="search" :class="ifcircle ? 'circle' : 'not-circle'" type="text" :value="value" @focus="showAdvice"
			@input="getinput" @blur="getblur" :placeholder="placeholervalue"></input>
		<view class="iconfont iconshanchu clear-icon" v-if="value.length > 0" @click.stop="clearValue"></view>
		<!-- 搜索建议 -->
		<view class="search-adviceList" :hidden="!ifShow">
			<scroll-view style="height:100%" scroll-y v-if="adviceList.length">
				<view class="search-adviceList-item" v-for="(item,index) in adviceList" :key="item.value"
					@click="getAdvice(item)">
					{{item.label}}
				</view>
			</scroll-view>
			<view class="hold" v-else>暂无数据~</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'upload',
		model: {
			prop: "showPop",
			event: "change"
		},
		props: {
			/**
			 * @description  是否圆形输入框
			 */
			ifcircle: {
				type: Boolean,
				default: true
			},
			/**
			 * @description  是否打开输入建议
			 */
			ifshowadvice: {
				type: Boolean,
				default: true
			},
			placeholervalue: {
				type: String,
				default: '请输入搜索内容'
			},
			/**
			 * @description  输入建议数据列表
			 */
			data: {
				type: Array,
				default () {
					return [];
				},
			},
			value: {
				type: String,
				default: ''
			}
		},
		watch: {
			data(val) {
				this.adviceList = val
			},
			value: {
				handler(val) {
					if (val) {
						this.adviceList = this.data.filter(item => {

							return item.label.includes(val) || ('' + item.value).includes(val)
						})
					} else {
						this.adviceList = this.data
					}
				},
				immediate: true,
				deep: true

			}
		},
		data() {
			return {
				adviceList: [],
				ifShow: false // 是否显示搜索建议
			}
		},
		methods: {
			bodyCloseMenus() {
				this.ifShow = false
				console.log('关闭')
			},
			getinput(e) {
				this.$emit("input", e.detail.value)
			},
			getblur(e) {
				this.ifShow = false
				this.$emit("blur", e.detail.value)
			},
			clearValue() {
				this.$emit("clear")
				this.ifShow = false
			},
			showAdvice(val) {
				this.$emit("focus")
				this.ifShow = this.$props.ifshowadvice ? true : false
			},
			getAdvice(item) {
				this.$emit('getadvice', item)
				this.ifShow = false
			}
		}
	}
</script>

<style>
	@import "./pretty-search.css";

	.search-hd {
		margin: 10px auto;
		position: relative;
		width: 300px;
		display: flex;
		background-color: #fff;
	}

	.search {
		width: 100%;
		background-color: #eee;
		font-size: 14px;
		height: 35px;
		line-height: 35px;
		padding-left: 40px;
		padding-right: 40px;
	}

	.circle {
		border-radius: 20px;
	}

	.not-circle {
		border-radius: 5px;
	}

	.search-icon {
		color: #aaa;
		font-size: 22px;
		top: 6px;
		position: absolute;
		left: 13px;
		z-index: 999;
	}

	.clear-icon {
		color: #aaa;
		font-size: 17px;
		position: absolute;
		top: 9px;
		right: 10px;
		z-index: 999;
	}

	.search-adviceList-item {
		padding: 5px 0;
		border-bottom: 1px solid #eee;
	}

	.search-adviceList {
		position: absolute;
		background-color: #fff;
		top: 38px;
		left: 0px;
		width: 85%;
		height: 100px;
		font-size: 14px;
		padding: 10px 20px;
		border: 1px solid #eee;
		border-radius: 5px;
		z-index: 999;
	}

	.hold {
		text-align: center;
		color: #aaa;
		margin-top: 12%;
	}
</style>
