<template>
    <div style="margin-bottom:6%" class="relative">
      <img :src="backgroundUrl" alt="">
      <div class="absolute fs14 row center-y mr2" style="top:78px;right:18px;color: #EC5624;" v-if="jump" @click="goTo(jump)">
        <span>更多</span>
        <img :src="kfIcon" class="w-h12" alt="">
      </div>
      <div :class="[ 'wpct92 mauto bg-white relative rankingList',{'mt0':!backgroundUrl}]"  >
        <!-- 列表 -->
        <div 
          :class="['row h90 ',{'border-bottom1':determineNumber != index+1}]"
          v-for="(item,index) in list" :key="index"  style="align-items:center"
          v-show="determineNumber > index"
          @click="linkSalesDetails(item)"
        >
          <!-- 图标 -->
          <div class="relative w-h62 rankingIcon" >
            <img :src="item.logo || defaultLogo" alt="" class="absolute pos-center">
            <div class="absolute w-h22" style="left:0;top:0">
              <img :src="srcFormatting(index)" alt="" class="absolute"> 
              <span     class="absolute fs12 color-white fw500"
          style="left:3px;top:2px">{{ numberFormatting(index) }}</span>
            </div>
          </div>
          <!-- 文字 -->
          <div class="align ml10 w-full hidden flex-1">
            <div class="hidden flex-1">
              <p class="color-dark-grey fs14 mb10 fw600 ellipsis" >{{ item.title }}</p>
              <p class="color-gray fs12">{{ item.count }}件</p>
            </div>
            <p class="color-dark-grey fw600 fs16" v-if=" item.number">{{ `${formattedMoneyData(item.number, 2)}万` }}</p>
          </div>
        </div>
            <!-- 展开 -->
          <div class="w-full row center h40" @click="showAllRankingList()" v-if="list.length > 5">
              <img :src="require('@/assets/images/find/new_find/theme_icon_all@2x.png')" alt="" class="w-h18" style="transform: rotate(180deg)" v-if="isHide">
              <img :src="require('@/assets/images/find/new_find/theme_icon_all@2x.png')" alt="" class="w-h18" v-else >
          </div>
      </div>
    </div>
</template>

<script>
import { deepClone, formattedMoneyData } from "@/utils";

export default {
  // 客户销售额
  name: 'rankingList',

  mixins: [],

  components: {},

  props: {
    backgroundUrl: { // 出货额金额
        type: String,
       default: ''
    },
    list: { // 列表
        type: Array,
        default: []
    },
    determine: { // 隐藏的数值
        type: Number,
        default: 0
    },
    jump: { // 跳转链接
      type: String,
      default: ''
    }
  },

  data() {
    return {
        determineNumber: 0 ,
        isHide:false,
        defaultLogo: require("@/assets/images/defaultLogo.png"),
        kfIcon: require("@/assets/images/customer/kf_icon_go@2x.png")
    }
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {
    this.determineNumber = this.determine || 5 // 默认5个
  },

  destroyed() {},

  methods: {
    formattedMoneyData,
    numberFormatting(index){
        return (index+1) < 10 ? `0${index+1}` : index+1 
    },
    srcFormatting(index){
        if(index == 0) return require('@/assets/images/find/new_find/client_tag_top1@2x.png')
        if(index == 1) return require('@/assets/images/find/new_find/client_tag_top2@2x.png')
        if(index == 2) return require('@/assets/images/find/new_find/client_tag_top3@2x.png')
        return require('@/assets/images/find/new_find/client_tag@2x.png')
    },
    showAllRankingList(){
        this.isHide = !this.isHide;
        if(this.isHide){
            this.determineNumber = this.list.length
        }else{
            this.determineNumber = this.determine || 5
        }
    },
    // 跳转详情
    linkSalesDetails(item){ 
      this.$emit('link',item,1)
    },
    goTo(url){
      this.$router.push({
        path: url
      })
    }
  },
};
</script>

<style lang="scss" scoped>
// 排行榜
.rankingList{
  margin-top:-34%;
  padding: 5% 4% 0 4%; 
  box-shadow:0px 1px 10px 0px rgba(0,72,209,0.1);
  border-radius:10px;
  height: auto;
  transition: all 2s;
} 
.rankingIcon{
  object-fit: contain;
  border-radius:8px;
  overflow: hidden;
  border:1px solid #f7f2f2
}
.color-gray{
  color: #959CA7 ; 
}
.color-dark-grey{
  color: #393C41;
}
.border-bottom1{
  border-bottom: 1px solid rgba(242,244,249,1);;
}
</style>
