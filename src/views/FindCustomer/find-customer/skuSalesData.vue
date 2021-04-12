<template>
  <section class="page">
    <div class="searchTop">
      <van-search
        :left-icon="require('@/assets/images/icon_search@2x.png')"
        placeholder="请输入商品名称"
        v-model="value"
        @input="onSearch()"
        :autofocus="autofocus"
      />
      <div class="filters">
        <div 
          class="filterRight flex-1 text-center fs15 triangle" 
          :class="[showTimePopup?'active':'']"
          @click="switchTimePopup"
        >
          <span v-show="year_month_active==0">{{ currentDate | formatDate('Y年') }}</span>
          <span v-show="year_month_active==1">{{ currentDate | formatDate('Y年M月') }}</span>
          <span v-show="year_month_active==2">{{ currentDate | formatDate('Y年M月D日') }}</span>
        </div>
        <van-tabs v-model="active" class="filterLeft" @click="onTabClick" :border="false" line-height="0">
          <van-tab title="出货量" name="numOrder">
            <span slot="title">
                出货量
              <img v-if="numOrder === 0" :src="require('@/assets/images/home/theme/order.png')" width="10">
              <img v-if="numOrder === 1" :src="require('@/assets/images/home/theme/order-asc.png')" width="10">
              <img v-if="numOrder === 2" :src="require('@/assets/images/home/theme/order-desc.png')" width="10">
            </span>
          </van-tab>
          <van-tab title="出货额" name="amtOrder">
            <span slot="title">
                出货额
              <img v-if="amtOrder === 0" :src="require('@/assets/images/home/theme/order.png')" width="10">
              <img v-if="amtOrder === 1" :src="require('@/assets/images/home/theme/order-asc.png')" width="10">
              <img v-if="amtOrder === 2" :src="require('@/assets/images/home/theme/order-desc.png')" width="10">
            </span>
          </van-tab>
        </van-tabs>
        <!-- <van-dropdown-menu active-color="#3A78EF" class="filterLeft">
          <van-dropdown-item @change="changeSelect" v-model="selectValue" :options="channelList" />
        </van-dropdown-menu> -->
      </div>
    </div>
    <div class="h102 mb10"></div>
    <div class="bg-white">
      <div style="width: 96%; margin: 0px auto;">
        <!-- <custom-card :card-type="'c'" :indexData='indexData["D"]' @link='linkDetails'/> -->
        <van-list
          v-model="customerDIV.loading"
          :finished="customerDIV.finished"
          :finished-text="'没有更多了'"
          @load="CustomerOnLoad"
          :error.sync="customerDIV.error"
          error-text="请求失败，点击重新加载"
          :immediate-check="false"
        >
          <custom-card 
            class="mb12"
            :card-type="'c'"       
            v-for="(customer, arrIndex) in list"
            @link='linkDetails'
            :name="customer.title"
            :shipment="`${formattedMoneyData(customer.amt, 2)}万`"
            :shipmentAmount="customer.num"
            :logo="customer.titleImage"
            :key="arrIndex" />
        </van-list>
      </div>
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
  </section>
</template>

<script>
import CustomCard from "@/components/CustomCard"
import { getCustomerList, getCountRank } from "@/api/findCustomer";
import { formattedMoneyData } from "@/utils";
export default {
  components:{
    CustomCard
  },
  data(){
    return {
      value: "",
      autofocus: false, // 自动聚焦搜索框
      active:0,
      currentDate: new Date(), // 当前日期
      current_time_active: "0", // 当前年月选择器model
      year_month_active: "2", // 年月选择器model
      yearList: [], // 生成年份列表
      resultDate:new Date(), // 结果日期
      showTimePopup: false, // 是否显示时间选择弹窗
      currentYearDefaultIndex:0,
      customerDIV:{
        error:false,
        finished:false,
        loading:false,
      },
      orderList:[
        { text: '排序', value: 0 },
        { text: '创建时间倒序', value: 1 },
        { text: '创建时间正序', value: 2 },
        { text: '客户名称倒序', value: 3 },
        { text: '客户名称正序', value: 4 }
      ],//排序
      channelList:[
        { text: '活动', value: 0 },
        { text: '有', value: 1 },
        { text: '无', value: 2 },
      ],//渠道类型
      numOrder:0, //
      amtOrder:0, //
      selectValue:0,
      // 默认排序
      // 返回的列表值
      list: [],
      params:{
        businessId: "all",
        code: "",
        day: null,
        id: "all",
        month: null,
        pageIndex: 0,
        pageSize: 10,
        rankType: "1",
        top: "10",
        type: "",
        year: 2021,
      },
    }
  },
  created(){
    this.currentDate = new Date(this.$route.query.time)
    console.log(this.currentDate.getFullYear())
    this.year_month_active = this.$route.query.year_month_active
    this.params.code = this.$route.query.code
    this.params.type = this.$route.query.type
    if(this.$route.query.businessId){
      this.params.businessId = this.$route.query.businessId
    }
    this.getDateYears();
  },
  mounted(){
    this.init()
  },
  methods:{
    formattedMoneyData,
    init(){
      this.list = []
      // 初始化时间
      this.initQueryDate()
      this.fetchSkuList()
    },
    onSearch() {
      this.params.name = this.value
      this.params.pageIndex = 0;
      this.init()
    },
    //初始化年的数值
    getDateYears() {
      let year = new Date().getFullYear() - 10;
      for (var a = 1; a <= 20; a++) {
        this.yearList.push(`${year}`);
        year++;
      }
    },
    onTabClick(name) {
      // this.$store.commit('SHOW_LOADING','加载中')
      if (name === 'numOrder') { //销量
        // 第一次点击升序，再次点击变为降序
        this.amtOrder = 0
        if (this.numOrder == 0) {
          // 升序
          this.numOrder = 2
          this.params.orderStr = 'desc'
        } else if (this.numOrder == 2) {
          // 降序
          this.numOrder = 1
          this.params.orderStr = 'asc'
        } else if (this.numOrder == 1) {
          // 升序
          this.numOrder = 2
          this.params.orderStr = 'desc'
        }
        this.params.orderStr = 'numOrder ' + this.params.orderStr
        this.onSearch()
      }else if(name === 'amtOrder'){
        // 第一次点击升序，再次点击变为降序
        this.numOrder = 0
        if (this.amtOrder == 0) {
          // 升序
          this.amtOrder = 2
          this.params.orderStr = 'desc'
        } else if (this.amtOrder == 2) {
          // 降序
          this.amtOrder = 1
          this.params.orderStr = 'asc'
        } else if (this.amtOrder == 1) {
          // 升序
          this.amtOrder = 2
          this.params.orderStr = 'desc'
        }
        this.params.orderStr = 'amtOrder ' + this.params.orderStr
        this.onSearch()
      }
      // this.$emit('input', this.value)
      // this.$emit('change', this.value)
    },
    changeSelect(value){
      this.params.channelTypeCode = value==0?'':value
      this.getBaseInfosByChannelTag()
    },
    fetchSkuList() {
    // 获取每一个列表的排行
      this.params.pageIndex += 1
      getCountRank(this.params).then(res => {
        if(res.records&&res.records.length>0){
          this.list = this.list.concat(res.records);
        }else{
          this.customerDIV.finished = true
        }
      }).catch(err=>{
        this.customerDIV.error = true
      }).finally(() => {
        this.customerDIV.loading = false
      });
    },
    //加载更多
    CustomerOnLoad() {
      if (this.customerDIV.finished) {
        console.log('加载完成');
        return
      }
      this.fetchSkuList()
    },
    // 初始化时间
    initQueryDate(){
      this.params.year = this.currentDate.getFullYear()
		  this.params.month = ['1','2',1,2].includes(this.year_month_active) ? this.currentDate.getMonth() + 1 : null
      this.params.day = this.year_month_active == 2 ? this.currentDate.getDate() : null
      console.info(this.params,'当前时间Query对象')
    },
    switchTimePopup(){
      // 进入时、初始化时间 
      this.resultDate = this.currentDate
      console.log(this.resultDate)
      this.current_time_active = Number(this.year_month_active)
      let year = String(this.currentDate.getFullYear())
      this.currentYearDefaultIndex = this.yearList.indexOf( year )  
      if(this.$refs.hasOwnProperty('yearPicker')){
        this.$refs.yearPicker.setIndexes([this.currentYearDefaultIndex])
      }
      this.showTimePopup = !this.showTimePopup
    },
    // 关闭选择时间弹窗
    closeTimePopup() {
      this.year_month_active = this.current_time_active
      this.currentDate = this.resultDate
      this.showTimePopup = false;
      this.params.pageIndex = 0;
      this.init();
    },
    linkDetails(item, type) {
      // console.log(item);
      if (type == 1) {
        if (!item.id) return;
        this.$router.push({
          path: "/customer/sales/data",
          params: {
            businessId: this.currentTabIndex,
            type: type,
            code: item.id,
            name: item.title,
            time: String(this.currentDate),
            timeType: this.year_month_active
          }
        });
      }
      // 跳转客户详情
      if(type==2){
        this.$router.push(`/customerdetails/${item.id}`)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.searchTop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 9999;
  background-color: #fff;
  /deep/ .van-search__content {
    border-radius: 30px;
  }
}
.page {
  height: 100vh;
  overflow-y: scroll;
  background: #F2F4F9;
  .filters{
    display: flex;
    border-bottom:1px solid #F5F6F9;
    .filterLeft{
      display: flex;
      justify-content: center;
      align-items: center;
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
      // min-width:0;
      flex:1;
      /deep/ .van-dropdown-menu__title{
        color:#959CA7;
      }
      /deep/ .van-tab{
        font-size: 15px;
        color:#909399;
        padding: 0 18px 0 10px;
      }
      /deep/ .van-dropdown-menu__title::after {
        // right: 1px;
        // left:2px;
        // margin-top: -2px;
        top: 56%;
        border: 2px solid;
        border-color: transparent transparent #959CA7 #959CA7;
        opacity: 1;
      }
    }
    .filterRight{
      display: flex;
      flex:1;
      justify-content: center;
      align-items: center;
      color: #909399;
      /deep/ .van-tab{
        font-size: 15px;
        color:#909399;
      }
      /deep/ .van-tab--active{
        color:#959CA7;
      }
      // /deep/ .van-tabs__nav--line {
      //     padding-bottom: 15px;
      //     padding-top: 3px;
      // }
      &.active{
        // border:1px solid rgba(61,147,255,1);
        color: #3D93FF;
      }
      &.active.triangle::before {
        content: "";
        position: absolute;
        right: 10%;
        width: 0;
        height: 0;
        top: 46%;
        transform: translate(0, -50%) rotateX(180deg);
        border-top: 3px solid #3D93FF;
      }
    }
  }
  .bottom-bar{
    display: flex;
    justify-content: space-between;
    
    &>div{
      width: 45%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      height: 38px;
      border-radius: 30px;
      font-weight: 600;
      &:nth-child(1){
        background-color:rgba(255,255,255,1);
        border: 1px solid #C7CBD3;
        color: #090909;
      }
      &:nth-child(2){
        background-color:#3A78EF;
        border: 1px solid #3A78EF;
        color: #ffffff;
      }
    }
  }
  .select-btn{
    width: 86px;
    height: 26px;
    background-color:rgba(245,246,249,1);
    border:1px solid rgba(245,246,249,1);
    border-radius: 30px;
    // display: flex;
    // align-items: center;
    // justify-content: center;
    font-size: 12px;
    color: #090909;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: center;
    line-height: 24px;
    &.active{
      background-color:rgba(242,249,255,1);
      border:1px solid rgba(61,147,255,1);
      color: #3D93FF;
    }
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
    right: 10%;
    width: 0;
    height: 0;
    top: 55%;
    transform: translate(0, -50%);
    border-top: 3px solid #959ca7;
    border-left: 3px solid transparent;
    border-right: 3px solid transparent;
    border-bottom: 3px solid transparent;
  }
  /deep/ .van-tabs__line{
    background-color: #1989fa;
  }
}
</style>