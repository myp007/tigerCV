<template>
  <view style="width: 100%;position: relative;">
    <input class="uni-input" :value="value" @input="onInput" @blur="hideList" />
    <view class="str-auto-complete-container " v-if="isShow">
      <view v-for="(item, index) in showList" :key="index" class="str-auto-complete-item" @tap="selectThisItem(item)" v-text="item"></view>
    </view>
  </view>
</template>

<script>
	import {getCompanyPositionList} from '@/api/resume'
export default {
  props: {
    list: {
      type: Array
    },
    label: {
      type: String,
      default: 'label'
    },
    importvalue: {
      type: String
    },
    lowerAndUp: {
      type: String,
      default: 'true'
    },
    highlightColor: {
      type: String,
      default: 'lightcoral'
    },
    formDataIndex:{
      type:Number,
    }
  },
  data() {
    return {
      showList: [],
      value: '',
      needShow: false
    };
  },
  watch: {
    importvalue(newValue, oldValue) {
      this.value = newValue;
    },
    // list: {
    //   handler(newValue, oldValue) {
    //     this.filterList(this.value);
    //   },
    //   deep: true
    // }
  },
  computed: {
    isShow() {
      return this.needShow && this.showList.length > 0;
    }
  },
  created() {
    this.list.sort();
    this.showList = this.list;
    this.value = this.importvalue;
  },
  methods: {
    onInput(event) {
      this.filterList(event.target.value);
      this.$set(this, 'value', event.target.value);
      this.$emit('change', event.target.value,this.formDataIndex);
      if (event.target.value.length > 0) {
        this.needShow = true;
      } else {
        this.needShow = false;
      }
    },
    getCompanyPositionList(string){
      let that = this
       var timer = null
       if(!timer){
           timer = setTimeout(function(){
              getCompanyPositionList({
                keyword: string
              }).then(res => {
                that.showList = res
                timer = null
              })
           },500)
       }
		},
    hideList() {
      setTimeout(() => {
        this.needShow = false;
      }, 300);
    },
    filterList(stringExp) {
      // let tempArray = [];
      // console.log(stringExp)
      // for (let i = 0; i < this.list.length; i++) {
      //   let temp = this.list[i];
      //   let showObject = this.filterString(stringExp, temp);
      //   if (showObject) {
      //     if (showObject.number === stringExp.length) {
      //       tempArray.push(showObject);
      //     }
      //   }
      // }
      // if (tempArray.length === 0 && stringExp.length !== 0) {
      //   // uni.showToast({
      //   //   title: '没有匹配的字符串',
      //   //   mask: false,
      //   //   icon: 'none',
      //   //   duration: 1500
      //   // });
      //   return false;
      // }
      this.showList = []
      this.getCompanyPositionList(stringExp)
      // this.showList = tempArray;
    },
    // filterString(stringExp, element) {
    //   let b;
    //   if (typeof element === 'string') b = element;
    //   if (typeof element === 'object') b = element[this.label];
    //   const tempByteArray = b.split('');
    //   let itemShow = [];
    //   const sArray = stringExp.split('');
    //   const fontStart = '<span style=color:' + this.highlightColor + '>';
    //   const fontEnd = '</span>';
    //   let sameCharNumber = 0;
    //   for (let j = 0; j < tempByteArray.length; j++) {
    //     let tempChar = tempByteArray[j];
    //     let sChar = sArray[sameCharNumber];
    //     if (this.lowerAndUp !== 'no') {
    //       tempChar = tempChar.toLowerCase();
    //       if (sChar) {
    //         sChar = sChar.toLowerCase();
    //       }
    //     }

    //     if (tempChar === sChar) {
    //       let sameNumberNow = sameCharNumber;
    //       itemShow.push(fontStart);
    //       for (let k = 0; k < sArray.length - sameNumberNow; k++) {
    //         let tempCharStr = tempByteArray[j + k] || '';
    //         let sCharStr = sArray[k + sameNumberNow];
    //         if (this.lowerAndUp !== 'no') {
    //           tempCharStr = tempCharStr.toLowerCase();
    //           if (sCharStr) {
    //             sCharStr = sCharStr.toLowerCase();
    //           }
    //         }

    //         if (tempCharStr === sCharStr) {
    //           itemShow.push(tempByteArray[j + k]);
    //           sameCharNumber++;
    //         } else if (tempCharStr !== sCharStr) {
    //           itemShow.push(fontEnd);
    //           itemShow.push(tempByteArray[j + k]);
    //           j += k;
    //           break;
    //         }
    //         if (k + sameNumberNow === sArray.length - 1) {
    //           j += k;
    //           itemShow.push(fontEnd);
    //         }
    //       }
    //     } else {
    //       itemShow.push(tempByteArray[j]);
    //     }
    //   }
    //   if (sameCharNumber > 0) {
    //     return {
    //       label: b,
    //       originalEle: element,
    //       number: sameCharNumber,
    //       showString: itemShow.join('')
    //     };
    //   }
    // },
    selectThisItem(item) {
      // this.$set(this, 'value', item.label);
      // this.needShow = false;
      // this.$emit('change', item.originalEle[this.label] || item.originalEle,this.formDataIndex);
      // this.$emit('select', item.originalEle,this.formDataIndex);
      this.$set(this, 'value', item);
      this.needShow = false;
      this.$emit('change', item,this.formDataIndex);
      this.$emit('select', item,this.formDataIndex);
    }
  }
};
</script>

<style lang="scss">
.str-auto-complete-container {
  width: 100%;
  height: auto;
  border: 1px solid #f3f3f4;
  position: absolute;
  z-index: 999;
  background: #fff;
  padding-right: 20px;
  .str-auto-complete-item {
    padding: 16upx;
  }

}
.uni-input{
    height: 37px;
    border-bottom: 1px solid #dadbde;
  }
</style>
