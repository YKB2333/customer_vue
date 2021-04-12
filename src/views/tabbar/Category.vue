<template>
  <div id="category-page">
    <div>
      <van-search @input="search" v-model="searchVal" placeholder="请输入客户名称/客户渠道" />
      <div class="filters">
        <van-dropdown-menu
          active-color="#3A78EF"
          :class="['filterLeft','orderMenu',selectOrderActive?'selectOrderActive':'']"
        >
          <van-dropdown-item
            ref="orderRef"
            @change="changeOrderSelect"
            v-model="selectOrderValue"
            :options="orderList"
          >
            <div>
              <div class="inline-block wpct50">
                <van-button class="border-none" type="info" block @click="resetOrder">重置</van-button>
              </div>
              <div class="inline-block wpct50">
                <van-button class="border-none" plain type="info" block @click="closeOrder">取消</van-button>
              </div>
            </div>
          </van-dropdown-item>
        </van-dropdown-menu>
        <div
          class="filterRight flex-1 text-center triangle"
          :class="[showTimePopup || isTimeSelect ?'active':'']"
          @click="switchTimePopup"
        >
          <span>销售额</span>
          <!-- <span v-show="year_month_active==0">{{ currentDate | formatDate('Y年') }}</span>
          <span v-show="year_month_active==1">{{ currentDate | formatDate('Y年M月') }}</span>
          <span v-show="year_month_active==2">{{ currentDate | formatDate('Y年M月D日') }}</span>-->
        </div>
        <van-dropdown-menu
          active-color="#3A78EF"
          :class="['filterLeft',selectLevelActive?'selectLevelActive':'']"
        >
          <van-dropdown-item
            ref="levelRef"
            @change="changeLevelSelect"
            v-model="customerGrade"
            :options="levelList"
          >
            <div>
              <div class="inline-block wpct50">
                <van-button class="border-none" type="info" block @click="resetLevel">重置</van-button>
              </div>
              <div class="inline-block wpct50">
                <van-button class="border-none" plain type="info" block @click="closeLevel">取消</van-button>
              </div>
            </div>
          </van-dropdown-item>
        </van-dropdown-menu>
        <div class="filterRight" @click="showFilter">
          <span style="color:#959CA7;">筛选</span>
          <img :src="require('@/assets/images/kf_icon_sx@2x.png')" class="w-h14 ml4 mt2" />
        </div>
        <van-popup
          v-model="isShowFilterPopup"
          position="right"
          class="h-full fs14 col filter-popup"
          style="max-width: 86%; color: #090909;"
        >
          <div class="flex-1" style="overflow-y: auto;">
            <!-- 渠道大类 -->
            <div class="mb30 plr16">
              <h4 class="ptb16">渠道大类</h4>
              <div class="row space-between">
                <div
                  class="select-btn"
                  :class="filter.channelCategory === '' ? 'active' : ''"
                  @click="workStatus('channelCategory','')"
                >全部</div>
                <div
                  class="select-btn"
                  :class="filter.channelCategory === '线上渠道' ? 'active' : ''"
                  @click="workStatus('channelCategory','线上渠道')"
                >线上渠道</div>
                <div
                  class="select-btn"
                  :class="filter.channelCategory === '线下渠道' ? 'active' : ''"
                  @click="workStatus('channelCategory','线下渠道')"
                >线下渠道</div>
              </div>
            </div>
            <!-- 客户类型 -->
            <div class="mb30 plr16">
              <h4 class="pb16">客户类型</h4>
              <div class="row center-y">
                <div
                  class="select-btn"
                  :class="filter.type === '' ? 'active' : ''"
                  @click="workStatus('type','')"
                >全部</div>
                <div
                  class="select-btn"
                  :class="filter.type === '0' ? 'active' : ''"
                  @click="workStatus('type','0')"
                >外部单位</div>
                <div
                  class="select-btn"
                  :class="filter.type === '1' ? 'active' : ''"
                  @click="workStatus('type','1')"
                >内部单位</div>
              </div>
            </div>
            <!-- 结算方式 -->
            <div class="mb22 plr16">
              <h4 class="mb8">结算方式</h4>
              <div class="row flex-wrap">
                <div
                  class="select-btn"
                  :class="filter.closeMethod === '' ? 'active' : ''"
                  @click="workStatus('closeMethod','')"
                >全部</div>
                <div
                  v-for="item in closeMethodList"
                  :key="item.code"
                  class="select-btn"
                  :class="filter.closeMethod === item.code ? 'active' : ''"
                  @click="workStatus('closeMethod', item.code)"
                >{{ item.name }}</div>
                <!-- <div
                  class="select-btn"
                  :class="filter.closeMethod === '月结' ? 'active' : ''"
                  @click="workStatus('closeMethod','月结')"
                >月结</div>-->
              </div>
            </div>
          </div>
          <!-- 按钮 -->
          <div class="bottom-bar plr16 ptb20">
            <div @click="onReset">重置</div>
            <div @click="onConfirm">确定</div>
          </div>
        </van-popup>
      </div>
    </div>
    <div class="row category-page-box" style="flex: 1; overflow-y: auto">
      <!-- 渠道列表 -->
      <div class="sidebar" ref="sidebar">
        <div
          :class="['item', 'pointer', 'van-hairline--right',
                    sidebarData && (index !== sidebarData.length-1) ? 'van-hairline--bottom' : 'mb50',
                    index === currentSidebarIndex ? 'active' : ''
                  ]"
          v-for="(item, index) in sidebarData"
          :key="index"
          @click="onSidebarClick(item, index)"
        >
          <p>{{ item.name }}</p>
          <i class="line"></i>
          <!-- <img class="arrow" :src="require('@/assets/images/arrow-left.png')"> -->
        </div>
      </div>
      <div id="content-box" ref="content">
        <!-- 客户列表 -->
        <div>
          <van-list
            v-model="loading"
            @load="onLoad"
            class="van-clearfix"
            :finished="finished"
            :error.sync="error"
            error-text="请求失败，点击重新加载"
          >
            <custom-card
              v-for="(item, idx) in customerList"
              :card-type="'e'"
              :name="item.name"
              :industry="item.industry"
              :channel-type="item.channelType"
              :id="item.id"
              :logo="item.logo"
              :is-fav="item.isFav"
              :key="idx"
              @collect="onCollect(item)"
              style="border-bottom:1px solid #F4F4F4;"
            />
            <div v-if="(!customerList||!customerList.length) && finished" class="emply mt20">
              <img src="@/assets/images/isEmply2.png" alt />
              <p class="mb10">暂无客户哦</p>
            </div>
          </van-list>
        </div>
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
  </div>
</template>

<script>
import { savePosition } from '@/mixins'
import { getNcChannel, getCustomerList } from '@/api/category'
import CustomCard from '@/components/CustomCard'
// import { getChannelList } from "@/api/findCustomer";
import { addFavorite, cancelFavorite } from '@/api/findCustomer/index'
import { getCloseMethod } from '@/api/category'

export default {
  name: 'Category',
  components: { CustomCard },
  data() {
    return {
      closeMethodList: [],
      error: false,
      finished: false,
      loading: false,
      sidebarData: [], // 渠道列表
      customerList: [], // 客户列表
      currentSidebarIndex: 0,
      sidebarScrollTop: 0, // 侧边栏滚动区域
      contentScrollTop: 0, // 客户列表滚动区域
      autoHeight: '',
      searchVal: '',
      currentDate: new Date(), // 当前日期
      current_time_active: '0', // 当前年月选择器model
      year_month_active: '0', // 年月选择器model
      yearList: [], // 生成年份列表
      resultDate: new Date(), // 结果日期
      currentYearDefaultIndex: 0,
      status: 1, //1是搜索和第一次进来，2是点击左侧标签，由于这次分页有两个接口,问唐鑫
      levelList: [
        { text: '客户等级', value: '0' },
        { text: '一般客户', value: '1' },
        { text: '战略客户', value: '2' }
      ],
      selectOrderActive: false, //排序高亮
      selectLevelActive: false, //渠道高亮
      orderList: [
        { text: '排序', value: '' },
        { text: '按创建时间正序', value: 'createTimestamp asc' },
        { text: '按创建时间倒序', value: 'createTimestamp desc' }
        // { text: '按客户名称正序', value: 'name asc' },
        // { text: '按客户名称倒序', value: 'name desc' }
        // { text: '默认排序', value: '' }
      ], //排序
      selectOrderValue: '',
      customerGrade: '0',
      isShowFilterPopup: false, //筛选列表
      active: 0,
      query: {
        channelCategory: '', //渠道大类
        channelTypeCode: '', //渠道类型编码
        type: '', //客户类型
        customerGrade: '', //客户等级
        name: '', //客户名称
        pageIndex: 1,
        pageSize: 20,
        orderStr: '', //排序
        closeMethod: '', //结算方式
        channelTypeCode: '',
        year: new Date().getFullYear(),
        month: '',
        day: ''
      },
      filter: {
        channelCategory: '', //渠道大类
        type: '', //客户类型
        closeMethod: '' //结算方式
      },
      showTimePopup: false, // 是否显示时间选择弹窗
      isTimeSelect: false
    }
  },
  computed: {
    currentChannel() {
      if (this.sidebarData.length) {
        return this.sidebarData[this.currentSidebarIndex]
      } else {
        return null
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    resetLevel() {
      // selectLevelActive
      this.selectLevelActive = false
      this.query.customerGrade = ''
      this.customerGrade = '0'
      this.initQuery()
      this.$refs.levelRef.toggle(false)
    },
    closeLevel() {
      this.$refs.levelRef.toggle(false)
    },
    resetOrder() {
      this.query.orderStr = ''
      this.selectOrderValue = ''
      this.initQuery()
      this.$refs.orderRef.toggle(false)
    },
    closeOrder() {
      this.$refs.orderRef.toggle(false)
    },
    onLoad() {
      if (this.finished) {
        console.log('加载完成')
        return
      }
      if (this.status == 1) {
        if (this.query.pageIndex == 1) {
          this.fetchCustomerList('init')
        } else {
          this.fetchCustomerList()
        }
      } else if (this.status == 2) {
        if (this.query.pageIndex == 1) {
          this.fetchCustomerListandName('init')
        } else {
          this.fetchCustomerListandName()
        }
      }
    },
    async init() {
      this.getDateYears()
      await this.fetchChannelList()
      this.getCloseMethod()
      // this.fetchCustomerList("init");
    },
    getCloseMethod() {
      getCloseMethod().then((res) => {
        this.closeMethodList = res || []
      })
    },
    //初始化年的数值
    getDateYears() {
      let year = new Date().getFullYear() - 10
      for (var a = 1; a <= 20; a++) {
        this.yearList.push(`${year}`)
        year++
      }
    },
    search(val) {
      this.status = 1
      this.query.pageIndex = 1
      this.currentSidebarIndex = 0
      this.fetchCustomerList('init')
    },
    // 获取渠道列表
    fetchChannelList() {
      return new Promise((resolve, reject) => {
        getNcChannel().then((res) => {
          console.log(res)
          this.sidebarData = res
          this.sidebarData.unshift({ code: '', name: '所有' })
          resolve()
        })
      })
    },

    // 获取客户列表
    fetchCustomerList(init) {
      //搜索和进来都走这里
      this.finished = false
      this.loading = true
      if (init) {
        this.query.pageIndex = 1
        this.customerList = []
      }
      this.query.keyword = this.searchVal || ''
      this.query.channelTypeCode = ''
      // this.$store.commit("SHOW_LOADING");
      getCustomerList(this.query)
        .then((res) => {
          let records = res.records
          if (records && records.length > 0) {
            this.customerList = this.customerList.concat(records)
          } else {
            this.finished = true
          }
          console.log('客户列表', this.list)
          this.$toast.clear()
        })
        .catch((err) => {
          this.error = true
        })
        .finally(() => {
          this.query.pageIndex += 1
          this.loading = false
        })
      // getNcChannel(this.query)
      //   .then((res) => {
      //     res.channelInfoList.unshift({ code: "", name: "所有" });
      //     console.log(res)
      //     this.sidebarData = res.result;
      //     this.customerList = this.customerList.concat(
      //       res.baseInfoList.records
      //     );
      //     console.log(this.query);
      //     if (res.baseInfoList.records.length < 20) {
      //       this.finished = true;
      //     } else if (!this.customerList.length) {
      //       this.finished = true;
      //     }
      //     setTimeout(() => {
      //       if (this.customerList.length > 0) {
      //         this.autoHeight = this.$refs.customerWidth.children[0].clientWidth;
      //       }
      //     });
      //   })
      //   .catch((error) => {
      //     this.error = true;
      //   })
      //   .finally(() => {
      //     this.query.pageIndex += 1;
      //     this.loading = false;
      //     this.$store.commit("SHOW_LOADING", false);
      //   });
    },
    fetchCustomerListandName(init) {
      //点击左侧tab
      this.finished = false
      this.loading = true
      if (init) {
        this.query.pageIndex = 1
        this.customerList = []
      }
      this.query.keyword = this.searchVal || ''
      this.query.channelTypeCode = this.currentChannel['code']
      // if(this.currentChannel['code']) this.query.channelTypeCode = this.currentChannel['code']
      this.$store.commit('SHOW_LOADING')
      getCustomerList(this.query)
        .then((res) => {
          this.customerList = this.customerList.concat(res.records)
          console.log(this.query)
          if (res.records.length < 20) {
            this.finished = true
          } else if (!this.customerList.length) {
            this.finished = true
          }
        })
        .catch((error) => {
          this.error = true
        })
        .finally(() => {
          this.query.pageIndex += 1
          this.loading = false
          this.$store.commit('SHOW_LOADING', false)
        })
    },
    //初始化参数
    initQuery() {
      // this.query.pageIndex = 0
      this.error = false
      this.finished = false
      this.loading = false
      this.fetchCustomerList('init')
    },
    onSidebarClick(item, index) {
      this.status = 2
      if (index === this.currentSidebarIndex) return
      this.currentSidebarIndex = index
      this.fetchCustomerListandName('init')
      this.$refs['content'].scrollTop = 0
    },
    //排序
    changeOrderSelect(value) {
      this.query.orderStr = this.query.orderStr === value ? '' : value
      this.selectOrderActive = this.query.orderStr !== value
      // this.selectOrderValue = this.query.orderStr
      this.initQuery()
    },
    //渠道类型
    changeLevelSelect(value) {
      this.selectLevelActive = true
      console.log('战略客户', this.query.customerGrade)
      this.query.customerGrade = value == 0 ? '' : value
      this.initQuery()
    },
    showFilter() {
      this.isShowFilterPopup = true
    },
    workStatus(type, value) {
      this.filter[type] = value
    },
    onReset() {
      this.filter = {
        channelCategory: '', //渠道大类
        type: '', //客户等级
        closeMethod: '' //结算方式
      }
    },
    onConfirm() {
      let data = _.cloneDeep(this.filter)
      Object.assign(this.query, data)
      console.log(this.query)
      this.initQuery()
      this.isShowFilterPopup = false
    },
    //销量
    switchTimePopup() {
      // 进入时、初始化时间
      this.resultDate = new Date(this.currentDate)
      console.log(this.resultDate)
      this.current_time_active = Number(this.year_month_active)
      let year = String(new Date(this.currentDate).getFullYear())
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
      this.query.year = String(new Date(this.resultDate).getFullYear())
      this.query.month = [1, 2].includes(this.current_time_active)
        ? new Date(this.resultDate).getMonth() + 1
        : ''
      this.query.day = [2].includes(this.current_time_active)
        ? String(new Date(this.resultDate).getDate())
        : ''
      this.showTimePopup = false
      this.isTimeSelect = true
      this.query.pageIndex = 1
      this.onLoad()
    },
    onCollect(obj) {
      // 添加收藏
      if (obj.isFav === false) {
        // 收藏
        obj.isFav = true
        this.$toast('收藏成功')
        this.addFavorites(obj)
      } else {
        obj.isFav = false
        this.$toast('取消收藏')
        this.cancelFavorites(obj)
      }
    },
    addFavorites(obj) {
      addFavorite({
        contentType: 'customerCustInfo',
        id: obj.id,
        title: obj.name,
        titleImage: obj.logo
      })
        .then((res) => {
          console.log(res)
        })
        .catch((error) => {
          console.log(error)
          this.isCollect = false
          this.$toast('收藏失败')
        })
    },
    cancelFavorites(obj) {
      cancelFavorite(obj.id)
        .then((res) => {})
        .catch((error) => {
          console.log(error)
          this.$toast('取消收藏失败')
        })
    }
  },
  beforeRouteLeave(to, from, next) {
    this.sidebarScrollTop = this.$refs['sidebar'].scrollTop || 0
    this.contentScrollTop = this.$refs['content'].scrollTop || 0
    next()
  },
  // deactivated() {
  //   setTimeout(() => {
  //     this.sidebarScrollTop = this.$refs['sidebar'].scrollTop || 0
  //     this.contentScrollTop = this.$refs['content'].scrollTop || 0
  //   }, 300);
  //   // console.log(this.$refs['content'].scrollTop)
  // },
  activated() {
    this.$refs['sidebar'].scrollTop = this.sidebarScrollTop
    this.$refs['content'].scrollTop = this.contentScrollTop
  }
}
</script>

<style lang="scss" scoped>
#category-page {
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  .category-page-box {
    flex: 1;
  }
  .van-sidebar-item--select {
    border-color: #3d93ff;
  }
  .sidebar {
    width: 90px;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    height: 100%;
    overflow-y: auto;
    .item {
      padding: 15px 8px;
      color: #999999;
      font-size: 14px;
      position: relative;
      text-align: center;
      .arrow {
        visibility: hidden;
        right: 0px;
        top: 50%;
        transform: translateY(-50%);
        width: 16px;
        position: absolute;
      }
      &.active {
        color: #090909;
        font-weight: 600;
        .line {
          display: inline-block;
          width: 5px;
          height: 18px;
          background-color: #3d93ff;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          border-radius: 10px;
        }
        .arrow {
          visibility: visible;
        }
      }
    }
  }
  // .positionDiv{
  //   position: relative;
  //   width: 100%;
  //   overflow: hidden;
  //   img{
  //     position: absolute;
  //     left: 50%;
  //     top: 50%;
  //     transform: translate(-50%,-50%);
  //   }
  // }
  #content-box {
    // padding-left: 90px;
    flex: 1;
    background-color: #fff;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .cate-item {
    text-align: center;
    margin-bottom: 20px;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      // max-width: 95px;
      // max-height: 95px;
      // border-radius: 50%;
    }
    p {
      font-size: 12px;
      color: #090909;
      margin-top: 8px;
      min-height: 35px;
    }
  }
  .filters {
    display: flex;
    border-bottom: 1px solid #f5f6f9;
    .filterLeft {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      // min-width:0;
      flex: 1;
      /deep/ .van-dropdown-menu__title {
        color: #959ca7;
      }
      /deep/ .van-dropdown-menu__title::after {
        right: 1px;
        // left:2px;
        margin-top: -2px;
        border: 2px solid;
        border-color: transparent transparent #959ca7 #959ca7;
        opacity: 1;
      }
    }
    .filterRight {
      display: flex;
      flex: 1;
      justify-content: center;
      align-items: center;
      font-size: 15px !important;
      > span {
        transform: translateY(-1px);
      }
      /deep/ .van-tab {
        font-size: 15px;
        color: #909399;
        font-weight: 400;
      }
      /deep/ .van-tab--active {
        color: #959ca7;
      }
      // /deep/ .van-tabs__nav--line {
      //     padding-bottom: 15px;
      //     padding-top: 3px;
      // }
    }
    .triangle {
      position: relative;
      color: rgb(149, 156, 167);
      span {
        width: 70%;
        display: inline-block;
      }
      &.active {
        color: #3a78ef;
      }
    }
    .triangle::before {
      content: '';
      position: absolute;
      right: 20%;
      width: 0;
      height: 0;
      top: 55%;
      transform: translate(0, -45%);
      border-top: 3px solid #959ca7;
      border-left: 3px solid transparent;
      border-right: 3px solid transparent;
      border-bottom: 3px solid transparent;
    }
  }
  .bottom-bar {
    display: flex;
    justify-content: space-between;

    & > div {
      width: 45%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      height: 38px;
      border-radius: 30px;
      font-weight: 600;
      &:nth-child(1) {
        background-color: rgba(255, 255, 255, 1);
        border: 1px solid #c7cbd3;
        color: #090909;
      }
      &:nth-child(2) {
        background-color: #3a78ef;
        border: 1px solid #3a78ef;
        color: #ffffff;
      }
    }
  }
  .select-btn {
    width: 86px;
    height: 26px;
    background-color: rgba(245, 246, 249, 1);
    border: 1px solid rgba(245, 246, 249, 1);
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
    margin: 4px 2px;
    &.active {
      background-color: rgba(242, 249, 255, 1);
      border: 1px solid rgba(61, 147, 255, 1);
      color: #3d93ff;
    }
  }
  .emply {
    text-align: center;
    padding: 10px 0;
    img {
      width: 200px;
    }
    p {
      margin-top: 20px;
      font-size: 14px;
      color: #959ca7;
      line-height: 14px;
    }
  }
  /deep/ .van-search__content {
    border-radius: 18px;
  }
  /deep/ .van-search {
    border-bottom: 1px solid #f4f4f4;
  }
  /deep/ .van-tabs__line {
    background-color: #1989fa;
  }
  /deep/ .van-dropdown-item__content .van-dropdown-item__option:nth-child(1) {
    display: none;
  }
  /deep/ .selectLevelActive .van-ellipsis {
    color: rgb(58, 120, 239);
  }
  /deep/ .van-icon-search::before {
    content: '';
    width: 18px;
    height: 18px;
    background: url('~@/assets/images/icon_search@2x.png');
    background-size: cover;
  }
}
// 下拉的操作按钮
.border-none {
  border: none !important;
}
</style>
