<template>
  <div class="wrapper" @click="wrapperClick">
    <div class="company-name">{{ type === '1' ? shopName : customerName }}</div>
    <div v-if="address" class="address-cell-wrapper">
      <img :src="require('@/assets/images/task_icon_adr.png')" class="w-h14">
      <span class="address ellipsis">{{ address }}</span>
    </div>
    <div v-if="startDate" class="time-cell-wrapper">
      <img :src="require('@/assets/images/task_icon_time.png')" class="w-h14">
      <span class="time">{{ startDate | formatDate('Y-M-D') }} 至 {{ endDate | formatDate('M-D') }}</span>
    </div>
    <div v-if="code">
      <img :src="require('@/assets/images/task_icon_num.png')" class="w-h14">
      <span class="code">{{ code }}</span>
    </div>
    <van-button @click="actionClick" v-if="btnText" type="info" round class="action-btn">{{ btnText }}</van-button>
    <img v-if="taskStatus === '5'" :src="require('@/assets/images/task_img_ov.png')" class="overdate-img" />
    <van-tag v-else-if="taskStatus === '3'" color="#00C873" plain round size="medium" class="task-status">已完成</van-tag>
    <van-tag v-else-if="taskStatus === '1'" color="#FFA940" plain round size="medium" class="task-status">待处理</van-tag>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String
    },
    // 客户名称
    customerName: {
      type: String
    },
    shopName: {
      type: String
    },
    // 地址
    address: {
      type: String
    },
    // 任务单号
    code: {
      type: [String, Number]
    },
    btnText: {
      type: String
    },
    taskStatus: {
      type: String
    },
    startDate: {
      type: Number
    },
    endDate: {
      type: Number
    },
  },
  data() {
    return {
    }
  },
  computed: {},
  created() {},
  methods: {
    wrapperClick() {
      this.$emit('click')
    },
    actionClick() {
      this.$emit('action')
    }
  },
};
</script>
<style lang="scss" scoped>
.wrapper{
  background-color: #ffffff;
  border-radius: 16px;
  padding: 20px 14px;
  position: relative;
  margin-top: 10px;
}
.company-name{
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 18px;
  color: #393C41;
}
.address,
.code{
  font-size: 13px;
  color: #393C41;
  padding-left: 6px;
  font-weight: 500;
  flex: 1;
}
.time{
  color: #3A78EF;
  font-size: 13px;
  font-weight: 500;
  padding-left: 6px;
}
.address-cell-wrapper,
.time-cell-wrapper{
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}
.action-btn{
  height: 28px;
  line-height: 28px;
  font-weight: 600;
  padding-left: 20px;
  padding-right: 20px;
  position: absolute;
  right: 14px;
  bottom: 14px;
}
.overdate-img{
  position: absolute;
  right: 4px;
  bottom: 4px;
  width: 68px;
  height: 54px;
}
.task-status{
  position: absolute;
  right: 14px;
  bottom: 20px;
}
</style>