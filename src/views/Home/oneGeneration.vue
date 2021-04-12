<template>
  <div id="page">
    <van-tabs style="margin-bottom:12px;" line-width="30px"  color="#3A78EF" v-model="active">
      <van-tab title="一件代发说明"></van-tab>
      <!--<van-tab title="可代发商品"></van-tab>-->
    </van-tabs>
    <van-pull-refresh v-show="active==0" style="background:#fff;" v-model="pullRefreshLoading" @refresh="onPullRefreshLoad">
      <div v-if="info.content" class="richText" v-html="info.content"></div>
      <emply v-else />
      <!-- <div class="Title-More">
        <p>典型一件代发案例</p>
      </div>
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <ul class="IndustryInformation">
          <li
            v-for="item in list"
            :key="item.id"
            @click="$router.push({ name: 'OneGenerationDetails', query: {id: item.id}})">
            <div>
              <p class="ellipsis2">{{item.title}}</p>
              <p>{{showRecentTime(item.createTimestamp)}}</p>
            </div>
            <div>
              <img :src="item.titleImage" alt />
            </div>
          </li>
        </ul>
      </van-list> -->
    </van-pull-refresh>
    <div style="background:#fff;padding:24px 18px 4px 18px;" v-show="active==1">
      <div v-if="attalist.length>0">
        <atta-item
        v-for="(item, index) in attalist"
        :key="index"
        :file-name="item.fileName"
        :file-type="item.fileType"
        :size="item.size"
        :attaId="item.id"
        :attaUrl="item.attaUrl"/>
      </div>
      <emply v-else />
    </div>
  </div>
</template>

<script>
import AttaItem from "@/components/AttachmentItem";
import { getOne, selectPage as cmsSelectPage,getAttaById } from '@/api/cms'
import { cmsCategoryId } from '@/config'
import { isEmpty, showRecentTime } from '@/utils'
export default {
  name: 'OneGeneration',
  components: {AttaItem},
  data() {
    return {
      active:0,
      attalist:[],
      pullRefreshLoading: false,
      loading: false,
      finished: false,
      pageIndex: 1,
      list: [],
      info: {}
    }
  },
  computed: {},
  created() {
    this.fetchCmsInfoData()
  },
  methods: {
    isEmpty,
    showRecentTime,
    fetchCmsInfoData() {
      return getOne(this.$route.query.id).then(res => {
        this.info = res
        if(this.info.id){
          getAttaById(this.info.id).then(res_ => {
            this.attalist = res_
          })
        }
      })
    },
    onLoad() {
      cmsSelectPage({
        pageIndex: this.pageIndex++,
        pageSize: 10,
        infoCategoryId: cmsCategoryId.onePkg,
        status: '1',
        isRecommend: false,
        orderStr: 'pubTimestamp desc, createTimestamp desc'
      })
        .then(res => {
          // this.attalist = []
          if (isEmpty(res.records)) {
            this.finished = true
          }
          res.records.forEach(item => {
            this.list.push(item)
            // getAttaById(item.id).then(res_ => {
            //   this.attalist.push(res_)
            // })
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
  }
}
</script>

<style lang="scss" scoped>
#page {
  height: 100vh;
  background: #f3f4f9;
  overflow-y: scroll;
}
// .IndustryInformation {
//   background-color: #fff;
//   width: 90%;
//   margin: 0 auto;
//   margin-bottom: 20px;
//   li {
//     padding: 5.5%;
//     display: flex;
//     align-content: center;
//     align-items: center;
//     text-align: left;
//     box-shadow: 0px 2px 11px 0px rgba(159, 190, 240, 0.16);
//     border-radius: 8px;
//     margin-bottom: 1rem;
//     div:nth-child(1) {
//       width: 70%;
//       margin-right: 12px;
//       p:nth-child(1) {
//         color: #393c41;
//         font-size: 15px;
//         font-weight: 600;
//       }
//       p:nth-child(2) {
//         margin-top: 3.5%;
//         color: #959ca7;
//         font-size: 12px;
//         span {
//           color: #ef9236;
//           background: #fdf4ea;
//           padding: 2px 4px 2px 4px;
//           margin-right: 5%;
//         }
//       }
//     }
//     div:nth-child(2) {
//       width: 100px;
//       height: 76px;
//       border-radius: 8px;
//       overflow: hidden;
//       img {
//         width: 100%;
//         height: 100%;
//         object-fit: cover;
//       }
//     }
//   }
// }
.richText {
  overflow: hidden;
  width: 90%;
  margin: 0 auto;
  margin-top: 10px;
  font-size: 15px;
  font-weight: 400;
  color: rgba(57, 60, 65, 1);
  line-height: 30px;
}
// .Title-More {
//   p {
//     margin: 1rem 0 1rem 0;
//   }
//   width: 90%;
//   margin: 0 auto;
//   font-size: 18px;
//   color: black;
//   line-height: 21px;
//   text-align: left;
//   // font-weight: 600;
//   // padding-top: 35px;
//   // padding-bottom: 19px;
//   padding-top: 0.6rem;
//   padding-bottom: 0.2rem;
//   display: -webkit-box;
//   display: -ms-flexbox;
//   display: flex;
//   -webkit-box-pack: justify;
//   -ms-flex-pack: justify;
//   justify-content: space-between;
//   -ms-flex-line-pack: center;
//   align-content: center;
//   div {
//     color: #959ca7;
//     font-weight: 500;
//     display: flex;
//     align-items: center;
//     font-size: 14px;
//   }
//   i {
//     margin-top: -3px;
//   }
// }
/deep/ .van-tab{
  color: #909399;
}
/deep/ .van-tab--active{
  font-weight: bold;
  color:#303133;
}
</style>
