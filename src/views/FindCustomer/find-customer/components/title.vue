<template>
  <div class="align wpct92 mauto h68">
    <div class="row center">
      <img
        :src="require('@/assets/images/find/new_find/title_circle@2x.png')"
        alt
        class="w20 h-full"
      />
      <p class="color-dark-grey fs18 ml10 fw600">{{ title }}</p>
    </div>
    <div
      v-if="isValue || value || this.$slots.value "
      @click="is_link ? getLink() : null"
      :class="['row','center-y',right_Class ? right_Class :['fs14']]"
      style="color:#afafaf;cursor:pointer;"
    >
      <slot name="value">
        {{ value || '更多'}}
        <van-icon name="arrow" />
      </slot>
      <van-icon name="arrow" color="#afafaf" v-if="icon" />
    </div>
    <!-- 单位 -->
    <div v-if="isChart">
      <div class="unit" @click="onUnitClick">{{ unit }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'baseTitle',

  mixins: [],

  components: {},

  props: {
    title: {
      // 标题
      type: String,
      default: ''
    },
    value: {
      //  右侧文本
      type: String,
      default: ''
    },
    isValue: {
      //  是否显示右侧文本
      type: Boolean,
      default: false
    },
    icon: {
      // 是否显示 右侧箭头
      type: Boolean,
      default: false
    },
    is_link: {
      // 是否跳转开关
      type: Boolean,
      default: false
    },
    url: {
      //跳转地址
      type: String,
      default: ''
    },
    to: {
      //路由跳转地址
    },
    right_Class: {
      // 右侧格外类名
      type: String,
      default: ''
    },
    isChart: {
      // 是否显示图表
      type: Boolean,
      default: false
    },
    unit: {
      // 单位
      type: String,
      default: ''
    }
  },

  data() {
    return {}
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {},

  destroyed() {},

  methods: {
    getLink() {
      if (this.url) window.location.href = this.url
      if (this.to)
        this.$router.push(
          this.to.hasOwnProperty('path') ? this.to : { path: this.to }
        )
    },

    onUnitClick(e) {
      this.$emit('onUnitClick', e)
    }
  }
}
</script>

<style lang="scss" scoped>
.color-gray {
  color: #959ca7;
}
.color-dark-grey {
  color: #393c41;
}
.unit {
  font-size: 12px;
  font-weight: 500;
  color: rgba(149, 156, 167, 1);
  background: rgba(245, 246, 249, 1);
  border-radius: 12px;
  padding: 5px 10px;
}
</style>
