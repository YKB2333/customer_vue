<template>
  <van-dialog 
    v-bind="$attrs" 
    v-on="$listeners"
    confirm-button-text="我知道了"
    confirm-button-color="#3A78EF"
    @open="onOpen">
    <div class="ptb40 col center-x">
      <div><img :src="require('@/assets/images/img_check.png')" class="w-h90" /></div>
      <div class="mt30" style="color: #3A78EF;">
        <p class="fs40 fw600" style="font-family: Impact;">{{ new Date().getTime() | formatDate('h:m') }}</p>
        <p class="fs14 mt12 fw500">{{ type === 'in' ? '进店' : '离店' }}打卡成功</p>
      </div>
    </div>
  </van-dialog>

</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'in'
    }
  },
  data() {
    return {
    }
  },
  computed: {},
  created() {},
  methods: {
    onOpen() {
      // console.log('onOpen')
    }
  },
};
</script>
<style lang="scss" scoped>
</style>