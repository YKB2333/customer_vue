<template>
  <div :class="'custom-steps--'+direction" :style="{ 'background-color': background }">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    background: {
      type: String,
      default: '#ffffff'
    },
    active: {
      type: Number,
      default: 0
    },
    // vertical/horizontal
    direction: {
      type: String,
      default: 'horizontal'
    },
    color: {
      type: String,
      default: '#393C41'
    },
    isTabs: {
      type: Boolean,
      default: false
    }
  },
  provide(){
    return {
      direction: this.direction,
      active: this.active,
      color: this.color,
      isTabs: this.isTabs
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
.custom-steps--horizontal{
  display: flex;
  padding: 10px 0;
}
.custom-steps--vertical{
  display: flex;
  flex-direction: column;
}
</style>