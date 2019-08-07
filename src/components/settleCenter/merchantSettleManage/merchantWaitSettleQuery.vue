<template>
  <div>
    <list ref="gridTable"
          :columns="columns"
          :url="url"
          :params="params"
          @beforeSubmit="beforeSubmit"
          :searchItems="searchItems"
          :hannleItems="hannleItems"></list>
    <confirm ref="confirmModel"
             :content="content"
             :sucessMsg="sucessMsg"
             :mode="mode"></confirm>
    <!--明细-->
    <Modal v-model="detailShow"
           title="待结算明细"
           width="900">
      <list ref="gridDetailTable"
            :columns="detailColumns"
            :url="detailUrl"
            :params="detailParams"
            :searchItems="[]"
            :hannleItems="[]"></list>
      <div slot="footer">
        <Button @click="detailShow=false" type="primary">关闭</Button>
      </div>
    </Modal>
    <!--结算（转账信息确认）-->
    <Modal v-model="settleShow"
           title="转账信息确认"
           width="600">
      <div class="settle-content">
        <div class="settle-tip">
          <Icon type="md-warning" color="#f00" :size="25" />
          <span>转账完成不支持撤销，请仔细检查转账结算信息以免产生转账错误</span>
        </div>
        <table class="account-info-table">
          <tr>
            <td>收款商户名</td>
            <td>沙县一号店</td>
          </tr>
          <tr>
            <td>收款银行</td>
            <td>沙县一号店</td>
          </tr>
          <tr>
            <td>收款银行户名</td>
            <td>沙县一号店</td>
          </tr>
          <tr>
            <td>收款银行账号</td>
            <td>沙县一号店</td>
          </tr>
          <tr>
            <td>付款银行</td>
            <td>沙县一号店</td>
          </tr>
          <tr>
            <td>付款银行户名</td>
            <td>沙县一号店</td>
          </tr>
          <tr>
            <td>付款银行账号</td>
            <td>沙县一号店</td>
          </tr>
        </table>
        <div class="check-box">
          <Checkbox v-model="settleConfirm">银行转账信息我已确认无误</Checkbox>
          <p class="check-box-tip">银行转账信息确认无误，请在复选框中打钩</p>
        </div>
      </div>
      <div slot="footer">
        <Button @click="confirmTransAccount" type="primary" :disabled="!settleConfirm">确认转账</Button>
        <Button @click="settleShow=false">取消转账</Button>
      </div>
    </Modal>
    <!--确认转账后的提示-->
    <Modal v-model="settleAfterShow"
           title="转账信息确认"
           width="500">
      <div class="settle-after-box">
        <Icon type="md-warning" color="#FFBB22" :size="60" />
        <div class="account-info">
          <p class="settle-after-tip">转账申请已成功提交至银行，等待处理中</p>
          <p style="color: #999;">转账金额：19,000.00</p>
          <div style="color: #999;">
            <span>结算订单号：JSD99049050034 </span>
            <router-link :to="{path:'/settleCenter/merchantSettleManage/merchantHistorySettleQuery',query: {}}">查看订单</router-link>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button @click="settleAfterShow=false" type="primary">关闭</Button>
      </div>
    </Modal>

  </div>
</template>
<script>
  import list from '@/components/global/list'
  import confirm from '@/components/global/confirm'
  import modalForm from '@/components/global/modalForm'
  export default {
    data () {
      return {
        columns: [
          {
            title: '序号',
            type:'index',
            width:70,
            align:'center'
          },
          {
            title: '支付中心商户号',
            key: 'ruleNo',
          },
          {
            title: '商户名称',
            key: 'orderSource',
            render:''
          },
          {
            title: '待结算金额',
            key: 'channelName',
          },
          {
            title: '付款银行',
            key: 'channelProductName',
          },
          {
            title: '付款银行户名',
            key: 'singleLimit',
          },
          {
            title: '付款银行账号',
            key: 'dayLimit',
          },
          {
            title: '收款银行名称',
            key: 'status',
            render: (h, params) => {
              return h('span', this.filter.turn('payLimitStatus',params.row.status))
            }
          },
          {
            title: '付款银行户名',
            key: 'singleLimit',
          },
          {
            title: '收款银行账号',
            key: 'singleLimit',
          },
          {
            title: '操作',
            key: 'action',
            render: (h, params) => {
              const actions = [
                {
                  title: "明细",
                  action: () => {
                    this.detailShow = true
                    this.detail = params.row
                    this.setDetail()
                  }
                },
                {
                  title: "结算",
                  action: () => {
                    this.settleShow = true
                    this.detail = params.row
                    this.setDetail()
                  }
                }
              ];
              return this.common.columnsHandle(h, actions);
            }
          }
        ],
        params: {
          sort:'modifyTime',
          order:'desc'
        },
        url: '/riskPayLimit/grid',
        searchItems: [
          {
            label: '商户名称',
            type: 'autoComplete',
            name: 'merchantName',
            data:[],
            search: (value)=>{
              this.common.searchMerchantList(value,this.searchItems[0])
            }
          },
          {
            label: '开始日期',
            type: 'date',
            name: 'startDate',
            format:'yyyy-MM-dd 00:00:00',
            value: ''
          },
          {
            label: '结束日期',
            type: 'date',
            name: 'endDate',
            format:'yyyy-MM-dd 23:59:59',
            value: ''
          },
        ],
        hannleItems: [

        ],
        detailColumns: [
          {
            title: '小鲸订单号',
            key: 'ruleNo',
          },
          {
            title: '业务订单号',
            key: 'ruleNo',
          },
          {
            title: '分账明细编号',
            key: 'orderSource',
            render:''
          },
          {
            title: '订单实付金额',
            key: 'channelName',
          },
          {
            title: '待结算金额',
            key: 'channelProductName',
          },
          {
            title: '订单成功时间',
            key: 'singleLimit',
          },
          {
            title: '来源商户名称',
            key: 'dayLimit',
          },
          {
            title: '结算状态',
            key: 'status',
            render: (h, params) => {
              return h('span', this.filter.turn('payLimitStatus',params.row.status))
            }
          }
        ],
        detailParams: {
          sort:'modifyTime',
          order:'desc'
        },
        detailUrl: '/riskPayLimit/grid',
        detailShow: false,

        settleConfirm:'',
        settleShow:false,
        settleAfterShow:false,

        mode: "",
        content: "",
        sucessMsg: "",

        formTitle:"添加",
        formItems: [
          {
            title: '订单来源',
            name: 'orderSource',
            type: 'select',
            data: '',
            rules: [{ required: true, message: '请选择订单来源', trigger: 'change' }]
          },
          {
            title: '支付渠道',
            name: 'channelCode',
            type: 'select',
            data: '',
            onChange:this.getChannelProduct,
            rules: [{ required: true, message: '请选择支付渠道', trigger: 'change' }]
          },
          {
            title: '渠道支付产品',
            name: 'channelProductCode',
            type: 'select',
            data: '',
            rules: [{ required: true,message: '请选择渠道支付产品', trigger: 'change' }]
          },
          {
            title: '单笔限额（元）',
            name: 'singleLimit',
            type: 'input',
            rules: [{required: true,validator: this.validateLimit, trigger: "blur",message1: "请输入单笔限额"},
              // {max: 20, message: "单笔限额不超过20字符", trigger: 'blur'}
            ]
          },
          {
            title: '单日累计限额（元）',
            name: 'dayLimit',
            type: 'input',
            rules: [{required: true,validator: this.validateLimit, trigger: "blur",message1: "请输入单日累计限额"},
              // {max: 20, message: "单日累计限额不超过20字符", trigger: 'blur'}
            ]
          },
          {
            title: '是否启用',
            name: 'status',
            type: 'radio',
            data: this.common.dic.payLimitStatus,
            value:0,
            rules: [{ required: false, type:'number'}]
          },
        ],
        formUrl: '/riskPayLimit/saveOrUpdate',
        detail:'',
      }
    },
    computed:{

    },
    created(){
      // 获取订单来源
      this.getMerchantSource()
      // 获取支付渠道
      this.getPayChannel()
      // 日期限制
      this.checkDate()
    },
    mounted () {

    },
    components: {list,confirm,modalForm},
    methods: {
      // 搜索之前
      beforeSubmit(params){
        // 商户名，商户号拆分
        this.common.splitMerchant(params)
      },
      // 确认转账
      confirmTransAccount(){
        // let params = {}
        // this.apiPost('/riskPayLimit/channelProduct/list',params).then(res=>{
        //
        // })
        // 隐藏确认转账弹框
        this.settleShow = false
        // 展示确认转账后的弹框
        this.settleAfterShow = true
      },
      // 获取订单来源
      getMerchantSource(){

        this.$store.dispatch("getMerchantSource").then(res=>{
          this.formItems[0].data = res
          // 表格商户来源转换
          let source={}
          res.forEach(ele=>{
            source[ele.value] = ele.label
          })
          this.columns[2].render = (h, params) => {
            return h('span', source[params.row.orderSource])
          }
        })
      },
      // 获取支付渠道
      getPayChannel(){
        this.$store.dispatch("getPayChannel").then(res=>{
          this.formItems[1].data = res
        })
      },
      // 根据支付渠道获取渠道产品
      getChannelProduct(e){
        if(!e){
          return
        }
        this.apiGet('/riskPayLimit/channelProduct/list',{channelCode:e}).then(res=>{
          let channelProduct = []
          if(res.status == 200){
            res.data.forEach((ele)=>{
              channelProduct.push({
                value:ele.channelProductCode,
                label:ele.channelProductName
              })
            })
          }
          this.formItems[2].data = channelProduct
        })
      },
      // 单笔交易限额、单日累计交易限额校验
      validateLimit(rule, value, callback) {

        let regexp = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
        if (rule.required && !value) {
          callback(new Error(rule.message1))
        } else if (value <= 0 || value >= 100000000) {
          callback(new Error('请输入大于0小于1亿的数'))
        } else if (!(regexp.test(value))) {
          callback(new Error('数据格式不正确！'))
        } else {
          callback()
        }
      },
      // 设置详情页
      setDetail(){
        this.formItems.forEach((ele,index)=>{
          ele.value = this.detail[ele.name]
          // 新增时默认是否启用为停用
          if(ele.name == 'status' && typeof this.detail[ele.name] == 'undefined'){
            ele.value = 0
          }
        })
        // 获取渠道支付产品
        if(this.detail.channelCode){
          this.getChannelProduct(this.detail.channelCode)
        }
      },
      // 保存提交之前
      beforeSave(params){
        if(this.detail.id){
          params.id = this.detail.id
        }
      },
      // 获取订单明细后
      onGetAfter(orderInfo){
        // this.orderInfo = orderInfo
      },
      // 日期限制
      checkDate(){
        // 开始时间结束时间限制
        let startDateItem = this.searchItems[1]
        let endDateItem = this.searchItems[2]
        if(startDateItem && endDateItem){
          startDateItem.onChange=(date1)=>{
            endDateItem.options.disabledDate=date2=>{
              let disabled = false
              if(date2.getTime()<new Date(this.formateDateStr(date1)).getTime()){
                // 结束日期不得小于开始日期
                disabled = true
              }
              return disabled
            }
          }
          endDateItem.onChange=(date1)=>{
            startDateItem.options.disabledDate=date2=>{
              let disabled = false
              if(date2.getTime()>new Date(this.formateDateStr(date1)).getTime()){
                // 开始日期不得大于结束日期
                disabled = true
              }
              return disabled
            }
          }
        }
      },
      // 日期转为时间戳，如果不带时分秒，则存在时差
      formateDateStr(str){
        if(str.length <19){
          str += ' 00:00:00'.substring(10-str.length)
        }
        return str
      }
    }
  }
</script>
<style scoped>
  .settle-content{
    padding: 0 10px;
  }
  .settle-tip{
    text-align: center;
    font-size: 14px;
    margin-bottom: 10px;
  }
  .account-info-table{
    width: 100%;
    text-align: center;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  .account-info-table td{
    height: 34px;
    box-sizing: border-box;
    padding: 5px;
    text-align: center;
    border: 1px solid #e9eaec;
  }
  .account-info-table tr:nth-last-child(n+4){
    background-color: #efefef;
  }
  .account-info-table td:first-child{
    width: 200px;
  }
  .check-box{
    text-align: center;
  }
  .check-box-tip{
    margin-top: 10px;
    color: #f00;
  }
  .settle-after-box{
    text-align: center;
    font-size: 14px;
  }
  .account-info{
    margin-left: 10px;
    display: inline-block;
    vertical-align: middle;
    text-align: left;
  }
  .settle-after-tip{
    margin-bottom: 10px;
  }
</style>
