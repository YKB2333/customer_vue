import moment from 'moment';
import numbro from 'numbro';
import pinyin from 'pinyin'
import { escapeRegExp } from 'lodash';

export function getUrlParam(url, key) {
  return decodeURIComponent((new RegExp('[?|&]' + key + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || [, ""])[1].replace(/\+/g, '%20')) || null
}
export function getUrlParamAll(url, key) {
  if(url && key ){
    var reg = new RegExp('#/','')
    var param = url.split(`${key}=/`)[1].replace(reg,'')
    return param || null
  }
}

export function delUrlParam(url, key) {
  let str = '';
  if (url.indexOf('?') != -1) {
    str = url.substr(url.indexOf('?') + 1);
  } else {
    return url;
  }
  let arr = '';
  let returnurl = '';
  if (str.indexOf('&') != -1) {
    arr = str.split('&');
    for (let i in arr) {
      if (arr[i].split('=')[0] != key) {
        returnurl = returnurl + arr[i].split('=')[0] + '=' + arr[i].split('=')[1] + "&";
      }
    }
    return url.substr(0, url.indexOf('?')) + '?' + returnurl.substr(0, returnurl.length - 1);
  } else {
    arr = str.split('=');
    if (arr[0] == key) {
      return url.substr(0, url.indexOf('?'));
    } else {
      return url;
    }
  }
}

export function isSameDay(aTimestamp, bTimestamp) {
  let aStr = moment(aTimestamp).format('YYYY-MM-DD');
  let bStr = moment(bTimestamp).format('YYYY-MM-DD');
  // console.log(aStr, bStr, '是否同一天：', moment(aStr).isSame(bStr, 'day'));
  return moment(aStr).isSame(bStr, 'day');
}

export function timestampFormat(timestamp, format) {
  return moment(timestamp).format(format);
}

// 获取本周第一天和最后一天{start: '', end: ''}
export function getPreWeekStartEnd() {
  let start, end;
  let weekOfday = parseInt(moment().format('d')); // 周几
  // if (weekOfday === 0) {
  //   start = moment().subtract(6, 'days').valueOf() // 本周一日期
  //   end = moment().valueOf() // 当前日期即周日
  // } else if (weekOfday === 6) {
  //   start = moment().subtract(6, 'days').valueOf() // 本周一日期
  //   // end = moment().add(1, 'days').valueOf() // 周日日期
  //   end = moment().valueOf() // 当前日期即周六
  // } else {
  //   start = moment().startOf('week').subtract(6, 'days').valueOf() // 上周一日期
  //   end = moment().startOf('week').valueOf() // 上周日日期
  // }
  if (weekOfday === 0) {
    start = moment().subtract(6, 'days').valueOf() // 本周一日期
    end = moment().valueOf() // 当前日期即周日
  } else {
    start = moment().startOf('week').add(1, 'days').valueOf() // 本周一日期
    end = moment().startOf('week').add(7, 'days').valueOf() // 本周日日期
  }
  let date = {
    "start": start,
    "end": end
  }
  return date
}

export function uniqueArr(arr, key) {
  // console.log(arr)
  let obj = {}
  let result = []
  result = arr.reduce((cur, next) => {
    obj[next[key]] ? '' : obj[next[key]] = true && cur.push(next);
    return cur;
  }, [])
  return result
}

export function openWxContacts(mode, selectedUserIds, callback) {
  wx.invoke("selectEnterpriseContact",
    {
      fromDepartmentId: -1, // 必填，表示打开的通讯录从指定的部门开始展示，-1表示自己所在部门开始, 0表示从最上层开始
      mode: mode, // 必填，选择模式，single表示单选，multi表示多选
      type: ["department", "user"], // 必填，选择限制类型，指定department、user中的一个或者多个
      // "selectedUserIds": ["id1","id2"],  // 非必填，已选用户ID列表。用于多次选人时可重入，single模式下请勿填入多个id
      selectedUserIds: selectedUserIds
    },
    (res) => {
      // console.log(res)
      if (res.err_msg == "selectEnterpriseContact:ok") {
        if (typeof res.result == "string") {
          res.result = JSON.parse(res.result) //由于目前各个终端尚未完全兼容，需要开发者额外判断result类型以保证在各个终端的兼容性
        }
        let userList = res.result.userList
        callback(userList)
      } else {
        callback([])
      }
    }
  );
}

// 深克隆
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

export function isEmpty(obj) {
  if (Array.isArray(obj) && obj.length == 0) {
    return true
  } else if (typeof obj == 'undefined' || obj == null || obj == '') {
    return true
  } else {
    return false
  }
}

export function delayer(action, delay = 1000) {
  let timer = -1
  return nv => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      action(nv)
    }, delay)
  }
}

// 文件大小格式化
export function formatFileSize(fileSize) {
  if (fileSize < 1024) {
    return fileSize + 'B';
  } else if (fileSize < (1024 * 1024)) {
    var temp = fileSize / 1024;
    temp = temp.toFixed(2);
    return temp + 'KB';
  } else if (fileSize < (1024 * 1024 * 1024)) {
    var temp = fileSize / (1024 * 1024);
    temp = temp.toFixed(2);
    return temp + 'MB';
  } else {
    var temp = fileSize / (1024 * 1024 * 1024);
    temp = temp.toFixed(2);
    return temp + 'GB';
  }
}
export function formatDate2(date, format) {
  if (!date) return ''
  let formatNumber = (n) => {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's']
  var returnArr = []

  returnArr.push(date.getFullYear())
  returnArr.push(formatNumber(date.getMonth() + 1))
  returnArr.push(formatNumber(date.getDate()))

  returnArr.push(formatNumber(date.getHours()))
  returnArr.push(formatNumber(date.getMinutes()))
  returnArr.push(formatNumber(date.getSeconds()))

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i])
  }
  return format
}
// 时间格式化
export function formatDate(number, format) { // formatDate('Y/M/D h:m:s')
  if (!number) return ''
  let formatNumber = (n) => {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's']
  var returnArr = []

  var date = new Date(number)
  returnArr.push(date.getFullYear())
  returnArr.push(formatNumber(date.getMonth() + 1))
  returnArr.push(formatNumber(date.getDate()))

  returnArr.push(formatNumber(date.getHours()))
  returnArr.push(formatNumber(date.getMinutes()))
  returnArr.push(formatNumber(date.getSeconds()))

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i])
  }
  return format

}
// 判断是否移动端
export function isMobile() {
  let userAgent = navigator.userAgent
  if ((userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
    return true
  } else {
    return false
  }
}
// 判断是否属于图片类型
export function isImageType(url) {
  console.log(/\.(gif|jpg|jpeg|bmp|png|bmp|pic)$/.test(url) ? '图片类型' : '非图片类型')
  return /\.(gif|jpg|jpeg|bmp|png|bmp|pic)$/.test(url)
}

export function toThousandFilter(number, mantissa = 2) {
  if (number == null || number == undefined) {
    let result = "0";
    if (mantissa > 0) {
      result += '.'
      for (var i = 0; i < mantissa; i++) {
        result += "0"
      }
    }
    return result;
  }
  let formattedData = (number,percent) => parseFloat(number / percent).toString().split('.')
  let lengths = parseInt(number).toString().length
  if(lengths == 8){
    var num = formattedData(number,10000000); 
    if(num[1]){
      return `${num[0]}.${num[1].substr(0,2)}千万`; 
    } else {
      return `${num[0]}千万`; 
    }
  }
  if(lengths >= 9){
    var num = formattedData(number,100000000); 
    if(num[1]){
      return `${num[0]}.${num[1].substr(0,2)}亿`; 
    } else {
      return `${num[0]}亿`; 
    }
  }
  return numbro(number).format({
    thousandSeparated: true,
    mantissa: mantissa
  })
}

export function toOrdinalFilter(number) {
  if (number == null || number == undefined) {
    return null;
  }
  return numbro(number).format({
    output: "ordinal"
  })
}

export function toPercentFilter(number, mantissa = 2, forceSign = true) {
  if (number == null || number == undefined) {
    return null;
  }
  return numbro(number).format({
    output: "percent",
    mantissa: mantissa,
    forceSign
  })
}

/**
 * 打印最近时间
 * 小于一分钟，显示“***秒前”
 * 小于一小时，显示“***分钟前”
 * 小于一天，显示“***小时前”
 * 否则显示：**月**日
 */
export function showRecentTime(timestamp) {
  let date = new Date(timestamp)
  let nowDate = new Date()
  if (date.getFullYear() === nowDate.getFullYear() && date.getMonth() === nowDate.getMonth() && date.getDate() === date.getDate()) {
    let time = (nowDate.getTime() - date.getTime()) / 1000
    if (time <= 60) {
      return Math.floor(time) + "秒前"
    } else {
      time = time / 60
      if (time < 60) {
        return Math.floor(time) + "分钟前"
      } else {
        time = time / 60
        if (time < 24) {
          return Math.floor(time) + "小时前"
        } else {
          return date.getMonth() + 1 + '月' + date.getDate() + '日'
        }
      }
    }
  } else {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
  }
}

// 获取首字母,数字、特殊符号返回#
export function getFirstLetter(str) {
  if (!str) return null;
  str = str.trim();
  // 英文字母
  var isEnglish = new RegExp(/^[A-Za-z]/);
  if (isEnglish.test(str)) {
    return str.substr(0, 1).toUpperCase()
  }
  //汉字
  var isChinese = new RegExp(/^[\u4e00-\u9fa5]/);
  if (isChinese.test(str)) {
    let arr = pinyin(str, {
      style: pinyin.STYLE_FIRST_LETTER, // 设置拼音风格
      heteronym: false
    });
    return arr[0][0].toUpperCase(); //获取所有字母后转大写
  }
  //特殊字符返回#
  return "#"
}

export function salesFormat(value) {
  // if (!value) return 0
  if (value <= 10000) {
    return value
  } else {
    let n = Math.floor(value / 10000)
    return n + '万+'
  }
}

export function fmoney(s, n) {   //数字化格式 n是小数位
  if(s == undefined || s == null || s == ''){
    return '0.00'
  }
  n = n > 0 && n <= 20 ? n : 2;  
  s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";  
  var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];  
  let t = "";  
  for (let i = 0; i < l.length; i++) {  
    if(s>0){
      t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");  
    }else{
      t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "" : "");  
    }
  }  
  return t.split("").reverse().join("") + "." + r;  
}  
export function isMac() { 
  return  /macintosh|mac os x/i.test(navigator.userAgent); 
}
export function formattedMoneyData( number,mantissa = 2,) {
  if(!Number(number)) return 0
  if(Math.abs(number).toString().split('.')[0].length < 5){
    number = number / 10000
    return numbro(number).format({
      thousandSeparated: true,
      mantissa: 4
    })
  }
  number = number / 10000
  return numbro(number).format({
    thousandSeparated: true,
    mantissa: mantissa
  })
}

export function groupByList(data, sameKey = 'startDate') {
  if (!data || data.length === 0) {
    return []
  } else {
    let isOnDay = (a, b) => isSameDay(a[sameKey], b[sameKey])
    let create = e => {
      let newObj = {}
      newObj['list'] = [e]
      newObj[sameKey] = e[sameKey]
      return newObj
    }
    let getNew = old => old.reduce((total, current) => {
      let hasItem = total.some(item => {
        let temp = isOnDay(item, current)
        if (temp) item.list.push(current)
        return temp
      })
      if (!hasItem) total.push(create(current))
      return total
    }, [])
    return getNew(data)
  }
}

export function formatWeekText(timestamp) {
  const arr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  let day = new Date(timestamp).getDay()
  return arr[day]
}

export function getDistance(lat1, lng1, lat2 , lng2) {
  function  Rad(d){
    return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式。
  }
  var RadLat1 = Rad(lat1);
  var RadLat2 = Rad(lat2);
  
  var a = RadLat1 - RadLat2;
  var  b = Rad(lng1) - Rad(lng2);
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
  Math.cos(RadLat1)*Math.cos(RadLat2)*Math.pow(Math.sin(b/2),2)));
  s = s *6378.137 ;// EARTH_this.RadIUS;
  s = Math.round(s * 10000) / 10; //输出为公里
  //s=s.toFixed(4);
  // this.distance = s * 1000 ;
  return s  ;
}


export default { fmoney,salesFormat,formatDate, toThousandFilter,formattedMoneyData, toOrdinalFilter, toPercentFilter, getFirstLetter, formatWeekText, getDistance }