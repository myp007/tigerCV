import imConfig from '@/common/config.js'; // 本地配置数据
const appinfo = uni.getStorageSync('appinfo');
export const createNotify = (title, options) => {
  var PERMISSON_GRANTED = 'granted';
  var PERMISSON_DENIED = 'denied';
  var PERMISSON_DEFAULT = 'default';

  // 如果用户已经允许，直接显示消息，如果不允许则提示用户授权
  if (Notification.permission === PERMISSON_GRANTED) {
    notify(title, options);
  } else {
    Notification.requestPermission(function (res) {
      if (res === PERMISSON_GRANTED) {
        notify(title, options);
      }
    });
  }

  // 显示提示消息
  function notify($title, $options) {
    var notification = new Notification($title, $options);
    console.log(notification);
    notification.onshow = function (event) {
      console.log('show : ', event);
    };
    notification.onclose = function (event) {
      console.log('close : ', event);
    };
    notification.onclick = function (event) {
      console.log('click : ', event);
      // 当点击事件触发，打开指定的url
      window.open(event.target.data);
      notification.close();
    };
  }
};
var base64EncodeChars =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
var base64DecodeChars = new Array(
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  62,
  -1,
  -1,
  -1,
  63,
  52,
  53,
  54,
  55,
  56,
  57,
  58,
  59,
  60,
  61,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  26,
  27,
  28,
  29,
  30,
  31,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  40,
  41,
  42,
  43,
  44,
  45,
  46,
  47,
  48,
  49,
  50,
  51,
  -1,
  -1,
  -1,
  -1,
  -1
);
/**
 * base64编码
 * @param {Object} str
 */
export const base64encode = (str) => {
  var out, i, len;
  var c1, c2, c3;
  len = str.length;
  i = 0;
  out = '';
  while (i < len) {
    c1 = str.charCodeAt(i++) & 0xff;
    if (i == len) {
      out += base64EncodeChars.charAt(c1 >> 2);
      out += base64EncodeChars.charAt((c1 & 0x3) << 4);
      out += '==';
      break;
    }
    c2 = str.charCodeAt(i++);
    if (i == len) {
      out += base64EncodeChars.charAt(c1 >> 2);
      out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
      out += base64EncodeChars.charAt((c2 & 0xf) << 2);
      out += '=';
      break;
    }
    c3 = str.charCodeAt(i++);
    out += base64EncodeChars.charAt(c1 >> 2);
    out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
    out += base64EncodeChars.charAt(((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6));
    out += base64EncodeChars.charAt(c3 & 0x3f);
  }
  return out;
};
/**
 * base64解码
 * @param {Object} str
 */
export const base64decode = (str) => {
  var c1, c2, c3, c4;
  var i, len, out;
  len = str.length;
  i = 0;
  out = '';
  while (i < len) {
    /* c1 */
    do {
      c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
    } while (i < len && c1 == -1);
    if (c1 == -1) break;
    /* c2 */
    do {
      c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
    } while (i < len && c2 == -1);
    if (c2 == -1) break;
    out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
    /* c3 */
    do {
      c3 = str.charCodeAt(i++) & 0xff;
      if (c3 == 61) return out;
      c3 = base64DecodeChars[c3];
    } while (i < len && c3 == -1);
    if (c3 == -1) break;
    out += String.fromCharCode(((c2 & 0xf) << 4) | ((c3 & 0x3c) >> 2));
    /* c4 */
    do {
      c4 = str.charCodeAt(i++) & 0xff;
      if (c4 == 61) return out;
      c4 = base64DecodeChars[c4];
    } while (i < len && c4 == -1);
    if (c4 == -1) break;
    out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
  }
  return out;
};
export const uploadImg = (params) => {
  return new Promise((resolve, reject) => {
    uni.chooseImage({
      success: (chooseImageRes) => {
        uni.showLoading({ title: 'loading...' });
        const tempFilePaths = chooseImageRes.tempFilePaths;
        uni.uploadFile({
          url: imConfig.appUrl + '/personal/resume/uploadPhoto', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          header: {
            'user-token': appinfo.token,
          },
          formData: params,
          name: 'file',
          success: (uploadFileRes) => {
            uni.hideLoading();
            resolve(uploadFileRes.data);
          },
          fail: (res) => {
            uni.hideLoading();
            uni.showToast({
              title: 'Upload failed',
              icon: 'error',
              duration: 2000,
            });
            reject(res);
          },
        });
      },
    });
  });
};

export const eliverKey = [
  'username',
  'age',
  'occupation',
  'salary',
  'phone',
  'email',
  'facebook',
  'position_city',
];

export const eliverTemplate = `<div style="min-height: 100px;text-align: left;font-family: -webkit-body;">
    <h1 style="font-size: 14px;font-weight: 500;margin-bottom: 20px;">Dear HR,</h1>

    <p style="font-size: 14px;line-height: 16px;margin-bottom: 10px;">I'm 【username】, 【age】 years old, my expected location is 【position_city】. And l am looking for a 【occupation】 job.</p>

    <p style="font-size: 14px;line-height: 16px;margin-bottom: 10px;">My expected salary is 【salary】₱. I can begin to work at any time.</p>

    <p style="font-size: 14px;line-height: 16px;">Please kindly to check my resume, looking forward your response.</p>

    <p style="border-bottom: 1px solid #00328f;"></p>

    <p style="margin-bottom: 0px;font-size: 14px;font-weight: 500;line-height: 16px;">Best Regards,</p>

    <p style="font-size: 14px;">【username】</p>
    <div style="font-size: 12px;vertical-align: middle;">
    <span style="display: inline-block;text-align: right;font-size: 14px;">
        <svg style="width:16px;height:16px;color:#00328f;" viewBox="0 0 24 24">
        <path fill="currentColor" d="M20.07,4.93C21.88,6.74 23,9.24 23,12C23,14.76 21.88,17.26 20.07,19.07L18.66,17.66C20.11,16.22 21,14.22 21,12C21,9.79 20.11,7.78 18.66,6.34L20.07,4.93M17.24,7.76C18.33,8.85 19,10.35 19,12C19,13.65 18.33,15.15 17.24,16.24L15.83,14.83C16.55,14.11 17,13.11 17,12C17,10.89 16.55,9.89 15.83,9.17L17.24,7.76M13,10A2,2 0 0,1 15,12A2,2 0 0,1 13,14A2,2 0 0,1 11,12A2,2 0 0,1 13,10M11.5,1A2.5,2.5 0 0,1 14,3.5V8H12V4H3V19H12V16H14V20.5A2.5,2.5 0 0,1 11.5,23H3.5A2.5,2.5 0 0,1 1,20.5V3.5A2.5,2.5 0 0,1 3.5,1H11.5Z" />
        </svg>
    : </span> 【phone】</div>
    <div style="font-size: 12px;vertical-align: middle;"><span style="display: inline-block;text-align: right;font-size: 14px;">
    <svg style="width:16px;height:16px;color:#00328f;" viewBox="0 0 24 24">
        <path fill="currentColor" d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
    </svg>
    :</span> 【email】</div>
    <div style="font-size: 12px;margin-bottom: 10px;vertical-align: middle;"><span style="display: inline-block;text-align: right;font-size: 14px;">
    <svg style="width:16px;height:16px;color:#00328f;" viewBox="0 0 24 24">
        <path fill="currentColor" d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
    </svg>
    :</span> 【facebook】</div>
    <p style="border-bottom: 1px solid #00328f;"></p>
</div>`;

export const emails = [
  '@Gmail.com',
  '@iCloud.com',
  '@Outlook.com',
  '@Mail.com',
  '@QQ.com',
];

export const ruleData = {
  email: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
};

export const version = '1.10.1010';

export const versionUrl =
  'https://app.tigercv.cc/app/TigerCV_PH_v1.10.1010.1820.apk';
