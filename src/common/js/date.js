export function formatDate(date, fmt) {
	if (/(y+)/.test(fmt)) {// 用/(y+)/匹配正则
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
	}//getFullYear 转为年 +‘’ 转为字符串
	let o = {
		'M+': date.getMonth() + 1,//getmonth是0显示的
		'd+': date.getDate(),//天
		'h+': date.getHours(),//时
		'm+': date.getMinutes(),//分
		's+': date.getSeconds()//秒
	};
	for (let k in o) {
		if (new RegExp(`(${k})`).test(fmt)) {//RegExp 构造函数 用for动态构架
			let str = o[k] + '';
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
		}
	}
	return fmt;
};

function padLeftZero(str) {//左边补0
	return ('00' + str).substr(str.length);
}//substr截取
