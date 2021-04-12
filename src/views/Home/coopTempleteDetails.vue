<template>
  <div id="page">
    <div class="caseTitle">
      <p>{{info.title}}</p>
    </div>
    <div class="richText" v-html="info.content"></div>
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
export default {
  name: "coopTempleteDetails",
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
.caseTitle {
  width: 90%;
  margin: 0 auto;
  margin-top: 3%;
  font-size: 20px;
  font-weight: 600;
  color: rgba(57, 60, 65, 1);
  line-height: 28px;
  p {
    margin: 0;
    padding: 0;
  }
  p:nth-child(2) {
    font-size: 14px;
    font-weight: 500;
    color: rgba(149, 156, 167, 1);
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
</style>
