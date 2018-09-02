import "./ajax.js";
import "./vue_filter.js";
import auth from "./auth.js";
import config from "../../config";

let util = {
  // 将时间戳转换为时间字符串
  stampToTime(timestamp) {
    "use strict";
    let newDate = new Date()
    newDate.setTime(timestamp * 1000)
    return newDate.format('yyyy-MM-dd')
  },
  // 将字符串或者时间戳转换为Date对象
  parseDate(i){
    "use strict";
    if (typeof i === "number") {
      let newDate = new Date()
      newDate.setTime(i * 1000)
      return newDate
    } else {
      return new Date(i)
    }
  },
  // 将字符串转换为时间戳
  timeToStamp(timeString){
    let timestamp2 = Date.parse(timeString)
    timestamp2 = timestamp2 / 1000
    if (!timestamp2) {
      timestamp2 = 0
    }
    return timestamp2
  },
  buildGetParams(params){
    if (typeof params === "string") {
      return params
    }
    if (!params) {
      return params
    }
    let result = ""

    // 特殊处理page
    if (params['page']) {
      let page = params['page']
      delete params['page']
      let limit = page.size
      params['limit'] = limit
      params['offset'] = this.buildOffsetByPage(page.curr, limit)
    }

    params = this._filterParams(params)

    for (let key in params) {
      result += "&" + encodeURI(key) + "=" + encodeURI(params[key])
    }
    return result.substr(1)
  },
  buildPostParams(params){
    if (typeof params === "string") {
      return params
    }
    if (!params) {
      return params
    }
    params = this._filterParams(params)
    return JSON.stringify(params)
  },
  _filterParams(params){
    let temp = {}
    for (let key in params) {
      key = key.replace(" ", "")
      let value = params[key]
      let index = key.indexOf("|")
      if (index !== -1) {
        let filter = key.substr(index + 1)
        key = key.substr(0, index)
        value = this._transformValue(value, filter)
      }
      temp[key] = value
    }
    return temp
  },
  // stampToTime:时间戳转时间字符串, timeToStamp:时间字符串转时间戳
  // dateToTimeString(format):date对象转时间字符串(fomat:yyyy-MM-dd)
  // dateToTimestamp:date转时间戳,
  // timestampToDate:时间戳转date
  // number:parseFloat
  // json:json字符串与json对象互转
  _transformValue(value, rule){
    let rr = rule.split('(')
    let ruleValues = null
    rule = rr[0]
    if (rr.length === 2) {
      ruleValues = rr[1].substr(0, rr[1].length - 1).split(',')
    }
    switch (rule) {
      case "stampToTime":
        value = this.stampToTime(value)
        break
      case "timeToStamp":
        value = this.timeToStamp(value)
        break
      case "dateToTimeString":
        value = value.format(ruleValues ? ruleValues[0] : "yyyy-MM-dd")
        break
      case "dateToTimestamp":
        value = Date.parse(value) / 1000
        break
      case "timestampToDate":
        let timestamp = value
        value = new Date()
        if (timestamp){
          value.setTime(timestamp * 1000);
        }
        break
      case "number":
        try {
          value = parseFloat(value)
          if (isNaN(value)) {
            value = 0
          }
        } catch (e) {
          value = 0
        }
        break
      case "json":
        if (typeof value === "string") {
          value = JSON.parse(value)
        } else {
          value = JSON.stringify(value)
        }
        break
      case "query":
        if (Array.isArray(value)) {
          value = encodeURIComponent(value.join(';'))
        }
        break
    }

    return value
  },
  buildOffsetByPage(toPage, limit) {
    if (!toPage) {
      return 0
    }
    return (toPage - 1) * limit
  },
  downloadFileUrl(fileId){
    "use strict";
    let xtoken = sessionStorage.getItem("token")
    return ENV.HOST_URL + "/asset/" + fileId + "?_token=" + xtoken
  },
  buildFileUrl(fileId){
    "use strict";
    return ENV.HOST_URL + "/asset/" + fileId + "?_token=" + sessionStorage.getItem("token")
  },
  previewFile(fileId){
    "use strict";
    let url = this.buildFileUrl(fileId)
    eventBus.$emit("preview", url)
  },
  fileUpload(url, data, callback, before){
    "use strict";
    let oData = new FormData();
    for (let key in data) {
      oData.append(key, data[key]);
    }

    let oReq = new XMLHttpRequest();
    let xtoken = sessionStorage.getItem("token")
    oReq.open("POST", url, true);
    if (before) {
      before(oReq)
    }
    if (xtoken) {
      oReq.setRequestHeader("Authorization", xtoken);
    }
    oReq.onprogress = (e) => {
      if (e.lengthComputable) {
        let p = e.loaded / e.total * 100
        callback("progress", p)
      }
    }
    oReq.onload = (e) => {
      if (oReq.status !== 200) {
        callback("error", oReq.status)
      } else {
        callback("success", oReq.response)
      }
    }
    oReq.send(oData);
  },
  // unused
  // 传入两个时间,计算出中间的月份
  splitTimeMouth(startTime, endTime){
    "use strict";
    startTime = startTime.substr(0, 7)
    endTime = endTime.substr(0, 7)

    let sT = new Date(startTime)
    let eT = new Date(endTime)

    if (sT.format('yyyy-MM') === eT.format('yyyy-MM')) {
      return [sT.format('yyyy-MM')]
    }
    if (sT > eT) {
      return this.splitTimeMouth(endTime, startTime)
    }
    let result = []
    result.push(sT.format('yyyy-MM'))

    while (true) {
      sT.setMonth(sT.getMonth() + 1)
      result.push(sT.format('yyyy-MM'))
      if (sT.format('yyyy-MM') === endTime) {
        break
      }
    }

    return result
  },
  urlQueryDecoder: {
    // 替换/添加指定的键值对
    merge(src, key, value){
      let start = src.indexOf(key + "=")
      if (start === -1) {
        return src + "&" + key + "=" + value
      }

      let end = src.substr(start).indexOf("&")
      if (end === -1) {
        end = src.length
      }

      return src.substr(0, start) + key + "=" + value + src.substr(end)
    },
    get(src, key){
      let vs = src.split(key + "=")
      if (vs.length === 1) {
        return null
      }
      return vs[1].split("&")[0]
    },
    getQuery(path){
      if (path.indexOf("?") === -1) {
        return ""
      }
      return path.split("?")[1]
    }
  },
  // transform obj
  objectTransform(obj, rules){
    obj = _.cloneDeep(obj)

    for (let key in rules) {
      let rule = rules[key]
      if (rule === '-') {
        delete obj[key]
      } else if (typeof rule === 'function') {
        obj[key] = rule(obj[key])
      } else {
        obj[key] = this._transformValue(obj[key], rule)
      }
    }
    return obj
  },
  // 如果src中没有obj中的字段，则将src的字段赋值为obj的值。
  // 因为vueJs在没有字段的情况下会无法设置getter setter
  SetFieldsIfUndefined(src,obj){
    for (let key in obj) {
      if (typeof src[key] === 'undefined'){
        src[key] = obj[key]
      }
    }
  },
  uploadUrl(){
    let fileHost = config.env.FILE_HOST
    return fileHost + "/uploadPic/uploadPic?_token=" + auth.get()
  },
  getProjectName(){
    return config.env.PROJECT_NAME
  },
}

let freeGlobal = typeof global === 'object' && global && global.Object === Object && global;
let freeSelf = typeof self === 'object' && self && self.Object === Object && self;
let root = freeGlobal || freeSelf || Function('return this')()

root.util = util

//
Date.prototype.format = function (format) {
  let date = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S+": this.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (let k in date) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1
        ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
    }
  }
  return format;
}
