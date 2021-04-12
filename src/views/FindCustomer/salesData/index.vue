<template>
  <section id="page">
    <div id="backTop"></div>
    <!-- 总页面头部 -->
    <div class="gallery-thumbs">
      <div class="swiper-wrapper classification">
        <span
          class="swiper-slide"
          v-for="item in pageTitle"
          :key="item.type+'_title'"
          @click="changeCountType(item.type)"
        >{{ item.name }}</span>
      </div>
    </div>
    <!-- 下拉筛选,日期 -->
    <div>
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
    <div class="gallery-top">
      <div class="swiper-wrapper">
        <!-- 渠道类型 -->
        <div class="swiper-slide galleryDiv">
          <!-- 滑动加载更多 -->
          <van-list
            v-model="channelLoading"
            :finished="countType!='channel'||channelFinished"
            :error="channelError"
            :finished-text="finishedText"
            :error-text="errorText"
            :offset="100"
            @load="onLoadChannel"
          >
            <div v-for="(data,index) in channelReportData" :key="'channel_report_'+index">
              <div class="Title-More">
                <p class="ellipsis">{{data.name}}</p>
                <div @click="routeDetails(data)">
                  <span>查看详情</span>
                  <van-icon name="arrow" />
                </div>
              </div>
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
          </van-list>
        </div>
        <!-- 销售客户 -->
        <div class="swiper-slide galleryDiv">
          <!-- 滑动加载更多 -->
          <van-list
            v-model="customerLoading"
            :finished="countType!='customer'||customerFinished"
            :error="customerError"
            :finished-text="finishedText"
            :error-text="errorText"
            :offset="100"
            @load="onLoadCustomer"
          >
            <div v-for="(data,index) in customerReportData" :key="'customer_report_'+index">
              <div class="Title-More">
                <p class="ellipsis">{{data.name}}</p>
                <div @click="routeDetails(data)">
                  <span>查看详情</span>
                  <van-icon name="arrow" />
                </div>
              </div>
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
          </van-list>
        </div>
      </div>
    </div>
    <!-- 回到顶部 -->
    <van-button type="default" class="backTop" @click="backTop" v-show="flag_scroll">
      <van-icon name="arrow-up" size="20" />
    </van-button>
  </section>
</template>

<script>
import Swiper from "swiper";
import { Picker, PullRefresh, CellGroup, Toast } from "vant";
import { savePosition } from "@/mixins";
import Calendar from "vue-calendar-component";
import {
  getChannelList,
  getCustomerList,
  getChannelCount,
  getCustomerCount
} from "@/api/findCustomer";
import { reject } from "q";
export default {
  name: "SalesData",
  components: { Calendar },
  mixins: [new savePosition('page')],
  data() {
    return {
      pageTitle: [
        { type: "channel", name: "渠道类型" },
        { type: "customer", name: "销售客户" }
      ],
      countType: "channel",
      channelList: [{ text: "全部", value: null }],
      customerList: [{ text: "全部", value: null }],
      filterKey: "", // 搜索的值
      filtering: false,
      findAllList: [],
      listIndex: 0,
      listLoading: false,
      listFinished: false,
      query: {
        qdCode: null,
        csCode: null,
        time: this.$utils.formatDate(new Date(), "Y/M"),
        isCascade: false
      },
      dateType: "month",
      channelPage: {
        pageIndex: 1,
        pageSize: 3
      },
      customerPage: {
        pageIndex: 1,
        pageSize: 3
      },
      riseImg: require("@/assets/images/find/client_icon_up@2x.png"),
      fallImg: require("@/assets/images/find/client_icon_down@2x.png"),
      customerReportData: [],
      channelReportData: [],
      customerLoading: false,
      channelLoading: false,
      customerFinished: false,
      channelFinished: false,
      customerError: false,
      channelError: false,
      finishedText: "没有更多了",
      errorText: "加载失败，请稍后再试",
      flag_scroll: false,
      currentDate: new Date(),
      yearList: []
    };
  },
  computed: {
    queryTitle() {
      // 下拉筛选框 标题
      if (this.query.csCode == null && this.query.qdCode == null) return "全部";
      if (this.countType == "customer") {
        return this.customerList.find(e => {
          return e.value == this.query.csCode;
        }).text;
      } else {
        return this.channelList.find(e => {
          return e.value == this.query.qdCode;
        }).text;
      }
    },
    finished() {
      if (this.countType == "customer") {
        return this.customerFinished;
      } else {
        return this.channelFinished;
      }
    },
    listData() {
      let arr;
      if (this.countType == "customer") {
        arr = this.customerList;
      } else {
        arr = this.channelList;
      }
      return arr.filter(e => {
        return e.text.includes(this.filterKey);
      });
    }
  },
  async created() {
    getChannelList().then(res => {
      res.forEach(e => {
        this.channelList.push({ text: e.name, value: e.code });
      });
      this.changeCountType("channel"); // 请求数据后调用
    });
    getCustomerList({}).then(res => {
      res.forEach(e => {
        this.customerList.push({ text: e.name, value: e.ncCode });
      });
    });
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll, true); // 监听（绑定）滚轮滚动事件
    this.getSwiperInit(); //初始化滑动组件
    this.getDateYears(); // 初始化年份
  },
  watch: {
    query: {
      handler(newV, oldV) {
        if (this.countType == "customer") {
          this.customerPage.pageIndex = 1;
          this.customerLoading = true;
          this.customerFinished = false;
          this.customerError = false;
          this.customerReportData = [];
          this.onLoadCustomer();
        } else {
          this.channelPage.pageIndex = 1;
          this.channelLoading = true;
          this.channelFinished = false;
          this.channelError = false;
          this.channelReportData = [];
          this.onLoadChannel();
        }
      },
      deep: true
    }
  },
  methods: {
    filterList() {
      this.filtering = true;
      this.changeCountType();
      this.filtering = false;
    },
    //关闭搜索
    clearSearch() {
      this.$refs.search.toggle();
    },
    // 获取
    changeCountType(type) {
      if (type) this.countType = type;
      this.listFinished = false;
      this.listIndex = 0;
      this.findAllList = [];
      this.onLoadList();
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
    // 日期选天数
    clickDay(date) {
      this.query.time = date;
      this.closeTime();
    },
    // 选择今天
    toDay() {
      this.$refs.calendar.ChoseMonth(
        this.$utils.formatDate(new Date(), "Y/M/D")
      );
    },
    // 关闭选择器
    closeTime() {
      this.$refs.time.toggle();
    },
    // 初始化滑动-父盒子
    getSwiperInit() {
      let galleryThumbs = new Swiper(".gallery-thumbs", {
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
      let galleryTop = new Swiper(".gallery-top", {
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
    // 渠道类型等数据,请求,加载更多
    async onLoadChannel() {
      let params = this.getQueryParams();
      params.csCode = null;
      params = Object.assign(params, this.channelPage);
      await getChannelCount(params)
        .then(res => {
          // 下来加载更多 会触发两次,清除相同的
          if (
            this.channelReportData[0] != undefined &&
            this.channelReportData[0].qdCode == res.records[0].qdCode
          ) {
            this.channelReportData = [];
          }
          res.records.forEach(e => {
            e.name = e.qdName;
            e.code = e.qdCode;
            this.channelReportData.push(e);
          });
          this.channelPage.pageIndex += 1;
          if (this.channelReportData.length == res.total)
            this.channelFinished = true;
        })
        .catch(e => {
          this.channelError = true;
        })
        .finally(() => {
          this.channelLoading = false;
        });
    },
    async onLoadCustomer() {
      let params = this.getQueryParams();
      params.qdCode = null;
      params = Object.assign(params, this.customerPage);
      await getCustomerCount(params)
        .then(res => {
          // 下来加载更多 会触发两次,清除相同的
          if (
            this.customerReportData[0] != undefined &&
            this.customerReportData[0].csCode == res.records[0].csCode
          ) {
            this.customerReportData = [];
          }
          res.records.forEach(e => {
            e.name = e.csName;
            e.code = e.csCode;
            this.customerReportData.push(e);
          });
          this.customerPage.pageIndex += 1;
          if (this.customerReportData.length == res.total)
            this.customerFinished = true;
        })
        .catch(e => {
          this.customerError = true;
        })
        .finally(() => {
          this.customerLoading = false;
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
    // 点击查看详情路由跳转
    routeDetails(data) {
      this.$router.push({
        path: "salesDataDetails",
        query: {
          countType: this.countType,
          csCode: data.csCode,
          qdCode: data.qdCode,
          time: this.query.time,
          dateType: this.dateType
        }
      });
    },
    //监听回到顶部
    handleScroll() {
      try {
        let scrollTop = document.getElementById("page").scrollTop; // div 到头部的距离
        scrollTop < 50 ? (this.flag_scroll = false) : (this.flag_scroll = true);
      } catch (err) {}
    },
    // 回到顶部
    backTop() {
      document
        .getElementById("backTop")
        .scrollIntoView({ behavior: "smooth", block: "start" });
      this.flag_scroll = false;
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
    }
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll); //  离开页面清除（移除）滚轮滚动事件
  }
};
</script>

<style lang="scss" scoped>
/deep/ .van-dropdown-item--down {
  margin-top: 5px;
}
/deep/ .van-dropdown-item__content {
  display: flex;
  flex-direction: column;
  box-shadow: rgba(0, 0, 0, 0.7) 10px 10px 10px 1000px;
}
/deep/ .wh_content_all {
  background-color: white !important ;
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
      top: -16px;
      right: 12%;
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
  line-height: 18px;
  text-align: center;
  width: 90%;
  margin: 0 auto;
}
.Title-More {
  //公共标题
  p {
    margin: 1rem 1rem 1rem 0;
    flex: 1;
  }
  width: 92%;
  margin: 0 auto;
  font-size: 16px;
  color: black;
  line-height: 21px;
  text-align: left;
  padding-top: 30px;
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
    font-weight: 400;
    display: flex;
    align-items: center;
    font-size: 12px;
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
  height: 1px;
  overflow: hidden;
  margin-bottom: 3rem;
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
  margin-bottom: 1.5rem;
  overflow: hidden;
  display: flex;
  justify-content: center;
  span {
    display: inline-block;
    letter-spacing: 2px;
    font-size: 16px;
    padding: 4px 3px 10px 3px;
    color: #959ca7;
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

.classifyTitle {
  width: 92%;
  margin: 0 auto;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 11px 0px rgba(159, 190, 240, 0.16);
  border-radius: 8px;
  padding: 8% 5% 5% 5%;
  box-sizing: border-box;
  letter-spacing: 1px;
  p {
    margin: 0;
    padding: 0;
  }
  .classifyP {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 2rem;
    padding-left: 3.5%;
    font-size: 16px;
    img {
      width: 22px;
      margin-right: 5px;
    }
  }
  .SuperBorderRight {
    position: relative;
    padding-right: 0;
    padding-left: 5%;
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
      padding: 2% 5% 2% 5%;
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
        font-size: 25px;
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
}
.gallery-top {
  overflow: hidden;
}
p {
  word-wrap: break-word;
  word-break: break-all;
}
.backTop {
  position: fixed;
  right: 3%;
  bottom: 20%;
  z-index: 9999;
}
</style>