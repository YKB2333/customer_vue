<template>
  <div class="bg-white p14 van-hairline--bottom row center-y">
    <img :src="sku.image || require('@/assets/images/logo.png')" class="w-h80" />
    <div class="flex-1 pl8 hidden">
      <p class="black fs13" :class="[ellipsis]">{{ sku.spuName || sku.name }}</p>
      <van-tag round color="#FFF1EB" text-color="#FF7640" class="mt6 mb14">{{ values }}</van-tag>
      <div class="row">
        <img :src="require('@/assets/images/task_icon_ma.png')" class="w-h12" />
        <span class="plr4 fs12 gray-text flex-1 ellipsis">{{ sku.codeBar }}</span>
        <img v-if="active" :src="require('@/assets/images/task_icon_gou.png')" class="w-h16" />
      </div>
      <div v-if="showStock" class="fs12 gray-text mt4">店铺库存：{{ sku.shopStock || 0 }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false
    },
    sku: {
      type: Object,
      default: () => {
        return {}
      }
    },
    showStock: {
      type: Boolean,
      default: false
    },
    ellipsis: {
      type: String,
      default: 'ellipsis'
    }
  },
  data() {
    return {
    }
  },
  computed: {
    values() {
      let arr = []
      if (this.sku.firstAtbValue) arr.push(this.sku.firstAtbValue)
      if (this.sku.secondAtbValue) arr.push(this.sku.secondAtbValue)
      return arr.join('；')
    }
  },
  created() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
</style>