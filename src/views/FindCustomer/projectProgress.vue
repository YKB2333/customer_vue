<template>
 <div v-if="project">
     <!-- 头部 -->
     <div class="clientBorderBottom projectTiTle ">
        <p>{{ project.name }}</p>
        <div>
            <img src="@/assets/images/customer/user.png" alt=""><span>项目负责人: {{ project.leader }}</span>
        </div>
        <div>
            <img src="@/assets/images/customer/time.png" alt=""><span>启动时间: {{showRecentTime(project.startTime) }}</span>
        </div>
     </div>
     <!-- 项目详情内容 -->
     <div class="clientBorderBottom"> 
        <BaseTitle title="项目详情内容" title_Class="fs18 lh16 clientTitle"></BaseTitle>
        <p class="wpct92 mauto pb10">{{ project.content }}</p>
     </div>
     <!-- 附件列表 -->
    <div v-if="project || project.attas.length > 0" class="bg-white mb14">
      <area-title title="附件列表" />
      <div class="plr14 pb2">
        <atta-item
          style="box-shadow:0px 0px 10px 0px rgba(40,109,153,0.1);"
          v-for="(item, index) in project.attas"
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
import { getProjectDetailsById } from "@/api/findCustomer/customer";
import BaseImageList from "@/components/BaseImageList";
import BaseTitle from "@/components/BaseTitle";
import AreaTitle from "@/components/AreaTitle";
import AttaItem from "@/components/AttachmentItem";
import { showRecentTime } from "@/utils";

export default {
  name: "projectProgress",
  components: {
    BaseImageList ,BaseTitle,AreaTitle,AttaItem
  },
  mixins: [],
  data() {
    return {
      project: []

    };
  },
  mounted() {
    this.getProjectDetail();
  },
  computed: {},
  methods: {
    showRecentTime,
    getProjectDetail() {
      console.log(123);
      return getProjectDetailsById( this.$route.query.id ).then(res => {
          console.log(res);
        this.project =  res;
      });
    }
  },
  destroyed() {}
};
</script>

<style lang="scss" scoped>
.clientBorderBottom{
	border-bottom:15px solid #f3f4f9
}
.projectTiTle{
    padding: 0  5% 0 5%;
    p{
        font-size:18px;
        font-weight:bold;
        color:rgba(57,60,65,1);
        line-height:21px;
        margin-top: 19px;
        margin-bottom: 15px;
    }
    div{
        margin-bottom: 15px;
        color: #959CA7;
        font-size: 14px;
        img{
            width: 12px;
            margin-right: 10px;
        }
    }
}
.clientTitle{
	font-weight:500;
	color:rgba(57,60,65,1);
	line-height:15px;
}
</style>
