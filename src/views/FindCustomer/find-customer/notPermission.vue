<template>
  <div class="page">
    <div class="wpct90 mauto bg-white radius10"  style="margin-top:5%">
        <div>
            <img :src="require('@/assets/images/find/new_find/client_img_def@2x.png')" alt="" class="w-full radius10">
        </div>
        <div v-if="manager.userId" class="row center-y wpct86  space-between mb24 relative" style="margin:0 auto">
            <div class="text-center ">
                <img :src="manager.avatar" alt="" class="w-h74 radius relative" style="margin-top:-50%;border:3px solid white">
                <p class="fs19 color-dark-grey mtb8 fw600">{{manager.name}}</p>
                <p class="color-gray">{{manager.position}}</p>
            </div>
            <div class="btn absolute " style="right:0;top:50%;" @click="openChat">
                私信
            </div>
        </div>
    </div>
  </div>
</template>
<script>
import { getByMobile } from '@/api/user'
export default {
  name: "notPermission",
  components: {
  },
  data() {
    return {
      manager: {}
    };
  },
  mounted(){
    //禁止后退
    history.pushState(null, null, document.URL); 
    window.addEventListener("popstate", this.myBack, false);
    wx.onHistoryBack(()=>{
      this.$router.push({ path: "/home"})
      return false
    });
  },
  methods: {
    myBack() {
      history.pushState(null, null, document.URL);
    },
    init() {
      let reportManagerMobile = this.$config.reportManager[0]
      getByMobile(reportManagerMobile).then(res=>{
        this.manager = res
      })
    },
    openChat() {
      // console.info('联系管理员')
      wx.openEnterpriseChat({
        userIds: this.manager.userId, //参与会话的企业成员列表，格式为userid1;userid2;...，用分号隔开。
        groupName: '123', // 必填，会话名称。单聊时该参数传入空字符串""即可。
        success: function(res) {
          // 回调
          this.$toast.success('正在联系管理员...')
        },
        fail: function(res) {
          if (res.errMsg.indexOf('function not exist') > -1) {
            alert('版本过低请升级')
          }
        }
      })
    }
  },
  destroyed(){
    window.removeEventListener("popstate", this.myBack, false); 
  },
  created(){
    this.init()
  },
};
</script>

<style lang="scss" scoped>
.page{
    background: #F2F4F9;
    height: 100vh;
    overflow-y: auto;
}
.color-gray {
  color: #959ca7;
}
.color-dark-grey {
  color: #393c41;
}

.btn{
    width:90px;
    height:30px;
    background:rgba(60,126,255,1);
    box-shadow:0px 2px 11px 0px rgba(159,190,240,0.16),0px 1px 11px 0px rgba(58,120,239,0.58);
    border-radius:17px;
    text-align: center;
    color: white;
    line-height: 30px;
}
</style>