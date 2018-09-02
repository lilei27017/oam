import axios from 'axios'
import qs from 'qs'
import md5 from 'md5'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
const root = process.env.API_ROOT
let getSessionIdUrl = root + 'common/get-sid'
let getVideoDetailUrl = root + 'common/get-h5-video-info'
let praise = root + 'common/click-praise'
let statics = root + 'case/pv'
let shareCb = root + 'case/share-case'

// 签名
const makeSign = (obj) => {
  // 将value值都改为字符串，如果数组长度为0，则移除该属性
  // if (obj.hasOwnProperty('videos') && obj.videos.length > 0) {
  //   for (var i = 0; i < obj.videos.length; i++) {
  //     convertToStr(obj.videos[i]);
  //   }
  //   obj.videos = JSON.stringify(obj.videos);
  // }
  // if (obj.hasOwnProperty('layers') && obj.layers.length > 0) {
  //   for (var i = 0; i < obj.layers.length; i++) {
  //     convertToStr(obj.layers[i]);
  //   }
  //   obj.layers = JSON.stringify(obj.layers);
  // } else {
  //   delete obj.layers;
  // }
  // if (obj.hasOwnProperty('voices') && obj.voices.length > 0) {
  //   for (var i = 0; i < obj.voices.length; i++) {
  //     convertToStr(obj.voices[i]);
  //   }
  //   obj.voices = JSON.stringify(obj.voices);
  // } else {
  //   delete obj.voices;
  // }
  //
  // convertToStr(obj);

  // 对象转化为数组
  let arr = []
  for (let item in obj) {
    arr.push(item + '=' + obj[item])
  }
  // 按字典排序
  arr = arr.sort()
  // 数组转化为字符串
  let str = arr.join('&')
  // 大小写
  str = str.toLocaleUpperCase()
  // console.log('sign before md5:');
  // console.log(str);
  const first_md5 = md5(str + 'JPER_API')
  return md5(first_md5.substring(0, 30))
}

const signAxios = function (obj) {
  const time = Date.parse(new Date()) / 1000
  obj.type = obj.type || 'POST'
  obj.data = obj.data || {}
  obj.data.time = time
  obj.data.sign = makeSign(obj.data)
  if (obj.type.toUpperCase() === 'POST') {
    return axios({
      'url': obj.url,
      'method': 'POST',
      'data': qs.stringify(obj.data)
      // 'headers': {
      //   // 'Content-Type': 'application/x-www-form-urlencoded',
      //   'Accept': '*/*'
      // }
    })
  } else {
    return axios({
      'url': obj.url,
      'method': 'GET',
      'params': obj.data
      // 'headers': {
      //   // 'Content-Type': 'application/x-www-form-urlencoded',
      //   'Accept': '*/*'
      // }
    })
  }
}
let service = {
  shareCb: function (data) {
    return signAxios({
      'url': shareCb,
      'type': 'POST',
      'data': data
      // 'headers': {
      //   // 'Content-Type': 'application/x-www-form-urlencoded',
      //   'Accept': '*/*'
      // }
    })
  },
  getSessionId: function () {
    // return axios.get(getSessionIdUrl)
    return signAxios({
      'url': getSessionIdUrl,
      'data': {},
      'type': 'GET'
    })
  },
  getVideoDetail: function (param) {
    return signAxios({
      'url': getVideoDetailUrl,
      'data': param,
      'type': 'GET'
    })
  },
  praise: function (param) {
    return signAxios({
      'url': praise,
      'type': 'POST',
      'data': param
      // 'headers': {
      //   // 'Content-Type': 'application/x-www-form-urlencoded',
      //   'Accept': '*/*'
      // }
    })
  },
  getPvStatics: function (data) {
    return signAxios({
      'url': statics,
      'type': 'POST',
      'data': data
      // 'headers': {
      //   // 'Content-Type': 'application/x-www-form-urlencoded',
      //   'Accept': '*/*'
      // }
    })
  }
}
export default service
