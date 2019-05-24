<template>
  <div class="layout">
    <!-- {{testName}} -->
    <Layout>
      <Header>
        <Menu mode="horizontal" :active-name="testName" @on-select="changeTab">
          <div @click="goHome" class="layout-logo">
            <!-- <img v-if='imgUrl' :src="imgUrl" alt> -->
            <!-- <img src="./../assets/images/index-logo.png" alt> -->
          </div>

          <div class="layout-userinfo">

            <Dropdown>
              <span class="userinfo"><img src="./../assets/images/touxiang.png" alt=""></span>
              <span class="userinfo">{{userName}}</span>
              <!-- <Icon type="arrow-down-b"></Icon> -->
              <Icon type="md-arrow-dropdown"/>
              <DropdownMenu slot="list">
                <!-- <DropdownItem><span @click="info">个人信息</span></DropdownItem>
<DropdownItem>修改密码</DropdownItem>-->
                <DropdownItem>
                  <div class="down-item-handle" @click="lookingKey">查看密钥</div>
                </DropdownItem>
                <DropdownItem class="down-item">
                  <div class="down-item-handle" @click="updateCorp">企业信息</div>
                </DropdownItem>
                <DropdownItem class="down-item">
                  <div class="down-item-handle" @click="logout">退出</div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div class="layout-nav">
            <MenuItem v-for="item in menuList.data" :key="item.id" :name="item.funCode">
              {{item.funName}}
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
      <Layout>
        <Sider hide-trigger class="page-left" :class="{houseShow:$route.path==='/houseStatus'}">
          <Menu ref="contactMenu"
                :active-name="$route.name"
                theme="light"
                width="auto"
                :accordion="true"
                :open-names="vexOpenNames?[vexOpenNames]:openNames"
                @on-select="changeMenu">
            <Submenu v-for="item in subMenuList.list" :name="item.funCode" :key="item.id">
              <template slot="title">
                <!-- <Icon type="ios-navigate"></Icon> -->
                {{item.funName}}
              </template>
              <MenuItem v-for="sitem in item.list" :name="sitem.funCode" :key="sitem.id" v-if="sitem.functionType=='column'">
                <span>{{sitem.funName}}</span>
              </MenuItem>
            </Submenu>
          </Menu>
        </Sider>
        <Layout id="content">
          <Breadcrumb class="breadcrumb">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem v-for="(item,index) in breadcrumbList" :key="index">{{item}}</BreadcrumbItem>
          </Breadcrumb>
          <Content class="content" :style="{'padding-bottom':padding}" :class="{delPad:$route.path==='/houseStatus'}">
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
  import store from "@/store";
  import {apiGet, apiPost} from "@/fetch/api";
  import myImg from "@/components/global/uploadFile";

  export default {
    components: {myImg},
    data() {
      return {
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
            }
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
        // testName:this.$store.state.menu.activeName
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
      function domainURI(str) {
        var durl = /http:\/\/([^\/]+)\//i;
        domain = str.match(durl);
        return domain[1];
      }

      let domain = domainURI(document.location.href);
      // apiGet(
      //   "/manage/admin/admin/service/userLoginConfig/getLogo?domain=" + domain
      // ).then(res => {
      //   if (res.message) {
      //     this.imgUrl = res.message;
      //   }
      //   this.show = true;
      // });
      // this.$store.dispatch("getCurrentUser", {
      //   url: "/manage/admin/getCurrentUser"
      // });
      //firefox
      var agent = navigator.userAgent.toLowerCase();
      if (agent.indexOf("firefox") > 0) {
        this.padding = "80px";
      }
    },
    updated() {
      // this.$store.dispatch("getCurrentUser", {
      //   url: "/manage/admin/getCurrentUser"
      // });
    },
    store,
    computed: {
      userName() {
        return this.$store.state.user.userName;
      },
      vexOpenNames() {
        return this.$store.state.menu.openName;
      },
      testName() {
        return this.$store.state.menu.activeName;
      },
      menuList() {
        return this.$store.state.menu.menuList;
      },
      breadcrumbList() {
        return this.$store.state.menu.breadcrumbList;
        // return this.$route.meta.breadcrumbList;
      }
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
      testName(newValue, oldValue) {
        // this.$store.state.menu.menuList.data.forEach(element => {
        //   if (element.funCode === newValue) {
        //     this.subMenuList = element;
        //   }
        // });
      },
    },
    mounted() {
      this.loadpage();
      // this.bgheight = window.innerHeight + "px";
    },
    methods: {
      lookingKey() {
        apiGet("/manage/admin/getUserByUserId").then(res => {
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
        apiGet("/manage/admin/getCurrentCorp").then(res => {
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
            apiPost("/manage/admin/updateCorp", this.formItem).then(res => {
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
        if (active === "aa890897878") {
          // 如果点击店铺设置 - 全员营销 跳转 全员营销 全员配置
          active = "peizhi";
        }
        // this.$emit("on-change", active);
        this.$router.push("/" + active);
        this.subMenuList.list.forEach(element => {
          element.list.forEach(item => {
            if (item.funCode === active) {
              this.$cookies.set("openName", element.funCode);
            }
          });
        });
      },
      changeTab(active) {
        this.menuPosite(active);
        this.$cookies.set("activeName", active);
        this.openNames = [this.subMenuList.list[0].funCode];
        this.$router.push("/" + this.subMenuList.list[0].list[0].funCode);
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
        this.$store.state.menu.menuList.data.forEach(element => {
          if (element.funCode === active) {
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
    width: 199px;
    height: 60px;
    background-color: #e5eaee;
    /* height: 30px; */
    /* background: #5b6270; */
    /* border-radius: 3px; */
    float: left;
    /* position: relative;
    top: 15px;
    left: 20px; */
  }

  .page-left {
    background-color: #fff;
  }

  .layout-logo img {
    width: 130px;
    height: 28px;
    float: left;
  }

  .layout-nav {
    margin: 0 auto;
    margin-right: 50px;
    float: right;
  }

  .layout-nav .ivu-menu-item {
    color: #fff;
  }

  .ivu-menu {
    color: #999ca1 !important;
  }

  .ivu-menu-item-selected {
    background-color: #398ee5;
    /* background-color: #D9ECFF; */
  }

  .breadcrumb {
    padding: 12px;
    text-align: left;
  }

  .page-left {
    background-color: #fff;
    height: 100%;
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

  .ivu-icon-chevron-down {
    color: #ffffff;
    padding: 14px;
    padding: 23px 14px;
  }

  .ivu-icon-chevron-down:hover {
    background: rgba(250, 250, 250, 0.2);
  }

  .ivu-layout-header {
    height: 60px !important;
    line-height: 60px !important;
    background-color: #409eff !important;
  }

  .ivu-menu-horizontal {
    height: 0;
    line-height: 60px !important;
    background-color: #409eff !important;
    color: #fff !important;
  }

  .ivu-menu-light.ivu-menu-horizontal .ivu-menu-item-active,
  .ivu-menu-light.ivu-menu-horizontal .ivu-menu-item:hover,
  .ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu-active,
  .ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu:hover {
    color: #fff !important;
    border-bottom: 0 !important;
  }

  .ivu-layout-header {
    padding-left: 0px;
  }

  .wordBreak {
    word-break: break-all;
  }

  .content {
    background-color: #eff3f9;
  }

  .content .content-bg {
    padding: 20px;
    background-color: #fff !important;
  }

  .page-left > .ivu-layout-sider-children {
    background-color: #fff !important;
    border: 0 !important;
  }

  .ivu-page-item-jump-next,
  .ivu-page-item-jump-prev,
  .ivu-page-next,
  .ivu-page-prev {
    border-radius: 0 !important;
  }

  .ivu-table-wrapper {
    border: none !important;
  }

  .houseShow {
    display: none;
  }

  .delPad {
    padding: 0;
  }
</style>
