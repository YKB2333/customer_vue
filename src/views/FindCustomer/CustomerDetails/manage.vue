<template>
  <div class="page">
    <div class="header">
      <p v-if="params.annualSales">{{params.annualSales}}万</p>
      <p>年度销售额</p>
    </div>
    <div class="content">
      <div>
        <p>
          <span>目标客群</span>
          <span>{{params.targetGroups}}</span>
        </p>
        <p>
          <span>发展目标与计划</span>
          <span>{{params.targetAndPlan}}</span>
        </p>
        <p>
          <span>行业排名</span>
          <span>{{params.industryRank}}</span>
        </p>
        <p>
          <span>行业份额</span>
          <span>{{params.industryShare}}</span>
        </p>
        <p>
          <span>主营品类</span>
          <span>{{params.mainCategory}}</span>
        </p>
        <p>
          <span>主营品类销售占比</span>
          <span>{{params.mainCategoryPro}}</span>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "manage",
  data() {
    return {
      params: {}
    };
  },
  methods: {},
  created() {
    if (this.$route.query) {
      this.params = this.$route.query;
    } else {
      this.$toast("获取参数失败");
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  background: #f2f4f9;
  line-height: 1;
  height: 100%;
  .header {
    height: 138px;
    background: url("../../../assets/images/customer/bg_xiao@2x.png") no-repeat
      top left;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: center;
    p {
      color: #fff;
      padding: 12px 0px 0px 12px;
    }
    p:nth-child(1) {
      font-size: 35px;
    }
    p:nth-child(2) {
      font-size: 14px;
    }
  }
  .content {
    margin: 4%;
    min-height: calc(100% - 138px - 5%);
    background: #fff;
    > div {
      background: #fff;
      box-shadow: 0px 0px 46px 0px rgba(40, 109, 153, 0.1);
      border-radius: 5px;
      padding: 10px 0;
      > p {
        display: flex;
        padding: 12px 12px 0px 12px;
        // justify-content: space-between;
        flex-wrap: wrap;
        span:nth-child(1) {
          color: rgba(57, 60, 65, 1);
          font-size: 15px;
          font-weight: 600;
          padding-bottom: 12px;
          line-height: 18px;
          margin-right: 20px;
          width: 70px;
        }
        span:nth-child(2) {
          color: rgba(107, 113, 120, 1);
          font-size: 15px;
          line-height: 18px;
          padding-bottom: 12px;
          flex: 1;
        }
      }
    }
  }
}
// <img src="@/assets/images/customer/bg_xiao@2x.png" alt="">
</style>
