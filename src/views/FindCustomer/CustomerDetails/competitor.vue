<template>
  <div class="page" v-if="infoList.length>0">
    <div v-for="(item,index) in infoList" :key="index" class="box">
      <p class="text-center color-dark-grey fs18 fw800 mt20 mb30">{{ item.title }}</p>
      <div class="wpct90 mauto">
        <div class="box_row">
          <span>客户</span>
          <span>{{item.baseInfoName}}</span>
        </div>
        <div class="box_row">
          <span>业务部门</span>
          <span>{{item.businessName}}</span>
        </div>
        <div class="box_row">
          <span>分析人</span>
          <span>{{item.analystName}}</span>
        </div>
        <div class="box_row">
          <span>对标商品</span>
          <span>{{item.benchmarkingGoods}}</span>
        </div>
        <div class="box_row col mb6">
          <span class="mb10">分析内容</span>
          <div :class="{'ellipsis4':!isShowAllText }">
            <span
              style="word-wrap:break-word;font-size: 15px;font-weight: 500;color: #6b7177;"
              v-html="item.analyzeContent"
            ></span>
          </div>
          <!-- 展开 -->
          <div
            class="w-full row center h40"
            @click="showAllText()"
            v-if="item.analyzeContent.length > 120"
          >
            <img
              :src="require('@/assets/images/find/new_find/theme_icon_all@2x.png')"
              alt
              class="w-h10"
              style="transform: rotate(180deg)"
              v-if="isShowAllText"
            />
            <img
              :src="require('@/assets/images/find/new_find/theme_icon_all@2x.png')"
              alt
              class="w-h10"
              v-else
            />
          </div>
        </div>

        <p class="title mb16">推广商品</p>
        <div class="row mb20 tgshop" style="justify-content: flex-start;">
          <div
            v-for="(goods,index) in item.spu.slice(0,3)"
            :key="goods.id"
            style="width: 32%;padding-bottom: 32%;position:relative;margin-right:4%;"
            @click="clickShowImg(item.spu,index)"
          >
            <img
              :src="goods.titleImage"
              alt
              class="w-h-full absolute"
              style="object-fit:cover;border:1px solid rgb(248, 248, 248)"
            />
            <div
              v-if="index == 2"
              class="absolute w-h-full"
              style="background-color:rgba(0,0,0,0.5);"
            >
              <div class="pos-center white">
                <span class="fs20">+</span>
                <span class="fs22">{{ item.spu.length - 3 }}</span>
              </div>
            </div>
          </div>
        </div>
        <p class="title mb20" v-if="item.attaList.length">相关附件</p>
        <atta-item
          v-for="(atta, index) in item.attaList"
          :key="index"
          :file-name="atta.fileName"
          :file-type="atta.fileType"
          :size="atta.size"
          :attaId="atta.id"
          :attaUrl="atta.attaUrl"
        />
      </div>
    </div>
  </div>
  <div class="emply" v-else>
    <img src="@/assets/images/isEmply.png" alt />
    <p>暂无数据~</p>
  </div>
</template>
<script>
import AttaItem from "@/components/AttachmentItem";
import { ImagePreview } from "vant";
import { getCoreSupplierAnalyze } from "@/api/findCustomer/customer";
export default {
  name: "competitor",
  components: {
    AttaItem
  },
  data() {
    return {
      isShowAllText: false,
      goodsImgList: [
        { logo: require("@/assets/images/find/new_find/type_bg_top3@2x.png") },
        { logo: require("@/assets/images/find/new_find/type_bg_top3@2x.png") },
        { logo: require("@/assets/images/find/new_find/type_bg_top3@2x.png") },
        { logo: require("@/assets/images/find/new_find/type_bg_top3@2x.png") }
      ],
      attas: [
        {
          fileName: "test",
          fileType: "txt",
          size: "12",
          id: "1",
          attaUrl: "www.baidu.com"
        }
      ],
      infoList: [],
      data: []
    };
  },
  methods: {
    getCoreSupplierAnalyze() {
      getCoreSupplierAnalyze(this.$route.query.id).then(res => {
        res.forEach(item => {
          item.showContent = item.analyzeContent.length > 120 ? true : false;
          if (!item.spu) item.spu = [];
        });
        this.infoList = res;
        this.$toast.clear();
      });
    },
    showAllText() {
      this.isShowAllText = !this.isShowAllText;
    },
    clickShowImg(arr, index) {
      let images = arr
        .filter(item => {
          return item.titleImage;
        })
        .map(value => value.titleImage);
      ImagePreview({
        images,
        startPosition: index
      });
    }
  },
  created() {
    this.$toast.loading({
      duration: 0,
      message: "加载中...",
      forbidClick: true
    });
    if (this.$route.query && this.$route.query.id) {
      this.getCoreSupplierAnalyze();
    } else {
      this.$toast("获取用户信息失败");
      this.$toast.clear();
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  background: #f2f4f9;
  height: 100vh;
  overflow-y: auto;
}

.color-gray {
  color: #959ca7;
}
.color-dark-grey {
  color: #393c41;
}
.title {
  font-size: 15px;
  font-weight: bold;
  color: #393b41;
  width: 29%;
  overflow: hidden;
}
.box {
  overflow: hidden;
  width: 92%;
  margin: 0 auto;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 92px 0px rgba(40, 109, 153, 0.1);
  border-radius: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
}
.box_row {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 22px;
  span:nth-child(1) {
    font-size: 15px;
    font-weight: bold;
    color: #393b41;
    width: 29%;
    overflow: hidden;
  }
  span:nth-child(2) {
    font-size: 15px;
    font-weight: 500;
    color: rgba(107, 113, 119, 1);
    flex: 1;
  }
}
.box-h-full {
  height: 100% !important;
}
.tgshop > div:last-child {
  margin-right: 0 !important;
}
.emply {
  padding-top: 10%;
  text-align: center;
  img {
    width: 133px;
  }
  p {
    color: rgba(149, 156, 167, 1);
    font-size: 12px;
    padding: 8px 0 8px 8px;
  }
}
</style>
