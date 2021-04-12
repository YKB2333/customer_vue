<template>
  <div class="col h-full">
    <div class="flex-1 y-scroll ptb10">
      <div class="ptb20 plr18 bg-white">
        <div class="fs14 fw600 mb14">客户需求</div>
        <van-field
          v-model="form.demand"
          rows="6"
          type="textarea"
          placeholder="请输入"
          style="padding: 0;"
          :readonly="pageType !== 'todo'"
        />
      </div>
      <div class="ptb20 plr18 bg-white mt10">
        <div class="fs14 fw600 mb14">拜访总结</div>
        <van-field
          v-model="form.summary"
          rows="6"
          type="textarea"
          placeholder="请输入"
          style="padding: 0;"
          :readonly="pageType !== 'todo'"
        />
      </div>
    </div>
    <div class="bg-white plr18 ptb10" v-if="pageType === 'todo'">
      <van-button color="#3A78EF" block round :loading="loading" @click="onSave">提交</van-button>
    </div>
  </div>
</template>

<script>
import { submitVisitTaskSummary, getVisitTaskDetail, getSkusByTaskId } from '@/api/visit-task'

export default {
  props: {
    pageType: {
      type: String
    },
    taskId: {
      type: String,
      required: true
    },
    summary: {
      type: Object,
      default: () => {
        return {
          demand: '',
          summary: ''
        }
      }
    }
  },
  data() {
    return {
      form: {
        demand: '',
        summary: ''
      },
      loading: false
    }
  },
  watch: {
    summary: {
      handler: function(val) {
        this.form = _.cloneDeep(val)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    async onSave() {
      try {
        this.loading = true
        let data = await getVisitTaskDetail(this.taskId)
        if (data.type === '1') { // 店铺拜访
          if (!data.taskDisplayVos || data.taskDisplayVos.length === 0) {
            this.$toast('请填写陈列信息')
            return
          } else if (data.isCheckStock === '是') {
            let goods = await getSkusByTaskId({ taskId: this.taskId, pageIndex: 1, pageSize: 999999 })
            if (goods.list.length === 0) {
              this.$toast('请填写商品信息')
              return
            }
          }
        }
        if (!this.form.demand) {
          this.$toast('请输入客户需求')
          return
        }
        if (!this.form.summary) {
          this.$toast('请输入拜访总结')
          return
        }
        let param = Object.assign(this.form, { taskId: this.taskId })
        await submitVisitTaskSummary(param)
        this.$dialog.confirm({
          title: '提交成功',
          confirmButtonText: '确定',
          confirmButtonColor: '#3A78EF'
        }).then(() => {
          this.$emit('success')
        })
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    }
  },
};
</script>
<style lang="scss" scoped>
</style>