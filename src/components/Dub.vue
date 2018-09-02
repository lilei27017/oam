<template>
  <div class="dub-cover">
    <div class="dubBg"></div>
    <div class="video-box-bg" :style="{backgroundImage: 'url(' + items.pic + ')'}"><!-- :style="{backgroundImage: 'url(' + items.pic + ')'}"-->
      <div class="video_show_inner " :style="isHidden ? hiddenBox : showVideoBox">
        <video ref="video"
               :poster="items.pic"
               x5-playsinline=""
               playsinline=""
               webkit-playsinline=""
               preload="auto"
               controls
               :preload="true"
        >
        </video>
      </div>
    </div>

    <div v-show="isPlayExample" v-bind:style="example" class="play-example" @click="playExample">
    </div>
    <!--台词-->
    <div class="swiper-container" v-show="!reDubState">
      <div class="swiper-wrapper">
        <div @click="moreLines(fir_index)" class="swiper-slide" v-for="(lineBox,fir_index) in lines" :key="fir_index">
          <div class="lines">
            <div class="linesContent">
              <p class="first" ref="first">{{lineBox[0]}}</p>
              <p class="second" ref="second">{{lineBox[1]}}</p>
            </div>
            <div class="more">
              <img width="100%" src="../assets/img/1more.png" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--音乐风格-->
    <!--<div class="music" v-show="!reDubState">-->
      <!--<ul>-->
        <!--<li @click="musicClickState ? playA(index) : ''" v-for="(item, index) in musicType" :class="{'active':ind == index}">-->
          <!--<div class="music-img" :style="{'background-image': 'url('+item.pic+')'}">-->
          <!--</div>-->
          <!--<p>{{item.music_name}}</p>-->
        <!--</li>-->
      <!--</ul>-->
    <!--</div>-->

    <!--录音点击按钮及滚动条时间-->
    <div class="button">
      <div v-show="!reDubState" class="progress">
        <div class="second">
          <span>{{ time }}</span>/<span>{{ Math.floor(items.time_length) }}</span>
        </div>
        <div class="done" v-bind:style="{width:doneWidth+'rem'}"></div>
        <div class="standard"></div>
        <div class="default-box">
          <div class="default"></div>
        </div>
      </div>
      <div class="handle">
        <div v-show="!reDubState" v-bind:style="dubState ? button : buttonPress" class="make" @click="touchStart">
          <p v-show="dubState">点击开始录音</p>
          <p v-show="!dubState">点击结束录音</p>
        </div>
      </div>

      <div class="handle2"  v-show="reDubState">
        <div @click="reDub" class="reDub">
        </div>
        <div @click="finalSave" class="submitIt">
        </div>
      </div>

    </div>
    <!--显示全部台词-->
    <div class="moreLines" v-show="showMore" v-for="">
      <div class="close" @click="closeLinesBox">
        <img src="../assets/img/1delete.png" alt="">
      </div>
      <div class="lines-content">
        <p v-for="showLinesContent in showLines">{{ showLinesContent }}</p>
      </div>
    </div>
    <!--显示视频合成等待蒙层-->
    <div class="show-submitBtn" v-show="showSubmitBtn">
      <div class="loading-img">
        <img src="../assets/img/loading.png" alt="">
      </div>
      <div class="notice">
        <p>您的录音正在合成中. . . .</p>
      </div>
      <div class="loading-bottom">
        <img src="../assets/img/loadingbottom.png" alt="">
      </div>
    </div>
    <!--用户是否合成蒙层-->
    <div class="choose-box" v-show="showChoose">
      <div class="is-choose" v-bind:style="chooseI">
        <div class="choose-btn">
          <div class="reload" v-bind:style="luyin" @click="reDub"></div>
          <div class="choose" v-bind:style="hecheng" @click="isCompound"></div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  var END;
  var mySwiper;
  var job_id;
  import chooseI from '../assets/img/3kuang.png'
  import example from '../assets/img/6video.png'
  import luyin from '../assets/img/3luyin.png'
  import hecheng from '../assets/img/3hecheng.png'
  import button from '../assets/img/1button.png'
  import buttonPress from '../assets/img/1button-circle.png'
  import buttonPressInner from '../assets/img/1button-press.gif'
  import {MessageBox, Toast} from 'mint-ui';
  export default {
    data() {
      return {
        example:{
          'background-image': `url(${ example })`,
          'background-repeat': 'no-repeat',
          'background-size': 'cover'
        },
        chooseI:{
          'background-image': `url(${ chooseI })`,
          'background-repeat': 'no-repeat',
          'background-size': 'cover'
        },
        luyin:{
          'background-image': `url(${ luyin })`,
          'background-repeat': 'no-repeat',
          'background-size': 'cover'
        },
        hecheng:{
          'background-image': `url(${ hecheng })`,
          'background-repeat': 'no-repeat',
          'background-size': 'cover'
        },
        // musicClickState: true,
        isHidden: false,
        hiddenPicBox: {
          'background-image': `url(${ hecheng })`,
        },
        hiddenBox: {
          'transform': 'translate(0, -5rem)'
        },
        showVideoBox: {
          'visibility': 'visible'
        },
        video_name: '',
        showMore: false,
        showSubmitBtn: false,
        showChoose: false,
        isPlayExample: true, //是否播放示例
        dubState: true,  // 录音状态
        reDubState: false,
        button: {
          'background-image': `url(${ button })`,
          'background-repeat': 'no-repeat'
        },
        buttonPress: {
          'background-image': `url(${ buttonPress }),url(${ buttonPressInner })`,
          'background-repeat': 'no-repeat'
        },
        START: 0,
        time: 0,
        localId: '',
        // ind: 0,
        doneWidth: 0,
        //音乐风格
        // musicType: {
        //   music_url: '',
        //   music_name: '',
        //   pic: '',
        //   mix_url: ''
        // },
        items: {
          music: [],
          video_url: '',
          video_urls: '',
          musics:{},
          time_length: ''
        },
        lines: [],
        lineIndex: 0,

        //台词
        currentTime: 0,
        videoTime: 0,
        len: 0,
        I: 0,

        serverId: '',
        swiperIndex: null,
        showLines: [],
        uniqueid: '',
        localId: '',
        flag: false,
        // isReload: false
      }
    },
    beforeDestroy(){  //返回时执行结束点击并重置
      localStorage.setItem('isReload','')
      this.$refs.video.pause()
      var self = this
      if(self.isDub){
        // console.log('isdub')
        self.touchEnd()
        self.reDub()
      }

    },
    created(){
      const isReload = localStorage.getItem('isReload')
      // console.log(isReload)
      if(!isReload){
        localStorage.setItem('isReload','1')
        location.reload(true)
      }
    },
    mounted() {
      var _hmt = _hmt || [];
      // 百度统计统计代码引入1
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?308d0caa51d6b23a24e9d36d9fe76e95"; // SiteId不能少
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
      })();
      // 百度统计统计代码引入2
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?aa258c40092e999f7f072b6f44b24773";// SiteId不能少
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
      })();

      setTimeout( ()=> {
        try {
          window._hmt.push(['_trackPageview','/record/dub?material_id='+this.$route.query.material_id])
        } catch (err) {
          console.log('hmt empty'+err)
        }
      },2000)

      // console.log('2.1.0')
      this.$refs.video.addEventListener("canplaythrough", ()=> {
        // console.log('canplaythrough')
        this.canplaythrough = true;
        if (this.flag) {
          this.record_inEvnt();
        }
      });

      this.$refs.video.addEventListener("play", ()=> {
        // console.log('play')
        //  播放统计
        let channel_code = sessionStorage.getItem('world_qrcode') ? sessionStorage.getItem('world_qrcode') : '';
        if(this.isPlayExample){
          this.axios.get('http://d.ottcn.com/qmjs/api/statistics_play_v.php?type=2&uuid='+this.items.material_id + '&channel_code=' + channel_code).then( ()=> {
          })
        }
        if (this.flag && this.canplaythrough) {
          this.record_inEvnt();
        }
      });

      this.$refs.video.addEventListener("seeked", ()=> {
        // console.log('seeked')
        if (this.flag) {
          this.record_inEvnt();
        }
      });
      this.getDetail()
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
      // this.baidu_statistics()
      // this.baidu_statistics2()
    },
    methods: {
      record_inEvnt(){
        this.flag = false;
        // this.$refs.video.play();
        this.startRecord()
      },
      //lines scroll
      linesScroll(swpIndex) {
        let index = swpIndex
        this.$refs.video.addEventListener('timeupdate', () => {
          this.currentTime = this.$refs.video.currentTime
          this.len = this.lines[index].length
          let section = this.videoTime / this.len
          this.I = Math.floor(this.currentTime / section)
          if (this.I < this.len) {
            this.$refs.first[index].innerText = this.lines[index][this.I]
            this.$refs.second[index].innerText = this.lines[index][this.I + 1] ? this.lines[index][this.I + 1] : ''
          } else {
            this.$refs.first.innerText = this.lines[index][this.I - 1]
            this.$refs.second.innerText = ''
          }
        })
      },
      //获取详情信息
      getDetail() {
        let query = this.$route.query;
          this.axios.get('http://d.ottcn.com/qmjs/api/start_dub.php?id=' + query.id + "&" + "material_id=" + query.material_id).then((res) => {
          this.items = res.data.data;
          // this.musicType = res.data.data.musics;
          this.lines = this.items.lines;
          this.uniqueid = this.items.material_id
          this.statistics()
          this.videoTime = this.items.time_length
            this.videoTime = Math.floor(this.videoTime)
            this.$refs.video.src = this.items.video_urls
            this.$refs.video.load()
          //获取到数据后才异步初始化swipper
          setTimeout(this.initSwiper, 0)
        })
      },
      //统计
      statistics(share) {
        var op = share ? 'share' : 'pv';
        var pt = sessionStorage.world_qrcode || "";
        var uniqueid = this.uniqueid
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'http://d.ottcn.com/qmjs/api/statistics_pv.php?wz=record&op=' + op + '&pt=' + pt + '&uniqueid='+ uniqueid;     //填自己的js路径
        $('body').append(script);
      },
      //百度统计
      baidu_statistics() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?308d0caa51d6b23a24e9d36d9fe76e95";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
      },
      baidu_statistics2() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?aa258c40092e999f7f072b6f44b24773";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
      },
      //台词
      initSwiper() {
        mySwiper = new Swiper('.swiper-container', {
          pagination: '.swiper-pagination',
          effect: 'coverflow',
          grabCursor: true,
          centeredSlides: true,
          slidesPerView: 'auto',
          coverflow: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true
          }
        });
      },
      // 视频播放，音频播放
      playExample(){

        this.$refs.video.src = this.items.video_urls
        this.$refs.video.muted = false
        this.$refs.video.play()
        this.swiperIndex = mySwiper.activeIndex
        this.linesScroll(this.swiperIndex)
      },
      playV() {
        this.$refs.video.muted = true
        this.$refs.video.play()
        this.swiperIndex = mySwiper.activeIndex
        this.linesScroll(this.swiperIndex)
      },
      // playA(index) {
      //   this.$refs.video.src = this.musicType[index].mix_url
      //   this.$refs.video.play()
      //   this.ind = index;
      // },
      //更多台词
      moreLines(fir_index) {
        this.showLines = this.lines[fir_index]
        this.showMore = true
      },
      closeLinesBox() {
        this.showMore = false;
      },
      //开始录音
      startRecord(){
        var self = this
        if(this.START !== 0){
          return false
        }else{
          this.START = new Date().getTime();
          this.$refs.video.muted = true;
          wx.startRecord({
            success: function () {
              console.log('recordSuccess')
              localStorage.rainAllowRecord = 'true';
              self.playV()
              self.dubState = false
              self.times()
              //   const video = self.$refs.video
              // video.play()
              window.doneWidth = setInterval(() => {
                self.doneWidth = self.doneWidth + 0.22
              }, 1000)
            },
            cancel: function () {
              window.location.reload()
            },
            fail: function (res) {
              // console.log('1===' + JSON.stringify(res));
            }
          });
        }
      },
      touchStart() {
        if (!this.isDub) {//是否第一次点击
          // console.log('touchStart')
          this.isDub = true;
          this.isPlayExample = false
          if(!this.flag){
            this.flag = true;
            this.$refs.video.muted = true;
            if (this.$refs.video.currentTime == 0) {
              this.$refs.video.play();
              // this.swiperIndex = mySwiper.activeIndex
              // this.linesScroll(this.swiperIndex)
            } else {
              this.$refs.video.currentTime = 0;
            }
          }
        } else {
          this.touchEnd()
        }
      },
    //
      touchEnd() {
        console.log('end')
        this.$refs.video.pause();
        this.$refs.video.currentTime = 0
        this.showMore = false;
        this.isDub = false;
        this.dubState = true;
        clearInterval(ti)
        clearInterval(doneWidth)
        END = new Date().getTime();
        if ((END - this.START) < 2000) {//小于2s，不录音
          END = 0;
          this.START = 0;
          this.doneWidth = 0;
          this.time = 0;
          Toast('录制时间过短' +
            '请重新录制')
        } else {
          this.showChoose = true
          // this.reDubState = true
          this.$refs.video.style.height = '0px'
          this.isHidden = true
          // var _this = this
        }
        wx.stopRecord({
          success: function (res) {
            // console.log('stopRecordSuccess')
            window.localId = res.localId;
            // _this.uploadVo(localId);
          },
          fail: function (res) {
            console.log('3=' + JSON.stringify(res));
            // alert('录制失败，请重新录制')
            window.location.reload()
          }
        });
      },
    //
      isCompound(){
        this.showChoose = false
        this.showSubmitBtn = true
        this.showMore = false
        this.isDub = false
        // this.dubState = true
        // this.reDubState = true
        this.$refs.video.pause()
        this.isHidden = true
        this.$refs.video.style.height = '0px'

        let localId = window.localId
        this.uploadVo(localId);
      },
    //---获取音频的serverId提交后台获取job_id
      uploadVo(localId) {
        var _this = this
        wx.uploadVoice({
          localId: localId, // 上传音频的本地ID，由stopRecord接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: function (res) {
            let serverId = res.serverId
            _this.showSubmitBtn = true
            _this.submitIt(serverId)
          },
          fail: function (res) {
            console.log('5' + JSON.stringify(res));
          }
        });
      },
    //---重置  显示音乐风格及台词并添加音乐点击事件，显示录音按钮和进度条，video初始化src=当前选择的音乐风格，初始化进度条及时间
      reDub() {
        // console.log('reDub')
        this.$refs.video.style.height = '100%'
        this.$refs.video.src = this.items.video_urls
        // this.$refs.video.currentTime = 0
        this.$refs.video.muted = false
        // this.musicClickState = true
        this.START = 0
        this.isHidden = false
        this.dubState = true
        this.isPlayExample = true
        this.reDubState = false
        this.showChoose = false
        //播放被选中的风格
        // this.$refs.video.src = this.musicType[this.ind].mix_url
        // this.$refs.video.load()
        // this.$refs.video.play()
        this.playExample()
        this.$refs.video.pause()
        this.time = 0;
        this.doneWidth = 0;
        // clearInterval(ti)
        return false;
      },
    //---点击录音时间进度
      times() {
        var self = this;
        window.ti = setInterval(function () {
          self.time ++
          if (self.time == self.videoTime) {
            self.touchEnd()
            self.showChoose = true
            clearInterval(ti)
            clearInterval(doneWidth)
          }
        }, 1000)
      },
    //---成功就直接关闭loading，视频播放器加载合成的视频，隐藏合成和背景音乐按钮，显示提交和重置按钮
      submitIt(serverId) {
        let data = {
          material_id: this.items.material_id,
          music_id: this.items.music[0].music_id,
          channel_code: sessionStorage.getItem('world_qrcode') ? sessionStorage.getItem('world_qrcode') : '' ,
          media_id: serverId,
          token: localStorage.getItem('WC_token')
        }
        this.axios({
          method: 'post',
          url: 'http://d.ottcn.com/qmjs/api/submit_exmaine.php',
          data: this.qs.stringify(data),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then((res) => {
          if(res.data.code == 0){
            job_id = res.data.data.job_id
            this.statusSearch(job_id)
          }else if(res.data.code == -1){
            // alert(res.data.msg)
          }else if(res.data.code == -1001){
            localStorage.removeItem('WC_token')
            localStorage.removeItem('WC_uuid')
            window.location.reload()
          }
        })
      },
    //---请求合成状态
      statusSearch(job_id) {
        let token = localStorage.getItem('WC_token')
        this.axios.get('http://d.ottcn.com/qmjs/api/query_video_status.php?token=' + token + '&job_id=' + job_id).then((response) => {
          if (response.data.code == 0) {
            if (response.data.data.is_complete == 1){  //视频合成成功，给video赋值高度，显示视频外盒，隐藏loading蒙层，把合成的地址赋给video并播放
              this.$refs.video.style.height = '4.22rem'
              this.isHidden = false
              this.showSubmitBtn = false
              this.$refs.video.src = response.data.data.music_video_url
              this.$refs.video.muted = false
              this.$refs.video.play()
              this.reDubState = true
            } else if (response.data.data.is_complete == 2) {
              // alert('您的录音合成失败，请重新录制')
              this.showSubmitBtn = false
              this.reDub()
            } else if (response.data.data.is_complete == 0) {   //0为合成中，两秒请求一次
              setTimeout(() => {
                this.statusSearch(job_id)
              }, 2000)
            }
          } else {
            console.log(response.data.msg)
          }
        })
      },
  //-----------预览后最终点击提交按钮保存视频
      finalSave() {
        let data = {
          job_id: job_id,
          status: 1,
          token: localStorage.getItem('WC_token')
        }
        this.axios({
          method: 'post',
          url: 'http://d.ottcn.com/qmjs/api/submit_status.php',
          data: this.qs.stringify(data),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then((res) => {
          if (res.data.code == 0) {
            this.$router.push('/success')
          } else {
            this.$router.push({
              path: './fail',
              query: {
                material_id: this.items.material_id,
                music_id: this.items.music[0].music_id,
                media_id: localStorage.getItem('serverId'),
                token: localStorage.getItem('WC_token')
              }
            })
          }
        })
      }
    }
  }
</script>
<style lang="scss" slot="slot">
  .dub-cover{
    height: 100%;
    position: relative;
    /*background: rgba(0,0,0,0.1);*/
  }
  dubBg{
    height: 100%;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0,0,0,0.1);
  }
  .active {
    background: url("../assets/img/1choose.png") no-repeat;
    background-size: cover;
  }
  .video-box-bg{
    width: 100%;
    height: 4.22rem;
    background-size: cover;
    .video_show_inner {
      width: 100%;
      height: 4.22rem;
      background: #000;
      video {
        width: 100%;
        height: 100%;
      }
      .duration {
        background: rgba(0, 0, 0, 0.4) url("../assets/img/1time.png");
        background-position: 0.1rem 0.05em;
        background-repeat: no-repeat;
        background-size: 0.2rem 0.2rem;
        position: relative;
        bottom: 0.8rem;
        left: 0.4rem;
        width: 0.9rem;
        height: 0.3rem;
        border-radius: 0.15rem;
        .time-icon {
          position: relative;
          top: -0.7rem;
          left: 0.1rem;
          width: 0.2rem;
          height: 0.2rem;
          img {
            width: 100%;
          }
        }
        .time-count {
          position: absolute;
          top: 0rem;
          right: 0.1rem;
          float: left;
          font-size: 0.24rem;
          color: #fff;
        }

      }
    }
  }

  .swiper-wrapper {
    width: 100%;
    height: 1.3rem;
    margin: 0.2rem auto 0;
    .swiper-slide {
      overflow-y: hidden;
      box-sizing: border-box;
      width: 6.4rem;
      height: 1.3rem;
      border: solid 0.06rem rgba(255, 255, 255, 0.1);
      border-radius: 0.22rem;
      margin: 0 auto;
      padding: 0.2rem 0 0 0.3rem;
      position: relative;
      color: #f9f9f9;
      font-size: 0.3rem;
      line-height: 0.5rem;
      .lines {
        width: 4.8rem;
        height: 1.3rem;
        .first {
          font-size: 0.3rem;
          color: #f9f9f9;
          font-weight: bold;
        }
        .second {
          font-size: 0.26rem;
          color: #c1c1c1;
        }
      }
      .more {
        width: 0.9rem;
        height: 0.9rem;
        position: absolute;
        right: 0.2rem;
        bottom: 0.2rem;
      }
    }

  }

  .music {
    /*height: 1.3rem;*/
    ul {
      clear: both;
      width: 100%;
      height: 1.24rem;
      margin-top: 0.32rem;
      li {
        width: 1.24rem;
        height: 1.24rem;
        text-align: center;
        float: left;
        list-style: none;
        margin-left: 0.2rem;
        position: relative;
        .music-img {
          background-size: cover;
          width: 0.9rem;
          height: 0.9rem;
          position: absolute;
          left: 50%;
          top: 50%;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          -webkit-transform: translate(-50%, -50%);
          /*img{*/
          /*width: 100%;*/
          /*}*/
        }
        p {
          margin-top: 1.2rem;
          font-size: 0.26rem;
          color: #f9f9f9;
        }
      }
    }
  }

  .play-example{
    width: 2.52rem;
    height: 0.56rem;
    margin: 0.3rem auto 0.4rem;
    /*background: url("../assets/img/6video.png") no-repeat;*/
    /*background-size: cover;*/
  }

  .button {
    width: 100%;
    position: absolute;
    bottom: 0.4rem;
    left: 50%;
    transform: translateX(-50%);
    -webkit-transform: translateX(-50%);
    .progress {
      width: 100%;
      height: 0.5rem;
      position: relative;
      .standard {
        width: 0.12rem;
        height: 0.5rem;
        background-color: #fff;
        border-radius: 0.12rem;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%);
      }
      .second {
        position: absolute;
        left: 50%;
        bottom: 0.55rem;
        width: 0.7rem;
        font-size: 0.3rem;
        color: #f9f9f9;
        transform: translateX(-0.3rem);
        webkit-transform: translateX(-0.3rem);
      }
      .default-box {
        /*z-index: 1;*/
        width: 3.8rem;
        height: 0.6rem;
        position: absolute;
        right: 0;
        top: 0;
        .default {
          margin-top: 0.22rem;
          height: 0.06rem;
          width: 3.8rem;
          background: url("../assets/img/1default.png");
          background-size: 0.12rem 0.06rem;
        }
      }
      .done {
        height: 0.2rem;
        position: absolute;
        right: 3.9rem;
        top: 0.15rem;
        background: url("../assets/img/1done.png");
        background-size: 0.12rem 0.2rem;
      }
    }
    .handle {
      line-height: 2.14rem;
      margin: 0 auto 0.4rem;
      width: 2.15rem;
      height: 2.14rem;
      .make {
        float: left;
        width: 2.15rem;
        height: 2.14rem;
        text-align: center;
        background-size: 100%;
        p {
          font-size: 0.28rem;
          color: #fff6d4;
          margin-top: 1.2rem;
        }
      }
    }
    .handle2{
      width: 5rem;
      height: 1.1rem;
      position: fixed;
      left: 50%;
      bottom: 2rem;
      transform: translate(-50%);
      .reDub {
        float: left;
        width: 1.1rem;
        height: 1.1rem;
        background: url("../assets/img/1delet.png");
        background-size: cover;
      }
      .submitIt {
        float: right;
        display: inline-block;
        width: 1.1rem;
        height: 1.1rem;
        background: url("../assets/img/1ok.png");
        background-size: cover;
      }
    }
  }

  .moreLines {
    padding: 0.3rem 0.2rem 0.1rem;
    width: 5.9rem;
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, 0.9);
    border-radius: 0.2rem;
    position: absolute;
    left: 50%;
    top: 4.23rem;
    bottom: 3.8rem;
    transform: translate(-50%);
    color: #ffffff;
    font-size: 0.28rem;
    line-height: 0.6rem;
    z-index: 200;
    .lines-content {
      height: 100%;
      width: 100%;
      text-align: center;
      overflow-y: auto;
      word-wrap: break-word;
    }
    .close {
      width: 0.4rem;
      height: 0.4rem;
      position: absolute;
      right: 0.3rem;
      top: 0.2rem;
    }
    img {
      width: 100%;
    }
  }
  .choose-box{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 1;
    .is-choose{
      position: relative;
      top: 3.3rem;
      left: 50%;
      transform: translate(-50%);
      -webkit-transform: translate(-50%);
      z-index: 300;
      width: 5.4rem;
      height: 3.4rem;
      /*background: url("../assets/img/3kuang.png") no-repeat;*/
      background-repeat: no-repeat;
      background-size: cover;
      .choose-btn{
        position: absolute;
        bottom: 0.4rem;
        left: 0.3rem;
        width: 4.8rem;
        height: 0.7rem;
        .reload{
          height: 0.7rem;
          width: 2.2rem;
          float: left;
          /*background: url("../assets/img/3luyin.png");*/
          background-repeat: no-repeat;
          background-size: cover;
        }
        .choose{
          height: 0.7rem;
          width: 2.2rem;
          float: right;
          /*background: url("../assets/img/3hecheng.png") no-repeat;*/
          background-repeat: no-repeat;
          background-size: cover;
        }
      }
    }
  }

  @keyframes myfirst {
    0% {
      transform: rotate(0deg)
    }
    25% {
      transform: rotate(90deg)
    }
    50% {
      transform: rotate(180deg)
    }
    75% {
      transform: rotate(270deg)
    }
    100% {
      transform: rotate(360deg)
    }
  }

  @-webkit-keyframes myfirst {
    0% {
      transform: rotate(0deg)
    }
    25% {
      transform: rotate(90deg)
    }
    50% {
      transform: rotate(180deg)
    }
    75% {
      transform: rotate(270deg)
    }
    100% {
      transform: rotate(360deg)
    }
  }

  .show-submitBtn {
    z-index: 300;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.83);
    color: #f9f9f9;
    font-size: 0.3rem;
    text-align: center;
    .loading-img {
      width: 2.2rem;
      height: 2.2rem;
      animation: myfirst 3s linear 0s infinite normal;
      /*background: url("../assets/img/loading.png");*/
      /*background-size: 100%;*/
      position: absolute;
      left: 50%;
      top: 2.5rem;
      margin-left: -1.1rem;
      img {
        width: 100%;
      }
    }
    .notice {
      /*position: absolute;
      width: 100%;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);*/
      margin-top: 5.3rem;
      width: 100%;
    }
    .loading-bottom {
      width: 100%;
      height: 1.48rem;
      /*background: url("../assets/img/loadingbottom.png");*/
      /*background-size: 100%;*/
      position: absolute;
      left: 0;
      bottom: 0;
      img {
        width: 100%;
      }
    }
  }
</style>
