<template>
  <div class="plr18 bg-white">
    <div class="data-add-cell-wrapper van-hairline--top">
      <img :src="require('@/assets/images/data_icon_add.png')" class="w-h16" />
      <span class="text"><slot></slot></span>
    </div>
  </div>
</template>

<script>
export default {
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
.data-add-cell-wrapper{
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 0;
  .text{
    color: #3A78EF;
    font-size: 14px;
    padding-left: 4px;
  }
}
</style>