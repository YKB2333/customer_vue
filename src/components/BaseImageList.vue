<template>
  <div :class="['row','space-between','wpct92','mauto',type == 'right' ? 'row-reverse':'',parent_class ]" @click="is_link ? getLink() : null" >
    <!-- 文字 -->
    <div class="flex-1" :class="[type == 'right' ? 'ml16' :'mr16',Title_Class]" style="overflow: hidden;">
      <slot name="title">
        <div style="color:#262626" class="mt10">
          <p class="h44 fs16 fw500 ellipsis2" >{{ title }}</p>
        </div>
        <slot name="value">
          <div style="color:#AFAFAF" class="mt14">
            <span class="fs12 " >{{ value }}</span>
          </div>
        </slot>
      </slot>
    </div>
    <!-- img -->
    <slot name="img">
      <div :class="imgClass? imgClass :'w100 h100'" style="background:white" >
       <img :src="src || require('@/assets/images/defaultLogo.png')" style="width:100%;height:100%;object-fit: contain;" alt="">
      </div>
    </slot>
  </div>
 
</template>

<script>
export default {
  name: "BaseImagelist",
  props: {
    type:{ // 图文左右方向
      type: String,
      default: "left"
    },
    title: { // 标题
      type: String,
      default: ""
    },
    value:{ //  标题下文本
      type: String,
      default: ""
    },
    src:{ //  图片地址
      type: String,
      default: ""
    },
    is_link: { // 是否跳转开关
      type: Boolean,
      default: false
    },
    url:{ //跳转地址
      type: String,
      default: ""
    },
    imgClass:{ //img样式
      type: String,
      default: ""
    },
    to:{ //路由跳转地址
    },
    parent_class: { //  父div class
     type: String,
      default: ""
    },
    Title_Class:{
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  },
  computed: {},
  created() {
    console.log(this.src);
  },
  mounted() {
  },
  methods: {
    getLink() {
      if(this.url) window.location.href= this.url;
      if(this.to)  this.$router.push( this.to.hasOwnProperty('path') ? this.to :{ path: this.to  })
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
