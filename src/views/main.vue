<template>
  <div class="layout">
    <!-- {{firstRouter}} -->
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark" :active-name="firstRouter" @on-select="changeTab">
          <div @click="goHome" class="layout-logo">
             <!--<img class="logo-img" src="./../assets/images/index-logo.png" alt>-->
             <span class="logo-img">支付中心{{envName}}</span>
          </div>

          <div class="layout-userinfo">

            <Dropdown>
              <span class="userinfo"><img src="../assets/images/touxiang.png" alt=""></span>
              <span class="userinfo">{{userName}}</span>
              <!-- <Icon type="arrow-down-b"></Icon> -->
              <Icon type="md-arrow-dropdown"/>
              <DropdownMenu slot="list">
                <!--<DropdownItem><span @click="info">个人信息</span></DropdownItem>-->
                <!--<DropdownItem>修改密码</DropdownItem>-->
                <!--<DropdownItem>-->
                  <!--<div class="down-item-handle" @click="lookingKey">查看密钥</div>-->
                <!--</DropdownItem>-->
                <!--<DropdownItem class="down-item">-->
                  <!--<div class="down-item-handle" @click="updateCorp">企业信息</div>-->
                <!--</DropdownItem>-->
                <DropdownItem class="down-item">
                  <div class="down-item-handle" @click="logout">退出</div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div class="layout-nav">
            <MenuItem v-for="item in menuList" :key="item.id" :name="item.privilegeMark">
              {{item.privilegeName}}
            </MenuItem>
          </div>
        </Menu>
      </Header>
      <Modal v-model="showKey" title="查看密钥" width="800">
        <Form :model="user" :label-width="200" label-position="right">
          <FormItem label="中台appId:">
            <div class="wordBreak">{{user.appId}}</div>
          </FormItem>
          <FormItem label="中台公钥（appPublicKey）:">
            <div class="wordBreak">{{user.appPublicKey}}</div>
          </FormItem>
          <FormItem label="中台私钥（appSecretKey）:">
            <div class="wordBreak">{{user.appSecretKey}}</div>
          </FormItem>
        </Form>
      </Modal>
      <Modal v-model="showCorp" title="企业信息" width="700">
        <Form :model="formItem" :label-width="120" ref="formItem" :rules="ruleForm" label-position="right">
          <FormItem label="企业名称：" prop="corpName">
            <Input v-model="formItem.corpName" :maxlength="64" style="width:80%;"></Input>
          </FormItem>
          <FormItem label="电话:" prop="phone">
            <Input v-model="formItem.phone" style="width:80%;"></Input>
          </FormItem>
          <FormItem label="邮箱:" prop="email">
            <Input v-model="formItem.email" style="width:80%;"></Input>
          </FormItem>
          <FormItem label="logo:" prop="logo">
            <my-img :limitNum="1" v-model="formItem.logo"></my-img>
          </FormItem>
          <FormItem label="地址:" prop="address">
            <Input v-model="formItem.address" :maxlength="100" style="width:80%;"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="saveCorp">提交</Button>
            <Button @click="test">取消</Button>
          </FormItem>
        </Form>
        <div slot="footer"></div>
      </Modal>
      <Layout :style="{'height':contentheight}">
        <Sider hide-trigger class="page-left">
          <Menu ref="contactMenu"
                :active-name="$route.path"
                theme="light"
                width="auto"
                :accordion="true"
                :open-names="vexOpenNames?[vexOpenNames]:openNames"
                @on-select="changeMenu">
            <template v-for="item in subMenuList.items">
              <!--如果存在3级菜单-->
              <Submenu :name="item.privilegeMark"
                       v-if="item.items && item.items.length">
                <template slot="title">
                  <!-- <Icon type="ios-navigate"></Icon> -->
                  {{item.privilegeName}}
                </template>
                <MenuItem v-for="sitem in item.items"
                          :name="'/'+firstRouter+'/'+item.privilegeMark+'/'+sitem.privilegeMark"
                          :key="sitem.id"
                          v-if="sitem.privilegeMenuType=='1'">
                  <span>{{sitem.privilegeName}}</span>
                </MenuItem>
              </Submenu>
              <!--如果存在2级菜单-->
              <MenuItem :name="'/'+firstRouter+'/'+item.privilegeMark"
                        v-if="(!item.items || item.items.length== 0) && item.privilegeMenuType == '1'">
                <span>{{item.privilegeName}}</span>
              </MenuItem>
            </template>
          </Menu>
        </Sider>
        <Layout id="content">
          <Breadcrumb class="breadcrumb">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem v-for="(item,index) in breadcrumbList" :key="index">{{item}}</BreadcrumbItem>
          </Breadcrumb>
          <Content class="content" :style="{'padding-bottom':padding}">
            <div class="content-bg" :style="{'height':bgheight}">
              <router-view></router-view>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>
<script>
  // 引入全局组件
  import '@/common/globalComponents'
  import store from "@/store";
  import myImg from "@/components/global/uploadFile";

  export default {
    components: {myImg},
    data() {
      return {
        envName:'',
        showCorp: false,
        formItem: {
          corpName: "",
          phone: "",
          email: "",
          logo: "",
          address: ""
        },
        ruleForm: {
          corpName: [
            {required: true, message: "请填写企业名称", trigger: "blur"}
          ],
          phone: [
            {required: true, message: "请填写电话", trigger: "blur"},
            {
              validator: this.common.validate.phone,
              message: "号码格式不正确"
            }
          ],
          email: [
            {required: true, message: "请填写邮箱", trigger: "blur"},
            {
              validator: this.common.validate.email,
              message: "号码格式不正确"
            },
            {max: 64, message: "邮箱地址不超过64字符", trigger: 'blur'}
          ],
          logo: [{required: true, message: "请选择图片", trigger: "blur"}],
          address: [{required: true, message: "请填写地址", trigger: "blur"}]
        },
        show: false,
        imgUrl: "",
        showKey: false,
        user: {
          appId: "",
          appPublicKey: "",
          appSecretKey: ""
        },
        subMenuList: [],
        openNames: "",
        activeName: "",
        padding: "",
        bgheight: "",
        contentheight:''
        // firstRouter:this.$store.state.menu.activeName
        // breadcrumbList:this.$store.state.menu.breadcrumbList
      };
    },
    // beforeRouteUpdate (to, from, next) {
    //   // 在当前路由改变，但是该组件被复用时调用
    //   // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    //   // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    //   // 可以访问组件实例 `this`
    //   // next()
    // },
    created() {
      // console.log( navigator.userAgent.toLowerCase())
      //firefox
      // var agent = navigator.userAgent.toLowerCase();
      // if (agent.indexOf("firefox") > 0 || agent.indexOf("ie")>0) {
      //   this.padding = "80px";
      // }
      // 获取环境名
      this.getEnvName()
    },
    updated() {
      // this.$store.dispatch("getCurrentUser", {
      //   url: "/manage/admin/getCurrentUser"
      // });
    },
    store,
    computed: {
      userName() {
        return this.$store.state.user.userName||this.$store.state.userId;
      },
      vexOpenNames() {
        return this.$store.state.menu.openName;
      },
      firstRouter() {
        return this.$store.state.menu.activeName;
      },
      menuList() {
        return this.$store.state.menu.menuList;
      },
      breadcrumbList() {
        return this.$store.state.menu.breadcrumbList;
        // return this.$route.meta.breadcrumbList;
      },
    },
    watch: {
      // breadcrumbList: {
      //   handler(newValue, oldValue) {
      //     console.log(newValue)
      //     this.breadcrumbList = [...this.$store.state.menu.breadcrumbList];
      //   },
      //   deep: true,
      //   immediate: true
      // },
      vexOpenNames(newValue) {
        // this.openName = [newValue]
        this.$nextTick(() => {
          this.$refs.contactMenu.updateOpened();
          this.$refs.contactMenu.updateActiveName();
        });
      },
      firstRouter(newValue, oldValue) {
        // this.$store.state.menu.menuList.data.forEach(element => {
        //   if (element.privilegeMark === newValue) {
        //     this.subMenuList = element;
        //   }
        // });
      },
    },
    mounted() {
      this.loadpage();
      this.contentheight = (window.innerHeight - 80)+ "px"
      // this.bgheight = window.innerHeight + "px";
    },
    methods: {
      // 获取环境名
      getEnvName(){
        if(this.common.config.env=='test'){
          this.envName = '(测试)'
        }else if(this.common.config.env=='pre'){
          this.envName = '(预发)'
        }else if(this.common.config.env=='production'){
          this.envName = ''
        }if(this.common.config.env=='dev'){
          this.envName = '(开发)'
        }
      },
      domainURI(str) {
        var durl = /http:\/\/([^\/]+)\//i;
        domain = str.match(durl);
        return domain[1];
      },
      lookingKey() {
        this.apiGet("/manage/admin/getUserByUserId").then(res => {
          this.showKey = true;
          if (res.status == 200) {
            this.user = res.user;
          }
        });
      },
      logout() {
        this.$cookies.remove("userId");
        this.$cookies.remove("token");
        window.location.href = "";
        // apiGet("/manage/admin/logout").then(res => {
        //   if (res.status == 200) {
        //     this.$cookies.remove("userId");
        //     this.$cookies.remove("pmsToken");
        //     window.location.href = "";
        //   }
        // });
      },
      updateCorp() {
        this.showCorp = true;
        this.apiGet("/manage/admin/getCurrentCorp").then(res => {
          if (res.status == 200) {
            this.formItem = res.data;
            (this.formItem.corpName = res.data.corpName),
              (this.formItem.phone = res.data.phone),
              (this.formItem.email = res.data.email),
              (this.formItem.logo = res.data.logo),
              (this.formItem.address = res.data.address);
          }
        });
      },
      saveCorp() {
        let _this = this;
        this.$refs.formItem.validate(vaild => {
          if (vaild) {
            this.apiPost("/manage/admin/updateCorp", this.formItem).then(res => {
              if (res.status == 200) {
                _this.$Message.success("修改成功！");
                _this.showCorp = false;
              } else {
                _this.$Message.warning(res.message);
              }
            });
          }
        });
      },
      test() {
        this.showCorp = false;
        this.$refs.formItem.resetFields();
      },
      changeMenu(active) {
        // this.$emit("on-change", active);
        this.$router.push(active);
          // this.subMenuList.items.forEach(element => {
          //   // 如果存在3级菜单
          //   if(element.items){
          //     element.items.forEach(item => {
          //       if (item.privilegeMark === active) {
          //         this.$cookies.set("openName", element.privilegeMark);
          //       }
          //     });
          //   }else{
          //     // 如果存在2级菜单
          //     if(element.privilegeMark == active){
          //       this.$cookies.set("openName", element.privilegeMark);
          //     }
          //   }
          // });
      },
      changeTab(active) {
        this.menuPosite(active);
        // this.$cookies.set("activeName", active);
        let path = ''
        let params = ''
        if(this.subMenuList.items[0].items && this.subMenuList.items[0].items.length){
          // 如果存在3级菜单
          let urlArr = this.subMenuList.items[0].items[0].privilegeUrl.split("/:")
          path = urlArr[0]
          params = urlArr[1]? '/'+urlArr[1]:''
          this.openNames = [this.subMenuList.items[0].privilegeMark];
        }else{
          // 如果存在2级菜单
          this.openNames = [this.subMenuList.items[0].privilegeMark];
          let urlArr = this.subMenuList.items[0].privilegeUrl.split("/:")
          path = urlArr[0]
          params = urlArr[1]? '/'+urlArr[1]:''
        }
        this.$router.push(path+params);

        this.$nextTick(() => {
          this.$refs.contactMenu.updateOpened();
          this.$refs.contactMenu.updateActiveName();
        });
        // console.log(this.$store.state.menu.breadcrumbList)
      },
      async loadpage() {
        this.openNames = [this.$route.meta.openName];
        this.menuPosite(this.$route.meta.belongTab);
        this.$nextTick(() => {
          this.$refs.contactMenu.updateOpened();
          this.$refs.contactMenu.updateActiveName();
        });
      },
      menuPosite(active) {
        this.$store.state.menu.menuList.forEach(element => {
          if (element.privilegeMark === active) {
            this.subMenuList = element;
          }
        });
      },
      goHome() {
        //   window.location.href = 'http://testwww.lotsmall.cn/admin/index#/distmarket/market/index'
      }
    }
  };
</script>

<style>
  /*@import "../assets/styles/main.css";*/
  @import url("../assets/styles/main.css");
</style>

<style scoped>
  #content {
  }

  .down-item {
    padding: 0px;
    height: 30px;
    line-height: 30px;
  }

  .down-item.down-item-handle {
    display: inline-block;
  }

  .save-cancel {
    padding-bottom: 50px;
  }

  .layout {
    background: #f5f7f9;
    position: relative;
    overflow: hidden;
    height: 100%;
  }

  .layout-logo {
    width: 150px;
    height: 64px;
    float: left;
    text-align: left;
  }

  .layout-logo .logo-img {
    /*width: 130px;*/
    /*height: 28px;*/
    vertical-align: middle;
    color: #fff;
    font-size: 21px;
    /*float: left;*/
  }

  .breadcrumb {
    padding: 12px;
    text-align: left;
  }

  .page-left {
    background-color: #ededed;
    height: 100%;
  }
  .ivu-menu-light{
    background-color: #ededed;
  }
  .layout-userinfo {
    float: right;
    color: #ffffff;
    font-size: 20px;
  }

  .layout-userinfo .userinfo {
    font-size: 15px;
  }

  .layout-userinfo .userinfo img {
    vertical-align: middle;
  }

  .wordBreak {
    word-break: break-all;
  }

  .content {
    background-color: #fff;
  }

  .content .content-bg {
    padding: 20px;
    background-color: #fff !important;
  }
</style>
