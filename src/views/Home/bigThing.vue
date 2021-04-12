<template>
  <div id="page">
    <div class="swiper-slide HomeSwiperSlide">
      <!-- 活动图片 -->
      <img :src="info.titleImage" />
      <!-- 活动title -->
      <div class="activityTitle">
        <p>{{info.title}}</p>
        <div>
          <p v-if="info.pubTimestamp">活动时间：{{formatDate(info.pubTimestamp,'Y-M-D')}}</p>
          <!-- <p>活动地点：{{info.subhead || '-'}}</p> -->
          <!-- <p>重点合作：{{info.source || '-'}}</p> -->
          <!-- <p>开展部门：销售部</p> -->
        </div>
      </div>
    </div>
    <div v-if="info.content" class="richText" v-html="info.content"></div>
    <!-- 附件列表 -->
    <div v-if="attaList.length > 0" class="bg-white mb14">
      <area-title title="附件列表" />
      <div class="plr14 pb2">
        <atta-item
          style="box-shadow:0px 0px 10px 0px rgba(40,109,153,0.1);"
          v-for="(item, index) in attaList"
          :key="index"
          :file-name="item.fileName"
          :file-type="item.fileType"
          :size="item.size"
          :attaId="item.id"
          :attaUrl="item.attaUrl"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getOne, getAttaById } from "@/api/cms";
import AreaTitle from "@/components/AreaTitle";
import AttaItem from "@/components/AttachmentItem";
import { isEmpty, showRecentTime,formatDate } from "@/utils";
export default {
  name: "bigThing",
  components: { AreaTitle, AttaItem },
  data() {
    return {
      info: {},
      attaList: []
    };
  },
  computed: {},
  created() {
    this.fetchCmsInfoData();
    this.fetchCmsInfoAtta();
  },
  methods: {
    showRecentTime,
    formatDate,
    fetchCmsInfoData() {
      return getOne(this.$route.query.id).then(res => {
        this.info = res;
      });
    },
    fetchCmsInfoAtta() {
      return getAttaById(this.$route.query.id).then(res => {
        this.attaList = res;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#page {
  height: 100vh;
  background: white;
  overflow-y: scroll;
}
.HomeSwiperSlide {
  // width: 92%;
  height: auto;
  text-align: center;
  font-size: 18px;
  // margin: 0 auto;
  margin-top: 4%;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 10px;
  border-radius: 5px;
  overflow: hidden;
  // box-shadow: -5px 5px 10px -4px rgba(159, 190, 240, 0.16),
  //   5px 5px 10px -4px rgba(159, 190, 240, 0.16);
  img {
    // width: 100%;
    // height: 190px;
    // border-radius: 3px;
    // object-fit: cover;
  }
  .activityTitle {
    // box-shadow: -5px 5px 10px -4px rgba(159, 190, 240, 0.16),
    // 5px 5px 10px -4px rgba(159, 190, 240, 0.16);
    box-shadow:0px 2px 16px 0px rgba(159,190,240,0.16);
    text-align: left;
    // width: 90%;
    margin: 0 auto;
    margin: 15px 18px;
    padding: 20px 18px;
    p {
      margin-top: 5px;
      font-size: 20px;
      margin-bottom: 2px;
      color: #393c41;
    }
    div {
      display: flex;
      flex-direction: column;
      color: #959ca7;
      font-size: 12px;
      p {
        font-size: 15px;
        margin-bottom: 2px;
        color: #797e84;
        letter-spacing: 1px;
        margin-top: 0.5rem;
      }
    }
  }
}
p {
  word-wrap: break-word;
  word-break: break-all;
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
</style>
