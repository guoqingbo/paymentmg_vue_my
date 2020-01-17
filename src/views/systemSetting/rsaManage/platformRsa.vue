<template>
  <div>
    <list ref="gridTable"
          :columns="columns"
          :url="url"
          :params="params"
          :searchItems="searchItems"
          :hannleItems="hannleItems"></list>
    <confirm ref="confirmModel"
             :content="content"
             :sucessMsg="sucessMsg"
             :mode="mode"></confirm>
    <modalForm v-model="formShow"
               :formItems="formItems"
               :url="formUrl"
               :routeType='routeType'
               @input='closeModal'
               :title="formTitle">
      <!--新增-->
      <template v-if="routeType=='add'">
        <div style="padding-left: 150px" slot="publicKeyAfter">
          <Button type="primary" @click="rsaCreate">生成密钥</Button>
        </div>
      </template>
      <!--编辑-->
      <template v-if="routeType=='edit'">
        <div style="padding-left: 150px" slot="publicKeyAfter">
          <Button type="primary" @click="rsaCreate">重新生成密钥</Button>
          <Icon style="font-size: 20px;color: red;" type="ios-alert" />
          <span style="color: red;vertical-align: middle;">重新生成秘钥可能导致支付错误，请谨慎操作！</span>
        </div>
      </template>
      <!--查看-->
      <template v-if="routeType=='detail'">
        <div style="text-align: right;margin: -20px 0 10px" slot="privateKeyAfter">
          <Button type="primary"
                  v-clipboard:copy="formItems[1].value"
                  v-clipboard:success="onCopySuccess"
                  v-clipboard:error="onCopyError">
            复制私钥
          </Button>
        </div>
        <div style="text-align: right;margin: -20px 0 10px" slot="publicKeyAfter">
          <Button type="primary"
                  v-clipboard:copy="formItems[2].value"
                  v-clipboard:success="onCopySuccess"
                  v-clipboard:error="onCopyError">
            复制公钥
          </Button>
        </div>
      </template>
    </modalForm>
  </div>
</template>
<script>
  import list from '@/components/global/list'
  import confirm from '@/components/global/confirm'
  import modalForm from '@/components/global/modalForm'
  export default {
    data () {
      return {
        routeType: 'add',
        columns: [
          {
            title: '序号',
            type:'index',
            width:70,
            align:'center'
          },
          {
            title: '平台名称',
            key: 'orderSourceName',
            // sortable: true,
            align:'center'
          },
          {
            title: '平台代码',
            key: 'orderSource',
            // sortable: true,
            align:'center'
          },
          {
            title: '操作',
            key: 'action',
            width: 130,
            align:'center',
            render: (h, params) => {
              const actions = [
                {
                  title:'操作',
                  type:'dropdown',
                  data:[
                    {
                      label:'编辑',
                      value:'1',
                      auth:'platformRsaEdit',// 权限校验
                    },
                    {
                      label:'查看',
                      value:'2',
                      auth:'platformRsaDetail',// 权限校验
                    }
                  ],
                  value:"",
                  onClick:(value)=>{
                    if(value == 1){
                      this.formShow = true
                      this.formItems.forEach((item,index)=>{
                        item.disabled = true;
                        item.type = item.type.replace(/(Text)$/g,'')
                      });
                      this.formUrl = '/rsaKeyPlatform/update'
                      this.routeType = 'edit'
                      this.formTitle = '修改秘钥'
                      this.detail = params.row
                      this.setDetail(params.row.orderSource)
                    }else if(value==2){
                      this.formShow = true
                      this.formItems.forEach(item=>{
                        if(!/(Text)$/g.test( item.type)){
                          item.type += 'Text'
                        }
                      });
                      this.routeType = 'detail'
                      this.formTitle = '查看秘钥'
                      this.detail = params.row
                      this.setDetail(params.row.orderSource)
                    }
                  }
                }
              ]
              return this.common.columnsItemRender(h, actions);
            }
          }
        ],
        params: {
          sort:'modifyTime',
          order:'desc'
        },
        url: '/rsaKeyPlatform/grid',
        searchItems: [],
        hannleItems: [
          {
            title: '添加平台秘钥',
            icon: 'md-add',
            callback: () => {
              this.formShow = true
              this.formItems[0].disabled = false
              this.formItems.forEach((item,index)=>{
                item.type = item.type.replace(/(Text)$/g,'')
                // if(!index){
                //   item.disabled = false;
                // }else{
                //   item.disabled = true;
                // }
                // item.clipboard=false
                // if(item.type=='inputText'){
                //   item.type='input'
                // }else if(item.type=='textareaText'){
                //   item.type='textarea'
                // }else if(item.type=='btn'){
                //   item.disabled=false
                //   item.value='生成秘钥'
                //   item.desc=''
                // }
              });
              this.formUrl = '/rsaKeyPlatform/save'
              this.routeType = 'add'
              this.formTitle = '添加秘钥'
            }
          }
        ],

        mode: "",
        content: "",
        sucessMsg: "",

        formTitle:"添加",
        formShow: false,
        formItems: [
          {
            title: '平台名称',
            name: 'orderSource',
            type: 'select',
            data: [],
            rules: [
              {required: true, message: '请选择平台名称', trigger: 'change'}
            ],
            value: null,
          },
          {
            title: '私钥',
            placeholder: '请生成秘钥',
            name: 'privateKey',
            type: 'textarea',
            // clipboard: true,
            // clipboardText: '复制私钥',
            disabled: true,
            value: '',
            rules: [{ required: true, message: '请生成秘钥', trigger: 'blur' },
            ]
          },
          {
            title: '公钥',
            placeholder: '请生成秘钥',
            name: 'publicKey',
            type: 'textarea',
            // clipboard: true,
            // clipboardText: '复制公钥',
            disabled: true,
            value: '',
            rules: [{ required: true, message: '请生成秘钥', trigger: 'blur' },
            ]
          },
          // {
          //   title: '',
          //   name: '',
          //   type: 'btn',
          //   disabled: false,
          //   value: '生成秘钥',
          //   desc: '',
          //   cb: this.rsaCreate
          // },
        ],
        formUrl: '/rsaKeyPlatform/save'
      }
    },
    created(){
      this.getMerchantSource()
    },
    mounted () {

    },
    components: {list,confirm,modalForm},
    methods: {
      onCopySuccess(){
        this.$Message.success("复制成功")
      },
      onCopyError(){
        this.$Message.error("复制失败")
      },
      closeModal() {
        this.formShow = false;
      },
      // 生成秘钥
      rsaCreate() {
        let params = {
          // vagueMerchantMark: '',
          // columnType: 2,
        }
        let url = '/constant/rsaKey/create'
        this.apiGet(url,params).then(res=>{
          if(res.status == 200){
            this.formItems.forEach(item=>{
              if(item.name=='privateKey'){
                item.value = res.data.privateKey
              }
              if(item.name=='publicKey'){
                item.value = res.data.publicKey
              }
            });
          }else{
            this.$Message.error(res.message)
          }
        })
      },
      // 获取商户来源
      getMerchantSource(){
        this.$store.dispatch("getMerchantSource").then(res=>{
          let merchantSource = this.$store.state.global.merchantSource
          this.formItems[0].data = merchantSource
        })
      },
      // 设置详情页
      setDetail(orderSource){
        this.apiGet('/rsaKeyPlatform/detail/'+orderSource).then(res=>{
          if(res.status == 200){
            this.formItems.forEach(item=>{
              item.value = res.data[item.name]
              // if(item.name=='orderSource'){
              //   item.value = res.data.orderSource
              // }
              // if(item.name=='privateKey'){
              //   item.value = res.data.privateKey
              // }
              // if(item.name=='publicKey'){
              //   item.value = res.data.publicKey
              // }
            });
            console.log(this.formItems)
          }else{
            this.$Message.error(res.message)
          }
        })
      },
    }
  }
</script>
