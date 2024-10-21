<template>
	 <view class="deliversuccess">
	    <view class="icon">
			<u-icon name="email" size="110" color="#00328f "></u-icon>
	    </view>
	    <view class="status">
	      Your application letter has been delivered successfully!
	    </view>
	    <view class="info1">
	      <p>
	        You have used Tiger Resume's commercial mail delivery channel, which
	        will reduce the chance that your application letter being marked as
	        spam. At the same time, you will be reminded when HR reads your
	        application letter.
	      </p>
	    </view>
	    <view class="info2">
	      <p>
	        You can check the details in the "History" page, or deliver the email
	        for the second time
	      </p>
	    </view>
	
	  </view>
</template>

<script>
	export default {
		name:"deliverSuccess",
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss" scoped>
	.deliversuccess {
	  padding: 50px 20px;
	  height: 70vh;
	  display: flex;
	  justify-content: space-around;
	  align-items: center;
	  flex-direction: column;
	  .status {
		font-weight: 700;
		font-size: 20px;
		text-align: center;
	  }
	  .info1 {
		  font-size: 16px;
		  font-size: 600;
	  }
	  .info2 {
		  font-size: 16px;
		   font-size: 600;
	  }
	  .functions {
		display: flex;
		justify-content: space-between;
		width: 100%;
	  }
	}
</style>