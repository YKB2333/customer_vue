<template>
  <div>
    <van-sticky>
      <!-- :orderTabs="orderTabs" -->
      <goods-order
        ref="goodsOrder"
        v-model="orderObj"
        :brandList="brandList"
        :categoryList="filterCateList"
        :showBrandCategory="showBrandCategory"
        :showBrand="showBrand"
        :showCategory="showCategory"
        @change="onTabsChange"
        @confirm="onFilterConfirm"
        @reset="onFilterReset"
      />
    </van-sticky>
    <!-- 列表 -->
    <div class="goods-list pt14 plr14 bg-white" id="goods-list">
      <van-list
        v-model="vanList.loading"
        :immediate-check="false"
        :finished="vanList.finished"
        :error.sync="vanList.error"
        :finished-text="vanList.finishedText"
        error-text="请求失败，点击重新加载"
        @load="onLoadMore">
          <van-row>
            <van-col style="width:100%;" :span="colSpan" v-for="(item, index) in goodsList" :key="index">
              <goods-item
                :name="item.name"
                :title-image="item.titleImage ? `${item.titleImage + $config.imageZoom}200` : require('@/assets/images/logo.png')"
                :msrp="item.monthAmt"
                :monthSales="item.monthSales"
                @click.native="toGoodsDetail(item)"
              />
            </van-col>
          </van-row>
      </van-list>
    </div>
  </div>
</template>

<script>
import GoodsItem from './GoodsItem'
import GoodsOrder from './GoodsOrder'
import { spuSearch, spuSearch4Condition } from '@/api/spu'

export default {
  name: 'GoodsList',
  components: { GoodsItem, GoodsOrder },
  props: {

  },
  data() {
    return {
      goodsList: [],
      query: {
        pageIndex: 1,
        pageSize: 14,
        tag: [],
        keyword: '',
        cateOne: '',
        cateTwo: '',
        cateThree: '',
        lowerMonthSales: '',
        higherMonthSales: '',
        brandCategorys: [],
        brandIds: []
      },
      searchVal: '', // 搜索值
      vanList: {
        loading: false,
        finished: false,
        finishedText: '',
        error: false,
        myError: false
      },
      orderObj: { // 排序
        orderProperty: 'monthAmt', // 排序属性
        orderType: 1, // 1降序；2升序；
      },
      // 默认排序
      brandList: [],
      filterCateList: [],
      inited: false,
      runSearch4Condiiton: false,
      showBrandCategory: true, // 显示商品服务类型筛选
      showBrand: true,  // 显示品牌筛选
      showCategory: true,  // 显示品类筛选
      // stockList: []
    }
  },
  computed: {
    colSpan() {
      if (this.goodsItemType === '1') {
        return '12'
      }
      if (this.goodsItemType === '2') {
        return '24'
      }
    }
  },
  created() {
    if (this.$route.query.brandIds) { // 日本专区
      console.log(this.$route.query.brandIds,'日本');
      this.query.brandIds=this. $route.query.brandIds
    }
    if (this.$route.query.tag) { // 商品标签
      let tagList = this.$route.query.tag.split('|').filter(item => item)
      this.query.tag = tagList
    }
    if (this.$route.query.isCrossBorderTrade) { // 跨境贸易
      this.query['isCrossBorderTrade'] = Boolean(this.$route.query.isCrossBorderTrade)
      this.$nextTick(() => {
        this.$refs['goodsOrder'].setFilter4Parent('isCrossBorderTrade', Boolean(this.$route.query.isCrossBorderTrade))
      })
    }
    if (this.$route.query.isGeneralTrade) { // 一般贸易
      this.query['isGeneralTrade'] = Boolean(this.$route.query.isGeneralTrade)
      this.$nextTick(() => {
        this.$refs['goodsOrder'].setFilter4Parent('isGeneralTrade', Boolean(this.$route.query.isGeneralTrade))
      })
    }
    if (this.$route.query.workStatus) { // 清货
      this.query['workStatus'] = this.$route.query.workStatus
      this.$nextTick(() => {
        this.$refs['goodsOrder'].setFilter4Parent('workStatus', this.$route.query.workStatus)
      })
    }
    if (this.$route.query.cateOne) { // 一级分类ID
      this.query['cateOne'] = this.$route.query.cateOne
      // this.showCategory = false
    }
    if (this.$route.query.cateTwo) { // 二级分类ID
      this.query['cateTwo'] = this.$route.query.cateTwo
      // this.showCategory = false
    }
    if (this.$route.query.cateThree) { // 三级分类ID
      this.query['cateThree'] = this.$route.query.cateThree
      // this.showCategory = false
    }
    if (this.$route.query.brandCategory) { // 商品服务类型
      this.query['brandCategorys'].push(this.$route.query.brandCategory)
      this.showBrandCategory = false
    }
    if (this.$route.query.searchVal) { // 搜索参数
      this.searchVal = this.$route.query.searchVal
    }
    if (this.$route.query.brandId) { // 品牌ID
      this.query['brandIds'].push(this.$route.query.brandId)
      this.showBrand = false
    }
    this.init()
  },
  methods: {
    init() {
      this.search4Condiiton()
      this.runSearch4Condiiton = true
      this.fetchGoodsList()
    },
    onLoadMore() {
        if (this.vanList.finished || !this.inited) return
        this.runSearch4Condiiton = false
        if (!this.vanList.myError) {
          this.query['pageIndex'] += 1
        }
        this.fetchGoodsList('loadMore')
    },
    fetchGoodsList(loadMore) {
      if(!loadMore){
        this.vanList.loading = true
        this.vanList.finished = false
      }
      return new Promise((resolve, reject) => {
        // console.log(this.orderObj, this.query)
        let params = {}
        console.log("query",this.query)
        Object.assign(params, this.orderObj, this.query) // 将两个对象合并到params对象上
        params['keyword'] = this.searchVal
        console.log('列表请求参数=>', params)
        spuSearch(params,this.$route.query.id)
          .then(async res => {
            console.log('产品列表', res.list)
            let isFinish = res.pages === 0|| res.pages === res.pageIndex // 是否还有下一页
            // console.log('isFinish', isFinish)
            this.vanList.finished = isFinish
            if (!loadMore) {
              console.log('init')
              this.goodsList = []
              // this.stockList = []
              // document.getElementById('app').scrollTop = 0
              this.goodsList = res.list
              if (isFinish && res.list.length > 0) {
                this.vanList.finishedText = '已经到底啦'
              } else {
                this.vanList.finishedText = '暂无数据'
              }
            }
            console.log(loadMore);
            
            if (loadMore) {
              this.goodsList = this.goodsList.concat(res.list)
              if (isFinish) {
                this.vanList.finishedText = '已经到底啦'
              }
            }
            // this.stockList = []
            // for(let i = 0; i < res.list.length; i++) {
            //   // let stockDatas = await this.fetchStockData(res.list[i].id)
            //   this.fetchStockData(res.list[i].id).then(stockDatas => {
            //     let itemObj = {}
            //     let total = 0
            //     stockDatas.forEach(item => {
            //       total += item.validityStock
            //     })
            //     itemObj['validityStock'] = total
            //     itemObj['spuId'] = res.list[i].id
            //     this.stockList.push(itemObj)
            //   })
            //   console.log('stockList', this.stockList)
            // }
            this.vanList.error = false
            this.vanList.myError = false
            resolve(res.list)
          }).catch(error => {
            console.log(error)
            this.vanList.myError = true
            this.vanList.error = true
          }).finally(() => {
            this.inited = true
            this.vanList.loading = false
          })
      })
    },
    search4Condiiton() {
      spuSearch4Condition(this.query)
        .then(res => {
          // console.log('search4Condiiton=>', res)
          this.brandList = res.brandList
          this.filterCateList = res.categoryList
        })
    },
    // 根据spuid获取库存数据
    // fetchStockData(spuId) {
    //   return new Promise((resolve, reject) => {
    //     getStockData(spuId).then(res => {
    //       // console.log('库存数据', res)
    //       resolve(res)
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },
    // getStockWithSpuId(spuId) {
    //   let value = '加载中...'
    //   // console.log(spuId, this.stockList)
    //   this.stockList.every(item => {
    //     if(item.spuId === 1258) {
    //       console.log(item.validityStock)
    //     }
    //     if (item.spuId === spuId) {
    //       value = item.validityStock
    //       return false
    //     } else {
    //       return true
    //     }
    //   })
    //   // console.log(value)
    //   return value
    // },
    toGoodsDetail(item) {
      // console.log(item)
      // this.$router.push({
      //   path: '/productDetail',
      //   query: {
      //     spuId: item.id
      //   }
      // })
      let goods = this.$config.otherAppLogin['goods']
      window.open(`${goods}&jump=/productDetail?spuId=${item.id}`, '_blank')
    },
    onTabsChange() {
      this.goodsList = []
      this.resetQuery()
      this.fetchGoodsList()
    },
    onSearch() {
      this.runSearch4Condiiton = true
      this.resetQuery()
      this.fetchGoodsList()
    },
    onCancelSearch() {
      this.runSearch4Condiiton = true
      this.resetQuery()
      this.fetchGoodsList()
    },
    onFilterConfirm(data) {
      this.goodsList = []
      this.runSearch4Condiiton = true
      console.log('确认', data)
      this.setFilterData(data)
      this.resetQuery()
      this.fetchGoodsList()
    },
    onFilterReset(data) {
      this.goodsList = []
      this.runSearch4Condiiton = true
      console.log('重置', data)
      this.setFilterData(data)
      this.resetQuery()
      this.fetchGoodsList()
    },
    setFilterData(data) {
      this.query['lowerMonthSales'] = data['lowerMonthSales']
      this.query['higherMonthSales'] = data['higherMonthSales']
      if (data['isGeneralTrade']) {
        this.query['isGeneralTrade'] = true
      } else {
        delete this.query['isGeneralTrade']
      }
      if (data['isCrossBorderTrade']) {
        this.query['isCrossBorderTrade'] = true
      } else {
        delete this.query['isCrossBorderTrade']
      }
      this.query['workStatus'] = data['workStatus']
      this.query['brandCategorys'] = data['brandCategorys']
      if(this.$route.query.brandCategory){
        this.query['brandCategorys'].push(this.$route.query.brandCategory)
      }
      if (this.showBrand) {
        this.query['brandIds'] = data['brandIds']
      }
      if (this.showCategory) {
        this.query['cateOne'] = data['cateOne']
      }
    },
    resetQuery() {
      this.query['pageIndex'] = 1
      this.vanList.error = false
      this.vanList.myError = false
    },
    // 父组件搜索时调用
    setSearchVal(searchVal) {
      this.runSearch4Condiiton = true
      this.searchVal = searchVal
      this.resetQuery()
      this.fetchGoodsList()
      this.query.keyword = searchVal
      if(this.$route.query && this.$route.query.brandCategory){
        this.query['showBrandCategorys'] = true
      }
      this.$router.push({name:'productListSearch', query: this.query})
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
