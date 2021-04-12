<template>
  <div class="infoList">
      <div v-if="title">
        <div class="title">
          {{title}}
        </div>
        <div v-if="data.length>0">
          <div v-for="(item,index) in data" :key="index"  class="targetCon">  <!-- v-for -->
          <div v-if="showTop" class="top">
            <img src="@/assets/images/customer/bg_num@2x.png" alt="">
            <!-- 10以内显示0+数字 10之后显示数字本身 -->
            <span>{{topText?topText:index>=9?(index+1):('0'+(index+1))}}</span>
          </div>
            <div class="list">
              <span class="targetTitle">核心供应商</span>
              <span class="fz15ccc">{{item.name}}</span>
            </div>
            <div class="list">
              <span class="targetTitle">供应商品牌/品类</span>
              <span class="fz15ccc">{{item.coreSupplierBrand}}</span>
            </div>
            <div class="list">
              <span class="targetTitle">分析部门</span>
              <span class="fz15ccc">{{item.analyzeCompanyName+'-'+item.analyzeDepartName}}</span>
            </div>
          </div>
        </div>
        <div class="emply" v-else>
          <img src="@/assets/images/isEmply.png" alt />
          <p>暂无数据~</p>
        </div>
      </div>
      <div v-if="title2">
        <div class="title">
          {{title2}}
        </div>
        <div v-if="files.length>0">
          <atta-item
            v-for="(item, index) in files"
            :key="index"
            :file-name="item.fileName"
            :file-type="item.fileType"
            :size="item.size"
            :attaId="item.id"
            :attaUrl="item.attaUrl"
          />
          </div>
        <div class="emply" v-else>
          <img src="@/assets/images/isEmply.png" alt />
          <p>暂无数据~</p>
        </div>
      </div>
    </div>
</template>
<script>
import AttaItem from "@/components/AttachmentItem";
export default {
  components: {
    AttaItem
  },
  data() {
    return {
        defaultLogo: require("@/assets/images/defaultLogo.png")
    };
  },
  methods: {

  },
  props:{
      showTop:{//默认显示左上角图标
          type:Boolean,
          default:true
      },
      title:{
          type:String,
          default:''
      },
      title2:{
          type:String,
          default:''
      },
      data:{
        type:Array,
        default:function(){
          return []
        }
      },
      files:{
        type:Array,
        default:function(){
          return []
        }
      },
      topText:{
        type:String,
        default:''
      }
  }
};
</script>

<style lang="scss" scoped>
.infoList{
    background-color: #F2F4F9;
    line-height: 1; 
    >div{
      background-color: #fff;
      margin-bottom: 15px;
      padding:0 18px;  
      padding-bottom: 21px;
    }
    .title{
        font-weight: 600;
        font-size: 18px;
        color:rgba(57,60,65,1);
        padding:20px 0;
        display: flex;
        align-items: center;
    }
    .targetCon{
        position: relative;
        box-shadow:0px 0px 46px 0px rgba(40,109,153,0.1);
        border-radius:5px;
        padding:0 15px;
        margin-bottom: 15px;
        &:last-child{
            margin-bottom: 0px !important;
        }
        .list{
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding:15px 0px;
            border-bottom: 1px solid rgba(242,244,249,1) ;
            .targetTitle{
                font-size:15px;
                color:rgba(57,60,65,1);
            }
            .fz15ccc{
                font-size: 15px;
                color:rgba(107,113,120,1);
                display:inline-block;
                width:58%;
                text-align:left;
                line-height: 18px;
            }
        }
        .listStart{
            justify-content:flex-start;
            .targetTitle{
                margin-right: 30px;
            }
            .fz15ccc{
                font-size: 15px;
                color:rgba(107,113,120,1);
                display:inline-block;
                width:60%;
                text-align:right;
            }
        }
        .list:last-child{
            border-bottom: 0 !important;
        }    
    } 
    
  
  
  .link{
    box-shadow:0px 0px 46px 0px rgba(40,109,153,0.1);
    display: flex;
    align-items: center;
    padding:15px 15px;
    margin-bottom: 15px;
    >div{
      display: flex;
      justify-content:space-between;
      align-items:center;
      overflow: hidden;
      flex: 1;
      >div{
        overflow: hidden;
        p{
          font-size: 14px;
          font-weight:bold;
          color:rgba(57,60,65,1);
          padding: 6px 0 0 10px;
          overflow: hidden;
          white-space:nowrap;
          text-overflow:ellipsis;
        }
        p:nth-child(2){
          font-size: 11px;
          color:rgba(149,156,167,1);
          font-weight: normal;
        }
      }
      .look{
        box-sizing: border-box;
        padding:2px 13px;
        font-size:12px;
        min-width:50px;
      }
    }
  }
}
.top{
  position: absolute;
  left:0;
  top:0;
  img{
    width: 25px;
    height: 24px;
  }
  span{
    position: absolute;
    left:4px;
    top:5px;
    font-size: 12px;
    font-weight: 600;
    color:#743A00;
  }
}
.emply{
  text-align: center;
  img{
    width:133px;
  }
  p{
    color:rgba(149,156,167,1);
    font-size: 12px;
    padding: 8px 0 8px 8px;
  }
}
</style>