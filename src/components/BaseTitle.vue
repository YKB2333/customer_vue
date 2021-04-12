<template>
  <div>
    <div :class="['row space-between h60 center-y wpct92 mauto',parent_class]">
      <!-- 标题 -->
      <slot name="title">
        <h4 :class="title_Class ? title_Class :['fw600', 'fs18','flex-1']">{{title || '标题'}}</h4>
      </slot>
      <!-- 右侧文本内容 -->
      <div v-if="isValue || value || this.$slots.value " @click="is_link ? getLink() : null" :class="['row','center-y',right_Class ? right_Class :['fs14']]" style="color:#afafaf;cursor:pointer;">
        <slot name="value">
          {{ value  || '更多'}}
          <van-icon name="arrow" />
        </slot>
        <van-icon name="arrow" color="#afafaf"  v-if="icon"/>
      </div>
    </div>
    <emply v-if="isEmply" />
  </div>
</template>

<script>
export default {
  name: "BaseTitle",
  props: {
    title: { // 标题
      type: String,
      default: ""
    },
    value:{ //  右侧文本
      type: String,
      default: ""
    },
    isValue:{ //  是否显示右侧文本
      type: Boolean,
      default: false
    },
    icon: { // 是否显示 右侧箭头
      type: Boolean,
      default: false
    },
    is_link: { // 是否跳转开关
      type: Boolean,
      default: false
    },
    url:{ //跳转地址
      type: String,
      default: ""
    },
    to:{ //路由跳转地址
    },
    title_Class: { // 标题类格外类名
     type: String,
      default: ""
    },
    right_Class: { // 右侧格外类名
     type: String,
      default: ""
    },
    parent_class: { //  父div class
     type: String,
      default: ""
    },
      isEmply:{ //  是否显示 暂无数据
          type: Boolean,
          default: false
      },
  },
  data() {
    return {};
  },
  computed: {},
  created() {},
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
.emply{
  text-align: center;
  img{
    width:133px;
  }
  p{
    color:rgba(149,156,167,1);
    font-size: 12px;
    padding: 8px 0 8px 8px;
  }
}
</style>
