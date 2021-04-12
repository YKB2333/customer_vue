<template>
  <section class="page">
    <van-search
      :left-icon="require('@/assets/images/icon_search@2x.png')"
      placeholder="请输入客户名/客户渠道"
      v-model="value"
      @input="onSearch()"
      class="searchTop"
      :autofocus="autofocus"
    />
    <!-- 客户管理列表 -->
    <div class="h54"></div>
    <van-index-bar
      position="right"
      highlight-color="#3A78EF"
      :index-list="indexList"
      style="width:96%;margin:0 auto;"
      class="test"
    >
      <div v-if="value" class="mt60">
        <!-- <van-cell
          v-for="(customer,index) in searchList"
          :key="index"
          class="managementRow"
          @click="$router.push(`/customerdetails/${customer.id}`)"
        >
        </van-cell> -->
        <div v-if="pages==='collect'">
          <custom-card 
            class="mb12"
            :card-type="'a'"       
            v-for="(customer, arrIndex) in searchList"
            :name="customer.csName"
            :channelType="customer.channelType"
            :industry="customer.industry"
            :id="customer.id"
            :monthShipment="customer.amt"
            :monthShipmentAmount="customer.qty"
            :logo="customer.logo"
            :key="arrIndex" />
        </div>
        <div v-else>
          <custom-card 
          class="mb12"
          :card-type="'d'"       
          v-for="(customer, arrIndex) in searchList"
          :name="customer.name"
          :id="customer.id"
          :logo="customer.logo"
          :key="arrIndex" />
        </div>
        <div v-if="searchList.length == 0" class="emply">
          <img src="@/assets/images/isEmply2.png" alt />
          <h3 class="center-x fs16 fw400" style="color:#999">暂无数据~</h3>
        </div>
      </div>
      <div v-else v-for="key in indexList" :key="key">
        <van-index-anchor :index="key">{{key}}</van-index-anchor>
          <div v-if="pages==='collect'">
            <custom-card 
              class="mb12"
              :card-type="'a'"       
              v-for="(customer, arrIndex) in indexData[key]"
              :name="customer.name"
              :channelType="customer.channelType"
              :industry="customer.industry"
              :id="customer.id"
              :monthShipment="customer.amt"
              :monthShipmentAmount="customer.qty"
              :logo="customer.logo"
              :key="arrIndex" />
          </div>
          <div v-else>
            <custom-card 
              class="mb12"
              :card-type="'d'"       
              v-for="(customer, arrIndex) in indexData[key]"
              :name="customer.name"
              :id="customer.id"
              :logo="customer.logo"
              :key="arrIndex" />
          </div>
      </div>
    </van-index-bar>
  </section>
</template>

<script>
import pinyin from "pinyin";
import { savePosition } from "@/mixins";
import CustomCard from "@/components/CustomCard"
import { favoritePage } from "@/api/common";
import { customerFavorite } from "@/api/mine";
import { getCustomerList } from "@/api/findCustomer/customer";

export default {
  name: "Management",
  components: { CustomCard },
  mixins: [new savePosition()],
  data() {
    return {
      value: "",
      // 返回的列表值
      indexData: [],
      indexList: [],
      defaultLogo: require("@/assets/images/defaultLogo.png"),
      show: false,
      searchList: [],
      list: [],
      autofocus: false, // 自动聚焦搜索框
      query: {
        tag: "",
        customerDept: "",
        checkedStatus:'1',
        enableStatusCustomer :2,
        enableStatus:'2'
      },
      pages:"" //当前页面
    };
  },
  created() {
    if (this.$route.query.autofocus)this.autofocus = Boolean(this.$route.query.autofocus);
    if (this.$route.query.tag) this.query["tag"] = this.$route.query.tag;
    if (this.$route.query.customerDept)this.query["customerDept"] = this.$route.query.customerDept;

    if (this.$route.query.collect) {  // 收藏进入的
      window.document.title =  '我的收藏'
      this.pages = "collect"
      this.favoritePages()
      return;
    }
    this.fetchCustomerList();
  },
  mounted() {
    this.$toast.loading({
      duration: 0,
      message: "加载中...",
      forbidClick: true
    });
  },
  computed: {},
  methods: {
    favoritePages(){
      customerFavorite({
        // relationKeys:[this.customerInfo.id],
        contentType: "customerCustInfo",
        pageIndex: 1,
        pageSize: 10000
      })
      .then(res => {
        this.list = res.list;
        res.list.forEach(e => {
          console.log(e);
          let firstLetter = this.$utils.getFirstLetter(e.csName);
          let { id, logo, channelType, industry, qty, amt, csName:name } = e;
          if (!logo) {
            logo = this.defaultLogo;
          }
          if (!this.indexData[firstLetter]) {
            this.$set(this.indexData, firstLetter, new Array());
          }
          this.indexData[firstLetter].push({ id, name, logo, industry, channelType, qty, amt });
          this.indexList = Object.keys(this.indexData).sort();
        });
      })
      .finally(()=>{
        this.$toast.clear();
      });
    },
    onSearch() {
      console.log(this.list)
      this.searchList = this.list.filter(e => {
        return (e.name && e.name.includes(this.value)) || (e.csName && e.csName.includes(this.value)) || (e.channel && e.channel.includes(this.value)) ? e : false;
      });
      console.log(this.searchList)
    },
    showPopup() {
      this.show = !this.show;
    },
    fetchCustomerList() {
      getCustomerList(this.query).then(res => {
        this.list = res;
        console.log("客户列表", this.list);
        this.$toast.clear();
        res.forEach(e => {
          let firstLetter = this.$utils.getFirstLetter(e.name);
          let { id, logo, name } = e;
          if (!logo) {
            logo = this.defaultLogo;
          }
          if (!this.indexData[firstLetter]) {
            this.$set(this.indexData, firstLetter, new Array());
          }
          this.indexData[firstLetter].push({ id, name, logo });
          this.indexList = Object.keys(this.indexData).sort();
        });
      });
    }
  },
  destroyed() {
    this.$toast.clear();
  }
};
</script>

<style lang="scss" scoped>
.searchTop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 9999;
  /deep/ .van-search__content {
    border-radius: 30px;
  }
}
.page {
  height: 100vh;
  overflow-y: scroll;
  background: white;
}
/deep/ .van-index-bar__index {
  padding: 0;
  margin: 0 4px 4px 19px;
  font-weight: 500;
  font-size: 10px;
  line-height: 14px;
  color: #959ca7;
}
/deep/ .van-index-bar__index--active {
  width: 14px;
  height: 14px;
  padding: 2px;
  border-radius: 50%;
  background: rgba(58, 120, 239, 1);
  color: white !important;
}
.managementIndex {
  color: #393c41;
  font-size: 13px;
}
.managementRow {
  padding-top: 1rem;
  padding-bottom: 1rem;
}
.van-cell{
  font-size: 12px;
}
.van-cell:not(:last-child)::after {
  position: absolute;
  box-sizing: border-box;
  content: " ";
  pointer-events: none;
  right: 0;
  bottom: 0;
  left: 0px;
  border-bottom: 1px solid #ebedf0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
.test {
  padding-bottom: calc(100vh - 7rem);
  /deep/ .van-cell__value,
  .van-cell__value--alone {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    div:nth-child(1) {
      width: 102px;
      height: 102px;
      overflow: hidden;
      align-items: center;
      border: 1px solid rgba(244, 244, 244, 1);
      justify-content: center;
      border: radius 5px;
      margin-right: 3%;
      // img {
      //   width: 80%;
      // }
    }
    &>div:nth-child(2) {
      width: calc(100% - 102px);
    }
  }
}
.emply{
    text-align: center;
    padding:10px 0;
    img{
      width:200px;
    }
    p{
      margin-top: 20px;
      font-size: 14px;
      color: #959CA7;
      line-height: 14px;
    }
  }
</style>
