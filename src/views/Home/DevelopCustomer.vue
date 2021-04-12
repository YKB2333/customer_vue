<template>
  <div class="cientPage">
    <!-- banner -->
    <div class="wpct100">
      <img src="@/assets/images/customer/banner.png" alt class="wpct100" v-if="type== '1'" />
      <img src="@/assets/images/customer/banner1.png" alt class="wpct100" v-if="type== '2'" />
    </div>
    <!-- 开发中的客户 -->
    <div class="plr18 ptb16">
      <!--数据不正常暂时停掉跳转-->
     <!-- <div
        v-for="(item, index) in customerList" :key="index" class="row shadow radius8 mb14 plr18 ptb20 white-bg"
        @click="$router.push({ name: 'EventDetails', query: { id: item.id} })"
      >-->
        <div
                v-for="(item, index) in customerList" :key="index" class="row shadow radius8 mb14 plr18 ptb20 white-bg"
        >
        <div style="flex: 0 0 100px;"><img :src="item.titleImage" alt="title-img"></div>
        <div class="flex-1 col space-between ptb8 pl10" style="overflow: hidden;">
          <p class="fs16 fw600 van-ellipsis">{{ item.title }}</p>
          <p class="fs13 van-ellipsis" style="color: #959CA7;">{{ item.subhead }}</p>
          <p class="fs13 van-multi-ellipsis--l2" style="color: #959CA7;">{{ item.summary }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { selectPage as cmsSelectPage } from "@/api/cms";

export default {
  name: "DevelopCustomer",
  components: {
  },
  mixins: [],
  data() {
    return {
      type: '',
      customerList: []
    };
  },
  created() {
    if (this.$route.query['type']) this.type = this.$route.query['type']
    if (this.type === '1') {
      this.fetchCustomerList()
    }
  },
  methods: {
    fetchCustomerList() {
      cmsSelectPage({
        pageIndex: 1,
        pageSize: 1000,
        status: '1',
        infoCategoryId: this.$config.cmsCategoryId['unDevelopCustomer'],
        orderStr: 'orderLevel desc, pubTimestamp desc, createTimestamp desc'
      }).then(res => {
        this.customerList = res.records
        console.log('客户列表', this.customerList)
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.cientPage {
  height: 100vh;
  background: #f2f4f9 !important;
}
.bgwhite{
  background: white !important;
  border-radius: 5px;
}
</style>
