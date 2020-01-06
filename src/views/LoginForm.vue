<template>
  <div class="login-main">
    <h3 class="login-title">后台管理系统</h3>
    <Form ref="formInline" :model="formInline" :rules="ruleInline" class="login-from">
      <FormItem prop="phone">
        <Input type="text" v-model="formInline.phone" placeholder="用户名">
          <Icon type="ios-person-outline" slot="prepend"/>
        </Input>
      </FormItem>
      <FormItem prop="accPwd">
        <Input type="password" v-model="formInline.accPwd" placeholder="密码">
          <Icon type="ios-lock-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="verifyCode">
        <Row>
          <Col span="9">
            <Input type="text" v-model="formInline.verifyCode" placeholder="验证码"></Input>
          </Col>
          <Col span="9">
            <img :src=codeImg @click="getCode" class="code-img">
          </Col>
          <Col span="6">
            <a @click="getCode" href='javascript:;'>换一换</a>
          </Col>
        </Row>
      </FormItem>
      <!--<FormItem label="用户状态"-->
                <!--prop="accStatus"-->
                <!--:rules="accStatusRule">-->
        <!--<Select v-model="formInline.accSt"-->
                <!--style="width:200px">-->
          <!--<Option value="T">正常</Option>-->
          <!--<Option value="F">锁定</Option>-->
        <!--</Select>-->
      <!--</FormItem>-->
      <FormItem>
        <Button type="primary" long @click="handleSubmit()">登录</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
  // 引入全局组件
  import '@/common/globalComponents'
  import {getters, actions} from "vuex";
  import store from "@/store";

  export default {
    data() {
      return {
        apiPrefix:this.common.config.apiUser,
        formInline: {
          appId:'payCenterAdmin',
          phone: "",
          accPwd: "",
          verifyCode: "",
          verifyCodeKey:"",
          // accStatus:""
        },
        codeImg: "",
        ruleInline: {
          phone: [
            {required: true, message: "请填写用户名", trigger: "blur"}
          ],
          accPwd: [
            {required: true, message: "请填写密码", trigger: "blur"},
            {
              type: "string",
              min: 6,
              message: "密码长度不能小于6位",
              trigger: "blur"
            }
          ],
          verifyCode: [
            {required: true, message: "请填写验证码", trigger: "blur"}
          ],
        },
        // accStatusRule: [{ required: true, message: '请选择用户状态', trigger: 'change' }]
      };
    },
    store,
    beforeCreate() {
      document.getElementsByTagName("body")[0].className = "login-bg";
    },
    beforeDestroy() {
      document.body.removeAttribute("class", "add_bg");
    },
    mounted() {
      this.getCode();
    },
    created() {
      //   this.$cookies.set("pmsToken", "testToken123456");
      // 绑定enter键盘事件
      document.onkeydown = (e) => {
        if (window.event.keyCode == 13) {
          this.handleSubmit();
        }
      }
    },
    methods: {
      // ...actions([
      //   'setUserIdAction'
      // ]),
      getCode() {
        this.formInline.verifyCodeKey = new Date().getTime()
        this.codeImg = this.apiPrefix+"/verifyCode?verifyCodeKey=" + this.formInline.verifyCodeKey;
        //   this.codeImg = "/verifyCode";
      },
      handleSubmit() {
        this.$refs.formInline.validate(async valid => {
          if (valid) {
            // this.$Message.success('提交成功!')
            let url = "/login";
            let params = this.formInline;
            params.phone = params.phone.replace(/(^\s*)|(\s*$)/g, "")
            params.accPwd = params.accPwd.replace(/(^\s*)|(\s*$)/g, "")
            let apiPrefix = this.apiPrefix
            let res = await this.$store.dispatch("login", {url, params,apiPrefix});
            // 更新验证码
            this.getCode();
            if (res.success) {
              // 缓存权限
              sessionStorage.setItem('privilegeList',JSON.stringify(res.data.privilegeList||[]))
              //sesstionstorage缓存登录用户token，vuex中缓存userId，用户后续路由beforeEach中判断也是是刷新还是只是路由变化
              this.$cookies.set("token", res.data.token);
              this.$cookies.set("userId", res.data.phone);
              this.$store.dispatch("setUserIdAction", res.data.phone);

              // await this.$store.dispatch("formaterRouterHandle") //根据权限获取路由
              this.$store.commit("mainChildren"); // 根据权限获取路由
              this.$router.addRoutes([
                {
                  path: "/main",
                  name: "main",
                  component: resolve => {
                    require(['@/views/main.vue'], resolve)
                  },
                  children: [...this.$store.state.menu.asyncRouter]
                }
              ]); // 动态加载路由
              // this.formaterRouterHandle()
              this.$router.push(this.$store.state.menu.asyncRouter[0].path);
            } else {
              this.$Message.error(res.message || '登陆失败');
            }
          }
        });
      }
    }
  };
</script>
<style>
  @import "../assets/styles/login.css";
</style>
