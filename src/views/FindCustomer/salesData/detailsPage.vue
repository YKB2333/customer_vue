<template>
  <div id="page">
    <van-list
      v-model="loading"
      :finished="finished"
      :error="error"
      finished-text="没有更多了"
      @load="onLoad"
      class="van-clearfix"
      v-if="detailsReportDatas"
    >
      <div class="classifyTitle" v-for="(item,index) in detailsReportDatas" :key="index" @click="routeDetailsAnalysis(item)">
        <p class="classifyP">
          <span class="row center-x center-y">
            <img :src="require(`@/assets/images/find/list${index}.png`)" alt v-if="index<3" />
            {{ index > 2 ? `${index+1}. ` :'' }}
          </span>
          <span class="row center-x center-y " style="text-align:left !important">{{item.name}}</span>
        </p>
        <div class="classifyBox">
          <div>
            <p>出库金额</p>
            <p>{{item.amt | toThousandFilter(0)}}</p>
            <p>
              环比
              <span
                :class="item.amtGrowthRate&&item.amtGrowthRate>0?'rise':'fall'"
              >{{(item.amtGrowthRate||0)/100 | toPercentFilter}}</span>
            </p>
            <p>
              <img :src="(item.amtGrowthRate||0)>0?riseImg:fallImg" alt />
            </p>
          </div>
          <div class="SuperBorderRight">
            <p>出货件数</p>
            <p>{{item.qty | toThousandFilter(0)}}</p>
            <p>
              环比
              <span
                :class="item.qtyGrowthRate&&item.qtyGrowthRate>0?'rise':'fall'"
              >{{(item.qtyGrowthRate||0)/100 | toPercentFilter}}</span>
            </p>
            <p>
              <img :src="(item.qtyGrowthRate||0)>0?riseImg:fallImg" alt />
            </p>
          </div>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
import {
  getChannelList,
  getCustomerList,
  getChannelCount,
  getCustomerCount,
  getChannelGrowth,
  getCustomerGrowth,
  getOrgCount,
  getCategoryCount,
  getBrandCount,
  getSkuCount
} from "@/api/findCustomer";
export default {
  name: "SalesDataDetailsPage",
  components: {},
  data() {
    return {
      loading: false,
      finished: false,
      detailsReportDatas: [],
      riseImg: require("@/assets/images/find/client_icon_up@2x.png"),
      fallImg: require("@/assets/images/find/client_icon_down@2x.png"),
      query: {},
      page: {
        pageIndex: 1,
        pageSize: 5
      },
      error: false
    };
  },
  computed: {},
  created() {
    this.query = this.$route.query;
  },
  methods: {
    routeDetailsAnalysis(item) {
      let params = this.getQueryParams();
      let query = {
        ratioType: params.ratioType,
        id:item.id,
        code:item.code,
        name:item.name,
        startTime: params.startTime,
        endTime: params.endTime
      };
      this.$router.push({ path: "salesDataDetailsAnalysisPage", query });
    },
    // 格式化时间
    getQueryParams() {
      let params = this.$lodash.cloneDeep(this.query);
      //  如果是选择年月的,开始时间是本月,结束本月家一月
      if (this.dateType == "year") {
        let time = this.$moment(params.time + "/01/01");
        params.startTime = time.startOf("year").valueOf();
        params.endTime = time.endOf("year").valueOf();
      } else if (this.dateType == "month") {
        let time = this.$moment(params.time + "/01");
        params.startTime = time.startOf("month").valueOf();
        params.endTime = time.endOf("month").valueOf();
      } else {
        let time = this.$moment(params.time);
        params.startTime = time.startOf("day").valueOf();
        params.endTime = time.endOf("day").valueOf();
      }
      return params;
    },
    onLoad() {
      // 异步更新数据
      let params = this.getQueryParams();
      let http;
      switch (params.ratioType) {
        case "customer":
          http = getCustomerCount(params).then(res => {
            res.records.forEach(e => {
              e.name = e.csName;
              e.code = e.csCode;
              this.detailsReportDatas.push(e);
            });
            // 数据全部加载完成
            if (this.detailsReportDatas.length >= res.total) {
              this.finished = true;
            }
          });
          break;
        case "cate":
          http = getCategoryCount(params).then(res => {
            res.records.forEach(e => {
              e.name = e.cateName;
              e.id = e.cateId;
              this.detailsReportDatas.push(e);
            });
            // 数据全部加载完成
            if (this.detailsReportDatas.length >= res.total) {
              this.finished = true;
            }
          });
          break;
        case "org":
          http = getOrgCount(params).then(res => {
            res.records.forEach(e => {
              e.name = e.orgName;
              e.code = e.orgCode;
              this.detailsReportDatas.push(e);
            });
            // 数据全部加载完成
            if (this.detailsReportDatas.length >= res.total) {
              this.finished = true;
            }
          });
          break;
        case "brand":
          http = getBrandCount(params).then(res => {
            res.records.forEach(e => {
              e.name = e.brandName;
              e.id = e.brandId;
              this.detailsReportDatas.push(e);
            });
            // 数据全部加载完成
            if (this.detailsReportDatas.length >= res.total) {
              this.finished = true;
            }
          });
          break;
        default:
          http = getSkuCount(params).then(res => {
            res.records.forEach(e => {
              e.name = e.skuName;
              e.code = e.skuCode;
              this.detailsReportDatas.push(e);
            });
            // 数据全部加载完成
            if (this.detailsReportDatas.length >= res.total) {
              this.finished = true;
            }
          });
          break;
      }
      http
        .catch(e => {
          this.error = true;
        })
        .finally(() => {
          this.page.pageIndex++;
          this.loading = false;
        });
    },
    getQueryParams() {
      let params = this.$lodash.cloneDeep(this.query);
      params = Object.assign(params, this.page);
      return params;
    }
  }
};
</script>

<style lang="scss" scoped>
#page {
  height: 100vh;
  overflow-x: hidden;
}
.classifyTitle {
  width: 92%;
  margin: 0 auto;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 11px 0px rgba(159, 190, 240, 0.16);
  border-radius: 8px;
  padding: 8% 5% 5% 5%;
  box-sizing: border-box;
  letter-spacing: 1px;
  margin-bottom: 1rem;
  p {
    margin: 0;
    padding: 0;
  }
  .classifyP {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    margin-bottom: 2rem;
    font-size: 16px;
    img {
      width: 22px;
      margin-right: 5px;
    }
    span:nth-child(1) {
      margin-right: 5px;
    }
  }
  .SuperBorderRight {
    position: relative;
    padding-right: 0;
    padding-left: 10%;
    width: 50%;
    p:last-child {
      right: 0;
    }
  }
  .SuperBorderRight::after {
    content: "";
    position: absolute;
    left: 0%;
    top: 50%;
    transform: translate(0, -50%);
    width: 1px;
    height: 2rem;
    background: rgba(244, 244, 244, 1);
    border-radius: 2px;
  }
  .classifyBox {
    display: flex;
    justify-content: space-between;
    div {
      width: 50%;
      text-align: left;
      position: relative;
      box-sizing: border-box;
      p:last-child {
        position: absolute;
        top: 3%;
        right: 10%;
        img {
          width: 12px;
          height: 14px;
        }
      }
      p:nth-child(1) {
        font-size: 14px;
        color: rgba(149, 156, 167, 1);
        line-height: 15px;
        padding-bottom: 0.4rem;
      }
      p:nth-child(2) {
        font-size: 23px;
        color: rgba(57, 60, 65, 1);
        padding-bottom: 1rem;
      }
      p:nth-child(3) {
        font-size: 13px;
        color: rgba(149, 156, 167, 1);
        span {
          margin-left: 6%;
        }
      }
      .rise {
        color: #ff3750;
      }
      .fall {
        color: #00c873;
      }
    }
  }
}
</style>

