<template>
	<view class="email_login">
		<view class='app_modal' v-if="isapplogin">
			<u-loading-icon size="36" style="margin-top: 200px;"></u-loading-icon>
		</view>
	</view>
</template>

<script>
	import {loginEmail,loginMobile} from '@/api/user'
	export default {
		data() {
			return {
				isapplogin: true
			}
		},
		onLoad(query) {
			var that = this
			// #ifdef H5
			var that = this
			if (window) {
				clearInterval(window.chatUnreadTime)
			}
			uni.clearStorage()
			that.ws && that.ws.logout()
			if (query.app_info) {
				let key = '123456';
				query.app_info = query.app_info.replace(" ","+")
				let string = this.strBase64Decode(query.app_info);
				let len = key.length;
				let code = '';
				for (var i = 0; i < string.length; i++) {
					let k = i % len;
					code += String.fromCharCode(string.charCodeAt(i) ^ key.charCodeAt(k));
				}
				let app_info = this.strBase64Decode(code).split('|')
				// let app_info = JSON.parse(this.strBase64Decode(code))
				console.log(app_info)
				if(app_info[11] === "mobile"){
					that.goMobile(app_info)
				}else{
					let pdata = {
						email: app_info[0],
						utype: app_info[2],
						code: app_info[5]
					}
					that.goEmail(pdata)
				}
				
			}

			// #endif
		},
		
		methods: {
			goMobile(app_info){
			let that = this
			let data = {
				mobile: app_info[0],
				utype: app_info[2],
				code: app_info[5]
			}
			loginMobile(data).then(res => {
					that.loginFormButtonDisabled = false
					let imInfo = res.im_info
					uni.setStorageSync('userinfo', imInfo);
					uni.setStorageSync('appinfo', res);
					that.ws.init(imInfo.token, imInfo.auth_token, true)
					
					
					if(app_info[6] && app_info[6] == 'feature'){
						uni.switchTab({
							url: '/pages/message/message',
							animationType:'none'
						})
					}else{
						uni.navigateTo({
							url: '/pages/session-info/session-info?id=' + app_info[1] + '&apply_id=' +
								app_info[3] + '&resume_id=' + app_info[4] +
								'&platform=link&jobname='+app_info[8]+'&companyname='+app_info[7]
						})
						
					}
						
				})
		},
		goEmail(data){
			let that = this
			loginEmail(data).then(res => {
					that.loginFormButtonDisabled = false
					let imInfo = res.im_info
					uni.setStorageSync('userinfo', imInfo);
					uni.setStorageSync('appinfo', res);
					that.ws.init(imInfo.token, imInfo.auth_token, true)
					setTimeout(() => {
						if(app_info[6] && app_info[6] == 'feature'){
							uni.switchTab({
							    url: '/pages/message/message',
								animationType:'none'
							})
						}else{
							uni.navigateTo({
								url: '/pages/session-info/session-info?id=' + app_info[1] + '&apply_id=' +
									app_info[3] + '&resume_id=' + app_info[4] +
									'&platform=link&jobname='+app_info[8]+'&companyname='+app_info[7]
							})
							// uni.$u.route({
							// 	url: '/pages/session-info/session-info',
							// 	type: 'navigateTo',
							// 	params: {
							// 		id: app_info[1],
							// 		apply_id: app_info[3],
							// 		resume_id: app_info[4],
							// 		platform: 'link',
							// 		jobname:app_info[8],
							// 		companyname:app_info[7]
							// 	}
							// })
						}
						
						
					}, 1000)
				})
		},
			//base64解密函数
			strBase64Decode(data) {
				var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
				var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
					ac = 0,
					dec = "",
					tmp_arr = [];
				if (!data) {
					return data;
				}
				data += '';
				do { // unpack four hexets into three octets using index points in b64
					h1 = b64.indexOf(data.charAt(i++));
					h2 = b64.indexOf(data.charAt(i++));
					h3 = b64.indexOf(data.charAt(i++));
					h4 = b64.indexOf(data.charAt(i++));
					bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
					o1 = bits >> 16 & 0xff;
					o2 = bits >> 8 & 0xff;
					o3 = bits & 0xff;
					if (h3 == 64) {
						tmp_arr[ac++] = String.fromCharCode(o1);
					} else if (h4 == 64) {
						tmp_arr[ac++] = String.fromCharCode(o1, o2);
					} else {
						tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
					}
				} while (i < data.length);
				dec = tmp_arr.join('');
				return dec;
			}
		}
	}


</script>

<style>
</style>
