<template>
  <div id="page">
    <!-- 附件列表 -->
    <div class="bg-white mb14">
      <area-title title="资源详情与获取标准" />
      <div v-if="resAcqAtta.length > 0" class="plr14 pb2">
        <atta-item
          style="box-shadow:0px 0px 10px 0px rgba(40,109,153,0.1);"
          v-for="(item, index) in resAcqAtta"
          :key="index"
          :file-name="item.fileName"
          :file-type="item.fileType"
          :size="item.size"
          :attaId="item.id"
          :attaUrl="item.attaUrl"
        />
      </div>
      <div v-else class="plr14 pb2">暂无资源</div>
    </div>

    <div class="bg-white mb14">
      <area-title title="活动日历" />
      <div v-if="scheduleAtta.length > 0" class="plr14 pb2">
        <atta-item
          style="box-shadow:0px 0px 10px 0px rgba(40,109,153,0.1);"
          v-for="(item, index) in scheduleAtta"
          :key="index"
          :file-name="item.fileName"
          :file-type="item.fileType"
          :size="item.size"
          :attaId="item.id"
          :attaUrl="item.attaUrl"
        />
      </div>
      <div v-else class="plr14 pb2">暂无资源</div>
    </div>

    <div class="bg-white mb14">
      <area-title title="规则概述" />
      <div v-if="info.ruleDesc" class="plr14 pb2">
        {{info.ruleDesc}}
      </div>
      <div v-else class="plr14 pb2">暂无概述</div>
    </div>
    
    
  </div>
</template>

<script>
import { getOperateDetailsById } from "@/api/findCustomer/customer";
import AreaTitle from "@/components/AreaTitle";
import AttaItem from "@/components/AttachmentItem";
import { isEmpty, showRecentTime } from "@/utils";
export default {
  name: "UserOperation",
  components: { AreaTitle, AttaItem },
  data() {
    return { info: {}, resAcqAtta: [], scheduleAtta: [] };
  },
  computed: {},
  async created() {
    await this.fetchInfoData();
  },
  methods: {
    isEmpty,
    showRecentTime,
    fetchInfoData() {
      return getOperateDetailsById(this.$route.query.id).then(res => {
        console.log(res);
        this.info = res;
        this.resAcqAtta = res.resAcqAtta;
        this.scheduleAtta = res.scheduleAtta;
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
  margin-top: 2.1rem;
  font-weight: 500;
  color: rgba(57, 60, 65, 1);
  line-height: 28px;
  height: 18px;
  font-size: 18px;
  line-height: 18px;
  padding-bottom: 1rem;
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
ul {
  width: 90%;
  margin: 0% auto;
  li {
    display: flex;
    justify-content: space-between;
    height: 16px;
    font-size: 16px;
    color: rgba(57, 60, 65, 1);
    line-height: 16px;
    padding-bottom: 1.2rem;
    padding-top: 1.2rem;
    box-sizing: initial;
    border-bottom: 1px solid rgba(244, 244, 244, 1);
  }
}
a {
  outline: none;
  color: inherit;
}

a:link {
  text-decoration: none;
  color: inherit;
}

a:visited {
  text-decoration: none;
  color: inherit;
}

a:hover {
  text-decoration: none;
  color: inherit;
}

a:active {
  text-decoration: none;
  color: inherit;
}

a:focus {
  outline: 0;
  color: inherit;
  text-decoration: none;
}
</style>
