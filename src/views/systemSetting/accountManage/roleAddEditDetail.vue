<template>
  <div>
    <formList :formItems="formList"
              :routeType="routeType"
              :url="formListUrl"
              :apiPrefix="apiPrefix"
              ref="formList"
              @beforeSave="beforeSave">
      <div>
        <FormItem
          label-position="right"
          :label-width="150"
          label="选择权限："
          prop="privilegeIds"
          :rules="{required: true, message: '请选择权限', trigger: 'change'}">
          <div style="border: 1px solid #dcdee2;padding:0 20px;border-radius: 5px">
            <Tree :data="menuTree"
                  :show-checkbox="showCheckbox"
                  @on-check-change="onCheckChange"></Tree>
            <!--输入框单个验证-->
            <Input v-model="privilegeIds" style="display: none"></Input>
          </div>
        </FormItem>
      </div>
    </formList>
  </div>
</template>

<script>
  import formList from "@/components/global/formList";

  export default {
    components: {formList},
    data() {
      return {
        detail:{},
        apiPrefix:this.common.config.apiUser,
        privilegeIds:'',
        formListUrl: "/role/add",
        formList: [
          {
            title: '角色名称',
            name: 'roleName',
            type: 'input',
            rules: [
              {required: true, message: '请输入角色名称', trigger: 'blur'},
              {max: 10, message: "请输入10字以内的角色名称", trigger: 'blur'}
            ]
          },
          {
            title: '角色说明',
            name: 'remark',
            type: 'textarea',
            rules: [
              {max: 50, message: "请输入50字以内的说明", trigger: 'blur'}
            ]
          },
          // {
          //   title: '选择权限',
          //   name: 'privilegeIds',
          //   type: 'input',
          //   rules: [
          //     {required: true, message: '请输入角色名称', trigger: 'blur'},
          //     {max: 10, message: "请输入10字以内的角色名称", trigger: 'blur'}
          //   ],
          //   value:''
          // }
        ],
        menuTree: [],
        routeType: "",// 判断是新增，详情，编辑
        showCheckbox:true,
      }
    },
    watch: {},
    created() {
      // 如果是编辑，详情
      this.getDetail()
    },
    mounted(){

    },
    methods: {
      // 确认保存之前
      beforeSave(formItem) {
        if (this.$route.query.id) {
          formItem.roleId = this.$route.query.id
        }
      },
      getDetail(){
        if (this.$route.query.id) {
          let id = this.$route.query.id
          this.routeType = this.$route.query.routeType
          let url = '/role/detail'
          this.apiGet(url,{id},this.apiPrefix).then(res=>{
            if(res.success){
              // 格式化返回数据
              this.detail = res.data
              // 设置权限
              // if(){
              //   this.
              // }
              this.formList.forEach(ele=>{
                ele.value = this.detail[ele.name]
                if (this.routeType == 'detail') {
                  // 如果是详情页
                  ele.type+='Text'
                  // 更新位置占位符
                  this.$store.dispatch('setBreadcrumbListAction', ['账号管理', '角色详情'])
                } else {
                  // 如果是编辑
                  this.formListUrl = '/role/update'
                  // 更新位置占位符
                  this.$store.dispatch('setBreadcrumbListAction', ['账号管理', '编辑角色'])
                }
              })
              // 如果是详情页
              if(this.routeType == 'detail'){
                this.showCheckbox = false
                this.menuTree = this.formateMenuTree(this.detail.privilegeInfos)
              }else{
                this.getMenuList()
              }
            }else{
              this.$Message.warning(res.message)
            }
          })
        }else{
          this.getMenuList()
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
            if(this.detail.privilegeIds && this.detail.privilegeIds.includes(ele.id)){
              tree.checked = true
            }
            if(ele.items && ele.items.length){
              this.formateMenuTree(ele.items,tree.children)
            }
            menuTree.push(tree)
          })
        }
        return menuTree
      },
      onCheckChange(select){
        console.log(select)
        let privilegeIds = []
        if(select.length){
          select.forEach(ele=>{
            privilegeIds.push(ele.row.id)
          })
          this.privilegeIds = privilegeIds.join(',')
        }else{
          this.privilegeIds = ''
        }
        this.$refs.formList.setFormItem('privilegeIds',this.privilegeIds)
      },
    }
  }
</script>

<style lang="scss">

</style>
