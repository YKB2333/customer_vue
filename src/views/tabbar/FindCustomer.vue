<template>
  <section class="page">
    <!-- 总页面头部 -->
    <div class="findCustomer">
      <div class="swiper-wrapper classification">
        <span class="swiper-slide" v-for="item in pageTitle" :key="item.id">{{ item.name }}</span>
      </div>
    </div>

    <!-- 总页面主体内容 -->
    <div class="gallery-top">
      <div class="swiper-wrapper">
        <!-- 客户 -->
        <div class="swiper-slide findCustomerDiv">
          <!-- 头部图片 -->
          <div class="find-header-image banner">
            <img src="@/assets/images/find/top.png" alt />
          </div>
          <!-- 本月业绩 -->
          <div class="Title-More">
            <p>销售业绩</p>
          </div>
          <div class="Performance">
            <p>
              本月其它客户POS总数
              <span>(万元)</span>
            </p>
            <div class="Performance-box">
              <div>
                <span>{{monthAchivementData.otherPosSales | toThousandFilter}}</span>
                <span>当前</span>
              </div>
              <!-- <div>
                <span>{{monthAchivementData.otherPosGoal | toThousandFilter}}</span>
                <span>目标</span>
              </div>-->
            </div>
            <!-- 进度条 -->
            <div class="progress green">
              <div
                :class="['progress-bar', parseInt(monthAchivementData.otherPosPercent) <= 30?'progress-bar-red':'' ]"
                :style="{'width':(parseInt(monthAchivementData.otherPosPercent) > 100?'100%':monthAchivementData.otherPosPercent),'background':parseInt(monthAchivementData.otherPosPercent) <=30 ?'#FF3750':'#00c873'}"
              >
                <div
                  class="progress-value"
                >{{monthAchivementData.otherPosPercent=='0%'?'':monthAchivementData.otherPosPercent}}</div>
                <div class="progress-value-left">0</div>
              </div>
            </div>
          </div>
          <div class="Performance">
            <p>
              {{yearWeek.year}}年第{{ yearWeek.week }}周屈臣氏JK&彩妆类POS数
              <span>(万元)</span>
            </p>
            <div class="Performance-box">
              <div>
                <span>{{monthAchivementData.qcsPosSales | toThousandFilter}}</span>
                <span>当前</span>
              </div>
              <!-- <div>
                <span>{{monthAchivementData.qcsPosGoal | toThousandFilter}}</span>
                <span>目标</span>
              </div>-->
            </div>
            <!-- 进度条 -->
            <div class="progress green">
              <div
                :class="['progress-bar', parseInt(monthAchivementData.qcsPosPercent) <= 30?'progress-bar-red':'' ]"
                :style="{'width':(parseInt(monthAchivementData.qcsPosPercent) > 100?'100%':monthAchivementData.qcsPosPercent),'background':parseInt(monthAchivementData.qcsPosPercent) <=30 ?'#FF3750':'#00c873'}"
              >
                <div
                  class="progress-value"
                >{{monthAchivementData.qcsPosPercent=='0%'?'':monthAchivementData.qcsPosPercent}}</div>
                <div class="progress-value-left">0</div>
              </div>
            </div>
          </div>
          <div class="Performance">
            <p>
              本月出货数
              <span>(万元)</span>
            </p>
            <div class="Performance-box">
              <div>
                <span>{{monthAchivementData.billSales | toThousandFilter}}</span>
                <span>当前</span>
              </div>
              <!-- <div>
                <span>{{monthAchivementData.billGoal | toThousandFilter}}</span>
                <span>目标</span>
              </div>-->
            </div>
            <!-- 进度条 -->
            <div class="progress green">
              <div
                :class="['progress-bar', parseInt(monthAchivementData.billPercent) <= 30 ?'progress-bar-red':'' ]"
                :style="{'width':(parseInt(monthAchivementData.billPercent) > 100 ?'100%':monthAchivementData.billPercent),'background':parseInt(monthAchivementData.billPercent) <= 30 ?'#FF3750':'#00c873'}"
              >
                <div
                  class="progress-value"
                >{{parseInt(monthAchivementData.billPercent)== 0 ?'':(parseInt(monthAchivementData.billPercent) >= 100 ? '100%' : monthAchivementData.billPercent) }}</div>
                <div class="progress-value-left">0</div>
              </div>
            </div>
          </div>
          <!-- 本月业绩 end-->
          <!-- 客户销售排行 -->
          <div class="Title-More">
            <p>客户销售排行</p>
          </div>
          <div class="salesRanking">
            <!-- 排行名字 -->
            <div class="salesRankingBox">
              <div class="swiper-wrapper salesRanking-classification">
                <span
                  class="swiper-slide"
                  v-for="item in salesRankingList"
                  :key="item.id"
                >{{ item.name }}</span>
              </div>
            </div>
            <!-- 排行列表 -->
            <div class="salesRankingBox-top">
              <div class="swiper-wrapper">
                <div
                  class="swiper-slide salesRankingBoxDiv"
                  v-for="item in salesRankingList"
                  :key="item.key"
                >
                  <ul>
                    <li v-for="(arr,arrIndex) in 10" :key="arr">
                      <span>
                        <img
                          :src="require(`@/assets/images/find/list${arrIndex}.png`)"
                          alt
                          v-if="arrIndex<3"
                        />
                        {{ arrIndex > 2 ?arrIndex+1:'' }}
                      </span>
                      <span>{{ item.sales[arrIndex]==null?'-':item.sales[arrIndex].csName }}</span>
                      <span :class="{'salesRankingBoxDivActive':arrIndex<3}">
                        <!-- {{ item.sales[arrIndex]==null?'-':((item.sales[arrIndex].amt/10000) |toThousandFilter)+'万' }} -->
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <!-- 客户销售排行 -->
          <div class="Title-More">
            <p>客户销售详情</p>
          </div>
          <div class="customerSales">
            <div @click="$router.push(`/salesdata`)">
              <img src="@/assets/images/find/client_icon_data@2x.png" alt />
              <span>销售数据</span>
            </div>
            <div @click="$router.push(`/management`)">
              <img src="@/assets/images/find/client_icon_mana@2x.png" alt />
              <span>客户管理</span>
            </div>
          </div>
        </div>
        <!-- 客户end -->

        <!-- 第二页 销售工具 -->
        <div class="swiper-slide findCustomerDiv">
          <!-- 销售工具 -->
          <div class="Title-More">
            <p>销售工具</p>
          </div>
          <div class="salesTools">
            <div
              v-for="item in salesToolsData"
              :key="item.id"
              @click="$router.push({path:'casedetails',query:{id:item.id}})"
            >
              <img :src="item.titleImage" alt />
              <span>{{item.title}}</span>
            </div>
          </div>
          <!-- 销售案例课程 -->
          <div class="Title-More">
            <p>销售案例课程</p>
            <div @click="$router.push('salesExample')">
              <span>更多</span>
              <van-icon name="arrow" />
            </div>
          </div>
          <ul class="course">
            <li
              v-for="item in salesExamples"
              :key="item.id"
              @click="$router.push({path:'casedetails',query:{id:item.id}})"
            >
              <div>
                <p class="ellipsis2">{{item.title}}</p>
                <p>
                  <span @click.stop="clickCollect(item)">
                    <img :src="item.collected?collectIcon:collectPreIcon" alt />
                  </span>
                  <span @click.stop="clickLike(item)" class="flex center-y">
                    <img :src="item.like?likeIcon:likePreIcon" alt />
                    <span>{{item.likeCount}}</span>
                  </span>
                </p>
              </div>
              <div>
                <img :src="item.titleImage" alt />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Swiper from "swiper";
import { savePosition } from "@/mixins";
import { cmsCategoryId } from "@/config";
import {
  getAchievement,
  getSalesRank,
  getInfoPage,
  addFavorite,
  cancelFavorite,
  addLike,
  cancelLike
} from "@/api/findCustomer";
import { selectPage as selectInfoPage } from "@/api/cms";
export default {
  name: "FindCustomer",
  components: {},
  mixins: [new savePosition()],
  data() {
    return {
      pageTitle: [{ id: 1, name: "客户" }, { id: 2, name: "销售工具" }], // 页面不同title
      // bannerList: [require('@/assets/images/find/top.png')],
      bannerList: [],
      //客户销售排行数据
      salesRankingList: [
        { key: "month", name: "月榜", sales: [] },
        { key: "week", name: "周榜", sales: [] },
        { key: "day", name: "日榜", sales: [] }
      ],
      //本月业绩
      monthAchivementData: {},
      salesExamples: [],
      salesToolsData: [],
      likeIcon: require("@/assets/images/find/client_icon_like@2x.png"),
      likePreIcon: require("@/assets/images/find/client_icon_like_pre@2x.png"),
      collectIcon: require("@/assets/images/find/client_icon_collect@2x.png"),
      collectPreIcon: require("@/assets/images/find/client_icon_collect_pre@2x.png"),
      yearWeek:{},//年周
    };
  },
  created() {
    this.fetchBanner();
    this.fetchMonthAchievement();  //业绩目标暂不开放
    this.fetchSalesRank();
    this.fetchSalesTools();
    this.fetchSalesExample();
  },
  mounted() {
    this.getSwiperInit(); //初始化滑动-主体
    this.getSalesRankingBox(); // 初始化滑动-客户销售排行
    this.yearWeek = this.getWeek(new Date());
  },
  computed: {},
  methods: {
    getWeek (dateTime) {
        let temptTime = dateTime
        //周几
        let weekday = temptTime.getDay() || 7
        //周1+5天=周六
        temptTime.setDate(temptTime.getDate() - weekday + 1 + 5)
        let firstDay = new Date(temptTime.getFullYear(), 0, 1)
        let dayOfWeek = firstDay.getDay()
        let spendDay = 1
        if (dayOfWeek != 0) {
          spendDay = 7 - dayOfWeek + 1
        }
        firstDay = new Date(temptTime.getFullYear(), 0, 1 + spendDay)
        let d = Math.ceil((temptTime.valueOf() - firstDay.valueOf()) / 86400000)
        let result = Math.ceil(d / 7)
        return  { week:result + 1,year:temptTime.getFullYear()}
      },
    fetchBanner() {
      selectInfoPage({
        pageIndex: 1,
        pageSize: 3,
        status: "1",
        infoCategoryId: cmsCategoryId.findTopBanner
      }).then(res => {
        this.bannerList = res.records.map(e => {
          return e.titleImage;
        });
      });
    },
    fetchMonthAchievement() {
      let params = {
        pageIndex: 1,
        pageSize: 1,
        startTime: this.$moment()
          .startOf("month")
          .valueOf(),
        endTime: this.$moment()
          .endOf("month")
          .valueOf()
      };
      getAchievement(params).then(res => {
        //其他POS
        res.otherPosSales = (res.otherPosSales || 0) / 10000;
        res.otherPosGoal = res.otherPosGoal || 0;
        // res.otherPosPercent = this.countPercent(
        //   res.otherPosSales,
        //   res.otherPosGoal
        // );
        res.otherPosPercent = res.otherPosSales == 0 ? "0%" : "100%";

        //屈臣氏POS
        res.qcsPosSales = (res.qcsPosSales || 0) / 10000;
        res.qcsPosGoal = res.qcsPosGoal || 0;
        // res.qcsPosPercent = this.countPercent(res.qcsPosSales, res.qcsPosGoal);
        res.qcsPosPercent = res.qcsPosSales == 0 ? "0%" : "100%";

        //出货数
        res.billSales = (res.billSales || 0) / 10000;
        res.billGoal = res.billGoal || 0;
        // res.billPercent = this.countPercent(res.billSales, res.billGoal);
        res.billPercent = res.billSales == 0 ? "0%" : "100%";
        this.monthAchivementData = res;
      });
    },
    fetchSalesRank() {
      //月榜
      let monthParams = {
        pageIndex: 1,
        pageSize: 10,
        startTime: this.$moment()
          .startOf("month")
          .valueOf(),
        endTime: this.$moment()
          .endOf("month")
          .valueOf()
      };
      getSalesRank(monthParams).then(res => {
        res.records.forEach(e => {
          this.salesRankingList[0].sales.push(e);
        });
      });
      //周榜
      let weekParams = {
        pageIndex: 1,
        pageSize: 10,
        startTime: this.$moment()
          .startOf("isoweek")
          .valueOf(),
        endTime: this.$moment()
          .endOf("isoweek")
          .valueOf()
      };
      getSalesRank(weekParams).then(res => {
        res.records.forEach(e => {
          this.salesRankingList[1].sales.push(e);
        });
      });
      //日榜
      let dayParams = {
        pageIndex: 1,
        pageSize: 10,
        startTime: this.$moment()
          .subtract(1, "days")
          .startOf("day")
          .valueOf(),
        endTime: this.$moment()
          .subtract(1, "days")
          .endOf("day")
          .valueOf()
      };
      getSalesRank(dayParams).then(res => {
        res.records.forEach(e => {
          this.salesRankingList[2].sales.push(e);
        });
      });
    },
    // 初始化滑动-父盒子
    getSwiperInit() {
      let galleryThumbs = new Swiper(".findCustomer", {
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
    // 初始化滑动-客户销售排行
    getSalesRankingBox() {
      let galleryThumbs = new Swiper(".salesRankingBox", {
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
      let galleryTop = new Swiper(".salesRankingBox-top", {
        autoHeight: true,
        allowTouchMove: false, //阻止滑动
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        thumbs: {
          swiper: galleryThumbs,
          slideThumbActiveClass: "salesRankingBox-slide-thumb-active"
        },
        onSlideChangeEnd: function(galleryTop) {
          galleryTop.update(); //swiper更新
        }
      });
    },
    countPercent(sales, goal) {
      if (sales == 0) return this.$utils.toPercentFilter(0, 0, false);
      if (goal == 0) return this.$utils.toPercentFilter(1, 0, false);
      return this.$utils.toPercentFilter(sales / goal, 0, false);
    },
    fetchSalesTools() {
      getInfoPage({
        pageIndex: 1,
        pageSize: 4,
        status: "1",
        infoCategoryId: cmsCategoryId.salesTools
      }).then(res => {
        this.salesToolsData = res.records;
      });
    },
    fetchSalesExample() {
      getInfoPage({
        pageIndex: 1,
        pageSize: 3,
        status: "1",
        infoCategoryId: cmsCategoryId.findSalesExample
      }).then(res => {
        this.salesExamples = res.records;
      });
    },
    clickLike(item) {
      if (item.like) {
        cancelLike(item.id).then(res => {
          item.like = false;
          item.likeCount -= 1;
        });
      } else {
        item.contentType = "customerSalesExample";
        addLike(item).then(res => {
          item.like = true;
          item.likeCount += 1;
        });
      }
    },
    clickCollect(item) {
      if (item.collected) {
        cancelFavorite(item.id).then(res => {
          item.collected = false;
        });
      } else {
        item.contentType = "customerSalesExample";
        addFavorite(item).then(res => {
          item.collected = true;
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
// 销售案例课程
.course {
  width: 90%;
  margin: 0 auto;
  margin-bottom: 20px;
  li {
    padding: 5.5%;
    display: flex;
    align-content: center;
    align-items: center;
    text-align: left;
    box-shadow: 0px 2px 11px 0px rgba(159, 190, 240, 0.16);
    border-radius: 8px;
    margin-bottom: 1rem;
    div:nth-child(1) {
      width: 70%;
      margin-right: 3%;
      p:nth-child(1) {
        color: #393c41;
        font-size: 16px;
        font-weight: 600;
        letter-spacing: 2px;
      }
      p:nth-child(2) {
        margin-top: 14px;
        color: #959ca7;
        font-size: 12px;
        display: flex;
        align-items: center;
        span {
          margin-right: 24px;
          display: flex;
          align-content: center;
          img {
            width: 22px;
            height: 22px;
            margin-right: 5px;
          }
        }
      }
    }
    div:nth-child(2) {
      width: 30%;
      img {
        width: 100%;
        height: 76px;
        object-fit: cover;
      }
    }
  }
}
// 销售工具
.salesTools {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 90%;
  margin: 0 auto;
  div {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48.5%;
    padding: 7.5% 5% 7.5% 5%;
    box-sizing: border-box;
    box-shadow: 0px 2px 11px 0px rgba(159, 190, 240, 0.16);
    margin-bottom: 3%;
    img {
      width: 38%;
      margin-right: 8%;
    }
    span {
      color: #393c41;
      font-size: 15px;
    }
  }
}
//客户详情
.customerSales {
  display: flex;
  justify-content: space-between;
  width: 90%;
  margin: 0 auto;
  margin-bottom: 4rem;
  div {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48.5%;
    padding: 7.5% 6% 7.5% 6%;
    box-sizing: border-box;
    box-shadow: 0px 2px 11px 0px rgba(159, 190, 240, 0.16);
    img {
      width: 38%;
      margin-right: 8%;
    }
    span {
      color: #393c41;
      font-size: 15px;
    }
  }
}
//客户销售排行
.salesRanking {
  overflow: hidden;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 11px 0px rgba(159, 190, 240, 0.16);
  border-radius: 8px;
  width: 90%;
  margin: 0 auto;
}
.salesRankingBox-top {
  width: 90%;
  margin: 0 auto;
  overflow: hidden;
}
.salesRankingBoxDiv {
  ul {
    margin-bottom: 2rem;
    li {
      display: flex !important;
      position: relative;
      justify-content: flex-start !important;
      align-items: flex-start !important;
      margin-bottom: 1.1rem;
      overflow: hidden;
      span:nth-child(1) {
        width: 22px;
        height: 22px;
        line-height: 22px;
        margin-right: 20px;
        text-align: center;
        font-size: 14px;
        color: #303133;
        img {
          width: 100%;
          height: 100%;
        }
      }
      span:nth-child(2) {
        min-height: 22px;
        color: #303133;
        font-size: 14px;
        flex: 1;
      }
      span:last-child {
        position: absolute;
        right: 0;
        color: #606266;
        font-size: 14px;
      }
      .salesRankingBoxDivActive {
        color: #ef9236 !important;
      }
    }
  }
}
.salesRankingBox-slide-thumb-active {
  background: rgba(58, 120, 239, 1) !important;
  box-shadow: 0px 2px 6px 0px rgba(58, 120, 239, 0.3) !important;
  color: white !important;
}
.salesRanking-classification {
  text-align: left;
  width: 90%;
  margin: 0 auto;
  margin-top: 30px;
  margin-bottom: 30px;
  span {
    display: inline-block;
    width: auto !important;
    letter-spacing: 2px;
    font-size: 14px;
    padding: 4px 16px 4px 16px;
    color: #959ca7;
    font-weight: 500;
    text-align: center;
    margin-right: 7%;
    background: #f4f4f4;
    border-radius: 19px;
  }
}
// 本月业绩
.Performance {
  width: 90%;
  margin: 0 auto;
  box-shadow: 0px 2px 11px 0px rgba(159, 190, 240, 0.16);
  box-sizing: border-box;
  border-radius: 8px;
  padding: 5%;
  margin-bottom: 0.9rem;
  .Performance-box {
    display: flex;
    justify-content: space-between;
    div {
      margin-bottom: 1.7rem;
      span {
        display: block;
      }
      span:nth-child(1) {
        color: #393c41;
        font-size: 25px;
        margin-bottom: 5px;
      }
      span:nth-child(2) {
        color: #959ca7;
        font-size: 14px;
      }
    }
  }
  p {
    margin: 0;
    padding: 0;
    margin-bottom: 1.5rem;
    font-size: 16px;
    color: #393c41;
    span {
      color: #a7adb5;
      font-size: 12px;
    }
  }
}
// 进度条
.progress {
  width: 100%;
  margin: 0 auto;
  height: 6px;
  background: #eff0f1;
  border-radius: 0;
  box-shadow: none;
  margin-bottom: 40px;
  overflow: visible;
  position: relative;
  border-radius: 5px;
}
.progress .progress-bar {
  box-shadow: none;
  border-radius: 0;
  height: 100%;
  position: relative;
  -webkit-animation: animate-positive 2s;
  animation: animate-positive 2s;
  border-radius: 5px;
}
.progress .progress-bar:after {
  content: "";
  width: 10px;
  height: 10px;
  border-radius: 50%;
  // box-shadow: 0 5px 5px rgba(0,0,0,0.2);
  box-shadow: 0px 4px 8px 0px rgba(0, 200, 115, 0.2);
  background: #00c873;
  position: absolute;
  right: -5px;
  top: -4px;
  border: 3px solid white;
}
.progress .progress-bar-red:after {
  content: "";
  width: 10px;
  height: 10px;
  border-radius: 50%;
  // box-shadow: 0 5px 5px rgba(0,0,0,0.2);
  // box-shadow:0px 4px 8px 0px rgba(0,200,115,0.2);
  box-shadow: 0px 4px 8px 0px rgba(255, 55, 80, 0.2);
  background: #ff3750;
  position: absolute;
  right: -5px;
  top: -4px;
  border: 3px solid white;
}
.progress .progress-value {
  font-size: 14px;
  color: #959ca7;
  text-align: center;
  position: absolute;
  bottom: -34px;
  right: -13px;
}
.progress-value-left {
  font-size: 14px;
  color: #959ca7;
  text-align: center;
  position: absolute;
  bottom: -34px;
}
.progress.green .progress-bar:after {
  border: 2px solid white;
}

@-webkit-keyframes animate-positive {
  0% {
    width: 0;
  }
}
@keyframes animate-positive {
  0% {
    width: 0;
  }
}

.find-header-image {
  width: 100%;
  height: 140px;
  img {
    width: 100%;
    height: 100%;
  }
}
// 统一标题
.Title-More {
  p {
    margin: 1rem 0 1rem 0;
  }
  font-weight: 600;
  width: 90%;
  margin: 0 auto;
  font-size: 18px;
  color: black;
  line-height: 21px;
  text-align: left;
  // font-weight: 600;
  // padding-top: 35px;
  // padding-bottom: 19px;
  padding-top: 0.6rem;
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

.page {
  overflow-x: hidden;
  height: 100vh;
  background: rgb(255, 255, 255);
}
// 总盒子
.findCustomerDiv {
  height: 1px;
  overflow: hidden;
}
.swiper-slide-active {
  height: auto;
}

.swiper-slide-thumb-active::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 0%;
  transform: translate(-50%);
  width: 60%;
  height: 10px;
  border-bottom: 3px solid #3a78ef;
  font-weight: 600 !important;
}

// 按钮
.classification {
  text-align: left;
  width: 92%;
  margin: 0 auto;
  margin-top: 10px;
  margin-bottom: 10px;
  overflow: hidden;
  span {
    display: inline-block;
    width: auto !important;
    letter-spacing: 2px;
    font-size: 15px;
    padding: 4px 3px 9px 3px;
    color: #959ca7;
    font-weight: 400;
    text-align: center;
    margin-right: 7%;
  }
}
.swiper-slide-thumb-active {
  position: relative;
  color: #393c41 !important;
  font-weight: 600 !important;
}
// 总盒子
</style>