<template>
  <div>
    <div class="emply">
      <img src="@/assets/images/isEmply.png" alt />
      <p>暂无数据~</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'emply',
  data() {
    return{
      
    }
  },
  methods: {

  },
  props:{

  }
};
</script>

<style lang="scss" scoped>
.emply{
  text-align: center;
  padding:10px 0;
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