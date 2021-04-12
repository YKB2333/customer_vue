<template>
  <div class="vh col bg-main">
    <template v-if="pageType === 'todo'">
      <div v-if="taskType === '1'">
        <custom-steps :active="stepActive" is-tabs @click-step="clickStep">
          <!-- <template v-if="taskType === '1'"> -->
            <custom-step title="陈列信息" :is-success="displaySuccess"></custom-step>
            <custom-step title="商品信息" :is-success="goodsSuccess"></custom-step>
            <custom-step title="竞品信息" :is-success="competitorSuccess"></custom-step>
          <!-- </template> -->
          <custom-step title="拜访小结" :is-success="summarySuccess"></custom-step>
        </custom-steps>
      </div>
      <div class="flex-1 y-scroll">
        <!-- 陈列信息 -->
        <div v-show="showType === 'display'" class="h-full">
          <display-info 
            :page-type="pageType" 
            :task-id="taskId" 
            :task-display-vos="taskDisplayVos" 
            @success="onSuccess('display')"
          />
        </div>
        <!-- 商品信息 -->
        <div v-show="showType === 'goods'" class="h-full">
          <goods-info 
            :page-type="pageType"
            :task-id="taskId"
            :finished-goods-list="finishedGoodsList"
          />
        </div>
        <!-- 竞品信息 -->
        <div v-show="showType === 'competitor'" class="h-full">
          <competitor-info 
            :page-type="pageType"
            :task-id="taskId"
            :task-competitor-vos="taskCompetitorVos"
            @success="onSuccess('competitor')"
          />
        </div>
        <!-- 拜访小结 -->
        <div v-show="showType === 'summary'" class="h-full">
          <summary-info 
            :page-type="pageType"
            :task-id="taskId"
            :summary="summary"
            @success="onSuccess('summary')"
          />
        </div>
      </div>
    </template>
    <template v-else>
      <div class="h-full y-scroll">
        <van-tabs 
          v-model="tabActive"
          line-width="30px"
          title-active-color="#303133"
          title-inactive-color="#909399"
          color="#3C7EFF"
          sticky>
          <template v-if="taskType === '1'">
            <van-tab title="陈列信息">
              <display-info 
                :page-type="pageType"
                :task-id="taskId" 
                :task-display-vos="taskDisplayVos" 
              />
            </van-tab>
            <van-tab title="商品信息">
              <goods-info 
                :page-type="pageType"
                :task-id="taskId"
                :finished-goods-list="finishedGoodsList"
              />
            </van-tab>
            <van-tab title="竞品信息">
              <competitor-info 
                :page-type="pageType"
                :task-id="taskId"
                :task-competitor-vos="taskCompetitorVos"
              />
            </van-tab>
          </template>
          <van-tab title="拜访小结">
            <summary-info 
              :page-type="pageType"
              :task-id="taskId"
              :summary="summary"
            />
          </van-tab>
        </van-tabs>
      </div>
    </template>
  </div>
</template>

<script>
import DisplayInfo from './display-info'
import CompetitorInfo from './competitor-info'
import SummaryInfo from './summary-info'
import GoodsInfo from './goods-info'
import CustomSteps from '@/components/custom-steps/steps'
import CustomStep from '@/components/custom-steps/step'
import { fetchData } from './common/mixin'

export default {
  name: 'VisitTaskForm',
  mixins: [fetchData],
  components: { 
    DisplayInfo, CompetitorInfo,
    SummaryInfo, GoodsInfo,
    CustomSteps, CustomStep
  },
  data() {
    return {
      pageType: 'todo', // todo finished
      taskId: '',
      stepActive: 0,
      displaySuccess: false,
      goodsSuccess: false,
      competitorSuccess: false,
      summarySuccess: false,
      tabActive: 0,
    }
  },
  computed: {
    showType() {
      let arr = ['display', 'goods', 'competitor', 'summary']
      return arr[this.stepActive]
    }
  },
  async created() {
    this.pageType = this.$route.query.pageType
    this.taskId = this.$route.query.taskId
    console.log('taskId', this.taskId)
    await this.init(this.taskId)
    if (this.taskType === '2') {
      // 客户拜访类型
      this.stepActive = 3
    }
    console.log('陈列信息', this.taskDisplayVos)
    console.log('竞品信息', this.taskCompetitorVos)
    console.log('拜访小结', this.summary)
    this.displaySuccess = this.taskDisplayVos.length > 0
    this.goodsSuccess = this.finishedGoodsList.length > 0
    this.competitorSuccess = this.taskCompetitorVos.length > 0
    this.summarySuccess = this.summary.demand && this.summary.summary ? true : false
  },
  methods: {
    clickStep(index) {
      // console.log('index', index, this.stepActive)
      if (this.taskType === '2') return
      this.stepActive = index
    },
    onSuccess(type) {
      console.log(type)
      switch (type) {
        case 'display':
          this.stepActive += 1
          this.displaySuccess = true
          break;
        case 'competitor':
          this.stepActive += 1
          this.competitorSuccess = true
          break;
        case 'summary':
          this.$router.go(-1)
          this.summarySuccess = true
          break;
        default:
          break;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./common/style.scss";
</style>