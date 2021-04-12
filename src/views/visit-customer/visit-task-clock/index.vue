<template>
  <div class="bg-main vh">
    <div v-if="isSuccess" class="plr18 pt18">
      <div class="bg-white plr12 ptb20 radius8">
        <div class="row center-y mb20">
          <img :src="require('@/assets/images/task_icon_gou.png')" class="w-h16" />
          <span class="fs16 fw600 pl6">{{ type === 'in' ? '进店' : '离店' }}打卡成功</span>
        </div>
        <div class="mb10 row">
          <span class="fs13 inline-block w62 gray-text">打卡地点</span>
          <span class="fs13 inline-block">{{ taskData.address }}</span>
        </div>
        <div class="mb10">
          <span class="fs13 inline-block w62 gray-text">打卡时间</span>
          <span class="fs13">{{ taskData.inTime | formatDate('Y-M-D h:m') }}</span>
        </div>
        <div class="mb10">
          <span class="fs13 inline-block w62 gray-text">备注</span>
          <img v-if="type === 'in'" :src="taskData.inImage" class="w-h40" style="object-fit: cover;" @click="onWxPreviewImage(taskData.inImage)" />
          <img v-if="type === 'out'" :src="taskData.outImage" class="w-h40" style="object-fit: cover;" @click="onWxPreviewImage(taskData.outImage)" />
        </div>
      </div>
    </div>
    <div v-else class="clock-container">
      <div  >
        <div class="w-full">
          <div class="text-center pt60" v-if="isCanClockIn ">
            <img :src="require('@/assets/images/task_icon_shop.png')" class="w-h34" />
            <p class="fs15 fw500 mt20 lh16" style="color: #393C41">{{ taskData.address }}</p>
            <p class="fs12 fw500 mt8 lh12" style="color: #959CA7">{{ taskData.customerName }}</p>
          </div>

          <div class="w-full" v-if="!isCanClockIn " >
            <div class="w-full" style="height: 226px;padding:0;margin:0" id="txMap" ></div>
          </div>
           <div class="text-center mt30">
            <p class="fs14 fw700 mt8 lh16" :style="isCanClockIn?'color:#0ac107':'color: #dc4229'">{{ message }}</p>
          </div>
          <div class="mt50 text-center">
            <van-uploader capture="camera" result-type="dataUrl" :after-read="afterRead" :disabled="!isCanClockIn ">
              <div :class="!isCanClockIn ? 'out-of-range' : 'clock-target' ">
                <p class="fs34 fw600">{{ currentTime | formatDate('h:m') }}</p>
                <p class="fs13 mt10" v-if="!isMobile()">请使用移动端打卡</p>
                <p class="fs14 mt10" v-else>{{ type === 'in' ? '到店' : '离店' }}拍照打卡</p>
              </div>
            </van-uploader>
          </div>
        </div>
        <div class="fs14 gray-text">请在完成任务后离店打卡  </div>
      </div>
    </div>
    <!-- 打卡成功弹窗 -->
    <clock-success 
      v-model="dialog"
      @confirm="onConfirm"
      :type="type"
    />
  </div>
</template>

<script>
import ClockSuccess from './clock-success'
import { clockIn, clockOut, getVisitTaskDetail } from '@/api/visit-task'
import { isMobile, getDistance } from '@/utils'
import { currentUser } from "@/api/user";

export default {
  name: 'VisitTaskClock',
  components: { ClockSuccess },
  data() {
    return {
      type: 'in', // in进店打卡 out离店打卡
      isSuccess: false, // 显示打卡成功
      dialog: false,
      currentTime: '',
      timer: null,
      taskData: {latitude:113.28802045, longitude:23.015220899},
      location: {latitude:null, longitude:null},
      isGetwLoacationFail: false,//是否获取定位失败
      isOutOfRange: true,//是否不在打卡范围内
      wxCpUser: null,
      map: null,// 腾讯地图相关
      marker: null,
      timer1: null,//定时获取定位计时器
      message:'不在打卡范围内'
    }
  },
  computed: {
    isCanClockIn(){
       return (!isMobile() || this.isOutOfRange || this.isGetwLoacationFail)?false:true;
    },
  },
  created() {
  },
  mounted() {
     this.init()
  },
  methods: {
    getDistance,
    isMobile,
    onConfirm() {
      this.$router.go(-1)
    },
    init(){
      this.type = this.$route.query.type
      this.taskId = this.$route.query.taskId
      this.isSuccess = JSON.parse(this.$route.query.isSuccess)
       this.taskData=JSON.parse(this.$route.query.taskData)
      console.info('taskData：',this.taskData)
      if(this.isSuccess){
        return 
      }
      //获取当前时间用于显示打卡时间
      this.setTimer()
      this.calLocation();
      this.createMap();
      this.getLocation();
    },
    setTimer() {
      this.currentTime = new Date().getTime()
      this.timer = setInterval(() => {
        this.currentTime = new Date().getTime()
      }, 1000 * 10)
    },
    afterRead(file, detail) {
      console.log(file)
      console.log(detail)
      let fetch = {
        'in': clockIn,
        'out': clockOut
      }
      this.$store.commit('SHOW_LOADING', '正在打卡')
      fetch[this.type]({
        taskId: this.taskId,
        base64Code: file.content,
        latitude: this.location.latitude,
        longitude: this.location.longitude
      }).then(res => {
         this.$store.commit('SHOW_LOADING', false)
        console.log('打卡接口', res)
        this.dialog = true
        this.$eventHub.$emit(this.$eventName['REFRESH_TASK_LIST'])
        this.closeMonitor()
      })     
        .catch(error => {
          console.log(error)
          this.$store.commit('SHOW_LOADING', false)
        })
    },
    onWxPreviewImage(url, urls = 0) {
      wx.previewImage({
        current: url,
        urls: urls.length === 0 ? [url] : urls
      })
    },
    // region 位置相关
    // 持续获取当前位置
    getLocation() {
      this.timer1 = setInterval(() => {
        this.calLocation()
      }, 1000 * 5 )
    },
    calLocation(){
      if (!wx || !wx.getLocation) {
        this.isGetwLoacationFail = true;
        this.message='获取位置失败'
        return ;
      }
      if (!this.taskData || !this.taskData.latitude) {
        this.isGetwLoacationFail = true;
        this.message='获取位置失败'
        return ;
      }
      
      wx.getLocation({
          type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          success:  (res) => {
            if(res.errMsg === "getLocation:ok"){
              this.location = res;
              // let path = [new TMap.LatLng(res.latitude, res.longitude), new TMap.LatLng(this.taskData.latitude, this.taskData.longitude)];
              // let distance = TMap.geometry.computeDistance(path);
              let distance = this.getDistance(res.latitude, res.longitude, this.taskData.latitude, this.taskData.longitude);
               console.info('打卡距离（米）:',distance)
              this.createdMarker();
              if (distance > this.taskData.clockInDistance) {
                this.isOutOfRange = true;
                 this.message='不在打卡范围内'
              } else {
                 this.message='已在打卡范围内'
                this.isOutOfRange = false;
                this.isGetwLoacationFail = false
              }
            }else {
              console.info('获取位置失败:','wx接口getLocation error')
              this.isGetwLoacationFail = true;
              this.message='获取位置失败'
              return
            }
          },
          error:  (res) => {
            this.isGetwLoacationFail = true;
            this.message='获取位置失败'
            console.info('获取位置失败:','wx接口调用异常')
          }
        });
    },
    closeMonitor(){
      if(this.timer){
      clearInterval(this.timer)
      this.timer = null
      }
      if(this.timer1){
      clearInterval(this.timer1)
      this.timer1 = null
      }

      this.isOutOfRange = true
      this.isGetwLoacationFail = false
      if( this.map){
         this.map.destroy()
      }
      
    },
    // 创建腾讯地图
    createMap() {
      if(this.map){
        return
      }
      let wapper = document.getElementById('txMap')
      // 中心点
      let center = new TMap.LatLng(this.taskData.latitude , this.taskData.longitude)
      this.map = new TMap.Map(wapper, {
        center,
        viewMode: '2D',
        showControl: false
      })


      //初始化marker
      this.marker = new TMap.MultiMarker({
        id: "marker-layer", //图层id
        map: this.map,
        styles: { //点标注的相关样式
            "marker1": new TMap.MarkerStyle({
                "width": 40,
                "height": 40,
                "anchor": { x: 20, y: 36 },
                "src": require('@/assets/images/task/destination.png')
            }),
            "marker2": new TMap.MarkerStyle({
                "width": 30,
                  "height": 30,
                  "anchor": { x: 15, y: 27 },
                  "src": require('@/assets/images/task/mine.png')
            })
        },
        geometries: [{ //点标注数据数组
          "id": "clockin",
          "styleId": "marker1",
          "position": center,
          "properties": {
            "title": "打卡地点"
          }
        }]
      });

      var circle = new TMap.MultiCircle({
        id: 'circle',
         map: this.map,
        geometries: [{
          center: center,       // 设置圆的中心
          radius:this.taskData.clockInDistance?this.taskData.clockInDistance: 1000  //设置圆的半径
        }]
      });

      this.createdMarker()
    },
    createdMarker() {
      if(!this.marker){
        return
      }
      if(!this.location||!this.location.latitude){
        return
      }
      let location = new TMap.LatLng(this.location.latitude , this.location.longitude)
      //点标注数据数组
      let geometries = [
        { 
          "id": "mine",
          "styleId": "marker2",
          "position": location,
          "properties": {
            "title": "我的位置"
          }
        },
      ];
   
      this.marker.updateGeometries( geometries )
      this.showMarker()
    },
    // testCreatedMarker() {
    //   let location = new TMap.LatLng(23.27045821254205, 113.19463278)
    //   //点标注数据数组
    //   let geometries = [
    //     { 
    //       "id": "mine",
    //       "styleId": "marker2",
    //       "position": location,
    //       "properties": {
    //         "title": "我的位置"
    //       }
    //     },
    //   ];
   
    //   this.marker.updateGeometries( geometries )
    //   this.showMarker()
    // },
    showMarker(){
         //初始化
     let bounds = new TMap.LatLngBounds();
            //判断标注点是否在范围内
          let points= this.marker.getGeometries()
          if(!points||points.length<=0){
            return
          }
          points.forEach(item=>{
                //若坐标点不在范围内，扩大bounds范围
                let templocation=new TMap.LatLng(item.position.lat,item.position.lng)
                if(bounds.isEmpty() || !bounds.contains(templocation)){
                    bounds.extend(templocation);
                }
            })
            //设置地图可视范围
            this.map.fitBounds(bounds, { 
                padding: 40 // 自适应边距
       });
    }
    // endregion
  },
  beforeDestroy() {
      this.closeMonitor()
  }
};
</script>
<style lang="scss" scoped>
.clock-container{
  height: 100%;
  padding: 15px 18px;
  >div{
    background-color: #ffffff;
    box-shadow: 0px 2px 11px 0px rgba(0, 72, 209, 0.1);
    border-radius: 8px;
    height: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    padding-bottom: 20px;
    // padding-top: 60px;
    align-items: center;
    overflow: hidden;
  }
}
.clock-target{
  text-align: center;
  width: 154px;
  height: 154px;
  background: linear-gradient(180deg, #6CB0F8 0%, #3A78EF 100%);
  border-radius: 50%;
  border: 8px solid #D8E4FC;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #ffffff;
}
.out-of-range {
  text-align: center;
  width: 154px;
  height: 154px;
  background: linear-gradient(180deg, #FFD085 0%, #FFB640 100%);
  border-radius: 50%;
  border: 8px solid rgb(255, 240, 217);
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #ffffff;
}
</style>