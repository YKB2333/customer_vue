<template>
  <div>
    <div v-if="infoList.length>0" class="page">
      <div v-for="(item,index) in infoList" :key="index">
        <div class="titleTop">
          <img style="width:14px;height:12px;" src="@/assets/images/customer/yinhao.png" alt />
        </div>
        <div class="title">{{item.name}}</div>
        <div class="titleBottom"></div>
        <p>{{item.generalSituatuion}}</p>
        <ul>
          <li>
            <span>编号</span>
            <span>{{item.code}}</span>
          </li>
          <li>
            <span>区域</span>
            <span>{{formatArea(item)}}</span>
          </li>
          <li>
            <span>运营类型</span>
            <span>{{item.operateType}}</span>
          </li>
          <li>
            <span>运营团队</span>
            <span>{{item.operateTeam}}</span>
          </li>
          <li>
            <span>负责人</span>
            <span>{{item.teamLeader}}</span>
          </li>
        </ul>
        <div class="picList">
          <div v-for="(item_,index_) in item.lists" :key="index_" v-show="index_ <= 2">
            <div
              v-if="item.lists && item.lists.length > 3 && index_ === 2"
            >{{'+'+(item.lists.length>3?(item.lists.length*1 - 3):'')}}</div>
            <img @click="clickImg(item.lists,index_)" :src="item_.attaUrl" alt />
          </div>
        </div>
      </div>
    </div>
    <div class="emply" v-else>
      <img src="@/assets/images/isEmply.png" alt />
      <p>暂无数据~</p>
    </div>
  </div>
</template>
<script>
import { ImagePreview } from 'vant'
import { getShopInfo } from '@/api/findCustomer/customer'
export default {
  name: 'shop',
  data() {
    return {
      infoList: [],
      data: []
    }
  },
  methods: {
    clickImg(item, index) {
      let images = item
        .filter((item) => {
          return item.attaUrl
        })
        .map((value) => value.attaUrl)
      ImagePreview({
        images,
        startPosition: index
      })
    },
    getShopInfoList() {
      getShopInfo(this.$route.query.id).then((res) => {
        this.infoList = res
      })
    },
    formatArea({ province, city, area }) {
      let p = province ? `${province}-` : ''
      let c = city ? `${city}-` : ''
      let a = area ? `${area}-` : ''
      return p + c + a
    }
  },
  created() {
    if (this.$route.query && this.$route.query.id) {
      this.getShopInfoList()
    } else {
      this.$toast('获取用户信息失败')
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  line-height: 1;
  height: 100%;
  padding: 1rem;
  background: #f2f4f9;
  > div {
    border-radius: 0.25rem;
    margin-bottom: 1rem;
    background: #fff;
    padding: 1rem;
    .titleTop {
      margin-bottom: 0.75rem;
    }
    .title {
      font-size: 1.0625rem;
      font-weight: bold;
    }
    .titleBottom {
      height: 0.125rem;
      background: #959ca7;
      width: 14%;
      margin: 1rem 0 1.2rem 0;
    }
    p {
      line-height: 1.4375rem;
      font-size: 0.9375rem;
      color: rgba(107, 113, 120, 1);
    }
    > ul {
      > li {
        display: flex;
        align-items: center;
        padding-top: 1rem;
        span {
          display: inline-block;
        }
        span:nth-child(1) {
          width: 5.3rem;
          color: rgba(57, 60, 65, 1);
          font-size: 0.9375rem;
        }
        span:nth-child(2) {
          color: #6b7178;
          flex: 1;
          line-height: 1.3;
        }
      }
    }
    .picList {
      display: flex;
      // justify-content: space-between;
      align-items: center;
      margin-top: 1.2rem;
      > div {
        width: 6.125rem;
        height: 6.125rem;
        margin-right: 0.46rem;
        position: relative;
        img {
          width: 100%;
          height: 100%;
        }
        > div {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          background: rgba(0, 0, 0, 1);
          opacity: 0.4;
          z-index: 999;
          color: #fff;
          display: flex;
          align-items: center;
          pointer-events: none;
          justify-content: center;
        }
      }
      > div:nth-child(3) {
        margin-right: 0;
      }
    }
  }
}
.emply {
  padding-top: 10%;
  text-align: center;
  background: #fff;
  img {
    width: 8.3125rem;
  }
  p {
    color: rgba(149, 156, 167, 1);
    font-size: 0.9375rem;
    padding: 0.5rem 0 0.5rem 0.5rem;
  }
}
</style>