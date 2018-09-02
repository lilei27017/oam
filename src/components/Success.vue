<template>
  <div class="success">
    <div class="description">
      <div class="success-icon">
        <img src="../assets/img/4-1ok.png" alt="">
      </div>
      <p class="success-title">提交成功!</p>
      <p class="success-hint">您的配音视频已经提交，通过审核的视频将有机会出现在"我是解说员"展示页上哦～</p>
    </div>
    <div class="watch-hot" @click="toHotList"></div>
    <div class="watch-own" @click="toCommit"></div>
  </div>
</template>

<script>
  import hot from '../assets/img/4-1hot.png'
  import ownSub from '../assets/img/4-1submitted.png'

export default {
  name: 'HelloWorld',
  data () {
    return {
      hot,
      ownSub,

    }
  },
  mounted () {

  },
  methods: {
    toHotList(){
      window.location.href = 'http://h.ottcn.com/preview/#/'
    },
    toCommit(){
      this.$router.push('/commit')
    },
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .success {
    width: 7.5rem;
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
      .success-icon{
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
      .success-title{
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
      .success-hint{
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
    .watch-hot{
      position: fixed;
      width: 3.6rem;
      height: 0.85rem;
      bottom: 2.15rem;
      left: 50%;
      transform: translateX(-50%);
      -webkit-transform: translateX(-50%);
      background: url("../assets/img/4-1hot.png");
      background-size: cover;
      /*img{*/
        /*width: 100%;*/
      /*}*/
    }
    .watch-own{
      position: fixed;
      width: 3.6rem;
      height: 0.7rem;
      bottom: 1.2rem;
      left: 50%;
      transform: translateX(-50%);
      -webkit-transform: translateX(-50%);
      background: url("../assets/img/4-1submitted.png");
      background-size: cover;
    }

  }

</style>
