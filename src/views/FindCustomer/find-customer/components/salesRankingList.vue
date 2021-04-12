<template>
  <div class="mb20">
    <div :class="[ 'wpct100 mauto bg-white relative rankingList']" style="padding:0 4%; ">
      <!-- 列表 -->
      <div
        :class="['row mb10 relative']"
        style="align-items:center;box-shadow:0px 1px 10px 0px rgba(0,72,209,0.1);border-radius:8px;"
        v-for="(item,index) in list"
        :key="index"
        v-show="determineNumber > index"
        @click="linkGoodsDetailis(item)">
        <!-- 背景图 -->
        <img :src="srcFormatting(index)" alt />
        <div class="row absolute w-full" style="left:50%transform: translate(0,-50%)">
          <!-- 图标 -->
          <div class="align pl12">
            <!-- <p
              :class="[' fs18 fw500 w38 text-center',{'color-white-important': index < 3 }]"
              style="text-shadow:0px 1px 0px rgba(249, 247, 247, 0.76);"
            >{{ index + 1 }}</p> -->
            <div class="rankingIcon" :style="`box-shadow:0px 1px 10px 0px ${shadow[index]};`">
              <div class="w-h60 absolute pos-center bg-white">
                <img :src="item.logo || defaultLogo" alt style="height: 100%;object-fit: contain;" class="w-h60" />
              </div>
            </div>
          </div>
          <!-- 文字 -->
          <div class="align mlr10 w-full hidden flex-1">
            <div class="hidden flex-1">
              <p
                :class="['color-dark-grey fs14 mb2 fw600 ellipsis',{'color-white-important': index < 3 }]"
                :style="`text-shadow:0px 1px 0px ${shadow[index]};`"
              >{{ item.title }}</p>
              <div class="row wrap">
                <span v-if="item.firstAtbValue" :class="['atb-value-item ellipsis', { 'atb-top': index <= 2 }]">{{ item.firstAtbValue }}</span>
                <span v-if="item.secondAtbValue" :class="['atb-value-item ellipsis', { 'atb-top': index <= 2 }]">{{ item.secondAtbValue }}</span>
              </div>
              <p
                :class="['color-gray fs12',{'color-white-important': index < 3 }]"
                :style="`text-shadow:0px 1px 0px ${shadow[index]};`"
              >{{ item.count }}件</p>
            </div>
            <p
              :class="['color-dark-grey fw600 fs16 pl8',{'color-white-important': index < 3 }]"
              :style="`text-shadow:0px 1px 0px ${shadow[index]};`"
              v-if="permission"
            >{{ item.number |  formattedMoneyData(2)}}</p>
          </div>
        </div>
        <img v-if="index <= 2" :src="topIcon(index)" width="38" height="16" class="absolute left0 top6" />
        <span v-else class="top-tag">{{ index + 1 }}</span>
      </div>
      <!-- 展开 -->
      <div class="w-full row center h40" @click="showAllRankingList()" v-if="list.length > 5">
        <img
          :src="require('@/assets/images/find/new_find/theme_icon_all@2x.png')"
          alt
          class="w-h18"
          style="transform: rotate(180deg)"
          v-if="isHide"
        />
        <img
          v-else
          :src="require('@/assets/images/find/new_find/theme_icon_all@2x.png')"
          class="w-h18"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "salesRankingList",
  mixins: [],
  components: {},
  props: {
    backgroundUrl: {
      // 出货额金额
      type: String,
      default: ""
    },
    list: {
      // 列表
      type: Array,
      default: []
    },
    determine: {
      // 隐藏的数值
      type: Number,
      default: 0
    },
    // 是否权限
    permission : {
      type: Boolean,
      default: false
    },
    query:{
      type:Object,
      default: false
    }
  },

  data() {
    return {
      determineNumber: 0,
      isHide: false,
      shadow: [
        "rgba(253,198,67,0.35)",
        "rgba(169,178,221,0.21)",
        "rgba(234,176,124,0.48)"
      ],
      defaultLogo: require("@/assets/images/defaultLogo.png")
    };
  },

  computed: {
    topIcon() {
      return (i) => {
        if (i === 0) return require('@/assets/images/top1.png')
        if (i === 1) return require('@/assets/images/top2.png')
        if (i === 2) return require('@/assets/images/top3.png')
      }
    }
  },

  watch: {},

  created() {},

  mounted() {
    this.determineNumber = this.determine || 5; // 默认5个
    setTimeout(() => {
      console.log('list', this.list)
    }, 2000);
  },

  destroyed() {},

  methods: {
    linkGoodsDetailis(item){
      let queryName = `${item.firstAtbKey ? (item.firstAtbKey + ':' + item.firstAtbValue) : ''}${item.secondAtbKey ? (';' + item.secondAtbKey + ':' + item.secondAtbValue) : ''}`
      var query = {
        ...this.query,
        name: `${item.title}${(queryName && queryName.length > 0) ? ('（'+ queryName + '）') : ''}`,
        code: item.skuSn,
        ratioType:'sku'
      }
      if(query.businessId == 'all'){
        query.businessId = ''
      }
      if(query.timeType ==  0){
        let year = new Date(query.time).getFullYear()
        // query.startTime = new Date(year,0,0).getTime()
        // query.endTime = new Date(year+1,0,0).getTime()
        query.year = year
      }else if(query.timeType ==  1){
        // query.startTime = new Date(query.time).getTime()
        let year = new Date(query.time).getFullYear()
        let month = new Date(query.time).getMonth()+1
        // query.endTime = new Date(year,month).getTime()
        query.year = year
        query.month = month
      }else if(query.timeType ==  2){
        // query.startTime = new Date(query.time).getTime()
        let year = new Date(query.time).getFullYear()
        let month = new Date(query.time).getMonth()
        let day = new Date(query.time).getDate() + 1
        // query.endTime = new Date(year,month,day).getTime()
        query.year = year
        query.month = month
        query.day = day
      }
      this.$router.push({ path: "/salesDataDetailsAnalysisPage", query });
    },
    numberFormatting(index) {
      return index + 1 < 10 ? `0${index + 1}` : index + 1;
    },
    srcFormatting(index) {
      if (index == 0)
        return require("@/assets/images/find/new_find/bg_top1@2x.png");
      if (index == 1)
        return require("@/assets/images/find/new_find/bg_top2@2x.png");
      if (index == 2)
        return require("@/assets/images/find/new_find/bg_top3@2x.png");
      return require("@/assets/images/find/new_find/bg_whi@2x.png");
    },
    showAllRankingList() {
      this.isHide = !this.isHide;
      if (this.isHide) {
        this.determineNumber = this.list.length;
      } else {
        this.determineNumber = this.determine || 5;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.color-white-important {
  color: white !important;
}
// 排行榜
.rankingList {
  border-radius: 10px;
  height: auto;
  transition: all 2s;
}
.rankingIcon {
  position: relative;
  object-fit: contain;
  overflow: hidden;
  width: 66px;
  height: 66px;
  background: rgba(255, 255, 255, 0.2);
}
.color-gray {
  color: #959ca7;
}
.color-dark-grey {
  color: #393c41;
}
.atb-value-item{
  color: #ffffff;
  border: 1px solid #959CA7;
  font-size: 12px;
  color: #959CA7;
  padding: 0 10px;
  border-radius: 3px;
  margin-bottom: 8px;
  &:not(:last-child){
    margin-right: 10px;
  }
  &.atb-top{
    color: #ffffff;
    border-color: #ffffff;
  }
}
.top-tag{
  background-color: #C7CBD3;
  color: #ffffff;
  font-size: 11px;
  width: 22px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  position: absolute;
  left: 0;
  top: 6px;
  border-radius: 0px 100px 100px 0px;
}
</style>
