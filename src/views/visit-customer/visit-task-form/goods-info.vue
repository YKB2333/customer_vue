<template>
  <div class="h-full hidden">
    <div class="h-full col" v-if="pageType === 'todo'">
      <div class="mt10 van-hairline--bottom" style="margin-bottom:1px;">
        <van-search 
          v-model="search.name" 
          placeholder="请输入搜索内容" 
          shape="round"
          :show-action="search.name ? true : false"
          @search="onSearchGoods"
          @cancel="onCancel"
        />
      </div>
      <div class="row flex-1 hidden">
        <div style="background-color: #F5F6F9;" class="h-full y-scroll">
          <van-sidebar v-model="activeKey">
            <van-sidebar-item v-for="item in categorys" :key="item" :title="item" />
          </van-sidebar>
        </div>
        <div class="flex-1 bg-white" style="overflow-x: hidden;">
          <div v-for="item in getBrands" :key="item">
            <title-bar :title="item" border>
              <div slot="left" @click="collapse(item)">
                <span class="fs12 gray-text pr2">{{ collapseIds.includes(item) ? '折叠' : '全部' }}</span>
                <img :src="require('@/assets/images/task_icon_un.png')" class="w-h12" :class="{ 'rotate180': collapseIds.includes(item) }" />
              </div>
            </title-bar>
            <goods-item 
              v-for="goods in getGoods(item)"
              :key="goods.skuId"
              :sku="goods"
              :active="completeTaskSkuIds.includes(goods.skuId)"
              @click.native="toGoodsForm(goods)"
            />
          </div>
          <p v-if="showNullData" class="text-center mt10 fs14">搜索结果为空</p>
        </div>
      </div>
    </div>
    <div v-else class="h-full y-scroll ptb10">
      <div class="plr14 bg-white">
        <goods-item 
          v-for="goods in finishedGoodsList"
          :key="goods.skuId"
          :sku="goods"
          show-stock
          ellipsis="ellipsis2"
          @click.native="toGoodsForm(goods)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import TitleBar from '../components/title-bar'
import GoodsItem from '../components/goods-item'
import { searchGoods } from '@/api/visit-task'
import { mapGetters } from 'vuex'

export default {
  components: { TitleBar, GoodsItem },
  props: {
    pageType: String,
    taskId: {
      type: String,
      required: true
    },
    finishedGoodsList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      activeKey: 0,
      search: {
        name: '',
        taskId: this.taskId,
      },
      categorys: [], // 一级分类
      brands: [], // 二级分类
      skus: [], // 商品
      collapseIds: [],
      showNullData: false
    }
  },
  computed: {
    ...mapGetters(['completeTaskSkuIds']),
    getBrands() {
      let arr = []
      let p = this.categorys[this.activeKey]
      if (p) {          
        let skus =  this.skus.filter(e => e.categoryName === p)
        this.brands.filter(b => {
           skus.forEach(sku => { 
             if(sku.brandName === b)
              if(arr.indexOf(b) == -1){
                 arr.push(b) 
              }
             })
        })
      }
      return arr
    },
    getGoods() {
      return (cate) => {
        let arr = []
        arr = this.skus.filter(e => e.brandName === cate)
        if (!this.collapseIds.includes(cate)) {
          arr = arr.splice(0, 2)
        }
        return arr
      }
    }
  },
  watch: {
    finishedGoodsList: {
      handler: function(arr) {
        let ids = []
        arr.forEach(e => {
          if (e.skuId) ids.push(e.skuId.toString())
        })
        // console.log('ids', ids)
        this.$store.commit('SAVE_COMPLETE_TASK_SKU', { type: 'init', skuId: ids })
      },
      immediate: true
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      searchGoods(this.search).then(res => {
        // console.log('搜索', res)
        this.categorys = res.categorys || []
        this.brands = res.brands || []
        this.skus = res.skus || []
        this.showNullData = this.skus.length === 0 ? true : false
        console.log(this.showNullData)
      })
    },
    collapse(cateId) {
      let i = this.collapseIds.findIndex(id => cateId)
      if (i >= 0) {
        this.collapseIds.splice(i, 1)
      } else {
        this.collapseIds.push(cateId)
      }
    },
    toGoodsForm(sku) {
      // console.log(sku)
      this.$router.push({ 
        path: '/goods-inventory',
        query: {
          taskId: this.taskId,
          type: this.pageType === 'todo' ? 'edit' : 'preview',
          sku: JSON.stringify(sku)
        }
      })
    },
    onSearchGoods() {
      this.init()
    },
    onCancel() {
      this.init()
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .van-sidebar{
  width: 100px;
}
/deep/ .van-sidebar-item--select::before{
  background-color: #3d93ff;
  border-radius: 8px;
  height: 22px;
}
.rotate180{
  transform: rotate(180deg);
}
</style>