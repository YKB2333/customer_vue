<template>
  <section class="page">
    <!-- 客户头部 -->
    <div class="clientHeader">
      <div class="client-row-one">
        <div>
          <img :src="customerInfo.logo||defaultLogo" alt />
        </div>
        <div>
          <span>{{customerInfo.name}}</span>
          <span>{{shopCount}}家店铺</span>
        </div>
      </div>
      <div class="client-row-two">
        <div>
          <p :class="isOneTxt? 'ellipsis1' : '' " @click="setOneTxt">店铺区域: {{shopAreas}}</p>
          <span class="OneTxt" @click="setOneTxt" v-if="shopAreas">
            <van-icon name="arrow-down" v-if="isOneTxt" />
            <van-icon name="arrow-up" v-else />
          </span>
        </div>
        <p>联系姓名: {{customerInfo.legalPerson}}</p>
        <p>
          联系电话:
          <span class="tel">{{customerInfo.tel}}</span>
        </p>
      </div>
    </div>

    <!-- 总页面头部 -->
    <div class="gallery-thumbs">
      <div class="swiper-wrapper classification">
        <span class="swiper-slide" v-for="item in pageTitle" :key="item.id">{{ item.name }}</span>
      </div>
    </div>

    <!-- 总页面主体内容 -->
    <div class="gallery-top">
      <div class="swiper-wrapper">
        <div class="swiper-slide galleryDiv">
          <ul>
            <li>
              <span>客户编码</span>
              <span>{{customerInfo&&customerInfo.ncCode}}</span>
            </li>
            <li>
              <span>客户名称</span>
              <span>{{customerInfo&&customerInfo.name}}</span>
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
              <span>所属行业</span>
              <span>{{customerInfo&&customerInfo.industry}}</span>
            </li>
            <li>
              <span>企业性质</span>
              <span>{{customerInfo&&customerInfo.entNature}}</span>
            </li>
            <li>
              <span>注册资金</span>
              <span>{{customerInfo&&customerInfo.regCapital}}</span>
            </li>
            <li>
              <span>法人</span>
              <span>{{customerInfo&&customerInfo.legalPerson}}</span>
            </li>
            <li>
              <span>e-mail</span>
              <span>{{customerInfo&&customerInfo.email}}</span>
            </li>
            <li>
              <span>电话</span>
              <span>{{customerInfo&&customerInfo.tel}}</span>
            </li>
            <li>
              <span>Web网址</span>
              <span>{{customerInfo&&customerInfo.webSite}}</span>
            </li>
            <li>
              <span>公司人数</span>
              <span>{{customerInfo&&customerInfo.entPersonCount}}</span>
            </li>
            <li>
              <span>客户类型</span>
              <span>{{(customerInfo&&customerInfo.type)==0?"外部单位":"内部单位"}}</span>
            </li>
            <li>
              <span>客户年度销售额</span>
              <span>{{customerInfo&&customerInfo.annualSalesVolume}}</span>
            </li>
            <li>
              <span>服务消费者数量</span>
              <span>{{customerInfo&&customerInfo.memberCount}}</span>
            </li>
            <li>
              <span>自有品牌数量</span>
              <span>{{customerInfo&&customerInfo.ownBrandCount}}</span>
            </li>
            <li>
              <span>客户在售产品品类</span>
              <span>{{customerInfo&&customerInfo.onSaleCategory}}</span>
            </li>
            <li>
              <span>在售品类销售占比</span>
              <span>{{customerInfo&&customerInfo.onSaleProportion}}</span>
            </li>
            <li>
              <span>业务基本构成</span>
              <span>{{customerInfo&&customerInfo.business}}</span>
            </li>
            <li>
              <span>客户管理模式</span>
              <span>{{customerInfo&&customerInfo.manageModel}}</span>
            </li>
            <li>
              <span>对应客户我们的优势</span>
              <span>{{customerInfo&&customerInfo.ourAdvantage}}</span>
            </li>
            <li>
              <span>备注</span>
              <span>{{customerInfo&&customerInfo.remark}}</span>
            </li>
          </ul>
        </div>
        <div class="swiper-slide galleryDiv">
          <ul>
            <!-- <li>
              <span>社会统一信用代码</span>
              <span>{{customerInfo.financeInfos[0]&&customerInfo.financeInfos[0].creditCode}}</span>
            </li> -->
            <li>
              <span>企业税率</span>
              <span>{{customerInfo.financeInfos[0]&&customerInfo.financeInfos[0].entTaxRate}}</span>
            </li>
            <li>
              <span>开户银行</span>
              <span>{{customerInfo.financeInfos[0]&&customerInfo.financeInfos[0].bank}}</span>
            </li>
            <li>
              <span>银行账号</span>
              <span>{{customerInfo.financeInfos[0]&&customerInfo.financeInfos[0].bankAccount}}</span>
            </li>
            <li>
              <span>税收种类</span>
              <span>{{customerInfo.financeInfos[0]&&customerInfo.financeInfos[0].taxCategory}}</span>
            </li>
            <li>
              <span>纳税人登记号</span>
              <span>{{customerInfo.financeInfos[0]&&customerInfo.financeInfos[0].taxNumber}}</span>
            </li>
            <li>
              <span>资本概括</span>
              <span>{{customerInfo.financeInfos[0]&&customerInfo.financeInfos[0].capitalProfile}}</span>
            </li>
          </ul>
        </div>
        <div class="swiper-slide galleryDiv">
          <ul>
            <li>
              <span>签约主体</span>
              <span>{{customerInfo.coopInfos[0]&&customerInfo.coopInfos[0].signSubject}}</span>
            </li>
            <li>
              <span>渠道大类</span>
              <span>{{customerInfo.coopInfos[0]&&customerInfo.coopInfos[0].channelCategory}}</span>
            </li>
            <li>
              <span>渠道类型</span>
              <span>{{customerInfo.coopInfos[0]&&customerInfo.coopInfos[0].channelType}}</span>
            </li>
            <li>
              <span>合作模式</span>
              <span>{{customerInfo.coopInfos[0]&&customerInfo.coopInfos[0].coopModel}}</span>
            </li>
            <li>
              <span>供货类型</span>
              <span>{{customerInfo.coopInfos[0]&&customerInfo.coopInfos[0].supplyType}}</span>
            </li>
            <li>
              <span>结算方式</span>
              <span>{{customerInfo.coopInfos[0]&&customerInfo.coopInfos[0].settleMethod}}</span>
            </li>
            <li>
              <span>账期类型</span>
              <span>{{customerInfo.coopInfos[0]&&customerInfo.coopInfos[0].contractType}}</span>
            </li>
            <li>
              <span>账期时间</span>
              <span>{{customerInfo.coopInfos[0]&&customerInfo.coopInfos[0].contractDayCount}}</span>
            </li>
            <li>
              <span>商品服务类型</span>
              <span>{{customerInfo.coopInfos[0]&&customerInfo.coopInfos[0].serviceType}}</span>
            </li>
            <li>
              <span>合作风险评估</span>
              <span>{{customerInfo.coopInfos[0]&&customerInfo.coopInfos[0].riskAssessment}}</span>
            </li>
            <li>
              <span>合同期限</span>
              <span>{{customerInfo.coopInfos[0]&&customerInfo.coopInfos[0].contractTerm}}</span>
            </li>
            <!-- <li>
              <span>合同附件</span>
              <span>
                <a>点击查看</a>
              </span>
            </li>-->
          </ul>
        </div>
        <div class="swiper-slide galleryDiv">
          <ul v-for="(contact,index) in customerInfo.contactsInfos" :key="'contact_'+index">
            <li>
              <span>姓名</span>
              <span>{{contact.fullName || ''}}</span>
            </li>
            <li>
              <span>性别</span>
              <span>{{gender[contact.gender] || ''}}</span>
            </li>
            <li>
              <span>生日</span>
              <span>{{contact.birthday || ''}}</span>
            </li>
            <li>
              <span>职位</span>
              <span>{{contact.position || ''}}</span>
            </li>
            <li>
              <span>座机</span>
              <span>{{contact.tel || ''}}</span>
            </li>
            <li>
              <span>手机</span>
              <span>{{contact.mobile || ''}}</span>
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
        <div class="swiper-slide galleryDiv">
          <ul
            v-for="(innerPerson,index) in customerInfo.innerPersonInfos"
            :key="'innerPerson_'+index"
          >
            <li>
              <span>姓名</span>
              <span>{{innerPerson.fullName || ''}}</span>
            </li>
            <li>
              <span>所属部门</span>
              <span>{{innerPerson.deptName || ''}}</span>
            </li>
            <li>
              <span>职位</span>
              <span>{{innerPerson.jobTitle || ''}}</span>
            </li>
            <li>
              <span>电话</span>
              <span>{{innerPerson.tel || ''}}</span>
            </li>
            <li>
              <span>邮箱</span>
              <span>{{innerPerson.email || ''}}</span>
            </li>
          </ul>
        </div>
        <div class="swiper-slide galleryDiv">
          <ul v-for="(shop,index) in customerInfo.shopInfos" :key="'shop_'+index">
            <li>
              <span>店铺名</span>
              <span>{{shop.name || ''}}</span>
            </li>
            <li>
              <span>省份</span>
              <span>{{shop.province || ''}}</span>
            </li>
            <li>
              <span>城市</span>
              <span>{{shop.city || ''}}</span>
            </li>
            <li>
              <span>区域</span>
              <span>{{shop.area || ''}}</span>
            </li>
            <li>
              <span>运营类型</span>
              <span>{{shop.operateType || ''}}</span>
            </li>
            <li>
              <span>运营团队</span>
              <span>{{shop.operateTeam || ''}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Swiper from "swiper";
import { savePosition } from "@/mixins";
import { getCustomerInfo } from "@/api/findCustomer";
import { gender } from "@/const/customer";
import { isEmpty } from "@/utils";
export default {
  name: "BaseInfoOld",
  components: {},
  mixins: [new savePosition()],
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isEmpty,
      gender,
      isOneTxt: true,
      // 页面不同title
      pageTitle: [
        { id: 1, name: "基本信息" },
        { id: 2, name: "财务信息" },
        { id: 3, name: "合作信息" },
        { id: 4, name: "联系人信息" },
        { id: 5, name: "内部跟进人" },
        { id: 6, name: "店铺信息" }
      ],
      customerInfo: {},
      defaultLogo: require("@/assets/images/defaultLogo.png")
    };
  },
  created() {
    this.fetchCustomerInfo();
  },
  mounted() {
  },
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
          res.contactsInfos = []
          res.contactsInfos.push({});
        }
        if (isEmpty(res.innerPersonInfos)) {
          res.innerPersonInfos = []
          res.innerPersonInfos.push({});
        }
        if (isEmpty(res.shopInfos)) {
          res.shopInfos = []
          res.shopInfos.push({});
        }
        this.customerInfo = res;
        setTimeout(()=>{
          this.getSwiperInit();
        },300)
      });
    },
    setOneTxt() {
      this.isOneTxt = !this.isOneTxt;
    },
    // 初始化滑动-父盒子
    getSwiperInit() {
      let galleryThumbs = new Swiper(".gallery-thumbs", {
        slidesPerView: "auto",
        freeMode: true,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        autoHeight: true,
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        onSlideChangeEnd: function(galleryThumbs) {
          galleryThumbs.update(); //swiper更新
        }
      });
      let galleryTop = new Swiper(".gallery-top", {
        autoHeight: true,
        allowTouchMove: false, //阻止滑动
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        thumbs: {
          swiper: galleryThumbs
        },
        on: {
          slideChangeTransitionStart: () => {}
        },
        onSlideChangeEnd: function(galleryTop) {
          galleryTop.update(); //swiper更新
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  height: 100vh;
  overflow-y: scroll;
  overflow-x: hidden;
  background: white;
}
.clientHeader {
  width: 92%;
  margin: 0 auto;
  margin-top: 1rem;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 29px 0px rgba(58, 120, 239, 0.08);
  border-radius: 8px;
  .client-row-one {
    width: 90%;
    margin: 0 auto;
    padding-top: 7%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    div:nth-child(1) {
      margin-right: 5%;
      width: 80px;
      height: 80px;
      border-radius: 42px;
      overflow: hidden;
      border: 1px solid rgba(216, 216, 216, 1);
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 100%;
      }
    }
    div:nth-child(2) {
      width: 100%;
      flex: 1;
      span {
        display: block;
        color: #959ca7;
        font-size: 14px;
      }
      span:nth-child(1) {
        color: #393c41;
        font-size: 18px;
        margin-bottom: 0.7rem;
      }
      span:nth-child(2) {
        margin-top: 5px;
      }
    }
  }
  .client-row-two {
    width: 90%;
    margin: 0 auto;
    margin-top: 1.8rem;
    padding-bottom: 0.7rem;
    p {
      margin: 0;
      padding: 0;
      color: #393c41;
      font-size: 15px;
      margin-bottom: 1.3rem;
      letter-spacing: 1px;
    }
    div:nth-child(1) {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      position: relative;
      p {
        width: 90%;
      }
      .OneTxt {
        position: absolute;
        top: 0;
        right: 0;
      }
    }
    .tel {
      color: rgb(92, 143, 242);
      letter-spacing: 0px;
    }
  }
}

// 总盒子
.galleryDiv {
  height: 1px;
  overflow: hidden;
  margin-bottom: 3rem;
  ul {
    width: 90%;
    margin: 0 auto;
    background: white;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 30px 0px rgba(58, 120, 239, 0.08);
    border-radius: 8px;
    padding-top: 1rem;
    li {
      width: 90%;
      margin: 0 auto;
      overflow: hidden;
      display: flex;
      justify-content: space-between;
      padding-top: 0.8rem;
      padding-bottom: 0.8rem;
      span {
        display: inline-block;
        font-size: 15px;
        word-break: break-all;
        overflow: hidden;
      }
      span:nth-child(1) {
        width: 40%;
        color: #959ca7;
      }

      span:nth-child(2) {
        width: 55%;
        margin-left: 5%;
      }
    }
  }
} /* 随意指定一个height值即可 */
.swiper-slide-active {
  height: auto;
}
.swiper-slide-thumb-active {
  position: relative;
  color: #393c41 !important;
}
.swiper-slide-thumb-active::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 0%;
  transform: translate(-50%);
  width: 30%;
  height: 10px;
  border-bottom: 3px solid #3a78ef;
  font-weight: 600;
}

// 按钮
.classification {
  text-align: left;
  width: 100%;
  // margin: 0 auto;
  margin-top: 1rem;
  margin-bottom: 1rem;
  // overflow: hidden;
  display: flex;
  // justify-content: center;
  justify-content: flex-start;
  span {
    display: inline-block;
    letter-spacing: 2px;
    font-size: 16px;
    padding: 4px 3px 10px 3px;
    color: #393c41;
    font-weight: 500;
    text-align: center;
    // margin-right: 7%;
    width: 25%;
    text-align: center;
  }
}
</style>