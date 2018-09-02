<template>
  <div>
    <div class="description">
      <p class="welcome">全民解说员</p>
      <p>配音总动员</p>
      <div @click="toList" class="want">
      </div>
    </div>
  </div>
</template>

<script>
  import want from '../assets/img/want.png'
  import WxConfig from '../../static/js/lib/wx_config.js'
  import config from '../assets/config'
  import {appID} from "../config"
export default {
  name: 'HelloWorld',
  data () {
    return {
      want,
      selectStatus:{
      },
    }
  },
  mounted () {
    let _this = this;
    let callbackurl = window.location.href;
    if( this.isWeixinBrowser() ) {
      this.Aouth( _this, callbackurl );
    }
  },
  methods: {
    toList(){
      this.configWXjssdk()
      let _this = this;
      let callbackurl = window.location.href;
      if( this.isWeixinBrowser() ) {
        this.Aouth( _this, callbackurl );
      }
    },
    configWXjssdk () {
      const wxconfig = new WxConfig()
      // 注册在window
      window.wxconfig = wxconfig
    },

    isWeixinBrowser: function(){
      return /micromessenger/.test(navigator.userAgent.toLowerCase())
    },
    Aouth: function( scope, callbackurl ){
      let _this = scope;
      let LOCAL_PARAM = {};
      let _params = _this.GetParams();
      let uuid = localStorage.getItem('WC_uuid') || _params['uuid'];
      let code = _params['code'];
      // var url = this.urlDel(code);
      // window.history.pushState({}, "", url);
      // urlDel(name){
      //   var loca = window.location.href;
      //   return loca.replace(name + '=', 'un=');
      // }
      LOCAL_PARAM['appid'] = appID;
      LOCAL_PARAM['uuid'] = localStorage.getItem('WC_uuid');
      LOCAL_PARAM['nickname'] = localStorage.getItem('WC_nickname');
      LOCAL_PARAM['head_image'] = localStorage.getItem('WC_head_image');

      if (!uuid) {
        if (!code) {
          window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + LOCAL_PARAM['appid'] + "&redirect_uri=" + encodeURIComponent(callbackurl) + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
        } else {
          this.axios.get(config.host + config.getAccessToken, {params: {code: code}}).then((response)=>{
            console.log(JSON.stringify(response.data))
            if( response.data.code == 0 ) {
              let token = response.data.data.token;
              let uuid = response.data.data.uuid;
              let head_image = response.data.data.head_image;
              let nickname = response.data.data.nickname;
              // _this.login( token, uuid, _this );
              localStorage.setItem('WC_uuid', uuid);
              localStorage.setItem('WC_head_image', head_image);
              localStorage.setItem('WC_nickname', nickname);
              localStorage.setItem('WC_token', token);
              this.$router.push('/')
            }
          }).catch( (err) => {
              alert("err="+JSON.stringify(err));
          })
        }
      }
    },
    GetParams: function(){
      let url = window.location.href;
      let theRequest = new Object();
      let start = url.indexOf("?");
      if (start != -1) {
        let str = url.substr(start + 1);
        let strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
      }
      return theRequest;
    },
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .description{
    width: 100%;
    text-align: center;
    color: #fff;
    .welcome{
      margin-top: 3rem;
    }
    p{
      font-size: 0.34rem;
      line-height: 0.8rem;
    }
    .want{
      position: fixed;
      width: 2.6rem;
      height: 0.54rem;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      -webkit-transform: translateX(-50%);
      background: url("../assets/img/want.png") no-repeat;
      background-size: 100% 100%;
      background-position: 0rem 0rem;
    }
  }

</style>
