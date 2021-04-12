import { getVisitTaskDetail, getSkusByTaskId } from '@/api/visit-task'

export const fetchData = {
  data() {
    return {
      taskDisplayVos: [], // 陈列信息
      taskCompetitorVos: [], // 竞品信息
      summary: {
        demand: '', // 客户需求
        summary: '', // 总结内容
      },
      finishedGoodsList: [],
      taskType: '1', // 1-店铺拜访，2-客户拜访
    }
  },
  methods: {
    init(taskId) {
      return new Promise(async (resolve, reject) => {
        try {
          this.$store.commit('SHOW_LOADING')
          let taskData = await getVisitTaskDetail(taskId)
          this.taskType = taskData.type
          this.taskDisplayVos = taskData.taskDisplayVos || []
          this.taskCompetitorVos = taskData.taskCompetitorVos || []
          this.summary['demand'] = taskData.demand
          this.summary['summary'] = taskData.summary
          let goodsRes = await getSkusByTaskId({ taskId: taskId, pageIndex: 1, pageSize: 999999 })
          this.finishedGoodsList = goodsRes.list
          resolve()
        } catch (error) {
          console.log(error)
          reject()
        } finally {
          this.$store.commit('SHOW_LOADING', false)
        }
      })
    }
  }
}