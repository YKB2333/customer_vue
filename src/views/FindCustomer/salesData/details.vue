<template>
  <section id="page">
    <div style="padding:1rem 0 0.5rem 0">
      <van-dropdown-menu :overlay="false">
        <van-dropdown-item :title="queryTitle" ref="search" class="mt5">
          <van-search
            v-model="filterKey"
            placeholder="请输入搜索关键词"
            clearable
            show-action
            @input="filterList"
            @cancel="clearSearch"
          ></van-search>
          <van-loading v-if="filtering" />
          <span v-else class="flex-1 y-scroll">
            <van-list
              v-model="listLoading"
              :finished="listFinished"
              finished-text="没有更多了"
              @load="onLoadList"
            >
              <van-cell
                v-for="item in findAllList"
                :key="item.text"
                :title="item.text"
                @click="chooseQueryCode(item)"
                :style="queryTitle == item.text?'color:#3d8af2':''"
              >
                <van-icon
                  name="success"
                  slot="right-icon"
                  v-if=" queryTitle == item.text"
                  color="#3d8af2"
                />
              </van-cell>
            </van-list>
          </span>
        </van-dropdown-item>
        <van-dropdown-item :title="query.time" ref="time">
          <van-tabs v-model="dateType" color="#2a86f7">
            <van-tab title="日" name="day">
              <Calendar @choseDay="clickDay" ref="calendar"></Calendar>
              <van-button size="large" type="info" @click="toDay">今天</van-button>
            </van-tab>
            <van-tab title="月" name="month">
              <van-datetime-picker
                v-model="currentDate"
                type="year-month"
                :show-toolbar="false"
                ref="datetime"
              />
              <van-button size="large" type="info" @click="clickMonth">确认</van-button>
            </van-tab>
            <van-tab title="年" name="year">
              <van-picker :columns="yearList" @change="onChangeYear" :default-index="10" />
              <van-button size="large" type="info" @click="clickYear">确认</van-button>
            </van-tab>
          </van-tabs>
        </van-dropdown-item>
      </van-dropdown-menu>
    </div>
    <!-- 总页面主体内容 -->

    <!-- 渠道类型 -->
    <div class="galleryDiv">
      <div v-for="(data,index) in reportData" :key="'report_'+index">
        <div class="BusinessSuper">
          <div>
            <p>销售量</p>
            <p>{{data.amt | toThousandFilter(0)}}</p>
            <p>
              环比
              <span
                :class="data.amtGrowthRate&&data.amtGrowthRate>0?'rise':'fall'"
              >{{(data.amtGrowthRate||0)/100 | toPercentFilter}}</span>
            </p>
            <p>
              <img :src="(data.amtGrowthRate||0)>0?riseImg:fallImg" alt />
            </p>
          </div>
          <div class="SuperBorderRight">
            <p>出货量</p>
            <p>{{data.qty | toThousandFilter(0)}}</p>
            <p>
              环比
              <span
                :class="data.qtyGrowthRate&&data.qtyGrowthRate>0?'rise':'fall'"
              >{{(data.qtyGrowthRate||0)/100 | toPercentFilter}}</span>
            </p>
            <p>
              <img :src="(data.qtyGrowthRate||0)>0?riseImg:fallImg" alt />
            </p>
          </div>
        </div>
      </div>
    </div>

    <div>
      <!-- 图表 -->
      <div class="Title-More">
        <p>{{ query.time?query.time.substr(0,4):this.$utils.formatDate(new Date(),'Y') }}年销售走势</p>
        <div class="menu">
          <van-dropdown-menu :overlay="false">
            <van-dropdown-item v-model="lineReportType" :options="lineReportTypeList" />
          </van-dropdown-menu>
        </div>
      </div>
      <!-- 数据图表 -->
      <div id="myChart" :style="{ height: '300px'}"></div>

      <!-- sku分类 等等-->
      <div class="gallery-thumbs-two">
        <div class="swiper-wrapper classificationtwo">
          <template v-for="key in Object.keys(detailsReportDatas)">
            <span
              class="swiper-slide"
              v-if="!detailsReportDatas[key].hidden"
              :key="key+'_detail_title'"
            >{{ detailsReportDatas[key].name }}</span>
          </template>
        </div>
      </div>

      <div class="gallery-top-two">
        <div class="swiper-wrapper">
          <template v-for="(key,keyIndex) in Object.keys(detailsReportDatas)">
            <div
              class="swiper-slide galleryDiv"
              v-if="!detailsReportDatas[key].hidden"
              :key="keyIndex"
            >
              <div>
                <div
                  class="classifyTitle"
                  v-for="(item,index) in detailsReportDatas[key].data"
                  :key="key+'_detail_data_'+index"
                  @click="routeDetailsAnalysis(key,item)"
                >
                  <p class="classifyP">
                    <span>
                      <img
                        :src="require(`@/assets/images/find/list${index}.png`)"
                        alt
                        v-if="index<3"
                      />
                      {{ index > 2 ?index+1:'' }}
                    </span>
                    <span>{{item.name}}</span>
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
                <van-button
                  plain
                  style="width:100%;margin:0 auto ;color:#b6bbc2"
                  type="default"
                  @click="lookDetails(key)"
                >查看{{ detailsReportDatas[key].name }}更多</van-button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Swiper from "swiper";
import { Toast, Picker } from "vant";
import { savePosition } from "@/mixins";
import Calendar from "vue-calendar-component";
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
  name: "SalesDataDetails",
  components: { Calendar },
  mixins: [new savePosition('page')],
  data() {
    return {
      detailsReportDatas: {
        sku: {
          name: "SKU销售",
          data: []
        },
        customer: {
          name: "客户销售",
          data: [],
          hidden: false
        },
        cate: {
          name: "品类销售",
          data: []
        },
        org: {
          name: "组织销售",
          data: []
        },
        brand: {
          name: "品牌销售",
          data: []
        }
      },
      countType: "",
      filterKey: "", // 搜索的值
      filtering: false,
      listLoading: false,
      listFinished: false,
      findAllList: [],
      listIndex: 0,
      list: [],
      query: {
        pageIndex: 1,
        pageSize: 3,
        qdCode: null,
        csCode: null,
        time: null,
        isCascade: false
      },
      reportData: [],
      lineReportType: "amt",
      lineReportTypeList: [
        { text: "金额", value: "amt" },
        { text: "件数", value: "qty" }
      ],
      lineReportData: [],
      lineReportY: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      lineReportX: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12"
      ],
      riseImg: require("@/assets/images/find/client_icon_up@2x.png"),
      fallImg: require("@/assets/images/find/client_icon_down@2x.png"),
      dateType: "day",
      currentDate: new Date(),
      yearList: []
    };
  },
  computed: {
    queryTitle() {
      if (this.list.length == 0) return "";
      if (this.countType == "customer") {
        return this.list.find(e => {
          return e.value == this.query.csCode;
        }).text;
      } else {
        return this.list.find(e => {
          return e.value == this.query.qdCode;
        }).text;
      }
    },
    listData() {
      return this.list.filter(e => {
        return e.text.includes(this.filterKey);
      });
    }
  },
  watch: {
    query: {
      handler(newV, oldV) {
        this.initialization();
      },
      deep: true
    },
    lineReportType(newV, oldV) {
      this.renderLineReport();
    },
    countType(newV, oldV) {
      if (newV == "customer") {
        this.detailsReportDatas.customer.hidden = true;
      } else {
        this.detailsReportDatas.customer.hidden = false;
      }
    }
  },
  methods: {
    filterList() {
      this.filtering = true;
      this.findAllList = [];
      this.listIndex = 0;
      this.listFinished = false;
      this.listLoading = false;
      this.onLoadList();
      this.filtering = false;
    },
    //关闭搜索
    clearSearch() {
      this.$refs.search.toggle();
    },
    // 搜索框下拉搜索, 滑动加载更多
    async onLoadList() {
      this.listLoading = true;
      await this.fetchListData()
        .then(res => {
          res.forEach(e => {
            this.findAllList.push(e);
          });
          if (res.length < 10) this.listFinished = true;
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    fetchListData() {
      return new Promise((resolve, reject) => {
        let res = this.listData.slice(this.listIndex, this.listIndex + 10);
        this.listIndex += res.length;
        resolve(res);
      });
    },
    // 传值给 query code
    chooseQueryCode(item) {
      if (this.countType == "customer") {
        this.query.csCode = item.value;
      } else {
        this.query.qdCode = item.value;
      }
      this.clearSearch();
    },
    clickDay(date) {
      this.query.time = date;
      this.closeTime();
    },
    toDay() {
      this.$refs.calendar.ChoseMonth(
        this.$utils.formatDate(new Date(), "Y/M/D")
      );
    },
    // 默认点击选择
    clickMonth() {
      this.query.time = this.$utils.formatDate(this.currentDate, "Y/M");
      this.closeTime();
    },
    //初始化年的数值
    getDateYears() {
      let year = new Date().getFullYear() - 10;
      for (var a = 1; a <= 20; a++) {
        this.yearList.push(`${year}`);
        year++;
      }
    },
    onChangeYear(vm, year, index) {
      this.currentDate = new Date(year);
    },
    // 选择年
    clickYear() {
      this.query.time = this.$utils.formatDate(this.currentDate, "Y");
      this.closeTime();
    },
    closeTime() {
      this.$refs.time.toggle();
    },
    async initialization() {
      this.fetchCountReport();
      this.fetchDetailsReport();
    },
    fetchCountReport() {
      let params = this.getQueryParams();
      switch (this.countType) {
        case "channel":
          return getChannelCount(params).then(res => {
            this.reportData = res.records.map(e => {
              e.name = e.qdName;
              e.code = e.qdCode;
              return e;
            });
          });
        case "customer":
          return getCustomerCount(params).then(res => {
            this.reportData = res.records.map(e => {
              e.name = e.csName;
              e.code = e.csCode;
              return e;
            });
          });
      }
    },
    fetchDetailsReport() {
      let params = this.getQueryParams();
      this.$toast.loading({
        duration: 0,
        message: "加载中...",
        forbidClick: true
      });
      let time = this.$moment(params.endTime);
      params.time = time.endOf("year").format("YYYY-MM");
      switch (this.countType) {
        case "channel":
          getChannelGrowth(params)
            .then(res => {
              res.sort((val1, val2) => {
                let time1 = val1.date.split('-')[1]
                let time2 = val2.date.split('-')[1]
                return parseInt(time1) - parseInt(time2)
              });
              console.log(res);
              this.lineReportData = res;
              this.renderLineReport();
            })
            .finally(() => {
              this.$toast.clear();
            });
          break;
        case "customer":
          getCustomerGrowth(params)
            .then(res => {
              res.sort((val1, val2) => {
                let time1 = val1.date.split('-')[1]
                let time2 = val2.date.split('-')[1]
                return parseInt(time1) - parseInt(time2)
              });
              console.log(res);
              this.lineReportData = res;
              this.renderLineReport();
            })
            .finally(() => {
              this.$toast.clear();
            });
          break;
      }
      this.getDetailsRatio();
    },
    renderLineReport() {
      this.lineReportData.forEach((d, index) => {
        this.lineReportY[index] = parseFloat(
          d[this.lineReportType] / 10000
        ).toFixed(2);
      });
      this.drawLine();
    },
    async getDetailsRatio() {
      let params = this.getQueryParams();
      getSkuCount(params).then(res => {
        this.detailsReportDatas.sku.data = res.records.map(e => {
          e.name = e.skuName;
          e.code = e.skuCode;
          return e;
        });
      });
      getCustomerCount(params).then(res => {
        this.detailsReportDatas.customer.data = res.records.map(e => {
          e.name = e.csName;
          e.code = e.csCode;
          return e;
        });
      });
      getCategoryCount(params).then(res => {
        this.detailsReportDatas.cate.data = res.records.map(e => {
          e.name = e.cateName;
          e.id = e.cateId;
          return e;
        });
      });
      getOrgCount(params).then(res => {
        this.detailsReportDatas.org.data = res.records.map(e => {
          e.name = e.orgName;
          e.code = e.orgCode;
          return e;
        });
      });
      getBrandCount(params).then(res => {
        this.detailsReportDatas.brand.data = res.records.map(e => {
          e.name = e.brandName;
          e.id = e.brandId;
          return e;
        });
      });
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      // 绘制图表
      window.onresize = myChart.resize; // 适应屏幕放大缩小
      myChart.setOption({
        // 标题
        title: {
          //标题的样式
          // text: "2019销售走势",
          x: "center"
        },
        // x轴
        xAxis: {
          name: "月份",
          type: "category",
          boundaryGap: false,
          axisLabel: {
            interval: 0,
            textStyle: {
              color: "#a7aab3" //x轴，y轴的数字颜色，如图1
            }
          },
          axisLine: {
            //x轴、y轴的深色轴线，如图2
            show: true,
            lineStyle: {
              color: "#D7D8DA"
            }
          },
          splitLine: {
            show: false,
            lineStyle: {
              type: "dashed"
            }
          },
          axisTick: {
            show: false,
            inside: true
          },
          data: this.lineReportX
        },
        //y轴
        yAxis: {
          name: "单位:万",
          type: "value",
          axisLabel: {
            textStyle: {
              color: "#a7aab3" //x轴，y轴的数字颜色，如图1
            }
          },
          axisLine: {
            //x轴、y轴的深色轴线
            show: true,
            lineStyle: {
              color: "#D7D8DA",
              width: 1
            }
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: "#D7D8DA",
              type: "solid",
              width: 1
            }
          }
        },
        // 点击坐标提示
        tooltip: {
          trigger: "axis",
          //在这里设置
          formatter: "{b0}月<br/>销量:{c0}万",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        grid: {
          left: "14%", //设置canvas图距左的距离
          right: "14%"
        },
        series: [
          // 第一个曲线
          {
            data: this.lineReportY,
            type: "line",
            symbol: "circle", //拐点设置为实心
            symbolSize: 7, //拐点大小
            itemStyle: {
              normal: {
                color: "#40A9FF", //拐点颜色
                // borderColor:'white',//拐点边框颜色
                borderWidth: 3, //拐点边框大小
                boxShadow: "0px 4px 8px 0px rgba(25,137,250,0.3)",
                lineStyle: {
                  color: "#1989FA"
                }
              },
              emphasis: {
                color: "#40A9FF",
                borderColor: "white"
              }
            },
            smooth: true
          },
          // 曲线的下面的虚线
          {
            data: this.lineReportY,
            type: "bar",
            barWidth: 1,
            splitLine: {
              show: true,
              lineStyle: {
                type: "dashed"
              }
            },
            itemStyle: {
              normal: {
                color: "#fff",
                barBorderColor: "#dddee0",
                barBorderWidth: 1,
                barBorderRadius: 0,
                borderType: "dashed"
              }
            }
          }
        ]
      });
    },
    initSwiper() {
      let galleryThumbs = new Swiper(".gallery-thumbs-two", {
        slidesPerView: "auto",
        freeMode: true,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        autoHeight: true,
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        onSlideChangeEnd: function(galleryThumbs) {
          galleryThumbs.update(); //swiper更新
        }
      });
      let galleryTop = new Swiper(".gallery-top-two", {
        autoHeight: true,
        allowTouchMove: false, //阻止滑动
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        thumbs: {
          swiper: galleryThumbs
        },
        on: {
          slideChangeTransitionStart: () => {}
        },
        onSlideChangeEnd: function(galleryTop) {
          galleryTop.update(); //swiper更新
        }
      });
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
    lookDetails(key) {
      let query = this.getQueryParams();
      query.ratioType = key;
      this.$router.push({ path: "salesDataDetailsPage", query });
    },
    routeDetailsAnalysis(key,item) {
      let params = this.getQueryParams();
      let query = {
        ratioType: key,
        id:item.id,
        code:item.code,
        name:item.name,
        startTime: params.startTime,
        endTime: params.endTime,
        qdCode: this.query['qdCode']
      };
      this.$router.push({ path: "salesDataDetailsAnalysisPage", query });
    }
  },
  mounted() {
    // this.drawLine();
    this.initSwiper();
  },
  async created() {
    console.log('created')
    this.countType = this.$route.query.countType;
    this.dateType = this.$route.query.dateType;
    let params = {
      csCode: this.$route.query.csCode,
      qdCode: this.$route.query.qdCode,
      time: this.$route.query.time
    };
    this.query = Object.assign(this.query, params);
    switch (this.countType) {
      case "customer":
        await getCustomerList({}).then(res => {
          this.list = res.map(e => {
            return { text: e.name, value: e.ncCode };
          });
        });
        break;
      case "channel":
        await getChannelList().then(res => {
          this.list = res.map(e => {
            return { text: e.name, value: e.code };
          });
        });
        break;
    }
    this.onLoadList();
    this.getDateYears(); // 初始化年份
  },
  destroyed() {
    this.$toast.clear();
  }
};
</script>

<style lang="scss" scoped>
/deep/ .wh_content_all {
  background-color: white !important ;
}
/deep/ .van-dropdown-item__content {
  display: flex;
  flex-direction: column;
  box-shadow: rgba(0, 0, 0, 0.7) 10px 10px 10px 1000px;
}
/deep/ .wh_top_changge {
  color: black !important ;
}

/deep/ .wh_content_item {
  color: black !important ;
}
/deep/ .wh_content_item .wh_isToday {
  background: transparent !important ;
  border-radius: 100px;
}
/deep/ .wh_content_item .wh_chose_day {
  background: #477ae7 !important ;
  color: white !important ;
  border-radius: 100px;
}
/deep/ .van-dropdown-item--down {
  margin-top: 5px;
}
/deep/ .van-dropdown-menu__item {
  flex: inherit;
  background: rgba(245, 246, 249, 1);
  color: #6b7178;
  font-size: 13px;
  width: 50%;
  margin-left: 5%;
  margin-right: 5%;
  margin-left: 5%;
  height: 30px;
  padding: 0 15px 0 15px;
  background: rgba(245, 246, 249, 1);
  border-radius: 14px;
  overflow: hidden;
}
/deep/ .van-dropdown-menu {
  height: 25px;
}
/deep/ .van-ellipsis {
  font-size: 13px;
}
/deep/ .wh_top_changge li {
  color: #000;
  div {
    border-color: #000;
  }
}
//商超
.BusinessSuper {
  width: 92%;
  margin: 0 auto;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 11px 0px rgba(159, 190, 240, 0.16);
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  padding: 8% 5% 5% 5%;
  box-sizing: border-box;
  letter-spacing: 1px;
  p {
    margin: 0;
    padding: 0;
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

  div {
    width: 50%;
    text-align: left;
    position: relative;
    box-sizing: border-box;
    padding: 2% 0% 2% 0%;
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
      font-weight: 600;
      color: rgba(57, 60, 65, 1);
      padding-bottom: 1rem;
    }
    p:nth-child(3) {
      font-size: 13px;
      color: rgba(149, 156, 167, 1);
      span {
        margin-left: 5%;
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
/deep/ .van-dropdown-menu__title {
  position: relative;
  box-sizing: border-box;
  max-width: none;
  padding: 0 8px;
  color: #323233;
  font-size: 15px;
  text-align: center;
  width: 90%;
  margin: 0 auto;
}
.Title-More {
  p {
    margin: 1rem 0 1rem 0;
    flex: 1;
  }
  //公共标题
  width: 92%;
  margin: 0 auto;
  font-size: 18px;
  color: black;
  line-height: 21px;
  text-align: left;
  padding-top: 1rem;
  padding-bottom: 0.2rem;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -ms-flex-line-pack: center;
  align-content: center;
  div {
    color: #959ca7;
    font-weight: 500;
    display: flex;
    align-items: center;
    font-size: 14px;
  }
  i {
    margin-top: -3px;
  }
}
.More {
  //公共标题
  width: 92%;
  margin: 0 auto;
  font-size: 18px;
  color: black;
  line-height: 21px;
  text-align: left;
  padding-top: 1rem;
  padding-bottom: 0.2rem;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -ms-flex-line-pack: center;
  // align-content: center;
  align-items: center;
}

#page {
  height: 100vh;
  overflow-y: scroll;
  overflow-x: hidden;
  background: white;
}

[class*="van-hairline"]::after {
  position: initial;
  box-sizing: border-box;
  content: " ";
  pointer-events: none;
  top: -50%;
  right: -50%;
  bottom: -50%;
  left: -50%;
  border: 0 solid #ebedf0;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
}

.swiper-wrapper {
  height: auto !important;
}
// 总盒子
.galleryDiv {
  // height: 1px;
  overflow: hidden;
  ul {
    width: 92%;
    margin: 0 auto;
    background: white;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 30px 0px rgba(58, 120, 239, 0.08);
    border-radius: 8px;
    padding-top: 1rem;
    li {
      width: 92%;
      margin: 0 auto;
      overflow: hidden;
      display: flex;
      justify-content: space-between;
      padding-top: 0.8rem;
      padding-bottom: 0.8rem;
      span {
        display: inline-block;
        font-size: 15px;
        word-break: break-all;
        overflow: hidden;
      }
      span:nth-child(1) {
        width: 40%;
        color: #959ca7;
      }

      span:nth-child(2) {
        width: 60%;
      }
    }
  }
} /* 随意指定一个height值即可 */
.swiper-slide-active {
  height: auto;
}
.swiper-slide-thumb-active {
  position: relative;
  color: #393c41 !important;
}
.swiper-slide-thumb-active::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 0%;
  transform: translate(-50%);
  width: 30%;
  height: 10px;
  border-bottom: 3px solid #3a78ef;
  font-weight: 600;
}

// 按钮
.classification {
  text-align: left;
  width: 80%;
  margin: 0 auto;
  margin-top: 0.3rem;
  margin-bottom: 2rem;
  overflow: hidden;
  display: flex;
  justify-content: center;
  span {
    display: inline-block;
    letter-spacing: 2px;
    font-size: 16px;
    padding: 4px 3px 10px 3px;
    color: #393c41;
    font-weight: 500;
    text-align: center;
    // margin-right: 7%;
    width: 50%;
    text-align: center;
  }
}
// 分类头部
.classiflistTitle {
  text-align: left;
  width: 92%;
  margin: 0 auto;
  margin-top: 10px;
  margin-bottom: 10px;
  overflow: hidden;
  position: relative;
  span {
    display: inline-block;
    width: auto !important;
    letter-spacing: 2px;
    font-size: 15px;
    padding: 4px 3px 9px 3px;
    color: #959ca7;
    font-weight: 500;
    text-align: center;
    margin-right: 7%;
  }
  .search {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(0, -50%);
    margin: 0;
    img {
      width: 20px;
    }
  }
}
.classificationtwo {
  text-align: left;
  width: 92%;
  margin: 0 auto;
  margin-top: 10px;
  margin-bottom: 10px;
  // overflow: hidden;
  position: relative;
  span {
    display: inline-block;
    width: auto !important;
    letter-spacing: 2px;
    font-size: 15px;
    padding: 4px 3px 9px 3px;
    color: #959ca7;
    font-weight: 500;
    text-align: center;
    margin-right: 7%;
  }
  .search {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(0, -50%);
    margin: 0;
    img {
      width: 20px;
    }
  }
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
    span:nth-child(2) {
      overflow: hidden;
      flex: 1;
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

p {
  word-wrap: break-word;
  word-break: break-all;
}

.menu {
  /deep/ .van-dropdown-menu__item {
    flex: inherit;
    background: rgba(245, 246, 249, 1);
    color: #6b7178;
    font-size: 13px;
    width: 100px;
    margin-left: 5%;
    margin-right: 5%;
    height: 30px;
    padding: 0 15px 0 15px;
    background: rgba(245, 246, 249, 1);
    border-radius: 14px;
  }
}
</style>