<template>
    <view class="eamil-icon">
        <view class="text-h5">
            Why choosing Tigercv to send your resume?
        </view>
        <view class="card__text">
            The benefits of TigerCV are listed below: <br />
            1. Your email prefix matches your real name more, making
            your application more convincing. <br />2. The commercial
            mail delivery channel adapted by TigerCV has a higher
            delivery rate than public mailboxes such as Gmail and
            Yahoo, and it is not easy to be sent to the dustbin.
            <br />
            3. TigerCV has built-in email reminders. You will get to
            know in real time whether your cover letter has been
            readed by HR.
        </view>
        <view class="card__actions" @click="close">Close</view>
    </view>
</template>
<script>
export default {
    name: 'popTip',
    props:{
        closeTip:{
            required:true
        }
    },
    data() {
        return {

        }
    },
    methods:{
        close:function(){
            this.closeTip()
        }
    }

}
</script>
<style lang="scss" scoped=""scoped>
.eamil-icon{
    max-width: 290px;
    padding: 24px;
    .text-h5{
        padding: 16px 0 10px;
    }
    .card__text{
        font-size: 14px;
        font-weight: 400;
        color: rgba($color: #000000, $alpha: 0.6);
        line-height: 20px;
    }
    .card__actions{
        width: 100%;
        margin-top: 20px;
        text-align: right;
        cursor: pointer;
    }
}
</style>    