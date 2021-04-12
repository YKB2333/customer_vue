 <template>
  <section class="page">
    <div class="m18 space-between bg-white radius5 hidden" v-for="(item,index) in list" :key="index">
      <!-- 内容 -->
      <div class="color-gray fs14 process-shadow bg-white">
        <!-- 项目内容 -->
        <div class="color-black radius5 projectTop" style="padding:24px 14px;">
          <div>
            <span>制定部门</span>
            <span>{{item.companyName + '-' + item.deptName}}</span>
          </div>
          <div>
            <span>业务板块</span>
            <span >{{item.businessName}}</span>
          </div>
          <div>
            <span>销售目标</span>
            <span >{{item.salesTarget}}</span>
          </div>
          <div class="progress">
            <span class="targetTitle">达成率</span>
            <div>
              <van-progress style="width:70%;" track-color='#eee' :show-pivot="false" :percentage="item.departYearSales" />
              <span>{{item.departYearSales}}%</span>
            </div>
          </div>
          <div class="col" style="align-items:flex-start">
            <span>品类/品牌销售目标</span>
            <span class="mt6">{{ item.breachSalesTarget }}</span>
          </div>
          <div class="col" style="align-items:flex-start">
            <span>选品策略</span>
            <span class="mt6">{{ item.productSelectionStrategr }}</span>
          </div>
          <div v-if="item.attas && item.attas.length>0" class="col mb0" style="align-items:flex-start">
            <span>年度行动计划</span>
            <span class="mt6" style="width:100%;">
              <atta-item
                v-for="(item, index) in item.attas"
                :key="index"
                parentClass="attaList"
                :file-name="item.fileName"
                :file-type="item.fileType"
                :size="item.size"
                :attaId="item.id"
                :attaUrl="item.attaUrl"
                :parentStyle="`box-shadow: none;padding:0;height:60px`"
              />
            </span>
          </div>
          <!-- <div>
            <img @click=" $router.push({path: '/process',query: {id: item.id}})" :src="require('@/assets/images/customer/theplan.png')" alt="">
          </div> -->
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AttaItem from "@/components/AttachmentItem";
import { showRecentTime } from "@/utils";
import { getYearTarget } from "@/api/findCustomer/customer";
export default {
  name: "projectTarget",
  components: {
    AttaItem
  },
  mixins: [],
  data() {
    return {
      list: [],
    };
  },
  methods: {
    showRecentTime,
    FgetYearTarget() {
      return getYearTarget(this.$route.query.id).then(res => {
        this.list = res;
        if(this.list.length>0){
          this.list.forEach(item => {
            if(item.departYearSales && item.salesTarget){
              item.departYearSales = parseInt(((Number(item.departYearSales||0))/(Number(item.salesTarget || 0)*10000))*100)
            }else{
              item.departYearSales = 0
            }
          });
        }
        this.$toast.clear()
      });
    }
  },
  created(){
    this.$toast.loading({
      duration: 0,
      message: "加载中...",
      forbidClick: true
    });
    this.FgetYearTarget()
  }
};
</script>

<style lang="scss" scoped>
.page{
  height: 100vh;
  background: #f1f2f6;
  overflow-y: auto;
}
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
  width: 50px;
  height: 21px;
  line-height: 21px;
  background: rgba(242, 249, 255, 1);
  border: 1px solid rgba(58, 120, 239, 1);
  border-radius: 10px;
  text-align: center;
  color: #3a78ef;
  font-size: 12px;
}
.process-shadow {
  box-shadow: 0px 0px 40px 0px rgba(40, 110, 153, 0.055);
}
.projectTop {
  >div {
    margin-bottom: 22px;
    display: flex;
    justify-content: flex-start;
    align-items: top;
    span:nth-child(1) {
      font-size: 15px;
      font-weight: 600;
      min-width: 28%;
    }
    span:nth-child(2) {
      font-size: 15px;
      color: #959ca7;
    }
  }
}
.processProcess {
  width: 92%;
  margin: 0 auto;
  padding-top: 15px;
  font-weight: 500;
  font-size: 15px;
}
.progress{
  display: flex;
  align-items: center;
  .targetTitle{
    flex-shrink: 0;
    // padding-right:45px;
  }
  >div{
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: space-between;
    // margin-bottom: 0;
  }
}
/deep/ .attaList{
  &:nth-last-child(1){
    margin-bottom: 0 !important;
  }
}
</style>