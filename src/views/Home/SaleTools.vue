<template>
  <div id="page">
    <van-tabs @change="changeTab" style="border-bottom:12px solid #f3f4f9" line-width="30px"  color="#3A78EF" v-model="active">
      <van-tab title="产品提案模板"></van-tab>
      <van-tab title="客户运营模板"></van-tab>
      <van-tab title="项目跟进表"></van-tab>
    </van-tabs>
    <!-- <div class="titleImg" v-if="one.titleImage">
      <img :src="one.titleImage" alt="">
    </div> -->
    <div style="background:#fff;padding:24px 18px 4px 18px;">
      <div v-if="attalist.length>0">
        <atta-item
        v-for="(item, index) in attalist"
        :key="index"
        :file-name="item.fileName"
        :file-type="item.fileType"
        :size="item.size"
        :attaId="item.id"
        :attaUrl="item.attaUrl"/>
      </div>
      <emply v-else />
    </div>
    
  </div>
</template>

<script>
import { getOne, selectPage as cmsSelectPage,getAttaById } from '@/api/cms'
import { cmsCategoryId } from '@/config'
import AttaItem from "@/components/AttachmentItem";
export default {
  name: 'group',
  components: {AttaItem},
  data() {
    return {
      active:0,
      attalist:[],
      detail:{},
      one:{},
    }
  },
  computed: {},
  created() {
    this.getDetail()
  },
  methods: {
    async changeTab(){
      this.attalist = []
      // this.one = []
      this.$toast.loading({
        duration: 0,
        message: "加载中...",
        forbidClick: true
      });
      await this.getDetail()
      this.$toast.clear()
    },
    getDetail(){
      return new Promise((resolve, reject) => {
        let title = this.active == 0?'产品提案模板':this.active==1?'客户运营模板':'项目跟进表'
        cmsSelectPage({
          pageSize: 10,
          infoCategoryId: cmsCategoryId.saleToolsIndex,
          status: '1',
          title,
          orderStr: 'pubTimestamp desc, createTimestamp desc'
        }).then(res => {
          this.detail = res.records[0] || {}
          if(this.detail.id){
            getAttaById(this.detail.id).then(res_ => {
              this.attalist = res_ || []
            })
            // getOne(this.detail.id).then(res__=>{
            //   this.one = res__ || {}
            // })
          }
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
  }
}
</script>

<style lang="scss" scoped>
#page {
  height: 100vh;
  background: white;
  overflow-y: scroll;
}
.richText {
  overflow: hidden;
  width: 90%;
  margin: 0 auto;
  margin-top: 10px;
  font-size: 15px;
  font-weight: 400;
  color: rgba(57, 60, 65, 1);
  line-height: 30px;
}
/deep/ .van-tab{
  color: #909399;
  line-height: 50px;
}
/deep/ .van-tabs--line .van-tabs__wrap {
    height: 50px;
}
/deep/ .van-tab--active{
  font-weight: bold;
  color:#303133;
}
.titleImg{
  background-color: #fff;
  padding:18px;
  margin-bottom: 10px;
  img{
    width: 100%;
    height: auto;
    border-radius: 5px;
  }
}
</style>
