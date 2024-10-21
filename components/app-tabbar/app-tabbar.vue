<template>
	<view class="tabbar_index">
        <u-tabbar
		    style="font-weight: 800;"
		    :value="selectvalue"
            @change="change"
            :fixed="true"
            :placeholder="true"
            :safeAreaInsetBottom="false"
			activeColor="#00328f"
            zIndex="9999">
            <u-tabbar-item text="JOB GROUPS" name="JOB GROUPS" :icon="selectvalue=='JOB GROUPS'? 'grid-fill' : 'grid'"></u-tabbar-item>
            <u-tabbar-item text="RESUME" name="RESUME" :icon="selectvalue=='RESUME' ? 'file-text-fill' : 'file-text'"></u-tabbar-item>
            <u-tabbar-item text="MESSAGE" name="MESSAGE" :icon="selectvalue=='MESSAGE' ? 'chat-fill' : 'chat'"></u-tabbar-item>
            <u-tabbar-item text="PERSONAL" name="PERSONAL" :icon="selectvalue=='PERSONAL'? 'account-fill' : 'account'"></u-tabbar-item>
        </u-tabbar>
	</view>
</template>

<script>
	export default {
		name: "tabbar",
		props: ['selectvalue'],
		data() {
			return {
                safeAreaInsetBottom: true,
			};
		},
        methods: {
            change(name) {
				if(this.selectvalue == name) return
				//  uni.setStorageSync('selectvalue',name)
                if (name == 'JOB GROUPS') {
                    uni.switchTab({
                        url: '/pages/index/index',
						animationType:'none'
                    })
                } else if (name == 'RESUME') {
			
                    uni.switchTab({
                        url: '/pages/resume/index',
						animationType:'none'
                    })
                } else if (name == 'MESSAGE') {
		
                    uni.switchTab({
                        url: '/pages/message/message',
						animationType:'none'
                    })
                } else if (name == 'PERSONAL') {
                    uni.switchTab({
                        url: '/pages/center/index',
						animationType:'none'
                    })
                }
            }
        }
	}
</script>

<style lang="scss" scoped="scoped">
.tabbar_index{
    
}
::v-deep .u-tabbar-item__text > span{
	font-size: 12px;
}
</style>
