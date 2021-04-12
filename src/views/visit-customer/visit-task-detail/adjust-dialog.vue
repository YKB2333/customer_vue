<template>
  <div>
    <van-dialog 
      v-bind="$attrs" 
      :title="type === 'time' ? '调整时间' : '取消原因'" 
      :show-cancel-button="false"
      :show-confirm-button="false">
      <div class="plr20 ptb18 fs15">
        <template v-if="type === 'time'">
          <div class="row center-y">
            <div class="w100 text-right">原计划时间：</div>
            <div>{{ startDate | formatDate('Y-M-D') }}至{{ endDate | formatDate('M-D') }}</div>
          </div>
          <div class="row center-y mt14">
            <div class="w100 text-right">调整时间：</div>
            <div @click="openPicker">
              <span v-if="seleteStartDate">
                {{ new Date(seleteStartDate) | formatDate('Y-M-D') }}至{{ new Date(seleteEndDate) | formatDate('M-D') }}
              </span>
              <span v-else style="color: #C7CBD3;">请选择</span>
            </div>
          </div>
        </template>
        <van-field
          v-model="reason"
          rows="4"
          type="textarea"
          :placeholder="type === 'time' ? '请输入调整原因' : '请输入取消原因'"
          class="textarea-container"
        />
      </div>
      <div class="row van-hairline--top">
        <van-button class="dialog-cancel-btn van-hairline--right" @click="onClose">取消</van-button>
        <van-button class="dialog-confirm-btn" @click="confirmDialog" :loading="loading">确定</van-button>
      </div>
    </van-dialog>
    <van-calendar 
      v-model="showDatePicker" 
      @confirm="onConfirmDate"
      color="#3A78EF"
      type="range"
      :default-date="defaultDate"
      :max-date="maxDate"
      :min-date="minDate"
    />
  </div>
</template>

<script>
import { cancelVisitTask, adjustVisitTask } from '@/api/visit-task'

export default {
  inheritAttrs: false,
  props: {
    type: {
      type: String,
      default: 'time', // cancel
    },
    startDate: Number,
    endDate: Number,
    planEndDate: Number,
    planStartDate: Number,
    taskId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      reason: '',
      showDatePicker: false,
      seleteStartDate: null,
      seleteEndDate: null,
      loading: false
    }
  },
  computed: {
    defaultDate() {
      let arr = []
      if (this.startDate) arr.push(new Date(this.startDate))
      if (this.endDate) arr.push(new Date(this.endDate))
      return arr
    },
    maxDate() {
      let y = this.planEndDate ? new Date(this.planEndDate).getFullYear() : new Date().getFullYear()
      let m = this.planEndDate ? new Date(this.planEndDate).getMonth() : new Date().getMonth()
      let d = this.planEndDate ? new Date(this.planEndDate).getDate() : new Date().getDate()
      // console.log(y, m, d)
      return new Date(y, m, d)
    },
    minDate() {
      let y = this.planStartDate ? new Date(this.planStartDate).getFullYear() : new Date().getFullYear()
      let m = this.planStartDate ? new Date(this.planStartDate).getMonth() : new Date().getMonth()
      let d = this.planStartDate ? new Date(this.planStartDate).getDate() : new Date().getDate()
      // console.log(y, m, d)
      return new Date(y, m, d)
    }
  },
  created() {},
  methods: {
    onClose() {
      this.$emit('input', false)
    },
    onConfirmDate(date) {
      console.log(date)
      this.showDatePicker = false
      this.seleteStartDate = date[0]
      this.seleteEndDate = date[1]
    },
    openPicker() {
      this.showDatePicker = true
      console.log(this.maxDate)
    },
    confirmDialog() {
      if (this.type === 'time') {
        if (!this.seleteStartDate) {
          this.$toast('请选择调整时间')
          return
        }
        if (!this.reason) {
          this.$toast('请输入调整原因')
          return
        }
        this.loading = true
        adjustVisitTask({
          taskId: this.taskId,
          adjustDesc: this.reason,
          adjustStartDateAfter: this.seleteStartDate.getTime(),
          // 获取的结束时间是当天00:00:00，需要加上23:59:59
          adjustEndDateAfter: this.seleteEndDate.getTime()+(24*60*60*1000-1000)
        }).then(res => {
          this.$toast('调整时间成功')
          this.onClose()
          this.$emit('success')
        }).finally(() => {
          this.loading = false
        })
      } else if (this.type === 'cancel') {
        if (!this.reason) {
          this.$toast('请输入取消原因')
          return
        }
        this.loading = true
        cancelVisitTask({
          taskId: this.taskId,
          adjustDesc: this.reason
        }).then(res => {
          this.$toast('取消成功')
          this.onClose()
          this.$emit('success')
        }).finally(() => {
          this.loading = false
        })
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.textarea-container{
  margin-top: 20px;
  background-color: #F5F6F9;
  border-radius: 8px;
}
.dialog-confirm-btn,
.dialog-cancel-btn{
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  font-weight: 500;
  color: #C7CBD3;
  text-align: center;
  flex: 1;
}
.dialog-confirm-btn{
  color: #3A78EF;
}
</style>