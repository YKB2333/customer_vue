<template>
  <div :class="['findCustomerPage hiddenOpacity ',{'showOpacity':isPermission}]">
    <div class="header fixed wpct100">
      <van-notice-bar left-icon="volume-o" text="近期多系统相关联核对基础数据，可能会造成数据加载缓慢或变动，预计两周内处理完毕，请耐心等待。" />
      <!-- tab -->
      <div class="row center-y border-bottom1 wpct100 mauto space-between bg-white">
        <!-- 全权限 -->
        <div class="flex-1 hidden" v-if="tabList.length > 0">
          <van-tabs v-model="tabActive" @click="onClickTable">
            <van-tab v-for="(item,index) in tabList" :title="item.name" :key="index"></van-tab>
          </van-tabs>
        </div>
        <!-- //单一权限 -->
        <!-- <div class="flex-1 hidden" v-if="['coreuser','owner'].includes(authType) && tabList.length>0">
        <div class="fs15 color-dark-grey">业务板块: {{ tabList[0].name }}</div>
        </div>-->
        <div class="right text-center color-gray fs15 triangle" @click="switchTimePopup">
          <span v-show="year_month_active==0">{{ currentDate | formatDate('Y年') }}</span>
          <span v-show="year_month_active==1">{{ currentDate | formatDate('Y年M月') }}</span>
          <span v-show="year_month_active==2">{{ currentDate | formatDate('Y年M月D日') }}</span>
        </div>
      </div>
    </div>
    <div class="mt84 border-bottom14"></div>
    <!-- 业绩目标完成率 -->
    <div v-if="isPermission" class="border-bottom14 relative hidden">
      <!-- <base-title title="业绩目标完成率" isChart unit="统计说明 >" @onUnitClick="onSaleTargetUnitClick" /> -->
      <sale-target
        class="mb24 mt24"
        :business-list="businessList"
        :businessId="query.businessId"
        :year="query.year"
        :month="query.month"
        :day="query.day"
      ></sale-target>
      <sale-target-explanation v-model="isShowDialog"></sale-target-explanation>
    </div>

    <!-- 销售趋势 -->
    <div class="border-bottom14" v-show="!query.day">
      <base-title title="销售趋势" isChart :unit="unit" />
      <div id="salesChart" :style="{ height: '270px'}"></div>
      <div class="row center fs14 mb28">
        <div class="row center wpct20">
          <span class="home_unit_left"></span>
          <span style="color: #959CA7;">{{ year_month_active == '0' ? '本年' : '本月' }}</span>
        </div>
        <div class="row center wpct20">
          <span class="home_unit_right"></span>
          <span style="color: #959CA7;">{{ year_month_active == '0' ? '上年' : '上月' }}</span>
        </div>
      </div>
    </div>

    <!-- 业务部销售占比 -->
    <div class="border-bottom14" v-show="authType == 'all' && currentTabIndex== 'all'">
      <base-title title="业务部销售占比" isChart :unit="unit" />
      <!-- 图表 -->
      <div id="salesDepartmentChart" :style="{ height: '300px'}"></div>
      <div class="wpct92 mauto mtb12" v-if="salesDepartmentList.length">
        <div
          class="row w-full center mb24 salesDepartmentChart"
          v-for="(item,index) in salesDepartmentList"
          :key="index"
          @click="switchTabIndex(item.businessId)"
        >
          <div class="w-h48">
            <img :src="item.logo" alt class="w-full" />
          </div>
          <div class="row w-full flex-1 center ml8">
            <div class="flex-1">
              <div class="row w-full space-between center">
                <span class="color-dark-grey fs15 fw600 mb10">
                  {{ item.name }}
                  <span
                    class="fs12 ml12 fw400"
                    style="color:#959CA7"
                  >{{ item.value }}%</span>
                </span>
                <span
                  class="color-dark-grey fs14 fw600 mb10"
                >{{ item.number | formattedMoneyData(2) }}</span>
              </div>
              <div v-if="item.value">
                <van-progress :percentage="item.value" :color="item.color" />
              </div>
            </div>
            <div class="row center">
              <img :src="require('@/assets/images/find/new_find/link.png')" alt class="w-h16 ml16" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 商品服务类型占比 -->
    <div class="border-bottom14">
      <base-title title="商品服务类型占比" isChart :unit="unit" />
      <div id="goodsServiceChart" :style="{ height: '290px'}"></div>

      <div class="wpct92 mauto mtb12">
        <div
          class="row w-full center mauto h72 border-top-1"
          v-for="(item,index) in goodsService"
          :key="index"
        >
          <div class="w-h36">
            <img :src="item.logo" alt class="w-full" />
          </div>
          <div class="row w-full flex-1 center ml12">
            <div class="flex-1 col">
              <span class="color-dark-grey fs15 fw600 mb4">{{ item.name }}</span>
              <span class="fs12 color-gray">{{ item.value }}%</span>
            </div>
            <div
              class="row center fs14 color-dark-grey fw600"
            >{{ item.number | formattedMoneyData(2) }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 商品大类销售占比 -->
    <div class="border-bottom14">
      <base-title title="商品大类销售占比" isChart :unit="unit" />
      <van-loading
        size="24px"
        class="row center-x w-full ptb60"
        v-if="!salesClassify.length && !lodaingHide"
      >加载中...</van-loading>
      <emply class="ptb26" v-else-if="!salesClassify.length" />
      <div class="wpct92 mauto mtb12 salesClassify" v-if="salesClassify.length">
        <div
          v-for="(item,index) in salesClassify"
          :key="index"
          class="row w-full center mb30"
          @click="linkDetails(item,2)"
        >
          <div class="wpct20 row fs15 color-dark-grey fw500" style="justify-content:flex-start">
            <span class="ellipsis2">{{ item.name }}</span>
          </div>
          <div class="flex-1">
            <van-progress
              :percentage="item.value"
              :color="item.color"
              stroke-width="16"
              class="wpct80"
              v-if="item.value"
            />
          </div>
          <div
            class="wpct20 row center-y fs15 color-dark-grey fw600"
            style="justify-content:flex-end"
          >
            <span class="mr4 fw600">{{ item.number | formattedMoneyData(2) }}</span>
            <van-icon name="arrow" color="#C7CBD3" />
          </div>
        </div>
      </div>
    </div>

    <!-- 商品SKU销售TOP10 -->
    <div class="border-bottom14">
      <base-title
        title="商品SKU销售TOP10"
        isChart
        :unit="MONEY_PERMISSION.includes(authType) ? '单位:万元' : '单位:件数'"
      />
      <van-loading
        size="24px"
        class="row center-x w-full ptb60"
        v-if="!skuRankingList.length && !lodaingHide"
      >加载中...</van-loading>
      <emply class="ptb26" v-else-if="!skuRankingList.length" />
      <sales-ranking-list
        :list="skuRankingList"
        :query="getSearchQuery"
        v-if="skuRankingList.length"
        :permission="MONEY_PERMISSION.includes(authType) "
      />
    </div>

    <!-- 渠道类型销售占比 -->
    <div class="border-bottom14">
      <div @click="linkDetails(salesTopList[0],3)">
        <base-title title="渠道类型销售占比" isValue />
      </div>
      <van-loading
        size="24px"
        class="row center-x w-full ptb60"
        v-if="!salesTopList.length && !lodaingHide"
      >加载中...</van-loading>
      <emply class="ptb26" v-else-if="!salesTopList.length" />

      <div class="row wrap wpct92 mauto space-between pb30">
        <div
          class="parent"
          v-for="(item,index) in salesTopList"
          :key="index"
          @click="linkDetails(item,3)"
        >
          <img :src="item.src" alt />
          <div class="son">
            <p :style="`text-shadow:0px 1px 0px ${item.shadow};`">{{ item.percent }}%</p>
            <p :style="`text-shadow:0px 1px 0px ${item.shadow};`">{{ item.title || '- - -'}}</p>
            <p v-if="MONEY_PERMISSION.includes(authType)">
              ¥
              <template
                v-if="item.money && item.money > 0"
              >{{ `${formattedMoneyData(item.money, 2)}万` }}</template>
              <template v-else>{{ '- - -' }}</template>
            </p>
            <p v-else>{{ item.money }}件</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 客户销售额 -->
    <div class="border-bottom14">
      <van-loading
        size="24px"
        class="row center-x w-full ptb60"
        v-if="!coustomerRankingList.length && !lodaingHide"
      >加载中...</van-loading>
      <emply class="ptb26" v-else-if="!coustomerRankingList.length" />

      <ranking-list
        v-if="coustomerRankingList.length"
        :backgroundUrl="require('@/assets/images/find/new_find/bg_client@2x.png')"
        :list="coustomerRankingList"
        :jump="`/clientSalesList?businessId=${query.id}&time=${formatDate2(resultDate, 'Y/M/D')}&year_month_active=${year_month_active}`"
        @link="linkDetails"
      />
    </div>

    <!-- 选择时间弹 -->
    <van-popup v-model="showTimePopup" position="bottom">
      <van-tabs v-model="current_time_active">
        <van-tab title="年">
          <van-picker
            :columns="yearList"
            ref="yearPicker"
            @change="(vm, year, index)=>{this.resultDate = new Date(year)}"
            :default-index="currentYearDefaultIndex"
            :swipe-duration="300"
          />
        </van-tab>
        <van-tab title="月">
          <van-datetime-picker
            :show-toolbar="false"
            v-model="resultDate"
            type="year-month"
            title="选择年月"
            :visible-item-count="7"
            :swipe-duration="300"
          />
        </van-tab>
        <van-tab title="日">
          <van-datetime-picker
            :show-toolbar="false"
            v-model="resultDate"
            type="date"
            title="选择年月日"
            :visible-item-count="7"
            :swipe-duration="300"
          />
        </van-tab>
        <van-button size="large" type="info" @click="closeTimePopup">确认</van-button>
      </van-tabs>
    </van-popup>
  </div>
</template>

<script>
import commodityList from './components/commodityList'
import rankingList from './components/rankingList'
import salesRankingList from './components/salesRankingList'
import baseTitle from './components/title'
import salesChart from './js/salesChart'
import goodsServiceChart from './js/goodsServiceChart'
import salesDepartmentChart from './js/salesDepartmentChart'
import { deepClone, formattedMoneyData, formatDate2 } from '@/utils'
import { savePosition } from '@/mixins'
import {
  getMyBusiness,
  getConuntSale,
  getBusinessSale,
  getBrandCategory,
  getCountBrandCategory,
  getCountCategory,
  getCountSkuTop,
  getCustomerTop,
  getChannelTop
} from '@/api/findCustomer'
import axios from 'axios'
import SaleTarget from '@/components/sale-target'
import SaleTargetExplanation from '@/components/sale-target/sale-target-explanation.vue'

export default {
  name: 'findCustomer',
  mixins: [new savePosition()],
  components: {
    commodityList,
    rankingList,
    baseTitle,
    salesRankingList,
    SaleTarget,
    SaleTargetExplanation
  },

  props: {},

  data() {
    return {
      PERMISSION: ['all', 'owner', 'coreuser'],
      MONEY_PERMISSION: ['all', 'owner'],
      isPermission: false,
      authType: 'all', // 权限类型
      unit: '单位:万元',
      current_time_active: 0, // 当前年月选择器model
      year_month_active: 0, // 年月选择器model
      tabActive: '', // tab选中的
      tabList: [], // tab选项列表
      salesList: [], // 销售趋势数据
      salesDepartmentList: [], //业务部销售占比 数据
      goodsServiceList: [], // 商品服务累心占比
      skuRankingList: [], //skuTop10销售数据统计
      salesTopList: [], // top4
      currentTabIndex: 'all', // 当前的tab索引
      currentDate: new Date(), // 当前日期
      resultDate: new Date(), // 结果日期
      yearList: [], // 生成年份列表
      showTimePopup: false, // 是否显示时间选择弹窗
      coustomerRankingList: [], /// 客户销售top10
      salesRatio: [
        //渠道类型销售占比
        require('@/assets/images/find/new_find/type_bg_top1@2x.png'),
        require('@/assets/images/find/new_find/type_bg_top2@2x.png'),
        require('@/assets/images/find/new_find/type_bg_top3@2x.png'),
        require('@/assets/images/find/new_find/type_bg_top4@2x.png')
      ],
      shadowlist: [
        'rgba(234,106,64,1)',
        'rgba(115,140,185,1)',
        'rgba(54,116,241,1)',
        'rgba(77,88,228,1)'
      ],
      // 商品服务累占比
      goodsService: [
        {
          label: 'PB',
          logo: require('@/assets/images/find/new_find/zypp.png'),
          value: 0,
          number: 0,
          color: '#48D9BD'
        },
        {
          label: 'NB',
          logo: require('@/assets/images/find/new_find/NB@2x.png'),
          value: 0,
          number: 0,
          color: '#25E186'
        },
        {
          label: 'ODM',
          logo: require('@/assets/images/find/new_find/ODM@2x.png'),
          value: 0,
          number: 0,
          color: '#4ED4EC'
        },
        {
          label: 'JVB',
          logo: require('@/assets/images/find/new_find/jvb@2x.png'),
          value: 0,
          number: 0,
          color: '#4984F6'
        }
      ],
      //
      goodsClassifyRatio: [
        '#48D9C7',
        '#25E186',
        '#CAE355',
        '#FEDF18',
        '#FDB61A',
        '#FF8924'
      ],
      salesClassify: [],
      salesChartsalesChartObject: {}, // 销售趋势图表对象
      salesDepartmentObject: {}, // 业务部销售占比对象
      goodsServiceObject: {}, // 商品服务类型占比对象
      lodaingHide: false,
      query: {
        code: '',
        month: '',
        day: '',
        rankType: '',
        top: '10',
        type: '',
        year: ''
      },
      finished: false,
      currentYearDefaultIndex: 0,
      cancelHttp: null,
      isShowDialog: false,
      businessList: []
    }
  },

  computed: {
    getSearchQuery() {
      let query = {
        tabActive: this.tabActive,
        businessId: this.query.businessId,
        time: String(this.currentDate),
        timeType: this.year_month_active
      }
      // console.info('TM跳转到二级页面', query)
      return query
    }
  },

  watch: {},

  created() {},

  mounted() {
    const now = new Date()
    const year = this.$route.query.year
      ? this.$route.query.year
      : now.getFullYear()
    const month = this.$route.query.month
      ? this.$route.query.month
      : now.getMonth()
    this.currentDate = new Date(year, month)
    this.initEcharts()
    this.init()
    this.getDateYears()
  },

  destroyed() {},
  activated() {
    if (!['all', 'owner'].includes(this.authType)) {
      this.$router.push({ path: '/permission' })
    }
  },
  methods: {
    formatDate2,
    formattedMoneyData,
    // 初始化
    async init() {
      // 初始化时间
      this.initQueryDate()
      // 图表初始化
      this.LoadingEcharts()
      // 获取基础信息、生成id
      await this.initMyBusiness(this.query)
      // 是否有通过路由传参的
      let isRouterQuery =
        this.$route.query.businessId ||
        this.$route.query.year ||
        this.$route.query.month ||
        this.$route.query.day
      if (isRouterQuery && this.finished == false) {
        this.initRouterSearch()
        return
      }
      // 销售趋势
      await this.initConuntSale(this.query)
      // 业务部销售占比
      this.initBusinessSale(this.query)
      // 商品一级分类销售数据统计
      this.initCountCategory(this.query)
      // 获取商品服务类型
      await this.initBrandCategory(this.query)
      //skuTop10销售数据统计
      this.initCountSkuTop(this.query)
      // 渠道Top4销售数据统计
      this.initChannelTop(this.query)
      // 客户Top10销售数据统计
      this.iniCustomerTop(this.query)
      setTimeout(() => {
        this.lodaingHide = true
      }, 7000)
    },
    // 初始化时间
    initQueryDate() {
      // if (this.$route.query.year) {
      //   this.query.year = this.$route.query.year
      // }
      // if (this.$route.query.month) {
      //   this.query.month = this.$route.query.month
      // }
      this.query.year = this.currentDate.getFullYear()

      this.query.month = [1, 2].includes(this.year_month_active)
        ? this.currentDate.getMonth() + 1
        : null

      this.query.day =
        this.year_month_active === 2 ? this.currentDate.getDate() : null
      console.info(this.query, '当前时间Query对象')
    },
    initRouterSearch() {
      // 是否推送跳转
      this.finished = true
      let year = this.$route.query.year || new Date().getFullYear()
      let month = this.$route.query.month
        ? this.$route.query.month - 1
        : new Date().getMonth() + 1
      let day = this.$route.query.day
        ? this.$route.query.day
        : new Date().getDate()
      if (
        this.$route.query.year ||
        this.$route.query.month ||
        this.$route.query.day
      ) {
        this.year_month_active = this.$route.query.day
          ? 2
          : this.$route.query.month
          ? 1
          : 0
        this.currentDate = new Date(year, month, day)
      }
      if (this.$route.query.businessId) {
        this.switchTabIndex(this.$route.query.businessId)
      } else {
        this.init()
      }
    },
    initMyBusiness(data) {
      return new Promise((resolve, reject) => {
        getMyBusiness(
          new axios.CancelToken((c) => {
            this.cancelHttp = c
          })
        ).then((res) => {
          if (this.PERMISSION.includes(res.authType) === false) {
            this.$router.replace({ path: '/permission' })
            return
          }
          this.isPermission = true
          // 如果没有选择过tab
          if (this.currentTabIndex == 'all') {
            data.id = res.businesses[0].id == 0 ? 'all' : res.businesses[0].id
            data.businessId = data.id
            this.currentTabIndex = data.id
          } else {
            data.id = this.currentTabIndex
            data.businessId = data.id
          }
          this.tabList = res.businesses
          this.businessList = (res.businesses || []).map((v, i) => {
            return {
              text: v.name,
              value: i === 0 && v.id === 0 ? 'all' : v.id
            }
          })
          this.authType = res.authType
          this.unit = this.MONEY_PERMISSION.includes(res.authType)
            ? '单位:万元'
            : '单位:件数(万)'
          resolve(res)
        })
      })
    },
    initConuntSale(data) {
      return new Promise((resolve, reject) => {
        getConuntSale(
          {
            businessId: data.id,
            month: data.month,
            year: data.year,
            day: data.day
          },
          new axios.CancelToken((c) => {
            this.cancelHttp = c
          })
        ).then((res) => {
          // console.log(res, ";销售列表");
          res.time = {
            year: this.currentDate.getFullYear(),
            month: this.currentDate.getMonth() + 1,
            day: this.currentDate.getDate()
          } // 传入时间作为判断值 年 || 月
          if (this.MONEY_PERMISSION.includes(this.authType)) {
            res.scope = res.amtScope
            res.lastScope = res.lastAmtScope
            res.ratioScope = res.amtRatioScope
          } else {
            res.scope = res.numScope
            res.lastScope = res.lastNumScope
            res.ratioScope = res.numRatioScope
          }
          this.salesList = res
          this.salesChart()
          this.salesChartObject.hideLoading()
          resolve(res)
        })
      })
    },
    // 业务部销售占比
    initBusinessSale(data) {
      if (data.businessId != 'all') return

      // 根据加载的业务版块统计数据
      getBusinessSale(
        data,
        new axios.CancelToken((c) => {
          this.cancelHttp = c
        })
      ).then((res) => {
        // 饼图统计总额修改为各项数据只和去除多余的其他数据
        let sum = { amt: 0, num: 0 }
        res.forEach((v) => {
          sum.amt += v.amt
          sum.num += v.num
        })
        // 获取后台返回的数据
        let result = res.map((item) => {
          return {
            value: this.getNumberPerctern(item, sum),
            number: this.getNumberType(item, true),
            name: item.businessName,
            businessId: item.businessId,
            color: item.color2,
            logo: item.icon2 || require('@/assets/images/defaultLogo.png')
          }
        })

        // 格式化对象、根据后台数据匹配前台动态图标
        let arrayMapData = result.map((item) => {
          item.value = this.getMathSign(item.value) || 0 // 百分比图表用
          return item
        })
        arrayMapData.sort((a, b) => b.value - a.value)

        //获取(其他)的数量
        // let sumValue =
        //   result.length &&
        //   result
        //     .map((key) => key.value)
        //     .reduce((total, num) => Number(total) + Number(num)) // 图表使用
        // // 计算其他金额
        // let NumberValue = result
        //   .map((key) => key.number)
        //   .reduce((total, num) => Number(total) + Number(num))
        // let SumNumber = this.getNumberToFixed(this.salesList, 2, true)
        // // console.log(this.computeNumberMode(SumNumber,NumberValue));
        // if (this.getMathSign((100 - Number(sumValue)).toFixed())) {
        //   let value = this.getMathSign((100 - Number(sumValue)).toFixed(2))
        //   arrayMapData.push({
        //     businessId: '-1',
        //     name: '其它',
        //     logo: require('@/assets/images/home/customer-type/qt.png'),
        //     number: this.computeNumberMode(SumNumber, NumberValue).toFixed(2),
        //     value: value !== 100 ? value : 0,
        //     color: '#98ACCD'
        //   })
        // }
        this.salesDepartmentList = arrayMapData
        this.salesDepartmentChart()
        this.salesDepartmentObject.hideLoading()
      })
    },
    computeNumberMode(num1, num2) {
      if (!num1 && !num2) return 0
      return num1 - num2
    },
    // 获取商品服务类型
    initBrandCategory(data) {
      return new Promise((resolve, reject) => {
        getBrandCategory(
          new axios.CancelToken((c) => {
            this.cancelHttp = c
          })
        ).then(async (res) => {
          // console.log(res, "getBrandCategory");
          this.goodsService = this.$options.data().goodsService
          // console.log('111111111', this.goodsService.map(e => e.value))
          let arr = []
          arr = deepClone(this.goodsService)
          let goodsData = deepClone(data) // 深拷贝 统一时间数据
          for (const key in res) {
            goodsData.brandCategory = key
            await getCountBrandCategory(
              goodsData,
              new axios.CancelToken((c) => {
                this.cancelHttp = c
              })
            ).then((result) => {
              let resultObjcet = ''
              if (key == 'OEM') {
                resultObjcet = arr.find((item) => item.label == 'ODM')
              } else {
                resultObjcet = arr.find((item) => item.label == key)
              }
              resultObjcet['name'] =
                key !== 'PB' ? res[key] : `${res[key]}\n(众上)`
              resultObjcet['value'] = (
                Number(resultObjcet['value']) +
                Number(this.getNumberPerctern(result, this.salesList))
              ).toFixed(2)
              resultObjcet['number'] =
                Number(resultObjcet['number']) + this.getNumberType(result, 2)
            })
          }
          //获取(其他)的数量
          let sumValue = arr
            .map((key) => key.value)
            .reduce((total, num) => Number(total) + Number(num))
          let NumberValue = arr
            .map((key) => key.number)
            .reduce((total, num) => Number(total) + Number(num))
          let SumNumber = this.getNumberToFixed(this.salesList, 2, true)

          if (this.getMathSign((100 - Number(sumValue)).toFixed())) {
            let value = this.getMathSign((100 - Number(sumValue)).toFixed(2))
            arr.push({
              label: '其它',
              name: '其它',
              logo: require('@/assets/images/home/customer-type/qt1.png'),
              number: this.computeNumberMode(SumNumber, NumberValue).toFixed(2),
              value: value !== 100 ? value : 0,
              color: '#98ACCD'
            })
          }
          this.goodsService = deepClone(arr)

          this.goodsServiceChart()
          this.goodsServiceObject.hideLoading()
          // console.log('222222222', this.goodsService.map(e => e.value))
          resolve()
        })
      })
    },
    ////商品一级分类销售数据统计
    initCountCategory(data) {
      let categoryData = deepClone(data) // 深拷贝 统一时间数据
      categoryData.top = 5
      getCountCategory(
        categoryData,
        new axios.CancelToken((c) => {
          this.cancelHttp = c
        })
      ).then((res) => {
        let arr = res.map((item, index) => {
          // console.log(item);
          return {
            value: this.getNumberPerctern(item, this.salesList),
            number: this.getNumberType(item, 2),
            name: item.cateName,
            cateId: item.cateCode,
            color: this.goodsClassifyRatio[index] || this.randomColor()
          }
        })

        let sumValue =
          arr.length &&
          arr
            .map((key) => key.value)
            .reduce((total, num) => Number(total) + Number(num))

        let NumberValue =
          arr.length &&
          arr
            .map((key) => key.number)
            .reduce((total, num) => Number(total) + Number(num))

        let SumNumber = this.getNumberToFixed(this.salesList, 2, true)
        let SumValue = this.getMathSign(
          100 - Number(sumValue).toFixed(2)
        ).toFixed(2)
        arr.push({
          value: Number(SumValue) !== 100 ? Number(SumValue) : 0,
          number: this.computeNumberMode(SumNumber, NumberValue),
          name: '其它',
          color: '#FF8924'
        })

        this.salesClassify = arr
      })
    },
    // skuTop10销售数据统计
    initCountSkuTop(data) {
      let skuRankingData = deepClone(data) // 深拷贝 统一时间数据
      skuRankingData.top = 10
      // console.log(skuRankingData,'skuRankingDataskuRankingData');
      getCountSkuTop(
        skuRankingData,
        new axios.CancelToken((c) => {
          this.cancelHttp = c
        })
      ).then((res) => {
        let arr = res.map((item) => {
          return {
            title: item.name,
            logo: item.skuTitleImage || item.spuTitleImage || '',
            count: item.num,
            number: this.MONEY_PERMISSION.includes(this.authType)
              ? Number(item.amt.toFixed(2))
              : 0,
            spuId: item.spuId,
            skuSn: item.skuSn,
            firstAtbKey: item.firstAtbKey,
            firstAtbValue: item.firstAtbValue,
            secondAtbKey: item.secondAtbKey,
            secondAtbValue: item.secondAtbValue
          }
        })
        this.skuRankingList = arr
      })
    },
    // 发现客户首页- 渠道Top4销售数据统计
    initChannelTop(data) {
      let ChannelTopList = deepClone(data) // 深拷贝 统一时间数据
      ChannelTopList.top = 4
      getChannelTop(
        ChannelTopList,
        new axios.CancelToken((c) => {
          this.cancelHttp = c
        })
      ).then((res) => {
        let result = []
        result = res.map((item, index) => {
          return {
            title: item.channelType,
            src: this.salesRatio[index],
            percent: this.getNumberPerctern(item, this.salesList, true),
            money: this.MONEY_PERMISSION.includes(this.authType)
              ? item.amt
              : item.num,
            shadow: this.shadowlist[index],
            channelTypeCode: item.channelTypeCode
          }
        })

        if (result.length < 4) {
          let num = 4 - result.length
          for (let i = 0; i < num; i++) {
            result.push({
              title: '- - -',
              src: this.salesRatio[result.length],
              percent: '- - -',
              money: '- - -',
              shadow: this.shadowlist[result.length]
            })
          }
        }
        this.salesTopList = result
      })
    },
    // 发现客户首页- 客户Top10销售数据统计
    iniCustomerTop(data) {
      let customerTopList = deepClone(data) // 深拷贝 统一时间数据
      customerTopList.pageIndex = 1
      customerTopList.pageSize = 10
      getCustomerTop(
        customerTopList,
        new axios.CancelToken((c) => {
          this.cancelHttp = c
        })
      ).then((res) => {
        res = res.records
        let arr = res.map((item) => {
          return {
            id: item.id,
            title: item.name,
            logo: item.logo || '',
            count: item.num,
            number: this.MONEY_PERMISSION.includes(this.authType)
              ? Number(item.amt.toFixed(2))
              : ''
          }
        })
        this.coustomerRankingList = arr
        // console.log(
        //   res,
        //   "客户Top10销售数据统计客户Top10销售数据统计客户Top10销售数据统计"
        // );
      })
    },
    // 获取百分比、判断权限取值
    getNumberPerctern(divisor, dividend, type) {
      if (!divisor || !dividend) return 0
      if (
        this.MONEY_PERMISSION.includes(this.authType) &&
        this.getMathSign(divisor.amt) &&
        this.getMathSign(dividend.amt)
      ) {
        return (
          this.getMathSign(
            Number((divisor.amt / dividend.amt) * 100).toFixed(2)
          ) || 0
        )
      }
      if (
        this.authType == 'coreuser' &&
        this.getMathSign(divisor.num) &&
        this.getMathSign(dividend.num)
      ) {
        return (
          this.getMathSign(
            Number((divisor.num / dividend.num) * 100).toFixed(2)
          ) || 0
        )
      }
      if (this.MONEY_PERMISSION.includes(this.authType) && type) {
        return Number((divisor.amt / dividend.amt) * 100).toFixed(2) || 0
      }
      if (this.authType == 'coreuser' && type) {
        return Number((divisor.num / dividend.num) * 100).toFixed(2) || 0
      }
      return 0
    },
    // 判断数字类型、判断权限取值
    getNumberType(item, type) {
      if (!item) return 0
      if (this.MONEY_PERMISSION.includes(this.authType)) {
        return type ? Number(item.amt) || 0 : this.getMathSign(item.amt)
      }
      if (this.authType == 'coreuser') {
        return type ? Number(item.num) || 0 : this.getMathSign(item.num)
      }
      return 0
    },
    //  初始化图表
    initEcharts() {
      // 销售趋势
      this.salesChartObject = this.$echarts.init(
        document.getElementById('salesChart')
      )
      // 业务部销售占比
      this.salesDepartmentObject = this.$echarts.init(
        document.getElementById('salesDepartmentChart')
      )
      //商品服务大类
      this.goodsServiceObject = this.$echarts.init(
        document.getElementById('goodsServiceChart')
      )
    },
    // 图表加载 格式化
    LoadingEcharts() {
      // this.tabList = [] // tab选项列表
      this.salesList = [] // 销售趋势数据
      this.salesDepartmentList = [] //业务部销售占比 数据
      this.goodsServiceList = [] // 商品服务累心占比
      // this.goodsService = this.goodsService.filter(key=> key.name != '其它')
      // this.goodsService.map(item=>{
      //   item.number = ''
      //   item.value = ''
      // })
      // this.goodsService = this.$options.data().goodsService // reset
      this.skuRankingList = [] //skuTop10销售数据统计
      this.salesTopList = [] // top4
      this.salesClassify = []
      this.coustomerRankingList = []
      this.lodaingHide = false
      this.salesChartObject.showLoading({
        text: '加载中...',
        color: '#2a86f7'
      })
      if (this.authType == 'all')
        this.salesDepartmentObject.showLoading({
          text: '加载中...',
          color: '#2a86f7'
        })
      this.goodsServiceObject.showLoading({
        text: '加载中...',
        color: '#2a86f7'
      })
    },
    getNumberToFixed(count, num, type) {
      let nums = num || 2
      return Number(this.getNumberType(count, type).toFixed(nums))
    },

    //判断正负数
    getMathSign(num) {
      if (Math.sign(num) == '+1') {
        return Number(num)
      } else {
        return 0
      }
    },
    getCurrentDateMonth(value) {
      // console.info('确认按钮', value)
      this.currentDate = value
    },
    switchTimePopup() {
      // 进入时、初始化时间
      this.resultDate = this.currentDate
      this.current_time_active = this.year_month_active
      let year = String(this.currentDate.getFullYear())
      this.currentYearDefaultIndex = this.yearList.indexOf(year)
      if (this.$refs.hasOwnProperty('yearPicker')) {
        this.$refs.yearPicker.setIndexes([this.currentYearDefaultIndex])
      }
      this.showTimePopup = !this.showTimePopup
    },
    // 关闭选择时间弹窗
    closeTimePopup() {
      this.year_month_active = this.current_time_active
      this.currentDate = this.resultDate
      this.showTimePopup = false
      this.init()
    },
    // 随机颜色
    randomColor() {
      let r = Math.floor(Math.random() * 255)
      let g = Math.floor(Math.random() * 255)
      let b = Math.floor(Math.random() * 255)
      return `rgba(${r},${g},${b},0.8)`
    },
    randomHexColor() {
      //随机生成十六进制颜色
      var hex = Math.floor(Math.random() * 16777216).toString(16) //生成ffffff以内16进制数
      while (hex.length < 6) {
        //while循环判断hex位数，少于6位前面加0凑够6位
        hex = '0' + hex
      }
      return '#' + hex //返回‘#'开头16进制颜色
    },
    switchTabIndex(id) {
      let index = this.tabList.findIndex((item) => item.id == id)
      if (index) {
        this.tabActive = index
        document.getElementById('app').scrollTop = 0
        this.onClickTable(index)
      }
    },
    //初始化年的数值
    getDateYears() {
      let year = new Date().getFullYear() - 10
      for (var a = 1; a <= 20; a++) {
        this.yearList.push(`${year}`)
        year++
      }
    },
    // 点击切换tab
    onClickTable(index, title) {
      console.log('切换tab')
      this.cancelHttp()
      this.currentTabIndex =
        this.tabList[index].id == 0 ? 'all' : this.tabList[index].id
      this.init()
    },
    linkDetails(item, type) {
      console.log(item, type)
      if (type == 1) {
        if (!item.id) return
        this.$router.push({
          path: '/customer/sales/data',
          query: {
            businessId: this.currentTabIndex,
            type: type,
            code: item.id,
            name: item.title,
            time: String(this.currentDate),
            timeType: this.year_month_active
          }
        })
      }
      if (type == 2) {
        if (!item.cateId) return
        this.$router.push({
          path: '/customer/sales/data',
          query: {
            businessId: this.currentTabIndex,
            type: type,
            code: item.cateId,
            name: item.name,
            time: String(this.currentDate),
            timeType: this.year_month_active
          }
        })
      }
      if (type == 3) {
        if (!item.channelTypeCode) return
        this.$router.push({
          path: '/customer/sales/data',
          query: {
            businessId: this.currentTabIndex,
            type: type,
            code: item.channelTypeCode,
            name: item.title,
            time: String(this.currentDate),
            timeType: this.year_month_active
          }
        })
      }
    },
    salesChart, // 销售趋势
    goodsServiceChart, // 商品服务类型占比
    salesDepartmentChart, //
    onSaleTargetUnitClick() {
      this.isShowDialog = true
      // console.log('onSaleTargetUnitClick')
    }
  }
}
</script>

<style lang="scss" scoped>
.parent {
  width: 48.8%;
  margin-bottom: 2.2%;
  position: relative;
  .son {
    position: absolute;
    left: 6%;
    top: 50%;
    transform: translate(0, -50%);
    color: white;
    & :nth-child(1) {
      font-weight: 600;
      font-size: 18px;
      margin-bottom: 6px;
    }
    & :nth-child(2) {
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 8px;
    }
    & :nth-child(3) {
      font-size: 12px;
    }
  }
}
.color-gray {
  color: #959ca7;
}
.color-dark-grey {
  color: #393c41;
}
.findCustomerPage {
  .header {
    background: white;
    // padding: 0 8px;
    z-index: 1000;
    left: 50%;
    top: 0;
    max-width: 600px;
    transform: translate(-50%, 0);
    .right {
      height: 44px;
      line-height: 44px;
      padding-left: 10px;
      position: relative;
      min-width: 36%;
      padding-right: 5%;
      // box-shadow:-23px 0 10px 0px  #d8d6d6;
      &::after {
        content: '';
        position: absolute;
        left: 6%;
        height: 50%;
        width: 1px;
        top: 50%;
        transform: translate(0, -50%);
        background: #f6f8fb;
      }
    }
  }
  .header /deep/.van-tab {
    flex: none !important;
    margin-right: 4%;
  }
  .header /deep/ .van-tab--active {
    font-weight: 600;
  }
}
.border-top14 {
  border-top: 14px solid #f2f4f9;
}
.border-bottom14 {
  border-bottom: 14px solid #f2f4f9;
}
.border-bottom1 {
  border-bottom: 1px solid #f2f4f9;
}
.salesClassify {
  /deep/ .van-progress {
    border-radius: 0 !important;
    background: transparent !important;
  }
  /deep/ .van-progress__pivot {
    line-height: initial;
    background: transparent !important;
    color: #959ca7;
  }
  /deep/ .van-progress__pivot {
    left: 100% !important;
    position: absolute;
    transform: translate(5%, -50%);
  }
}

.triangle {
  position: relative;
}
.triangle::before {
  content: '';
  position: absolute;
  right: 4%;
  width: 0;
  height: 0;
  top: 55%;
  transform: translate(0, -50%);
  border-top: 4px solid #959ca7;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid transparent;
}
.home_unit_left {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  margin-right: 7px;
  background: rgba(255, 255, 255, 1);
  border: 3px solid rgba(58, 120, 239, 1);
}
.home_unit_right {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  margin-right: 7px;
  background: rgba(255, 255, 255, 1);
  border: 3px solid rgba(13, 226, 240, 1);
}
.border-top-1 {
  border-top: 1px solid rgba(242, 244, 249, 1);
}
.FindLogding {
  height: 100%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  z-index: 9999999;
  background: rgba(243, 241, 241, 0.52);
  color: white;
  display: flexd;
  justify-content: center;
  align-items: center;
  /deep/ .van-loading__text {
    color: black;
  }
  /deep/ .van-loading__circular {
    color: #3483f4;
  }
}
.salesDepartmentChart {
  /deep/ .van-progress__pivot {
    display: none;
  }
  /deep/ .van-progress {
    position: relative;
    height: 4px;
    background: #f2f4f9;
    border-radius: 4px;
  }
}
.showOpacity {
  opacity: 1 !important;
}
.hiddenOpacity {
  opacity: 0;
}
@media screen and(min-width: 375px) and(max-height: 812px) {
}

/deep/ .van-tab--active .van-tab__text {
  color: black;
}
/deep/ .van-tab__text {
  color: #959ca7;
}
/deep/ .van-tabs__line {
  background: #3a78ef;
}
/deep/ [class*='van-hairline']::after {
  border: 0;
}
/deep/ .van-picker-column__item--selected {
  background: rgba(187, 181, 181, 0.123);
  color: #3a78ef;
}
/deep/ .van-tabs__line {
  width: 20px !important;
}

// 长屏安卓
@media screen and(device-width: 375px) and(device-height: 812px) {
  /deep/ .van-button--large {
    width: 100%;
    height: calc(50px + 1.7vh) !important;
    padding-bottom: 1.7vh;
    line-height: 48px;
  }
}
//x,xs
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  /deep/ .van-button--large {
    width: 100%;
    height: calc(50px + 1.7vh) !important;
    padding-bottom: 1.7vh;
    line-height: 48px;
  }
}
// xr
@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) {
  /deep/ .van-button--large {
    width: 100%;
    height: calc(50px + 1.7vh) !important;
    padding-bottom: 1.7vh;
    line-height: 48px;
  }
}
// xs max
@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {
  /deep/ .van-button--large {
    width: 100%;
    height: calc(50px + 1.7vh) !important;
    padding-bottom: 1.7vh;
    line-height: 48px;
  }
}
</style>
