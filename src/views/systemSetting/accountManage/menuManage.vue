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
       <Table
         style="position:static;"
         border
         stripe
         :columns="columns"
         :data="menuList"></Table>
       <!--<Tree :data="menuList" :render="renderContent"></Tree>-->
       <Tree :data="data5" :render="renderContent"></Tree>
     </div>
   </div>
    <confirm ref="confirmModel"
             :content="content"
             :sucessMsg="sucessMsg"
             :mode="mode"></confirm>
    <modalForm v-model="formShow"
               :formItems="formItems"
               :routeType='routeType'
               :apiPrefix="apiPrefix"
               @beforeSave='beforeSave'
               :url="formUrl"
               :title="formTitle">
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
        data5: [
          {
            title: 'parent 1',
            expand: true,
            // render: (h, { root, node, data }) => {
            //   return h('span', {
            //     style: {
            //       display: 'inline-block',
            //       width: '100%'
            //     }
            //   }, [
            //     h('span', [
            //       h('Icon', {
            //         props: {
            //           type: 'ios-folder-outline'
            //         },
            //         style: {
            //           marginRight: '8px'
            //         }
            //       }),
            //       h('span', data.title)
            //     ]),
            //     h('span', {
            //       style: {
            //         display: 'inline-block',
            //         float: 'right',
            //         marginRight: '32px'
            //       }
            //     }, [
            //       h('Button', {
            //         props: Object.assign({}, this.buttonProps, {
            //           icon: 'ios-add',
            //           type: 'primary'
            //         }),
            //         style: {
            //           width: '64px'
            //         },
            //         on: {
            //           click: () => { this.append(data) }
            //         }
            //       })
            //     ])
            //   ]);
            // },
            children: [
              {
                title: 'child 1-1',
                expand: true,
                children: [
                  {
                    title: 'leaf 1-1-1',
                    expand: true
                  },
                  {
                    title: 'leaf 1-1-2',
                    expand: true
                  }
                ]
              },
              {
                title: 'child 1-2',
                expand: true,
                children: [
                  {
                    title: 'leaf 1-2-1',
                    expand: true
                  },
                  {
                    title: 'leaf 1-2-1',
                    expand: true
                  }
                ]
              }
            ]
          }
        ],
        apiPrefix:this.common.config.apiUser,
        menuList:[],
        columns: [
          {
            title: '序号',
            type:'index',
            width:70,
            align:'center'
          },
          {
            title: '名称',
            key: 'privilegeName',
            sortable: true,
          },
          {
            title: '唯一编码',
            key: 'privilegeMark',
            sortable: true,
          },
          {
            title: '前端url',
            key: 'privilegeUrl',
            sortable: true,
          },
          {
            title: '接口url',
            key: 'privilegeMethod',
            sortable: true,
          },
          {
            title: '层级深度',
            key: 'privilegeLevel',
            sortable: true,
          },
          {
            title: '排序',
            key: 'privilegeOrde',
            sortable: true,
          },
          {
            title: '操作',
            key: 'action',
            width:140,
            align:'center',
            render: (h, params) => {
              const actions = [
                {
                  title:'操作',
                  type:'select',
                  data:[
                    {
                      label:'添加',
                      value:'1',
                    },
                    {
                      label:'编辑',
                      value:'2'
                    },
                    {
                      label:'删除',
                      value:'3'
                    }
                  ],
                  value:"",
                  onChange:(value)=>{
                    if(value == 1){
                      // 添加
                      this.routeType = 'add'
                      this.openPop(params.row)
                    }else if(value == 2){
                      // 编辑
                      this.routeType = 'edit'
                      this.openPop(params.row)
                    }else if(value == 3){
                      // 删除
                      this.mode = "delete";
                      this.sucessMsg = "删除成功！";
                      this.content = "确定删除？";
                      this.$refs.confirmModel.confirm("/merchant/delete/" + params.row.id);
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
        hannleItems: [
          {
            title: '添加',
            icon: 'md-add',
            callback: () => {
              this.formShow = true
              this.formItems.forEach(item=>{
                item.type=item.type.replace(/(Text)$/,'')
              });
              // 请求接口
              this.formUrl = '/privilege/add'
              this.routeType = 'add'
              this.formTitle = '添加'
            }
          }
        ],
        mode: "",
        content: "",
        sucessMsg: "",

        formTitle:"添加权限",
        formShow: false,
        formItems: [
          {
            title: '名称',
            name: 'privilegeName',
            type: 'input',
            rules: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }]
          },
          {
            title: '碓一编码',
            name: 'privilegeMark',
            type: 'input',
            rules: [{ required: true, message: '请输入碓一编码', trigger: 'blur' }]
          },
          {
            title: '前端URL',
            name: 'privilegeUrl',
            type: 'input',
            // rules: [{ required: true, message: '请选择商户来源', trigger: 'change' }]
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
            // rules: [{ required: true, message: '请选择商户来源', trigger: 'change' }]
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
            rules: [{ required: true, message: '请输入排序', trigger: 'blur' }]
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
      this.getMemuList()
    },
    methods: {
      renderContent (h, { root, node, data }) {
        return h('span', {
          style: {
            display: 'inline-block',
            width: '100%'
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
          h('span', {
            style: {
              display: 'inline-block',
              float: 'right',
              marginRight: '32px'
            }
          }, [
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'ios-add'
              }),
              style: {
                marginRight: '8px'
              },
              on: {
                click: () => { this.append(data) }
              }
            }),
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'ios-remove'
              }),
              on: {
                click: () => { this.remove(root, node, data) }
              }
            })
          ])
        ]);
      },
      append (data) {
        const children = data.children || [];
        children.push({
          title: 'appended node',
          expand: true
        });
        this.$set(data, 'children', children);
      },
      remove (root, node, data) {
        const parentKey = root.find(el => el === node).parent;
        const parent = root.find(el => el.nodeKey === parentKey).node;
        const index = parent.children.indexOf(data);
        parent.children.splice(index, 1);
      },

      beforeSave(params){
        params.privilegeParent = 0
        if(this.selectedMenu){
          if(this.routeType == 'add'){
            params.privilegeParent = this.selectedMenu.id
          }
          // else{
          //   params.privilegeParent = this.selectedMenu.privilegeParent
          // }
        }

      },
      // 获取菜单列表
      getMemuList(){
        let url = '/privilege/grid'
        this.apiGet(url,{},this.apiPrefix).then(res=>{
          if(res.success){
            // 格式化返回数据
            this.formateMenuList(res.data)
          }else{
            this.$Message.warning(res.message)
          }
        })
      },
      // 格式化数据
      formateMenuList(list){
        // 转为一维数组
        let menulist = []
        list.forEach(ele=>{
          let level1 = {...ele}
          delete level1.items
          menulist.push(level1)
          if(ele.items && ele.items.length){
            ele.items.forEach(sele=>{
              let level2 = {...sele}
              delete level2.items
              menulist.push(level2)
              if(sele.items&&sele.items.length){
                sele.items.forEach(ssele=>{
                  let level3 = {...ssele}
                  delete level3.items
                  menulist.push(level3)
                })
              }
            })
          }
        })
        this.menuList = menulist
      },
      // 打开弹框
      openPop(item){
        this.selectedMenu = item
        this.formShow = true
        this.formItems.forEach(item=>{
          item.value=''
        });
        if(this.routeType == 'edit'){
          this.formTitle = '修改'
          this.setDetail(item)
        }else if(this.routeType == 'add'){
          this.formItems.forEach(ele=>{
            // 设置层级
            if(ele.name == 'privilegeLevel'){
              if(item){
                ele.value = Number(item.privilegeLevel)+1
              }else{
                ele.value = 1
              }
              ele.value+=''
            }
            ele.value = item[ele.name]
          });
          this.formTitle = '添加'
        }
      },
      // 设置详情页
      setDetail(item){
        this.formItems.forEach(ele=>{
          ele.value = item[ele.name]
        });
      }
    }
  }
</script>
