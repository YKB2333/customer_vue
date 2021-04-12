<template>
  <div style="height: 100vh;" class="y-scroll">
    <template v-for="(value, key) in store">
      <div v-if="value.list.length" :key="key" class="border-div ptb20">
        <div class="row center-y plr18 pb20">
          <img :src="value.logo" class="w-h22 mr10">
          <span class="fs16 fw600">{{ value.label }}</span>
        </div>
        <div class="plr12">
          <van-grid :gutter="10" :column-num="3" :border="false" square>
            <van-grid-item 
              v-for="item in getShowList(value)" 
              :key="item.id" 
              @click="openExternalLink(item.skipUrl)"
              class="text-center"
            >
              <img slot="icon" :src="item.titleImage" width="90%" />
              <div slot="text" class="plr8 w-full hidden">
                <p class="fs11 ellipsis2 text-center mt4">{{ item.title }}</p>
              </div>
            </van-grid-item>
            <van-grid-item v-if="value.list.length <= 2">
              <img :src="require('@/assets/images/shop_img_an.png')" width="80%" style="max-width: 67px;" />
            </van-grid-item>
            <van-grid-item v-else-if="value.list.length > overNum && value.collapse">
              <img v-if="value.collapse" :src="require('@/assets/images/shop_img_all.png')" width="100%" style="max-width: 85px;" @click="onCollapse(value)" />
            </van-grid-item>
          </van-grid>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { selectPage as cmsSelectPage } from "@/api/cms"
import { cmsCategoryId } from "@/config"

export default {
  name: "StoreList",
  data() {
    return {
      TMList:[],
      TBList:[],
      PDDList:[],
      JDList:[],
      store: {
        'TM': {
          label: '天猫',
          logo: require('@/assets/images/shop_icon_mao.png'),
          list: [],
          collapse: true
        },
        'JD': {
          label: '京东',
          logo: require('@/assets/images/shop_icon_dong.png'),
          list: [],
          collapse: true
        },
        'TB': {
          label: '淘宝',
          logo: require('@/assets/images/shop_icon_tao.png'),
          list: [],
          collapse: true
        },
        'DY': {
          label: '抖音',
          logo: require('@/assets/images/shop_icon_dy.png'),
          list: [],
          collapse: true
        },
        'KS': {
          label: '快手',
          logo: require('@/assets/images/shop_icon_ks.png'),
          list: [],
          collapse: true
        },
        'PDD': {
          label: '拼多多',
          logo: require('@/assets/images/shop_icon_pin.png'),
          list: [],
          collapse: true
        },
        'XHS': {
          label: '小红书',
          logo: require('@/assets/images/shop_icon_xhs.png'),
          list: [],
          collapse: true
        },
        'WYKL': {
          label: '网易考拉',
          logo: require('@/assets/images/shop_icon_wykl.png'),
          list: [],
          collapse: true
        }
      },
      overNum: 9, // 超过9个折叠
    };
  },
  created() {
    this.fetchStoreList()
  },
  computed: {
    getShowList() {
      return (value) => {
        if (value.list.length > this.overNum && value.collapse) {
          return value.list.slice(0, this.overNum - 1)
        } else {
          return value.list
        }
      }
    }
  },
  methods: {
    openExternalLink(url) {
      // console.log('url', url)
      // window.location.href = url;
      // let tempwindow = window.open('_blank');
      // tempwindow.location=url;
      if (!url) return
      window.open(url, '_blank')
    },
    fetchStoreList() {
      this.$store.commit('SHOW_LOADING')
      cmsSelectPage({
        pageIndex: 1,
        pageSize: 500,
        infoCategoryId: cmsCategoryId['shop'],
        status: "1",
        orderStr: "orderLevel desc, pubTimestamp desc, createTimestamp desc"
      }).then(res => {
        // console.log('店铺数据列表', res)
        let records = res.records
        this.store['TM'].list = records.filter(e => e.infoKeyword === 'TM')
        this.store['TB'].list = records.filter(e => e.infoKeyword === 'TB')
        this.store['JD'].list = records.filter(e => e.infoKeyword === 'JD')
        this.store['PDD'].list = records.filter(e => e.infoKeyword === 'PDD')
        this.store['XHS'].list = records.filter(e => e.infoKeyword === 'XHS')
        this.store['WYKL'].list = records.filter(e => e.infoKeyword === 'WYKL')
        this.store['DY'].list = records.filter(e => e.infoKeyword === 'DY')
        this.store['KS'].list = records.filter(e => e.infoKeyword === 'KS')
        // console.log('store', this.store)
      }).finally(() => {
        this.$store.commit('SHOW_LOADING', false)
      })
    },
    onCollapse(value) {
      value.collapse = false
    }
  },
};
</script>

<style lang="scss" scoped>

.border-div{
  border-bottom: 10px solid #F2F4F9;
}

/deep/ .van-grid-item__content--center{
  box-shadow: 0px 0px 11px 0px rgba(40, 109, 153, 0.1);
  border-radius: 10px;
  padding: 0;
}

</style>