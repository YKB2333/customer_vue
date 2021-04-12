<template>
  <div class="col h-full">
    <div class="flex-1 y-scroll ptb10">
      <div class="data-item" v-for="(item, i) in list" :key="i">
        <title-bar border :title="`陈列台${i+1}`">
          <span slot="left" class="red fs14" v-if="pageType === 'todo'" @click="deleteRow(i)">删除</span>
        </title-bar>
        <div class="plr18">
          <div class="row center-y van-hairline--bottom ptb16">
            <div class="fs14 fw600 pr24">陈列类型</div>
            <div>
              <van-button class="type-btn" round :type="item.displayType === '1' ? 'info' : 'default'" @click="onDisplayType(item, '1')">收银台</van-button>
              <van-button class="type-btn" round :type="item.displayType === '2' ? 'info' : 'default'" @click="onDisplayType(item, '2')">地推</van-button>
              <van-button class="type-btn" round :type="item.displayType === '3' ? 'info' : 'default'" @click="onDisplayType(item, '3')">货架</van-button>
            </div>
          </div>
          <div class="van-hairline--bottom ptb16" v-if="pageType === 'todo' || item.popImages">
            <div class="fs14 fw600 mb16">POP照片</div>
            <div style="margin-left: -14px;">
              <van-grid :column-num="4" :border="false" :gutter="10" square>
                <van-grid-item v-for="(img, imgIndex) in item.popImages" :key="img">
                  <div class="relative w-h-full">
                    <img :src="img" class="w-h-full fit-cover radius4" @click="onWxPreviewImage(img, item.popImages)" />
                    <img v-if="pageType === 'todo'" :src="require('@/assets/images/icon_delete.png')" class="icon-delete" @click="deleteImage('pop', i, imgIndex)" />
                  </div>
                </van-grid-item>
                <van-grid-item v-if="pageType === 'todo'">
                  <van-uploader multiple result-type="dataUrl" :after-read="(file, detail) => afterRead('pop', i, file, detail)">
                    <img :src="require('@/assets/images/upload_add_img.png')" />
                  </van-uploader>
                </van-grid-item>
              </van-grid>
            </div>
          </div>
          <div class="ptb16" v-if="pageType === 'todo' || item.displayImages">
            <div class="fs14 fw600 mb16">陈列照片</div>
            <div style="margin-left: -14px;">
              <van-grid :column-num="4" :border="false" :gutter="10" square>
                <van-grid-item v-for="(img, imgIndex) in item.displayImages" :key="img">
                  <div class="relative w-h-full">
                    <img :src="img" class="w-h-full fit-cover radius4" @click="onWxPreviewImage(img, item.displayImages)" />
                    <img v-if="pageType === 'todo'" :src="require('@/assets/images/icon_delete.png')" class="icon-delete" @click="deleteImage('display', i, imgIndex)" />
                  </div>
                </van-grid-item>
                <van-grid-item v-if="pageType === 'todo'">
                  <van-uploader multiple result-type="dataUrl" :after-read="(file, detail) => afterRead('display', i, file, detail)">
                    <img :src="require('@/assets/images/upload_add_img.png')" />
                  </van-uploader>
                </van-grid-item>
              </van-grid>
            </div>
          </div>
        </div>
        <data-add-cell v-if="pageType === 'todo' && i === list.length - 1" @click.native="addRow">添加陈列台</data-add-cell>
      </div>
      <data-add-cell v-if="pageType === 'todo' && list.length === 0" @click.native="addRow">添加陈列台</data-add-cell>
    </div>
    <!-- 保存 -->
    <div class="bg-white plr18 ptb10" v-if="pageType === 'todo'">
      <van-button color="#3A78EF" block round :loading="loading" @click="onSave">保存</van-button>
    </div>
  </div>
</template>

<script>
import TitleBar from '../components/title-bar'
import DataAddCell from '../components/data-add-cell'
import { saveDisPlayDetail, disPlayImageUpload } from '@/api/visit-task'

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
    taskDisplayVos: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      list: [],
      loading: false,
    }
  },
  watch: {
    taskDisplayVos: {
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
  methods: {
    getItemObj() {
      return {
        taskId: this.taskId, 
        popImages: [], 
        displayType: '1', 
        displayImages: []
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
    async afterRead(type = 'pop', i, file, detail) {
      try {
        console.log(type, file)
        let files = Array.isArray(file) ? file : [file]
        this.$store.commit('SHOW_LOADING', '上传图片中...')
        for (const item of files) {
          console.log(item)
          let result = await disPlayImageUpload({
            base64Code: item.content,
            imageName: item.file.name,
            taskId: this.taskId
          })
          if (type === 'pop') {
            if (this.list[i].popImages === null) this.list[i].popImages = []
            this.list[i].popImages.push(result)
          } else if (type === 'display') {
            if (this.list[i].displayImages === null) this.list[i].displayImages = []
            this.list[i].displayImages.push(result)
          }
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.$store.commit('SHOW_LOADING', false)
      }
    },
    deleteImage(type = 'pop', i, j) {
      if (type === 'pop') {
        this.list[i].popImages.splice(j, 1)
      } else if (type === 'display') {
        this.list[i].displayImages.splice(j, 1)
      }
    },
    onSave() {
      // console.log('保存', this.list)
      if (this.list.length === 0) {
        this.$toast('陈列信息为空')
        return
      } else {
        if (this.list.some(e => e.popImages.length === 0)) {
          this.$toast('POP照片不能为空')
          return
        } else if (this.list.some(e => e.displayImages.length === 0)) {
          this.$toast('陈列照片不能为空')
          return
        }
      }
      this.loading = true
      saveDisPlayDetail({
        taskId: this.taskId,
        taskDisplayVos: this.list
      }).then(res => {
        console.log('保存陈列信息成功', res)
        this.$dialog.confirm({
          title: '保存陈列信息成功',
          confirmButtonText: '下一步',
          confirmButtonColor: '#3A78EF'
        }).then(() => {
          this.$emit('success')
        })
      }).finally(() => {
        this.loading = false
      })
    },
    onDisplayType(item, displayType) {
      if (this.pageType === 'todo') {
        item.displayType = displayType
      }
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
</style>