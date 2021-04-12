<template>
  <div class="title-bar">
    <div :class="{ 'van-hairline--bottom': border }" class="row space-between">
      <span class="title">{{ title }}</span>
      <slot name="left" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    border: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },
  computed: {},
  created() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.title-bar{
  width: 100%;
  height: 55px;
  line-height: 55px;
  padding: 0 14px;
  background-color: #ffffff;
  .title{
    font-weight: 600;
    font-size: 16px;
    &::before{
      display: inline-block;
      content: ' ';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      border: 2px solid #3A78EF;
      margin-right: 4px;
      background-color: transparent;
    }
  }
}
</style>