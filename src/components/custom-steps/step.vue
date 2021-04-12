<template>
  <div class="custom-step__center" @click="stepClick" :class="'is-'+currentStatus">
    <div :class="'custom-step__head--'+direction">
      <img :src="icon" class="custom-status__icon" />
      <div class="custom-step__line" :class="direction"></div>
    </div>
    <div class="custom-step__title" :class="'is-'+currentStatus" :style="{'--active-color': color}" >
      {{ title }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    isSuccess: {
      type: Boolean,
      default: false
    }
  },
  inject: ['direction', 'active', 'color', 'isTabs'],
  data() {
    return {
      index: -1,
      currentStatus: ''
    }
  },
  computed: {
    icon() {
      const map = {
        'wait': require('./icons/wait.png'),
        'process': require('./icons/process.png'),
        'finished': require('./icons/finished.png'),
      }
      return map[this.currentStatus] || require('./icons/wait.png')
    }
  },
  mounted() {
    this.index = this.$parent.$children.findIndex(e => e._uid === this._uid)
    this.$watch('$parent.active', (val) => {
      this.updateStatus(val)
    }, { immediate: true });

    if (this.isTabs) {
      this.$watch('isSuccess', (val) => {
        if (val && this.index !== this.$parent.active) {
          this.updateStatus(this.$parent.active)
        }
      }, { immediate: true });
    }
  },
  methods: {
    updateStatus(active) {
      if (this.index < 0 || active < 0 || this.index > active) {
        this.currentStatus = 'wait'
        if (this.isTabs && this.isSuccess) this.currentStatus = 'finished'
      } if (this.index === active) {
        this.currentStatus = 'process'
      } else if (this.index < active) {
        this.currentStatus = 'finished'
        if (this.isTabs && this.isSuccess) {
          this.currentStatus = 'finished'
        } else {
          this.currentStatus = 'wait'
        }
      }
    },
    stepClick() {
      this.$parent.$emit('click-step', this.index)
    },
  }
};
</script>
<style lang="scss" scoped>
.custom-step__title{
  font-size: 14px;
  color: #909399;
}
.custom-step__center{
  flex-basis: 50%;
}
.custom-step__center .custom-step__line{
  position: absolute;
  right: -50%;
  left: 50%;
  height: 1px;
  z-index: 0;
  &.horizontal{
    border-top: 1px dashed #C7CBD3;
  }
}
.custom-step__head--horizontal{
  display: flex;
  align-items: center;
  position: relative;
}
.custom-step__center:last-of-type .custom-step__line{
  display: none;
}
.custom-step__center .custom-step__title{
  text-align: center;
  margin-top: 6px;
  font-weight: 500;
}
.custom-step__center .custom-step__head--horizontal{
  justify-content: center;
}
.custom-status__icon{
  width: 24px;
  height: 24px;
  z-index: 1;
}
.is-process,
.is-finished{
  &.custom-step__title{
    color: var(--active-color);
  }
}
</style>