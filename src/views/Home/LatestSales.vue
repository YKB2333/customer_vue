<template>
  <div id="page">
    <ul class="LatestSales">
      <van-list
        v-model="loading"
        :error="channelError"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <li v-for="(item,index) in list" :key="index">
          <div class="LatestSalesLeft">
          <img src="@/assets/images/find/default_customer_logo.png" alt />
          </div>
          <div class="LatestSalesRight">
              <div>
                <p>{{ item.ywName }}</p>
                <p class="ellipsis">{{ item.orgName }}</p>
                <p>{{showRecentTime(item.billDate)}}</p>
              </div>
              <div>
                <p>喜获“{{ item.csName == null ? "未分类客户" : item.csName }}”下单 <span>{{ toThousandFilter(item.mny / 10000) }}万元</span></p>
              </div>
          </div>
        </li>
      </van-list>
    </ul>
  </div>
</template>

<script>
import { showRecentTime ,toThousandFilter} from "@/utils";
import { getNotice} from "@/api/index";
export default {
  name: 'LatestSales',
  components: {},
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      channelError: false,
      query: {
        pageIndex: 1,
        pageSize: 3,
      },
    }
  },
  computed: {},
  created() {},
  methods: {
    onLoad() {
      getNotice(this.query).then(res => {
        // this.list = this.list.concat(res.records)
        this.list.push(...res.records)
        // // 加载状态结束
        this.query.pageIndex++;
        //   // 数据全部加载完成
        if (res.records.length < 3) {
          this.finished = true;
        }

      })
      .catch(e => {
        this.channelError = true;
      })
      .finally(() => {
        this.loading = false;
      });
    },
    showRecentTime,
    toThousandFilter
    // {{showRecentTime(item.createTimestamp)}}

  }
}
</script>

<style lang="scss" scoped>
#page {
  height: 100vh;
  background: white;
  overflow-x: hidden;
}
.LatestSales {
  margin: 0 auto;
  background: #fefeff;
  li {
    background: white;
    padding:5.2% 5% 5.2% 5%;
    margin-bottom: 0.8rem;
    overflow: hidden;
    border-radius:8px;
    display: flex;
    align-content: center;
    align-items: center;
    text-align: left;
    overflow: hidden;
    position: relative;
    .salesBottomP{
        font-size:14px;
        color:rgba(149,156,167,1);
        line-height:18px;
        margin-top: 1.4rem;
    }
  }
  li:after{
    content: '';
    position: absolute;
    bottom: 0;
    width: 90%;
    height: 1px;
    background:rgba(245,246,249,1);
    transform: scaleY(0.5);
  }
  .LatestSalesLeft{
    // width: 30%;
    width: 3.5rem;
    height: 3.5rem;
    border: 1px solid rgba(244, 244, 244, 1);
    overflow: hidden;
    position: relative;
    border-radius:50%;
    img {
      width:100%;
      height:100%;
      position: absolute;
      left: 50%;
      top: 50%;
      border-radius:50%;
      transform: translate(-50%, -50%);
    }
  }
  .LatestSalesRight{
    // width: 30%;
    overflow: hidden;
    margin-left: 3%;
    flex: 1;
    div{
      overflow: hidden;
    }
    p {
      margin: 0;
      padding: 0;
    }
    div:nth-child(1){
      display: flex;
      position: relative;
      align-items: flex-end;
      margin-bottom: 0.4rem;
      p:nth-child(1){
        font-size:16px;
        color:rgba(57,60,65,1);
        line-height:16px;
        margin-right: 3%;
      }
      p:nth-child(2){
        width: 60%;
        font-size:12px;
        color:rgba(149,156,167,1);
        line-height:12px;
      }
      p:nth-child(3){
        float: right;
        font-size:12px;
        color:rgba(149,156,167,1);
        line-height:12px;
        position: absolute;
        right: 5%;
      }
    }
    div:nth-child(2){
      p{
        font-size:14px;
        color:rgba(57,60,65,1);
        line-height:14px;
        span{
          color:#ec4969;
        }
      }
    }
  }
}
.userfInfo{
    overflow: hidden;
    width: 90%;
    margin: 0 auto;
    font-size:15px;
    font-weight:400;
    color:rgba(57,60,65,1);
    line-height:30px;
}
</style>
