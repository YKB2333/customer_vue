<template>
  <div id="page">
    <ul class="CustomerCaseList">
        <li>
            <div class="salesInformation">
                <div>
                <img :src="info.titleImage" alt />
                </div>
                <div>
                    <!--
                    <p>{{ (ecologyUser && ecologyUser.lastname) ? ecologyUser.lastname : info.title}}</p>
                    <p>{{ (ecologyUser && ecologyUser.departmentname) ? ecologyUser.departmentname : info.subhead}}</p>
                    <p>私信</p>
                    -->
                    <p>{{ wxCpUser ? wxCpUser.name : info.title}}</p>
                    <p>{{ wxCpDept ? wxCpDept.name : info.subhead}}</p>
                    <p v-if="wxCpUser && wxCpUser.userId" @click="openChart(wxCpUser.userId)">私信</p>
                </div>
            </div>
            <p class="salesBottomP">关联客户: {{info.keyword}}</p>
        </li>
    </ul>
    <div class="userfInfo" v-html="info.content"></div>
  </div>
</template>

<script>
import { getEcologyUserByWorkCode } from '@/api/index'
import { getOne } from '@/api/cms'
import { getByMobile, deptById } from '@/api/user'
export default {
  name: 'GoldSales',
  components: {},
  data() {
    return {
        info:{},
        ecologyUser: {},
        wxCpUser: null,
        wxCpDept: null
    }
  },
  computed: {},
  async created() {
    await this.fetchCmsInfoData()
    // if(this.info.source) this.fetchEcologyUser()
    if(this.info.source) this.fetchWxCpUser()
  },
  methods: {
    fetchCmsInfoData() {
      return getOne(this.$route.query.id).then(res => {
        this.info = res
      })
    },
    // fetchEcologyUser() {
    //   return getEcologyUserByWorkCode(this.info.source).then(ecologyUser => {
    //     this.ecologyUser = ecologyUser
    //   })
    // },
    fetchWxCpUser() {
      return getByMobile(this.info.source).then(res => {
        if(!res) return;
        this.wxCpUser = res
        if(res.departIds) this.fetchWxCpDept(res.departIds[0])
      })
    },
    fetchWxCpDept(deptId) {
      return deptById(deptId).then(res => {
        this.wxCpDept = res
      })
    },
    openChart(userId) {
      wx.openEnterpriseChat({
        userIds: userId, //参与会话的企业成员列表，格式为userid1;userid2;...，用分号隔开。
        groupName: '', // 必填，会话名称。单聊时该参数传入空字符串""即可。
        success: function(res) {
          // 回调
        },
        fail: function(res) {
          if (res.errMsg.indexOf('function not exist') > -1) {
            alert('版本过低请升级')
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#page {
  height: 100vh;
  background: white;
  overflow-y: scroll;
}
.CustomerCaseList {
  width: 90%;
  margin: 0 auto;
  margin-bottom: 20px;
  background: #fefeff;
  transform: translateZ(0);
  margin-top: 5%;
  li {
    background: white;
    padding:5% 3% 5% 3%;
    margin-bottom: 0.8rem;
    overflow: hidden;
    box-shadow:0px 2px 29px 0px rgba(58,120,239,0.08);
    border-radius:8px;
    .salesBottomP{
        font-size:14px;
        color:rgba(149,156,167,1);
        line-height:18px;
        margin-top: 1.4rem;
    }
  }
  .salesInformation{
    display: flex;
    align-content: center;
    align-items: center;
    text-align: left;
    overflow: hidden;
    position: relative;
    div:nth-child(1) {
      // width: 30%;
      width: 5.5rem;
      height: 5.5rem;
      border: 1px solid rgba(244, 244, 244, 1);
      overflow: hidden;
      position: relative;
      border-radius:50%;
      img {
        width:100%;
        height:100%;
        position: absolute;
        left: 50%;
        top: 50%;
        border-radius:50%;
        object-fit: cover;
        transform: translate(-50%, -50%);
      }
    }
    div:nth-child(2) {
      // width: 30%;
      margin-left: 12px;
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
      p:nth-child(3){
        position: absolute;
        right: 5%;
        top: 50%;
        transform: translate(0px,-50%);
        width:90px;
        height:30px;
        background:rgba(58,120,239,1);
        box-shadow:0px 2px 10px 0px rgba(58,120,239,0.43);
        border-radius:17px;
        line-height: 30px;
        text-align: center;
        color: white;
        font-size: 14px;
      }
    }
    }   
}
.userfInfo{
    overflow: hidden;
    width: 90%;
    margin: 0 auto;
    font-size:15px;
    font-weight:400;
    color:rgba(57,60,65,1);
    line-height:30px;
    img{
      max-width: 100%;
      // height: 100%;
    }
}
</style>
