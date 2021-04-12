<template>
  <div class="bg-main pb20 relative" style="min-height:100%;">
    <div class="bg-container">
      <img :src="require('@/assets/images/task_detail_bg.png')" />
    </div>
    <div class="main-container">
      <div class="box-container plr14 ptb24">
        <div class="row center-y mb20">
          <div><img :src="require('@/assets/images/task_icon_store.png')" class="w-h44"></div>
          <div class="pl8">
            <p class="fs16 fw600 mb6">{{ taskData.type === '1' ? taskData.shopName : taskData.customerName }}</p>
            <p v-if="['0', '1'].includes(taskData.taskStatus)" class="fs13" style="color: #EF9236;">待处理</p>
            <p v-if="taskData.taskStatus === '2'" class="fs13" style="color: #EF9236;">执行中</p>
            <p v-if="taskData.taskStatus === '3'" class="fs13" style="color: #00C873;">已完成</p>
            <p v-if="taskData.taskStatus === '5'" class="fs13" style="color: #FF3750;">已过期</p>
          </div>
        </div>
        <div>
          <div class="mb10 row">
            <img :src="require('@/assets/images/task_icon_adr.png')" class="w-h14 mt3">
            <span class="fs13 pl6">{{ taskData.address }}</span>
          </div>
          <div class="mb10">
            <img :src="require('@/assets/images/task_icon_time.png')" class="w-h14">
            <span class="fs13 pl6">{{ taskData.startDate | formatDate('Y-M-D') }} 至 {{ taskData.endDate | formatDate('M-D') }}</span>
          </div>
          <div class="mb10">
            <img :src="require('@/assets/images/task_icon_num.png')" class="w-h14">
            <span class="fs13 pl6">{{ taskData.id }}</span>
          </div>
          <!-- <div>
            <img :src="require('@/assets/images/task_icon_man.png')" class="w-h14">
            <span class="fs13 pl6">{{ taskData.entourages || '-' }}</span>
          </div> -->
        </div>
        <div class="mt20 row center-x">
          <van-button :disabled="['2', '3'].includes(taskData.taskStatus)" round color="#3A78EF" class="h28 w80 plr0 mr14" @click="showDialog('time')">调整时间</van-button>
          <van-button :disabled="['2', '3', '5'].includes(taskData.taskStatus)" round color="#FF7875" class="h28 w80 plr0" @click="showDialog('cancel')">取消</van-button>
        </div>
      </div>
      <div class="box-container mt20 plr14">
        <div class="fs16 fw600 van-hairline--bottom pb16">工作执行</div>
        <div class="fs14 mt20" v-if="new Date().getTime() < taskData.startDate">当前日期不在计划任务起始周期内不能打卡</div>
        <van-steps class="mt20" direction="vertical" :active="active">
          <van-step>
            <div class="row space-between">
              <span class="fs14 color-label fw500">到店打卡</span>
              <van-button round type="info" class="h22" @click="toClock('in')" :disabled="taskData.taskStatus === '5' || new Date().getTime() < taskData.startDate">
                {{ [0, -1].includes(active) ? '去打卡' : '已打卡' }}
              </van-button>
            </div>
            <div slot="active-icon" class="active-icon"><span></span></div>
            <div slot="inactive-icon" class="inactive-icon"></div>
          </van-step>
          <van-step>
            <div class="row space-between">
              <span class="fs14 color-label fw500">任务执行</span>
              <van-button round type="info" class="h22" :disabled="active <= 0 || taskData.taskStatus === '5'" @click="todo">
                {{ isTaskFinished ? '已执行' : '去执行' }}
              </van-button>
            </div>
            <div slot="active-icon" class="active-icon"><span></span></div>
            <div slot="inactive-icon" class="inactive-icon"></div>
          </van-step>
          <van-step>
            <div class="row space-between">
              <span class="fs14 color-label fw500">离店打卡</span>
              <van-button round type="info" class="h22" :disabled="active < 2 || taskData.taskStatus === '5'" @click="toClock('out')">
                {{ taskData.taskStatus === '3' ? '已打卡' : '去打卡' }}
              </van-button>
            </div>
            <div slot="active-icon" class="active-icon"><span></span></div>
            <div slot="inactive-icon" class="inactive-icon"></div>
          </van-step>
        </van-steps>
      </div>
    </div>
    <!-- 调整事件弹窗 -->
    <adjust-dialog 
      v-model="dialog.show"
      :task-id="id.toString()"
      :type="dialog.type"
      :start-date="taskData.startDate"
      :end-date="taskData.endDate"
      :plan-end-date="taskData.planEndDate"
      :plan-start-date="taskData.planStartDate"
      @success="onSuccess"
    />
  </div>
</template>

<script>
import AdjustDialog from './adjust-dialog'
import { getVisitTaskDetail, getSkusByTaskId } from '@/api/visit-task'

export default {
  name: 'VisitTaskDetail',
  components: { AdjustDialog },
  data() {
    return {
      id: '', // 任务ID
      taskData: {}, // 任务详情数据
      active: 0,
      dialog: {
        show: false,
        type: 'time' // cancel
      },
      finishedGoods: []
    }
  },
  computed: {
    isTaskFinished() {
      let result = false
      if (this.taskData.type === '1') { // 店铺拜访类型
        let display = this.taskData.taskDisplayVos || []
        // let competitor = this.taskData.taskCompetitorVos || [] 
        let summary = this.taskData.summary && this.taskData.demand ? true : false
        if (display.length && summary) {
          if (this.taskData.isCheckStock === '是') {
            if (this.finishedGoods.length) {
              result = true
            }
          } else {
            result = true
          }
        }
      } else if (this.taskData.type === '2') { // 客户拜访类型
        if (this.taskData.summary && this.taskData.demand) {
          result = true
        }
      }
      return result
    }
  },
  created() {
    this.id = this.$route.query.id
    this.init()
  },
  methods: {
    async init() {
      try {
        this.$store.commit('SHOW_LOADING')
        this.taskData = await getVisitTaskDetail(this.id)
        let goodsRes = await getSkusByTaskId({ taskId: this.id, pageIndex: 1, pageSize: 999999 })
        this.finishedGoods = goodsRes.list
        this.setStepStatus()
      } catch (error) {
        console.log(error)
      } finally {
        this.$store.commit('SHOW_LOADING', false)
      }
    },
    setStepStatus() {
      // 状态（0-初始、1-待处理、2-执行中、3-已完成、4-已取消、5-已过期）
      if (new Date().getTime() < this.taskData.startDate) {
        this.active = -1
      }
      else if (['0', '1'].includes(this.taskData.taskStatus)) {
        // 进店打卡
        this.active = 0
      } else if (this.taskData.taskStatus === '3') {
        // 已完成
        this.active = 3
      } else if (this.taskData.taskStatus === '2') {
        if (!this.isTaskFinished) {
          // 任务执行
          this.active = 1
        } else {
          // 离店打卡
          this.active = 2
        }
      }
      console.log('active', this.active)
    },
    // 去打卡
    toClock(type) {
      let isSuccess = false
      if (type === 'in') {
        isSuccess = this.taskData.inTime ? true : false
      }
      if (type === 'out') {
        isSuccess = this.taskData.taskStatus === '3' ? true : false
      }
      this.$router.push({ 
        path: '/visit-task-clock',
        query: {
          taskId: this.id.toString(),
          type: type,
          isSuccess: isSuccess,
          taskData:JSON.stringify(this.taskData)
        }
      })
    },
    todo() {
      let pageType = this.taskData.taskStatus === '3' ? 'finished' : 'todo'
      this.$router.push({ 
        path: '/visit-task-form',
        query: {
          pageType: pageType,
          taskId: this.id.toString()
        }
      })
    },
    showDialog(type) {
      this.dialog.type = type
      this.dialog.show = true
    },
    onSuccess() {
      if (this.dialog.type === 'time') {
        this.$eventHub.$emit(this.$eventName['REFRESH_TASK_LIST'])
        // this.init()
        this.$router.go(-1)
      } else if (this.dialog.type === 'cancel') {
        this.$eventHub.$emit(this.$eventName['REFRESH_TASK_LIST'])
        this.$router.go(-1)
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.bg-container{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  z-index: 0;
}
.main-container{
  padding-top: 40px;
  position: relative;
}

.box-container{
  padding: 1.7rem 0 1.7rem 0;
  width: 90%;
  margin: 0 auto;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 16px 0px rgba(159, 190, 240, 0.16);
  border-radius: 8px;
}
.inactive-icon{
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #C7CBD3;
}
.active-icon{
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #DCE7FC;
  // box-shadow: 0px 2px 11px 0px rgba(0, 72, 209, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  span{
    display: inline-block;
    background-color: #3A78EF;
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
}
/deep/ .van-step--vertical::after{
  border: none;
}
/deep/ .van-step--finish .van-step__line{
  background-color: #ebedf0;
}
/deep/ .van-step--finish .inactive-icon{
  background-color: #3A78EF;
}
</style>