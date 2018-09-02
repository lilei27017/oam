<template>
  <div v-bind:style="styobj">
    <div class="description">

    </div>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/List"><img src="../assets/img/list-select.png" alt=""></router-link>
      </div>
      <div class="tab-item">
        <router-link to="/Commit"><img src="../assets/img/submit.png" alt=""></router-link>
      </div>

    </div>
  </div>
</template>

<script>
  import listSelect from '../assets/img/list-select.png'
  import list from '../assets/img/list.png'
  import submitSelect from '../assets/img/submit-select.png'
  import submit from '../assets/img/submit.png'
  import bg from '../assets/2bg.png'
export default {
  name: 'HelloWorld',
  components:{
  },
  data () {
    return {
      listSelect,
      list,
      submitSelect,
      submit,
      styobj:{
        'background-image': `url(${ bg })`,
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .description{
    width: 100%;
    height: 100vh;
    background-image: url("../../static/img/2bg.png");
    background-repeat: no-repeat;
    background-size: 100% 110%;
    background-position-y: -0.5rem;
    text-align: center;
    color: #fff;
    p{
      font-size: 0.34rem;
      line-height: 0.8rem;
    }
    img{
      position: fixed;
      width: 50%;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .tab{
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;

  }


</style>
