<template>
  <div class="infoList">
      <!-- 内部不需要循环的组件 -->
      <div v-if="params.name" class="title">
          <span v-if="titleLeft">{{'合同'+(index_*1+1)}}</span>
          {{params.name}}
      </div>
        <div class="targetCon">  <!-- v-for -->
            <div v-if="topText" class="top">
            <img src="@/assets/images/customer/bg_num@2x.png" alt="">
            <!-- 10以内显示0+数字 10之后显示数字本身 -->
            <span>{{topText}}</span>
            </div>
          <div :class="listStart==true?['listStart','list']:['list']">
            <span class="targetTitle">业务板块</span>
            <span class="fz15ccc">{{params.businessName}}</span>
          </div>
          <div :class="listStart==true?['listStart','list']:['list']">
            <span class="targetTitle">签约主体</span>
            <span class="fz15ccc">{{params.signSubject}}</span>
          </div>
          <div :class="listStart==true?['listStart','list']:['list']">
            <span class="targetTitle">合同期限</span>
            <span class="fz15ccc">{{(this.$utils.formatDate(params.startTime,'Y/M/D'))+' - '+(this.$utils.formatDate(params.endTime,'Y/M/D'))}}</span>
          </div>
          <div :class="listStart==true?['listStart','list']:['list']">
            <span class="targetTitle">结算方式</span>
            <span class="fz15ccc">{{params.closeMethod}}</span>
          </div>
          <div :class="listStart==true?['listStart','list']:['list']">
            <span class="targetTitle">账期类型</span>
            <span class="fz15ccc">{{params.paymentType}}</span>
          </div>
          <div :class="listStart==true?['listStart','list']:['list']">
            <span class="targetTitle">账期天数</span>
            <span class="fz15ccc">{{params.paymentDay}}</span>
          </div>
        </div>
        <div v-if="params.attaList && params.attaList.length>0">
          <atta-item
            v-for="(item, index) in params.attaList"
            :key="index"
            :file-name="item.fileName"
            :file-type="item.fileType"
            :size="item.size"
            :attaId="item.id"
            :attaUrl="item.attaUrl"
          />
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
      
    };
  },
  methods: {

  },
  props:{
      topText:{
          type:String,
          default:''
      },
      params:{
        type:Object,
            default:function() {
            return {};
        }
      },
        titleLeft:{
            type:Boolean,
            default:false
        },
        listStart:{ //list是否贴紧，默认分开
            type:Boolean,
            default:false
        },
        index_:{
            type:Number,
        },
  }
};
</script>

<style lang="scss" scoped>
.infoList{
    background-color: #fff;
    padding:0 18px;  
    padding-bottom: 21px;
    line-height: 1; 
    margin-bottom: 15px;
    .title{
        font-weight: 600;
        font-size: 18px;
        color:rgba(57,60,65,1);
        padding:20px 0;
        display: flex;
        align-items: center;
        >span{
            display: inline-block;
            padding:4px;
            margin-right: 12px;
            // line-height: 64PX;
            font-weight:bold;
            color:rgba(254,156,59,1);
            font-size: 14px;
            background:rgba(253,244,234,1);
            border-radius:2px;
        }
    }
    .targetCon{
        box-shadow:0px 0px 46px 0px rgba(40,109,153,0.1);
        border-radius:5px;
        padding:0 15px;
        margin-bottom: 15px;
        position: relative;
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
            }
        }
        .listStart{
            justify-content:flex-start;
            .targetTitle{
                margin-right: 30px;
            }
        }
        .list:last-child{
            border-bottom: 0 !important;
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

</style>