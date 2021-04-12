<template>
  <section class="page">
    <div class="searchTop">
      <van-search
        :left-icon="require('@/assets/images/icon_search@2x.png')"
        placeholder="请输入客户名/关键词"
        v-model="value"
        @input="onSearch()"
        :autofocus="autofocus"
      />
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
                <van-button class="border-none" type="info" block @click="resetQuery('orderRef')">重置</van-button>
              </div>
              <div class="inline-block wpct50">
                <van-button
                  class="border-none"
                  plain
                  type="info"
                  block
                  @click="closeMenu('orderRef')"
                >取消</van-button>
              </div>
            </div>
          </van-dropdown-item>
        </van-dropdown-menu>
        <van-tabs
          v-model="active"
          class="filterRight"
          @click="onTabClick"
          :border="false"
          line-height="0"
        >
          <van-tab title="销量" name="priceOrder">
            <span slot="title" :class="[priceOrderActive?'priceOrderActive':'']">
              销量
              <img
                v-if="priceOrder === 0"
                :src="require('@/assets/images/home/theme/order.png')"
                width="10"
              />
              <img
                v-if="priceOrder === 1"
                :src="require('@/assets/images/home/theme/order-asc.png')"
                width="10"
              />
              <img
                v-if="priceOrder === 2"
                :src="require('@/assets/images/home/theme/order-desc.png')"
                width="10"
              />
            </span>
          </van-tab>
        </van-tabs>
        <van-dropdown-menu
          active-color="#3A78EF"
          :class="['filterLeft',selectChannelActive?'selectChannelActive':'']"
        >
          <van-dropdown-item
            ref="channelRef"
            @change="changeChannelSelect"
            v-model="selectChannelValue"
            :options="channelList"
          >
            <div>
              <div class="inline-block wpct50">
                <van-button
                  class="border-none"
                  type="info"
                  block
                  @click="resetQuery('channelRef')"
                >重置</van-button>
              </div>
              <div class="inline-block wpct50">
                <van-button
                  class="border-none"
                  plain
                  type="info"
                  block
                  @click="closeMenu('channelRef')"
                >取消</van-button>
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
            <!-- 货品类型 -->
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
            <!-- 价格区间 -->
            <div class="mb30 plr16">
              <h4 class="pb16">客户等级</h4>
              <div class="row center-y">
                <div
                  class="select-btn"
                  :class="filter.customerGrade === '' ? 'active' : ''"
                  @click="workStatus('customerGrade','')"
                >全部</div>
                <div
                  class="select-btn"
                  :class="filter.customerGrade === '1' ? 'active' : ''"
                  @click="workStatus('customerGrade','1')"
                >一般客户</div>
                <div
                  class="select-btn"
                  :class="filter.customerGrade === '2' ? 'active' : ''"
                  @click="workStatus('customerGrade','2')"
                >战略客户</div>
              </div>
            </div>
            <!-- 贸易类型 -->
            <div class="mb30 plr16">
              <h4 class="pb16">标签</h4>
              <div class="row wrap">
                <div
                  class="select-btn"
                  :class="filter.tag === '' ? 'active' : ''"
                  @click="workStatus('tag','')"
                >全部</div>
                <div
                  class="select-btn"
                  :class="filter.tag === '跨境客户' ? 'active' : ''"
                  @click="workStatus('tag','跨境客户')"
                >跨境客户</div>
                <div
                  class="select-btn"
                  :class="filter.tag === '联合公司' ? 'active' : ''"
                  @click="workStatus('tag','联合公司')"
                >联合公司</div>
                <div
                  class="select-btn"
                  :class="filter.tag === '一件代发客户' ? 'active' : ''"
                  @click="workStatus('tag','一件代发客户')"
                >一件代发客户</div>
              </div>
            </div>
            <!-- <div class="mb22 plr16" v-if="showBrandCategory"> -->
            <!-- 货品类型 -->
            <div class="mb22 plr16">
              <h4 class="mb8">结算方式</h4>
              <div class="row flex-wrap">
                <div
                  class="select-btn"
                  :class="filter.closeMethod === '' ? 'active' : ''"
                  @click="workStatus('closeMethod','')"
                >全部</div>
                <div
                  class="select-btn"
                  :class="filter.closeMethod === '现款现货' ? 'active' : ''"
                  @click="workStatus('closeMethod','现款现货')"
                >现款现货</div>
                <div
                  class="select-btn"
                  :class="filter.closeMethod === '月结' ? 'active' : ''"
                  @click="workStatus('closeMethod','月结')"
                >月结</div>
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
    <div class="h102 mb10"></div>
    <div class="bg-white">
      <div style="width: 96%; margin: 0px auto;">
        <van-list
          v-model="customerDIV.loading"
          :finished="customerDIV.finished"
          @load="CustomerOnLoad"
          :error.sync="customerDIV.error"
          error-text="请求失败，点击重新加载"
          :immediate-check="false"
        >
          <custom-card
            class="mb12"
            :card-type="'a'"
            v-for="(customer, arrIndex) in list"
            :name="customer.csName"
            :id="customer.id"
            :channelType="customer.channelType"
            :industry="customer.industry"
            :logo="customer.logo"
            :monthShipmentAmount="customer.qty"
            :monthShipment="customer.amt"
            :key="arrIndex"
          />
          <div v-if="(!list||!list.length) && customerDIV.finished" class="emply mt20">
            <img :src="require('@/assets/images/isEmply2.png')" alt />
            <p class="mb10">暂无客户哦</p>
          </div>
        </van-list>
      </div>
    </div>
  </section>
</template>

<script>
import CustomCard from '@/components/CustomCard'
import { getMyCustomer } from '@/api/mine'
import { getNcChannel } from '@/api/category'

export default {
  components: {
    CustomCard
  },
  data() {
    return {
      value: '',
      autofocus: false, // 自动聚焦搜索框
      active: 0,
      orderList: [
        { text: '排序', value: '' },
        { text: '创建时间倒序', value: 'createDate desc' },
        { text: '创建时间正序', value: 'createDate asc' },
        { text: '客户名称倒序', value: 'name desc' },
        { text: '客户名称正序', value: 'name asc' }
      ], //排序
      priceOrder: 0, //
      selectOrderValue: '',
      selectChannelValue: 0,
      isShowFilterPopup: false, //筛选列表
      // 默认排序
      // 返回的列表值
      list: [],
      query: {
        channelCategory: '', //渠道大类
        channelTypeCode: '', //渠道类型编码
        customerGrade: '', //客户等级
        name: '', //客户名称
        pageIndex: 0,
        pageSize: 10,
        orderStr: '', //排序
        tag: '', //标签
        closeMethod: '' //结算方式
      },
      filter: {
        channelCategory: '', //渠道大类
        customerGrade: '', //客户等级
        tag: '', //标签
        closeMethod: '' //结算方式
      },
      customerDIV: {
        error: false,
        finished: false,
        loading: false
      },
      data_: {
        pageIndex: 0,
        pageSize: 20,
        channelTypeCode: ''
      }, //渠道类型参数
      channelList: [{ text: '渠道类型', value: 0 }], //渠道类型
      selectOrderActive: false, //排序高亮
      priceOrderActive: false, //销量高亮
      selectChannelActive: false //渠道高亮
    }
  },
  created() {
    // this.getChannel()
    this.fetchCustomerList()
    this.fetchCustomerListByChannel()
  },
  methods: {
    onSearch() {
      this.query = {
        channelCategory: '', //渠道大类
        channelTypeCode: '', //渠道类型编码
        customerGrade: '', //客户等级
        name: this.value, //客户名称
        pageIndex: 0,
        pageSize: 10,
        orderStr: '', //排序
        tag: '', //标签
        closeMethod: '' //结算方式
      }
      this.customerDIV = {
        error: false,
        finished: false,
        loading: false
      }
      this.list = []
      this.fetchCustomerList()
    },
    //销量
    onTabClick(name) {
      // this.$store.commit('SHOW_LOADING','加载中')
      this.selectOrderValue = ''
      this.selectOrderActive = false
      this.priceOrderActive = true
      if (name === 'priceOrder') {
        // 第一次点击升序，再次点击变为降序
        if (this.priceOrder == 0) {
          // 升序
          this.priceOrder = 2
          this.query.orderStr = 'desc'
        } else if (this.priceOrder == 2) {
          // 降序
          this.priceOrder = 1
          this.query.orderStr = 'asc'
        } else if (this.priceOrder == 1) {
          // 升序
          this.priceOrder = 2
          this.query.orderStr = 'desc'
        }
        this.query.orderStr = 'amt ' + this.query.orderStr
      }
      this.initQuery()
      // this.$emit('input', this.value)
      // this.$emit('change', this.value)
    },
    //排序
    changeOrderSelect(value) {
      this.priceOrder = 0
      this.query.orderStr = value
      this.selectOrderActive = true
      this.priceOrderActive = false
      this.initQuery()
    },
    //渠道类型
    changeChannelSelect(value) {
      this.selectChannelActive = true
      console.log('渠道类型', this.query.channelTypeCode)
      this.query.channelTypeCode = value == 0 ? '' : value
      this.initQuery()
    },
    getChannel() {
      // this.channelList.push({ text: '排序', value: 0 });
    },
    showFilter() {
      this.isShowFilterPopup = true
    },
    //结果列表
    fetchCustomerList() {
      this.customerDIV.loading = true
      this.query.pageIndex += 1
      getMyCustomer(this.query)
        .then((res) => {
          if (res.records && res.records.length > 0) {
            this.list = this.list.concat(res.records)
          } else {
            this.customerDIV.finished = true
          }
          console.log('客户列表', this.list)
          this.$toast.clear()
        })
        .catch((err) => {
          this.customerDIV.error = true
        })
        .finally(() => {
          this.customerDIV.loading = false
        })
    },
    //加载更多
    CustomerOnLoad() {
      if (this.customerDIV.finished) {
        console.log('加载完成')
        return
      }
      this.fetchCustomerList()
    },
    //初始化参数
    initQuery() {
      this.query.pageIndex = 0
      this.customerDIV = {
        error: false,
        finished: false,
        loading: false
      }
      this.list = []
      this.fetchCustomerList()
    },
    //渠道类型筛选列表
    fetchCustomerListByChannel() {
      this.data_.pageIndex += 1
      getNcChannel(this.data_)
        .then((res) => {
          res.unshift({ code: '', name: '所有' })
          res.forEach((item) => {
            this.channelList.push({ text: item.name, value: item.code })
          })
        })
        .catch((error) => {
          this.error = true
        })
        .finally(() => {
          this.loading = false
          this.$store.commit('SHOW_LOADING', false)
        })
    },
    //弹出筛选
    workStatus(type, value) {
      this.filter[type] = value
    },
    onReset() {
      this.filter = {
        channelCategory: '', //渠道大类
        customerGrade: '', //客户等级
        tag: '', //标签
        closeMethod: '' //结算方式
      }
    },
    onConfirm() {
      let data = _.cloneDeep(this.filter)
      Object.assign(this.query, data)
      this.initQuery()
      this.isShowFilterPopup = false
    },
    resetQuery(type) {
      if (type === 'orderRef') {
        this.selectOrderActive = false
        this.query.orderStr = ''
        this.selectOrderValue = ''
      } else if (type === 'channelRef') {
        this.selectChannelActive = false
        this.query.channelTypeCode = ''
        this.selectChannelValue = 0
      }
      this.$refs[type].toggle(false)
      this.initQuery()
    },
    closeMenu(type) {
      this.$refs[type].toggle(false)
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
  background: #f2f4f9;
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
  /deep/ .van-dropdown-item__content .van-dropdown-item__option:nth-child(1) {
    display: none;
  }
  /deep/ .orderMenu .van-dropdown-item__option .van-cell__title span::after {
    content: '';
    display: inline-block;
    width: 16px;
    height: 16px;
    background: url('~@/assets/images/kf_icon_tz@2x.png') no-repeat;
    background-size: contain;
    transform: translateY(22%);
  }
  /deep/
    .orderMenu
    .van-dropdown-item__option--active
    .van-cell__title
    span::after {
    content: '';
    display: inline-block;
    width: 16px;
    height: 16px;
    background: url('~@/assets/images/kf_icon_tzp@2x.png') no-repeat;
    background-size: contain;
    transform: translateY(22%);
  }
  /deep/
    .orderMenu
    .van-dropdown-item__option:nth-of-type(2)
    .van-cell__title
    span::after {
    content: '';
    display: inline-block;
    width: 16px;
    height: 16px;
    background: url('~@/assets/images/kf_icon_tdp@2x.png') no-repeat;
    background-size: contain;
    transform: translateY(22%);
  }
  /deep/
    .orderMenu
    .van-dropdown-item__option:nth-of-type(4)
    .van-cell__title
    span::after {
    content: '';
    display: inline-block;
    width: 16px;
    height: 16px;
    background: url('~@/assets/images/kf_icon_tdp@2x.png') no-repeat;
    background-size: contain;
    transform: translateY(22%);
  }
  /deep/
    .orderMenu
    .van-dropdown-item__option--active:nth-of-type(2)
    .van-cell__title
    span::after {
    content: '';
    display: inline-block;
    width: 16px;
    height: 16px;
    background: url('~@/assets/images/kf_icon_td@2x.png') no-repeat;
    background-size: contain;
    transform: translateY(22%);
  }
  /deep/
    .orderMenu
    .van-dropdown-item__option--active:nth-of-type(4)
    .van-cell__title
    span::after {
    content: '';
    display: inline-block;
    width: 16px;
    height: 16px;
    background: url('~@/assets/images/kf_icon_td@2x.png') no-repeat;
    background-size: contain;
    transform: translateY(22%);
  }
  /deep/ .selectOrderActive .van-ellipsis,
  /deep/ .selectChannelActive .van-ellipsis,
  .priceOrderActive {
    color: rgb(58, 120, 239);
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
  // 下拉的操作按钮
  .border-none {
    border: none !important;
  }
}
</style>