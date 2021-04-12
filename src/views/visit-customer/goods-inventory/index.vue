<template>
  <div class="bg-main vh col">
    <div class="flex-y y-scroll pb20">
      <div class="bg-white plr18 ptb12 row center-y">
        <div class="mr10"><img :src="form.image || require('@/assets/images/logo.png')" class="w-h100"></div>
        <div class="flex-1">
          <p class="fs14 fw600 ellipsis2 mb10">{{ form.name || form.spuName }}</p>
          <van-tag type="warning" round color="#FFF1EB" text-color="#FF7640">{{ values }}</van-tag>
        </div>
      </div>

      <div class="bg-white mt10">
        <div class="cell-title">
          <div class="van-hairline--bottom dot">
            <span class="fs16">商品详情</span>
          </div>
        </div>
        <van-field 
          label="商品条码"
          label-class="ml12 fs14 fw600 color-label"
          label-width="136"
          v-model="form.codeBar"
          placeholder=""
          readonly
        />
        <van-field 
          label="商品助记码"
          label-class="ml12 fs14 fw600 color-label"
          label-width="136"
          v-model="form.mnemonicCode"
          placeholder=""
          readonly
        />
        <van-field 
          label="销售等级"
          label-class="ml12 fs14 fw600 color-label"
          label-width="136"
          v-model="form.salesGrade"
          :placeholder="type === 'edit' ? '请输入等级' : ''"
          :readonly="type !== 'edit'"
        />
      </div>

      <div class="bg-white mt10">
        <div class="cell-title">
          <div class="van-hairline--bottom dot">
            <span class="fs16">门店库存</span>
          </div>
        </div>
        <van-field 
          label="总库存"
          label-class="ml12 fs14 fw600 color-label"
          label-width="136"
          v-model="totalStock"
          placeholder=""
          readonly
          type="number"
        />
        <van-field 
          label="效期等级"
          label-class="ml12 fs14 fw500 gray-text-2"
          label-width="136"
          disabled
        />
        <van-field 
          label-width="136"
          label-class="ml12 fs14 fw600 color-label"
          v-model.number="form.overdueNum"
          :placeholder="type === 'edit' ? '请输入数量' : ''"
          :readonly="type !== 'edit'"
          type="number"
        >
          <div slot="label">
            <p>过期商品</p>
            <p class="fs12 gray-text fw400"></p>
          </div>
        </van-field>
        <van-field 
          label-width="136"
          label-class="ml12 fs14 fw600 color-label"
          v-model.number="form.tempNum"
          :placeholder="type === 'edit' ? '请输入数量' : ''"
          :readonly="type !== 'edit'"
          type="number"
        >
          <div slot="label">
            <p>临期商品</p>
            <p class="fs12 gray-text fw400">(剩余效期＜0.5年）</p>
          </div>
        </van-field>
        <van-field 
          label-width="136"
          label-class="ml12 fs14 fw600 color-label"
          v-model.number="form.recentNum"
          :placeholder="type === 'edit' ? '请输入数量' : ''"
          :readonly="type !== 'edit'"
          type="number"
        >
          <div slot="label">
            <p>近期商品</p>
            <p class="fs12 gray-text fw400">(0.5年≦剩余效期≦1年）</p>
          </div>
        </van-field>       
        <van-field 
          label-width="136"
          label-class="ml12 fs14 fw600 color-label"
          v-model.number="form.normalNum"
          :placeholder="type === 'edit' ? '请输入数量' : ''"
          :readonly="type !== 'edit'"
          type="number"
        >
          <div slot="label">
            <p>正常商品</p>
            <p class="fs12 gray-text fw400">(1年≦剩余效期）</p>
          </div>
        </van-field>       
        <van-field 
          label-width="136"
          label-class="ml12 fs14 fw600 color-label"
          v-model.number="form.damagedNum"
          :placeholder="type === 'edit' ? '请输入数量' : ''"
          :readonly="type !== 'edit'"
          type="number"
        >
          <div slot="label">
            <p>破损商品</p>
          </div>
        </van-field>
      </div>
    </div>
    <div v-if="type === 'edit'" class="bg-white plr18 ptb10 row space-between">
      <van-button round style="width: 48%; color: #959CA7;" @click="onDelete">删除</van-button>
      <van-button type="info" round :loading="loading" style="width: 48%;" @click="onSave">保存</van-button>
    </div>
  </div>
</template>

<script>
import { getSkuByTaskId, delSkuByTaskId, saveTaskSku } from '@/api/visit-task'
import { mapGetters } from 'vuex'

export default {
  name: 'GoodsInventory',
  components: {},
  data() {
    return {
      taskId: '',
      type: 'edit', // edit preview
      form: {
        skuId: '',
        taskId: '',
        codeBar: '',
        firstAtbKey: '',
        firstAtbValue: '',
        secondAtbKey: '',
        secondAtbValue: '',
        categoryName: '',
        brandName: '',
        name: '',
        codeBar: '', // 商品条码
        mnemonicCode: '', // 商品助记码
        salesGrade: '', // 销售等级
        shopStock: '', // 门店库存
        tempNum: '', // 临时商品数量
        recentNum: '', // 近期商品数量
        normalNum: '', // 正常商品数量
      },
      loading: false
    }
  },
  computed: {
    ...mapGetters(['completeTaskSkuIds']),
    values() {
      let arr = []
      if (this.form.firstAtbValue) arr.push(this.form.firstAtbValue)
      if (this.form.secondAtbValue) arr.push(this.form.secondAtbValue)
      return arr.join('；')
    },
    totalStock: {
      get() {
        let n = this.form.normalNum || 0
        let r = this.form.recentNum || 0
        let t = this.form.tempNum || 0
        let o = this.form.overdueNum || 0
        let d = this.form.damagedNum || 0
        console.info(n, r, t, o, d)
        return Number(n) + Number(r) + Number(t) + Number(o) + Number(d)
      },
      set(val) {
        // console.log(val, 'set')
      }
    }
  },
  created() {
    this.type = this.$route.query.type || 'edit'
    this.taskId = this.$route.query.taskId
    let param = JSON.parse(this.$route.query.sku)
    console.log('param', param)
    param.taskId = this.taskId
    param.name = param.spuName || param.name
    this.form = param
    if (this.completeTaskSkuIds.includes(this.form.skuId) || this.type === 'preview') {
      // 如果已保存过，接口获取详情
      this.init()
    }
  },
  methods: {
    init() {
      this.$store.commit('SHOW_LOADING')
      getSkuByTaskId({
        taskId: this.taskId,
        skuId: this.form.skuId
      }).then(res => {
        // console.log(res)
        // this.form = res
        this.$set(this.form, 'tempNum', res.tempNum || 0)
        this.$set(this.form, 'recentNum', res.recentNum || 0)
        this.$set(this.form, 'normalNum', res.normalNum || 0)
        this.$set(this.form, 'salesGrade', res.salesGrade || 0)
        this.$set(this.form, 'overdueNum', res.overdueNum || 0)
        this.$set(this.form, 'damagedNum', res.damagedNum || 0)
      }).finally(() => {
        this.$store.commit('SHOW_LOADING', false)
      })
    },
    onSave() {
      console.log('保存')
      if (!this.form.salesGrade) {
        this.$toast('请填写销售等级')
        return
      }
      this.loading = true
      this.form.shopStock = this.totalStock
      saveTaskSku(this.form).then(res => {
        this.$toast('保存成功')
        this.$store.commit('SAVE_COMPLETE_TASK_SKU', { type: 'add', skuId: this.form.skuId })
        this.$router.go(-1)
      }).finally(() => {
        this.loading = false
      })
    },
    onDelete() {
      this.$dialog.confirm({
        title: '确认删除吗？',
        confirmButtonColor: '#3A78EF'
      }).then(res => {
        this.$store.commit('SHOW_LOADING', '删除中...')
        delSkuByTaskId({
          skuId: this.form.skuId,
          taskId: this.taskId
        }).then(res => {
          this.$toast('删除成功')
          this.$store.commit('SAVE_COMPLETE_TASK_SKU', { type: 'delete', skuId: this.form.skuId })
          this.$router.go(-1)
        }).finally(() => {
          this.$store.commit('SHOW_LOADING', false)
        })
      })
    }
  },
};
</script>
<style lang="scss" scoped>
/deep/ .van-tab{
  font-size: 15px;
}
/deep/ .van-tabs__wrap{
  padding: 0 14px;
  background-color: #ffffff;
}
.cell-title{
  width: 100%;
  height: 55px;
  line-height: 55px;
  font-size: 14px;
  padding: 0 14px;
  font-weight: 600;
  .dot::before{
    display: inline-block;
    content: ' ';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #ffffff;
    border: 2px solid #3A78EF;
    margin-right: 4px;
  }
}
/deep/ .van-field__control{
  color: #6B7178 !important;
  font-size: 14px;
}

</style>