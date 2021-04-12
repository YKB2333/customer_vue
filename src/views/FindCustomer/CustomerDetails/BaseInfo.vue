<template>
  <section class="page">
    <!-- 客户头部 -->
    <div class="header">
      <img :src="customerInfo.logo || defaultLogo" alt style="object-fit: contain;" />
      <div>
        <p>{{ customerInfo.name }}</p>
        <p>{{ customerInfo && customerInfo.industry }}</p>
      </div>
    </div>
    <van-tabs :ellipsis="false">
      <van-tab title="基本信息">
        <div class="galleryDiv">
          <ul>
            <li>
              <span>客户简称（渠道）</span>
              <span>{{customerInfo&&customerInfo.simpleName}}</span>
            </li>
            <li>
              <span>国家/地区</span>
              <span>{{customerInfo&&customerInfo.area}}</span>
            </li>
            <li>
              <span>企业总部地址</span>
              <span>{{customerInfo&&customerInfo.address}}</span>
            </li>
            <li>
              <span>企业法人</span>
              <span>{{customerInfo&&customerInfo.legalPerson}}</span>
            </li>
            <!-- <li>
              <span>社会统一信用代码</span>
              <span v-if="customerInfo.financeInfos&&customerInfo.financeInfos.length>0">{{customerInfo.financeInfos[0].creditCode}}</span>
            </li>-->
            <li>
              <span>渠道大类</span>
              <span>{{customerInfo.channelCategory}}</span>
            </li>
            <li>
              <span>渠道类型</span>
              <span>{{customerInfo.channelType}}</span>
            </li>
            <li>
              <span>e-mail</span>
              <span>{{customerInfo&&customerInfo.email}}</span>
            </li>
          </ul>
          <ul>
            <li>
              <span>企业文化</span>
              <span>{{customerInfo&&customerInfo.companyCulture}}</span>
            </li>
            <li>
              <span>备注</span>
              <span>{{customerInfo&&customerInfo.remark}}</span>
            </li>
          </ul>
        </div>
      </van-tab>
      <van-tab title="财务信息">
        <div class="galleryDiv">
          <ul>
            <li>
              <span>银行类别</span>
              <span
                v-if="customerInfo.financeInfos&&customerInfo.financeInfos.length>0"
              >{{customerInfo.financeInfos[0].bankCategory}}</span>
            </li>
            <li>
              <span>开户银行</span>
              <span
                v-if="customerInfo.financeInfos&&customerInfo.financeInfos.length>0"
              >{{customerInfo.financeInfos[0].bank}}</span>
            </li>
            <li>
              <span>银行账号</span>
              <span
                v-if="customerInfo.financeInfos&&customerInfo.financeInfos.length>0"
              >{{customerInfo.financeInfos[0].bankAccount}}</span>
            </li>
            <li>
              <span>纳税人登记号</span>
              <span
                v-if="customerInfo.financeInfos&&customerInfo.financeInfos.length>0"
              >{{customerInfo.financeInfos[0].taxNumber}}</span>
            </li>
          </ul>
        </div>
      </van-tab>
      <van-tab title="合作信息">
        <div class="galleryDiv">
          <ul v-for="(coop,index) in customerInfo.coopInfos" :key="index">
            <div class="top">
              <img src="@/assets/images/customer/bg_num@2x.png" alt />
              <!-- 10以内显示0+数字 10之后显示数字本身 -->
              <span>{{ index >= 9 ? (index + 1) : ('0' + (index + 1)) }}</span>
            </div>
            <li>
              <span>业务板块</span>
              <span>{{coop.businessName}}</span>
            </li>
            <li>
              <span>合作部门</span>
              <span>{{coop.deptName}}</span>
            </li>
            <li>
              <span>合作模式</span>
              <span>{{coop.coopModel}}</span>
            </li>
            <li>
              <span>供货类型</span>
              <span
                v-if="coop.supplyType"
              >{{coop.supplyType.indexOf('|')>-1?(coop.supplyType.split('|').filter(item => item).join(',')):coop.supplyType}}</span>
            </li>
            <li>
              <span>商品服务类型</span>
              <span
                v-if="coop.serviceType"
              >{{coop.serviceType.indexOf('|')>-1?(coop.serviceType.split('|').filter(item => item).join(',')):coop.serviceType}}</span>
            </li>
          </ul>
        </div>
      </van-tab>
      <van-tab title="企业联系人">
        <div class="galleryDiv">
          <ul v-for="(contact,index) in customerInfo.contactsInfos" :key="index">
            <div class="top">
              <img src="@/assets/images/customer/bg_num@2x.png" alt />
              <!-- 10以内显示0+数字 10之后显示数字本身 -->
              <span>{{ index >= 9 ? (index + 1) : ('0' + (index + 1)) }}</span>
            </div>
            <li>
              <span>姓名</span>
              <span>{{contact.fullName || ''}}</span>
            </li>
            <li>
              <span>性别</span>
              <span>{{gender[contact.gender] || ''}}</span>
            </li>
            <li>
              <span>手机</span>
              <span>{{contact.mobile || ''}}</span>
            </li>
            <li>
              <span>职位</span>
              <span>{{contact.position || ''}}</span>
            </li>
            <li>
              <span>微信/QQ</span>
              <span>{{contact.im || ''}}</span>
            </li>
            <li>
              <span>邮箱</span>
              <span>{{contact.email || ''}}</span>
            </li>
          </ul>
        </div>
      </van-tab>
      <van-tab title="内部联系人">
        <div class="galleryDiv">
          <ul v-for="(inner,index) in customerInfo.innerPersonInfos" :key="index">
            <div class="top">
              <img src="@/assets/images/customer/bg_num@2x.png" />
              <span>{{ index >= 9 ? (index + 1) : ('0'+(index + 1)) }}</span>
            </div>
            <li v-if="inner.fullName">
              <span>姓名</span>
              <span>{{ inner.fullName }}</span>
            </li>
            <li v-if="inner.tel">
              <span>手机</span>
              <span>{{ inner.tel }}</span>
            </li>
            <li v-if="inner.deptName">
              <span>所属部门</span>
              <span>{{ inner.deptName }}</span>
            </li>
            <li v-if="inner.jobTitle">
              <span>负责内容</span>
              <span>{{ inner.jobTitle }}</span>
            </li>
          </ul>
          <!-- <p v-if="customerInfo.innerPersonInfos.length === 0" class="text-center mt30">未维护内部跟进人，请联系业务补充吧~~~</p> -->
          <div v-if="customerInfo.innerPersonInfos.length === 0" class="emply mt60" >
            <img src="@/assets/images/isEmply2.png" alt />
            <p>客户暂无内部联系人哦</p>
          </div>
        </div>
      </van-tab>
    </van-tabs>
    <go-home></go-home>
  </section>
</template>

<script>
import { getCustomerInfo } from "@/api/findCustomer";
import { gender } from "@/const/customer";
import { isEmpty } from "@/utils";
import GoHome from '@/components/go-home'

export default {
  name: "CustomerBaseInfo",
  components: { GoHome },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      gender,
      isOneTxt: true,
      // 页面不同title
      pageTitle: [
        { id: 1, name: "基本信息" },
        { id: 2, name: "财务信息" },
        { id: 3, name: "合作信息" },
        { id: 4, name: "企业联系人" },
        { id: 5, name: "内部联系人" },
      ],
      customerInfo: {},
      defaultLogo: require("@/assets/images/defaultLogo.png"),
    };
  },
  created() {
    this.fetchCustomerInfo();
  },
  mounted() {},
  computed: {
    shopAreas() {
      if (
        !this.customerInfo ||
        !this.customerInfo.shopInfos ||
        this.customerInfo.shopInfos.length == 0
      )
        return null;
      let areaArr = new Array();
      this.customerInfo.shopInfos.forEach(e => {
        areaArr.push(e.city);
      });
      return this.$lodash.uniq(areaArr).join(",");
    },
    shopCount() {
      let count = 0;
      if (
        this.customerInfo &&
        this.customerInfo.shopInfos &&
        this.customerInfo.shopInfos.length > 0
      ) {
        this.customerInfo.shopInfos.forEach(e => {
          if (e.id) count++;
        });
      }
      return count;
    }
  },
  methods: {
    fetchCustomerInfo() {
      getCustomerInfo(this.id).then(res => {
        if (isEmpty(res.contactsInfos)) {
          res.contactsInfos = [];
          res.contactsInfos.push({});
        }
        if (isEmpty(res.shopInfos)) {
          res.shopInfos = [];
          res.shopInfos.push({});
        }
        this.customerInfo = res;
      });
    },
    setOneTxt() {
      this.isOneTxt = !this.isOneTxt;
    }
  }
};
</script>

<style lang="scss" scoped>
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
.page {
  line-height: 1;
  height: 100vh;
  overflow-y: scroll;
  overflow-x: hidden;
  background: #fff;
  .header {
    background: url("../../../assets/images/customer/im_bg@2x.png") no-repeat top left;
    background-size: cover;
    display: flex;
    align-items: center;
    padding: 20px;
    img {
      height: 75px;
      width: 75px;
      margin-right: 13px;
      border-radius: 50%;
      border: 2px solid #fff;
    }
    p {
      line-height: 24px;
      color: #fff;
    }
    p:nth-child(1) {
      font-weight: bold;
      font-size: 18px;
    }
    p:nth-child(2) {
      font-size: 13px;
    }
  }
}

// 总盒子
.galleryDiv {
  // margin-bottom: 3rem;
  background: rgba(255, 255, 255, 1);
  padding: 0 1rem 1rem 1rem;
  ul {
    position: relative;
    background: white;
    box-shadow: 0px 0px 46px 0px rgba(40, 109, 153, 0.1);
    border-radius: 8px;
    padding: 0 1rem;
    margin-top: 15px;
    li {
      margin: 0 auto;
      overflow: hidden;
      display: flex;
      justify-content: space-between;
      padding: .8rem 0;
      border-bottom: 1px solid #f2f4f9;
      span {
        font-size: 15px;
        line-height: 22px;
        word-break: break-all;
      }
      span:nth-child(1) {
        color: #393c41;
        display: inline-block;
        width: 70px;
        font-weight: 600;
        margin-right: 20px;
      }
      span:nth-child(2) {
        color: rgba(107, 113, 120, 1);
        display: inline-block;
        flex: 1;
      }
    }
    .top {
      position: absolute;
      left: 0;
      top: 0;
      img {
        width: 25px;
        height: 24px;
      }
      span {
        position: absolute;
        left: 4px;
        top: 5px;
        font-size: 12px;
        font-weight: 600;
        color: #743a00;
      }
    }
  }
}

/deep/ .van-tabs__line {
  background-color: #3A78EF;
}
/deep/ .van-tab {
  color: #959CA7;
  font-size: 15px;
}
/deep/ .van-tab--active {
  color: #393C41;
  font-weight: 600;
}

</style>