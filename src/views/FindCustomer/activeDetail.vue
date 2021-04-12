<template>
  <div id="page">
    <div class="swiper-slide HomeSwiperSlide">
      <!-- 活动图片 -->
      <img :src="info.titleImage" />
      <!-- 活动title -->
      <div class="activityTitle bg-white">
        <p class="ellipsis2 fw600">{{info.title}}</p>
        <div>
          <p class="ellipsis">活动期间：{{info.startTime | formatDate('Y.M.D')}}-{{info.endTime | formatDate('Y.M.D')}}</p>
          <!-- <p class="ellipsis2">活动地点：{{name}}</p> -->
          <p class="ellipsis2">活动客户：{{name}}</p>
          <!-- <p>活动详情：{{info.programme || '-'}}</p> -->
          <!-- <p>开展部门：销售部</p> -->
        </div>
      </div>
    </div>
    <div class="row center-y center-x bg-white" style="border-bottom:1px solid #F5F6F9;">
      <div :class="['activityBox',active==0?'active':'' ]" @click="changeTab('0')">活动案例</div>
      <div style="color:#959CA7;">|</div>
      <div :class="['activityBox',active==1?'active':'']" @click="changeTab('1')">活动商品</div>
    </div>
    <div class="bg-white mtb10">
      <div style="width: 96%; margin: 0px auto;">
        <div v-if="info.programme&&active==0" class="richText" v-html="info.programme"></div>  
        <div v-if="active==1">
          <van-list
            v-if="goodsList && goodsList.length>0"
            v-model="customerDIV.loading"
            :finished="customerDIV.finished"
            :finished-text="'没有更多了'"
            @load="CustomerOnLoad"
            :error.sync="customerDIV.error"
            error-text="请求失败，点击重新加载"
            :immediate-check="false"
          >
            <div v-for="(item,idx) in goodsList" :key="idx" class="row center-y custom-card ">
              <img class="w-h102 mr8" :src="item.spuTitleImage">
              <div class="col">
                <div class="fw600 fs16 mb16 ellipsis">{{item.name}}</div>
                <div class="row center-y">
                  <img class="w-h12" :src="require('@/assets/images/find/new_find/task_icon_ma@2x.png')">
                  <div class="fs12 ellipsis" style="color:#959CA7;">{{item.skuSn}}</div>
                </div>
              </div>
            </div>
          </van-list>
        </div>
        <div v-if="(!info.programme&&active==0) || (!goodsList || !goodsList.length<0 && active==1)" class="emply mt60" >
          <img src="@/assets/images/isEmply2.png" alt />
          <p>暂无活动商品哦</p>
        </div>
      </div>
    </div>
    <!-- 附件列表 -->
    <!-- <div v-if="info.attas.length > 0" class="bg-white mb14">
      <area-title title="附件列表" />
      <div class="plr14 pb2">
        <atta-item
          style="box-shadow:0px 0px 10px 0px rgba(40,109,153,0.1);"
          v-for="(item, index) in info.attas"
          :key="index"
          :file-name="item.fileName"
          :file-type="item.fileType"
          :size="item.size"
          :attaId="item.id"
          :attaUrl="item.attaUrl"
        />
      </div>
    </div> -->
  </div>
</template>

<script>
import AreaTitle from "@/components/AreaTitle";
import AttaItem from "@/components/AttachmentItem";
import { getActivityGoodsPage } from "@/api/findCustomer/customer"
export default {
  name: "activeDetail",
  components: {AreaTitle,AttaItem},
  data() {
    return {
      info: {},
      goodsList: [],
      active:0,
      id:"",
      query:{
        "activityId": "",
        "pageIndex": 0,
        "pageSize": 4
      },
      customerDIV:{
        error:false,
        finished:false,
        loading:false,
      },
    };
  },
  computed: {},
  created() {
    this.info = this.$route.query.query
    this.name = this.$route.query.name
    this.query.activityId = this.$route.query.id
    console.log(this.$route.query)
    this.fetchActivityGoodsPage()
  },
  methods: {
    changeTab(index){
      this.active=index
    },
    fetchActivityGoodsPage(){
      this.customerDIV.loading = true
      this.query.pageIndex+=1
      getActivityGoodsPage(this.query).then(res=>{
        console.log(res)
        if(res.records && res.records.length>0){
          this.goodsList = this.goodsList.concat(res.records)
        }else{
          this.customerDIV.finished = true
        }
      }).catch(err=>{
        this.customerDIV.error = true
      }).finally(() => {
        this.customerDIV.loading = false
      });
    },
    //加载更多
    CustomerOnLoad() {
      if (this.customerDIV.finished) {
        console.log('加载完成');
        return
      }
      this.fetchActivityGoodsPage()
    },
  }
};
</script>

<style lang="scss" scoped>
#page {
  height: 100vh;
  background: #F2F4F9;
  overflow-y: scroll;
  .activityBox{
    position: relative;
    margin: 0 16px;
    padding: 20px 0 ;
    color: #959CA7;
    &.active{
      color: #393C41;
    }
  }
  .activityBox::after{
    content: "";
    position: absolute;
    width: 22px;
    height: 3px;
    bottom: 0;
    right: 0;
    left: 0;
    margin: 0 auto;
    background-color: transparent;
  }
  .activityBox.active::after{
    background-color: #3A78EF;
  }
  .custom-card{
    box-shadow: 0px 2px 11px 0px rgba(0, 72, 209, 0.1);
    border-radius: 8px;
    padding: 19px 16px;
    margin-bottom: 12px;
  }
  .emply{
    text-align: center;
    padding:10px 0;
    img{
      width:200px;
    }
    p{
      margin-top: 20px;
      font-size: 14px;
      color: #959CA7;
      line-height: 14px;
    }
  }
}
.HomeSwiperSlide {
  // width: 92%;
  height: auto;
  text-align: center;
  font-size: 18px;
  // margin: 0 auto;
  margin-top: 4%;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 10px;
  border-radius: 5px;
  overflow: hidden;
  // box-shadow: -5px 5px 10px -4px rgba(159, 190, 240, 0.16),
  //   5px 5px 10px -4px rgba(159, 190, 240, 0.16);
  img {
    // width: 100%;
    // height: 190px;
    // border-radius: 3px;
    // object-fit: cover;
  }
  .activityTitle {
    // box-shadow: -5px 5px 10px -4px rgba(159, 190, 240, 0.16),
    // 5px 5px 10px -4px rgba(159, 190, 240, 0.16);
    box-shadow:0px 2px 16px 0px rgba(159,190,240,0.16);
    text-align: left;
    // width: 90%;
    margin: 0 auto;
    padding: 20px 18px;
    p {
      margin-top: 5px;
      font-size: 20px;
      margin-bottom: 2px;
      color: #393c41;
    }
    div {
      display: flex;
      flex-direction: column;
      color: #959ca7;
      font-size: 12px;
      p {
        font-size: 15px;
        margin-bottom: 2px;
        color: #797e84;
        letter-spacing: 1px;
        margin-top: 0.5rem;
      }
    }
  }
}
p {
  word-wrap: break-word;
  word-break: break-all;
}
.richText {
  overflow: hidden;
  width: 90%;
  margin: 0 auto;
  font-size: 15px;
  font-weight: 400;
  color: rgba(57, 60, 65, 1);
  line-height: 30px;
  padding-bottom:10px;
}
</style>
