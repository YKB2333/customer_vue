<template>
  <section class="page">
    <div class="p18 space-between bg-white radius5">
      <!-- 标题-->
      <div class="pb16 row space-between center-y">
        <div class="row center-y">
          <img :src="require('@/assets/images/customer/icon_xi@2x.png')" class="w18 h18 mr6" alt />
          <span class="color-blakc fs18 fw600 ">{{ list.projectName }}</span>
        </div>
      </div>
      <!-- 内容 -->
      <div class="color-gray fs14 process-shadow bg-white">
        <!-- 项目内容 -->
        <div class="color-black p14 radius5 projectTop">
          <div>
            <span>负责人</span>
            <span>{{ list.personInCharge }}</span>
          </div>
          <div>
            <span>项目状态</span>
            <span :class="[list.state=='1'?'color-blue':'color-gray']">{{list.state=='1' ? '进行中': '已完结'}}</span>
          </div>
          <div>
            <span>启动时间</span>
            <span>{{ formatDate(list.projectStartupTime,'Y-M-D') }}</span>
          </div>
          <div class="col" style="align-items:flex-start">
            <span>项目目标</span>
            <span class="mt6">{{ list.target }}</span>
          </div>
        </div>
        <!-- 项目进展 -->
        <div v-if="list.speads && list.speads.length>0" class="processProcess ptb20">
          <p class="color-black mb10">项目进展</p>
          <van-steps direction="vertical" :active="-1" class="ml40" active-color="#959CA7"   >
            <van-step  v-for="(item_,index_) in list.speads" :key="index_">
              <div class="col leftText">
                <span class="fs13 top_">{{ formatDate(item_.speadTime,'M-D') }}</span>
                <span class="fs12 bot_">{{ formatDate(item_.speadTime,'Y') }}</span>
              </div>
              <span class="fs15">{{ item_.speadTarget}}</span>
            </van-step>
          </van-steps>
        </div>
        <!-- 项目附件 -->
        <div v-if="list.attas && list.attas.length>0" class="processProcess pt20">
          <p class="color-black mb10">项目附件</p>
          <atta-item
            v-for="(_item, _index) in list.attas"
            :key="_index"
            :file-name="_item.fileName"
            :file-type="_item.fileType"
            :size="_item.size"
            :attaId="_item.id"
            :attaUrl="_item.attaUrl"
            :parentStyle="`box-shadow: none;padding:0;height:60px`"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AttaItem from "@/components/AttachmentItem";
import {getProjectSpead} from "@/api/findCustomer/customer";
import { formatDate } from "@/utils";

export default {
  name: "projectProcess",
  components: {
    AttaItem
  },
  mixins: [],
  data() {
    return {
      list: [
        // {
        //   title: "屈臣氏达成100万的销售额",
        //   isEnd: true,
        //   startTime: "2020-02-11",
        //   name: "Jimmmm",
        //   msg:
        //     "我们必须要对每一个经销商、分销商、零售商及其下属的员工、物流、库存、价格、服务…"
        // }
      ],
      process:[
        // {time:'5-18',year:'2020',value:'项目进行中;'},
        // {time:'2-26',year:'2020',value:'小王和客户完成销售合同的签订'},
        // {time:'1-26',year:'2020',value:'项目立项;'},
        // {time:'1-26',year:'2020',value:'项目立项;'},
        // {time:'1-26',year:'2020',value:'项目立项;'},
      ],
      project: []
    };
  },
  mounted() {},
  computed: {},
  methods: {
    formatDate,
    getProjectDetail() {
      return getProjectSpead(this.$route.query.id).then(res => {
        console.log(res);
        this.list = res;
      });
    }
  },
  created(){
    if(this.$route.query && this.$route.query.id){
      this.getProjectDetail()
    }else{
      this.$toast('获取信息失败')
    }
  }
};
</script>

<style lang="scss" scoped>
.color {
  &-black {
    color: #393c41 !important;
  }
  &-blue {
    color: #3a78ef !important;
  }
  &-white {
    color: #ffffff !important;
  }
  &-info {
    color: #f2f4f9 !important;
  }
  &-gray {
    color: #959ca7 !important;
  }
}
.bg {
  &-black {
    background: #393c41 !important;
  }
  &-blue {
    background: #3a78ef !important;
  }
  &-white {
    background: #ffffff !important;
  }
  &-info {
    background: #f2f4f9 !important;
  }
  &-gray {
    background: #959ca7 !important;
  }
}

.lookbtn {
  width: 3.125rem;
  height: 1.3125rem;
  line-height: 1.3125px;
  background: rgba(242, 249, 255, 1);
  border: 0.0625rem solid rgba(58, 120, 239, 1);
  border-radius: 0.625rem;
  text-align: center;
  color: #3a78ef;
  font-size: 0.75rem;
}
.process-shadow {
  box-shadow: 0 0 2.5rem 0 rgba(40, 110, 153, 0.055);
}
.projectTop {
  div {
    margin-bottom: 0.875rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    span:nth-child(1) {
      font-size: 0.9375rem;
      font-weight: 500;
      width: 28%;
      display: inline-block;
    }
    span:nth-child(2) {
      font-size: 0.9375rem;
      color: #959ca7;
      flex: 1;
    }
  }
}
.processProcess {
  width: 92%;
  margin: 0 auto;
  border-top: 0.0625rem solid #f2f4f9;
  padding-top: 0.9375rem;
  font-weight: 500;
  font-size: 0.9375rem;
}
.leftText{
  position: absolute;
  left: -4.375rem;
  top: 0.3125rem;
  .top_{
    color:#393C41;
    font-weight:bold;
  }
  .bot_{
    color:#959CA7;
  }
}
/deep/ .van-steps{
  overflow:initial;
}
/deep/ .van-step--vertical:not(:last-child)::after{
  border: none;
}
/deep/ .van-step--vertical {
  padding: 0.75rem 0.9375rem 0.9375rem 0;
}
.emply{
  padding-top: 10%;
  text-align: center;
  img{
    width:8.3125rem;
  }
  p{
    color:rgba(149,156,167,1);
    font-size: 0.75rem;
    padding: 0.5rem 0 0.5rem 0.5rem;
  }
}
/deep/ .van-step__circle {
    display: block;
    width: 0.3125rem;
    height: 0.3125rem;
    background-color: #fff;
    border-radius: 50%;
    border: 0.125rem solid #959CA7;
}
/deep/ .van-step__line {
    background-color: #959CA7;
    opacity: 0.2;
}
</style>