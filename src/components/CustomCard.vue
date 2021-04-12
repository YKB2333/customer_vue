<template>
  <div class="custom-card">
    <div v-if="cardType === 'a'">
      <van-cell
        class="managementRow"
        @click="$router.push(`/customerdetails/${id}`)"
      >
        <div>
          <img :src="logo || defaultLogo" class="w-h102" />
        </div>
        <div class="col space-around">
          <span class="ellipsis fs16 fw600"
            >{{
              name
            }}</span
          >
          <div class="row mtb2 l-h20">
            <span
              v-if="channelType"
              class="plr4 mr8 tag ellipsis radius2"
              style="background-color: rgb(58, 120, 139, 0.1); color: rgb(58, 120, 239);"
              >{{ channelType }}</span
            >
            <span
              v-if="industry"
              class="plr4 mr8 tag ellipsis radius2"
              style="background-color: rgba(255, 169, 64, 0.1); color: rgb(255, 169, 64);"
              >{{ industry }}</span
            >
          </div>
          <div class="ellipsis">
            <span>本月出货额</span>
            <span class="red ml8 fw600 fs14">{{ monthShipment!=null ? `¥${formattedMoneyData(monthShipment, 2)}万` : '****' }}</span>
          </div>
          <div class="ellipsis">
            <span>本月出货量</span>
            <span class="ml8">{{ monthShipmentAmount!=null ? monthShipmentAmount+'件' : '****' }}</span>
          </div>
        </div>
      </van-cell>
    </div>
    <div v-if="cardType === 'b'">
      <van-cell
        class="managementRow"
        @click="linkSalesDetails({id,name})"
      >
        <div>
          <img :src="logo|| defaultLogo" class="w-h102" />
        </div>
        <div class="col space-around">
          <span class="ellipsis fs16 fw600">
            {{
              name
            }}</span
          >
          <div class="mt2 mb8">
            <span>{{ year_month_active == '0' ? '本年' : (year_month_active == '1' ? '本月' : '本日') }}出货额</span>
            <span class="red ml8 fw600 fs14">{{ monthShipment!=null ? '¥'+monthShipment : '****' }}</span>
          </div>
          <div class="row">
            <span
              v-if="activityCount"
              class="plr8 mr8 tag ellipsis radius10"
              style="background-color: rgb(58, 120, 139, 0.1); color: rgb(58, 120, 239);"
              @click.stop="linkCustomerDetails({id})"
              >{{ '查看活动' }}</span
            >
            <span
              v-else
              class="plr8 mr8 tag ellipsis radius10"
              style="background-color: #F5F6F9; color: #C7CBD3;"
              >{{ '暂无活动' }}
            </span>
          </div>
        </div>
      </van-cell>
    </div>
    <div v-if="cardType === 'c'">
      <van-cell
        class="managementRow"
      >
        <div>
          <img :src="logo || defaultLogo" class="w-h102" />
        </div>
        <div class="col space-around">
          <span class="ellipsis fs16 fw600 mb10" @click="linkSalesDetails({id,title})">
            {{
              name
            }}</span
          >
          <div>
            <span>出货额</span>
            <span class="red ml8 fw600 fs14">¥{{ shipment || 0 }}</span>
          </div>
          <div>
            <span>出货量</span>
            <span class="ml8 fs12">{{ shipmentAmount || 0 }}件</span>
          </div>
        </div>
      </van-cell>
    </div>
    <div v-if="cardType === 'd'">
      <van-cell
        class="managementRow"
        @click="$router.push(`/customerdetails/${id}`)"
      >
        <div>
          <img :src="logo || defaultLogo" class="w-h102" />
        </div>
        <div class="col space-around">
          <span class="ellipsis fs16 fw600 mb10" @click="linkSalesDetails({id,title})">
            {{
              name
            }}</span
          >
        </div>
      </van-cell>
    </div>
    <div v-if="cardType === 'e'">
      <van-cell
        class="plr12 ptb14"
        @click="$router.push(`/customerdetails/${id}`)"
      >
        <div class="relative" style="border: none;">
          <img :src="logo || defaultLogo" class="w-h84 pos-center" style="border-radius: 8px;"/>
        </div>
        <div class="col space-around l-h20 h-full">
          <span class="ellipsis2 fs14 fw600 mt6 pr22" @click="linkSalesDetails({id,title})">
            {{
              name
            }}</span
          >
          <ul class="l-h12 managementRow-ul relative">
            <li class="mb6 ellipsis pr20">所属行业：{{industry}}</li>
            <li class="mb6 ellipsis pr20">渠道类型：{{channelType}}</li>
            <img :src="isFav?require('@/assets/images/fl_icon_sc_pre@2x.png'):require('@/assets/images/fl_icon_sc@2x.png')" 
                  class="w-h22 managementRow-ul-img" @click.stop="onCollect" />
          </ul>
        </div>
      </van-cell>
    </div>
  </div>
</template>

<script>
import { formattedMoneyData } from "@/utils";
export default {
  props: {
    cardType: {
      type: String,
    },
    indexData: {
      type: Array,
    },
    name:{
      type: String
    },
    //渠道类型
    channelType:{
      type: String
    },
    //行业类型
    industry:{
      type: String
    },
    title:{
      type: String
    },
    id:{
      type: String
    },
    logo:{
      type: String
    },
    //本月出货量
    monthShipment:{
      type: [Number, String]
    },
    //本月出货额
    monthShipmentAmount:{
      type: Number
    },
    //出货量
    shipment:{
      type: [Number, String]
    },
    //出货额
    shipmentAmount:{
      type: Number
    },
    //活动
    activityCount: {
      type: Number,
      default: 0
    },
    //年月日
    year_month_active: {
      type: Number,
      default: 0
    },
    //是否收藏
    isFav:{
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      defaultLogo: require("@/assets/images/defaultLogo.png"),
    }
  },
  mounted(){},
  methods:{
    formattedMoneyData,
    // 跳转详情
    linkSalesDetails(item){ 
      console.log(item)
      this.$emit('link', item, 1)
    },
    // 跳转客户详情
    linkCustomerDetails(item){ 
      this.$emit('link', item, 2)
    },
    //收藏
    onCollect(){
      this.$emit('collect')
    }
  }
};
</script>

<style lang="scss" scoped>
.custom-card .managementRow:last-child {
  margin-bottom: 0;
}
.managementRow {
  padding-top: 1rem;
  padding-bottom: 1rem;
  box-shadow: 0px 2px 11px 0px rgba(0, 72, 209, 0.1);
  border-radius: 8px;
  margin-bottom: 12px;
}
.van-cell {
  font-size: 12px;
}
.managementRow-ul{
  color: #959CA7;
  .managementRow-ul-img{
    position: absolute;
    right: 2px;
    bottom: 5px;
  }
}

/deep/ .van-cell__value,
.van-cell__value--alone {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  div:nth-child(1) {
    width: 102px;
    height: 102px;
    overflow: hidden;
    align-items: center;
    border: 1px solid rgba(244, 244, 244, 1);
    justify-content: center;
    border: radius 5px;
    margin-right: 8px;
    // img {
    //   width: 80%;
    // }
  }
  & > div:nth-child(2) {
    width: calc(100% - 110px);
  }
}
.tag {
  max-width: 46%;
}
</style>
