<template>
  <section class="page">
    <!-- 销售案例课程 -->
    <van-list
      v-model="loading"
      :finished="finished"
      :error="error"
      :offset="100"
      finished-text="没有更多了"
      error-text="加载失败，请稍后再试"
      @load="onLoad"
    >
      <ul class="course">
        <li
          v-for="item in salesExamples"
          :key="item.relationKey"
          @click="$router.push({path:'casedetails',query:{id:item.relationKey}})"
        >
          <div>
            <p class="ellipsis2">{{item.title}}</p>
            <p>
              <span @click.stop="cancelCollect(item)" class="flex center-y">
                <img :src="collectIcon" alt />
              </span>
            </p>
          </div>
          <div>
            <img :src="item.image" alt />
          </div>
        </li>
      </ul>
    </van-list>
  </section>
</template>

<script>
import { savePosition } from "@/mixins";
import { favoritePage } from "@/api/common";
import { cancelFavorite } from "@/api/findCustomer";
import { cmsCategoryId } from '@/config'
export default {
  name: "FindCustomer",
  components: {},
  mixins: [new savePosition()],
  data() {
    return {
      loading: false,
      finished: false,
      error: false,
      query: {
        pageIndex: 1,
        pageSize: 5
      },
      salesExamples: [],
      likeIcon: require("@/assets/images/find/client_icon_like@2x.png"),
      likePreIcon: require("@/assets/images/find/client_icon_like_pre@2x.png"),
      collectIcon: require("@/assets/images/find/client_icon_collect@2x.png"),
      collectPreIcon: require("@/assets/images/find/client_icon_collect_pre@2x.png")
    };
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    onLoad() {
      favoritePage(this.query)
        .then(res => {
          res.list.forEach(e => {
            this.salesExamples.push(e);
          });
          if (res.list.length < this.query.pageSize) {
            this.finished = true;
          }
          this.query.pageIndex += 1;
        })
        .catch(e => {
          this.error = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    clickLike(item) {
      if (item.like) {
        cancelLike(item.id).then(res => {
          item.like = false;
          item.likeCount -= 1;
        });
      } else {
        item.contentType = 'customerSalesExample'
        addLike(item).then(res => {
          item.like = true;
          item.likeCount += 1;
        });
      }
    },
    cancelCollect(item) {
      cancelFavorite(item.relationKey).then(res => {
        this.salesExamples = this.salesExamples.filter(e => {
          return e.relationKey != item.relationKey;
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.page{
  height: 100vh;
  background: white;
}
// 销售案例课程
.course {
  width: 90%;
  margin: 0 auto;
  margin-bottom: 20px;
  li {
    padding: 5.5%;
    display: flex;
    align-content: center;
    align-items: center;
    text-align: left;
    box-shadow: 0px 2px 11px 0px rgba(159, 190, 240, 0.16);
    border-radius: 8px;
    margin-bottom: 1rem;
    div:nth-child(1) {
      width: 70%;
      margin-right: 3%;
      p:nth-child(1) {
        color: #393c41;
        font-size: 16px;
        font-weight: 600;
        letter-spacing: 2px;
      }
      p:nth-child(2) {
        margin-top: 14px;
        color: #959ca7;
        font-size: 12px;
        display: flex;
        align-items: center;
        span{
          margin-right: 24px;
          display: flex;
          align-content: center;
          img{
            width: 22px;
            height: 22px;
            margin-right: 5px;;
          }
        }
      }
    }
    div:nth-child(2) {
      width: 30%;
      img {
        width: 100%;
        height: 76px;
        object-fit: cover;
      }
    }
  }
}
</style>