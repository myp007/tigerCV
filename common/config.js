export default {
  baseUrl: 'm.tigercv.cc', //'/apitest', // 启动 swoole 服务的域名，无需填写协议和端口
  appUrl: 'https://app.tigercv.cc/v1_0',
  resumeUrl: 'https://app.tigercv.cc/face/#/resume?t=', //正式服发送简历路径
  httpsSwitch: true, // 是否启用https协议(默认关，小程序和app正式版必开，且需要参考文档创建wss服务)
  imgUrl: 'https://app.tigercv.cc',
  hcUrl: 'https://api.hirechat.cc/',

  // baseUrl: '192.168.211.195',//'/apitest', // 启动 swoole 服务的域名，无需填写协议和端口
  // appUrl: 'http://192.168.211.195:8001/v1_0',
  // resumeUrl : 'http://192.168.211.195:8001/face/#/resume?t=' ,//测试服发送简历路径
  // httpsSwitch: false, // 是否启用https协议(默认关，小程序和app正式版必开，且需要参考文档创建wss服务)
  // imgUrl:'http://192.168.211.195:8001',
  // hcUrl:'http://192.168.211.195:8002/',

  globalUrl: 'https://app.tigercv.cc/', //版本信息，必要的
  // appUrl: '/apitest',
  httPort: '', // HTTP端口，若为默认的80端口则无需填写，请注意是`http`端口，不是`ws`端口，ws请在后台插件配置中进行配置
  // 无需登录的api
  noNeedLogin: [
    '/api/sms/send',
    '/addons/fastim/api.user/login',
    '/addons/fastim/api.user/register',
    '/addons/fastim/api.user/captchaPre',
    '/member/sendmail/code',
    '/member/login/email',
  ],
};
