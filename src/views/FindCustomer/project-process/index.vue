<template>
  <section class="page">
    <div class="wpct92 mauto mt16 space-between bg-white radius5" v-for="(item,index) in list" :key="index">  
      <div class="mlr16 ptb16 row space-between center-y border-bottom" >
        <div class="row center-y wpct82">
          <img :src="require('@/assets/images/customer/icon_xi@2x.png')" class="w18 h18 mr6" alt="">
          <span class="color-blakc fs16 fw600 ellipsis">{{ item.projectName }}</span>
        </div>
        <div :class="['fs14 hidden ',[item.state=='1'?'color-blue':'color-gray'] ]">{{item.state=='1' ? '进行中': '完结'}}</div>
      </div>
      <!-- 内容 -->
      <div class="mlr16 ptb16 color-gray fs14">
        <p>启动时间：{{ formatDate(item.projectStartupTime,'Y-M-D') }}</p>
        <div class="row space-between mt14">
          <span>负责人：{{item.personInCharge}}  </span>
          <span class="lookbtn" @click=" $router.push({path: '/project/process',query: {id: item.id}})">查看</span>
        </div>
      </div>
    </div>
    <div class="emply" v-if="list.length == 0">
        <img src="@/assets/images/isEmply.png" alt />
        <p>暂无数据~</p>
    </div>
  </section>
</template>
<script>
import { formatDate } from "@/utils";
import {getActionInfo} from "@/api/findCustomer/customer";
export default {
  name: "projectIndex",
  mixins: [],
  data() {
    return {
      list:[]
    };
  },
  methods: {
    formatDate,
    FgetActionInfo(){
      getActionInfo(this.$route.query.id).then(res=>{
        this.list = res
      })
    }
  },
  created(){
    if(this.$route.query && this.$route.query.id){
      this.FgetActionInfo()
    }else{
      this.$toast('获取信息失败')
    }
  }
};
</script>

<style lang="scss" scoped>
.page{
  height: 100vh;
  background:#f5f3fb !important;
  overflow-y: auto;
}
.color{
  &-black{
    color:#393C41 !important;
  }
  &-blue{
    color:  #3A78EF !important;
  }
  &-white{
    color: #ffffff !important;
  }
  &-info{
    color:#F2F4F9 !important;
  }
  &-gray{
    color: #959CA7 !important;
  }
}
.bg{
  &-black{
    background:#393C41 !important;
  }
  &-blue{
    background:  #3A78EF !important;
  }
  &-white{
    background: #ffffff !important;
  }
  &-info{
    background:#F2F4F9 !important;
  }
  &-gray{
    background: #959CA7 !important;
  }
}
.v-border-bottom{
  border-bottom: 1px solid #F2F4F9;
}
.lookbtn{
  width:50px;
  height:21px;
  line-height: 21px;
  background:rgba(242,249,255,1);
  border:1px solid rgba(58,120,239,1);
  border-radius:10px;
  text-align: center;
  color: #3A78EF;
  font-size: 12px;

}
.emply{
  padding-top: 10%;
  text-align: center;
  img{
    width:133px;
  }
  p{
    color:rgba(149,156,167,1);
    font-size: 12px;
    padding: 8px 0 8px 8px;
  }
}
</style>