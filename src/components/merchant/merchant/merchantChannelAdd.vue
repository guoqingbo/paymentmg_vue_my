<template>
  <div class="merchantAdd">
    <Form :model="formItem"
          label-position="right"
          :label-width="120"
          ref="formItem"
          :rules="ruleComplteForm">
      <FormItem label="商户号："
                prop="merchantNum">
        <Input v-model="formItem.merchantNum"
               style="width:100%"
               placeholder="请输入商户号"></Input>
      </FormItem>
      <FormItem label="支付产品："
                  prop="payProduct">
          <Select v-model="formItem.payProduct"
                  style="width:100%"
                  placeholder="请选择支付产品">
            <Option  v-for="item in payProduct"
                     :key="item.value"
                     :value="item.value">{{item.label}}</Option>
            <!--<Option value="1">企业网银</Option>-->
            <!--<Option value="2">扫码支付</Option>-->
          </Select>
        </FormItem>
      <FormItem label="渠道产品："
                prop="payProduct">
        <Select v-model="formItem.payProduct"
                style="width:100%"
                placeholder="请选择渠道产品">
          <Option  v-for="item in payProduct"
                   :key="item.value"
                   :value="item.value">{{item.label}}</Option>
          <!--<Option value="1">企业网银</Option>-->
          <!--<Option value="2">扫码支付</Option>-->
        </Select>
      </FormItem>
      <FormItem label="渠道计费方式："
                prop="payProduct">
        <Select v-model="formItem.payProduct"
                style="width:100%"
                placeholder="请选择渠道计费方式">
          <Option  v-for="item in payProduct"
                   :key="item.value"
                   :value="item.value">{{item.label}}</Option>
          <!--<Option value="1">企业网银</Option>-->
          <!--<Option value="2">扫码支付</Option>-->
        </Select>
      </FormItem>
      <FormItem label="商户费率："
                prop="enterpriseName">
        <Input v-model="formItem.enterpriseName"
               style="width:100%"
               placeholder="请输入商户费率"></Input>
      </FormItem>

      <div class="pay-config-tip">
        <span class="line"></span>
        <span class="tip">支付配置信息</span>
        <span class="line"></span>
      </div>
      <!--微信支付-->
      <div class="pay-way" v-if="true">
        <FormItem>
          <Button @click="submit">普通模式</Button>
          <Button @click='back'>服务模式</Button>
        </FormItem>
        <FormItem label="服务商："
                  prop="payProduct">
          <Select v-model="formItem.payProduct"
                  style="width:100%"
                  placeholder="请选择服务商">
            <Option  v-for="item in payProduct"
                     :key="item.value"
                     :value="item.value">{{item.label}}</Option>
            <!--<Option value="1">企业网银</Option>-->
            <!--<Option value="2">扫码支付</Option>-->
          </Select>
        </FormItem>
        <FormItem label="微信商户号："
                  prop="legalName">
          <Input v-model="formItem.legalName"
                 style="width:100%"
                 placeholder="请输入微信商户号"></Input>
        </FormItem>
        <FormItem label="APPID："
                  prop="idcard">
          <Input v-model="formItem.idcard"
                 style="width:100%"
                 placeholder="请输入APPID"></Input>
        </FormItem>
        <FormItem label="微信商户支付密钥："
                  prop="creditCode">
          <Input v-model="formItem.creditCode"
                 style="width:100%"
                 placeholder="请输入微信商户支付密钥"></Input>
        </FormItem>
        <FormItem label="微信pl2证书：" prop="licenseImg">
          <uploadFile :limitNum="1"
                      v-model="formItem.licenseImg"
                      :format="format"></uploadFile>
          <p>文件传格式为.pl2的证书</p>
        </FormItem>
      </div>
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
  import uploadFile from "@/components/global/uploadFile";
  export default {
    components: {
      selectItem,
      uploadFile,
    },
    data () {
      return {
        format:['.pl2','docx'],
        payProduct:this.$store.state.global.payProduct,
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
          merchantNum:[
            { required: true, message: '请输入商户号', trigger: 'blur' },
            { max: 20, message: "商户号不超过50字符" }
          ],
          payProduct: [
            { required: true, message: '请选择支付产品', trigger: 'change' }
          ],
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
