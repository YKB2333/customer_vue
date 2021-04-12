<template>
  <div class="page">
    <div class="info" v-if="params.length>0">
      <info-list v-for="(item,index) in params" 
        :index_="index" 
        :params="item" 
        :key="index" 
        :listStart="true" 
        :titleLeft="true"></info-list>
    </div>
    <div class="emply" v-else>
      <img src="@/assets/images/isEmply.png" alt />
      <p>暂无数据~</p>
    </div>
  </div>
</template>
<script>
import infoList from "@/components/code/infoList";
import { getContractInfo } from "@/api/findCustomer/customer";
export default {
  name: "agreement",
  components: {
      infoList
  },
  data() {
    return {
        params:[]
    };
  },
  methods: {
    getContractInfo(){
      this.$toast.loading({
        duration: 0,
        message: "加载中...",
        forbidClick: true
      });
      getContractInfo(this.$route.query.id).then(res=>{
          this.params = res
      }).finally(()=>{
        this.$toast.clear();
      })
    },
  },
  created(){
    if(this.$route.query.id){
        this.getContractInfo()
    }else{
        this.$toast('获取用户失败')
    }
  },
};
</script>

<style lang="scss" scoped>
.page{
    
    line-height: 1;
    // height: 100%;
}
.info{
  background-color: #F2F4F9;
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