<template>
  <div id="page">
    <div class="ptb16 plr18 mb14" style="background: #fff">
      <p
        style="color: #393c41; font-"
        :class="[' fs18 fw500 ', { 'text-center ': query.ratioType == 'org' }]"
      >{{ this.query.name }}
      </p>
    </div>

    <van-list
      v-model="loading"
      :finished="finished"
      :error="error"
      :error-text="errorText"
      finished-text="没有更多了"
      @load="onLoad"
      class="bg-white"
      style="min-height: 100%;">
      <div class="plr18 pt18">
        <div v-for="(item, index) in detailsReportDatas" :key="index" class="iwarp plr16 ptb18 mb18">
          <div style="flex-shrink: 0">
            <img
              :src="item.logo || require('@/assets/images/defaultLogo.png')"
              width="102px"
              height="102px"
              class="radius8"
            />
          </div>
          <div class="pl12 item_info">
            <div class="fw500 fs18 ellipsis w-full mb10" style="color: #393c41">
              {{ item.name }}
            </div>
            <p class="mt2">
              <span class="fs12 fw500" style="color: #6b7178">销售总额</span>
              <span
                class="pl8 fs14"
                style="color: #ff3750; line-height: 12px"
                v-if="item.amt != null"
              >{{ item.amt | formattedMoneyData(2) }}万元</span>
              <span v-else>{{ "**" }}</span>
            </p>
            <p class="mt2">
              <span class="fs12 fw500" style="color: #6b7178">平均单价</span>
              <span
                class="pl8 fs14 fw500"
                style="line-height: 12px; color: #6b7178"
                v-if="item.amt != null"
              >￥{{ (item.amt / item.qty) | toThousandFilter }}</span>
              <span v-else>{{ "**" }}</span>
            </p>
            <p class="mt2">
              <span class="fs12 fw500" style="color: #6b7178">销售数量</span>
              <span
                class="pl8 fs14 fw500"
                style="line-height: 12px; color: #6b7178"
              >{{ item.qty }} 件
              </span>
            </p>
          </div>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
import {
  getCustomerCount,
  getCategoryCount,
  getSkuCount,
} from "@/api/findCustomer";
import { deepClone, formattedMoneyData } from "@/utils";

export default {
  name: "SalesDataDetailsAnalysisPage",
  components: {},
  data() {
    return {
      loading: false,
      finished: false,
      detailsReportDatas: [],
      riseImg: require("@/assets/images/find/client_icon_up@2x.png"),
      fallImg: require("@/assets/images/find/client_icon_down@2x.png"),
      query: {},
      orgSelectType: "sku",
      page: {
        pageIndex: 1,
        pageSize: 5,
      },
      error: false,
      errorText: "",
    };
  },
  computed: {
    title() {
      switch (this.query.ratioType) {
        case "sku":
          return "销售客户";
        case "org":
          if (this.orgSelectType == "cate") return "品类";
        default:
          return "SKU";
      }
    },
  },
  watch: {},
  methods: {
    formattedMoneyData,
    async onLoad() {
      // 异步更新数据
      let params = this.getQueryParams();
      let http;
      switch (this.query.ratioType) {
        case "sku":
          http = getCustomerCount(params).then((res) => {
            res.records.forEach((e) => {
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
        case "org":
          if (this.orgSelectType == "cate") {
            http = getCategoryCount(params).then((res) => {
              res.records.forEach((e) => {
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
          }
        default:
          http = getSkuCount(params).then((res) => {
            res.records.forEach((e) => {
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
      await http
        .catch((e) => {
          this.error = true;
          this.errorText = "加载失败，请稍后再试";
        })
        .finally(() => {
          this.page.pageIndex++;
          this.loading = false;
        });
    },
    getQueryParams() {
      let temp = this.$lodash.cloneDeep(this.query);
      let params = {
        startTime: temp.startTime,
        endTime: temp.endTime,
        qdCode: temp.qdCode,
      };
      switch (this.query.ratioType) {
        case "sku":
          params.skuCode = temp.code;
          // 传入版块ID，year month day
          if (temp.businessId && temp.businessId != "all")
            params["businessId"] = temp.businessId;
          if (temp.year) params["year"] = temp.year;
          if (temp.month) params["month"] = temp.month;
          if (temp.day) params["day"] = temp.day;
          console.info(params);
          break;
        case "customer":
          params.csCode = temp.code;
          break;
        case "cate":
          params.cateId = temp.id;
          break;
        case "org":
          params.orgCode = temp.code;
          break;
        case "brand":
          params.brandId = temp.id;
          break;
        default:
          return;
      }
      params = Object.assign(params, this.page);
      return params;
    },
    async changeOrgSelectType(type) {
      this.error = true;
      this.errorText = "";
      let interval;
      let p = new Promise((resolve, reject) => {
        interval = setInterval(() => {
          if (!this.loading) resolve();
        }, 100);
      });
      p.then(() => {
        clearInterval(interval);
        this.orgSelectType = type;
        this.detailsReportDatas = [];
        this.page.pageIndex = 1;
        this.loading = true;
        this.finished = false;
        this.error = false;
        this.onLoad();
      });
    },
  },
  created() {
    this.query = this.$route.query;
  },
};
</script>

<style lang="scss" scoped>
#page {
  height: 100vh;
  overflow-x: hidden;
  background-color: #f2f4f9;
}
.iwarp {
  display: flex;
  box-shadow: 0px 2px 11px 0px rgba(0, 72, 209, 0.1);
  border-radius: 8px;
  align-items: center;
}
.item_info {
  flex-shrink: 1;
  overflow: hidden;
}
</style>

