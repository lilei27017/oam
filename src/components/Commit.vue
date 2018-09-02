<template>
  <div class="list">
    <div class="tab border-1px">
      <router-link to="/index" class="tab-item index-list" active-class="select-list"></router-link>
      <div class="separate"></div>
      <router-link to="/commit" class="tab-item" active-class="select-submit"></router-link>
    </div>
    <div class="item-list" v-for="(item,outIndex) in items" :key="outIndex">
      <div class="time">
        <div class="iconT"></div>
        <p>{{item.time}}</p>
        <div class="iconT"></div>
      </div>
      <div class="item-content" v-for="(list,index) in item.lists" :key="index">
        <div class="img">
          <div v-if="list.status == 1" class="status">
            <span>审核中</span>
          </div>
          <div v-if="list.status == 3" class="status status3">
            <span>未选用</span>
          </div>
          <a @click="preview(outIndex,index)" v-if="list.status == 2" class="status">
            <span>预览</span>
          </a>
          <div v-if="list.status ==1 || list.status == 3" class="cover">
          </div>
          <img class="thumbnail" width="100%" :src="list.pic" alt="">
        </div>
        <div class="item-title">
          <p>{{list.video_name}}</p>
        </div>
        <div v-if="list.status == 2" class="commit-success">
          审核通过
        </div>
      </div>
    </div>
    <div class="footer-blank"></div>

    <div class=" none-commit" v-show="this.items == ''">
      <p>您还没有提交任何视频，请到 <span>“配音选择”</span> 里选择一个自己中意的视频开始配音解说吧！</p>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        items:[],
        item: {
          lists:{},
          time:'',
        },
        outIndex: '',
        index: '',
      }
    },
    mounted() {
      this.getDetail()
      this.baidu_statistics()
    },
    methods: {
      baidu_statistics() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?308d0caa51d6b23a24e9d36d9fe76e95";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
      },
      getDetail() {
        let data = {
          // token: 'N5j8Y709M6T4N3f2M1TUyODM2OTQwOF9mNzYxY2MzMWRkYzg3NzZkZGNmNDc2ZDVkNzNkNDNjY19fMWI2NWMyY2RhMjJkN2IwNjRlNmM5NzVlZWVlOGY3YmEO0O0O',
          token: localStorage.getItem('WC_token')
        }
        this.axios({
          method: 'post',
          url: 'http://d.ottcn.com/qmjs/api/view_status.php',
          data: this.qs.stringify(data),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then((res) => {
          if(res.data.data){
            this.items = res.data.data
          }else{
            this.items = []
          }
        })
      },
      preview(outIndex,index){
        this.outIndex = outIndex
        this.index = index
        let user_material_uuid = this.items[outIndex].lists[index].user_material_uuid
        window.location.href = 'http://h.ottcn.com/preview/#/detail/'+ user_material_uuid
      }
  }

  }
</script>
<style lang="scss" slot="slot">
  .list{
    width: 100%;
    height: 100%;
    margin-top: 0.3rem;
    position: relative;
  }
  .item-list {
    margin-bottom: 0.6rem;
    text-align: center;
    position: relative;
    .time {
      margin: 0 auto;
      .iconT {
        margin-bottom: 3px;
        display: inline-block;
        width: 0.18rem;
        height: 0;
        border: solid 2px rgba(255, 255, 255, 0.9);
        border-radius: 2px;
      }
      p {
        display: inline-block;
        font-size: 0.28rem;
        color: rgba(255, 255, 255, 0.9);
      }
    }
    .item-content {
      width: 6.9rem;
      height: 1.5rem;
      margin: 0.2rem auto 0;
      position: relative;
      .img {
        position: absolute;
        z-index: 100;
        width: 2.6rem;
        height: 1.44rem;
        border-radius: 0.1rem;
        /*border: solid 0.03rem rgba(255, 255, 255, 0.4);*/
        .cover {
          position: relative;
          top: -0.02rem;
          left: -0.01rem;
          z-index: 50;
          width: 2.66rem;
          height: 1.5rem;
          background: rgba(0, 0, 0, 0.6);
          border-radius: 0.1rem;
        }
        .thumbnail {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
          width: 2.66rem;
          height: 1.46rem;
          border-radius: 0.1rem;
        }
        .status {
          z-index: 100;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          -webkit-transform: translate(-50%, -50%);
          width: 1.4rem;
          font-size: 0.24rem;
          color: #fff;
          height: 0.4rem;
          border-radius: 0.2rem;
          border: solid 0.02rem #fff;
          padding: 0 0.02rem;
          line-height: 0.4rem;
          text-align: center;
        }
        .status3{
          border: solid 0.02rem #ff4b71 !important;
          color: #ff4b71 !important;
        }

      }
      .item-title {
        float: right;
        width: 3.9rem;
        height: 0.94rem;
        font-size: 0.3rem;
        font-weight: bold;
        color: #f9f9f9;
      }
      .commit-success {
        position: relative;
        left: 3.1rem;
        top: 1rem;
        width: 1.4rem;
        font-size: 0.24rem;
        color: #7aff9c;
        height: 0.4rem;
        border-radius: 0.2rem;
        border: solid 0.02rem #7aff9c;
        padding: 0 0.02rem;
        line-height: 0.4rem;
        text-align: center;
      }
      .preview {
        position: relative;
        left: 5.6rem;
        top: 1rem;
        width: 1.4rem;
        font-size: 0.24rem;
        color: #7aff9c;
        height: 0.4rem;
        border-radius: 0.2rem;
        border: solid 0.02rem #7aff9c;
        padding: 0 0.02rem;
        line-height: 0.4rem;
        text-align: center;
      }

    }
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
  .index-list{
    position: absolute;
    left: 0;
    bottom: 0;
    background: url("../assets/img/2list.png");
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
  .select-submit{
    position: absolute;
    right: 0;
    bottom: 0;
    background: url("../assets/img/2submit-select.png");
    background-size: 100%;
    width: 3.75rem;
    height: 0.98rem;
  }
  .none-commit{
    width: 6.1rem;
    height: 1.2rem;
    opacity: 0.7;
    line-height: 0.6rem;
    font-size: 0.28rem;
    font-weight: bold;
    margin: 2.3rem 0.7rem 0 0.7rem;
    letter-spacing: 1px;
    span{
      opacity: 1;
    }
  }
  .footer-blank{
    width: 100%;
    height: 1rem;
  }
</style>
