<template>
	<div>
		<!-- 全权限 -->
		<div class="relative wpct92" style="margin:4% 4% 4% 4%" v-if="permission">
			<img src="@/assets/images/find/new_find/bg_shipment@2x.png" alt />
			<div class="absolute pos-center align wpct100">
				<div class="wpct50 color-white relative" style="padding-left:7.5%">
					<p class="fs14 mb4">{{ getNumberLength(exprotMoney,5) ? '出货额(元)' : '出货额(万元)'}}</p> 
					<p class="fs25 mb10 ellipsis fw600" v-if="getNumberLength(exprotMoney,5)">{{ exprotMoney  }}</p>
					<p class="fs25 mb10 ellipsis fw600" v-else>{{ exprotMoney | formattedMoneyData(2) }}</p>
					<p class="fs14">{{yearMonthActive == 0 ? '同比' : '环比'}} {{isNegativeNumber(moneyRatio) }}{{ moneyRatio }}%</p>
					<div class="w16 absolute" style="right:9.24%;top:-20%">
						<img src="@/assets/images/find/new_find/up.png" alt v-if="Math.sign(moneyRatio) == '+1'" />
						<img src="@/assets/images/find/new_find/down.png" alt v-else />
					</div>
				</div>
				<div class="wpct50 color-white relative" style="padding-left:7.5%">
					<p class="fs14 mb4">{{ getNumberLength(countMoney,5) ? '出货量（单件)' : '出货量（万件)'}}</p>
					<p class="fs25 mb10 ellipsis fw600" v-if="getNumberLength(countMoney,5)">{{ countMoney}}</p>
					<p class="fs25 mb10 ellipsis fw600" v-else>{{ countMoney |  formattedMoneyData(2) }}</p>
					<p class="fs14">{{yearMonthActive == 0 ? '同比' : '环比'}} {{isNegativeNumber(countRatio) }}{{ countRatio }}%</p>
					<div class="w16 absolute" style="right:9.24%;top:-20%">
						<img src="@/assets/images/find/new_find/up.png" alt v-if="Math.sign(countRatio) == '+1'" />
						<img src="@/assets/images/find/new_find/down.png" alt v-else />
					</div>
				</div>
			</div>
		</div>
		<!-- 单一权限 -->
		<div  class="relative wpct92" style="margin:4% 4% 4% 4%"  v-else>
			<img src="@/assets/images/find/new_find/bg_shipment_cir@2x.png" alt />
				<div class="absolute pos-center align wpct100">
				<div class="wpct100 color-white relative text-center" >
					<p class="fs14 mb4">{{ getNumberLength(countMoney,5) ? '出货量（单件)' : '出货量（万件)'}}</p>
					<p class="fs25 mb10 ellipsis fw600" v-if="getNumberLength(countMoney,5)">{{ countMoney}}</p>
					<p class="fs25 mb10 ellipsis fw600" v-else>{{ countMoney |  formattedMoneyData(2) }}</p>
					<p class="fs13">{{yearMonthActive == 0 ? '同比' : '环比'}} {{isNegativeNumber(countRatio) }}{{ countRatio }}%</p>
					<div class="w16 absolute" style="right:7.24%;top:-20%">
						<img src="@/assets/images/find/new_find/up.png" alt v-if="Math.sign(countRatio) == '+1'" />
						<img src="@/assets/images/find/new_find/down.png" alt v-else />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
  name: "",

  mixins: [],

  components: {},

  props: {
	// 是否权限
	permission : {
      type: Boolean,
      default: false
    },
    exprotMoney: {
      // 出货额金额
      type: [String,Number],
      default: "0"
    },
    countMoney: {
      // 出货量金额
      type: [String,Number],
      default: "0"
    },
    moneyRatio: {
      // 出货额 环比
      type: [String,Number],
      default: "0"
    },
    countRatio: {
      // 出货量 环比
      type: [String,Number],
      default: "0"
    },
    yearMonthActive: {
      // 时间类型
      type: [String,Number], 
      default: "0"
    }
  },

  data() {
    return {};
  },

  computed: {},

  watch: {
  },

  created() {},

  mounted() {},

  destroyed() {},

  methods: {
	getNumberLength(num,lengthNumber){
		return Math.abs(num).toString().split('.')[0].length < lengthNumber
	},
	
	isNegativeNumber(num){
		return String(num).indexOf('-') ? '+' : '' 
	}
  }
};
</script>

<style lang="scss" scoped>
</style>
