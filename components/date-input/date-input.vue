<template>
  <view class="input-box">
    <input
      class="date-input"
      @input="onKeyInput"
      v-model="inputValue"
      :placeholder="placeholder"
      :maxlength="type == '1' ? 10 : 7"
    />
    <view v-if="isError" class="error"> error: check the date is correct </view>
    <view v-else class="eg">
      eg: {{ name }} format {{ type == '1' ? 'Month/days/Year' : 'Month/Year' }}
    </view>
  </view>
</template>

<script>
export default {
  name: 'date-input',
  props: {
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    keyName: {
      type: String || Number,
      default: '',
    },
    type: {
      type: String,
      default: '1', // 1
    },
    isError: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      inputValue: '',
      // isError: false,
    };
  },
  watch: {
    value(val, newval) {
      this.inputValue = val;
    },
  },
  created() {
    this.inputValue = this.value;
    // console.log(this.value)
  },
  methods: {
    onKeyInput: function (event) {
      let value = event.target.value;
      // let valueArr = value.split('')
      // console.log(valueArr)
      // if(valueArr.length == 2){
      // 	valueArr.splice('/',2)
      // }
      // if(valueArr.length == 5){
      // 	valueArr.splice('/',5)
      // }
      // let newValue = ''
      // valueArr.length > 0 && valueArr.map( (i) =>{
      // 	newValue = newValue + i
      // })
      // //
      // this.inputValue = newValue
      if (value.length == 2 || (this.type == '1' && value.length == 5)) {
        value = value + '/';
      }

      this.inputValue = value;

      let obj = {
        key: this.keyName,
        value: this.inputValue,
      };

      // this.$emit('errorFn', {
      //   val: this.inputValue,
      //   callback: (bol) => {
      //     console.log('bol===>', bol);
      //     this.isError = bol;
      //   },
      // });
      this.$emit('setValue', obj);
    },
  },
};
</script>

<style lang="scss">
.input-box {
  border-bottom: 1px solid #dadbde;
  flex: 1;
  padding: 10rpx 20rpx;
  position: relative;
  .eg {
    position: absolute;
    left: 0;
    bottom: -30rpx;
    color: #00328f;
    font-size: 12rpx;
    font-weight: 200;
  }
  .error {
    position: absolute;
    left: 0;
    top: 100%;
    color: red;
    font-size: 12rpx;
    font-weight: 200;
  }
}
</style>
