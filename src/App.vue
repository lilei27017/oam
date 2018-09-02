<template>
  <div id="app">
    <div class="appBG" v-bind:style="bg"></div>
    <router-view/>
  </div>
</template>
<script>
  import bg from './assets/img/bg.png'
  import config from './assets/config'
  import {appID} from "./config"
  export default {
    name: 'App',
    data () {
      return {
        tabList:{
        },
        bg:{
          'background-image': `url(${ bg })`,
          'background-repeat': 'no-repeat',
          'background-size': 'cover'
        }
      }
    },
    mounted(){
      let _this = this;
      let callbackurl = window.location.href;

      // if( this.isWeixinBrowser() ) {
      //   this.Aouth( _this, callbackurl );
      // }

      let token = localStorage.getItem('WC_token')

      if( window.location.host == 'h.ottcn.com' && !token ) {
        this.Aouth( _this, callbackurl );
      }
    },
    methods:{
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
      urlDel(name){
        var loca = window.location.href;
        return loca.replace(name + '=', 'un=');
      },
      Aouth: function( scope, callbackurl ){
        let _this = scope;
        let LOCAL_PARAM = {};
        let _params = _this.GetParams();
        let uuid = localStorage.getItem('WC_uuid') || _params['uuid'];
        let code = _params['code'];
        var url = this.urlDel(code);
        window.history.pushState({}, "", url);

        LOCAL_PARAM['appid'] = appID;
        LOCAL_PARAM['uuid'] = localStorage.getItem('WC_uuid');
        LOCAL_PARAM['nickname'] = localStorage.getItem('WC_nickname');
        LOCAL_PARAM['head_image'] = localStorage.getItem('WC_head_image');
        if (!uuid) {
          if (!code) {
            window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + LOCAL_PARAM['appid'] + "&redirect_uri=" + encodeURIComponent(callbackurl) + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
          } else {
            this.axios.get(config.host + config.getAccessToken, {params: {code: code}}).then((response)=>{
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
              console.log("err="+JSON.stringify(err));
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
<style type="text/scss">
/*#__vconsole{*/
  /*visibility: hidden;*/
  /*}*/
*{
  padding: 0 ;
  margin: 0;
}
html,body{
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  height: 100%;
  color: #ffffff;
  font-family:  Helvetica Neue For Number,Chinese Quote,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif;
}
#app{
  max-width: 750px;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  top: 0;
  left: 0;
}
  .appBG{
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
  }

</style>
