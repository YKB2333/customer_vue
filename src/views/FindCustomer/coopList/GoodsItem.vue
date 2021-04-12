<template>
  <div class="mb14 pointer">
    <div class="goods-item">
      <div class="goods-img-box"><img :src="titleImage"></div>
      <div class="goods-content">
        <p class="name ellipsis2 fs16 fw600">{{ name }}</p>
        <div class="bottom">
          <div class="price flex-1">
            <p :class="msrp != null ? 'value' : 'text'"><span class="text mb4 pr6">出货额</span>{{ msrp != null ? '¥'+fmoney(msrp,2) : '****' }}</p>
            <p class="text"><span class="pr6 fw600">出货量</span><span class="fs14 bold">{{monthSales || 0}} 件</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { fmoney } from "@/utils";
export default {
  name: 'GoodsItem',
  components: {},
  props: {
    type: {
      type: String,
      default: '1'
    },
    titleImage: {
      type: String
    },
    name: {
      type: String
    },
    msrp: {
      type: Number
    },
    monthSales: {
      type: Number
    },
    // validityStock: {
    //   type: [Number,String]
    // }
  },
  data() {
    return {
    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    fmoney
  }
}
</script>

<style lang="scss" scoped>
$name-color: #333333;
$price-color: #f71744;
@mixin shadow() {
  box-shadow: 0px 0px 10px 0px rgba(40, 109, 153, 0.1);
}
.goods-item{
  display: flex;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 16px;
  @include shadow();
  .goods-img-box{
    width: 102px;
    margin-right: 10px;
  }
  .goods-content{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding:4px 0;
    .name{
      color: $name-color;
      font-size: 13px;
    }
    .bottom{
      display: flex;
      align-items: center;
      justify-content: space-between;
      line-height: 20px;
      .price{
        .value{
          color: #FF3750;
          font-size: 14px;
          font-weight: 600;
        }
        .text{
          font-size: 12px;
          color: #6B7178;
        }
      }
    }
  }
}
</style>
