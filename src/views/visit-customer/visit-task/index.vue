<template>
  <div class="bg-main y-scroll" style="height: 100%;">
    <van-tabs 
      v-model="activeName" 
      line-width="30px"
      title-active-color="#303133"
      title-inactive-color="#909399"
      color="#3C7EFF"
      sticky
      @click="onClick"
    >
      <van-tab title="当前任务" name="today">
        <div class="plr18 pb20">
          <task-item 
            v-for="item in today.list" :key="item.id.toString()"
            :type="item.type"
            :customer-name="item.customerName"
            :shop-name="item.shopName"
            :address="item.address"
            :start-date="item.startDate"
            :end-date="item.endDate"
            :code="item.id.toString()"
            btn-text="去完成"
            @click="toTaskDetail(item)"
          />
        </div>
        <van-loading v-if="today.loading" class="text-center mt20">加载中...</van-loading>
        <list-empty v-if="today.list.length === 0 && today.finished" />
      </van-tab>
      <van-tab title="待办任务" name="todo">
        <div class="plr6">
          <van-search 
            v-model="todo.query.name"
            placeholder="请输入客户名/店铺名"
            background="transparent"
            :show-action="todo.query.name ? true : false"
            @search="onSearch"
            @cancel="onCancel"
          />
        </div>
        <van-list
          v-model="todo.loading"
          :finished="todo.finished"
          :error.sync="todo.error"
          error-text="请求失败，点击重新加载"
          :immediate-check="true"
          @load="onLoad('todo')">
          <div class="plr18">
            <van-steps direction="vertical">
              <van-step v-for="item in todoList" :key="item.startDate">
                <div>
                  <span class="steps-title">{{ item.startDate | formatDate('Y.M.D') }} | {{ item.startDate | formatWeekText }}</span>
                </div>
                <div>
                  <task-item 
                    v-for="task in item.list" :key="task.id.toString()"
                    :type="task.type"
                    :customer-name="task.customerName"
                    :shop-name="task.shopName"
                    :address="task.address"
                    :start-date="task.startDate"
                    :end-date="task.endDate"
                    :code="task.id.toString()"
                    :task-status="task.taskStatus"
                    @click="toTaskDetail(task)"
                  />
                </div>
                <div slot="active-icon" class="steps-icon"></div>
                <div slot="inactive-icon" class="steps-icon"></div>
              </van-step>
            </van-steps>
          </div>
          <van-loading slot="loading" class="text-center mt20">加载中...</van-loading>
          <div slot="finished">
            <list-empty v-if="todoList.length === 0 && today.finished" />
            <span v-else>没有更多数据了</span>
          </div>
        </van-list>
      </van-tab>
      <van-tab title="历史任务" name="history">
        <div class="plr6">
          <van-search 
            v-model="history.query.name"
            placeholder="请输入客户名/店铺名"
            background="transparent"
            :show-action="history.query.name ? true : false"
            @search="onSearch"
            @cancel="onCancel"
          />
        </div>
        <van-list
          v-model="history.loading"
          :finished="history.finished"
          :error.sync="history.error"
          error-text="请求失败，点击重新加载"
          :immediate-check="true"
          @load="onLoad('history')">
          <div class="plr18">
            <van-steps direction="vertical">
              <van-step v-for="item in historyList" :key="item.startDate">
                <div>
                  <span class="steps-title">{{ item.startDate | formatDate('Y.M.D') }} | {{ item.startDate | formatWeekText }}</span>
                </div>
                <div>
                  <task-item 
                    v-for="task in item.list" :key="task.id.toString()"
                    :type="item.type"
                    :customer-name="task.customerName"
                    :shop-name="item.shopName"
                    :address="task.address"
                    :start-date="task.startDate"
                    :end-date="task.endDate"
                    :code="task.id.toString()"
                    :task-status="task.taskStatus"
                    @click="toTaskDetail(task)"
                  />
                </div>
                <div slot="active-icon" class="steps-icon"></div>
                <div slot="inactive-icon" class="steps-icon"></div>
              </van-step>
            </van-steps>
          </div>
          <van-loading slot="loading" class="text-center mt20">加载中...</van-loading>
          <div slot="finished">
            <list-empty v-if="historyList.length === 0 && history.finished" />
            <span v-else>没有更多数据了</span>
          </div>
        </van-list>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import TaskItem from '../components/task-item'
import ListEmpty from '../components/list-empty'
import { getToDayTasks, getWaitTasks, getHistoryTasks } from '@/api/visit-task'
import { groupByList } from '@/utils'

export default {
  name: 'VisitTask',
  components: { TaskItem, ListEmpty },
  data() {
    return {
      // today todo history
      activeName: 'today',
      // 今日任务列表
      today: {
        loading: false,
        finished: false,
        list: []
      },
      todo: {
        query: {
          pageIndex: 1,
          pageSize: 40,
          orderStr: 'createDate desc',
          name: ''
        },
        list: [],
        loading: false,
        error: false,
        finished: false
      },
      history: {
        query: {
          pageIndex: 1,
          pageSize: 40,
          orderStr: 'createDate desc',
          name: ''
        },
        list: [],
        loading: false,
        error: false,
        finished: false
      }
    }
  },
  computed: {
    todoList() {
      let finalList = groupByList(this.todo.list).sort((a, b) => a.startDate - b.startDate) // 升序
      // console.log('todoList===', finalList)
      return finalList
    },
    historyList() {
      let finalList = groupByList(this.history.list).sort((a, b) => a.startDate - b.startDate)
      // console.log('historyList===', finalList)
      return finalList
    }
  },
  created() {
    // 获取今日任务列表
    this.init()
    // 事件监听
    // this.$eventHub.$off(this.$eventName['REFRESH_TASK_LIST'])
    this.$eventHub.$on(this.$eventName['REFRESH_TASK_LIST'], () => {
      console.log('事件监听----刷新列表')
      console.log(this.activeName)
      if (this.activeName === 'today') {
        this.init()
      } else {
        this.resetCurrent()
        this.onLoad(this.activeName)
      }
    })
    this.$once('hook:beforeDestroy', () => {
      console.log('beforeDestroy')
      this.$eventHub.$off(this.$eventName['REFRESH_TASK_LIST'])
    })
  },
  methods: {
    init() {
      this.today.loading = true
      getToDayTasks().then(res => {
        // console.log(res, 'today')
        this.today.list = res || []
        this.today.finished = true
      }).finally(() => {
        this.today.loading = false
      })
    },
    toTaskDetail(item) {
      // if (item.taskStatus === '3') { // 如果已完成
      //   this.$router.push({ 
      //     path: '/visit-task-form',
      //     query: {
      //       pageType: 'finished',
      //       taskId: item.id
      //     }
      //   })
      // } else {
      // }
      this.$router.push({
        path: '/visit-task-detail',
        query: {
          id: item.id
        }
      })
    },
    onClick(name, title) {
      // console.log(name, title)
      if (name === 'today') this.init()
    },
    onLoad(name) {
      // console.log('onLoad', name)
      let target = this[name]
      if (target.loadig || target.finished || target.error) return
      // console.log(target)
      const fetch = {
        'todo': getWaitTasks,
        'history': getHistoryTasks
      }
      target['loading'] = true
      fetch[name](target.query).then(res => {
        target['list'] = target['list'].concat(res.list || [])
        target['finished'] = res.list.length === 0
        target['query'].pageIndex += 1
        // console.log(target['list'], 'name')
      }).catch(() => {
        target['error'] = false
      }).finally(() => {
        target['loading'] = false
      })
    },
    onSearch(value) {
      console.log('搜索', value)
      this.resetCurrent()
      this.onLoad(this.activeName)
    },
    onCancel() {
      console.log('取消搜索', this.todo.query.name)
      this.resetCurrent()
      this.onLoad(this.activeName)
    },
    resetCurrent() {
      this[this.activeName].query.pageIndex = 1
      this[this.activeName].list.length = 0
      this[this.activeName].loading = false
      this[this.activeName].error = false
      this[this.activeName].finished = false
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .van-tab{
  font-size: 15px;
}
/deep/ .van-tabs__wrap{
  padding: 0 14px;
  background-color: #ffffff;
}
/deep/ .van-search__content{
  background-color: #ffffff;
  border-radius: 18px;
}
/deep/ .van-steps{
  background-color: transparent;
}
.steps-icon{
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: transparent;
  border: 2px solid #C7CBD3;
}
.steps-title{
  font-weight: 600;
  color: #393C41;
  font-size: 14px;
  margin-right: 8px;
}
/deep/ .van-step--vertical:first-child::before{
  background-color: transparent !important;
}
/deep/ .van-step--vertical::after{
  border: none;
}
/deep/ .van-step--vertical .van-step__line{
  width: 2px;
  left: -16px;
}
</style>