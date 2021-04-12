<template>
  <div class="bg-main pb20 relative" style="min-height: 100%;">
    <div class="bg-container">
      <img :src="require('@/assets/images/mine/bg.png')" class="w-full" style="max-height:200px;" />
    </div>
    <div class="main-container">
      <div class="box-container">
        <div class="userinfo">
          <div><img :src="wxCpUser.avatar || require('@/assets/images/defaultLogo.png')" /></div>
          <div>
            <p>{{wxCpUser.name}}</p>
            <p>{{wxDept.name}} · {{wxCpUser.position}}</p>
          </div>
        </div>
        <div class="userPublicDiv">
          <div @click="$router.push('/messageIndex')">
            <span>{{msgCount > 99 ? '99+' : msgCount}}</span>
            <span>消息</span>
          </div>
          <div @click="$router.push({path:'/management',query:{collect: true}})">
            <span>{{fCount}}</span>
            <span>收藏</span>
          </div>
          <div>
            <span>{{lCount}}</span>
            <span>点赞</span>
          </div>
        </div>
      </div>
      <div class="box-container mt20 pb0">
        <van-grid :column-num="3" :border="false">
          <van-grid-item 
            v-for="item in userPublic"
            :key="item.name"
            class="mb20"
            @click="onclickPage(item)"
          >
            <div><img :src="item.url" class="w-h50" /></div>
            <span class="mt10 fs14 color333">{{ item.name }}</span>
          </van-grid-item>
        </van-grid>
      </div>
    </div>
  </div>
</template>

<script>
import { currentUser, deptById } from "@/api/user";
import { noticeCount } from "@/api/message";
import { favoriteCount, likeCount } from "@/api/common";
import { selectPage as cmsSelectPage } from "@/api/cms";
import { cmsCategoryId } from "@/config";

export default {
  name: "Mine",
  components: {},
  data() {
    return {
      fCount: 0,
      lCount: 0,
      wxCpUser: {},
      wxDept: {},
      flowList: [],
      msgCount: 0,
      userPublic: [
        {
          url: require("@/assets/images/mine/mine_icon_lea@2x.png"),
          name: "我的留言",
          id: 'message'
        },
        {
          url: require("@/assets/images/mine/mine_icon_cus@2x.png"),
          name: "我的客服",
          id: 'customer'
        },
        {
          url: require("@/assets/images/mine/mine_icon_kf@2x.png"),
          name: "我的客户",
          id: 'client'
        },
        {
          url: require("@/assets/images/mine/mine_icon_task.png"),
          name: "我的任务",
          id: 'task'
        },
        {
          url: require("@/assets/images/mine/mine_icon_goods@2x.png"),
          name: "商品中心",
          id: 'goods'
        },
        {
          url: require("@/assets/images/mine/mine_icon_sup@2x.png"),
          name: "供应商中心",
          id: 'supplier'
        },
        {
          url: require("@/assets/images/mine/mine_icon_bb@2x.png"),
          name: "历史版本",
          id: 'version'
        }
      ]
    };
  },
  computed: {},
  created() {
    this.init()
  },
  activated() {
    this.initNoticeCount()
  },
  methods: {
    async init() {
      try {
        await this.fetchUserData()
      } catch (error) {
        console.log('catch====', error)
      }
      if (this.wxCpUser.departIds && this.wxCpUser.departIds.length > 0) {
        deptById(this.wxCpUser.departIds[0]).then(res => {
          this.wxDept = res
        })
      }
    },
    initNoticeCount() {
      noticeCount({ readStatus: 0, noticeTypes: [1, 2] }).then(res => {
        this.msgCount = res
      })
      favoriteCount().then(res => {
        this.fCount = res
      })
      likeCount().then(res => {
        this.lCount = res
      })
    },
    openCustService() {
      let va = this.$config.serviceMan.map(item => item.label).join(";");
      wx.openEnterpriseChat({
        userIds: va, //参与会话的企业成员列表，格式为userid1;userid2;...，用分号隔开。
        groupName: "客服", // 必填，会话名称。单聊时该参数传入空字符串""即可。
        success: function(res) {
          // 回调
        },
        fail: function(res) {
          if (res.errMsg.indexOf("function not exist") > -1) {
            alert("版本过低请升级");
          }
        }
      });
    },
    onclickPage(item) {
      switch (item.id) {
        case 'message':
          this.$router.push("/mymessage")
          break
        case 'customer':
          this.openCustService()
          break
        case 'client':
          this.$router.push('/myclient')
          break
        case 'task':
          this.$router.push('/visit-task')
          break
        case 'version':
          this.$router.push('/version')
          break
        case 'goods':
          this.openGoodsHomePage()
          break
        case 'supplier':
          this.openSupplierHomePage()
          break
        default:
          break
      }
    },
    fetchUserData() {
      return currentUser().then(res => {
        this.wxCpUser = res
      })
    },
    openGoodsHomePage() {
      window.open(`${this.$config.otherAppLogin["goods"]}`, "_blank")
    },
    openSupplierHomePage() {
      // this.$dialog.alert({
      //   message: "敬请期待！"
      // })
      window.open(`${this.$config.otherAppLogin['supplier']}`, '_blank')
    }
  }
};
</script>

<style lang="scss" scoped>
.bg-container{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  z-index: 0;
}
.main-container{
  padding-top: 60px;
  position: relative;
}

.box-container{
  padding: 1.7rem 0 1.7rem 0;
  width: 90%;
  margin: 0 auto;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 16px 0px rgba(159, 190, 240, 0.16);
  border-radius: 8px;
}

.userPublicDiv {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  div{
    width: 50%;
    display: flex;
    flex-direction: column;
    span:nth-child(1) {
      font-size: 20px;
      font-weight: bold;
      color: rgba(57, 60, 65, 1);
      line-height: 20px;
      img {
        width: 50px;
      }
    }
    span:nth-child(2) {
      font-size: 14px;
      margin-top: 10px;
      color: rgba(57, 60, 65, 1);
      line-height: 14px;
    }
  }
}
.userinfo {
  display: flex;
  align-content: center;
  align-items: center;
  text-align: left;
  overflow: hidden;
  position: relative;
  width: 84%;
  margin: 0 auto;
  margin-bottom: 1.3rem;
  div:nth-child(1) {
    width: 4rem;
    height: 4rem;
    border: 1px solid rgba(244, 244, 244, 1);
    overflow: hidden;
    position: relative;
    border-radius: 50%;
    img {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 50%;
      top: 50%;
      border-radius: 50%;
      transform: translate(-50%, -50%);
    }
  }
  div:nth-child(2) {
    // width: 30%;
    margin-left: 3.7%;
    p {
      margin: 0;
      padding: 0;
    }
    p:nth-child(1) {
      color: #393c41;
      font-size: 18px;
      font-weight: 600;
    }
    p:nth-child(2) {
      margin-top: 4%;
      color: #aeb3ba;
      font-size: 14px;
    }
    p:nth-child(3) {
      position: absolute;
      right: 0%;
      top: 50%;
      transform: translate(0px, -50%);
    }
  }
}
.userTitle {
  width: 90%;
  margin: 0 auto;
  margin-top: 1.5rem;
  margin-bottom: 1.3rem;
  font-size: 18px;
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
</style>

