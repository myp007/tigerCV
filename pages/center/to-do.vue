<template>
	<view class="to-do-box">
		<u-toast ref="uToast" />
		<common :tips='commonTips'></common>
		<u-cell-group :border="false" class="to-do">
			
			<view v-if="!addNewToDo">
				<u-cell class="to-do-item" hover-class="none" :border-bottom="false" :arrow="false">
					<view hover-class="new-to-do-hover" class="to-do-item-box new-to-do" slot="title">
						<u-icon color="#6388fb" size="24" name="plus"></u-icon>
						<text @click="taggleAddNewToDo" class="color-blue">New To Do</text>
					</view>
				</u-cell>
				<u-line class="to-do-item-line"></u-line>
			</view>
			
			<view v-if="addNewToDo">
				<view class="add-new-to-do-textarea">
					<u-input
						:clearable="false"
						:focus="addNewToDo"
						v-model="toDoContent"
						placeholder="Please enter the to-do content"
						type="textarea"
						maxlength="-1"
					>
					</u-input>
				</view>
				<u-button :loading="submitButtonStatus" :disabled="submitButtonStatus" class="submit-button" type="primary" @click="toDoSave">SAVE</u-button>
			</view>
			
			<block v-for="(item, index) in incomplete" :key="index">
				<u-cell class="to-do-item" :border-bottom="false" hover-class="none" :arrow="false">
					<view class="to-do-item-box" slot="title">
						<u-checkbox 
						shape="circle"
						@change="finishTODO" 
						v-model="item.checked" 
						:name="item.id"
						></u-checkbox><view @click="editTODO(item.id, 'incomplete', index)" class="to-do-item-box-title">{{item.title}}</view>
					</view>
				</u-cell>
				<u-line class="to-do-item-line"></u-line>
			</block>
			<block v-if="showCompleted" v-for="(item, index) in completed" :key="index">
				<u-cell class="to-do-item completed-item" :border-bottom="false" hover-class="none" :arrow="false">
					<view class="to-do-item-box" slot="title">
						<u-checkbox
						shape="circle"
						active-color="#999999"
						@change="finishTODO" 
						v-model="item.checked" 
						:name="item.id"
						></u-checkbox><view @click="editTODO(item.id, 'completed', index)" class="to-do-item-box-title">{{item.title}}</view>
					</view>
				</u-cell>
				<u-line class="to-do-item-line"></u-line>
			</block>
		</u-cell-group>
		
		<view class="load-more-to-do-box">
			<view @click="taggleShowToDo" class="load-more-to-do">{{showCompleted ? '隐藏':'显示'}}已完成待办<text class="load-more-to-do-spot">•</text>{{completedNumber}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				newToDoTitleStyle: {
					color: '#6388fb'
				},
				addNewToDo: false,
				showCompleted: false,
				completedNumber: 5,
				toDoContent: '',
				loadTODO: null,
				completed: [],
				incomplete: [],
				editId: 0,
				submitButtonStatus: false,
				commonTips: ''
			}
		},
		onLoad:function(){
			this.ws.pageFun(this.pageDataLoad, this);
		},
		onShow() {
			this.ws.checkNetwork(this)
		},
		onPullDownRefresh: function () {
			this.ws.pageFun(this.pageDataLoad(true), this);
			this.ws.onMessageCallBack.set('load_to_do', (msg) => {
				if (msg.data.data.refresh) {
					this.$refs.uToast.show({
						title: '刷新成功~',
						type: 'success'
					})
					uni.stopPullDownRefresh()
				}
			})
		},
		onReachBottom: function () {
			if (this.loadTODO) {
				this.loadTODO.page++;
				let message = { c: 'ImBase', a: 'loadTODO', data: this.loadTODO }
				this.ws.send(message);
				this.loadTODO = false
			}
		},
		methods: {
			pageDataLoad: function (refresh = false) {
				this.ws.send({
					c: 'ImBase',
					a: 'loadTODO',
					data: {
						'method': 'get',
						'refresh': refresh
					}
				})
			},
			finishTODO: function(e) {
				// 完成待办
				let message = {
					c: 'ImBase',
					a: 'loadTODO',
					data: {
						'method': 'update',
						'status': e.value,
						'id': e.name
					}
				}
				this.ws.send(message);
			},
			taggleShowToDo: function () {
				this.showCompleted = !this.showCompleted
			},
			taggleAddNewToDo: function () {
				if(this.addNewToDo) {
					this.addNewToDo = false
					this.toDoContent = ''
				} else {
					this.addNewToDo = true
				}
			},
			editTODO: function (id, todoType, idx) {
				this.toDoContent = (todoType == 'completed') ? this.completed[idx].title:this.incomplete[idx].title
				this.addNewToDo = true
				this.editId = id
			},
			toDoSave: function () {
				if (!this.toDoContent) {
					this.$refs.uToast.show({
						title: '请输入待办内容~',
						type: 'error'
					})
					return;
				}
				
				let message = {
					c: 'ImBase',
					a: 'loadTODO',
					data: {
						'method': 'save',
						'id': this.editId,
						'add_val': this.toDoContent
					}
				}
				this.ws.send(message);
				
				this.addNewToDo = false
				this.toDoContent = ''
				this.editId = 0
			}
		}
	}
</script>

<style lang="scss">
page {
	background: $--white;
}
.new-to-do {
	margin-left: 8vw;
	padding: 10rpx 8rpx 10rpx 6rpx;
}
.new-to-do-hover {
	background: #F2F3F4;
}
.color-blue {
	color: $--blue;
}
.to-do-item-box {
	display: flex;
	align-items: center;
	min-height: 60rpx;
}
.to-do-item-box-title {
	display: block;
	line-height: 36rpx;
	min-width: 84vw;
}
.to-do-item-line {
	display: block;
	width: 88vw;
	margin-left: 12vw;
}
.completed-item {
	text-decoration: line-through;
}
.load-more-to-do-box {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 120rpx;
}
.load-more-to-do {
	display: block;
	height: 80rpx;
	width: 400rpx;
	border-radius: 8rpx;
	text-align: center;
	line-height: 80rpx;
	color: $--dark;
	background: $--light;
}
.load-more-to-do-spot {
	padding: 0 6rpx;
}
.add-new-to-do-top {
	font-size: 32rpx;
	width: 100vw;
	padding: 30rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.add-new-to-do-textarea {
	display: block;
	width: 92vw;
	margin: 20rpx auto;
	border: 2rpx solid $--grey;
	border-radius: 12rpx;
	padding: 8rpx;
}
.add-new-to-do-save {
	color: $--blue;
}
.submit-button {
	width: 240rpx;
	display: block;
	margin: 60rpx auto;
}
</style>
