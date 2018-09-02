<template>
  <div class="list">
    <div class="tab border-1px">
        <router-link to="/index" class="tab-item" active-class="select-list"></router-link>
      <div class="separate"></div>
        <router-link to="/commit" class="tab-item submit" active-class="select-submit"></router-link>
    </div>

    <div class="item" v-for="(item,index) in items">
      <div src="" @click="toDetail(index)" class="video-bg" :style="{backgroundImage: 'url(' + item.pic + ')'}"></div>
      <div class="title-bg" v-show="state == 0">
        <p class="title">{{item.video_name}}</p>
      </div>
      <div class="duration">{{Math.round(item.dub_number)}}</div>
      <a @click="toDetail(index)">
        <img v-show="state === 0" class="want" width="100%" :src="want" alt="">
      </a>
    </div>
    <div class="footer">
      暂时没有比赛了，休息一下吧～
    </div>
  </div>
</template>

<script>
  import want from '../assets/img/2want.png';
  export default {
    data(){
      return{
        want,
        state: 0,
        items: [],
        item:{
          video_url: '',
          video_name: '',
          pic: '',
          dub_number: '',
          img: ''
        },
      }
    },
    mounted(){

      var _hmt = _hmt || [];
      // 百度统计统计代码引入1
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?308d0caa51d6b23a24e9d36d9fe76e95";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
      })();
      // 百度统计统计代码引入2
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?aa258c40092e999f7f072b6f44b24773";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
      })();

      setTimeout( ()=> {
        try {
         window._hmt.push(['_trackPageview','/record/index'])
        } catch (err) {
          console.log('hmt empty'+err)
        }
      },2000)
      // const Url = window.location.search
      const url = window.location.href
      let index = url.indexOf('?')
      let Url = index == -1 ? '' : url.substr(index)
      let code = 'qrcode'
      //获取qrcode
      function getSearchString(key,Url) {
        // 获取URL中?之后的字符
        var str = Url;
        str = str.substring(1,str.length);
        // 以&分隔字符串，获得类似name=xiaoli这样的元素数组
        var arr = str.split("&");
        var obj = new Object();
        // 将每一个数组元素以=分隔并赋给obj对象
        for(var i = 0; i < arr.length; i++) {
          var tmp_arr = arr[i].split("=");
          obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
        }
        return obj[key];
      }
      // console.log(getSearchString(code,Url))
      var qrcode = getSearchString(code,Url)
      if(qrcode){
        var X = qrcode.indexOf('#')
        if(X !== -1){
          qrcode = qrcode.substring(0,X)
        }
      }else {
        qrcode = ''
      }
      sessionStorage.setItem('world_qrcode', qrcode)

      this.getList()
      this.statistics()
      // this.baidu_statistics()
      // this.baidu_statistics2()
      const wxconfig = new window.WxConfig();
      wxconfig.init({
        appid: 'wx7cb1dcbbccffa099',
        url: window.location.href.split("#")[0],
        title: "一秒钟变身专业解说员",
        desc: "用你的声音征服世界杯",
        link: window.location.href.split("#")[0],
        imgUrl: 'http://h.ottcn.com/preview/fenxiang.png',
        SUCCESS_CALLBACK: this.statistics.bind(this,true)
      });
    },
    methods:{
      statistics(share) {
        var op = share ? 'share' : 'pv';
        var pt = sessionStorage.getItem('world_qrcode') || "";
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'http://d.ottcn.com/qmjs/api/statistics_pv.php?wz=record_list&op=' + op + '&pt=' + pt;     //填自己的js路径
        $('body').append(script);
      },
      getList(){
        let token = localStorage.getItem('WC_token')
        this.axios.get('http://d.ottcn.com/qmjs/api/index.php?token='+token).then((res) =>{
          if(res.data.code == -1001){
            localStorage.removeItem('WC_token')
            localStorage.removeItem('WC_token')
            window.location.reload()
          }else{
            this.items = res.data.data
            this.dub_number = this.items.dub_number
          }
        }).catch((err) => {
          console.log("err="+err)
        })
      },
      toDetail(index){
        let material_id = this.items[index].material_id
        // let id = this.items[index].id
        // this.$router.push({
        //   path: './dub',
        //   query:{
        //     material_id: material_id,
        //     id: id
        //   }
        // })
        const host = window.location.host
        const pathname = window.location.pathname
        window.location.href = 'http://'+host+pathname+'#/dub?material_id='+material_id
      },
    }
  }
</script>
<style type="text/scss" slot="slot">
  .list{
    width: 100%;
    height: 100%;
    margin-top: 0.3rem;
    position: relative;
  }
  .tab{
    /*display: flex;*/
    justify-content: space-between;
    -webkit-justify-content: space-between;
    position: fixed;
    width: 100%;
    height: 0.98rem;
    bottom: 0;
    left: 0;
    z-index:110;
  }
  .select-list{
    position: absolute;
    left: 0;
    bottom: 0;
    background: url("../assets/img/2list-select.png");
    background-size: 100%;
    width: 3.75rem;
    height: 0.98rem;
  }
  .separate{
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translate(-50%);
    width: 0.02rem;
    height: 0.98rem;
    margin: 0 auto;
    background-color: #e44222;
    z-index: 150;
  }
  .submit{
    position: absolute;
    right: 0;
    bottom: 0;
    background: url("../assets/img/2submit.png");
    background-size: 100%;
    width: 3.75rem;
    height: 0.98rem;
  }

  .item{
    width: 6.9rem;
    height: 3.45rem;
    border: solid 0.03rem rgba(255,255,255,0.4);
    border-radius: 0.1rem;
    margin: 0 auto 0.6rem;
    z-index: 1;
    position: relative;
  }
  .video-bg{
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 0.1rem;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .title-bg{
    width: 100%;
    height: 50%;
    line-height: 0.68rem;
    padding: 0 0.16rem;
    box-sizing: border-box;
    position: absolute;
    top: 0;
    border-radius: 0.1rem 0.1rem 0 0;
    @extend .shenglv-1;
    background-image: linear-gradient(0deg, transparent, rgba(13, 14, 15, 0.75));
  }
  .shenglv-1{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .title{
    font-size: 0.34rem;
    color: #ffff;
  }
  .duration{
    position: absolute;
    right: 0.4rem;
    bottom: 0.5rem;
    width: 0.7rem;
    height: 0.3rem;
    line-height: 0.3rem;
    padding-right: 0.1rem;
    color: #fff;
    text-align: right;
    border-radius: 0.3rem;
    font-size: 0.24rem;
    background: rgba(0,0,0,0.6) url("../assets/img/4luyinrenshu.png") no-repeat;
    background-size: 0.2rem 0.2rem;
    background-position: 0.1rem 0.05rem;
  }
  .want {
    position: absolute;
    width: 2.6rem;
    z-index:1000;
    bottom: 0;
    left: 50%;
    transform: translate(-50%,50%);
    -webkit-transform: translate(-50%,50%);
  }
  .footer{
    margin-bottom: 1rem;
    height: 1.5rem;
    line-height: 1.5rem;
    width: 100%;
    font-size: 0.3rem;
    text-align: center;
  }
</style>
