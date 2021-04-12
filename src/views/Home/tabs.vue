<template>
  <div id="page">
    <div v-if="banner.titleImage" class="themeTop">
      <img :src="banner.titleImage" alt="">
    </div>
    <div class="themeBtm">
        <van-tabs sticky :ellipsis="false" v-model="active" @click="onTabClick" color="#3A78EF" line-width="30" line-height="3">
          <van-tab title="已合作客户">
            <van-list
              v-model="customerDIV.loading"
              :finished="customerDIV.finished"
              :finished-text="customers.length == 0?'':'没有更多了'"
              @load="CustomerOnLoad"
              :error.sync="customerDIV.error"
              error-text="请求失败，点击重新加载"
              :immediate-check="false"
            >
            <ul>
              <li @click="$router.push(`/customerdetails/${item.id}`)" v-for="(item,index) in customers" :key="index">
                <img :src="item.logo || require('@/assets/images/logo.png')" alt="">
                <div class="imgRight">
                  <div>
                    <h2 class="van-multi-ellipsis--l2">{{item.name}}</h2>
                  </div>
                  <div>
                    <span v-if="item.simpleName">{{item.simpleName}}</span>
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
            <div v-if="customers.length == 0 && customerDIV.finished" :style="!banner.titleImage?'margin-top:50%;':''">
              <emply/>
            </div>
            </van-list>
          </van-tab>
          <van-tab title="业务板块介绍">
            <div class="plr18" v-html="yewu.content"></div>
            <div v-if="!yewu.content" :style="!banner.titleImage?'margin-top:50%':''">
              <emply/>
            </div>
          </van-tab>
          <van-tab title="部门大事件">
            <ul>
              <li @click="$router.push({
                    name: 'bigThing',
                    query: {
                      id: item.id
                    }
                  })" v-for="(item,index) in bigThing" :key="index">
                <img :src="item.titleImage || require('@/assets/images/logo.png')" alt="">
                <div class="imgRight">
                  <div>
                    <h2 class="van-multi-ellipsis--l2">{{item.title}}</h2>
                  </div>
                  <div v-if="item.summary">
                    <span>{{item.summary}}</span>
                  </div>
                  <div v-if="item.pubTimestamp">
                    <p>
                      <img style="margin-right:4px;width:16px;height:16px;" :src="require('@/assets/images/home/index_icon_time@2x.png')" alt="">
                      {{formatDate(item.pubTimestamp,'Y-M-D')}}
                    </p>
                  </div>
                </div>
              </li>
            </ul>
            <div v-if="bigThing.length == 0" :style="!banner.titleImage?'margin-top:50%;':''">
              <emply/>
            </div>
          </van-tab>
          <van-tab title="销售工具">
            <div class="plr18">
              <atta-item
                      v-for="(item, index) in attalistSale"
                      :key="index"
                      :file-name="item.fileName"
                      :file-type="item.fileType"
                      :size="item.size"
                      :attaId="item.id"
                      :attaUrl="item.attaUrl"
              />
            </div>
            <div v-if="attalistSale.length == 0" :style="!banner.titleImage?'margin-top:50%;':''">
              <emply/>
            </div>
          </van-tab>
          <van-tab title="商品清单">
            <van-list
              v-model="goodsDIV.loading"
              :finished="goodsDIV.finished"
              :finished-text="goods.length == 0?'':'没有更多了'"
              @load="goodsOnLoad"
              :error.sync="goodsDIV.error"
              error-text="请求失败，点击重新加载"
              :immediate-check="false"
            >
              <van-row v-if="goods.length > 0" gutter="20">
                  <van-col class="plr14" span="24" v-for="(item, index) in goods" :key="index">
                    <goods-item
                      :name="item.skuName"
                      :title-image="item.spuImg ? `${item.spuImg + $config.imageZoom}200` : require('@/assets/images/logo.png')"
                      :msrp="item.amt"
                      :monthSales="item.qty"
                      @click.native="toGoodsDetail(item)"
                    />
                  </van-col>
                </van-row>
              <div v-if="goods.length == 0&& goodsDIV.finished" :style="!banner.titleImage?'margin-top:50%;':''">
                <emply/>
              </div>
            </van-list>
          </van-tab>
        </van-tabs>
    </div>
  </div>
</template>
<script>
import AttaItem from "@/components/AttachmentItem";
import GoodsItem from '../FindCustomer/coopList/GoodsItem.vue'
import { getBaseInfosByBusiness,getCoopGoods } from '@/api/tab'
import { getOne, selectPage as cmsSelectPage,getAttaById } from '@/api/cms'
import { formatDate } from "@/utils";
import { cmsCategoryId } from '@/config'
export default {
  components:{
    GoodsItem,
    AttaItem
  },
  name: 'tabs',
  data() {
    return {
      banner:{},
      customerPageIndex:1,
      goodsPageIndex:1,
      customerDIV:{
        error:false,
        finished:false,
        loading:false,
      },
      goodsDIV:{
        error:false,
        finished:false,
        loading:false,
      },
      goods:[],
      customers:[],
      detail:{},
      channelListPage:[],
      active:0,
      channelList:[],
      titleImg:'theme_img_com@2x.png',
      params:{},
      code:'',
      attalistSale:[],
      yewu:{},
      bigThing:[],
      id:'',
      relaId: '',
    }
  },
  computed: {},
  async created() {
    // this.$store.commit('SHOW_LOADING','加载中')
    let query = this.$lodash.cloneDeep(this.$route.query);
    this.code = query.code
    this.id = query.id
    this.relaId = query.relaId

    document.title = query.name
  },
  mounted(){
    this.getBanner()
    this.getCustomer()
    this.getGoodsList()
    this.getCmsDetailSale()
    this.getCmsDetailYeWu()
    this.getCmsDetailBigThing()
  },
  methods: {
    formatDate,
    toGoodsDetail(item){
      let goods = this.$config.otherAppLogin['goods']
      window.open(`${goods}&jump=/productDetail?spuId=${item.spuId}`, '_blank')
    },
    goodsOnLoad(){
      if (this.goodsDIV.finished) {
        console.log('加载完成');
        return
      }
      if(this.active == 4){
        this.getGoodsList('loadMore')
      }
    },
    CustomerOnLoad() {
      if (this.customerDIV.finished) {
        console.log('加载完成');
        return
      }
      if(this.active == 0){
        this.getCustomer('loadMore')
      }
    },
    getCustomer(loadMore){
      this.customerDIV.loading = true
      console.log(loadMore?'加载更多':'初始化');
      console.log(new Date().getMonth()+1)
      let params = {
        pageIndex:loadMore?this.customerPageIndex+=1:this.customerPageIndex,
        pageSize:10,
        // year:new Date().getFullYear(),
        // month:new Date().getMonth()+1,
        // year:"2020",
        // month:"6",
      }
      
      if(this.relaId){
        params['relaId'] = this.relaId
      }else{
        params['id'] = this.id
      }

      getBaseInfosByBusiness(params).then(res=>{
        if(loadMore){
          this.customers =this.customers.concat(res.records)
        }else{
          this.customers = res.records
        }
        this.customerDIV.finished = res.pages === 0 || res.pages === this.customerPageIndex
        // if(){
        //   this.finished-text=""
        // }
      }).catch(err=>{
        this.customerDIV.error = true
      }).finally(() => {
        this.customerDIV.loading = false
      })
    },
    getGoodsList(loadMore){
      console.log(loadMore?'加载更多':'初始化');
      this.goodsDIV.loading = true
      let params = {
        pageIndex:loadMore?this.goodsPageIndex+=1:this.goodsPageIndex,
        pageSize:10,
        // year:new Date().getFullYear(),
        // month:new Date().getMonth()+1,
      }

      if(this.relaId){
        params['relaId'] = this.relaId
      }else{
        params['id'] = this.id
      }

      getCoopGoods(params).then(res=>{
        if(loadMore){
          this.goods =this.goods.concat(res.records)
        }else{
          this.goods = res.records
        }
        this.goodsDIV.finished = res.pages === 0 || res.pages === this.goodsPageIndex
      }).catch(err=>{
        this.goodsDIV.error = true
      }).finally(() => {
        this.goodsDIV.loading = false
      })
    },
    getCmsDetailSale(){
      return new Promise((resolve, reject) => {
        cmsSelectPage({
          pageSize: 10,
          infoCategoryId: this.code,
          status: '1',
          title:'销售工具',
          orderStr: 'pubTimestamp desc, createTimestamp desc'
        }).then(res => {
          let detail = res.records[0] || {}
          if(detail.id){
            getAttaById(detail.id).then(res_ => {
              this.attalistSale = res_ || []
            })
          }
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    getBanner(){
      return new Promise((resolve, reject) => {
        cmsSelectPage({
          pageSize: 10,
          infoCategoryId: this.code,
          status: '1',
          title:'banner图',
          orderStr: 'pubTimestamp desc, createTimestamp desc'
        }).then(res => {
          this.banner = res.records[0] || {}
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    getCmsDetailYeWu(){
      return new Promise((resolve, reject) => {
        cmsSelectPage({
          pageSize: 10,
          infoCategoryId: this.code,
          status: '1',
          title:'业务板块介绍',
          orderStr: 'pubTimestamp desc, createTimestamp desc'
        }).then(res => {
          this.yewu = res.records[0] || {}
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    getCmsDetailBigThing(){
      return new Promise((resolve, reject) => {
        // 这里搜索资讯要用副标题subhead，因为部门大事件要显示title在页面
        cmsSelectPage({
          pageSize: 10,
          infoCategoryId: this.code,
          status: '1',
          subhead:'部门大事件',
          orderStr: 'pubTimestamp desc, createTimestamp desc'
        }).then(res => {
          this.bigThing = res.records
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    getBaseInfo(){ //根据id获取合作的客户
      return new Promise((resolve, reject) => {
        let params = {
          pageSize: 10,
          pageIndex: 1,
          infoCategoryId: this.code == '新零售'?cmsCategoryId.newSale:this.code == '大客户'?cmsCategoryId.bigCustomer:this.code == '美妆ODM'?cmsCategoryId.beautyODM:this.code == '传统电商'?cmsCategoryId.supplier:'',
          status: '1',
          title:this.code,
          orderStr: 'pubTimestamp desc, createTimestamp desc'
        }
        // cmsSelectPage(params).then(res => {
        //   this.detail = res.records[0] || {}
        //   resolve(res)
        // }).catch(error => {
        //   reject(error)
        // })
      })
    },
    onTabClick(name) {
      // this.$store.commit('SHOW_LOADING','加载中')
      // this.$emit('input', this.value)
      // this.$emit('change', this.value)
    },
  },
  destroyed() {
    this.$toast.clear();
  }
}
</script>

<style lang="scss" scoped>
#page {
  height: 100vh;
  background: #f3f4f9;
  overflow-y: scroll;
}
.themeTop{
  text-align: center;
  background-color: #fff;
  margin-bottom: 14px;
  padding: 18px;
  >img{
    border-radius:10px;
  }
}
.themeBtm{
  min-height: 100%;
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
  >p{
    padding:17px 0;
    color:#C7CBD3;
    font-size: 12px;
    text-align: center;
  }
  ul{
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
        object-fit: contain;
      }
      >.imgRight{
        font-size: 12px;
        padding-left: 11px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        div{
          // flex: 1;
        }
        h2{
          color:#393C41;
          font-size: 16px;
          margin:6px 0;
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
    // border: 0 ;
}
/deep/ .van-tab{
  color:#909399;
  margin:0 16px;
}
/deep/ .van-tab--active{
  color:#303133;
  font-weight: bold;
}
/deep/ .van-tabs--line .van-tabs__wrap {
    height: 48px;
}
/deep/ .van-tab__pane, .van-tab__pane-wrapper {
    padding-top: 14px;
}
</style>
