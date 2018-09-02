let tool = {
  getParams: function () {
    var url = window.location.hash
    var theRequest = {}
    var start = url.lastIndexOf('?') // ios现在是两个问号
    if (start !== -1) {
      var str = url.substr(start + 1)
      var strs = str.split('&')
      for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split('=')[0]] = strs[i].split('=')[1]
      }
    }
    return theRequest
  },
  is_wxBrowser: function () {
    return /MicroMessenger/i.test(navigator.userAgent)
  },
  is_iOS: function () {
    return /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)
  },
  is_android: function () {
    return /android/i.test(navigator.userAgent)
  }
}
export default tool
