<template>
  <div>
    <!-- 全权限 -->
    <div v-if="permission">
      <div
        :class="['relative', 'wpct92', 'hidden']"
        style="margin:4% 4% 4.5% 4%; box-shadow:0px 2px 11px 0px rgba(0,72,209,0.1);border-radius:8px;"
        v-for="(item,index) in rankList"
        :key="index"
        @click="toGoodsDetail(item,index)"
      >
        <p class="fs16 fw600 color-dark-grey mt34 mb34" style="padding-left:7.5%;padding-right:7.5%">{{ item.title }}</p>
        <div class="absolute w-h30" style="left:0;top:0">
          <img :src="getRanking(index)" alt />
          <span
            class="absolute fs14 color-white fw500"
            style="left:5px;top:4px"
          >{{ numberFormatting(index) }}</span>
        </div>
        <div class="align wpct100">
          <div class="wpct50 relative" style="padding-left:7.5%;padding-right:7.5%">
            <p class="fs14 color-gray fw500 mb14">出库金额</p>
            <p class="fs25 mb16 ellipsis fw600">{{ item.amt | toThousandFilter(0) }}</p>
            <p class="fs14 mb32">
              <span class="color-gray">{{yearMonthActive == 0 ? '同比' : '环比'}}</span>
              <span :class="Math.sign(item.numRatio) > 0 ?'rise':'fall'">  {{isNegativeNumber(item.amtRatio)}}{{ item.amtRatio }}%</span>
            </p>
            <div class="w14 absolute" style="right:9.24%;top:-18px">
              <img
                src="@/assets/images/find/client_icon_up@2x.png"
                alt
                v-if="Math.sign(item.numRatio) > 0"
              />
              <img src="@/assets/images/find/client_icon_down@2x.png" alt v-else />
            </div>
          </div>
          <div class="col">
            <div v-for="i in 3" :key="i" class="w-h4 radius mb4" style="background-color:#C7CBD3;"></div>
          </div>
          <div class="wpct50 relative" style="padding-left:7.5%">
            <p class="fs14 mb14 color-gray fw500">出货件数</p>
            <p class="fs25 mb16 ellipsis fw600">{{ item.num | toThousandFilter(0)}}</p>
            <p class="fs14 mb32">
              <span class="color-gray">{{yearMonthActive == 0 ? '同比' : '环比'}}</span>
              <span :class="Math.sign(item.numRatio) > 0 ?'rise':'fall'">{{isNegativeNumber(item.numRatio) }}{{ item.numRatio }}%</span>
            </p>
            <div class="w14 absolute" style="right:9.24%;top:-18px">
              <img
                src="@/assets/images/find/client_icon_up@2x.png"
                alt
                v-if="Math.sign(item.numRatio) > 0"
              />
              <img src="@/assets/images/find/client_icon_down@2x.png" alt v-else />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 单一权限  sku -->
    <div v-else>
      <div
        class="relative wpct92 hidden"
        style="margin:4% 4% 4.5% 4%; box-shadow:0px 2px 11px 0px rgba(0,72,209,0.1);border-radius:8px;"
        v-for="(item,index) in rankList"
        :key="index"
        @click="toGoodsDetail(item,index)"
      >
        <div class="absolute w-h30" style="left:0;top:0">
          <img :src="getRanking(index)" alt />
          <span
            class="absolute  fs14 color-white fw500"
            style="left:5px;top:4px"
          >{{ numberFormatting(index) }}</span>
        </div>
        <div class="align mtb20 wpct92 mauto">
          <div
            class="w-h104 radius8 hidden"
            style="border:1px solid rgba(0, 72, 209, 0.1)"
          >
            <img :src="item.titleImage || defaultLogo" alt class="w-h-full" v-if="![1,2].includes(query.tabIndex)"/>
            <img :src="defaultLogo" alt="">
          </div>
          <div class="col relative ml12 hidden flex-1">
            <p class="fs16 color-dark-grey fw600 mt8 mb12 ellipsis2">{{ item.title }}</p>
            <div class="row w-full mb6">
              <p class="fs12 color-gray">出货件数</p>
              <p class="fs12 fw600 ml4 colro-dark-grey">{{ item.num }}</p>
            </div>
            <div class="fs12 row center-y mb8">
              <span class="color-gray">{{yearMonthActive == 0 ? '同比' : '环比'}}</span>
              <span :class="['ml8',Math.sign(item.numRatio) > 0 ?'rise':'fall']">{{isNegativeNumber(item.numRatio ) }}{{ item.numRatio }}%</span>
              <div class="w12 ml2 row center ">
                <img
                  src="@/assets/images/find/down-sm.png"
                  style="transform: rotate(180deg);"
                  alt
                  v-if="Math.sign(item.numRatio) > 0"
                />
                <img src="@/assets/images/find/up-sm.png"
                  style="transform: rotate(180deg);"
                 alt v-else />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "salesDetailsList",

  mixins: [],

  components: {},

  props: {
    rankList:{ // 单位
      type: Array,
      default: []
    },
    	// 是否权限
    permission : {
      type: Boolean,
      default: false
    },
    query:{
      type:Object,
      default:{}
    },
    yearMonthActive: {
      // 时间类型
      type: [String,Number], 
      default: "0"
    }
  },

  data() {
    return {
      defaultLogo: require("@/assets/images/defaultLogo.png"),
    };
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {},

  destroyed() {},

  methods: {
    toGoodsDetail(item) {
      let goods = this.$config.otherAppLogin["goods"];
      let idArray = String(item.pk).split('-')
      let type = this.query.tabIndex
      /* 暂时，所有的tab都不做跳转
      if(type == 0){
        this.linkGoodsDetailis(item)
        // window.open(`${goods}&jump=/productDetail?spuId=${item.id}`, "_blank");
      }
      */
      // 跳转大类 - 中类 - 品牌
      return
      if(type == 1){
        window.open(`${goods}&jump=/category?classifyId=${idArray[0]}`, "_blank");
      }
      if(type == 2){
        window.open(`${goods}&jump=/productList?cateOne=${idArray[0]}&cateTwo=${idArray[1]}`, "_blank");
      }
      if(type == 3){
        window.open(`${goods}&jump=/brandInfo?brandId=${idArray[0]}`, "_blank");
      }
    },
    linkGoodsDetailis(item){
      let goods = this.$config.otherAppLogin["goods"];
      let idArray = String(item.pk).split('-')
      var query = {
        ...this.query,
        name: item.title,
        code: item.skuSn,
        ratioType:'sku'
      }
      if(query.tabIndex == 0){
        if(query.timeType ==  0){
          let year = new Date(query.time).getFullYear()
          query.startTime = new Date(year,0,0).getTime()
          query.endTime = new Date(year+1,0,0).getTime()
        }else{
          query.startTime = new Date(query.time).getTime()
          let year = new Date(query.startTime).getFullYear()
          let month = new Date(query.startTime).getMonth()+1
          query.endTime = new Date(year,month).getTime()
        }
        this.$router.push({ path: "/salesDataDetailsAnalysisPage", query });
      }
    },
    getRanking(index) {
      if (index == 0) return require("@/assets/images/find/new_find/client_tag_top1@2x.png");
      if (index == 1) return require("@/assets/images/find/new_find/client_tag_top2@2x.png");
      if (index == 2) return require("@/assets/images/find/new_find/client_tag_top3@2x.png");
      return require("@/assets/images/find/new_find/client_tag@2x.png");
    },
    numberFormatting(index) {
      return index + 1 < 10 ? `0${index + 1}` : index + 1;
    },
    isNegativeNumber(num){
      return String(num).includes('-') ? '' : '+' 
    }
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
.rise {
  color: #ff3750;
}
.fall {
  color: #00c873;
}
.is-show{
  display: block;
}
.is-hide{
  display: none;
}
</style>
