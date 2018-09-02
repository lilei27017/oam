<template>
  <div class="fail">
    <div class="description">
      <div class="fail-icon">
        <img src="../assets/img/4-2fail.png" alt="">
      </div>
      <p class="fail-title">网络好像出现了问题...</p>
      <p class="fail-hint">您可以稍后在尝试提交</p>
    </div>
    <div ref="sub" class="agin" @click="state==true ? reSubmit : ''">
      <span>{{time}}</span>s后再提交
    </div>
  </div>
</template>

<script>
  var Vue = require('vue')
  var count = 10;
export default {

  name: 'HelloWorld',
  data () {
    return {
      time: count,
      state: false
    }
  },
  mounted () {
    this.times()
  },
  methods: {
    times(){
      var self=this;
      setInterval( () => {
        self.time=count
        Vue.default.set([self.time],'time',count)
        if (count > 0){
          count --
        }else {
          this.$refs.sub.innerText = '提交'
          this.state = true
        }
      },1000)

    },
    reSubmit(){
      let data = this.$route.query
      console.log(data)
      this.axios({
        method: 'post',
        url:'http://d.ottcn.com/qmjs/api/submit_exmaine.php',
        data: this.qs.stringify(data),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then( (res) =>{
        if(res.data.code == 0){
          this.$router.push('/success')
        }else{
          // this.$router.push({
          //   path: './fail',
          //   query:{
          //     material_id: this.items.material_id,
          //     music_id: this.ind,
          //     media_id: localStorage.getItem('serverId'),
          //     token: localStorage.getItem('WC_token')
          //   }
          // })
        }
      })
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .fail {
    width: 100%;
    text-align: center;
    color: #fff;
    .description{
      text-align: center;
      width: 6.3rem;
      height: 6.3rem;
      background-color: rgba(0,0,0,0.7);
      border-radius: 0.2rem;
      margin: 0.6rem auto 0;
      position: relative;
      .fail-icon{
        width: 2.3rem;
        height: 2.3rem;
        position: absolute;
        left: 50%;
        top: 0.75rem;
        transform: translateX(-50%);
        -webkit-transform: translateX(-50%);
        img{
          width: 100%;
        }
      }
      .fail-title{
        width: 5.5rem;
        height: 0.55rem;
        line-height: 0.55rem;
        position: absolute;
        left: 50%;
        top: 3.5rem;
        transform: translateX(-50%);
        -webkit-transform: translateX(-50%);
        font-size: 0.36rem;
        color: #f9f9f9;
      }
      .fail-hint{
        width: 5.5rem;
        height: 0.8rem;
        line-height: 0.5rem;
        position: absolute;
        left: 50%;
        top: 4.36rem;
        transform: translateX(-50%);
        -webkit-transform: translateX(-50%);
        font-size: 0.28rem;
        color: rgba(255,255,255,0.6);
      }

    }
    .agin{
      position: fixed;
      width: 3.6rem;
      height: 0.85rem;
      line-height: 0.85rem;
      font-size: 0.36rem;
      border-radius: 0.85rem;
      background-color: #DF5B28;
      -webkit-background: linear-gradient(#F3AE52, #F09546);
      bottom: 2.15rem;
      left: 50%;
      transform: translateX(-50%);
    }

  }

</style>
