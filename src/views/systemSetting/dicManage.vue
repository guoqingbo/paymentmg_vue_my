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
               @beforeSave="beforeSave"
               :url="formUrl"
               :routeType='routeType'
               :title="formTitle">
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
        detail:{},
        routeType: 'add',
        columns: [
          {
            title: '字典名称',
            key: 'configValue',
            align:'center'
          },
          {
            title: '字典编码',
            key: 'configKey',
            // sortable: true,
            align:'center'
          },
          {
            title: '字典分类',
            key: 'configType',
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
                      label:'删除',
                      value:'1',
                      auth:'dicManageDelete',// 权限校验
                    },
                    {
                      label:'修改',
                      value:'2',
                      auth:'dicManageEdit',// 权限校验
                    }
                  ],
                  value:"",
                  onClick:(value)=>{
                    if(value == 1){
                      this.mode = "delete";
                      this.sucessMsg = "删除成功！";
                      this.content = "确定删除？";
                      this.$refs.confirmModel.confirm(
                        "/configDictionary/delete/" + params.row.id,{},'get'
                      );
                    }else if(value==2){
                      this.formShow = true
                      this.formItems.forEach((item,index)=>{
                        item.type = item.type.replace(/(Text)$/g,'')
                      });
                      this.formUrl = '/configDictionary/update'
                      this.routeType = 'edit'
                      this.formTitle = '修改'
                      this.detail = params.row
                      this.setDetail()
                    }
                  }
                }
              ]
              return this.common.columnsItemRender(h, actions);
            }
          }
        ],
        params: {

        },
        url: '/configDictionary/grid',
        searchItems: [],
        hannleItems: [
          {
            title: '添加',
            icon: 'md-add',
            auth:'dicManageAdd',
            callback: () => {
              this.formShow = true
              this.formItems.forEach((item,index)=>{
                item.type = item.type.replace(/(Text)$/g,'')
              });
              this.formUrl = '/configDictionary/save'
              this.routeType = 'add'
              this.formTitle = '添加'
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
            title: '字典分类',
            name: 'configType',
            type: 'input',
            rules: [
              {required: true, message: '请输入字典分类', trigger: 'blur'},
              {required: true, max:64,message: '字典分类不得超过64个字符', trigger: 'blur'}
            ],
            value: '',
          },
          {
            title: '字典编码',
            name: 'configKey',
            type: 'input',
            rules: [
              {required: true, message: '请输入字典编码', trigger: 'blur'},
              {required: true, max:64,message: '字典编码不得超过64个字符', trigger: 'blur'}
            ],
          },
          {
            title: '字典名称',
            name: 'configValue',
            type: 'input',
            rules: [
              {required: true, message: '请输入字典名称', trigger: 'blur'},
              {required: true, max:64,message: '字典名称不得超过64个字符', trigger: 'blur'}
            ],
          },
          {
            title: '备注',
            name: 'remark',
            type: 'textarea',
            rules: [
                {required: false, max:128,message: '备注不得超过64个字符', trigger: 'blur'}
            ],
          },
        ],
        formUrl: '/configDictionary/save'
      }
    },
    created(){

    },
    mounted () {

    },
    components: {list,confirm,modalForm},
    methods: {
      // 设置详情页
      setDetail(){

        this.formItems.forEach(ele=>{
          ele.value = this.detail[ele.name]
        })
      },
      beforeSave(params){
        if(this.routeType=='edit'){
          params.id = this.detail.id
        }else{
          delete params.id
        }
      }
    }
  }
</script>
