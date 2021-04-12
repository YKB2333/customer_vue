<template>
  <div class="container">
    <div class="selector-wapper" @click="showTypePopup = true">
      <span class="text">{{ currentType.text }}</span>
      <div :class="{active: showTypePopup}" class="text-icon"></div>
    </div>
    <div v-show="isShowSecond" class="selector-wapper" @click="showSencondPopup = true">
      <span class="text">{{ currentItem.text }}</span>
      <div :class="{active: showSencondPopup}" class="text-icon"></div>
    </div>
    <!--  目标类型 -->
    <van-popup
      v-model="showTypePopup"
      position="bottom"
      :get-container="getContainer"
      safe-area-inset-bottom
    >
      <van-picker
        :title="currentType.text"
        :columns="typeList"
        @change="onTypeChange"
        :default-index="typeList.indexOf(currentType)"
      />
      <van-button size="large" type="info" @click="onComfirm">确认</van-button>
    </van-popup>
    <!--  二级筛选 -->
    <van-popup
      v-model="showSencondPopup"
      position="bottom"
      :get-container="getContainer"
      safe-area-inset-bottom
    >
      <van-search
        v-model="searchValue"
        placeholder="请输入搜索关键词"
        clearable
        @input="onSearch"
        @cancel="recoverList"
        @clear="recoverList"
      />
      <van-picker
        :title="currentItem.text"
        :columns="currentList"
        @change="onSecondChange"
        :default-index="currentList.indexOf(currentItem)"
      />
      <van-button size="large" type="info" @click="onComfirm">确认</van-button>
    </van-popup>
  </div>
</template>

<script>
import { getNcChannel } from '@/api/category'
import { getBrandList } from '@/api/brand'

export default {
  name: 'SaleTargetSearch',

  props: {
    businessId: '',

    value: {
      type: Object,
      default: () => ({
        brandId: '',
        businessId: '',
        channelTypeCode: '',
        type: '0'
      })
    },

    businessList: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      searchValue: '',
      query: {
        brandId: '',
        businessId: '',
        channelTypeCode: '',
        type: '0'
      },
      origintypeList: [
        { text: '事业部', value: '0' },
        { text: '渠道', value: '1' },
        { text: '品牌', value: '2' }
      ],
      // businessList: [],
      brandList: [],
      channelList: [],
      showTypePopup: false,
      showSencondPopup: false,
      model1: {},
      model2: {},
      currentList: []
    }
  },

  computed: {
    isShowSecond() {
      return !(this.businessId && this.query.type === '0')
    },
    typeList() {
      return (
        this.origintypeList
          // .filter((v) => {
          //   if (!this.businessId) {
          //     return true
          //   } else {
          //     // return v.value !== '0'
          //     return true
          //   }
          // })
          .map((v) => {
            if (this.businessId) {
              v.text = v.value === '0' ? '全部' : v.text
            }
            return v
          })
      )
    },

    currentType() {
      return this.typeList.find((v) => v.value === this.query.type) || {}
    },

    secondList() {
      if (this.query.type === '0') {
        return this.businessList
      } else if (this.query.type === '1') {
        return this.channelList
      } else {
        return this.brandList
      }
    },

    secondKey() {
      if (this.query.type === '0') {
        return 'businessId'
      } else if (this.query.type === '1') {
        return 'channelTypeCode'
      } else {
        return 'brandId'
      }
    },

    currentItem() {
      return (
        this.secondList.find((v) => v.value === this.query[this.secondKey]) ||
        {}
      )
    }
  },

  watch: {
    businessId: {
      handler: function (val) {
        this.initQuery()
        this.$nextTick(() => {
          this.$emit('onSearch', this.query)
        })
      }
    },

    value: {
      handler: function (val) {
        this.query = val
      }
    },

    secondList: {
      handler: function (val) {
        this.currentList = _.cloneDeep(val)
      }
    }
  },

  created() {
    this.init()
  },

  methods: {
    getContainer() {
      return document.getElementById('app')
    },
    onSearch(val) {
      this.currentList = this.secondList.filter(
        (item) => item.text.indexOf(this.searchValue) !== -1
      )
      if (this.currentList.length) {
        this.model2 = this.currentList[0]
      }
    },

    recoverList() {
      this.currentList = _.cloneDeep(this.secondList)
    },

    initQuery() {
      this.query.type = this.typeList[0].value
      this.$nextTick(() => {
        this.currentList = _.cloneDeep(this.secondList)
        this.query[this.secondKey] =
          (this.secondList[0] && this.secondList[0].value) || ''
        this.$emit('input', this.query)
      })
    },
    init() {
      Promise.allSettled([getBrandList(), getNcChannel()]).then(
        ([brandRes, channelRes]) => {
          let brandList = []
          if (brandRes.status === 'fulfilled') {
            brandList = brandRes.value.map((v) => ({
              text: v.name,
              value: v.id
            }))
            brandList = [{ text: '全部', value: '' }, ...brandList]
          }
          this.brandList = brandList

          let channelList = []
          if (channelRes.status === 'fulfilled') {
            channelList = channelRes.value.map((v) => ({
              text: v.name,
              value: v.code
            }))
            channelList = [{ text: '全部', value: '' }, ...channelList]
          }
          this.channelList = channelList
          this.initQuery()
          // this.onTypeChange(null, { value: this.typeList[0].value }, null)
          this.$nextTick(() => {
            this.$emit('onSearch', this.query)
          })
        }
      )
    },

    onTypeChange(picker, value, index) {
      this.model1 = _.cloneDeep(value)
      let item = {}
      if (this.model1.value === '0') {
        item = _.cloneDeep(this.businessList[0])
      } else if (this.model1.value === '1') {
        item = _.cloneDeep(this.channelList[0])
      } else {
        item = _.cloneDeep(this.brandList[0])
      }
      this.model2 = _.cloneDeep(item)
    },

    onSecondChange(picker, value, index) {
      this.model2 = _.cloneDeep(value)
      this.model1 = _.cloneDeep(this.currentType)
    },

    onComfirm(type = 1) {
      this.query = {
        brandId: '',
        businessId: '',
        channelTypeCode: '',
        type: '0'
      }
      this.searchValue = ''
      this.currentList = _.cloneDeep(this.secondList)
      this.query.type = this.model1.value
      this.query[this.secondKey] = this.model2.value
      this.$emit('input', this.query)
      this.showTypePopup = false
      this.showSencondPopup = false
      this.$nextTick(() => {
        this.$emit('onSearch', this.query)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 50px;
  padding: 15px 0;
  border-bottom: solid 1px #f2f4f9;
  .selector-wapper + .selector-wapper {
    margin-left: 40px;
  }
  .selector-wapper {
    display: inline-flex;
    align-items: center;
    .text {
      color: #959ca7;
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
    }
    .text-icon {
      width: 6px;
      height: 3px;
      background: #959ca7;
      margin-left: 6px;
      -webkit-clip-path: polygon(50% 100%, 0 0, 100% 0px);
      clip-path: polygon(50% 100%, 0 0, 100% 0px);
      &.active {
        -webkit-clip-path: polygon(50% 0px, 100% 100%, 0px 100%);
        clip-path: polygon(50% 0px, 100% 100%, 0px 100%);
      }
    }
  }
}
</style>