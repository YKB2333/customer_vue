<template>
  <div id="page">
    <ul class="CustomerCaseList">
        <li v-for="item in 10" :key="item">
          <div>
            <img src="@/assets/images//home/logo1.png" alt />
          </div>
          <div>
            <p class="ellipsis2">阳光刚刚那个那个那个你</p>
            <p class="ellipsis2">
              <span>关键字</span>天王盖地虎
            </p>
          </div>
        </li>
      </ul>
  </div>
</template>

<script>
export default {
  name: 'CustomerOperations',
  components: {},
  data() {
    return {
    }
  },
  computed: {},
  created() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
#page {
  height: 100vh;
  background: white;
  overflow-y: scroll;
}
.CustomerCaseList {
  width: 90%;
  margin: 0 auto;
  margin-bottom: 20px;
  background: #fefeff;
  transform: translateZ(0);
  li {
    background: white;
    padding: 5%;
    display: flex;
    align-items: flex-start;
    text-align: left;
    box-shadow: 0px 2px 11px 0px rgba(159, 190, 240, 0.16);
    margin-bottom: 0.8rem;
    margin-top: 4%;
    border-radius: 5px;
    overflow: hidden;
    div:nth-child(1) {
      // width: 30%;
      width: 6.8rem;
      height: 6.8rem;
      border-radius: 8px;
      border: 1px solid rgba(244, 244, 244, 1);
      overflow: hidden;
      position: relative;
      img {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
    div:nth-child(2) {
      // width: 30%;
      flex: 1;
      margin-left: 12px;
      p {
        margin: 0;
        padding: 0;
      }
      p:nth-child(1) {
        color: #393c41;
        font-size: 16px;
        font-weight: 600;
        margin-top: 10.5%
      }
      p:nth-child(2) {
        margin-top: 8.5%;
        color: #959ca7;
        font-size: 13px;
        span {
          color: #ef9236;
          background: #fdf4ea;
          padding: 2px 4px 2px 4px;
          margin-right: 5%;
        }
      }
    }
  }
}
</style>
