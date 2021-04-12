<template>
  <div id="page">
    <van-pull-refresh v-model="pullRefreshLoading" @refresh="onPullRefreshLoad">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <ul class="CustomerCaseList">
          <li
            v-for="item in list"
            :key="item.item"
            @click="$router.push({
            name: 'UserOperation',
            query: {
              id: item.id2Str
            }
          })"
          >
            <div>
              <img :src="item.logo" alt />
            </div>
            <div>
              <p>{{item.platformName}}</p>
              <p class="ellipsis2">
                <span>关键字</span>
                {{item.tag}}
              </p>
            </div>
          </li>
        </ul>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getOperatePage } from "@/api/findCustomer/customer";
import { isEmpty, showRecentTime } from "@/utils";
export default {
  name: "UserOperationList",
  components: {},
  data() {
    return {
      pullRefreshLoading: false,
      loading: false,
      finished: false,
      pageIndex: 1,
      list: []
    };
  },
  computed: {},
  created() {},
  methods: {
    onLoad() {
      getOperatePage({
        pageIndex: this.pageIndex++,
        pageSize: 10,
        orderStr: "updateTimestamp desc, createTimestamp desc"
      })
        .then(res => {
          if (isEmpty(res.records)) {
            this.finished = true;
          }
          res.records.forEach(item => {
            this.list.push(item);
          });
        })
        .catch(err => {
          this.finished = true;
        })
        .finally(() => {
          // 加载状态结束
          this.loading = false;
          this.pullRefreshLoading = false;
        });
    },
    onPullRefreshLoad() {
      this.pullRefreshLoading = true;
      this.pageIndex = 1;
      this.list = [];
      this.onLoad();
    }
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll); //  离开页面清除（移除）滚轮滚动事件
  }
};
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
        width: 80%;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
    div:nth-child(2) {
      // width: 30%;
      margin-left: 12px;
      p {
        margin: 0;
        padding: 0;
      }
      p:nth-child(1) {
        color: #393c41;
        font-size: 16px;
        font-weight: 600;
        margin-top: 10.5%;
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
.richText {
  overflow: hidden;
  width: 90%;
  margin: 0 auto;
  margin-top: 1.2rem;
  font-size: 15px;
  font-weight: 400;
  color: rgba(57, 60, 65, 1);
  line-height: 30px;
}
.Title-More {
  p {
    padding: 1rem 0 1rem 0;
    margin: 1rem 0 1rem 0;
  }
  width: 90%;
  margin: 0 auto;
  font-size: 18px;
  color: black;
  line-height: 21px;
  text-align: left;
  // font-weight: 600;
  // padding-top: 35px;
  // padding-bottom: 19px;
  padding-top: 0.6rem;
  padding-bottom: 0.2rem;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -ms-flex-line-pack: center;
  align-content: center;
  div {
    color: #959ca7;
    font-weight: 500;
    display: flex;
    align-items: center;
    font-size: 14px;
  }
  i {
    margin-top: -3px;
  }
}
</style>
