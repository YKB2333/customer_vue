<template>
  <div id="page">
    <div class="ptb20 plr18">
      <div 
        style="box-shadow:0px 2px 7px 0px rgba(233,242,255,1);"
        v-for="(item, index) in list" :key="index" class="row radius8 mb14 plr18 ptb20"
        @click="$router.push({ name: 'EventDetails', query: { id: item.id} })"
      >
        <div>
            <img :src="item.titleImage" alt="title-img" width="100" height="100" style="object-fit: contain;"/>
            </div>
            <div class="flex-1 col space-between ptb8 pl10" style="overflow: hidden;">
              <p class="fs16 fw600 van-ellipsis">{{ item.title }}</p>
              <!-- <p class="fs13 van-multi-ellipsis--l2" style="color: #959CA7;">{{ item.subhead }}</p> -->
              <p>
                <span class="tag" v-if="item.source">{{item.source}}</span>
              </p>
              <!-- <p class="fs12 van-ellipsis" style="color: #959CA7;">{{ item.summary }}</p> -->
              <div>
                <div class="fs12" style="color:#959CA7;display:flex;" v-if="item.pubTimestamp">
                  <img style="margin-right:4px;width:16px;height:16px;" :src="require('@/assets/images/home/index_icon_time@2x.png')" alt="">
                  {{formatDate(item.pubTimestamp,'Y-M-D')}}
                </div>
              </div>
            </div>
      </div>
		</div>
  </div>
</template>

<script>
import { isEmpty, showRecentTime, toThousandFilter,formatDate } from "@/utils";
import { selectPage as cmsSelectPage } from '@/api/cms'
import { cmsCategoryId } from '@/config'

export default {
  name: 'SalesPromotion',
  components: {},
  data() {
    return {
      list: [],
      formatDate
    }
  },
  computed: {},
  created() {
    this.init()
  },
  methods: {
    init() {
      cmsSelectPage({
        pageIndex: 1,
        pageSize: 100,
        infoCategoryId: cmsCategoryId.marketingAct,
        status: '1',
        orderStr: 'orderLevel desc, pubTimestamp desc, createTimestamp desc'
      })
        .then(res => {
          this.list = res.records
        })
        .catch(err => {
        })
    }
  }
}
</script>

<style lang="scss" scoped>
#page {
  height: 100vh;
  background: white;
  overflow-y: scroll;
}
.salesPromotion {
  text-align: center;
  font-size: 18px;
  width: 92%;
  margin: 4% auto;
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  flex-direction: column;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
  margin-bottom: 10px;
  overflow: hidden;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 11px 0px rgba(159, 190, 240, 0.16);
  border-radius: 8px;
  img {
    width: 100%;
    height: 165px;
    background: rgba(216, 216, 216, 1);
    border-radius: 8px;
    object-fit: cover;
  }
  .activityTitle {
    text-align: left;
    width: 90%;
    margin: 0 auto;
    padding-bottom: 1.1rem;
    p {
      font-size: 15px;
      margin-bottom: 2px;
      color: #393c41;
    }
    .activityRow {
      font-size: 16px;
      color: rgba(57, 60, 65, 1);
      line-height: 23px;
      font-weight: 600;
    }
    div {
      color: #959ca7;
      font-size: 12px;
      span {
        color: #959ca7;
        font-size: 12px;
      }
      p:nth-child(1) {
        width: 50%;
        height: 100%;
        display: flex;
        align-items: center;
      }
      p:nth-child(2) {
        display: flex;
        justify-content: space-between;
        span:nth-child(1) {
          width: 80px;
          height: 26px;
          background: rgba(255, 245, 235, 1);
          border-radius: 13px;
          line-height: 26px;
          text-align: center;
          color: #ef9236;
        }
      }
    }
  }
}
.tag{
  color: #FF9A37;
  display: inline-block;
  padding:4px;
  background:rgba(239,146,54,0.1);
  border-radius:4px;
  margin: 0px 4px 4px 0;
  font-size: 12px;
  line-height: 1;
}
</style>
