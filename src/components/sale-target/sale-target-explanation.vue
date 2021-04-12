<template>
  <van-dialog v-model="show" class="my-dialog" :show-confirm-button="false" @close="closeDialog">
    <!-- close-on-click-overlay -->
    <template #title>
      <h4 class="title mb16">统计说明</h4>
    </template>
    <div class="mlr26 mb28 explanation-wapper">
      <p class="subtitle mb18">
        <span class="order">1</span>
        出货额
      </p>
      <p class="text fs14 mb10">渠道&线下客户</p>
      <p class="desc mb16">NC系统中的销售出库单-退款单金额统计；</p>
      <p class="text fs14 mb10">线上自营店铺</p>
      <p class="desc mb16">OMS系统中的销售出库单-退款单金额统计；</p>
      <p class="text fs14 mb10">同比</p>
      <p class="desc mb16">(本期出货额-同期出货额)/同期出货额*100%；</p>
      <p class="text fs14 mb10">环比</p>
      <p class="desc">(本期出货额-上期出货额)/上期出货额*100%。</p>
      <p class="subtitle mt24 mb18">
        <span class="order">2</span>
        出货量
      </p>
      <p class="text fs14 mb10">渠道&线下客户</p>
      <p class="desc mb16">NC系统中的销售出库单-退款单数量统计；</p>
      <p class="text fs14 mb10">线上自营店铺</p>
      <p class="desc mb16">OMS系统中的销售出库单-退款单数量统计；</p>
      <p class="text fs14 mb10">同比</p>
      <p class="desc mb16">(本期出货量-同期出货量)/同期出货量*100%；</p>
      <p class="text fs14 mb10">环比</p>
      <p class="desc">(本期出货量-上期出货量)/上期出货量*100%。</p>
    </div>
    <div class="text-center mb28">
      <van-button @click="closeDialog" class="btn" round type="info">我知道了</van-button>
    </div>
  </van-dialog>
</template>

<script>
export default {
  name: 'SaleTargetExplanation',

  props: {
    value: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    show: {
      get() {
        return this.value
      },
      set(bool) {
        this.$emit('input', bool)
      }
    }
  },

  methods: {
    closeDialog() {
      this.show = false
    }
  }
}
</script>

<style lang="scss" scoped>
.explanation-wapper {
  height: 409px;
  overflow: auto;
}
.title {
  text-align: center;
  height: 20px;
  font-size: 18px;
  font-weight: 600;
  color: #393c41;
  line-height: 20px;
}
.subtitle {
  font-size: 16px;
  font-weight: bold;
  color: #3a78ef;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .order {
    margin-right: 8px;
    display: inline-block;
    width: 18px;
    height: 18px;
    line-height: 18px;
    border-radius: 50%;
    background: linear-gradient(124deg, #9ebfff 0%, #3a78ef 100%);
    color: #fff;
    font-size: 12px;
    font-weight: 500;
    text-align: center;
  }
}
.text {
  font-weight: bold;
  color: #393c41;
  line-height: 16px;
}
.desc {
  font-size: 13px;
  font-weight: 500;
  color: #6b7178;
  line-height: 13px;
}
.btn {
  width: 180px;
  height: 36px;
}
.my-dialog {
  border-radius: 8px;
  // z-index: 10001 !important;
}
</style>