function setGlobalData(){
	let GlobalData = {
		eliverKey : ['username', 'age', 'occupation', 'salary', 'phone', 'email', 'facebook', 'position_city'],
		eliverTemplate : `<div style="min-height: 100px;text-align: left;font-family: -webkit-body;">
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
	  </div>`,
	  emails:[
		  '@Gmail.com',
		  '@iCloud.com',
		  '@Outlook.com',
		  '@Mail.com',
		  '@QQ.com'
	  ],
	  version:'1.7.0927.1144',
	  versionUrl:'https://app.tigercv.cc/app/TigerCV_PH_v1.7.0927.1144.apk'
	}
	return GlobalData
}

