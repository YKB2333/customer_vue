<template>
  <div class="findCustomerPage">
    <!-- tab -->
    <div class="row center-y header border-bottom1 wpct100 mauto space-between fixed bg-white">
      <div class="right-not-after flex-1 text-center color-gray fs15 triangle" @click="showCustomerPopup = !canNotChangeCondition" v-if="!canNotChangeCondition && this.CustomerTypeList.length > 1">
        <span>{{ currentCustomerType }}</span>
      </div>
      <div :class="['right flex-1 text-center color-gray fs15 triangle plr10 ellipsis', {'disabled': canNotChangeCondition}]" @click="showCompanyPopup = !canNotChangeCondition">
        <span class="ellipsis">{{ currentCustomerList }}</span>
      </div>
      <div class="right flex-1 text-center color-gray fs15 triangle" 
        @click="switchTimePopup"
      >
        <span v-show="year_month_active==0">{{ currentDate | formatDate('Y年') }}</span>
        <span v-show="year_month_active==1">{{ currentDate | formatDate('Y年M月') }}</span>
        <span v-show="year_month_active==2">{{ currentDate | formatDate('Y年M月D日') }}</span>
      </div>
    </div>

    <!-- 公司 -->
    <div class="border-bottom14 border-top14 mt44 hidden relative">
      <van-loading size="24px"  class="row center-x w-full  FindLogding" v-if="salesList == ''">加载中...</van-loading>
      <commodity-list
        :permission="['all','owner'].includes(authType)"
        :exprotMoney="salesList.amt"
        :countMoney="salesList.num"
        :moneyRatio="salesList.amtRatio"
        :countRatio="salesList.numRatio"
        :yearMonthActive="year_month_active"
      />
    </div>

    <!-- 销售趋势 -->
    <div class="border-bottom14"  v-show="!query.day">
      <base-title title="销售趋势" isChart :unit="unit" />
      <div id="sales-chart" :style="{ height: '270px'}"></div>
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
    <!--  tab列表 -->
    <van-tabs v-model="tabActive" @click="onClickTable" >
      <van-tab v-for="(item,index) in classifyTabList" :title="item.title" :key="index" style="min-height:500px" class="relative">
        <van-loading
          size="24px"
          class="row center-x w-full ptb60"
          v-if="rankList && !rankList.length && !lodaingHide"
        >加载中...</van-loading>
        <emply class="ptb26 pos-center" v-else-if="!rankList || !rankList.length"  />
        <!-- 列表 -->
        <sales-details-list 
          :rankList="rankList" 
          :permission="MONEY_PERMISSION.includes(authType) "
          :query="getSearchQuery"
          :yearMonthActive="year_month_active"
        />
        <div v-if="classifyTabList[index]['id'] == '1' && rankList && rankList.length>9" class="text-center mb24" @click="()=>{$router.push({path:`/customer/sales/skuSalesData?businessId=${query.businessId}&code=${query.code}&time=${formatDate2(resultDate, 'Y/M/D')}&year_month_active=${year_month_active}&type=${query.type}`})}">
          <span class="fs14 mr8">查看更多</span>
          <img :src="require('@/assets/images/find/kf_icon_go@2x.png')" width="14">
        </div>
      </van-tab>
    </van-tabs>

    <!--  大类 -->
    <van-popup v-model="showCustomerPopup" position="bottom" @click-overlay="overlayChangeClassify">
      <van-picker
        :title="currentCustomerType"
        :columns="CustomerTypeList"
        @change="onCustomerChange"
        :default-index="CustomerTypeList.indexOf(currentCustomerType)"
      />
    	<van-button size="large" type="info" @click="overlayChangeClassify">确认</van-button>
    </van-popup>

    <!-- 二类 -->
    <van-popup
      v-model="showCompanyPopup"
      position="bottom"
      @click-overlay="overlayChangeClassifyCompany"
    >
      <div class="col h-full">
        <van-search
          v-model="searchValue"
          placeholder="请输入搜索关键词"
          clearable
          @input="onSearch"
          @cancel="recoverList"
          @clear="recoverList"
        />
        <van-picker
          :title="currentCustomerList"
          :columns="CompanyTypeListParent"
		      :default-index="CompanyTypeListParent.indexOf(currentCustomerList)"
          @change="onCompanyChange"
          :visible-item-count="7"
          class="flex-1 hidden"
        />
		<van-button size="large" type="info" @click="overlayChangeClassifyCompany ">确认</van-button>
      </div>
    </van-popup>

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
import commodityList from "./components/commodityList";
import rankingList from "./components/rankingList";
import salesRankingList from "./components/salesRankingList";
import baseTitle from "./components/title";
import salesDetailsList from "./components/salesDetailsList";
import salesChart from "./js/salesChart";
import {
  getMyBusiness,
  getConuntSale,
  getConditionList,
  getCountRank
} from "@/api/findCustomer";
import { deepClone, formatDate2 } from "@/utils";
import { savePosition } from "@/mixins";

export default {
  name: "customerSalesData",

  mixins: [new savePosition()],

  components: {
    commodityList,
    rankingList,
    baseTitle,
    salesRankingList,
    salesDetailsList
  },

  props: {},

  data() {
    return {
      PERMISSION: ["all", "owner", "coreuser"],
      MONEY_PERMISSION: ['all','owner'],
      authType: "all", // 权限类型
      customerId: "", // 客户id
      permission: false, // 是否有权限
      unit: "单位:万元",
      current_time_active: "0", // 当前年月选择器model
      year_month_active: "0", // 年月选择器model
      tabActive: 0, // tab选中的
      tabList: [],
      salesList: [],
      lodaingHide: false,
      classifyTabList: [],
      currentDate: new Date(), // 当前日期
      showTimePopup: false, // 是否显示时间选择弹窗
      showCustomerPopup: false, // 客户分类选择开关
      showCompanyPopup: false, // 公司选择开关
      yearList: [], // 生成年份列表
      currentYearDate: "", // 当前年份时间
      CustomerTypeList: [], //第一个类型
      CompanyTypeList: [], // 第二个类型
      CompanyTypeListParent: [], //第二个类型复制类型
      currentCustomerType: "",
      currentCustomerList: "请选择",
      searchValue: "",
      rankList: [], //数据列表
      isListData: true,
      defaultLogo: require("@/assets/images/defaultLogo.png"),
      classifyCdoe: "", // 第二个分裂的code
      businessList: [],
      isSelectClassify: true, // 是否选择了分类
      currentTabIndex:'all', // 当前的tab索引
      businessId:'',
      query:{
        code: "",
        month: "",
        rankType:"" ,
        top: "10",
        type: "",
        year: "",
        day:"",
        pageIndex:1,
        pageSize:10
      },
      resultDate:new Date(), // 结果日期
      currentYearDefaultIndex:0,
      canNotChangeCondition: false, // 不允许变更查询条件
    };
  },

  computed: {
    getSearchQuery(){
      let findCode = this.CompanyTypeList.find(item => item.label == this.currentCustomerList) || 0
      let query = {
        type:this.$route.query.type,
        tabIndex:this.tabActive,
        time:String(this.currentDate),
        timeType:this.year_month_active
      }
      // 3 = 渠道类型、如果是从渠道类型进入携带qdCode
      if(this.$route.query.type == 3){
        query.qdCode = findCode.code || ''
      }
      return query
    }
  },

  watch: {
  },

  created() {
    this.canNotChangeCondition = this.$route.query.from === 'customerDetail'
    if(this.$route.query.time){
      this.currentDate = new Date(this.$route.query.time)
      this.resultDate = this.currentDate
      this.year_month_active = Number(this.$route.query.timeType)
      console.log(this.year_month_active, 'year_month_active');
      console.log(this.currentDate, 'currentDate');
    }
  },

  mounted() {
    this.initEcharts();
    this.getDateYears();
    this.init();
  },

  destroyed() {},

  methods: {
    formatDate2,
    async init() {
      this.initQueryDate()
      // 初始化加载 
      this.LoadingEcharts();
      // 初始化tab
      this.initTableType();
      // 获取分类1基础信息
      await this.initGetMyBusiness(this.query)
      // 获取分类2 业务版块筛选条件
      await this.initGetConditionList(this.query)
      // 如果分类2 没有数据、后面不加载数据
      if (this.isListData == false) return;
      // 销售趋势
      await this.initGetConuntSale(this.query)
  
      // 获取每一个列表的排行
      this.initGetCountRank(this.query)
      setTimeout(()=>{
        this.lodaingHide = true
      },7000)
    },
   // 初始化时间
  initQueryDate(){
    this.query.year = this.currentDate.getFullYear()
    this.query.month = [1, 2].includes(this.year_month_active) ? this.currentDate.getMonth() + 1 : null
    this.query.day = this.year_month_active === 2 ? this.currentDate.getDate() : null
    console.info(this.query,'当前时间Query对象')
  },
  initTableType(){
    let tempclassifyTabList = [
      { id: "2", title: "大类" },
      { id: "3", title: "中类" },
      { id: "1", title: "SKU" },
      { id: "4", title: "品牌" },
      { id: "5", title: "客户" }
    ]
    console.log(this.$route.query.type);
    if(this.$route.query.type == 2){//商品分类
      tempclassifyTabList.shift();
    }else if(this.$route.query.type == 1){//客户渠道
      tempclassifyTabList.pop();
    }
    this.classifyTabList = tempclassifyTabList
    console.log();

  },
	initGetMyBusiness(data){
		return new Promise((resolve, reject) => {
      getMyBusiness().then(res => {
				this.businessList = res.businesses;
				//   如果没有权限
        if (this.PERMISSION.includes(res.authType) === false) {
					this.$router.push({ path: "/permission" });
				}
				// 如果是进入第一次 初始化id code
				data.type = this.$route.query.type;
				if (this.currentCustomerType.length == 0) {
					data.businessId = this.$route.query.businessId ;
					let id = this.$route.query.businessId == 'all' ? 0 :this.$route.query.businessId 
					let current = res.businesses.find(
						key => key.id == id
          );
          data.id = this.$route.query.businessId
					data.code =  this.$route.query.code || current.bmCode ;
					this.currentCustomerType = current && current.name || "请选择";
					this.currentCustomerList = this.$route.query.company || "请选择";
        }
				this.authType = res.authType;
				this.CustomerTypeList = res.businesses.map(key => key.name);
				this.unit = this.MONEY_PERMISSION.includes(res.authType)  ? "单位:万元" : "单位:件数(万)";
        resolve(res);
			});
		})
	},
	//  获列表
    initGetConditionList(data) {
		return new Promise((resolve, reject) => {
			getConditionList(data).then(res => {
				if (res.list.length) {
					data.code = this.query.code || this.$route.query.code || res.list[0].code;
					this.isListData = true;
					this.CompanyTypeList = res.list;
					this.CompanyTypeListParent = this.CompanyTypeList.map(key => key.label);
					// 如果没有选择、或者没有传入公司  默认选择列表第一个
					if (this.isSelectClassify && !this.$route.query.name){
						this.currentCustomerList = this.CompanyTypeListParent[0] || '暂无数据';
					} else {
						this.currentCustomerList = this.CompanyTypeList.find(key => key.code == data.code) &&  this.CompanyTypeList.find(key => key.code == data.code).label  ||  this.CompanyTypeListParent[0];
					}

				} else {
					// 是否选了二类,  没有选择=true
					this.isSelectClassify = true;
					this.lodaingHide = true;
					this.salesChartObject.hideLoading();
					return false;
				}
				resolve(res);
			});
		})
	},
	initGetConuntSale(data) {
		return new Promise((resolve, reject) => {
			getConuntSale(data).then(res => {
				res.time = {
					year: this.currentDate.getFullYear(),
					month: this.currentDate.getMonth() + 1
				}; // 传入时间作为判断值 年 || 月
         if (this.MONEY_PERMISSION.includes(this.authType) ) {
          res.scope = res.amtScope;
          res.lastScope = res.lastAmtScope;
          res.ratioScope = res.amtRatioScope;
        } else {
          res.scope = res.numScope;
          res.lastScope = res.lastNumScope;
          res.ratioScope = res.numRatioScope;
        }
				this.salesList = res;
				this.salesChart();
				this.salesChartObject.hideLoading();
				resolve(res);
			});
		})
	},
	// 获取每一个列表的排行
  initGetCountRank(data) {
      let rankData = deepClone(data);
      rankData.rankType =this.classifyTabList[this.tabActive].id;
      getCountRank(rankData).then(res => {
        this.rankList = res.records;
        this.lodaingHide = true;
      });
	},
    // 清除列表
    recoverList() {
      this.CompanyTypeListParent = this.CompanyTypeList.map(key => key.label);
    },
    onSearch(val) {
      this.CompanyTypeListParent = this.CompanyTypeList.map(
        key => key.label
      ).filter(item => item.indexOf(this.searchValue) !== -1);
      this.currentCustomerList =  this.CompanyTypeListParent[0]
    },
    // 图表加载 格式化
    LoadingEcharts() {
		this.tabList = [] // tab选项列表
    this.salesList = [] // 销售趋势数据
    this.rankList = [] 
		this.lodaingHide = false
		this.isSelectClassify = true;
		this.salesChartObject.showLoading({
			text: "加载中...",
			color: "#2a86f7"
		});
    },
    //  初始化图表
    initEcharts() {
      // 销售趋势
      this.salesChartObject = this.$echarts.init(
        document.getElementById("sales-chart")
      );
    },
    //初始化年的数值
    getDateYears() {
      let year = new Date().getFullYear() - 10;
      for (var a = 1; a <= 20; a++) {
        this.yearList.push(`${year}`);
        year++;
      }
    },
    // 监听选择年
    onChangeYear(vm, year, index) {
      this.currentYearDate = new Date(year);
    },
	// 监听大类
	onCustomerChange(picker, value, index) {
      this.currentCustomerType = value;
  },
	 //离开选择第一个大类触发
  overlayChangeClassify() {
    this.query.businessId = this.businessList.find(item => item.name == this.currentCustomerType).id || this.$route.query.businessId 
    if(this.query.businessId == 0) this.query.businessId = 'all'
		this.showCustomerPopup = false;
		this.init()
	},
	// 离开选择第二个大类触发
	overlayChangeClassifyCompany(){
		this.query.code = this.CompanyTypeList.find(item => item.label == this.currentCustomerList).code
		this.showCompanyPopup = false;
		this.init()
	},
    salesChart, // 销售趋势
    // 选择公司类型
    onCompanyChange(picker, value, index) {
      this.currentCustomerList = value;
      this.isSelectClassify = false;
    },
    onCompanyTypeCancel() {
      this.showCompanyPopup = false;
    },
    getNumberToFixed(count, num) {
      let nums = num || 2;
      return Number((this.getNumberType(count)).toFixed(nums));
    },
    //判断正负数
    getMathSign(num) {
      if (Math.sign(num) == "+1") {
        return Number(num);
      } else {
        return 0;
      }
    },
    
    // 关闭选择时间弹窗
    closeTimePopup() {
      this.year_month_active = this.current_time_active
      this.currentDate = this.resultDate
      this.showTimePopup = false;
      this.init();
    },
    // 金钱格式化
    getMoney(arr) {
      switch (parseInt(Math.max(...arr)).toString().length) {
        case 5:
          return "万";
          break;
        case 6:
          return "十万";
          break;
        case 7:
          return "百万";
          break;
        case 8:
          return "千万";
          break;
        case 9:
          return "亿";
          break;
      }
	},
	// 点击切换tab
  onClickTable(index, title){
    console.info("当前切换到tab", index, this.classifyTabList[index])
    this.rankList = []
    this.lodaingHide = false
    this.initGetCountRank(this.query)
  },
  switchTimePopup(){
    // 进入时、初始化时间 
    this.resultDate = this.currentDate
    this.current_time_active = this.year_month_active
    let year = String(this.currentDate.getFullYear())
    this.currentYearDefaultIndex = this.yearList.indexOf( year )  
    if(this.$refs.hasOwnProperty('yearPicker')){
      this.$refs.yearPicker.setIndexes([this.currentYearDefaultIndex])
    }
    this.showTimePopup = !this.showTimePopup
  },
  }
};
</script>

<style lang="scss" scoped>
.color-gray {
  color: #959ca7;
}
.color-dark-grey {
  color: #393c41;
}
.border-top14 {
  border-top: 14px solid #f2f4f9;
}
.findCustomerPage {
  height: 100vh;
  overflow-y: auto;
  .header {
    background: white;
	padding: 0 4%;
    z-index: 9999;
    left: 0;
    top: 0;
	.right-not-after {
      height: 44px;
      line-height: 44px;
      width: 40%;
      position: relative;
	}
    .right {
      span{
        width: 100%;
      }
      height: 44px;
      line-height: 44px;
      min-width: 40%;
      position: relative;
      &::after {
        content: "";
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
}
.border-bottom14 {
  border-bottom: 14px solid #f2f4f9;
}
.FindLogding{
  height: 100%;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  position: absolute;
  z-index: 9999999;
  background: rgba(243, 241, 241, 0.52);
  color: white;
  display: flexd;
  justify-content: center;
  align-items: center;
  /deep/ .van-loading__text{
    color:black;
  }
  /deep/ .van-loading__circular{
    color: #3483f4;
  }
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
    margin-left: 18%;
  }
}
.disabled {
  pointer-events: none;
}
.disabled::before {
  content: "";
  display: none !important;
}
.triangle {
  position: relative;
  span{
	width: 70%;
	display: inline-block;
  }
}
.triangle::before {
  content: "";
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
.rise {
  color: #ff3750;
}
.fall {
  color: #00c873;
}

.border-bottom1 {
  border-bottom: 1px solid #f2f4f9;
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
/deep/ [class*="van-hairline"]::after {
  border: 0;
}
/deep/ .van-picker-column__item--selected {
  background: rgba(187, 181, 181, 0.123);
  color: #3a78ef;
}
/deep/ .van-tab {
	font-size: 15px;
}
/deep/ .van-tab--active{
	font-weight: 600;
}
/deep/  .van-tabs__wrap {
    height: 44px;
    border-bottom: 1px solid #F5F6F9;
}
/deep/  .van-tabs__line{
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
