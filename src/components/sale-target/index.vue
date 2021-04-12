<template>
  <div>
    <van-loading size="24px" class="row center-x w-full ptb60" v-show=" loading">加载中...</van-loading>
    <div v-show=" !loading" class="wapper">
      <sale-target-search
        v-show="isShowTarget"
        v-model="query"
        :business-list="businessList"
        :business-id="businessId"
        @onSearch="search"
      ></sale-target-search>
      <div v-if="isShowTarget" class="mt20 completion-wapper">
        <div>
          <!-- :class="saleTarget.currSales > saleTarget.salesTarget ? 'finished' : 'unfinished'" -->
          <div
            :style="{ color: textColor}"
            class="completion-status"
          >{{saleTarget.currSales >= saleTarget.salesTarget ? '已完成' : '进行中'}}</div>
          <div class="mt10 completion-desc">达成状态</div>
        </div>
        <div>
          <div
            class="completion-number fw600"
            v-if="compareNumberLength(saleTarget.currSales)"
          >{{saleTarget.salesTarget | formattedMoneyData(2) }}</div>
          <div class="completion-number fw600" v-else>{{ saleTarget.salesTarget }}</div>
          <div
            class="mt10 completion-desc"
          >目标{{ compareNumberLength(saleTarget.currSales) ? '(万元)' : '(元)' }}</div>
        </div>
      </div>
      <sale-target-bar
        v-if="isShowTarget"
        :bar-setting="barSetting"
        :completion-rate="saleTarget.completionRate"
      ></sale-target-bar>
      <sale-target-info :comparison-text="comparisonText" :item="saleTarget"></sale-target-info>
    </div>
  </div>
</template>

<script>
import SaleTargetSearch from './sale-target-search'
import SaleTargetInfo from './sale-target-info'
import SaleTargetBar from './sale-target-bar'
import { progressBarSettings, getSalesTarget } from '@/api/findCustomer'
import axios from 'axios'

export default {
  name: 'SaleTarget',

  components: {
    SaleTargetSearch,
    SaleTargetInfo,
    SaleTargetBar
  },

  props: {
    year: {
      type: [Number, String],
      default: new Date().getFullYear()
    },

    month: {
      type: [Number, String],
      default: new Date().getMonth() + 1
    },

    day: {
      type: [Number, String],
      default: null
    },

    businessId: '',

    businessList: {
      type: Array,
      default: () => []
    },

    authType: {
      type: String,
      default: 'denied'
    }
  },

  data() {
    return {
      loading: true,
      barColors: ['#ff3750', '#00C873'],
      barSetting: {
        step1: 60,
        step2: 100
      },
      saleTarget: {
        amtRatio: '0.00',
        beforeSales: 0,
        beforeSalesNum: 0,
        currSales: 0,
        numRatio: '0.00',
        salesTarget: 0,
        currSaelsNum: 0,
        completionRate: '0'
      },
      query: {
        brandId: '',
        businessId: '',
        channelTypeCode: '',
        type: '0'
      },
      cancelHttp: null
    }
  },

  computed: {
    isShowTarget() {
      const arr = ['all']
      return false
    },
    completionNum() {
      return Number(this.saleTarget.completionRate)
    },
    textColor() {
      // if (this.completionNum > this.barSetting.step2) {
      //   return this.barColors[2]
      // } else
      if (this.completionNum >= this.barSetting.step1) {
        return this.barColors[0]
      } else {
        return this.barColors[1]
      }
    },
    comparisonText() {
      return this.year && this.month ? '环比' : '同比'
    },
    params() {
      const pam = {
        ...this.query,
        ...this.dateObj,
        pageIndex: 1,
        pageSize: 1
      }
      if (this.businessId) {
        return {
          ...pam,
          businessId: this.businessId
        }
      }
      // 没有事业部，就是全公司
      // pam.businessId = pam.businessId ? pam.businessId : 'all'
      return pam
    },

    dateObj() {
      return {
        year: this.year,
        month: this.month,
        day: this.day
      }
    }
  },

  watch: {
    dateObj: {
      handler: function (val) {
        // this.$nextTick(() => {
        this.search()
        // })
      }
    }
  },

  created() {
    this.getBarSetting()
  },

  methods: {
    compareNumberLength(num, lengthNumber = 5) {
      return Math.abs(num).toString().split('.')[0].length >= lengthNumber
    },

    getBarSetting() {
      progressBarSettings().then((res) => {
        if (res) {
          this.barSetting = res
        }
      })
    },

    search(pam) {
      this.cancelHttp && this.cancelHttp()
      this.loading = true
      getSalesTarget(
        this.params,
        new axios.CancelToken((c) => {
          this.cancelHttp = c
        })
      )
        .then((res) => {
          res.completionRate =
            ((res.currSales / res.salesTarget) * 100).toFixed(2) + ''
          if (res.currSales === 0) {
            res.completionRate = '0.00'
          }
          if (res.salesTarget === 0) {
            res.completionRate = '100'
          }
          this.saleTarget = res
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.wapper {
  background: #ffffff;
  box-shadow: 0px 2px 11px 0px rgba(159, 190, 240, 0.16);
  border-radius: 8px;
  margin: 0 18px;
  padding: 0 20px 28px;
  .completion-wapper {
    display: flex;
    justify-content: space-between;
    .completion-status {
      font-size: 20px;
      font-weight: 500;
      line-height: 28px;
      &.finished {
        color: #00c873;
      }
      &.unfinished {
        color: #ff3750;
      }
    }

    .completion-desc {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #959ca7;
      letter-spacing: 2px;
    }
  }
}
.completion-number {
  font-size: 25px;
  color: #393c41;
  line-height: 28px;
}
</style>