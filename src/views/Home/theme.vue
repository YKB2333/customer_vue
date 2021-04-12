<template>
  <div id="page">
    <div class="themeTop">
      <img :src="detail.titleImage || require('@/assets/images/home/theme/'+titleImg)" alt="">
      <div v-if="detail.content">
        <img width="30" height="26" :src="require('@/assets/images/home/theme/theme_img_sy@2x.png')" alt="">
        <p ref="content" v-html="detail.content"></p>
        <div>
          <img v-if="showIcon" :style="islc6?'':' transform: rotate(180deg);'" @click="showLc5" width="20" height="20" :src="require('@/assets/images/home/theme/theme_icon_all@2x.png')" alt="">
        </div>
      </div>
    </div>
    <div class="themeBtm">
      <div class="themeTitle">
        <img :src="require('@/assets/images/home/theme/theme_title@2x.png')" alt="">
      </div>
      <div class="filters">
        <van-dropdown-menu  class="filterLeft">
          <van-dropdown-item @change="changeSelect" v-model="value" :options="channelList" />
        </van-dropdown-menu>
        <van-tabs v-model="active" class="filterRight" @click="onTabClick" :border="false" line-height="0">
          <van-tab title="出货额" name="priceOrder">
            <span slot="title">
                出货额
              <img v-if="priceOrder === 0" :src="require('@/assets/images/home/theme/order.png')" width="10">
              <img v-if="priceOrder === 1" :src="require('@/assets/images/home/theme/order-asc.png')" width="10">
              <img v-if="priceOrder === 2" :src="require('@/assets/images/home/theme/order-desc.png')" width="10">
            </span>
          </van-tab>
          <van-tab name="numOrder">
            <span slot="title">
                出货量
              <img v-if="numOrder === 0" :src="require('@/assets/images/home/theme/order.png')" width="10">
              <img v-if="numOrder === 1" :src="require('@/assets/images/home/theme/order-asc.png')" width="10">
              <img v-if="numOrder === 2" :src="require('@/assets/images/home/theme/order-desc.png')" width="10">
            </span>
          </van-tab>
        </van-tabs>
      </div>
      <p v-if="channelListPage.length>0">
        *默认月度出货额倒序排序，每天更新前一天
      </p>
      <ul v-if="channelListPage.length>0">
        <li @click="$router.push(`/customerdetails/${item.id+''}`)" v-for="(item,index) in channelListPage" :key="index">
          <img :src="item.logo || require('@/assets/images/logo.png')" alt="">
          <div class="imgRight">
            <div>
              <h2 class="van-multi-ellipsis--l2">{{item.name}}</h2>
            </div>
            <div>
              <span v-if="item.channel">{{item.channel}}</span>
            </div>
            <div>
              <p v-if="item.innerPersonInfos.length>0">
                <img style="margin-right:4px;width:16px;height:16px;" :src="require('@/assets/images/home/theme/retail_icon_per@2x.png')" alt="">
                {{item.innerPersonInfos[0].fullName}} {{item.innerPersonInfos[0].tel}}
              </p>
            </div>
          </div>
        </li>
      </ul>
      <emply v-else />
    </div>
  </div>
</template>
<script>
import { getBaseInfosByChannelTag, getChannelListByChannelTag } from '@/api/theme'
import { getOne, selectPage as cmsSelectPage } from '@/api/cms'
import { cmsCategoryId } from '@/config'
export default {
  name: 'theme',
  data() {
    return {
      detail:{},
      channelListPage:[],
      active:0,
      channelList:[],
      titleImg:'theme_img_com@2x.png',
      numOrder:0,
      params:{},
      priceOrder:2,
      islc6:true,
      showIcon:true,
      value: 0,
      height:0,
    }
  },
  computed: {},
  async created() {
    // this.$store.commit('SHOW_LOADING','加载中')
    let query = this.$lodash.cloneDeep(this.$route.query);
    this.titleImg = query.tag == '跨境客户'?'theme_img_abr@2x.png':query.tag == '一件代发客户'?'theme_img_exp@2x.png':'theme_img_com@2x.png'
    this.params = {
      year:new Date().getFullYear(),
      month:new Date().getMonth()+1,
      day:new Date().getDate(),
      tag:query.tag,
      sortFiled:'amts',
      sortOrder:'desc',
    }
    this.getChannel()
    this.getDetail()
    this.getBaseInfosByChannelTag()
  },
  mounted(){

  },
  methods: {
    getDetail(){
      return new Promise((resolve, reject) => {
        cmsSelectPage({
          pageIndex: this.pageIndex++,
          pageSize: 10,
          infoCategoryId: cmsCategoryId.theme,
          status: '1',
          title:this.$route.query.tag,
          orderStr: 'pubTimestamp desc, createTimestamp desc'
        }).then(res => {
          this.detail = res.records[0] || {}
          this.$nextTick(()=>{
            this.height = this.$refs.content.offsetHeight>168?'168px':(this.$refs.content.offsetHeight+'px')||'auto'
            this.$refs.content.style.height = this.height
            this.showIcon = this.height == '168px'?true:false
          })
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    getBaseInfosByChannelTag(){
      return new Promise((resolve, reject) => {
        this.$store.commit('SHOW_LOADING','加载中')
        console.log(this.params)
        getBaseInfosByChannelTag(this.params).then(res=>{
          this.channelListPage = res
          resolve(res)
        }).catch(error => {
          reject(error)
        }).finally(()=>{
          this.$store.commit('SHOW_LOADING',false)
        })
      })
    },
    getChannel(){
      return new Promise((resolve, reject) => {
        this.channelList.push({ text: '全部', value: 0 });
        getChannelListByChannelTag(this.params).then(res => {
          res.forEach(e => {
            this.channelList.push({ text: e.name, value: e.code });
          })
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    changeSelect(value){
      this.params.channelTypeCode = value==0?'':value
      this.getBaseInfosByChannelTag()
    },
    onTabClick(name) {
      this.$store.commit('SHOW_LOADING','加载中')
      if (name === 'priceOrder') {
        this.numOrder = 0
        // 第一次点击升序，再次点击变为降序
        if (this.priceOrder == 0) {
          // 升序
          this.priceOrder = 2
          this.params.sortOrder = 'desc'
        } else if (this.priceOrder == 2) {
          // 降序
          this.priceOrder = 1
          this.params.sortOrder = 'asc'
        } else if (this.priceOrder == 1) {
          // 升序
          this.priceOrder = 2
          this.params.sortOrder = 'desc'
        }
        this.params.sortFiled = 'amts'
        this.getBaseInfosByChannelTag()
      }
      if (name === 'numOrder') {
        this.priceOrder = 0
        // 第一次点击升序，再次点击变为降序
        if (this.numOrder == 0) {
          // 升序
          this.numOrder = 2
          this.params.sortOrder = 'desc'
        } else if (this.numOrder == 2) {
          // 降序
          this.numOrder = 1
          this.params.sortOrder = 'asc'
        } else if (this.numOrder == 1) {
          // 升序
          this.numOrder = 2
          this.params.sortOrder = 'desc'
        }
        this.params.sortFiled = 'nums'
        this.getBaseInfosByChannelTag()
      }
      // this.$emit('input', this.value)
      // this.$emit('change', this.value)
    },
    showLc5(){
      this.islc6 = !this.islc6
      if(this.islc6){
        this.$refs.content.style.height = '168px'
      }else{
        this.$refs.content.style.height = 'auto'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#page {
  height: 100vh;
  background: white;
  overflow-y: scroll;
}
.themeTop{
  background-color: #fff;
  border-bottom: 14px solid #f3f4f9;
  >div{
    padding:16px 18px;
    >p{
      margin-top: 10px;
      overflow : hidden;
      line-height:28px;
      font-size: 16px;
      // color:rgba(57,60,65,1);
      // text-overflow: ellipsis;
      // display: -webkit-box;
      // -webkit-line-clamp: 5;
      // -webkit-box-orient: vertical;
      /deep/ p{
        line-height:28px;
        font-size: 16px;
        color:#393C41 !important;
      }
      /deep/ span{
        line-height:28px;
        font-size: 16px;
        color:#393C41 !important;
      }
    }
    >div{
      text-align: center;
      margin-top: 17px;
    }
  }
}
.themeBtm{
  background-color: #fff;
  padding-bottom: 14px;
  .themeTitle{
    // padding:20px 117px;
    text-align: center;
    padding:20px 0;
    border-bottom: 1px solid #F5F6F9;
    img{
      width:142px;
      height:17px;
    }
  }
  .filters{
    display: flex;
    border-bottom:1px solid #F5F6F9;
    .filterLeft{
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
      // min-width:0;
      flex:1;
      /deep/ .van-dropdown-menu__title{
        color:#393C41;
      }
      /deep/ .van-dropdown-menu__title::after {
        right: 1px;
        // left:2px;
        margin-top: -2px;
        border: 2px solid;
        border-color: transparent transparent #959CA7 #959CA7;
        opacity: 1;
      }
    }
    .filterRight{
      flex:2;
      /deep/ .van-tab{
        font-size: 15px;
        color:#909399;
      }
      /deep/ .van-tab--active{
        color:#393C41;
      }
      /deep/ .van-tabs__nav--line {
          padding-bottom: 15px;
          padding-top: 3px;
      }
    }
  }
  >p{
    padding:17px 0;
    color:#C7CBD3;
    font-size: 12px;
    text-align: center;
  }
  >ul{
    padding:0 18px;
    li{
      box-shadow:0px 2px 11px 0px rgba(159,190,240,0.16);
      border-radius:8px;
      display: flex;
      padding:19px 16px;
      padding-right: 20px;
      margin-bottom: 15px;
      img{
        width: 102px;
        height: 102px;
      }
      >.imgRight{
        font-size: 12px;
        padding-left: 11px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        div{
          flex: 1;
        }
        h2{
          color:#393C41;
          font-size: 16px;
          margin:11px 0;
          // overflow:hidden;
          // text-overflow:ellipsis;
          // white-space:nowrap;
        }
        span{
          color: #FF9A37;
          display: inline-block;
          padding:4px;
          background:rgba(239,146,54,0.1);
          border-radius:4px;
          margin: 0px 4px 4px 0;
        }
        p{
          color:rgb(149, 156, 167);
          margin-top: 10px;
          display: flex;
          align-items: center;
        }
      }
    }
  }
}
/deep/ [class*=van-hairline]::after {
    border: 0 ;
}
</style>
