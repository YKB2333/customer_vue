 <template>
  <div id="page">
    <div id="backTop"></div>
    <van-pull-refresh v-model="pullRefreshLoading" @refresh="onPullRefreshLoad">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <ul class="IndustryInformation pt20">
          <template v-for="item in list">
            <li
              :key="item.id"
              @click="$router.push({
                name: 'CustomerInfoDetails',
                query: {
                  id: item.id
                }
              })"
            >
              <div>
                <img :src="item.titleImage" alt />
              </div>
              <div>
                <p class="ellipsis2">{{item.title}}</p>
                <p>{{item.source}} · {{showRecentTime(item.createTimestamp)}}</p>
              </div>
            </li>
          </template>
        </ul>
      </van-list>
    </van-pull-refresh>

    <!-- 回到顶部 -->
    <van-button type="default" class="backTop" @click="backTop" v-show="flag_scroll">
      <van-icon name="arrow-up" size="20" />
    </van-button>
  </div>
</template>

<script>
import { selectPage as cmsSelectPage } from '@/api/cms'
import { cmsCategoryId } from '@/config'
import { isEmpty, showRecentTime } from '@/utils'
import { CellGroup } from 'vant'
export default {
  name: 'CustomerInfoList',
  components: {},
  data() {
    return {
      pullRefreshLoading: false,
      loading: false,
      finished: false,
      flag_scroll: false,
      pageIndex: 1,
      list: []
    }
  },
  computed: {},
  created() {},
  mounted() {
    window.addEventListener('scroll', this.handleScroll, true) // 监听（绑定）滚轮滚动事件
  },
  methods: {
    showRecentTime,
    handleScroll: function() {
      // console.info(document.getElementById('page'))
      if (
        document.getElementById('page') &&
        document.getElementById('page').scrollTop
      ) {
        let scrollTop = document.getElementById('page').scrollTop // div 到头部的距离
        scrollTop == 0 ? (this.flag_scroll = false) : (this.flag_scroll = true)
      }
    },
    backTop() {
      document
        .getElementById('backTop')
        .scrollIntoView({ behavior: 'smooth', block: 'start' })
    },
    onLoad() {
      cmsSelectPage({
        pageIndex: this.pageIndex++,
        pageSize: 10,
        infoCategoryId: cmsCategoryId.custInfo,
        status: '1',
        orderStr: 'orderLevel desc, pubTimestamp desc, createTimestamp desc'
      })
        .then(res => {
          if (isEmpty(res.records)) {
            this.finished = true
          }
          res.records.forEach(item => {
            this.list.push(item)
          })
        })
        .catch(err => {
          this.finished = true
        })
        .finally(() => {
          // 加载状态结束
          this.loading = false
          this.pullRefreshLoading = false
        })
    },
    onPullRefreshLoad() {
      this.pullRefreshLoading = true
      this.pageIndex = 1
      this.list = []
      this.onLoad()
    }
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll) //  离开页面清除（移除）滚轮滚动事件
  }
}
</script>

<style lang="scss" scoped>
.backTop {
  position: fixed;
  right: 3%;
  bottom: 20%;
}
#page {
  height: 100vh;
  background: white;
  overflow-y: scroll;
}
.IndustryInformation {
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
      width: 100px;
      height: 76px;
      border-radius: 8px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    div:nth-child(2) {
      width: 70%;
      margin-left: 12px;
      p:nth-child(1) {
        color: #393c41;
        font-size: 15px;
        font-weight: 600;
      }
      p:nth-child(2) {
        margin-top: 3.5%;
        color: #959ca7;
        font-size: 12px;
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
  font-size: 15px;
  margin-top: 1.2rem;
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
