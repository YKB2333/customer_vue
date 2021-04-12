<template>
  <div id="home">
    <!-- 搜索 -->
    <!-- <van-sticky>
      <van-search
        :left-icon="require('@/assets/images/icon_search@2x.png')"
        placeholder="请输入客户名/客户渠道"
        readonly
        @focus="$router.push({ path: '/management', query: { autofocus: true } })"
      />
    </van-sticky>-->
    <!--轮播图  -->
    <div class="swiper-container banner-container">
      <div class="swiper-wrapper">
        <div
          class="swiper-slide"
          v-for="item in activityBannerList"
          :key="item.id"
          @click="$router.push({ name: 'CaseDetails', query: { id: item.id} })"
        >
          <img :src="item.titleImage" />
        </div>
      </div>
      <!-- Add Pagination -->
      <div class="swiper-pagination swiper-pagination-banner"></div>
    </div>
    <!-- 客户类型 -->
    <div class="border-bottom-14 pt24">
      <div class="row space-between">
        <div
          class="flex-1 text-center"
          v-for="(item,index) in tabList"
          :key="index"
          @click="$router.push({ path: item.path, query: { id:item.id,code: item.code,name:item.name,relaId:item.relaId } })"
        >
          <img :src="item.src" :alt="item.title" width="50" />
          <p class="fs14 homeImgTitle">{{ item.title }}</p>
        </div>
      </div>
    </div>
    <!-- 本月业绩指标完成率 -->
    <div class="border-bottom-14" v-if="false">
      <base-title title="本月业绩指标完成率" parent_class="mt6" value="更多" is_link :to="saleTargetLink" />
      <sale-target :auth-type="authType" :business-list="businessList"></sale-target>
    </div>
    <!-- 重点营销活动 -->
    <div class="border-bottom-14">
      <base-title title="本周重点营销活动" value="更多" is_link to="/salesPromotion" parent_class="mt6" />
      <div v-if="marketingActList.length" class="plr18">
        <div
          v-for="(item, index) in marketingActList"
          :key="index"
          class="row shadowOne radius8 mb14 plr18 ptb20"
          @click="$router.push({ name: 'EventDetails', query: { id: item.id} })"
        >
          <div>
            <img
              style="object-fit:contain;"
              :src="item.titleImage"
              alt="title-img"
              width="100"
              height="100"
            />
          </div>
          <div
            :class="['flex-1','col','ptb8','pl10',(item.source&&item.pubTimestamp)?'space-between':'space-around']"
            style="overflow: hidden;"
          >
            <p class="fs16 fw600 van-ellipsis">{{ item.title }}</p>
            <!-- <p class="fs13 van-multi-ellipsis--l2" style="color: #959CA7;">{{ item.subhead }}</p> -->
            <p v-if="item.source">
              <span class="tag">{{item.source}}</span>
            </p>
            <!-- <p class="fs12 van-ellipsis" style="color: #959CA7;">{{ item.summary }}</p> -->
            <!-- <div> -->
            <div class="fs12" style="color:#959CA7;display:flex;" v-if="item.pubTimestamp">
              <img
                style="margin-right:4px;width:16px;height:16px;"
                :src="require('@/assets/images/home/index_icon_time@2x.png')"
                alt
              />
              {{formatDate(item.pubTimestamp,'Y-M-D')}}
            </div>
            <!-- </div> -->
          </div>
        </div>
      </div>
      <emply v-else />
    </div>
    <!-- 在营品牌店铺 -->
    <div class="border-bottom-14" v-if="shoplist.length">
      <base-title title="在营品牌店铺" parent_class="mt6" />
      <div class="plr16">
        <img
          :src="require('@/assets/images/home/pstorebanner.png')"
          @click="$router.push({ name: 'StoreList' })"
        />
      </div>
      <div class="plr10 mt12">
        <van-grid :gutter="10" :column-num="3" class="store" :border="false" square>
          <van-grid-item
            v-for="item in shoplist"
            :key="item.id"
            @click="openExternalLink(item.skipUrl)"
            class="text-center"
          >
            <img slot="icon" :src="item.titleImage" width="90%" />
            <div slot="text" class="plr8 w-full hidden">
              <p class="fs11 ellipsis2 text-center mt4">{{ item.title }}</p>
            </div>
          </van-grid-item>
        </van-grid>
      </div>
    </div>
    <!-- 销售荣誉榜 -->
    <div class="border-bottom-14 import" v-if="topSalemanList.length">
      <base-title title="销售荣誉榜" parent_class />
      <div class="swiper-container goldSales-swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide clear-slide"></div>
          <div
            class="swiper-slide swiper-goldSales"
            v-for="item in topSalemanList"
            :key="item.id"
            ref="swiperGoldSales"
            @click="$router.push({ name: 'GoldSales', query: {id: item.id}})"
          >
            <img :src="item.titleImage" />
            <!-- <img :src="require(`@/assets/images/home/0${index+1}.jpg`)" /> -->
            <p>{{item.title}}</p>
            <p class="van-ellipsis">{{item.subhead}}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 销售秘籍 -->
    <!-- <div>
      <area-title title="销售秘籍" />
      <div class="mlr18" style="box-shadow:0px 2px 11px 0px rgba(159,190,240,0.16);">
        <van-grid :border="false" :column-num="3">
          <van-grid-item to="/provisionsTemplate">
            <img :src="require('@/assets/images/home/sale-secret/template.png')" width="60" />
            <p class="fs13 mt6">条款模板</p>
          </van-grid-item>
          <van-grid-item to="/salesExample">
            <img :src="require('@/assets/images/home/sale-secret/course.png')" width="60" />
            <p class="fs13 mt6">案例课程</p>
          </van-grid-item>
          <van-grid-item to="/saleTools">
            <img :src="require('@/assets/images/home/sale-secret/tools.png')" width="60" />
            <p class="fs13 mt6">销售工具</p>
          </van-grid-item>
        </van-grid>
      </div>
    </div>-->
    <!-- 销售成长专区 -->
    <div>
      <base-title title="销售成长专区" parent_class="mt6" />
      <div class="plr16">
        <div class="row space-between" style="margin-bottom: 2%;">
          <!-- 集团介绍 -->
          <div style="width:49%;" @click="$router.push({ name: 'group' })">
            <img class="w-full" :src="require('@/assets/images/home/sales/home_img_zs@2x.png')" />
          </div>
          <div class="col space-between" style="width:49%;">
            <!-- 一件代发 -->
            <div @click="$router.push({ name: 'OneGeneration', query: { id: onePkgModel.id} })">
              <img class="w-full" :src="require('@/assets/images/home/sales/home_img_deli@2x.png')" />
            </div>
            <!-- 条款模版 -->
            <div @click="$router.push(`/provisionsTemplate`)">
              <img class="w-full" :src="require('@/assets/images/home/sales/home_icon_tac@2x.png')" />
            </div>
          </div>
        </div>
        <div class="row space-between">
          <!-- 销售工具 -->
          <div class="mb10" style="width:49%;" @click="$router.push(`/saleTools`)">
            <img class="w-full" :src="require('@/assets/images/home/sales/home_icon_cs@2x.png')" />
          </div>
          <!-- 行业咨讯 -->
          <div class="mb10" style="width:49%;" @click="$router.push(`/customerInfoList`)">
            <img class="w-full" :src="require('@/assets/images/home/sales/home_img_info@2x.png')" />
          </div>
        </div>
      </div>
    </div>
    <!-- 版本弹窗 -->
    <div class="dialog-box">
      <van-dialog
        v-model="isShowDialog"
        :showConfirmButton="false"
        width="19em"
        class="fz-dialog"
        theme="round-button"
      >
        <img :src="require('@/assets/images/version.png')" class="w-full" />
        <div class="guide-wapper plr20 pb20 pt16">
          <div class="ellipsis title mb12">版本更新（{{versionName}}）</div>
          <div class="fs14 content">{{versionContent}}</div>
          <van-button
            class="mt22 fw600 h34"
            color="#3D93FF"
            round
            block
            @click="onjumpVersion"
          >{{versionUrl ? '查看详情' : '确定'}}</van-button>
          <!-- <div class="fs12 no-show-text" @click="onNeverShow">不在弹出</div> -->
        </div>
      </van-dialog>
    </div>
  </div>
</template>

<script>
import Swiper from 'swiper'
import { getBusinessUnit } from '@/api/index'
import { selectPage as cmsSelectPage } from '@/api/cms'
import { getByMobile, deptById } from '@/api/user'
import { getLatestVersion, putLatestVersion } from '@/api/version'
import { isEmpty, showRecentTime, formatDate } from '@/utils'
import { savePosition } from '@/mixins'
import { cmsCategoryId } from '@/config'
import AreaTitle from '@/components/AreaTitle'
import BaseTitle from '@/components/BaseTitle'
import SaleTarget from '@/components/sale-target'
import { getMyBusiness } from '@/api/findCustomer'

export default {
  name: 'Home',
  components: { AreaTitle, BaseTitle, SaleTarget },
  mixins: [new savePosition('home')],
  data() {
    const now = new Date()
    return {
      authType: 'denied',
      saleTargetLink: `/findCustomer?year=${now.getFullYear()}&month=${
        now.getMonth() + 1
      }`,
      businessList: [],
      hasPermission: false, // 是否展业绩目标
      activityBannerList: [], // 轮播图
      marketingActList: [], //重点营销活动
      goldSalesHeight: 0, // 销售高度
      onePkgModel: {}, // 一件代发
      topSalemanList: [], // 销售荣誉排行榜
      shoplist: [],
      tabList: [],
      recommendList: [
        // 主题推荐列表
        {
          title: '跨境客户',
          src: require('@/assets/images/home/theme/img_glo@2x.png'),
          path: '/theme',
          tag: '跨境客户'
        },
        {
          title: '一件代发客户',
          src: require('@/assets/images/home/theme/img_exp@2x.png'),
          path: '/theme',
          tag: '一件代发客户'
        },
        {
          title: '联合公司',
          src: require('@/assets/images/home/theme/img_com@2x.png'),
          path: '/theme',
          tag: '联合公司'
        }
      ],
      newClientList: [
        // 新客户开放列表
        {
          title: '开发中客户',
          src: require('@/assets/images/home/customer_developing.png'),
          path: '/developCustomer?type=1'
        },
        {
          title: '未开发客户',
          src: require('@/assets/images/home/customer_undevelop.png'),
          path: '/developCustomer?type=2'
        }
      ],
      isShowDialog: false,
      versionName: '', //版本标题
      versionContent: '', //版本内容
      versionUrl: '' //版本链接
    }
  },
  created() {
    this.fetchTopSalemanData()
    this.init()
    this.fetchBusinessUnit()
    this.fetchStoreList(), this.getBusiness()
  },
  mounted() {},
  computed: {},
  methods: {
    getBusiness() {
      getMyBusiness().then((res) => {
        this.hasPermission = res.authType !== 'denied'
        this.authType = res.authType
        // this.businessList = businessesList.
        this.businessList = (res.businesses || []).map((v, i) => {
          return {
            text: v.name,
            value: i === 0 && v.id === 0 ? 'all' : v.id
          }
        })
      })
    },
    formatDate,
    openExternalLink(url) {
      // console.log('url', url)
      // window.location.href = url;
      // let tempwindow = window.open(url, '_blank');
      // tempwindow.location=url;
      if (!url) return
      window.open(url, '_blank')
    },
    fetchStoreList() {
      cmsSelectPage({
        pageIndex: 1,
        pageSize: 500,
        infoCategoryId: cmsCategoryId['shop'],
        status: '1',
        orderStr: 'orderLevel desc, pubTimestamp desc, createTimestamp desc'
      }).then((res) => {
        console.log('店铺数据列表', res)
        this.shoplist = res.records.splice(0, 3)
        console.log('店铺', this.shoplist)
      })
    },
    async init() {
      try {
        this.$toast.loading({
          duration: 0,
          message: '加载中...',
          forbidClick: true
        })
        this.fetchLatestVersion()
        await this.fetchActivityBannerData()
        this.fetchCmsInfoList(cmsCategoryId['marketingAct'], 2).then((res) => {
          this.marketingActList = res
          console.log('本周活动', this.marketingActList)
        })
        this.fetchOnePkgData()
      } catch (error) {
        this.$toast.clear()
      }
    },
    //获取版本更新信息
    fetchLatestVersion() {
      getLatestVersion().then((res) => {
        let isVersionState = sessionStorage.getItem('isVersion')
        if (isVersionState || !res) {
          this.isShowDialog = false
          return
        }
        this.isShowDialog = true
        this.versionName = res.name
        this.versionContent = res.updateContent
        this.versionUrl = res.updatePushUrl
      })
    },
    // 根据栏目id获取资讯列表
    fetchBusinessUnit() {
      return new Promise((resolve, reject) => {
        let list = {
          // '线上新零售': require('@/assets/images/home/customer-type/news-sales-up.png'),
          // '线下新零售': require('@/assets/images/home/customer-type/news-sales-down.png'),
          // '新零售': require('@/assets/images/home/customer-type/news-sales.png'),
          // '大客户': require('@/assets/images/home/customer-type/big-customer.png'),
          // '美妆ODM': require('@/assets/images/home/customer-type/odm.png'),
          // '传统电商': require('@/assets/images/home/customer-type/normal.png'),
          // '电商事业部': require('@/assets/images/home/customer-type/normal.png'),
          default: require('@/assets/images/defaultLogo.png')
        }
        getBusinessUnit()
          .then((res) => {
            this.tabList = res
              .filter((v) => v.isShow)
              .map((item) => ({
                ...item,
                title: item.name,
                src: item.icon || list['default'],
                path: '/tabs',
                code: item.columnId
              }))
              .sort((a, b) => b.pos - a.pos)
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    fetchCmsInfoList(cateId, pageSize) {
      return new Promise((resolve, reject) => {
        cmsSelectPage({
          pageIndex: 1,
          pageSize: pageSize,
          infoCategoryId: cateId,
          status: '1',
          orderStr: 'orderLevel desc, pubTimestamp desc, createTimestamp desc'
        })
          .then((res) => {
            resolve(res.records)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    fetchActivityBannerData() {
      return cmsSelectPage({
        pageIndex: 1,
        pageSize: 999999,
        infoCategoryId: cmsCategoryId.banner,
        status: '1',
        isRecommend: true,
        orderStr: 'orderLevel desc, pubTimestamp desc, createTimestamp desc'
      }).then((res) => {
        this.activityBannerList = res.records
        this.$nextTick(() => {
          this.initBannerSwiper()
        })
        this.$toast.clear()
        console.log('轮播图', this.activityBannerList)
      })
    },
    fetchOnePkgData() {
      return cmsSelectPage({
        pageIndex: 1,
        pageSize: 1,
        infoCategoryId: cmsCategoryId.onePkg,
        status: '1',
        isRecommend: true,
        orderStr: 'orderLevel desc, pubTimestamp desc, createTimestamp desc'
      }).then((res) => {
        this.onePkgModel = res.records[0] || {}
        console.log('一件代发', this.onePkgModel)
      })
    },
    fetchTopSalemanData() {
      return cmsSelectPage({
        pageIndex: 1,
        pageSize: 6,
        infoCategoryId: cmsCategoryId.salesman,
        status: '1',
        isRecommend: true,
        orderStr: 'orderLevel desc, pubTimestamp desc, createTimestamp desc'
      }).then((res) => {
        if (res && res.total > 0) {
          this.topSalemanList = res.records
          this.topSalemanList.forEach((item) => {
            if (!isEmpty(item.source)) {
              // 通过
              new Promise((resolve, reject) => {
                getByMobile(item.source).then((res) => {
                  if (res) {
                    item.title = res.name
                    if (res.departIds) resolve(res.departIds[0])
                  }
                })
              }).then((deptId) => {
                if (deptId) {
                  deptById(deptId).then((res) => {
                    item.subhead = res.name
                  })
                }
              })
            }
          })
          setTimeout(() => {
            this.getGoldSales() // 金牌销售
          }, 50)
        }
      })
    },
    // jump(){
    //   window.open(`http://sptest.yanmiya.com:7084/wx/login?agent=goods&jump=/productDetail?spuId=1634`, '_blank')
    // },
    //金牌销售
    getGoldSales() {
      var swiper = new Swiper('.goldSales-swiper-container', {
        slidesPerView: 3,
        spaceBetween: '2.13%'
      })
      this.$nextTick((res) => {
        this.goldSalesHeight = this.$refs.swiperGoldSales[0].clientWidth
      })
    },
    initBannerSwiper() {
      var bannerContainer = new Swiper('.banner-container', {
        slidesPerView: 'auto',
        spaceBetween: '2.13%',
        loop: true,
        grabCursor: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: true
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      })
    },
    onjumpVersion() {
      putLatestVersion({ sys: 'customer' }).then((res) => {
        sessionStorage.setItem('isVersion', true)
        this.onCloseDialog()
        if (this.versionUrl) {
          window.open(this.versionUrl, '_blank')
        }
      })
    },
    onCloseDialog() {
      this.isShowDialog = false
    },
    showRecentTime,
    onSelect(e) {
      console.log(e)
    }
  },
  destroyed() {
    this.$toast.clear()
  }
}
</script>

<style lang="scss" scoped>
#home {
  // height: calc(100vh - 50px);
  height: 100%;
  overflow-x: hidden;
  background: white;
  padding-bottom: 20px;
  /deep/ .van-search__content {
    border-radius: 30px;
  }
}
.dialog-box {
  font-size: 37.5px;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s linear;
}
.slide-enter {
  transform: translateY(80px);
  opacity: 1;
}
.slide-leave-to {
  transform: translateY(-80px);
  opacity: 0;
}
// 活动的banner
.activityBanner {
  img {
    width: 100%;
    height: 100%;
  }
}

.swiper-slide-thumb-active {
  position: relative;
  color: #393c41 !important;
}
.swiper-slide-thumb-active::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0%;
  transform: translate(-50%);
  width: 60%;
  height: 10px;
  border-bottom: 3px solid #3a78ef;
  font-weight: 600;
}

.shadowOne {
  box-shadow: 0px 2px 7px 0px rgba(233, 242, 255, 1);
}
/deep/ .swiper-pagination-bullet-active {
  opacity: 1;
  background: white;
}
.homeImgTitle {
  padding-top: 4px;
  color: #393c41;
}
.Title-More {
  p {
    margin: 1.4rem 0 1.4rem 0;
  }
  width: 90%;
  margin: 0 auto;
  font-size: 18px;
  color: black;
  line-height: 21px;
  text-align: left;
  padding-top: 0.7rem;
  padding-bottom: 0.2rem;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -ms-flex-line-pack: center;
  align-content: center;
  font-weight: 600;
  div {
    color: #959ca7;
    font-weight: 500;
    display: flex;
    align-items: center;
    font-size: 14px;
  }
  i {
    margin-top: 0px;
  }
}
/deep/ .fz-dialog {
  border-radius: 8px;
  // padding: 20px;
  // padding-bottom: 5px;
  background-color: transparent;
  .guide-wapper {
    position: relative;
    text-align: justify;
    transform: translateY(-1px);
    white-space: pre-line;
    background-color: #fff;
    .close-btn {
      position: absolute;
      right: 0px;
      transform: translate(25%, -25%);
    }
    .title {
      font-weight: bold;
      color: #121314;
      line-height: 20px;
      font-size: 16px;
    }
    .content {
      // font-weight: 500;
      color: #666666;
      line-height: 22px;
      font-size: 14px;
    }
  }
  .van-goods-action.van-dialog__footer {
    display: none;
  }
  .no-show-text {
    color: rgba(102, 102, 102, 0.6);
    margin: 8px 0;
    float: right;
  }
}
// 金牌销售
.goldSales-title {
  width: 90%;
  margin: 0 auto;
  font-size: 18px;
  padding-top: 0.7rem;
  padding-bottom: 1.4rem;
  font-weight: 600;
  p {
    margin: 1.4rem 0 1.4rem 0;
  }
}
.swiper-goldSales {
  width: 100%;
  // text-align: center;
  margin-bottom: 5px;
  border-radius: 5px;
  overflow: hidden;
  img {
    width: 100%;
    border-radius: 4px;
  }
  position: relative;
  span {
    position: absolute;
    right: 0;
    top: 0;
    border-radius: 0 5px 0 0;
    background: rgba(57, 60, 65, 0.5);
    color: white;
    width: 18px;
    text-align: center;
    width: 18px;
  }
  p {
    margin: 0;
    padding: 0;
    height: 16px;
    padding-left: 6%;
  }
  p:nth-child(2) {
    font-size: 16px;
    color: #393c41;
    padding-top: 10%;
  }
  p:nth-child(3) {
    font-size: 12px;
    font-weight: 500;
    color: #959ca7;
    padding-top: 8%;
    padding-bottom: 13%;
  }
}
// 金牌销售end
.border-bottom-14 {
  border-bottom: 14px solid #f2f4f9;
  padding-bottom: 24px;
}
.tag {
  color: #ff9a37;
  display: inline-block;
  padding: 4px;
  background: rgba(239, 146, 54, 0.1);
  border-radius: 4px;
  margin: 0px 4px 4px 0;
  font-size: 12px;
  line-height: 1;
}
.clear-slide {
  width: 2% !important;
}
.import {
  background: url('../../assets/images/home/bgJB.png') no-repeat top left !important;
  background-size: 100% auto !important;
  padding-top: 6px;
  padding-bottom: 8px;
}

/deep/ .store .van-grid-item__content--center {
  box-shadow: 0px 0px 11px 0px rgba(40, 109, 153, 0.1);
  border-radius: 10px;
  padding: 0;
}
</style>