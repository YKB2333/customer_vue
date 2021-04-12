<template>
  <div class="col h-full">
    <div class="flex-1 y-scroll ptb10">
      <div class="data-item" v-for="(item, i) in list" :key="i">
        <title-bar border :title="`竞品信息${i+1}`">
          <span slot="left" class="red fs14" v-if="pageType === 'todo'" @click="deleteRow(i)">删除</span>
        </title-bar>
        <van-field disabled label="基础信息" />
        <van-field v-model="item.competeBrand" label="竞品品牌" :placeholder="pageType === 'todo' ? '请输入' : ''" label-class="fw600" :readonly="pageType !== 'todo'" maxlength="20" />
        <van-field v-model="item.competeCate" label="商品品类" :placeholder="pageType === 'todo' ? '请输入' : ''" label-class="fw600" :readonly="pageType !== 'todo'" maxlength="20" />
        <van-field v-model="item.competeCompany" label="竞品公司" :placeholder="pageType === 'todo' ? '请输入' : ''" label-class="fw600" :readonly="pageType !== 'todo'" maxlength="20" />
        <van-field disabled label="活动信息" />
        <van-field :value="getActionName(item.activityType)" label="活动类型" :right-icon="pageType === 'todo' ? 'arrow' : ''" placeholder="请选择" readonly label-class="fw600" @click="inputClick(i, 'type')"  />
        <van-field :value="getDateRange(i)" label="活动周期" :right-icon="pageType === 'todo' ? 'arrow' : ''" placeholder="请选择" readonly label-class="fw600" @click="inputClick(i, 'cycle')"  />
        <div class="plr18" v-if="pageType === 'todo' || item.activityPicList">
          <div class="ptb20 van-hairline--bottom">
            <div class="mb14 fs14 fw600">活动照片</div>
            <div style="margin-left: -8px;">
              <van-grid :column-num="4" :border="false" :gutter="10" square>
                <van-grid-item v-for="(img, imgIndex) in item.activityPicList" :key="img">
                  <div class="relative w-h-full">
                    <img :src="img" class="w-h-full fit-cover radius4" @click="onWxPreviewImage(img, item.activityPicList)" />
                    <img v-if="pageType === 'todo'" :src="require('@/assets/images/icon_delete.png')" class="icon-delete" @click="deleteImage(i, imgIndex)" />
                  </div>
                </van-grid-item>
                <van-grid-item v-if="pageType === 'todo'">
                  <van-uploader multiple result-type="dataUrl" :after-read="(file, detail) => afterRead(i, file, detail)">
                    <img :src="require('@/assets/images/upload_add_img.png')" />
                  </van-uploader>
                </van-grid-item>
              </van-grid>
            </div>
          </div>
        </div>
        <van-field v-model="item.activityDesc" label="活动说明" :placeholder="pageType === 'todo' ? '请输入' : ''" label-class="fw600" :readonly="pageType !== 'todo'" />
        <data-add-cell v-if="pageType === 'todo' && i === list.length - 1" @click.native="addRow">添加竞品</data-add-cell>
      </div>
      <data-add-cell v-if="pageType === 'todo' && list.length === 0" @click.native="addRow">添加竞品</data-add-cell>
    </div>
    <!-- 保存 -->
    <div class="bg-white plr18 ptb10" v-if="pageType === 'todo'">
      <van-button color="#3A78EF" block round :loading="loading" @click="onSave">保存</van-button>
    </div>
    <!-- 活动类型 -->
    <van-action-sheet
      v-model="sheet"
      :actions="actions"
      description="活动类型"
      close-on-click-action
      @select="onSelectSheet"
    />
    <!-- 活动周期日历 -->
    <van-calendar 
      v-model="calendar" 
      type="range" 
      @confirm="onConfirmCalendar" 
      color="#3A78EF"
      :min-date="new Date(2020, 0, 1)"
    />
  </div>
</template>

<script>
import TitleBar from '../components/title-bar'
import DataAddCell from '../components/data-add-cell'
import { taskCompetitorImageUpload, saveTaskCompetitor } from '@/api/visit-task'

export default {
  components: { TitleBar, DataAddCell },
  props: {
    pageType: {
      type: String
    },
    taskId: {
      type: String,
      required: true
    },
    taskCompetitorVos: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      calendar: false,
      sheet: false,
      actions: [
        { name: '新品', value: '1' },
        { name: '促销', value: '2' },
        { name: '新品&促销', value: '3' }
      ],
      currentIndex: -1,
    }
  },
  computed: {},
  watch: {
    taskCompetitorVos: {
      handler: function(arr) {
        this.list = _.cloneDeep(arr || [])
        if (this.list.length === 0) {
          // 填充一个空数组
          this.list.push(_.cloneDeep(this.getItemObj()))
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {},
  methods: {
    getItemObj() {
      return {
        competeBrand: '', // 竞品品牌
        competeCate: '', // 竞品品类
        competeCompany: '', // 竞品公司
        activityType: '', // 活动类型 1-新品,2-促销,3-新品&促销
        // 活动周期
        activityStartDate: 0, // 开始
        activityEndDate: 0, // 结束
        activityPicList: [], // 活动照片
        activityDesc: '', // 活动说明
      }
    },
    addRow() {
      this.list.push(_.cloneDeep(this.getItemObj()))
    },
    deleteRow(i) {
      this.$dialog.confirm({
        message: '确认删除吗？',
        confirmButtonColor: '#3A78EF'
      }).then(() => {
        this.list.splice(i, 1)
      })
    },
    async afterRead(i, file, detail) {
      try {
        let files = Array.isArray(file) ? file : [file]
        this.$store.commit('SHOW_LOADING', '上传图片中...')
        for (const item of files) {
          console.log(item)
          let result = await taskCompetitorImageUpload({
            base64Code: item.content,
            imageName: item.file.name,
            taskId: this.taskId
          })
          console.log(result)
          if (this.list[i].activityPicList === null) {
            this.list[i].activityPicList = []
          }
          this.list[i].activityPicList.push(result)
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.$store.commit('SHOW_LOADING', false)
      }
    },
    onSave() {
      if (this.list.length === 0) {
        this.$toast('竞品信息为空')
        return
      }
      this.loading = true
      saveTaskCompetitor({
        taskId: this.taskId,
        taskCompetitorVos: this.list
      }).then(res => {
        console.log('保存竞品信息成功', res)
        this.$dialog.confirm({
          title: '保存竞品信息成功',
          confirmButtonText: '下一步',
          confirmButtonColor: '#3A78EF'
        }).then(() => {
          this.$emit('success')
        })
      }).finally(() => {
        this.loading = false
      })
    },
    getActionName(value) {
      let i = this.actions.findIndex(e => e.value === value)
      if (i >= 0) {
        return this.actions[i].name
      }
      return ''
    },
    getDateRange(i) {
      if (this.list[i].activityStartDate && this.list[i].activityEndDate) {
        let start = this.list[i].activityStartDate
        let end = this.list[i].activityEndDate
        return `${this.$options.filters.formatDate(start, 'Y-M-D')}至${this.$options.filters.formatDate(end, 'Y-M-D')}`
      }
      return ''
    },
    inputClick(i, val) {
      if (this.pageType === 'todo') {
        this.currentIndex = i
        if (val === 'type') {
          this.sheet = true
        } else if (val === 'cycle') {
          this.calendar = true
        }
      }
    },
    onConfirmCalendar(date) {
      console.log(date)
      this.list[this.currentIndex].activityStartDate = new Date(date[0]).getTime()
      this.list[this.currentIndex].activityEndDate = new Date(date[1]).getTime()
      this.calendar = false
    },
    onSelectSheet(item) {
      console.log(item)
      this.list[this.currentIndex].activityType = item.value
    },
    deleteImage(i, j) {
      this.list[i].activityPicList.splice(j, 1)
    },
    onWxPreviewImage(url, urls = 0) {
      wx.previewImage({
        current: url,
        urls: urls.length === 0 ? [url] : urls
      })
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .van-field--disabled .van-field__label{
  color: #959CA7;
  font-weight: 500;
}
/deep/ .van-cell.van-field{
  padding-top: 20px;
  padding-bottom: 20px;
}
</style>