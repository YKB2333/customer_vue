<template>
  <div class="align pt30">
    <div class="wpct50 relative" style="padding-right:7.5%">
      <p
        class="fs14 color-gray fw500 mb14"
      >{{ compareNumberLength(item.currSales, 5) ? '出货额(万元)' : '出货额(元)'}}</p>
      <p
        class="fs25 mb16 ellipsis fw600"
        v-if="compareNumberLength(item.currSales, 5)"
      >{{ item.currSales | formattedMoneyData(2) }}</p>
      <p class="fs25 mb16 ellipsis fw600" v-else>{{ item.currSales }}</p>
      <p class="fs14">
        <span class="color-gray">{{ comparisonText }}</span>
        <span
          class="ml4"
          :class="Math.sign(item.amtRatio) > 0 ?'rise':'fall'"
        >{{isNegativeNumber(item.amtRatio)}}{{ item.amtRatio }}%</span>
      </p>
      <div class="w14 absolute" style="right:9.24%;top:-18px">
        <img
          src="@/assets/images/find/client_icon_up@2x.png"
          alt
          v-if="Math.sign(item.amtRatio) > 0"
        />
        <img src="@/assets/images/find/client_icon_down@2x.png" alt v-else />
      </div>
    </div>
    <div class="col">
      <div v-for="i in 3" :key="i" class="w-h4 radius mb6" style="background-color:#C7CBD3;"></div>
    </div>
    <div class="wpct50 relative" style="padding-left:7.5%">
      <p
        class="fs14 mb14 color-gray fw500"
      >{{ compareNumberLength(item.currSaelsNum, 5) ? '出货量(万件)' : '出货量(件)'}}</p>
      <p
        class="fs25 mb16 ellipsis fw600"
        v-if="compareNumberLength(item.currSaelsNum, 5)"
      >{{ item.currSaelsNum | formattedMoneyData(2)}}</p>
      <p class="fs25 mb16 ellipsis fw600" v-else>{{ item.currSaelsNum }}</p>
      <p class="fs14">
        <span class="color-gray">{{comparisonText }}</span>
        <span
          class="ml4"
          :class="Math.sign(item.numRatio) > 0 ?'rise':'fall'"
        >{{isNegativeNumber(item.numRatio)}}{{ item.numRatio }}%</span>
      </p>
      <div class="w14 absolute" style="right:9.24%;top:-18px">
        <img
          src="@/assets/images/find/client_icon_up@2x.png"
          alt
          v-if="Math.sign(item.numRatio) > 0"
        />
        <img src="@/assets/images/find/client_icon_down@2x.png" alt v-else />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SaleTargetInfo',

  props: {
    item: {
      type: Object,
      require: true
    },

    comparisonText: {
      type: String,
      default: '环比'
    }
  },

  data() {
    return {}
  },

  methods: {
    compareNumberLength(num, lengthNumber) {
      return Math.abs(num).toString().split('.')[0].length >= lengthNumber
    },
    isNegativeNumber(num) {
      return String(num).includes('-') ? '' : '+'
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
.rise {
  color: #ff3750;
}
.fall {
  color: #00c873;
}
.is-show {
  display: block;
}
.is-hide {
  display: none;
}
</style>