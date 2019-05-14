<template>
  <div class="merchantAdd">
    <Form :model="formItem"
          label-position="right"
          :label-width="120"
          ref="formItem"
          :rules="ruleComplteForm">
      <FormItem label="商户类型："
                  prop="merchantType">
          <Select v-model="formItem.merchantType"
                  style="width:100%"
                  placeholder="请选择商户类型">
            <Option value="T">个人商户</Option>
            <Option value="F">企业商户</Option>
          </Select>
        </FormItem>
      <FormItem label="商户简称："
                prop="shortName">
        <Input v-model="formItem.shortName"
               style="width:100%"
               placeholder="请输入商户简称"></Input>
      </FormItem>
      <FormItem label="企业名称："
                prop="enterpriseName">
        <Input v-model="formItem.enterpriseName"
               style="width:100%"
               placeholder="请输入企业名称"></Input>
      </FormItem>
      <FormItem label="上级商户号："
                prop="merchantNum">
        <Input v-model="formItem.merchantNum"
               style="width:100%"
               placeholder="请输入上级商户号"></Input>
      </FormItem>
      <FormItem label="法定代表人姓名："
                prop="legalName">
        <Input v-model="formItem.legalName"
               style="width:100%"
               placeholder="请输入法人姓名"></Input>
      </FormItem>
      <FormItem label="身份证号码："
                prop="idcard">
        <Input v-model="formItem.idcard"
               style="width:100%"
               placeholder="请输入身份证号码"></Input>
      </FormItem>
      <FormItem label="社会统一信用代码："
                prop="creditCode">
        <Input v-model="formItem.creditCode"
               style="width:100%"
               placeholder="请输入社会统一信用代码"></Input>
      </FormItem>
      <FormItem label="开户行名称："
                prop="bankName">
        <Input v-model="formItem.bankName"
               style="width:100%"
               placeholder="请输入开户行名称"></Input>
      </FormItem>
      <FormItem label="银行账号："
                prop="bankAccount">
        <Input v-model="formItem.bankAccount"
               style="width:100%"
               placeholder="请输入银行账号"></Input>
      </FormItem>
      <FormItem label="所在地区：" prop="locationCode">
        <select-item
          ref="select"
          style="width:100%;"
          :addrCode="formItem.locationCode"
          :span='8'
          @getProvince="getProvince"
          @getCity="getCity"
          @getQu="getQu"></select-item>
      </FormItem>
      <FormItem label="详细地址：" prop="address">
        <Input style="width:100%;"
               v-model="formItem.address"
               placeholder="请输入详细地址"></Input>
      </FormItem>
      <FormItem label="上传营业执照：" prop="licenseImg">
        <Input v-model="formItem.licenseImg" style="display:none"></Input>
        <my-img :limitNum="1" :uploadList="singleImgList" @getImgUrl="setlicenseImg"></my-img>
        <p>建议上传小于10M的png、jpg、jpeg格式的图片</p>
      </FormItem>
      <FormItem>
        <Button type="primary"
                @click="submit"
                :loading="btnLoading">确认</Button>
        <Button @click='back'>取消</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  import { apiGet, apiPost } from '@/fetch/api'
  import selectItem from "@/components/global/selectList";
  import myImg from "@/components/global/singleImg";
  export default {
    components: {
      selectItem,
      myImg,
    },
    data () {
      return {
        singleImgList: [],
        chooseModal: false,
        flag: false,
        entryMode: 'add',// 编辑、查看、新增 共用一个页面
        btnLoading: false,
        tableLoading: false,
        formItem: {
          merchantType: '',
          shortName: '',
          enterpriseName: '',
          merchantNum: '',
          legalName: '',
          idcard: '',
          creditCode: '',
          bankName: '',
          bankAccount: '',
          locationCode: '',
          address: '',
          licenseImg: '',
        },
        ruleComplteForm: {
          merchantType: [
            { required: true, message: '请选择商户类型', trigger: 'change' }
          ],
          shortName: [
            { required: true, message: '请输入商户简称', trigger: 'blur' },
            { max: 50, message: "商户简称不超过50字符" }
          ],
          enterpriseName: [
            { required: true, message: '请输入企业简称', trigger: 'blur' },
            { max: 60, message: "企业名称不超过50字符",trigger: 'blur'  }
          ],
          legalName: [
            { max: 60, message: "企业名称不超过50字符",trigger: 'blur'  }
          ],
          idcard: [
            {
              required: false, validator: this.common.validate.IdCodeValid, trigger: 'blur' }
          ],
          creditCode: [
            { max: 60, message: "信用代码不超过50字符",trigger: 'blur'  }
          ],
          bankName: [
            { max: 60, message: "银行名称不得超过50字符",trigger: 'blur'  }
          ],
          bankAccount: [
            { max: 60, message: "银行名称不得超过50字符",trigger: 'blur'  }
          ],
        },
      }
    },
    watch: {
      social: function (val) {
        if (val.length != 10) {
          // 没有全选
          this.active = false
        } else {
          this.active = true
        }
      }
    },
    created () {
      if (this.$route.query.editId) {
        this.entryMode = 'edit'
        apiPost('/admin/webapi/userNotice/getById', {
          merchantId: this.$route.query.editId
        }).then(res => {
          if (res.status == 200) {
            this.flag = true
            this.formItem = {
                merchantType: res.data.merchantType,
                shortName: '',
                enterpriseName: '',
                merchantNum: '',
                legalName: '',
                idcard: '',
                creditCode: '',
                bankName: '',
                bankAccount: '',
                locationCode: '',
                address: '',
                licenseImg: '',
            };
          }
        })
      } else {
        this.entryMode = 'add'
        this.flag = true
      }
    },
    methods: {
      getProvince(sheng){
        this.sheng=sheng
        console.log(sheng)
      },
      getCity(city){
        this.city=city
        console.log(city)
      },
      getQu(qu){
        this.qu=qu
        console.log(qu)
      },
      setlicenseImg(imgArr) {
        this.formItem.licenseImg = imgArr.join(",");
      },
      back () {
        this.$router.back()
      },
      submit () {
        let _this = this
        this.btnLoading = true

        this.$refs.formItem.validate(async valid => {
          if (valid) {
            let url = '/admin/webapi/userNotice/save'

            if (this.entryMode == 'edit') {
              url = '/admin/webapi/userNotice/edit'
              this.formItem.id = this.$route.query.editId
            }

            let res = await apiPost(url, this.formItem)
            if (res.status == 200) {
              _this.$Message.success('保存成功!')
              _this.$router.push('/merchantManage')
            } else {
              this.btnLoading = false
              _this.$Message.warning(res.message)
            }
          } else {
            this.btnLoading = false
            // 滚动到错误地方
            setTimeout(function () {
              $('#content').scrollTop(
                $('.ivu-form-item-error').offset().top -
                90 +
                $('#content').scrollTop()
              )
            }, 500)
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .merchantAdd {
    width: 70%;
    margin: 0 auto;
  }
</style>
