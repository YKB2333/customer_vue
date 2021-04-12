<template>
  <div ref="client" id="client" class="client">
    <!-- 客户头部 -->
    <div class="clientBorderBottom">
      <div class="clientHead mt20 wpct90 mauto hidden">
        <BaseImageList :src="logo" type="right" imgClass="w76 h76" parent_class="wpct100">
          <template v-slot:title>
            <div class="Header_box">
              <div style="color:#262626" class="wpct70">
                <p class="fs16 fw500 ellipsis2">{{customerInfo.name}}</p>
              </div>
              <div style="color:#AFAFAF" class="mt8">
                <van-tag
                  color="#ecf1fd"
                  text-color="#3A78EF"
                  class="fs13"
                  size="medium"
                >渠道类型 : {{customerInfo.channelType}}</van-tag>
              </div>
              <div :class="['Header_son' ,{'isCollect': isCollect}]" @click="getCollect()">
                <van-icon name="plus" v-if="!isCollect" />
                <span>{{ isCollect ? '已收藏' : '收藏' }}</span>
              </div>
            </div>
          </template>
        </BaseImageList>
        <p class="fs14 ptb12" style="color:#6B7178">客户简称（渠道）: {{customerInfo.simpleName}}</p>
        <p class="fs14 ptb12" style="color:#6B7178">总部地址：{{customerInfo.address}}</p>
        <p
          class="fs14 pt12 pb16 l-h22"
          style="border-top:1px solid #EBEDF2;color:#3A78EF"
        >{{customerInfo.intro}}</p>
      </div>
    </div>
    <!-- 年度合作战略目标管理 -->
    <div v-show="false">
      <BaseTitle
        :isEmply="YearTarget.length===0"
        @click.native="YearTarget.length>1?($router.push({name: 'projectTarget',query:{id:id}})):null"
        :isValue="YearTarget.length>1"
        title="年度合作战略目标"
        title_Class="fs18 lh16 clientTitle"
      ></BaseTitle>
      <div style="padding:0px 18px 18px 18px;" class="clientBorderBottom">
        <div v-if="YearTarget.length>0" class="targetCon">
          <div style="display: flex;justify-content: flex-start;align-items: top;line-height:23px;">
            <span style="flex-shrink: 0;" class="targetTitle">制定部门</span>
            <span class="fz15ccc">{{YearTarget[0].companyName + '-' + YearTarget[0].deptName}}</span>
          </div>
          <div>
            <span class="targetTitle">业务板块</span>
            <span class="fz15ccc">{{YearTarget[0].businessName}}</span>
          </div>
          <div>
            <span class="targetTitle">销售目标</span>
            <span class="fz15ccc" v-if="YearTarget[0].salesTarget">{{YearTarget[0].salesTarget}}万</span>
          </div>
          <div class="progress">
            <span class="targetTitle">达成率</span>
            <div>
              <van-progress
                style="width:70%;"
                track-color="#eee"
                :show-pivot="false"
                :percentage="YearTarget[0].departYearSales"
              />
              <span>{{YearTarget[0].departYearSales}}%</span>
            </div>
          </div>
          <div>
            <p class="targetTitle">品类/品牌销售目标</p>
            <p class="fz15ccc">{{YearTarget[0].breachSalesTarget}}</p>
          </div>
          <div>
            <p class="targetTitle">选品策略</p>
            <p class="fz15ccc">{{YearTarget[0].productSelectionStrategr}}</p>
          </div>
          <div class="mb14" v-if="YearTarget[0].attas && YearTarget[0].attas.length>0">
            <p class="targetTitle">年度行动计划</p>
            <atta-item
              v-for="(item, index) in YearTarget[0].attas"
              :key="index"
              parentClass="attaList"
              :file-name="item.fileName"
              :file-type="item.fileType"
              :size="item.size"
              :attaId="item.id"
              :attaUrl="item.attaUrl"
              :parentStyle="`box-shadow: none;padding:0;height:60px;`"
            />
          </div>
          <!-- <img src="@/assets/images/customer/theplan.png" alt  @click=" $router.push({path: '/process',query: {id: YearTarget[0].id}})" /> -->
        </div>
      </div>
    </div>
        <!-- 本月销量 -->
    <div class="clientBorderBottom pb10">
      <BaseTitle 
      title="本月销量" 
      title_Class="fs18 lh16 clientTitle" 
      :isValue="customerInfo.ncCode && monthSales && monthSales.amt != null ? true : false"
      is_link
      :isEmply="!customerInfo.ncCode || !monthSales"
      :to="`/customer/sales/data?from=customerDetail&businessId=all&type=1&code=${customerInfo.id}&name=${customerInfo.name}&timeType=1&time=${formatDate(new Date().getTime(), 'Y/M/D')}`"
      ></BaseTitle>
      <div class="row space-between wpct100 mauto monthSales">
        <div class="text-center monthSalesSon" v-show="customerInfo.ncCode && monthSales">
          <div v-if="monthSales && monthSales.amt == null">
            <img src="@/assets/images/customer/down.png" alt />
            <p>****</p>
          </div>
          <div v-else>
            <img
              v-if="monthSales && monthSales.amtGrowthRate && monthSales.amtGrowthRate > 0"
              src="@/assets/images/customer/up.png"
              alt
            />
            <img v-else src="@/assets/images/customer/down.png" alt />
            <p>{{(monthSales&&monthSales.amt) | toThousandFilter(0)}}</p>
          </div>
          <p>出货额(元)</p>
        </div>
        <div class="text-center monthSalesSon" v-show="customerInfo.ncCode && monthSales">
          <div v-if="monthSales && monthSales.qty == null">
            <img src="@/assets/images/customer/down.png" alt />
            <p>****</p>
          </div>
          <div v-else>
            <img
              v-if="monthSales && monthSales.qtyGrowthRate && monthSales.qtyGrowthRate > 0"
              src="@/assets/images/customer/up.png"
              alt
            />
            <img v-else src="@/assets/images/customer/down.png" alt />
            <p>{{ (monthSales&&monthSales.qty) | toThousandFilter(0)}}</p>
          </div>
          <p>出货量(件)</p>
        </div>
      </div>
    </div>
    <!-- 热销 -->
    <!-- <div v-if="top.length">-->
    <BaseTitle title="热销品" title_Class="fs18 lh16 clientTitle" :isEmply="top.length===0">
      <div slot="value">
        <van-tabs
          :border="false"
          @change="changeSale"
          :ellipsis="false"
          line-height="2px"
          color="#3A78EF"
        >
          <van-tab name="month" title="本月"></van-tab>
          <van-tab name="year" title="本年"></van-tab>
        </van-tabs>
      </div>
    </BaseTitle>
    <div class="clientBorderBottom pb10">
      <BaseImageList
        type="right"
        parent_class="hotList ptb14 pl4 pr4 mb16"
        v-for="(item,index) in top"
        :key="index"
        :title="item.skuName"
        :src="item.skuImg || item.skuImg"
        is_link
        Title_Class="ml14"
      >
        <!-- 标题 -->
        <template v-slot:title>
          <div style="color:#393C41" class="mt10">
            <p class="fs14 fw500 ellipsis2" style="min-height:30px">{{ item.skuName }}</p>
          </div>
          <!-- 出货图标 -->
          <span class="fs12 mt10">
            <img src="@/assets/images/customer/delivery_icon@2x.png" class="w16 h12 mr4" alt />
            {{ item.qty | toThousandFilter(0)}} 件
          </span>
        </template>
        <!-- 品牌img -->
        <template v-slot:img>
          <div class="w80 h80" style="background:white">
            <img
              :src="item.skuImg || item.spuImg || defaultLogo"
              style="width:100%;height:100%"
              alt
            />
          </div>
          <img
            :src="require('@/assets/images/customer/0'+ parseInt(index+1 )+'@2x.png')"
            class="clientTag"
            alt
          />
        </template>
      </BaseImageList>
    </div>
    <!-- 客户经营状况 -->
    <div>
      <BaseTitle
        @click.native="OperationgStatusInfo.length>0?($router.push({name: 'manage',query:OperationgStatusInfo[0]})):null"
        :isValue="OperationgStatusInfo.length>0"
        title="客户经营状况"
        title_Class="fs18 lh16 clientTitle"
      ></BaseTitle>
      <div class="clientBorderBottom p10 pb30 row manage">
        <div class="fl1 manageList hidden pr4 relative">
          <img src="@/assets/images/customer/hypm.png">
          <div class="absolute plr20" style="left:0;top:16%;">
            <div class="manageTitle">
              行业排名
            </div>
            <div
              class="manageRes ellipsis2 fs15 fw600"
            >{{OperationgStatusInfo[0]?OperationgStatusInfo[0].industryRank:'暂无'}}</div>
          </div>
        </div>
        <div class="fl1 manageList hidden pl4 relative">
          <img src="@/assets/images/customer/zypl.png">
          <div class="absolute plr20" style="left:0;top:16%;">
            <div class="manageTitle">
              主营品类
            </div>
            <div
              class="manageRes ellipsis2 fs15 fw600"
            >{{OperationgStatusInfo[0]?OperationgStatusInfo[0].mainCategory:'暂无'}}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 滞销品 -->
    <!--<div v-if="bottom.length">-->
    <!-- <BaseTitle title="滞销品" title_Class="fs18 lh16 clientTitle" :isEmply="bottom.length===0">
        <div slot="value">
          <van-tabs :ellipsis="false" line-height="2px" color="#3A78EF">
            <van-tab title="本年"></van-tab>
            <van-tab title="本月"></van-tab>
          </van-tabs>
        </div>
      </BaseTitle>
      <div class="clientBorderBottom pb10">
        <BaseImageList
          type="right"
          parent_class="hotList p14 mb16"
          v-for="(item,index) in bottom"
          :key="index"
          :title="item.skuName"
          :src="item.skuImg || item.spuImg"
          is_link
    Title_Class="ml14"-->
    <!-- > -->
    <!-- 标题 -->
    <!-- <template v-slot:title>
            <div style="color:#393C41" class="mt10">
              <p class="fs14 fw500 ellipsis2" style="min-height:30px">{{ item.skuName }}</p>
    </div>-->
    <!-- 出货图标 -->
    <!-- <span class="fs12 mt10">
              <img src="@/assets/images/customer/delivery_icon@2x.png" class="w16 h12 mr4" alt />
              {{ item.qty | toThousandFilter(0)}}件
            </span>
    </template>-->
    <!-- 品牌img -->
    <!-- <template v-slot:img>
            <div class="w80 h80" style="background:white">
              <img :src="item.skuImg || item.spuImg" style="width:100%;height:100%" alt />
            </div>
            <img
              :src="require('@/assets/images/customer/0'+ parseInt(index+1 )+'@2x.png')"
              class="clientTag"
              alt
            />
          </template>
        </BaseImageList>
    </div>-->
    <!--</div>-->
    <!-- 已合作商品清单 -->
    <div class="clientBorderBottom pb10">
      <BaseTitle
        :to="`/coopList?id=${customerInfo.ncCode}`"
        is_link
        :isValue="coopList && coopList.length>0"
        title="已合作商品清单"
        title_Class="fs18 lh16 clientTitle"
      ></BaseTitle>
      <div v-if="coopList && coopList.length>0" class="coop">
        <ul class="pt14">
          <li @click="toGoods(item)" v-for="(item,index) in coopList" :key="index">
            <img
              v-if="index<3"
              class="coopTitle"
              :src="require(`@/assets/images/customer/tag_top${index+1}.png`)"
              alt
            />
            <span v-if="index>=3">{{index+1}}</span>
            <div>
              <img :src=" item.titleImage || defaultLogo" alt />
            </div>
            <p style="color:#393C41;" class="fs12">{{item.name}}</p>
          </li>
        </ul>
      </div>
      <emply v-else />
    </div>
    <!-- 活动预告 -->
    <BaseTitle title="活动预告" title_Class="fs18 lh16 clientTitle"></BaseTitle>
    <div class="clientBorderBottom pb10">
      <div v-if="activety.length>0">
        <BaseImageList
          type="right"
          imgClass="w82 h82"
          parent_class="wpct90 mb14"
          v-for="(item,index) in activety"
          :key="index"
          @click.native="$router.push({name:'activeDetail',query:{query:item,name:customerInfo.name,id:item.id}})"
        >
          <template v-slot:img>
            <div
              class="w100 h100 hidden"
              style="background:white;border:1px solid rgba(235,237,242,1);border-radius:5px;"
            >
              <img
                :src="item.titleImage || logo"
                style="width:100%;height:100%;object-fit: contain;"
                alt
              />
            </div>
          </template>
          <template v-slot:title>
            <div class="actives">
              <div>
                <p style="color:#393C41;" class="fs18 fw600 ellipsis">{{item.title}}</p>
              </div>
              <!-- <div style="color:#959CA7;"> -->
              <p class="ellipsis2 fs13">负责人：{{item.handler}}</p>
              <p
                class="ellipsis fs13"
              >活动期间：{{item.startTime | formatDate('Y.M.D')}}-{{item.endTime | formatDate('Y.M.D')}}</p>
              <!-- </div> -->
            </div>
          </template>
        </BaseImageList>
      </div>
      <emply v-else />
    </div>

    <div class="clientBorderBottom pb10" v-if="productNews.length">
      <h4 class="fw600 fs16 wpct90 mauto mt20">新品预告</h4>
      <van-grid :column-num="3" :border="false" class="wpct100">
        <van-grid-item v-for="(item,index) in productNews" :key="index">
          <div class="bestSeller">
            <img :src="item.image" alt />
          </div>
          <p class="ellipsis mt10 wpct78 fs13 text-center" style="color:#393C41">{{item.name}}</p>
          <P class="fs12 mt6" style="color:#959CA7">上市时间:</P>
          <p class="fs12" style="color:#959CA7">{{item.marketTime | formatDate('Y.M.D')}}</p>
        </van-grid-item>
      </van-grid>
    </div>
    <!-- 客户运营玩法 -->
    <!--<div v-if="operate.length">-->
    <div>
      <BaseTitle title="客户运营玩法" title_Class="fs18 lh16 clientTitle" :isEmply="operate.length===0"></BaseTitle>
      <div class="clientBorderBottom pb10">
        <BaseImageList
          type="right"
          imgClass="w82 h82"
          parent_class="wpct90 mb14"
          v-for="(item,index) in operate"
          :key="index"
          @click.native="$router.push({ name: 'UserOperation', query: { id: item.id} })"
        >
          >
          <template v-slot:img>
            <div
              class="w100 h100 hidden"
              style="background:white;border:1px solid rgba(235,237,242,1);border-radius:5px;"
            >
              <img :src="item.logo" style="width:100%;height:100%" alt />
            </div>
          </template>
          <template v-slot:title>
            <div class="clientBorderBottomTitle">
              <div
                style="color:#262626;line-height: 24px;margin-bottom: 8px;"
                class="mt8s"
              >
                <p class="fs16 fw600 ellipsis2">{{item.platformName}}</p>
              </div>
              <div style="color:#AFAFAF" class="mt6">
                <span class="fs12 ellipsis2" style="color:#959CA7;">
                  <van-tag color="#fdf5eb" text-color="#EF9236" class="mr10">关键字</van-tag>
                  {{item.tag}}
                </span>
              </div>
            </div>
          </template>
        </BaseImageList>
      </div>
    </div>

    <!-- 客户月度热卖产品 -->
    <!-- <div class="clientBorderBottom pb10">
      <BaseTitle title="客户月度热卖产品" title_Class="fs18 lh16 clientTitle"
                 :isEmply="monthTopSales.length===0"></BaseTitle>
      <van-grid :column-num="3" :border="false" class="wpct100">
        <van-grid-item v-for="(item,index) in monthTopSales" :key="index">
          <div class="bestSeller">
            <img :src="item.skuImg || item.spuImg" alt />
          </div>
          <p class="ellipsis mt10 wpct70 fs13" style="color:#393C41">{{item.skuName}}</p>
        </van-grid-item>
      </van-grid>
    </div>-->
    <!-- 竞品分析 -->
    <div class="p20 mauto clientBorderBottom">
      <img
        @click="$router.push({name: 'competitor',query:{id:id,name:customerInfo.name}})"
        src="@/assets/images/customer/goods_analysis@2x.png"
        alt
      />
    </div>
    <!-- 客户合同管理 -->
    <div class="p20 mauto clientBorderBottom">
      <img
        @click="$router.push({name: 'agreement',query:{id:id}})"
        src="@/assets/images/customer/agreement.png"
        alt
      />
    </div>
    <!-- 客户店铺平台相关 -->
    <div class="p20 mauto clientBorderBottom">
      <img
        @click="$router.push({name: 'shop',query:{id:id}})"
        src="@/assets/images/customer/shopMes.png"
        alt
      />
    </div>
    <!-- 核心项目进展 -->
    <!-- <div class="clientBorderBottom pb10" >
      <BaseTitle title="核心项目进展" title_Class="fs18 lh16 clientTitle"
                 :isEmply="project.length===0"></BaseTitle>
      <div
        class="row kernelProject"
        v-for="(item,index) in project"
        :key="index"
        @click=" $router.push({path: '/projectprogress',query: {id: item.id}})"
      >
        <span class="row center-y ellipsis">
          <strong class="aim"></strong>
          {{item.name}}
        </span>
        <span class="ellipsis">{{item.leader}}</span>
        <span class="ellipsis">{{item.startTime | formatDate('Y/M/D')}}</span>
      </div>
    </div>-->
    <!-- 内部联系人 -->
    <div class="clientBorderBottom pb20">
      <BaseTitle
        title="内部联系人"
        title_Class="fs18 lh16 clientTitle "
        :isEmply="customerInfo.innerPersonInfos && customerInfo.innerPersonInfos.length===0"
      ></BaseTitle>
      <template v-if="customerInfo.innerPersonInfos && customerInfo.innerPersonInfos.length > 0">
      <template v-for="(item,index) in customerInfo.innerPersonInfos">
          <div
            v-if="index<clientLXP"
            :key="index"
            class="row flex-start p14 client_box_shaodow wpct92 mauto mb14"
            style="border-radius: 5px;"
          >
            <div class="w46 h46 mr14">
              <img src="@/assets/images/customer//contact_icon@2x.png" class="w46 h46" alt />
            </div>
            <div>
              <p class="fs14" style="color:#393C41">
                {{item.fullName}}
                <span class="fs12 ml10" style="color:#959CA7">{{item.tel}}</span>
              </p>
              <p class="mt6 fs12 ellipsis" style="color:#959CA7">{{item.deptName}} {{item.jobTitle}}</p>
            </div>
          </div>
        </template>
        <template v-if="customerInfo.innerPersonInfos.length>2">
          <div class="text-center fs12">
            <img
              :src="require('@/assets/images/find/new_find/theme_icon_all@2x.png')"
              alt
              class="w20 h14"
              v-if="clientLXP<=2"
              @click="changeClientLXP(9999)"
            />
            <img
              :src="require('@/assets/images/find/new_find/theme_icon_all@2x.png')"
              alt
              class="w20 h14"
              style="transform: rotate(180deg)"
              v-else
              @click="changeClientLXP(2)"
            />
          </div>
          <!-- <img :src="require('@/assets/images/find/new_find/theme_icon_all@2x.png')" alt="" class="w-h10" style="transform: rotate(180deg)" v-if="isShowAllText"> -->
        </template>
      </template>
    </div>
    <!-- 相关附件 -->
    <div class="clientBorderBottom pb10">
      <BaseTitle title="相关附件" title_Class="fs18 lh16 clientTitle"></BaseTitle>
      <div>
        <div class="align file">
          <div @click="onClickAttal(customerInfo.introduceAttas)" class="file_1">
            <p>客户介绍资料</p>
            <p>({{customerInfo.introduceAttas? customerInfo.introduceAttas.length : 0}})</p>
          </div>
          <div @click="onClickAttal(customerInfo.successAttas)" class="file_2">
            <p>客户成功案例</p>
            <p>({{customerInfo.successAttas? customerInfo.successAttas.length : 0}})</p>
          </div>
          <div @click="onClickAttal(customerInfo.proposalAttas)" class="file_3">
            <p>客户提案</p>
            <p>({{customerInfo.proposalAttas ? customerInfo.proposalAttas.length : 0 }})</p>
          </div>
        </div>
        <div
          class="wpct92 mauto mt10 clientBase"
          @click="$router.push({name:'CustomerBaseInfo',query:{id:id}})"
        >
          <img src="@/assets/images/customer/base_info_bg@2x.png" alt />
          <div class="clientBaseSon">
            <img src="@/assets/images/customer/base_info_icon@2x.png" alt />
            客户基础信息明细
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AttaItem from "@/components/AttachmentItem";
import { showRecentTime, formatDate } from "@/utils";
import { savePosition } from "@/mixins";
import {
  getCustomerInfoById,
  getSkuRank,
  getYearTarget,
  getActivityPage,
  getProductNewsPage,
  getProjectPage,
  getOperatePage,
  getMonthTopSales,
  getMonthSales,
  // getCoopGoodsCountByBrandCategory,
  getCoopGoods,
  getOperationgStatusInfo
} from "@/api/findCustomer/customer";
import { spuSearch } from "@/api/spu";
import { addFavorite, cancelFavorite } from "@/api/findCustomer/index";
import { favoritePage } from "@/api/common";
import BaseImageList from "@/components/BaseImageList";
import BaseTitle from "@/components/BaseTitle";
import { brandCategory } from "@/const/goods";

export default {
  name: "CustomerDetails",
  components: {
    BaseImageList,
    BaseTitle,
    AttaItem
  },
  mixins: [new savePosition()],
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      oldId: "",
      scrollTop: "",
      YearTarget: [],
      brandCategory,
      defaultLogo: require("@/assets/images/defaultLogo.png"),
      customerInfo: {},
      // customerInfo: {
      //   innerPersonInfos: [
      //     {
      //       baseInfoId: 444858506272206850,
      //       businessId: null,
      //       createTimestamp: 1586228998684,
      //       deptId: 366,
      //       deptName: "花出见研发部",
      //       email: "linjiaqi@zshcx.com",
      //       fullName: "林嘉琪",
      //       id: 444858506637111300,
      //       jobTitle: "资料专员",
      //       jobTitleId: "812",
      //       tel: "13168328435"
      //     },
      //     {
      //       baseInfoId: 444858506272206850,
      //       businessId: null,
      //       createTimestamp: 1586228998684,
      //       deptId: 366,
      //       deptName: "花出见研发部",
      //       email: "linjiaqi@zshcx.com",
      //       fullName: "林嘉琪",
      //       id: 444858506637111300,
      //       jobTitle: "资料专员",
      //       jobTitleId: "812",
      //       tel: "13168328435"
      //     },
      //     {
      //       baseInfoId: 444858506272206850,
      //       businessId: null,
      //       createTimestamp: 1586228998684,
      //       deptId: 366,
      //       deptName: "花出见研发部",
      //       email: "linjiaqi@zshcx.com",
      //       fullName: "林嘉琪",
      //       id: 444858506637111300,
      //       jobTitle: "资料专员",
      //       jobTitleId: "812",
      //       tel: "13168328435"
      //     },
      //     {
      //       baseInfoId: 444858506272206850,
      //       businessId: null,
      //       createTimestamp: 1586228998684,
      //       deptId: 366,
      //       deptName: "花出见研发部",
      //       email: "linjiaqi@zshcx.com",
      //       fullName: "林嘉琪",
      //       id: 444858506637111300,
      //       jobTitle: "资料专员",
      //       jobTitleId: "812",
      //       tel: "13168328435"
      //     }
      //   ]
      // },
      top: [],
      coopList: [],
      // bottom: [],
      monthSales: {},
      projects: [
        {
          id: 148,
          infoId: 82,
          attaUrl:
            "http://zs-cms.oss-cn-shenzhen.aliyuncs.com/info_atta/2019/12/20/1624d042-aacc-4af4-bce2-dce7fa340e27.pptx",
          fileName: "泛微Ecology8 JS开发基础0.5V4.pptx",
          fileType: "pptx",
          size: 551709,
          createTimestamp: 1576834339913
        }
      ],
      // coopGoodsCount: [
      //   //合作列表
      //   {
      //     url: require("@/assets/images/customer/client_img_nb.png"),
      //     type: "NB",
      //     number: 0
      //   },
      //   {
      //     url: require("@/assets/images/customer/client_img_pb.png"),
      //     type: "PB",
      //     number: 0
      //   },
      //   {
      //     url: require("@/assets/images/customer/client_img_jvb.png"),
      //     type: "JVB",
      //     number: 0
      //   },
      //   {
      //     url: require("@/assets/images/customer/client_img_odm.png"),
      //     type: "ODM",
      //     number: 0
      //   }
      // ],
      // monthTopSales: [],
      activety: [],
      productNews: [],
      project: [],
      operate: [],
      OperationgStatusInfo: [],
      isCollect: false, // 是否收藏
      clientLXP: 3, //内部联系人数
    };
  },
  computed: {
    logo() {
      if (this.customerInfo.logo) return this.customerInfo.logo;
      return this.defaultLogo;
    }
  },
  methods: {
    formatDate,
    toGoods(item) {
      let goods = this.$config.otherAppLogin["goods"];
      window.open(`${goods}&jump=/productDetail?spuId=${item.id}`, "_blank");
    },
    async changeSale(value) {
      this.$toast.loading({
        duration: 0,
        message: "加载中...",
        forbidClick: true
      });
      await this.fetchSkuRank(value);
      this.$toast.clear();
    },
    getCollect() {
      // 添加收藏
      if (this.isCollect === false) {
        // 收藏
        this.isCollect = true;
        this.$toast("收藏成功");
        this.addFavorites();
      } else {
        this.isCollect = false;
        this.$toast("取消收藏");
        this.cancelFavorites();
      }
    },
    addFavorites() {
      addFavorite({
        contentType: "customerCustInfo",
        id: this.customerInfo.id,
        title: this.customerInfo.name,
        titleImage: this.customerInfo.logo
      })
        .then(res => {
          console.log(res);
        })
        .catch(error => {
          console.log(error);
          this.isCollect = false;
          this.$toast("收藏失败");
        });
    },
    cancelFavorites() {
      cancelFavorite(this.customerInfo.id)
        .then(res => {})
        .catch(error => {
          console.log(error);
          this.$toast("取消收藏失败");
        });
    },
    getFavoritePage() {
      // 获取有没有收藏
      favoritePage({
        contentType: "customerCustInfo",
        pageIndex: 1,
        pageSize: 5
      })
        .then(res => {
          console.log(res, "收藏");
          if (res.list.length !== 0) {
            this.isCollect = true;
          }
          for (var item of res.list) {
            if (item.relationKey == this.customerInfo.id + "") {
              this.isCollect = true;
              return;
            } else {
              this.isCollect = false;
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    onClickAttal(item) {
      if (!item.length) {
        this.$toast("暂无数据.请上传后再查看");
        return;
      }
      console.log(item);
      this.$router.push({
        path: "/infoAttaList",
        query: { AttaList: JSON.stringify(item) }
      });
    },
    showRecentTime,
    fetchCustomerInfo() {
      return new Promise((resolve, reject) => {
        getCustomerInfoById(this.id)
          .then(res => {
            this.customerInfo = res;
            resolve();
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    fetchSkuRank(value) {
      return new Promise((resolve, reject) => {
        let value_ = value == "year" ? true : value == "month" ? false : false;
        getSkuRank({
          pageIndex: 1,
          pageSize: 5,
          csCode: this.customerInfo.ncCode,
          yearOrMonth: value_
        })
          .then(res => {
            this.top = res.top;
            resolve();
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    fetchCoopList(value) {
      return new Promise((resolve, reject) => {
        let params = {
          orderProperty: "monthAmt",
          orderType: 1,
          pageIndex: 1,
          pageSize: 9
        };
        if (!this.customerInfo.ncCode) return;
        spuSearch(params, this.customerInfo.ncCode)
          .then(res => {
            this.coopList = res.list || [];
            resolve(res);
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    fetchMonthSales() {
      if (!this.customerInfo.ncCode) return;
      console.info('getMonthSales', this.customerInfo.ncCode)
      getMonthSales(this.customerInfo.ncCode).then(res => {
        console.info('getMonthSales', res)
        this.monthSales = res;
      });
    },
    // fetchCoopGoodsCountByBrandCategory() {
    //   getCoopGoodsCountByBrandCategory(this.id).then(res => {
    //     res.forEach(r => {
    //       r.name = brandCategory[r.name];
    //       let coopIndex = this.coopGoodsCount.findIndex(e => {
    //         return (e.type == r.name);
    //       });
    //       if (coopIndex < 0) return;
    //       this.coopGoodsCount[coopIndex].number = r.count;
    //     });
    //   });
    // },
    fetchActivityPage() {
      getActivityPage({
        pageIndex: 1,
        pageSize: 3,
        customerId: this.id,
        orderStr: 'startTime desc'
      }).then(res => {
        this.activety = res.records;
      });
    },
    fetchProductNewsPage() {
      getProductNewsPage({
        pageIndex: 1,
        pageSize: 3,
        customerId: this.id
      }).then(res => {
        this.productNews = res.records;
      });
    },
    fetchOperatePage() {
      getOperatePage({
        pageIndex: 1,
        pageSize: 3,
        baseInfoId: this.id,
        status:1
      }).then(res => {
        console.log(res.records, "运营");
        this.operate = res.records;
      });
    },
    // fetchMonthTopSales(value) {
    //   getMonthTopSales({
    //     pageIndex: 1,
    //     pageSize: 3,
    //     csCode: this.customerInfo.ncCode,
    //   }).then(res => {
    //     this.monthTopSales = res.records;
    //   });
    // },
    fetchProjectPage() {
      getProjectPage({
        pageIndex: 1,
        pageSize: 3,
        customerId: this.id
      }).then(res => {
        this.project = res.records;
      });
    },
    getOperationgStatusInfo() {
      //经营状况
      getOperationgStatusInfo(this.id).then(res => {
        this.OperationgStatusInfo = res;
      });
    },
    fetchGetYearTarget() {
      return new Promise((resolve, reject) => {
        getYearTarget(this.id)
          .then(res => {
            this.YearTarget = res;
            if (this.YearTarget.length > 0) {
              this.YearTarget.forEach(item => {
                if (item.departYearSales && item.salesTarget) {
                  item.departYearSales = parseInt(
                    (Number(item.departYearSales || 0) /
                      (Number(item.salesTarget || 0) * 10000)) *
                      100
                  );
                } else {
                  item.departYearSales = 0;
                }
              });
            }
            resolve(res);
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    async init() {
      this.$toast.loading({
        duration: 0,
        message: "加载中...",
        forbidClick: true
      });
      await this.fetchGetYearTarget();
      await this.fetchCustomerInfo();
      await this.fetchSkuRank();
      this.oldId = this.id;
      document.getElementById("app").scrollTop = 0;
      this.$toast.clear();
      this.getFavoritePage();
      this.fetchMonthSales();
      // this.fetchCoopGoodsCountByBrandCategory();
      this.fetchProductNewsPage();
      this.fetchActivityPage();
      this.fetchOperatePage();
      // this.fetchMonthTopSales();
      this.fetchProjectPage();
      this.getOperationgStatusInfo();
      this.fetchCoopList();
    },
    //展开联系人
    changeClientLXP(num) {
      this.clientLXP = num;
    }
  },
  activated() {
    if (this.id !== this.oldId) {
      this.init();
    }
  },
  created() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.client {
  overflow-x: hidden;
}
.clientBorderBottom {
  border-bottom: 15px solid #f3f4f9;
}
.clientBorderBottomTitle {
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.clientTitle {
  font-weight: 500;
  color: rgba(57, 60, 65, 1);
  line-height: 15px;
}
.hotList {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 21px 0px rgba(40, 109, 153, 0.1);
  border-radius: 5px;
  // overflow: hidden;
  position: relative;
}
.clientTag {
  position: absolute;
  left: 0;
  top: 0;
  width: 22px;
  height: 24.5;
}
.monthSales {
  .monthSalesSon {
    margin-top: 14px;
    margin-bottom: 14px;
    width: 50%;
    position: relative;

    div:nth-child(1) {
      display: flex;
      justify-content: center;
      align-content: center;
      align-items: center;
      position: relative;

      img {
        // position: absolute;
        // left: 0%;
        // top: 50%;
        // transform: translate(0%,-50%);
        width: 8px;
        height: 9px;
        display: flex;
        justify-content: flex-start;
        align-content: center;
        margin-right: 10px;
      }
      p {
        font-size: 18px;
        font-weight: bold;
        letter-spacing: 1px;
        color: rgba(58, 120, 239, 1);
        margin-right: 15px;
        // line-height:15px;
      }
    }
    p:nth-child(2) {
      font-size: 12px;
      font-weight: 500;
      color: rgba(149, 156, 167, 1);
      letter-spacing: 1px;
      margin-top: 10px;
    }
  }
}

.correlation {
  // width: 92%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  .correlationSon {
    position: relative;
    width: 49%;
    box-sizing: border-box;
    overflow: hidden;

    .correlationSonDiv {
      font-size: 14px;
      color: white;
      width: 100%;
      text-align: center;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      img {
        width: 38px;
        margin-right: 7px;
      }
    }
  }
}
.clientBase {
  position: relative;
  .clientBaseSon {
    font-size: 14px;
    color: white;
    position: absolute;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 38px;
      margin-right: 7px;
    }
  }
}
.client_box_shaodow {
  box-shadow: 0px 0px 21px 0px rgba(40, 109, 153, 0.1);
}
.kernelProject {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 21px 0px rgba(40, 109, 153, 0.1);
  border-radius: 5px;
  text-align: center;
  height: 45px;
  line-height: 45px;
  align-items: center;
  width: 92%;
  margin: 0 auto;
  margin-bottom: 15px;
  span {
    flex: 1;
    font-size: 14px;
    font-weight: 500;
    color: #6b7178;
    line-height: 15px;
  }
  span:last-child {
    text-align: right;
    margin-right: 10px;
    color: #959ca7;
  }
}
.aim {
  background: #3a78ef;
  width: 6px;
  height: 6px;
  display: block;
  position: relative;
  margin-left: 10px;
  margin-right: 8px;
  border-radius: 50%;
}

.bestSeller {
  width: 106px;
  height: 106px;
  overflow: hidden;
  border: 1px solid rgba(235, 237, 242, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 68px;
    height: 68px;
  }
}

.Header_box {
  position: relative;
  width: 100%;
  .Header_son {
    position: absolute;
    right: 0;
    top: 10px;
    font-size: 12px;
    color: white;
    background: #3a78ef;
    border-radius: 3px;
    width: 60px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      margin-left: 3px;
    }
  }
}
.isCollect {
  background: #c8cbd2 !important;
}
/deep/ .van-grid {
  width: 98%;
  margin: 0 auto;
}
/deep/ .van-grid-item__content {
  padding: 16px 0px !important;
}
/deep/ .van-grid-item {
  width: 33%;
}
.cooperation_box {
  position: relative;
  width: 49%;
  margin-bottom: 2%;
  .cooperation_son {
    position: absolute;
    left: 15%;
    top: 50%;
    transform: translate(0, -50%);
    text-align: center;
    span {
      display: block;
      color: white;
      font-weight: 600;
      font-size: 20px;
    }
  }
}
.manage {
  // text-align: center;
  box-sizing: border-box;
  .manageList {
    min-width:40%;
    // padding:15px 0px ;
    .manageTitle {
      font-size: 12px;
      color: #ffffff;
      line-height: 24px;
      display: flex;
      // align-items: center;
      // justify-content: center;
    }
    img{
      width: 100%;
      height: 100%;
    }
    .manageRes {
      color: #ffffff;
      font-size: 14px;
      margin-top: 4px;
      // margin-top: 14px;
    }
  }
}
.targetCon {
  box-shadow: 0px 0px 46px 0px rgba(40, 109, 153, 0.1);
  border-radius: 5px;
  padding: 24px 14px;
  padding-bottom: 8px;
  line-height: 1;
  > div {
    margin-bottom: 26px;
    > p:nth-child(1) {
      padding-right: 0;
      margin-bottom: 6px;
    }
    > p:nth-child(2) {
      padding-right: 0;
      line-height: 23px;
    }
  }
  .targetTitle {
    font-size: 15px;
    color: #393c41;
    padding-right: 30px;
    font-weight: bold;
  }
  .link {
    display: flex;
    align-items: center;
    > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      overflow: hidden;
      flex: 1;
      > div {
        overflow: hidden;
        p {
          font-size: 14px;
          font-weight: bold;
          color: rgba(57, 60, 65, 1);
          padding: 6px 0 0 10px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        p:nth-child(2) {
          font-size: 11px;
          color: rgba(149, 156, 167, 1);
          font-weight: normal;
        }
      }
      .look {
        box-sizing: border-box;
        padding: 2px 13px;
        font-size: 12px;
        min-width: 50px;
      }
    }
  }
}
.fz15ccc {
  color: #6b7178;
  font-size: 15px;
}
.emply {
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
.file {
  padding: 10px 15px 0 15px;
  > div {
    height: 79px;
    flex: 1;
    margin-right: 10px;
    border-radius: 4px;
    color: rgba(254, 254, 255, 1);
    font-size: 14px;
    padding: 12px 10px;
  }
  .file_1 {
    background: url("../../../assets/images/customer/introduce_bg@2x.png")
      no-repeat top left;
    background-size: cover;
  }
  .file_2 {
    background: url("../../../assets/images/customer/success_bg@2x.png")
      no-repeat top left;
    background-size: cover;
  }
  .file_3 {
    background: url("../../../assets/images/customer/proposal_bg@2x.png")
      no-repeat top left;
    background-size: cover;
    margin-right: 0;
  }
}
.progress {
  display: flex;
  align-items: center;
  .targetTitle {
    flex-shrink: 0;
    padding-right: 45px;
  }
  > div {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: space-between;
  }
}
.coop {
  padding-left: 18px;
  > ul {
    //品牌list
    display: flex;
    align-items: center;
    padding-bottom: 24px;
    overflow: auto;
    li {
      position: relative;
      .coopTitle {
        position: absolute;
        width: 16px;
        height: 21px;
        left: 0;
        top: 0;
      }
      > span {
        position: absolute;
        top: 0;
        left: 0;
        display: inline-block;
        width: 18px;
        height: 18px;
        text-align: center;
        line-height: 18px;
        border: 1px solid #959ca7;
        color: #959ca7;
        font-size: 13px;
        font-weight: bold;
        border-radius: 50%;
      }
      margin-right: 35px;
      width: 95px;
      flex-shrink: 0;
      div {
        // border: 1px solid #EBEDF2;
        height: 95px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 14px;
        img {
          width: 66px;
          height: 66px;
        }
      }
      p {
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #393c41;
      }
    }
  }
  ul::-webkit-scrollbar {
    display: none;
  }
}
/deep/ .van-tab {
  padding: 0 8px;
  color: #959ca7;
}
/deep/ .van-tab--active {
  color: #393c41;
  font-weight: bold;
}
/deep/ .van-tabs__nav--line {
  height: 84%;
}
.actives {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  p {
    margin-bottom: 10px;
  }
  > p:last-child {
    margin-bottom: 0;
  }
  > p {
    color: #959ca7;
  }
}
// /deep/ #attachment-item{
//   &:nth-last-child(){
//     margin-bottom: 0 !important;
//   }
// }
/deep/ .attaList {
  &:nth-last-child(1) {
    margin-bottom: 0 !important;
  }
}
</style>
