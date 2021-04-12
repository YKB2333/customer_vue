<template>
  <div class="mt20 mb60">
    <van-slider disabled :value="barNum" bar-height="5px" :active-color="barColor">
      <template #button>
        <div :style="customButtonStyle" class="custom-button">
          <div class="completion-value">{{ completionRate }}%</div>
        </div>
      </template>
    </van-slider>
  </div>
</template>

<script>
import { Slider } from 'vant'
export default {
  components: {
    VanSlider: Slider
  },
  props: {
    completionRate: {
      default: '0.00'
    },
    barSetting: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      barColors: ['#ff3750', '#00C873'], // '#FFA940',
      barShadow: [
        '0px 4px 8px 0px rgba(255, 55, 80, 0.2)',
        '0px 4px 8px 0px rgba(0, 200, 115, 0.2)'
      ] // '0px 4px 8px 0px rgba(255, 169, 64, 0.2)',
    }
  },
  computed: {
    completionNum() {
      return Number(this.completionRate)
    },

    barColor() {
      // if (this.completionNum > this.barSetting.step2) {
      //   return this.barColors[2]
      // } else
      if (this.completionNum >= this.barSetting.step1) {
        return this.barColors[0]
      } else {
        return this.barColors[1]
      }
    },

    barNum() {
      if (this.completionNum > 100) {
        return 100
      } else if (this.completionNum >= 0) {
        return this.completionNum
      } else {
        return 0
      }
    },

    customButtonStyle() {
      let res = {
        background: this.barColor
      }
      // if (this.completionNum > this.barSetting.step2) {
      //   res.boxShadow = this.barShadow[2]
      // } else
      if (this.completionNum >= this.barSetting.step1) {
        res.boxShadow = this.barShadow[0]
      } else {
        res.boxShadow = this.barShadow[1]
      }
      return res
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .van-slider--disabled {
  opacity: 1 !important;
}
.custom-button {
  position: relative;
  width: 13px;
  height: 13px;
  // box-shadow: 0px 4px 8px 0px rgba(255, 55, 80, 0.2);
  border: 2px solid #ffffff;
  border-radius: 50%;
  .completion-value {
    position: absolute;
    top: 18px;
    right: 100%;
    transform: translateX(50%);
    font-size: 14px;
    font-weight: 400;
    color: #959ca7;
    line-height: 13px;
  }
}
</style>