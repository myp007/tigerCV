<template>
    <view class="multicombox_index">
        <u-tag class="dib" v-for="(item, index) in value" :key="index" :text="item.name" bgColor="#3246D2" borderColor="#3246D2" closeColor="#3246D2" size="mini" closable @close="closeKeyword(index)"></u-tag>
        <input-autocomplete
            class="multiselect_input_autocomplete"
            :placeholder="placeholder"
            :value="text"
            v-model="text"
            highlightColor="#474a5c"
            :loadData="loadAutocompleteDataLocation"
            v-on:selectItem="keywordChange"
            v-on:inputBlur="keywordBlur"
        ></input-autocomplete>
    </view>
</template>

<script>
    export default {
        data() {
            return{
                text: ''
            }
        },
        props: {
            // 双向绑定
            value: {
                type: Array,
                default: []
            },
            options: {
                type: Array,
                default: []
            },
            tag: {
                type: Function
            },
            placeholder: {
                type: String,
                default: ''
            }
        },
        methods: {
            closeKeyword(i) {
				this.value.splice(i, 1)
			},
            loadAutocompleteDataLocation(string) {
                let list = []
                this.options.forEach(element => {
                    element.name.toString()
                    if (element.name.indexOf(string) != -1) {
                        list.push(element.name)
                    }
                });
                return Promise.resolve(list);
            },
            RegExpString(str) { 
                var p = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]") 
                if(p.test(str)){
                    return true}
                else{
                    return false
                }
            },
            keywordChange(v){
                let index = this.value.findIndex(o => { return o.name == v});
                if (index == -1) {
                    let i = this.options.findIndex(o => { return o.name == v});
                    this.value.push(this.options[i])
                }
                this.text = ''
            },
            keywordBlur() {
                let v = this.text
                if (!v) {
                    return
                }
                if (this.RegExpString(v)) {
					uni.$u.toast('Special characters are not allowed!')
					return
				}
                let index = this.value.findIndex(o => { return o.name == v});
                if (index == -1) {
                    this.value.push({
                        name: v,
                        code: v
                    })
                }
                setTimeout(() => {
                    this.text = ''
                }, 100);
            },
        }
    }
</script>

<style lang="scss">
.multicombox_index{
    /* padding: 10px 20px; */
    /* background-color: rgb(246, 247, 251); */
    /* border-color: rgb(246, 247, 251) !important; */
    border-radius: 4px;
    .multiselect_input_autocomplete{
        .uni-input-input{
            border: none;
        }
        .input-placeholder{
            color: #474a5c !important;
            font-size: 16px !important;
        }
    }
    .str-auto-complete-container{
        width: 100%;
    }
}
</style>