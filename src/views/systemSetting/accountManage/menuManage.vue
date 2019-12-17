<template>
  <div>
    <!--菜单表格-->
   <div>
     <Row :gutter="16">
       <Col span="2" v-for="item in hannleItems" :key="item.title">
         <Button type="primary"
                 :icon="item.icon"
                 @click="item.callback"
                 :loading="item.loading">{{ item.title }}</Button>
       </Col>
     </Row>
     <div style="margin-top: 20px">
       <Tree :data="menuTree" :render="meneuTreerender"></Tree>
     </div>
   </div>
    <confirm ref="confirmModel"
             :apiPrefix="apiPrefix"
             :content="content"
             :sucessMsg="sucessMsg"
             :mode="mode"></confirm>
    <modalForm v-model="formShow"
               :formItems="formItems"
               :routeType='routeType'
               :apiPrefix="apiPrefix"
               @on-success="onSuccess"
               @beforeSave='beforeSave'
               :url="formUrl"
               :title="formTitle">
      <!--<div slot="header">-->

      <!--</div>-->
    </modalForm>
  </div>
</template>
<script>
  import list from '@/components/global/list'
  import confirm from '@/components/global/confirm'
  import modalForm from '@/components/global/modalForm'
  export default {
    components: {list,confirm,modalForm},
    data () {
      return {
        menuTree: [],
        apiPrefix:this.common.config.apiUser,
        params: {
          sort:'modifyTime',
          order:'desc'
        },
        hannleItems: [
          {
            title: '添加',
            icon: 'md-add',
            callback: () => {
              this.openPop({},'add')
            }
          }
        ],
        mode: "",
        content: "",
        sucessMsg: "",

        formTitle:"新增菜单",
        formShow: false,
        formItems: [
          {
            title: '名称',
            name: 'privilegeName',
            type: 'input',
            rules: [
              { required: true, message: '请输入菜单名称', trigger: 'blur' },
              {max: 10, message: "菜单名称不超过10字符", trigger: 'blur'}
              ]
          },
          {
            title: '唯一编码',
            name: 'privilegeMark',
            type: 'input',
            rules: [{ required: true, message: '请输入唯一编码', trigger: 'blur' },
              {max: 64, message: "唯一编码不超过64字符", trigger: 'blur'}
            ]
          },
          {
            title: '前端URL',
            name: 'privilegeUrl',
            type: 'input',
            tip:'如果是页面跳转，请填写跳转的地址，公共路由组件使用 /{path}/:{param}，path为公用组件地址',
            rules: [{ required: false,max: 100, message: "前端URL不超过100字符", trigger: 'blur'}]
          },
          {
            title: '权限类型',
            name: 'privilegeType',
            type: 'radio',
            value: '2',
            data:this.common.dic.privilegeType,
            rules: [{ required: true, message: '请选择权限类型', trigger: 'change' }]
          },
          {
            title: '接口URL',
            name: 'privilegeMethod',
            type: 'input',
            tip:'如果接口需要做权限校验，填入对应的接口地址',
            rules: [{ required: false,max: 100, message: "接口URL不超过100字符", trigger: 'blur'}]
          },
          {
            title: '权限分组',
            name: 'privilegeGroup',
            type: 'radio',
            value: '1',
            data:this.common.dic.privilegeGroup,
            rules: [{ required: true, message: '请选择权限分组', trigger: 'change' }],
          },
          {
            title: '排序',
            name: 'privilegeOrder',
            type: 'input',
            rules: [
              { required: true, message: '请输入排序', trigger: 'blur' },
              {required: true, validator: this.common.validate.positiveInteger, trigger: 'blur'}
              ]
          },
          {
            title: '功能类别',
            name: 'privilegeMenuType',
            type: 'select',
            data: this.common.dic.privilegeMenuType,
            rules: [
              {required: true, message: '请选择功能类别', trigger: 'change'}
            ],
            value: '',
          },
          {
            title: '层级深度',
            name: 'privilegeLevel',
            type: 'select',
            data: this.common.dic.privilegeLevel,
            disabled:true,
            rules: [
              {required: true, message: '请选择层级深度', trigger: 'change'}
            ],
            value:'1'
          },
        ],
        routeType:'',
        formUrl: '/privilege/update',
        selectedMenu:'',
      }
    },
    mounted () {

    },
    created(){
      // 获取菜单列表
      this.getMenuList()
    },
    methods: {
      meneuTreerender (h, { root, node, data }) {
        return h('div', {
          style: {
            display: 'inline-block',
            width: '500px',
            backgroundColor:"#cccccc14",
            // borderBottom:'1px solid #ccc',
            padding:'3px 10px',
            borderRadius:'5px'
          }
        }, [
          h('span', [
            h('Icon', {
              props: {
                type: 'ios-paper-outline'
              },
              style: {
                marginRight: '8px'
              }
            }),
            h('span', data.title)
          ]),
          h('div', {
            style: {
              display: 'inline-block',
              float: 'right',
              // marginRight: '32px'
            }
          }, [
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'md-add',
                size:'small'
              }),
              style: {
                marginRight: '8px'
              },
              on: {
                click: () => {
                  this.openPop(data,'add')
                }
              },
            }, '添加'),
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                size:'small'
              }),
              style: {
                marginRight: '8px'
              },
              on: {
                click: () => {
                  this.openPop(data,'edit')
                }
              },
            }, '编辑'),
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'md-remove',
                size:'small'
              }),
              style: {
                marginRight: '8px'
              },
              on: {
                click: () => {
                  this.$Modal.confirm({
                    title:data.row.privilegeName,
                    content:'确定删除'+data.row.privilegeName+'？',
                    onOk:()=>{
                      let url = '/privilege/delete'
                      this.apiGet(url,{id:data.row.id},this.apiPrefix).then(res=>{
                        if(res.success){
                         this.getMenuList()
                          // this.formateMenuList(res.data)
                        }else{
                          this.$Message.warning(res.message)
                        }
                      })
                    }
                  })
                }
              }
            },'删除'),
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                size:'small'
              }),
              style: {
                marginRight: '8px'
              },
              on: {
                click: () => {
                  this.openPop(data,'detail')
                }
              },
            }, '详情'),
          ])
        ]);
      },
      onSuccess(data){
        this.getMenuList()
      },
      beforeSave(params){
        params.privilegeParent = 0
        if(this.selectedMenu &&  this.selectedMenu.id){
          if(this.routeType == 'add'){
            delete params.privilegeId
            params.privilegeParent = this.selectedMenu.id
          } else if(this.routeType == 'edit'){
            params.privilegeId = this.selectedMenu.id
            params.privilegeParent = this.selectedMenu.privilegeParent
          }
          // else{
          //   params.privilegeParent = this.selectedMenu.privilegeParent
          // }
        }
      },
      // 获取菜单列表
      getMenuList(){
        let url = '/privilege/grid'
        this.apiGet(url,{},this.apiPrefix).then(res=>{
          if(res.success){
            // 格式化返回数据
            this.menuTree = this.formateMenuTree(res.data)
            // this.formateMenuList(res.data)
          }else{
            this.$Message.warning(res.message)
          }
        })
      },
      // 格式化数据
      formateMenuTree(list,menuTree=[]){
        if(list.length){
          list.forEach(ele=>{
            let tree = {
              title:ele.privilegeName,
              expand: ele.privilegeLevel<=1,
              children:[],
              row:ele,
            }
            if(ele.items && ele.items.length){
              this.formateMenuTree(ele.items,tree.children)
            }
            menuTree.push(tree)
          })
        }
        return menuTree
      },
      // 打开弹框
      openPop(item,type){
        this.routeType = type
        this.selectedMenu = item.row || {}
        this.formShow = true
        this.initFormItems()
        if(this.routeType == 'edit'){
          this.formTitle = this.selectedMenu.privilegeName+ '-编辑'
          // 请求接口
          this.formUrl = '/privilege/update'
        }else if(this.routeType == 'add'){
          this.formTitle = (this.selectedMenu.privilegeName||'一级菜单')+ '-添加'
          // 请求接口
          this.formUrl = '/privilege/add'
        }else  if(this.routeType == 'detail'){
          this.formTitle = this.selectedMenu.privilegeName+ '-详情'
        }
      },
      initFormItems(){
        if(this.selectedMenu.id){
          // 去除菜单选项
          let privilegeMenuType = this.common.dic.privilegeMenuType.slice(1)
          this.common.setArrItem(this.formItems,'privilegeMenuType',{data:privilegeMenuType})
        }
        if(this.routeType == 'edit'){
          this.formItems.forEach(ele=>{
            ele.value =  (this.selectedMenu[ele.name] || '')+""
            ele.type=ele.type.replace(/(Text)$/,'')
          })
        }else if(this.routeType == 'add'){
          this.formItems.forEach(ele=>{
            if(ele.name=='privilegeType'){
              ele.value = '2'
            }else if(ele.name=='privilegeGroup'){
              ele.value = '1'
            }
            // 设置层级
            let privilegeLevel = this.selectedMenu.privilegeLevel || '0'
            if(ele.name == 'privilegeLevel'){
                ele.value = (Number(privilegeLevel)+1)+""
            }
            ele.type=ele.type.replace(/(Text)$/,'')
          });
        }else if(this.routeType == 'detail'){
          this.formItems.forEach(ele=>{
            ele.value =  (this.selectedMenu[ele.name] || '')+""
            // 如果没有Text后缀则添加Text后缀
            if(!/(Text)$/.test(ele.type)){
              ele.type+='Text'
            }
          })
        }
      }
    }
  }
</script>
