/*存取API localStorage存取*/
export function saveToLocal(id, key, value) {
	let seller = window.localStorage.__seller__;//必须指明是window下
	if (!seller) {//第一次存取
		seller = {};//空的对象
		seller[id] = {};//id新建一个对象 
		seller[id][key] = value;//保存对象
	} else {//如果已经存取过了 执行下面的逻辑
		seller = JSON.parse(seller);//解析
		if (!seller[id]) {//如果没有保存这个商家
			seller[id] = {};//则=对象
		}
	}
	seller[id][key] = value;
	window.localStorage.__seller__ = JSON.stringify(seller);//存取一个字符串不能存取对象 将对象解析为字符串
};
//读
export function loadFromLocal(id, key, def) {
	let seller = window.localStorage.__seller__;
	if (!seller) {
		return def;//没有就返回默认值
	}
	seller = JSON.parse(seller)[id];
	if (!seller) {
		return def;
	}
	let ret = seller[key];
	return ret || def;
};
