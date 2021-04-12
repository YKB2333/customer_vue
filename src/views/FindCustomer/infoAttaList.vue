<template>
  <div v-if="attaList">
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
import { getAttaById } from "@/api/cms";
import AreaTitle from "@/components/AreaTitle";
import AttaItem from "@/components/AttachmentItem";

export default {
  name: "infoAttaList",
  components: {
    AreaTitle,
    AttaItem
  },
  mixins: [],
  data() {
    return {
      attaList: [],
    };
  },
  mounted() {
    this.attaList = JSON.parse(this.$route.query.AttaList)
  },
  computed: {},
  methods: {
  },
  destroyed() {}
};
</script>

<style lang="scss" scoped>
.clientBorderBottom {
  border-bottom: 15px solid #f3f4f9;
}
.projectTiTle {
  padding: 0 5% 0 5%;
  p {
    font-size: 18px;
    font-weight: bold;
    color: rgba(57, 60, 65, 1);
    line-height: 21px;
    margin-top: 19px;
    margin-bottom: 15px;
  }
  div {
    margin-bottom: 15px;
    color: #959ca7;
    font-size: 14px;
    img {
      width: 12px;
      margin-right: 10px;
    }
  }
}
.clientTitle {
  font-weight: 500;
  color: rgba(57, 60, 65, 1);
  line-height: 15px;
}
</style>
